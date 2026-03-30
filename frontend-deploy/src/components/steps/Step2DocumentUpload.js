import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useRef } from 'react';
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
    const [previewUrl, setPreviewUrl] = useState('');
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [editMode, setEditMode] = useState(false);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const onDrop = useCallback((accepted) => {
        if (accepted[0])
            setUploadedFile(accepted[0]);
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
        }
        catch (err) {
            clearInterval(interval);
            setProgress(0);
            console.error('Upload error:', err);
            alert(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}. Is the backend running?`);
        }
        finally {
            setUploading(false);
        }
    };
    const createPreview = (file) => {
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
    const handleZoom = (delta) => {
        setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
    };
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };
    const handleMouseMove = (e) => {
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
        if (!canvasRef.current || !previewUrl)
            return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
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
        if (!canvasRef.current)
            return;
        const link = document.createElement('a');
        link.download = 'edited-document.jpg';
        link.href = canvasRef.current.toDataURL();
        link.click();
    };
    return (_jsxs("div", { className: "glass-card", style: { padding: '40px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }, children: [_jsx("div", { style: { width: 40, height: 40, borderRadius: 10, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(FileText, { size: 18, color: "var(--accent-purple)" }) }), _jsxs("div", { children: [_jsx("h2", { style: { fontSize: 20, fontWeight: 700 }, children: "Identity Document" }), _jsx("p", { style: { fontSize: 13, color: 'var(--text-muted)' }, children: "Upload a government-issued ID for verification" })] })] }), _jsxs("div", { className: "form-group", style: { marginBottom: 24 }, children: [_jsx("label", { className: "form-label", children: "Document Type" }), _jsx("select", { className: "form-input", value: documentType, onChange: e => setDocumentType(e.target.value), style: { appearance: 'auto' }, children: DOC_TYPES.map(t => _jsx("option", { value: t, children: t.replace('_', ' ') }, t)) })] }), _jsxs("div", { ...getRootProps(), style: {
                    border: `2px dashed ${isDragActive ? 'var(--accent-blue)' : uploadedFile ? 'var(--accent-green)' : 'var(--glass-border)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '48px 24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: isDragActive ? 'rgba(59,130,246,0.05)' : uploadedFile ? 'rgba(16,185,129,0.05)' : 'var(--glass-border)',
                    transition: 'all 0.2s',
                }, children: [_jsx("input", { ...getInputProps() }), uploadedFile ? (_jsxs("div", { children: [_jsx(CheckCircle, { size: 40, color: "var(--accent-green)", style: { marginBottom: 12 } }), _jsx("p", { style: { fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }, children: uploadedFile.name }), _jsxs("p", { style: { fontSize: 13, color: 'var(--text-muted)' }, children: [(uploadedFile.size / 1024).toFixed(0), " KB \u2014 Click to change"] }), uploadedFile.type.startsWith('image/') && (_jsxs("div", { style: { display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }, children: [_jsxs("button", { type: "button", onClick: handlePreview, className: "btn-ghost", style: { padding: '8px 16px', fontSize: 13 }, children: [_jsx(Eye, { size: 14, style: { marginRight: 4 } }), " Preview"] }), _jsxs("button", { type: "button", onClick: () => setEditMode(!editMode), className: "btn-ghost", style: { padding: '8px 16px', fontSize: 13 }, children: [_jsx(Edit3, { size: 14, style: { marginRight: 4 } }), " Edit"] })] }))] })) : (_jsxs("div", { children: [_jsx(Upload, { size: 36, color: isDragActive ? 'var(--accent-blue)' : 'var(--text-muted)', style: { marginBottom: 12 } }), _jsx("p", { style: { fontWeight: 600, color: isDragActive ? 'var(--accent-blue)' : 'var(--text-primary)', marginBottom: 6 }, children: isDragActive ? 'Drop your document here' : 'Drag & drop or click to upload' }), _jsx("p", { style: { fontSize: 13, color: 'var(--text-muted)' }, children: "Supported: JPEG, PNG, PDF \u00B7 Max 10MB" })] }))] }), uploading && (_jsxs("div", { style: { marginTop: 20 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }, children: [_jsx("span", { children: "Uploading & starting AI analysis..." }), _jsxs("span", { children: [progress, "%"] })] }), _jsx("div", { style: { height: 4, background: 'var(--glass-border)', borderRadius: 2 }, children: _jsx("div", { style: { height: '100%', background: 'var(--gradient-primary)', borderRadius: 2, width: `${progress}%`, transition: 'width 0.2s' } }) })] })), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginTop: 28 }, children: [_jsxs("button", { className: "btn-secondary", onClick: previousStep, disabled: uploading, children: [_jsx(ArrowLeft, { size: 16, style: { marginRight: 6, verticalAlign: 'middle' } }), t('action.previous')] }), _jsx("button", { className: "btn-primary", onClick: handleUpload, disabled: !uploadedFile || uploading, style: { display: 'flex', alignItems: 'center', gap: 8 }, children: uploading ? t('status.processing') : (_jsxs(_Fragment, { children: ["Upload & Verify ", _jsx(ArrowRight, { size: 16 })] })) })] }), showPreview && (_jsx("div", { style: {
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
                }, children: _jsxs("div", { style: {
                        background: 'var(--bg-card)',
                        borderRadius: 12,
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        position: 'relative',
                    }, children: [_jsxs("div", { style: {
                                padding: '16px 20px',
                                borderBottom: '1px solid var(--glass-border)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }, children: [_jsx("h3", { style: { margin: 0, fontSize: 16, fontWeight: 600 }, children: editMode ? 'Edit Document' : 'Document Preview' }), _jsx("button", { onClick: () => {
                                        setShowPreview(false);
                                        setEditMode(false);
                                        resetImage();
                                    }, className: "btn-ghost", style: { padding: '4px' }, children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { style: {
                                padding: '12px 20px',
                                borderBottom: '1px solid var(--glass-border)',
                                display: 'flex',
                                gap: 8,
                                alignItems: 'center',
                                flexWrap: 'wrap',
                            }, children: [_jsx("button", { onClick: handleRotate, className: "btn-ghost", style: { padding: '8px' }, title: "Rotate", children: _jsx(RotateCw, { size: 16 }) }), _jsx("button", { onClick: () => handleZoom(0.1), className: "btn-ghost", style: { padding: '8px' }, title: "Zoom In", children: _jsx(ZoomIn, { size: 16 }) }), _jsx("button", { onClick: () => handleZoom(-0.1), className: "btn-ghost", style: { padding: '8px' }, title: "Zoom Out", children: _jsx(ZoomOut, { size: 16 }) }), _jsx("button", { onClick: resetImage, className: "btn-ghost", style: { padding: '8px' }, title: "Reset", children: _jsx(Move, { size: 16 }) }), editMode && (_jsxs(_Fragment, { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, margin: '0 12px' }, children: [_jsx("label", { style: { fontSize: 12 }, children: "Brightness:" }), _jsx("input", { type: "range", min: "50", max: "150", value: brightness, onChange: (e) => setBrightness(Number(e.target.value)), style: { width: 80 } })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx("label", { style: { fontSize: 12 }, children: "Contrast:" }), _jsx("input", { type: "range", min: "50", max: "150", value: contrast, onChange: (e) => setContrast(Number(e.target.value)), style: { width: 80 } })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx("label", { style: { fontSize: 12 }, children: "Saturation:" }), _jsx("input", { type: "range", min: "0", max: "200", value: saturation, onChange: (e) => setSaturation(Number(e.target.value)), style: { width: 80 } })] }), _jsx("button", { onClick: applyFilters, className: "btn-primary", style: { padding: '6px 12px', fontSize: 12 }, children: "Apply" }), _jsxs("button", { onClick: downloadImage, className: "btn-ghost", style: { padding: '6px 12px', fontSize: 12 }, children: [_jsx(Download, { size: 14, style: { marginRight: 4 } }), " Download"] })] })), _jsx("button", { onClick: () => setEditMode(!editMode), className: "btn-ghost", style: { padding: '6px 12px', fontSize: 12, marginLeft: 'auto' }, children: editMode ? 'Preview' : 'Edit' })] }), _jsx("div", { style: {
                                padding: 20,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: 400,
                                overflow: 'auto',
                                cursor: isDragging ? 'grabbing' : 'grab',
                            }, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, children: _jsx("img", { src: previewUrl, alt: "Document preview", style: {
                                    maxWidth: '100%',
                                    maxHeight: '70vh',
                                    transform: `rotate(${rotation}deg) scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                                    transition: isDragging ? 'none' : 'transform 0.2s',
                                } }) }), _jsx("canvas", { ref: canvasRef, style: { display: 'none' } })] }) }))] }));
}
