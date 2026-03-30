/// <reference types="vite/client" />
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const api = axios.create({
    baseURL: API_BASE,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
});
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// ─── API calls ───────────────────────────────────────────
export const createSession = (data) => api.post('/sessions', data);
export const getSession = (id) => api.get(`/sessions/${id}`);
export const listSessions = (params) => api.get('/sessions', { params });
export const getStats = () => api.get('/sessions/stats/overview');
export const uploadDocument = (sessionId, file, documentType) => {
    const form = new FormData();
    form.append('file', file);
    form.append('document_type', documentType);
    return api.post(`/sessions/${sessionId}/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
export const getReviewQueue = () => api.get('/review/queue');
export const submitReviewDecision = (sessionId, data) => api.post(`/review/${sessionId}/decision`, data);
export const getAuditTrail = (sessionId) => api.get(`/audit/${sessionId}`);
export const loginAdmin = (formData) => api.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});
export const registerUser = (data) => api.post('/auth/register', data);
