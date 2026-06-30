import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppSelector } from '../../store';
import { API_URLS } from '../../constants/api';
import type { ImageType } from './EditImageModal';
import { EditImageModal } from './EditImageModal';
import { UploadModal } from './UploadModal';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface SortableImageItemProps {
  image: ImageType;
  onEdit: (image: ImageType) => void;
  onDelete: (id: string) => void;
}

const SortableImageItem: React.FC<SortableImageItemProps> = ({ image, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 0,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} className="img-card">
      {/* Drag handle */}
      <div className="img-drag-handle" {...attributes} {...listeners} title="Drag to reorder">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/>
          <circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/>
          <circle cx="9" cy="19" r="2"/><circle cx="15" cy="19" r="2"/>
        </svg>
      </div>

      {/* Image */}
      <div className="img-thumbnail-wrapper">
        <img src={image.imageUrl} alt={image.title} className="img-thumbnail" />
        <div className="img-overlay">
          <button className="img-action-btn edit" onClick={() => onEdit(image)} title="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button className="img-action-btn delete" onClick={() => onDelete(image.id)} title="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="img-card-footer">
        <p className="img-title">{image.title}</p>
      </div>
    </div>
  );
};

export const ImageGallery = () => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editImage, setEditImage] = useState<ImageType | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { user } = useAppSelector((state) => state.auth);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}${API_URLS.GET_IMAGES}`, {
        params: { userId: user?.id },
        withCredentials: true,
      });
      const sortedImages = (response.data.data || []).sort((a: ImageType, b: ImageType) => a.order - b.order);
      setImages(sortedImages);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to fetch images');
      } else {
        setError('Failed to fetch images');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchImages();
  }, [user]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      const newImagesOrder = arrayMove(images, oldIndex, newIndex);
      setImages(newImagesOrder);
      setSaveStatus('saving');
      try {
        const reorderItems = newImagesOrder.map((img, index) => ({ id: img.id, order: index }));
        await axios.patch(
          `${API_BASE_URL}${API_URLS.REORDER_IMAGES}`,
          { items: reorderItems, userId: user?.id },
          { withCredentials: true }
        );
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch {
        setSaveStatus('idle');
      }
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_BASE_URL}${API_URLS.DELETE_IMAGE(deleteId)}`, {
        data: { userId: user?.id },
        withCredentials: true,
      });
      setImages(images.filter((img) => img.id !== deleteId));
      toast.success('Image deleted successfully!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Failed to delete image');
      } else {
        toast.error('Failed to delete image');
      }
    } finally {
      setDeleteId(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="gallery-spinner" />
        <p>Loading your gallery…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-error">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>{error}</p>
        <button className="gallery-retry-btn" onClick={fetchImages}>Retry</button>
      </div>
    );
  }

  return (
    <div className="gallery-root">
      {/* Header */}
      <div className="gallery-header">
        <div>
          <h2 className="gallery-heading">Your Gallery</h2>
          <p className="gallery-subheading">
            {images.length} image{images.length !== 1 ? 's' : ''} · drag to reorder
          </p>
        </div>
        <div className="gallery-header-actions">
          {saveStatus === 'saving' && <span className="save-badge saving">Saving order…</span>}
          {saveStatus === 'saved' && <span className="save-badge saved">✓ Order saved</span>}
          <button className="btn-upload" onClick={() => setIsUploadModalOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Upload Images
          </button>
        </div>
      </div>

      {/* Grid */}
      {images.length === 0 ? (
        <div className="gallery-empty">
          <div className="gallery-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <h3>No images yet</h3>
          <p>Upload your first image to get started</p>
          <button className="btn-upload" onClick={() => setIsUploadModalOpen(true)}>
            Upload Images
          </button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
            <div className="img-grid">
              {images.map((image) => (
                <SortableImageItem
                  key={image.id}
                  image={image}
                  onEdit={setEditImage}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-backdrop" onClick={() => setDeleteId(null)}>
          <div className="modal-panel modal-panel--sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Delete Image</h2>
                <p className="modal-subtitle">This action cannot be undone.</p>
              </div>
            </div>
            <div className="modal-footer" style={{ borderTop: 'none', marginTop: '1rem' }}>
              <button className="modal-btn secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="modal-btn" style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)' }} onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={fetchImages}
      />
      <EditImageModal
        isOpen={!!editImage}
        onClose={() => setEditImage(null)}
        image={editImage}
        onEditSuccess={fetchImages}
      />
    </div>
  );
};
