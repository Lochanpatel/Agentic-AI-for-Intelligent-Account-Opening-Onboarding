import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { ArrowRight, User } from 'lucide-react';
const NATIONALITIES = ['US', 'UK', 'IN', 'DE', 'FR', 'SG', 'AE', 'AU', 'CA', 'JP', 'Other'];
export default function Step1PersonalInfo() {
    const { setApplicant, setSessionId, setStep } = useOnboardingStore();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        first_name: '', last_name: '', email: '', phone: '',
        date_of_birth: '', nationality: 'US', address: '', tax_id: '',
    });
    const set = (k, v) => {
        setForm(f => ({ ...f, [k]: v }));
        if (errors[k])
            setErrors(e => ({ ...e, [k]: undefined }));
    };
    const validate = () => {
        const e = {};
        if (!form.first_name.trim())
            e.first_name = 'Required';
        if (!form.last_name.trim())
            e.last_name = 'Required';
        if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/))
            e.email = 'Invalid email';
        if (!form.phone.trim())
            e.phone = 'Required';
        if (!form.date_of_birth)
            e.date_of_birth = 'Required';
        if (!form.address.trim())
            e.address = 'Required';
        if (!form.tax_id.trim())
            e.tax_id = 'Required (SSN/TIN)';
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        setLoading(true);
        try {
            // Defer creating session until ALL steps are done, or we only update applicant now.
            // Wait, in the MVP we created session here. With Deep KYC, we should create session after all forms, 
            // or update it. Let's just hold it in Zustand till Step 2 creates it!
            setApplicant(form);
            setStep(2);
        }
        catch (err) {
            alert('Failed to create session. Is the backend running?');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "glass-card", style: { padding: '40px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }, children: [_jsx("div", { style: { width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(User, { size: 18, color: "var(--accent-blue)" }) }), _jsxs("div", { children: [_jsx("h2", { style: { fontSize: 20, fontWeight: 700 }, children: "Personal Information" }), _jsx("p", { style: { fontSize: 13, color: 'var(--text-muted)' }, children: "Tell us about yourself" })] })] }), _jsxs("form", { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: 20 }, children: [_jsxs("div", { className: "grid-2", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "First Name" }), _jsx("input", { className: `form-input${errors.first_name ? ' error' : ''}`, value: form.first_name, onChange: e => set('first_name', e.target.value), placeholder: "John" }), errors.first_name && _jsx("span", { style: { fontSize: 12, color: 'var(--accent-red)' }, children: errors.first_name })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Last Name" }), _jsx("input", { className: `form-input${errors.last_name ? ' error' : ''}`, value: form.last_name, onChange: e => set('last_name', e.target.value), placeholder: "Doe" }), errors.last_name && _jsx("span", { style: { fontSize: 12, color: 'var(--accent-red)' }, children: errors.last_name })] })] }), _jsxs("div", { className: "grid-2", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Email Address" }), _jsx("input", { className: `form-input${errors.email ? ' error' : ''}`, type: "email", value: form.email, onChange: e => set('email', e.target.value), placeholder: "john@example.com" }), errors.email && _jsx("span", { style: { fontSize: 12, color: 'var(--accent-red)' }, children: errors.email })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Phone Number" }), _jsx("input", { className: `form-input${errors.phone ? ' error' : ''}`, value: form.phone, onChange: e => set('phone', e.target.value), placeholder: "+1 234 567 8900" }), errors.phone && _jsx("span", { style: { fontSize: 12, color: 'var(--accent-red)' }, children: errors.phone })] })] }), _jsxs("div", { className: "grid-2", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Date of Birth" }), _jsx("input", { className: `form-input${errors.date_of_birth ? ' error' : ''}`, type: "date", value: form.date_of_birth, onChange: e => set('date_of_birth', e.target.value) }), errors.date_of_birth && _jsx("span", { style: { fontSize: 12, color: 'var(--accent-red)' }, children: errors.date_of_birth })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Nationality" }), _jsx("select", { className: "form-input", value: form.nationality, onChange: e => set('nationality', e.target.value), style: { appearance: 'auto' }, children: NATIONALITIES.map(n => _jsx("option", { value: n, children: n }, n)) })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Residential Address" }), _jsx("input", { className: `form-input${errors.address ? ' error' : ''}`, value: form.address, onChange: e => set('address', e.target.value), placeholder: "123 Main St, City, State, ZIP" }), errors.address && _jsx("span", { style: { fontSize: 12, color: 'var(--accent-red)' }, children: errors.address })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Tax ID (SSN / TIN)" }), _jsx("input", { className: `form-input${errors.tax_id ? ' error' : ''}`, value: form.tax_id, onChange: e => set('tax_id', e.target.value), placeholder: "000-00-0000" }), errors.tax_id && _jsx("span", { style: { fontSize: 12, color: 'var(--accent-red)' }, children: errors.tax_id })] }), _jsx("div", { style: { display: 'flex', justifyContent: 'flex-end', marginTop: 8 }, children: _jsx("button", { type: "submit", className: "btn-primary", disabled: loading, style: { display: 'flex', alignItems: 'center', gap: 8 }, children: loading ? 'Creating session...' : (_jsxs(_Fragment, { children: ["Continue ", _jsx(ArrowRight, { size: 16 })] })) }) })] })] }));
}
