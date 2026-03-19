import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useOnboardingStore } from '../../store/onboardingStore';
import { uploadDocument } from '../../api/client';
import { Upload, FileText, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const DOC_TYPES = ['PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE', 'RESIDENCE_PERMIT'];

export default function Step2DocumentUpload() {
  const { sessionId, documentType, setUploadedFile, setDocumentType, uploadedFile, setStep } = useOnboardingStore();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

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
    if (!uploadedFile || !sessionId) return;
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => setProgress(p => Math.min(p + 10, 85)), 200);
    try {
      await uploadDocument(sessionId, uploadedFile, documentType);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setStep(3), 500);
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      alert('Upload failed. Is the backend running?');
    } finally {
      setUploading(false);
    }
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
          background: isDragActive ? 'rgba(59,130,246,0.05)' : uploadedFile ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.2s',
        }}
      >
        <input {...getInputProps()} />
        {uploadedFile ? (
          <div>
            <CheckCircle size={40} color="var(--accent-green)" style={{ marginBottom: 12 }} />
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{uploadedFile.name}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{(uploadedFile.size / 1024).toFixed(0)} KB — Click to change</p>
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
        <button className="btn-secondary" onClick={() => setStep(1)} disabled={uploading}>
          <ArrowLeft size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />Back
        </button>
        <button className="btn-primary" onClick={handleUpload} disabled={!uploadedFile || uploading} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {uploading ? 'Processing...' : (<>Upload & Verify <ArrowRight size={16} /></>)}
        </button>
      </div>
    </div>
  );
}
