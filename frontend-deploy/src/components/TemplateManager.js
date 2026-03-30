import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Mail, MessageSquare, Plus, Edit3, Trash2, Save, X, Eye, Send, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
const defaultTemplates = [
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
    const [templates, setTemplates] = useState(defaultTemplates);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [filterLanguage, setFilterLanguage] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTemplate, setEditingTemplate] = useState({});
    const filteredTemplates = templates.filter(template => {
        const matchesType = filterType === 'all' || template.type === filterType;
        const matchesLanguage = filterLanguage === 'all' || template.language === filterLanguage;
        const matchesSearch = !searchTerm ||
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.content.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesLanguage && matchesSearch;
    });
    const handleCreateTemplate = () => {
        const newTemplate = {
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
    const handleEditTemplate = (template) => {
        setEditingTemplate({ ...template });
        setIsEditing(true);
        setSelectedTemplate(template);
    };
    const handleSaveTemplate = () => {
        if (!editingTemplate.id) {
            // Create new template
            setTemplates([...templates, editingTemplate]);
        }
        else {
            // Update existing template
            setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
        }
        setIsEditing(false);
        setEditingTemplate({});
    };
    const handleDeleteTemplate = (templateId) => {
        if (confirm('Are you sure you want to delete this template?')) {
            setTemplates(templates.filter(t => t.id !== templateId));
            if (selectedTemplate?.id === templateId) {
                setSelectedTemplate(null);
            }
        }
    };
    const handleToggleActive = (templateId) => {
        setTemplates(templates.map(t => t.id === templateId ? { ...t, isActive: !t.isActive } : t));
    };
    const handleSendTest = () => {
        if (!selectedTemplate)
            return;
        alert(`Test ${selectedTemplate.type} would be sent with current template content`);
    };
    const previewContent = (template, previewData = {}) => {
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
            content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });
        return content;
    };
    const getTemplateIcon = (type) => {
        return type === 'email' ? Mail : MessageSquare;
    };
    const getLanguageFlag = (language) => {
        const flags = {
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
    return (_jsxs("div", { style: { padding: '20px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }, children: [_jsxs("div", { children: [_jsx("h2", { style: { fontSize: 24, fontWeight: 700, marginBottom: 8 }, children: "Template Manager" }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: 14 }, children: "Customize email and SMS templates for different languages" })] }), _jsxs("button", { onClick: handleCreateTemplate, className: "btn-primary", style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx(Plus, { size: 16 }), " Create Template"] })] }), _jsx("div", { className: "glass-card", style: { padding: '20px', marginBottom: 24 }, children: _jsxs("div", { style: { display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }, children: [_jsxs("div", { style: { display: 'flex', gap: 8, alignItems: 'center' }, children: [_jsx("label", { style: { fontSize: 13, fontWeight: 500 }, children: "Type:" }), _jsxs("select", { value: filterType, onChange: (e) => setFilterType(e.target.value), className: "form-input", style: { fontSize: 13, width: 120 }, children: [_jsx("option", { value: "all", children: "All" }), _jsx("option", { value: "email", children: "Email" }), _jsx("option", { value: "sms", children: "SMS" })] })] }), _jsxs("div", { style: { display: 'flex', gap: 8, alignItems: 'center' }, children: [_jsx("label", { style: { fontSize: 13, fontWeight: 500 }, children: "Language:" }), _jsxs("select", { value: filterLanguage, onChange: (e) => setFilterLanguage(e.target.value), className: "form-input", style: { fontSize: 13, width: 120 }, children: [_jsx("option", { value: "all", children: "All" }), _jsx("option", { value: "en", children: "English" }), _jsx("option", { value: "es", children: "Espa\u00F1ol" }), _jsx("option", { value: "fr", children: "Fran\u00E7ais" }), _jsx("option", { value: "de", children: "Deutsch" })] })] }), _jsx("div", { style: { position: 'relative', flex: 1, maxWidth: 300 }, children: _jsx("input", { type: "text", placeholder: "Search templates...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "form-input", style: { fontSize: 13, width: '100%' } }) })] }) }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '400px 1fr', gap: 24 }, children: [_jsxs("div", { className: "glass-card", style: { padding: '0', overflow: 'hidden' }, children: [_jsx("div", { style: { padding: '16px 20px', borderBottom: '1px solid var(--glass-border)' }, children: _jsxs("h3", { style: { fontSize: 16, fontWeight: 600, margin: 0 }, children: ["Templates (", filteredTemplates.length, ")"] }) }), _jsx("div", { style: { maxHeight: 600, overflowY: 'auto' }, children: filteredTemplates.map((template) => {
                                    const Icon = getTemplateIcon(template.type);
                                    return (_jsxs("div", { onClick: () => setSelectedTemplate(template), style: {
                                            padding: '16px 20px',
                                            borderBottom: '1px solid var(--glass-border)',
                                            cursor: 'pointer',
                                            background: selectedTemplate?.id === template.id ? 'var(--accent-blue)10' : 'transparent',
                                            transition: 'background 0.2s'
                                        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }, children: [_jsx(Icon, { size: 16, color: "var(--accent-blue)" }), _jsx("span", { style: { fontWeight: 500, fontSize: 14 }, children: template.name }), _jsx("span", { style: { fontSize: 12 }, children: getLanguageFlag(template.language) }), template.isActive ? (_jsx(CheckCircle, { size: 14, color: "var(--accent-green)" })) : (_jsx(AlertTriangle, { size: 14, color: "var(--text-muted)" }))] }), _jsxs("div", { style: { fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }, children: [template.type, " \u2022 Used ", template.usageCount, " times", template.lastUsed && ` • Last used ${new Date(template.lastUsed).toLocaleDateString()}`] }), _jsxs("div", { style: { display: 'flex', gap: 8 }, children: [_jsxs("button", { onClick: (e) => {
                                                            e.stopPropagation();
                                                            handleEditTemplate(template);
                                                        }, className: "btn-ghost", style: { padding: '4px 8px', fontSize: 11 }, children: [_jsx(Edit3, { size: 12 }), " Edit"] }), _jsx("button", { onClick: (e) => {
                                                            e.stopPropagation();
                                                            handleToggleActive(template.id);
                                                        }, className: "btn-ghost", style: { padding: '4px 8px', fontSize: 11 }, children: template.isActive ? 'Disable' : 'Enable' }), _jsx("button", { onClick: (e) => {
                                                            e.stopPropagation();
                                                            handleDeleteTemplate(template.id);
                                                        }, className: "btn-ghost", style: { padding: '4px 8px', fontSize: 11, color: 'var(--accent-red)' }, children: _jsx(Trash2, { size: 12 }) })] })] }, template.id));
                                }) })] }), _jsx("div", { className: "glass-card", style: { padding: '24px' }, children: isEditing && editingTemplate ? (_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }, children: [_jsx("h3", { style: { fontSize: 18, fontWeight: 600, margin: 0 }, children: editingTemplate.id ? 'Edit Template' : 'Create Template' }), _jsxs("div", { style: { display: 'flex', gap: 8 }, children: [_jsxs("button", { onClick: () => setPreviewMode(!previewMode), className: "btn-ghost", style: { padding: '8px 12px', fontSize: 13 }, children: [_jsx(Eye, { size: 14, style: { marginRight: 4 } }), previewMode ? 'Edit' : 'Preview'] }), _jsxs("button", { onClick: handleSaveTemplate, className: "btn-primary", style: { padding: '8px 12px', fontSize: 13 }, children: [_jsx(Save, { size: 14, style: { marginRight: 4 } }), "Save"] }), _jsx("button", { onClick: () => {
                                                        setIsEditing(false);
                                                        setEditingTemplate({});
                                                        setPreviewMode(false);
                                                    }, className: "btn-ghost", style: { padding: '8px 12px', fontSize: 13 }, children: _jsx(X, { size: 14 }) })] })] }), previewMode ? (_jsxs("div", { children: [_jsx("h4", { style: { fontSize: 14, fontWeight: 600, marginBottom: 16 }, children: "Preview" }), _jsx("div", { className: "glass-card", style: { padding: '20px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }, children: _jsx("pre", { style: { whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }, children: previewContent(editingTemplate) }) })] })) : (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 20 }, children: [_jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Template Name" }), _jsx("input", { type: "text", className: "form-input", value: editingTemplate.name || '', onChange: (e) => setEditingTemplate({ ...editingTemplate, name: e.target.value }) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Type" }), _jsxs("select", { className: "form-input", value: editingTemplate.type || 'email', onChange: (e) => setEditingTemplate({ ...editingTemplate, type: e.target.value }), children: [_jsx("option", { value: "email", children: "Email" }), _jsx("option", { value: "sms", children: "SMS" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Language" }), _jsxs("select", { className: "form-input", value: editingTemplate.language || 'en', onChange: (e) => setEditingTemplate({ ...editingTemplate, language: e.target.value }), children: [_jsx("option", { value: "en", children: "English" }), _jsx("option", { value: "es", children: "Espa\u00F1ol" }), _jsx("option", { value: "fr", children: "Fran\u00E7ais" }), _jsx("option", { value: "de", children: "Deutsch" })] })] }), editingTemplate.type === 'email' && (_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Subject" }), _jsx("input", { type: "text", className: "form-input", value: editingTemplate.subject || '', onChange: (e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value }) })] }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Content" }), _jsx("textarea", { className: "form-input", rows: 12, value: editingTemplate.content || '', onChange: (e) => setEditingTemplate({ ...editingTemplate, content: e.target.value }), placeholder: "Enter template content. Use {{variableName}} for dynamic variables." })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Variables Used" }), _jsxs("div", { style: { fontSize: 13, color: 'var(--text-secondary)' }, children: ["Common variables: ", '{{firstName}}', ", ", '{{lastName}}', ", ", '{{email}}', ", ", '{{accountType}}', ", ", '{{applicationId}}'] })] })] }))] })) : selectedTemplate ? (_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }, children: [_jsx("h3", { style: { fontSize: 18, fontWeight: 600, margin: 0 }, children: selectedTemplate.name }), _jsxs("div", { style: { display: 'flex', gap: 8 }, children: [_jsxs("button", { onClick: handleSendTest, className: "btn-primary", style: { padding: '8px 12px', fontSize: 13 }, children: [_jsx(Send, { size: 14, style: { marginRight: 4 } }), "Send Test"] }), _jsxs("button", { onClick: () => handleEditTemplate(selectedTemplate), className: "btn-ghost", style: { padding: '8px 12px', fontSize: 13 }, children: [_jsx(Edit3, { size: 14, style: { marginRight: 4 } }), "Edit"] })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }, children: "Type" }), _jsx("div", { style: { fontWeight: 500 }, children: selectedTemplate.type })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }, children: "Language" }), _jsxs("div", { style: { fontWeight: 500 }, children: [getLanguageFlag(selectedTemplate.language), " ", selectedTemplate.language] })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }, children: "Status" }), _jsx("div", { style: { fontWeight: 500, color: selectedTemplate.isActive ? 'var(--accent-green)' : 'var(--text-muted)' }, children: selectedTemplate.isActive ? 'Active' : 'Inactive' })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }, children: "Usage" }), _jsxs("div", { style: { fontWeight: 500 }, children: [selectedTemplate.usageCount, " times"] })] })] }), _jsxs("div", { children: [_jsx("h4", { style: { fontSize: 14, fontWeight: 600, marginBottom: 12 }, children: "Content Preview" }), _jsx("div", { className: "glass-card", style: { padding: '20px', background: 'var(--bg-primary)', color: 'var(--text-primary)', maxHeight: 400, overflowY: 'auto' }, children: _jsx("pre", { style: { whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }, children: previewContent(selectedTemplate) }) })] })] })) : (_jsxs("div", { style: { textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }, children: [_jsx(FileText, { size: 48, style: { margin: '0 auto 16px', opacity: 0.5 } }), _jsx("div", { style: { fontSize: 16, fontWeight: 500, marginBottom: 8 }, children: "Select a template to view" }), _jsx("div", { style: { fontSize: 14 }, children: "Choose from the list or create a new template" })] })) })] })] }));
}
