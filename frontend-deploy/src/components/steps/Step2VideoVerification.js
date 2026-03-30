import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, Camera, RotateCcw, CheckCircle, Play, Pause } from 'lucide-react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useLanguage } from '../../contexts/LanguageContext';
const CameraOff = VideoOff; // Alias for CameraOff since it's not in lucide-react
export default function Step2VideoVerification() {
    const { updateData, nextStep, previousStep } = useOnboardingStore();
    const { t } = useLanguage();
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [videoURL, setVideoURL] = useState('');
    const [stream, setStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [currentPhase, setCurrentPhase] = useState('instruction');
    const [countdown, setCountdown] = useState(0);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const countdownInterval = useRef(null);
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                },
                audio: true
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        }
        catch (error) {
            console.error('Error accessing camera:', error);
            alert(t('error.cameraAccess'));
        }
    };
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };
    const startRecording = useCallback(() => {
        if (!stream)
            return;
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9'
        });
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                setRecordedChunks(prev => [...prev, event.data]);
            }
        };
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setVideoURL(url);
            setCurrentPhase('review');
        };
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
        setCurrentPhase('recording');
        // Start countdown for 30 seconds
        setCountdown(30);
        countdownInterval.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    stopRecording();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [stream, recordedChunks]);
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (countdownInterval.current) {
                clearInterval(countdownInterval.current);
            }
        }
    };
    const pauseRecording = () => {
        if (mediaRecorderRef.current && isRecording && !isPaused) {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
            if (countdownInterval.current) {
                clearInterval(countdownInterval.current);
            }
        }
    };
    const resumeRecording = () => {
        if (mediaRecorderRef.current && isRecording && isPaused) {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
            countdownInterval.current = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        stopRecording();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };
    const retakeVideo = () => {
        setRecordedChunks([]);
        setVideoURL('');
        setCurrentPhase('instruction');
        setCountdown(0);
    };
    const submitVideo = () => {
        console.log('Submitting video verification...', { videoURL, currentPhase });
        setCurrentPhase('processing');
        // Simulate processing
        setTimeout(() => {
            console.log('Video processing completed, moving to next step');
            updateData({ videoVerification: { completed: true, videoURL } });
            nextStep();
        }, 2000);
    };
    const toggleMute = () => {
        if (stream) {
            const audioTracks = stream.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };
    const toggleCamera = () => {
        if (stream) {
            const videoTracks = stream.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsCameraOff(!isCameraOff);
        }
    };
    React.useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
            if (countdownInterval.current) {
                clearInterval(countdownInterval.current);
            }
        };
    }, []);
    const instructions = [
        t('videoVerification.instruction1'),
        t('videoVerification.instruction2'),
        t('videoVerification.instruction3'),
    ];
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, style: { maxWidth: 800, margin: '0 auto' }, children: [_jsxs("div", { style: { textAlign: 'center', marginBottom: 32 }, children: [_jsx("h2", { style: { fontSize: 24, fontWeight: 700, marginBottom: 8 }, children: t('videoVerification.title') }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: 15 }, children: t('videoVerification.subtitle') })] }), currentPhase === 'instruction' && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "glass-card", style: { padding: '40px', textAlign: 'center' }, children: [_jsx("div", { style: {
                            width: 80, height: 80,
                            borderRadius: '50%',
                            background: 'var(--accent-blue)15',
                            border: '2px solid var(--accent-blue)30',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px'
                        }, children: _jsx(Video, { size: 32, color: "var(--accent-blue)" }) }), _jsx("h3", { style: { fontSize: 18, fontWeight: 600, marginBottom: 24 }, children: t('videoVerification.instructions.title') }), _jsx("div", { style: { textAlign: 'left', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }, children: instructions.map((instruction, index) => (_jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }, children: [_jsx("div", { style: {
                                        width: 24, height: 24,
                                        borderRadius: '50%',
                                        background: 'var(--accent-blue)',
                                        color: 'var(--text-primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 12, fontWeight: 600,
                                        flexShrink: 0
                                    }, children: index + 1 }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.5 }, children: instruction })] }, index))) }), _jsxs("div", { style: { display: 'flex', gap: 16, justifyContent: 'center' }, children: [_jsx("button", { onClick: previousStep, className: "btn-ghost", children: t('action.previous') }), _jsx("button", { onClick: startRecording, className: "btn-primary", children: t('videoVerification.startRecording') })] })] })), (currentPhase === 'recording' || currentPhase === 'instruction') && (_jsxs("div", { className: "glass-card", style: { padding: '24px', marginBottom: 24 }, children: [_jsxs("div", { style: { position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#000' }, children: [_jsx("video", { ref: videoRef, autoPlay: true, muted: true, playsInline: true, style: {
                                    width: '100%',
                                    height: 400,
                                    objectFit: 'cover',
                                    display: isCameraOff ? 'none' : 'block'
                                } }), isCameraOff && (_jsx("div", { style: {
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: '#1a1a1a'
                                }, children: _jsx(CameraOff, { size: 48, color: "var(--text-muted)" }) })), currentPhase === 'recording' && (_jsx("div", { style: {
                                    position: 'absolute',
                                    top: 16, right: 16,
                                    display: 'flex', gap: 8
                                }, children: _jsxs("div", { className: "glass-card", style: {
                                        padding: '8px 16px',
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        background: 'rgba(239, 68, 68, 0.9)',
                                        border: 'none'
                                    }, children: [_jsx("div", { style: {
                                                width: 12, height: 12,
                                                borderRadius: '50%',
                                                background: 'var(--text-primary)',
                                                animation: 'pulse 1.5s infinite'
                                            } }), _jsxs("span", { style: { color: 'var(--text-primary)', fontSize: 14, fontWeight: 600 }, children: [Math.floor(countdown / 60), ":", (countdown % 60).toString().padStart(2, '0')] })] }) }))] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'center', gap: 16, marginTop: 20 }, children: [_jsx("button", { onClick: toggleMute, className: "btn-ghost", style: { padding: '12px' }, children: isMuted ? _jsx(MicOff, { size: 20 }) : _jsx(Mic, { size: 20 }) }), _jsx("button", { onClick: toggleCamera, className: "btn-ghost", style: { padding: '12px' }, children: isCameraOff ? _jsx(Camera, { size: 20 }) : _jsx(VideoOff, { size: 20 }) }), currentPhase === 'recording' && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: isPaused ? resumeRecording : pauseRecording, className: "btn-ghost", style: { padding: '12px' }, children: isPaused ? _jsx(Play, { size: 20 }) : _jsx(Pause, { size: 20 }) }), _jsx("button", { onClick: stopRecording, className: "btn-ghost", style: {
                                            padding: '12px 24px',
                                            background: 'var(--accent-red)',
                                            color: 'var(--text-primary)',
                                            border: 'none'
                                        }, children: t('videoVerification.stopRecording') })] }))] })] })), currentPhase === 'review' && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "glass-card", style: { padding: '40px', textAlign: 'center' }, children: [_jsx("h3", { style: { fontSize: 18, fontWeight: 600, marginBottom: 24 }, children: t('videoVerification.review.title') }), _jsx("video", { src: videoURL, controls: true, style: {
                            width: '100%',
                            maxWidth: 600,
                            height: 400,
                            borderRadius: 12,
                            marginBottom: 24
                        } }), _jsxs("div", { style: { display: 'flex', gap: 16, justifyContent: 'center' }, children: [_jsxs("button", { onClick: retakeVideo, className: "btn-ghost", children: [_jsx(RotateCcw, { size: 16, style: { marginRight: 8 } }), t('videoVerification.retake')] }), _jsxs("button", { onClick: submitVideo, className: "btn-primary", children: [_jsx(CheckCircle, { size: 16, style: { marginRight: 8 } }), t('videoVerification.submit')] })] })] })), currentPhase === 'processing' && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "glass-card", style: { padding: '60px', textAlign: 'center' }, children: [_jsx("div", { className: "spinner", style: { width: 48, height: 48, margin: '0 auto 24px' } }), _jsx("h3", { style: { fontSize: 18, fontWeight: 600, marginBottom: 8 }, children: t('videoVerification.processing') }), _jsx("p", { style: { color: 'var(--text-secondary)' }, children: t('videoVerification.processingSubtitle') })] })), _jsx("style", { children: `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      ` })] }));
}
