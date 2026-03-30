import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { createSession } from '../../api/client';
import { ArrowRight, Briefcase } from 'lucide-react';
const EMPLOYMENT_STATUSES = ['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Student'];
const FUNDING_SOURCES = ['Salary', 'Business Income', 'Investments', 'Inheritance', 'Savings'];
export default function Step2Financials() {
    const { applicant, setApplicant, setSessionId, setStep } = useOnboardingStore();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        employment_status: 'Employed',
        annual_income: '',
        source_of_funds: 'Salary',
        expected_monthly_volume: '',
        pep_declaration: 'no',
    });
    const set = (k, v) => {
        setForm(f => ({ ...f, [k]: v }));
        if (errors[k])
            setErrors(e => ({ ...e, [k]: undefined }));
    };
    const validate = () => {
        const e = {};
        if (!form.annual_income || isNaN(Number(form.annual_income)))
            e.annual_income = 'Valid number required';
        if (!form.expected_monthly_volume || isNaN(Number(form.expected_monthly_volume)))
            e.expected_monthly_volume = 'Valid number required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        setLoading(true);
        // Merge step 1 and step 2 data
        const fullApplicantData = {
            ...applicant,
            employment_status: form.employment_status,
            annual_income: Number(form.annual_income),
            source_of_funds: form.source_of_funds,
            expected_monthly_volume: Number(form.expected_monthly_volume),
            pep_declaration: form.pep_declaration === 'yes'
        };
        try {
            // Create session now that we have all mandatory bio/fin data
            console.log('Creating session with data:', fullApplicantData);
            const res = await createSession({ applicant: fullApplicantData });
            console.log('Session created successfully:', res.data);
            setApplicant(fullApplicantData);
            setSessionId(res.data.session_id);
            setStep(3); // Move to Document Upload
        }
        catch (err) {
            console.error('Session creation failed:', err);
            alert(`Failed to connect to backend and initialize session: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "glass-card", style: { padding: '40px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }, children: [_jsx("div", { style: { width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(Briefcase, { size: 18, color: "var(--accent-blue)" }) }), _jsxs("div", { children: [_jsx("h2", { style: { fontSize: 20, fontWeight: 700 }, children: "Financial Profile" }), _jsx("p", { style: { fontSize: 13, color: 'var(--text-muted)' }, children: "Required for anti-money laundering compliance" })] })] }), _jsxs("form", { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: 20 }, children: [_jsxs("div", { className: "grid-2", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Employment Status" }), _jsx("select", { className: "form-input", value: form.employment_status, onChange: e => set('employment_status', e.target.value), style: { appearance: 'auto' }, children: EMPLOYMENT_STATUSES.map(n => _jsx("option", { value: n, children: n }, n)) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Annual Income (USD)" }), _jsx("input", { className: `form-input${errors.annual_income ? ' error' : ''}`, type: "number", value: form.annual_income, onChange: e => set('annual_income', e.target.value), placeholder: "85000" }), errors.annual_income && _jsx("span", { style: { fontSize: 12, color: 'var(--accent-red)' }, children: errors.annual_income })] })] }), _jsxs("div", { className: "grid-2", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Source of Funds" }), _jsx("select", { className: "form-input", value: form.source_of_funds, onChange: e => set('source_of_funds', e.target.value), style: { appearance: 'auto' }, children: FUNDING_SOURCES.map(n => _jsx("option", { value: n, children: n }, n)) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Expected Monthly Volume (USD)" }), _jsx("input", { className: `form-input${errors.expected_monthly_volume ? ' error' : ''}`, type: "number", value: form.expected_monthly_volume, onChange: e => set('expected_monthly_volume', e.target.value), placeholder: "5000" }), errors.expected_monthly_volume && _jsx("span", { style: { fontSize: 12, color: 'var(--accent-red)' }, children: errors.expected_monthly_volume })] })] }), _jsxs("div", { className: "form-group", style: { background: 'rgba(239, 68, 68, 0.05)', padding: 16, borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.1)' }, children: [_jsx("p", { style: { fontSize: 14, fontWeight: 600, marginBottom: 8 }, children: "Politically Exposed Person (PEP) Declaration" }), _jsx("p", { style: { fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }, children: "Are you, or an immediate family member, a senior political figure, senior government official, or closely associated with one?" }), _jsxs("div", { style: { display: 'flex', gap: 16 }, children: [_jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }, children: [_jsx("input", { type: "radio", value: "yes", checked: form.pep_declaration === 'yes', onChange: () => set('pep_declaration', 'yes') }), " Yes"] }), _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }, children: [_jsx("input", { type: "radio", value: "no", checked: form.pep_declaration === 'no', onChange: () => set('pep_declaration', 'no') }), " No, I am not"] })] })] }), _jsx("div", { style: { display: 'flex', justifyContent: 'flex-end', marginTop: 8 }, children: _jsx("button", { type: "submit", className: "btn-primary", disabled: loading, style: { display: 'flex', alignItems: 'center', gap: 8 }, children: loading ? 'Creating session...' : (_jsxs(_Fragment, { children: ["Continue ", _jsx(ArrowRight, { size: 16 })] })) }) })] })] }));
}
