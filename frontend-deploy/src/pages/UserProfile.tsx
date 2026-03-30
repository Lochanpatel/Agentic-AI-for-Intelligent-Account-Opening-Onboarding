import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Shield, Settings, Bell, Lock, Globe, CreditCard, FileText, Download, Upload, Edit3, Save, X, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuthStore } from '../store/authStore';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  language: string;
  timezone: string;
  currency: string;
}

export default function UserProfile() {
  const { t } = useLanguage();
  const { token } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
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

  const [editProfile, setEditProfile] = useState<UserProfile>({ ...profile });
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
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--accent-green)';
      case 'inactive': return 'var(--text-muted)';
      case 'suspended': return 'var(--accent-red)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div style={{ padding: '80px 40px 60px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 32 }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          <span className="gradient-text">User Profile</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Manage your account settings and preferences
        </p>
      </motion.div>

      {/* User Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ padding: '32px', marginBottom: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
          <div style={{
            width: 80, height: 80,
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            fontWeight: 700,
            color: 'var(--text-primary)'
          }}>
            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>
              {profile.firstName} {profile.lastName}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>{profile.email}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                background: `${getStatusColor(profile.status)}15`,
                color: getStatusColor(profile.status)
              }}>
                {profile.status}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Role: {profile.role}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Member since {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {isEditing ? <X size={16} /> : <Edit3 size={16} />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button
              onClick={exportUserData}
              className="btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Download size={16} />
              Export Data
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              12
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Applications</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              8
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Approved</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              2.3
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Avg Processing Time</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              95%
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Completion Rate</div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--glass-border)', paddingBottom: 16 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn-ghost ${activeTab === tab.id ? 'active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-blue)' : 'none',
              borderRadius: activeTab === tab.id ? '8px 8px 0 0' : 8,
              background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent'
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ padding: '32px' }}
      >
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Personal Information</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={isEditing ? editProfile.firstName : profile.firstName}
                  onChange={(e) => setEditProfile({ ...editProfile, firstName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={isEditing ? editProfile.lastName : profile.lastName}
                  onChange={(e) => setEditProfile({ ...editProfile, lastName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={isEditing ? editProfile.email : profile.email}
                  onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={isEditing ? editProfile.phone : profile.phone}
                  onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-input"
                  value={isEditing ? editProfile.dateOfBirth : profile.dateOfBirth}
                  onChange={(e) => setEditProfile({ ...editProfile, dateOfBirth: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Country</label>
                <select
                  className="form-input"
                  value={isEditing ? editProfile.country : profile.country}
                  onChange={(e) => setEditProfile({ ...editProfile, country: e.target.value })}
                  disabled={!isEditing}
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Germany</option>
                  <option>France</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Address</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={isEditing ? editProfile.address : profile.address}
                    onChange={(e) => setEditProfile({ ...editProfile, address: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    value={isEditing ? editProfile.city : profile.city}
                    onChange={(e) => setEditProfile({ ...editProfile, city: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Postal Code</label>
                  <input
                    type="text"
                    className="form-input"
                    value={isEditing ? editProfile.postalCode : profile.postalCode}
                    onChange={(e) => setEditProfile({ ...editProfile, postalCode: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                <button onClick={handleSaveProfile} className="btn-primary">
                  <Save size={16} style={{ marginRight: 8 }} />
                  Save Changes
                </button>
                <button onClick={handleCancelEdit} className="btn-secondary">
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Security Settings</h3>
            
            <div style={{ marginBottom: 32 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Change Password</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      className="form-input"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      style={{ paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      style={{ paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
              
              <button onClick={handlePasswordChange} className="btn-primary" style={{ marginTop: 16 }}>
                <Lock size={16} style={{ marginRight: 8 }} />
                Update Password
              </button>
            </div>

            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Two-Factor Authentication</h4>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>Two-Factor Authentication</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      Add an extra layer of security to your account
                    </div>
                  </div>
                  <button
                    className={`btn-${profile.twoFactorEnabled ? 'secondary' : 'primary'}`}
                    style={{ padding: '8px 16px' }}
                  >
                    {profile.twoFactorEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Notification Preferences</h3>
            
            <div style={{ display: 'grid', gap: 16 }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>Email Notifications</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      Receive updates about your applications via email
                    </div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: 50, height: 24 }}>
                    <input
                      type="checkbox"
                      checked={profile.emailNotifications}
                      onChange={(e) => setProfile({ ...profile, emailNotifications: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: profile.emailNotifications ? 'var(--accent-blue)' : 'var(--glass-border)',
                      transition: '.4s',
                      borderRadius: 24
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: 18,
                        width: 18,
                        left: profile.emailNotifications ? 26 : 3,
                        bottom: 3,
                        backgroundColor: 'var(--text-primary)',
                        transition: '.4s',
                        borderRadius: '50%'
                      }} />
                    </span>
                  </label>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>SMS Notifications</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      Receive important updates via SMS
                    </div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: 50, height: 24 }}>
                    <input
                      type="checkbox"
                      checked={profile.smsNotifications}
                      onChange={(e) => setProfile({ ...profile, smsNotifications: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: profile.smsNotifications ? 'var(--accent-blue)' : 'var(--glass-border)',
                      transition: '.4s',
                      borderRadius: 24
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: 18,
                        width: 18,
                        left: profile.smsNotifications ? 26 : 3,
                        bottom: 3,
                        backgroundColor: 'var(--text-primary)',
                        transition: '.4s',
                        borderRadius: '50%'
                      }} />
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Preferences</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              <div className="form-group">
                <label className="form-label">Language</label>
                <select
                  className="form-input"
                  value={profile.language}
                  onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Timezone</label>
                <select
                  className="form-input"
                  value={profile.timezone}
                  onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Currency</label>
                <select
                  className="form-input"
                  value={profile.currency}
                  onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>My Documents</h3>
            
            <div style={{ display: 'grid', gap: 16 }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>Passport</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Uploaded on Jan 15, 2024 • Status: Verified
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}>
                      <Eye size={14} style={{ marginRight: 4 }} /> View
                    </button>
                    <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}>
                      <Download size={14} style={{ marginRight: 4 }} /> Download
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>Driver's License</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Uploaded on Jan 15, 2024 • Status: Verified
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}>
                      <Eye size={14} style={{ marginRight: 4 }} /> View
                    </button>
                    <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}>
                      <Download size={14} style={{ marginRight: 4 }} /> Download
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button className="btn-primary" style={{ marginTop: 24 }}>
              <Upload size={16} style={{ marginRight: 8 }} />
              Upload New Document
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
