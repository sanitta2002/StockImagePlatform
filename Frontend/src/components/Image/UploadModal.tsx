import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAppSelector } from '../../store';
import { API_URLS } from '../../constants/api';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const selected = Array.from(incoming).filter((f) => f.type.startsWith('image/'));
    setFiles((prev) => [...prev, ...selected]);
    setTitles((prev) => [...prev, ...selected.map((f) => f.name.replace(/\.[^.]+$/, ''))]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => addFiles(e.target.files);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleTitleChange = (index: number, value: string) => {
    const next = [...titles];
    next[index] = value;
    setTitles(next);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setTitles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) { toast.error('Please select at least one image.'); return; }
    if (titles.some((t) => !t.trim())) { toast.error('Every image needs a title.'); return; }
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('image', f));
      formData.append('titles', JSON.stringify(titles));
      if (user?.id) formData.append('userId', user.id);
      await axios.post(`${API_BASE_URL}${API_URLS.UPLOAD_IMAGES}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      toast.success('Images uploaded successfully!');
      onUploadSuccess();
      setFiles([]);
      setTitles([]);
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Upload failed. Please try again.');
      } else {
        toast.error('Upload failed. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) { setFiles([]); setTitles([]); setError(null); onClose(); }
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Upload Images</h2>
            <p className="modal-subtitle">Select multiple images and give each a title</p>
          </div>
          <button className="modal-close-btn" onClick={handleClose} disabled={isUploading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        {/* Drop zone */}
        <div
          className={`drop-zone ${isDraggingOver ? 'active' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
        >
          <div className="drop-zone-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
            </svg>
          </div>
          <p className="drop-zone-primary">Drop images here or <span>browse</span></p>
          <p className="drop-zone-secondary">PNG, JPG, WEBP, GIF supported</p>
          <input type="file" multiple accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileSelect} />
        </div>

        {/* Preview list */}
        {files.length > 0 && (
          <div className="upload-list">
            <div className="upload-list-header">
              <span>{files.length} image{files.length !== 1 ? 's' : ''} selected</span>
            </div>
            <div className="upload-list-items">
              {files.map((file, index) => (
                <div key={index} className="upload-list-item">
                  <img src={URL.createObjectURL(file)} alt="" className="upload-preview-img" />
                  <input
                    type="text"
                    className="upload-title-input"
                    value={titles[index]}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    placeholder="Image title…"
                  />
                  <button className="upload-remove-btn" onClick={() => removeFile(index)} title="Remove">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="modal-footer">
          <button className="modal-btn secondary" onClick={handleClose} disabled={isUploading}>Cancel</button>
          <button className="modal-btn primary" onClick={handleUpload} disabled={isUploading || files.length === 0}>
            {isUploading ? (
              <><span className="btn-spinner" /> Uploading…</>
            ) : (
              `Upload ${files.length > 0 ? files.length + ' image' + (files.length !== 1 ? 's' : '') : ''}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
