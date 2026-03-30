import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Plus, Edit3, Trash2, Save, X, Eye, Send, FileText, Settings, Globe, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  language: string;
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
}

const defaultTemplates: Template[] = [
  {
    id: 'welcome_email',
    name: 'Welcome Email',
    type: 'email',
    language: 'en',
    subject: 'Welcome to OnboardAI - Your Account Has Been Created',
    content: `Dear {{firstName}} {{lastName}},

Welcome to OnboardAI! Your account has been successfully created.

Account Details:
- Email: {{email}}
- Account Type: {{accountType}}
- Created: {{createdAt}}

Next Steps:
1. Complete your profile verification
2. Upload required documents
3. Start enjoying our services

If you have any questions, please don't hesitate to contact our support team.

Best regards,
The OnboardAI Team`,
    variables: ['firstName', 'lastName', 'email', 'accountType', 'createdAt'],
    isActive: true,
    createdAt: '2024-01-15',
    usageCount: 145,
  },
  {
    id: 'approval_sms',
    name: 'Application Approved',
    type: 'sms',
    language: 'en',
    content: `Hi {{firstName}}! Great news! Your {{accountType}} application has been APPROVED. Welcome to OnboardAI! Login to get started: {{loginUrl}}`,
    variables: ['firstName', 'accountType', 'loginUrl'],
    isActive: true,
    createdAt: '2024-01-15',
    usageCount: 89,
  },
  {
    id: 'rejection_email',
    name: 'Application Rejected',
    type: 'email',
    language: 'en',
    subject: 'Regarding Your OnboardAI Application',
    content: `Dear {{firstName}} {{lastName}},

We regret to inform you that your application for {{accountType}} could not be approved at this time.

Application Details:
- Application ID: {{applicationId}}
- Submitted: {{submissionDate}}
- Reason: {{rejectionReason}}

If you believe this is an error or would like to appeal this decision, please contact our support team within 30 days.

Thank you for your interest in OnboardAI.

Best regards,
The OnboardAI Team`,
    variables: ['firstName', 'lastName', 'accountType', 'applicationId', 'submissionDate', 'rejectionReason'],
    isActive: true,
    createdAt: '2024-01-15',
    usageCount: 23,
  },
];

