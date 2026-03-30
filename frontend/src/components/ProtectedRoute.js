import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
export default function ProtectedRoute({ children, allowedRoles }) {
    const { token, role } = useAuthStore();
    const location = useLocation();
    if (!token) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    if (allowedRoles && role && !allowedRoles.includes(role)) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
