import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useOnboardingStore } from '../../store/onboardingStore';
import { uploadDocument } from '../../api/client';
import { useLanguage } from '../../contexts/LanguageContext';
import { Upload, FileText, ArrowRight, ArrowLeft, CheckCircle, Eye, Edit3, RotateCw, Download, X, ZoomIn, ZoomOut, Move } from 'lucide-react';

const DOC_TYPES = ['PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE', 'RESIDENCE_PERMIT'];

export default function Step2DocumentUpload() {
  const { sessionId, documentType, setUploadedFile, setDocumentType, uploadedFile, setStep, previousStep, nextStep } = useOnboardingStore();
  const { t } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [editMode, setEditMode] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setUploadedFile(accepted[0]);
  }, [setUploadedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'], 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!uploadedFile || !sessionId) {
      console.log('Upload failed - missing data:', { uploadedFile: !!uploadedFile, sessionId });
      if (!sessionId) {
        alert('Session not created. Please complete the previous steps first.');
        return;
      }
      return;
    }
    
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => setProgress(p => Math.min(p + 10, 85)), 200);
    
    try {
      console.log('Starting upload:', { sessionId, fileName: uploadedFile.name, documentType });
      await uploadDocument(sessionId, uploadedFile, documentType);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => nextStep(), 500);
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      console.error('Upload error:', err);
      alert(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}. Is the backend running?`);
    } finally {
      setUploading(false);
    }
  };

  const createPreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowPreview(true);
    }
  };

  const handlePreview = () => {
    if (uploadedFile) {
      createPreview(uploadedFile);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetImage = () => {
    setRotation(0);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  const applyFilters = () => {
    if (!canvasRef.current || !previewUrl) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const newFile = new File([blob], uploadedFile?.name || 'edited-document.jpg', {
            type: 'image/jpeg',
          });
          setUploadedFile(newFile);
          const newUrl = URL.createObjectURL(newFile);
          setPreviewUrl(newUrl);
        }
      }, 'image/jpeg');
    };
    img.src = previewUrl;
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'edited-document.jpg';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="glass-card" style={{ padding: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={18} color="var(--accent-purple)" />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Identity Document</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Upload a government-issued ID for verification</p>
        </div>
      </div>

      {/* Doc type selector */}
      <div className="form-group" style={{ marginBottom: 24 }}>
        <label className="form-label">Document Type</label>
        <select className="form-input" value={documentType} onChange={e => setDocumentType(e.target.value)} style={{ appearance: 'auto' }}>
          {DOC_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
        </select>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? 'var(--accent-blue)' : uploadedFile ? 'var(--accent-green)' : 'var(--glass-border)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '48px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragActive ? 'rgba(59,130,246,0.05)' : uploadedFile ? 'rgba(16,185,129,0.05)' : 'var(--glass-border)',
          transition: 'all 0.2s',
        }}
      >
        <input {...getInputProps()} />
        {uploadedFile ? (
          <div>
            <CheckCircle size={40} color="var(--accent-green)" style={{ marginBottom: 12 }} />
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{uploadedFile.name}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{(uploadedFile.size / 1024).toFixed(0)} KB — Click to change</p>
            
            {/* Preview and Edit Actions */}
            {uploadedFile.type.startsWith('image/') && (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
                <button
                  type="button"
                  onClick={handlePreview}
                  className="btn-ghost"
                  style={{ padding: '8px 16px', fontSize: 13 }}
                >
                  <Eye size={14} style={{ marginRight: 4 }} /> Preview
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(!editMode)}
                  className="btn-ghost"
                  style={{ padding: '8px 16px', fontSize: 13 }}
                >
                  <Edit3 size={14} style={{ marginRight: 4 }} /> Edit
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Upload size={36} color={isDragActive ? 'var(--accent-blue)' : 'var(--text-muted)'} style={{ marginBottom: 12 }} />
            <p style={{ fontWeight: 600, color: isDragActive ? 'var(--accent-blue)' : 'var(--text-primary)', marginBottom: 6 }}>
              {isDragActive ? 'Drop your document here' : 'Drag & drop or click to upload'}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Supported: JPEG, PNG, PDF · Max 10MB</p>
          </div>
        )}
      </div>

      {/* Upload progress */}
      {uploading && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>
            <span>Uploading & starting AI analysis...</span><span>{progress}%</span>
          </div>
          <div style={{ height: 4, background: 'var(--glass-border)', borderRadius: 2 }}>
            <div style={{ height: '100%', background: 'var(--gradient-primary)', borderRadius: 2, width: `${progress}%`, transition: 'width 0.2s' }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
        <button className="btn-secondary" onClick={previousStep} disabled={uploading}>
          <ArrowLeft size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />{t('action.previous')}
        </button>
        <button className="btn-primary" onClick={handleUpload} disabled={!uploadedFile || uploading} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {uploading ? t('status.processing') : (<>Upload & Verify <ArrowRight size={16} /></>)}
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 12,
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                {editMode ? 'Edit Document' : 'Document Preview'}
              </h3>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setEditMode(false);
                  resetImage();
                }}
                className="btn-ghost"
                style={{ padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Toolbar */}
            <div style={{
              padding: '12px 20px',
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              <button onClick={handleRotate} className="btn-ghost" style={{ padding: '8px' }} title="Rotate">
                <RotateCw size={16} />
              </button>
              <button onClick={() => handleZoom(0.1)} className="btn-ghost" style={{ padding: '8px' }} title="Zoom In">
                <ZoomIn size={16} />
              </button>
              <button onClick={() => handleZoom(-0.1)} className="btn-ghost" style={{ padding: '8px' }} title="Zoom Out">
                <ZoomOut size={16} />
              </button>
              <button onClick={resetImage} className="btn-ghost" style={{ padding: '8px' }} title="Reset">
                <Move size={16} />
              </button>
              
              {editMode && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 12px' }}>
                    <label style={{ fontSize: 12 }}>Brightness:</label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      style={{ width: 80 }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label style={{ fontSize: 12 }}>Contrast:</label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      style={{ width: 80 }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label style={{ fontSize: 12 }}>Saturation:</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      style={{ width: 80 }}
                    />
                  </div>
                  <button onClick={applyFilters} className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>
                    Apply
                  </button>
                  <button onClick={downloadImage} className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}>
                    <Download size={14} style={{ marginRight: 4 }} /> Download
                  </button>
                </>
              )}
              
              <button
                onClick={() => setEditMode(!editMode)}
                className="btn-ghost"
                style={{ padding: '6px 12px', fontSize: 12, marginLeft: 'auto' }}
              >
                {editMode ? 'Preview' : 'Edit'}
              </button>
            </div>

            {/* Image Container */}
            <div
              style={{
                padding: 20,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 400,
                overflow: 'auto',
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                src={previewUrl}
                alt="Document preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  transform: `rotate(${rotation}deg) scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                  filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                  transition: isDragging ? 'none' : 'transform 0.2s',
                }}
              />
            </div>

            {/* Hidden Canvas for Image Processing */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </div>
      )}
    </div>
  );
}
