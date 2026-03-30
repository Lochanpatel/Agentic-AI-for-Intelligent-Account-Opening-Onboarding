import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Settings, Bell, Lock, FileText, Download, Upload, Edit3, Save, X, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuthStore } from '../store/authStore';
export default function UserProfile() {
    const { t } = useLanguage();
    const { token } = useAuthStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [profile, setProfile] = useState({
        id: 'user_123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1990-01-15',
        address: '123 Main Street',
        city: 'New York',
        country: 'United States',
        postalCode: '10001',
        role: 'customer',
        status: 'active',
        createdAt: '2023-01-15',
        lastLogin: '2024-03-26T10:30:00Z',
        twoFactorEnabled: false,
        emailNotifications: true,
        smsNotifications: false,
        language: 'en',
        timezone: 'America/New_York',
        currency: 'USD',
    });
    const [editProfile, setEditProfile] = useState({ ...profile });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const handleSaveProfile = () => {
        setProfile(editProfile);
        setIsEditing(false);
    };
    const handleCancelEdit = () => {
        setEditProfile({ ...profile });
        setIsEditing(false);
    };
    const handlePasswordChange = () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        // Handle password change logic here
        alert('Password changed successfully');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };
    const exportUserData = () => {
        const dataStr = JSON.stringify(profile, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'user-profile-data.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };
    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'preferences', label: 'Preferences', icon: Settings },
        { id: 'documents', label: 'Documents', icon: FileText },
    ];
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'var(--accent-green)';
            case 'inactive': return 'var(--text-muted)';
            case 'suspended': return 'var(--accent-red)';
            default: return 'var(--text-muted)';
        }
    };
    return (_jsxs("div", { style: { padding: '80px 40px 60px', maxWidth: 1000, margin: '0 auto' }, children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, style: { marginBottom: 32 }, children: [_jsx("h1", { style: { fontSize: 28, fontWeight: 700, marginBottom: 8 }, children: _jsx("span", { className: "gradient-text", children: "User Profile" }) }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: 14 }, children: "Manage your account settings and preferences" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "glass-card", style: { padding: '32px', marginBottom: 32 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }, children: [_jsxs("div", { style: {
                                    width: 80, height: 80,
                                    borderRadius: '50%',
                                    background: 'var(--gradient-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 32,
                                    fontWeight: 700,
                                    color: 'var(--text-primary)'
                                }, children: [profile.firstName.charAt(0), profile.lastName.charAt(0)] }), _jsxs("div", { style: { flex: 1 }, children: [_jsxs("h2", { style: { fontSize: 24, fontWeight: 600, marginBottom: 4 }, children: [profile.firstName, " ", profile.lastName] }), _jsx("p", { style: { color: 'var(--text-secondary)', marginBottom: 8 }, children: profile.email }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 16 }, children: [_jsx("span", { style: {
                                                    padding: '4px 12px',
                                                    borderRadius: 999,
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    background: `${getStatusColor(profile.status)}15`,
                                                    color: getStatusColor(profile.status)
                                                }, children: profile.status }), _jsxs("span", { style: { fontSize: 13, color: 'var(--text-muted)' }, children: ["Role: ", profile.role] }), _jsxs("span", { style: { fontSize: 13, color: 'var(--text-muted)' }, children: ["Member since ", new Date(profile.createdAt).toLocaleDateString()] })] })] }), _jsxs("div", { style: { display: 'flex', gap: 8 }, children: [_jsxs("button", { onClick: () => setIsEditing(!isEditing), className: "btn-primary", style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [isEditing ? _jsx(X, { size: 16 }) : _jsx(Edit3, { size: 16 }), isEditing ? 'Cancel' : 'Edit Profile'] }), _jsxs("button", { onClick: exportUserData, className: "btn-ghost", style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx(Download, { size: 16 }), "Export Data"] })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }, children: [_jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }, children: "12" }), _jsx("div", { style: { fontSize: 13, color: 'var(--text-secondary)' }, children: "Applications" })] }), _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }, children: "8" }), _jsx("div", { style: { fontSize: 13, color: 'var(--text-secondary)' }, children: "Approved" })] }), _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }, children: "2.3" }), _jsx("div", { style: { fontSize: 13, color: 'var(--text-secondary)' }, children: "Avg Processing Time" })] }), _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }, children: "95%" }), _jsx("div", { style: { fontSize: 13, color: 'var(--text-secondary)' }, children: "Completion Rate" })] })] })] }), _jsx("div", { style: { display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--glass-border)', paddingBottom: 16 }, children: tabs.map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `btn-ghost ${activeTab === tab.id ? 'active' : ''}`, style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 16px',
                        borderBottom: activeTab === tab.id ? '2px solid var(--accent-blue)' : 'none',
                        borderRadius: activeTab === tab.id ? '8px 8px 0 0' : 8,
                        background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent'
                    }, children: [_jsx(tab.icon, { size: 16 }), tab.label] }, tab.id))) }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "glass-card", style: { padding: '32px' }, children: [activeTab === 'profile' && (_jsxs("div", { children: [_jsx("h3", { style: { fontSize: 18, fontWeight: 600, marginBottom: 24 }, children: "Personal Information" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "First Name" }), _jsx("input", { type: "text", className: "form-input", value: isEditing ? editProfile.firstName : profile.firstName, onChange: (e) => setEditProfile({ ...editProfile, firstName: e.target.value }), disabled: !isEditing })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Last Name" }), _jsx("input", { type: "text", className: "form-input", value: isEditing ? editProfile.lastName : profile.lastName, onChange: (e) => setEditProfile({ ...editProfile, lastName: e.target.value }), disabled: !isEditing })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Email" }), _jsx("input", { type: "email", className: "form-input", value: isEditing ? editProfile.email : profile.email, onChange: (e) => setEditProfile({ ...editProfile, email: e.target.value }), disabled: !isEditing })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Phone" }), _jsx("input", { type: "tel", className: "form-input", value: isEditing ? editProfile.phone : profile.phone, onChange: (e) => setEditProfile({ ...editProfile, phone: e.target.value }), disabled: !isEditing })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Date of Birth" }), _jsx("input", { type: "date", className: "form-input", value: isEditing ? editProfile.dateOfBirth : profile.dateOfBirth, onChange: (e) => setEditProfile({ ...editProfile, dateOfBirth: e.target.value }), disabled: !isEditing })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Country" }), _jsxs("select", { className: "form-input", value: isEditing ? editProfile.country : profile.country, onChange: (e) => setEditProfile({ ...editProfile, country: e.target.value }), disabled: !isEditing, children: [_jsx("option", { children: "United States" }), _jsx("option", { children: "Canada" }), _jsx("option", { children: "United Kingdom" }), _jsx("option", { children: "Germany" }), _jsx("option", { children: "France" })] })] })] }), _jsxs("div", { style: { marginTop: 24 }, children: [_jsx("h4", { style: { fontSize: 16, fontWeight: 600, marginBottom: 16 }, children: "Address" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Street Address" }), _jsx("input", { type: "text", className: "form-input", value: isEditing ? editProfile.address : profile.address, onChange: (e) => setEditProfile({ ...editProfile, address: e.target.value }), disabled: !isEditing })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "City" }), _jsx("input", { type: "text", className: "form-input", value: isEditing ? editProfile.city : profile.city, onChange: (e) => setEditProfile({ ...editProfile, city: e.target.value }), disabled: !isEditing })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Postal Code" }), _jsx("input", { type: "text", className: "form-input", value: isEditing ? editProfile.postalCode : profile.postalCode, onChange: (e) => setEditProfile({ ...editProfile, postalCode: e.target.value }), disabled: !isEditing })] })] })] }), isEditing && (_jsxs("div", { style: { display: 'flex', gap: 12, marginTop: 32 }, children: [_jsxs("button", { onClick: handleSaveProfile, className: "btn-primary", children: [_jsx(Save, { size: 16, style: { marginRight: 8 } }), "Save Changes"] }), _jsx("button", { onClick: handleCancelEdit, className: "btn-secondary", children: "Cancel" })] }))] })), activeTab === 'security' && (_jsxs("div", { children: [_jsx("h3", { style: { fontSize: 18, fontWeight: 600, marginBottom: 24 }, children: "Security Settings" }), _jsxs("div", { style: { marginBottom: 32 }, children: [_jsx("h4", { style: { fontSize: 16, fontWeight: 600, marginBottom: 16 }, children: "Change Password" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Current Password" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx("input", { type: showCurrentPassword ? 'text' : 'password', className: "form-input", value: passwordForm.currentPassword, onChange: (e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value }), style: { paddingRight: 40 } }), _jsx("button", { type: "button", onClick: () => setShowCurrentPassword(!showCurrentPassword), style: {
                                                                    position: 'absolute',
                                                                    right: 12,
                                                                    top: '50%',
                                                                    transform: 'translateY(-50%)',
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer'
                                                                }, children: showCurrentPassword ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "New Password" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx("input", { type: showPassword ? 'text' : 'password', className: "form-input", value: passwordForm.newPassword, onChange: (e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value }), style: { paddingRight: 40 } }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), style: {
                                                                    position: 'absolute',
                                                                    right: 12,
                                                                    top: '50%',
                                                                    transform: 'translateY(-50%)',
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer'
                                                                }, children: showPassword ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Confirm New Password" }), _jsx("input", { type: "password", className: "form-input", value: passwordForm.confirmPassword, onChange: (e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value }) })] })] }), _jsxs("button", { onClick: handlePasswordChange, className: "btn-primary", style: { marginTop: 16 }, children: [_jsx(Lock, { size: 16, style: { marginRight: 8 } }), "Update Password"] })] }), _jsxs("div", { children: [_jsx("h4", { style: { fontSize: 16, fontWeight: 600, marginBottom: 16 }, children: "Two-Factor Authentication" }), _jsx("div", { className: "glass-card", style: { padding: '20px' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontWeight: 500, marginBottom: 4 }, children: "Two-Factor Authentication" }), _jsx("div", { style: { fontSize: 13, color: 'var(--text-secondary)' }, children: "Add an extra layer of security to your account" })] }), _jsx("button", { className: `btn-${profile.twoFactorEnabled ? 'secondary' : 'primary'}`, style: { padding: '8px 16px' }, children: profile.twoFactorEnabled ? 'Disable' : 'Enable' })] }) })] })] })), activeTab === 'notifications' && (_jsxs("div", { children: [_jsx("h3", { style: { fontSize: 18, fontWeight: 600, marginBottom: 24 }, children: "Notification Preferences" }), _jsxs("div", { style: { display: 'grid', gap: 16 }, children: [_jsx("div", { className: "glass-card", style: { padding: '20px' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontWeight: 500, marginBottom: 4 }, children: "Email Notifications" }), _jsx("div", { style: { fontSize: 13, color: 'var(--text-secondary)' }, children: "Receive updates about your applications via email" })] }), _jsxs("label", { style: { position: 'relative', display: 'inline-block', width: 50, height: 24 }, children: [_jsx("input", { type: "checkbox", checked: profile.emailNotifications, onChange: (e) => setProfile({ ...profile, emailNotifications: e.target.checked }), style: { opacity: 0, width: 0, height: 0 } }), _jsx("span", { style: {
                                                                position: 'absolute',
                                                                cursor: 'pointer',
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                bottom: 0,
                                                                backgroundColor: profile.emailNotifications ? 'var(--accent-blue)' : 'var(--glass-border)',
                                                                transition: '.4s',
                                                                borderRadius: 24
                                                            }, children: _jsx("span", { style: {
                                                                    position: 'absolute',
                                                                    content: '',
                                                                    height: 18,
                                                                    width: 18,
                                                                    left: profile.emailNotifications ? 26 : 3,
                                                                    bottom: 3,
                                                                    backgroundColor: 'var(--text-primary)',
                                                                    transition: '.4s',
                                                                    borderRadius: '50%'
                                                                } }) })] })] }) }), _jsx("div", { className: "glass-card", style: { padding: '20px' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontWeight: 500, marginBottom: 4 }, children: "SMS Notifications" }), _jsx("div", { style: { fontSize: 13, color: 'var(--text-secondary)' }, children: "Receive important updates via SMS" })] }), _jsxs("label", { style: { position: 'relative', display: 'inline-block', width: 50, height: 24 }, children: [_jsx("input", { type: "checkbox", checked: profile.smsNotifications, onChange: (e) => setProfile({ ...profile, smsNotifications: e.target.checked }), style: { opacity: 0, width: 0, height: 0 } }), _jsx("span", { style: {
                                                                position: 'absolute',
                                                                cursor: 'pointer',
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                bottom: 0,
                                                                backgroundColor: profile.smsNotifications ? 'var(--accent-blue)' : 'var(--glass-border)',
                                                                transition: '.4s',
                                                                borderRadius: 24
                                                            }, children: _jsx("span", { style: {
                                                                    position: 'absolute',
                                                                    content: '',
                                                                    height: 18,
                                                                    width: 18,
                                                                    left: profile.smsNotifications ? 26 : 3,
                                                                    bottom: 3,
                                                                    backgroundColor: 'var(--text-primary)',
                                                                    transition: '.4s',
                                                                    borderRadius: '50%'
                                                                } }) })] })] }) })] })] })), activeTab === 'preferences' && (_jsxs("div", { children: [_jsx("h3", { style: { fontSize: 18, fontWeight: 600, marginBottom: 24 }, children: "Preferences" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Language" }), _jsxs("select", { className: "form-input", value: profile.language, onChange: (e) => setProfile({ ...profile, language: e.target.value }), children: [_jsx("option", { value: "en", children: "English" }), _jsx("option", { value: "es", children: "Espa\u00F1ol" }), _jsx("option", { value: "fr", children: "Fran\u00E7ais" }), _jsx("option", { value: "de", children: "Deutsch" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Timezone" }), _jsxs("select", { className: "form-input", value: profile.timezone, onChange: (e) => setProfile({ ...profile, timezone: e.target.value }), children: [_jsx("option", { value: "America/New_York", children: "Eastern Time" }), _jsx("option", { value: "America/Chicago", children: "Central Time" }), _jsx("option", { value: "America/Denver", children: "Mountain Time" }), _jsx("option", { value: "America/Los_Angeles", children: "Pacific Time" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Currency" }), _jsxs("select", { className: "form-input", value: profile.currency, onChange: (e) => setProfile({ ...profile, currency: e.target.value }), children: [_jsx("option", { value: "USD", children: "USD - US Dollar" }), _jsx("option", { value: "EUR", children: "EUR - Euro" }), _jsx("option", { value: "GBP", children: "GBP - British Pound" }), _jsx("option", { value: "CAD", children: "CAD - Canadian Dollar" })] })] })] })] })), activeTab === 'documents' && (_jsxs("div", { children: [_jsx("h3", { style: { fontSize: 18, fontWeight: 600, marginBottom: 24 }, children: "My Documents" }), _jsxs("div", { style: { display: 'grid', gap: 16 }, children: [_jsx("div", { className: "glass-card", style: { padding: '20px' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontWeight: 500, marginBottom: 4 }, children: "Passport" }), _jsx("div", { style: { fontSize: 13, color: 'var(--text-muted)' }, children: "Uploaded on Jan 15, 2024 \u2022 Status: Verified" })] }), _jsxs("div", { style: { display: 'flex', gap: 8 }, children: [_jsxs("button", { className: "btn-ghost", style: { padding: '6px 12px', fontSize: 12 }, children: [_jsx(Eye, { size: 14, style: { marginRight: 4 } }), " View"] }), _jsxs("button", { className: "btn-ghost", style: { padding: '6px 12px', fontSize: 12 }, children: [_jsx(Download, { size: 14, style: { marginRight: 4 } }), " Download"] })] })] }) }), _jsx("div", { className: "glass-card", style: { padding: '20px' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontWeight: 500, marginBottom: 4 }, children: "Driver's License" }), _jsx("div", { style: { fontSize: 13, color: 'var(--text-muted)' }, children: "Uploaded on Jan 15, 2024 \u2022 Status: Verified" })] }), _jsxs("div", { style: { display: 'flex', gap: 8 }, children: [_jsxs("button", { className: "btn-ghost", style: { padding: '6px 12px', fontSize: 12 }, children: [_jsx(Eye, { size: 14, style: { marginRight: 4 } }), " View"] }), _jsxs("button", { className: "btn-ghost", style: { padding: '6px 12px', fontSize: 12 }, children: [_jsx(Download, { size: 14, style: { marginRight: 4 } }), " Download"] })] })] }) })] }), _jsxs("button", { className: "btn-primary", style: { marginTop: 24 }, children: [_jsx(Upload, { size: 16, style: { marginRight: 8 } }), "Upload New Document"] })] }))] })] }));
}
