import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAppSelector } from '../../store';
import { API_URLS } from '../../constants/api';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface ImageType {
  id: string;
  title: string;
  imageUrl: string;
  order: number;
}

interface EditImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  image: ImageType | null;
}

export const EditImageModal: React.FC<EditImageModalProps> = ({ isOpen, onClose, onEditSuccess, image }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (image) { setTitle(image.title); setFile(null); setError(null); }
  }, [image]);

  if (!isOpen || !image) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
    if (!title.trim()) { toast.error('Title is required.'); return; }
    setIsUpdating(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      if (file) formData.append('image', file);
      if (user?.id) formData.append('userId', user.id);
      await axios.put(`${API_BASE_URL}${API_URLS.UPDATE_IMAGE(image.id)}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      toast.success('Image updated successfully!');
      onEditSuccess();
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Failed to update image.');
      } else {
        toast.error('Failed to update image.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const previewSrc = file ? URL.createObjectURL(file) : image.imageUrl;

  return (
    <div className="modal-backdrop" onClick={() => { if (!isUpdating) onClose(); }}>
      <div className="modal-panel modal-panel--sm" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Edit Image</h2>
            <p className="modal-subtitle">Update the title or replace the image file</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} disabled={isUpdating}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        {/* Image preview */}
        <div className="edit-preview-wrapper">
          <img src={previewSrc} alt="Preview" className="edit-preview-img" />
          <button className="edit-replace-btn" onClick={() => fileInputRef.current?.click()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
            </svg>
            Replace Image
          </button>
          <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileSelect} />
        </div>

        {/* Title input */}
        <div className="edit-field">
          <label className="edit-label">Title</label>
          <input
            type="text"
            className="edit-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter image title"
          />
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="modal-btn secondary" onClick={onClose} disabled={isUpdating}>Cancel</button>
          <button className="modal-btn primary" onClick={handleUpdate} disabled={isUpdating || !title.trim()}>
            {isUpdating ? <><span className="btn-spinner" /> Saving…</> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