export default function TemplateManager() {
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'email' | 'sms'>('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [editingTemplate, setEditingTemplate] = useState<Partial<Template>>({});

  const filteredTemplates = templates.filter(template => {
    const matchesType = filterType === 'all' || template.type === filterType;
    const matchesLanguage = filterLanguage === 'all' || template.language === filterLanguage;
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesLanguage && matchesSearch;
  });

  const handleCreateTemplate = () => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: 'New Template',
      type: 'email',
      language: 'en',
      subject: '',
      content: '',
      variables: [],
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      usageCount: 0,
    };
    setEditingTemplate(newTemplate);
    setIsEditing(true);
    setSelectedTemplate(newTemplate);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate({ ...template });
    setIsEditing(true);
    setSelectedTemplate(template);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate.id) {
      // Create new template
      setTemplates([...templates, editingTemplate as Template]);
    } else {
      // Update existing template
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id ? editingTemplate as Template : t
      ));
    }
    setIsEditing(false);
    setEditingTemplate({});
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== templateId));
      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(null);
      }
    }
  };

  const handleToggleActive = (templateId: string) => {
    setTemplates(templates.map(t => 
      t.id === templateId ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const handleSendTest = () => {
    if (!selectedTemplate) return;
    alert(`Test ${selectedTemplate.type} would be sent with current template content`);
  };

  const previewContent = (template: Template, previewData: any = {}) => {
    let content = template.content;
    if (template.subject) {
      content = `Subject: ${template.subject}\n\n${content}`;
    }
    
    // Replace variables with sample data
    const sampleData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      accountType: 'Premium',
      applicationId: 'APP-12345',
      rejectionReason: 'Insufficient documentation',
      loginUrl: 'https://app.onboardai.com/login',
      createdAt: new Date().toLocaleDateString(),
      submissionDate: new Date().toLocaleDateString(),
      ...previewData
    };

    Object.entries(sampleData).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
    });

    return content;
  };

  const getTemplateIcon = (type: string) => {
    return type === 'email' ? Mail : MessageSquare;
  };

  const getLanguageFlag = (language: string) => {
    const flags: Record<string, string> = {
      en: '🇺🇸',
      es: '🇪🇸',
      fr: '🇫🇷',
      de: '🇩🇪',
      zh: '🇨🇳',
      ja: '🇯🇵',
      pt: '🇵🇹',
    };
    return flags[language] || '🌐';
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Template Manager</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Customize email and SMS templates for different languages
          </p>
        </div>
        <button onClick={handleCreateTemplate} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Create Template
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="form-input"
              style={{ fontSize: 13, width: 120 }}
            >
              <option value="all">All</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Language:</label>
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="form-input"
              style={{ fontSize: 13, width: 120 }}
            >
              <option value="all">All</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ fontSize: 13, width: '100%' }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 24 }}>
        {/* Templates List */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--glass-border)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Templates ({filteredTemplates.length})</h3>
          </div>
          
          <div style={{ maxHeight: 600, overflowY: 'auto' }}>
            {filteredTemplates.map((template) => {
              const Icon = getTemplateIcon(template.type);
              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--glass-border)',
                    cursor: 'pointer',
                    background: selectedTemplate?.id === template.id ? 'var(--accent-blue)10' : 'transparent',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <Icon size={16} color="var(--accent-blue)" />
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{template.name}</span>
                    <span style={{ fontSize: 12 }}>{getLanguageFlag(template.language)}</span>
                    {template.isActive ? (
                      <CheckCircle size={14} color="var(--accent-green)" />
                    ) : (
                      <AlertTriangle size={14} color="var(--text-muted)" />
                    )}
                  </div>
                  
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                    {template.type} • Used {template.usageCount} times
                    {template.lastUsed && ` • Last used ${new Date(template.lastUsed).toLocaleDateString()}`}
                  </div>
                  
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTemplate(template);
                      }}
                      className="btn-ghost"
                      style={{ padding: '4px 8px', fontSize: 11 }}
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(template.id);
                      }}
                      className="btn-ghost"
                      style={{ padding: '4px 8px', fontSize: 11 }}
                    >
                      {template.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplate(template.id);
                      }}
                      className="btn-ghost"
                      style={{ padding: '4px 8px', fontSize: 11, color: 'var(--accent-red)' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Template Editor/Preview */}
        <div className="glass-card" style={{ padding: '24px' }}>
          {isEditing && editingTemplate ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
                  {editingTemplate.id ? 'Edit Template' : 'Create Template'}
                </h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="btn-ghost"
                    style={{ padding: '8px 12px', fontSize: 13 }}
                  >
                    <Eye size={14} style={{ marginRight: 4 }} />
                    {previewMode ? 'Edit' : 'Preview'}
                  </button>
                  <button
                    onClick={handleSaveTemplate}
                    className="btn-primary"
                    style={{ padding: '8px 12px', fontSize: 13 }}
                  >
                    <Save size={14} style={{ marginRight: 4 }} />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditingTemplate({});
                      setPreviewMode(false);
                    }}
                    className="btn-ghost"
                    style={{ padding: '8px 12px', fontSize: 13 }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {previewMode ? (
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Preview</h4>
                  <div className="glass-card" style={{ padding: '20px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                      {previewContent(editingTemplate as Template)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Template Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editingTemplate.name || ''}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Type</label>
                      <select
                        className="form-input"
                        value={editingTemplate.type || 'email'}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, type: e.target.value as any })}
                      >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Language</label>
                      <select
                        className="form-input"
                        value={editingTemplate.language || 'en'}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, language: e.target.value })}
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                    
                    {editingTemplate.type === 'email' && (
                      <div className="form-group">
                        <label className="form-label">Subject</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editingTemplate.subject || ''}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Content</label>
                    <textarea
                      className="form-input"
                      rows={12}
                      value={editingTemplate.content || ''}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                      placeholder="Enter template content. Use {{variableName}} for dynamic variables."
                    />
                  </div>

                  <div>
                    <label className="form-label">Variables Used</label>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      Common variables: {'{{firstName}}'}, {'{{lastName}}'}, {'{{email}}'}, {'{{accountType}}'}, {'{{applicationId}}'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : selectedTemplate ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{selectedTemplate.name}</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleSendTest}
                    className="btn-primary"
                    style={{ padding: '8px 12px', fontSize: 13 }}
                  >
                    <Send size={14} style={{ marginRight: 4 }} />
                    Send Test
                  </button>
                  <button
                    onClick={() => handleEditTemplate(selectedTemplate)}
                    className="btn-ghost"
                    style={{ padding: '8px 12px', fontSize: 13 }}
                  >
                    <Edit3 size={14} style={{ marginRight: 4 }} />
                    Edit
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Type</div>
                  <div style={{ fontWeight: 500 }}>{selectedTemplate.type}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Language</div>
                  <div style={{ fontWeight: 500 }}>{getLanguageFlag(selectedTemplate.language)} {selectedTemplate.language}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Status</div>
                  <div style={{ fontWeight: 500, color: selectedTemplate.isActive ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                    {selectedTemplate.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Usage</div>
                  <div style={{ fontWeight: 500 }}>{selectedTemplate.usageCount} times</div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Content Preview</h4>
                <div className="glass-card" style={{ padding: '20px', background: 'var(--bg-primary)', color: 'var(--text-primary)', maxHeight: 400, overflowY: 'auto' }}>
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                    {previewContent(selectedTemplate)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Select a template to view</div>
              <div style={{ fontSize: 14 }}>Choose from the list or create a new template</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
