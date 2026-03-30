import React, { useState } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { createSession } from '../../api/client';
import { ArrowRight, Briefcase } from 'lucide-react';

interface FormData {
  employment_status: string;
  annual_income: string;
  source_of_funds: string;
  expected_monthly_volume: string;
  pep_declaration: string;
}

const EMPLOYMENT_STATUSES = ['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Student'];
const FUNDING_SOURCES = ['Salary', 'Business Income', 'Investments', 'Inheritance', 'Savings'];

export default function Step2Financials() {
  const { applicant, setApplicant, setSessionId, setStep } = useOnboardingStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [form, setForm] = useState<FormData>({
    employment_status: 'Employed',
    annual_income: '',
    source_of_funds: 'Salary',
    expected_monthly_volume: '',
    pep_declaration: 'no',
  });

  const set = (k: keyof FormData, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.annual_income || isNaN(Number(form.annual_income))) e.annual_income = 'Valid number required';
    if (!form.expected_monthly_volume || isNaN(Number(form.expected_monthly_volume))) e.expected_monthly_volume = 'Valid number required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
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
      const res = await createSession({ applicant: fullApplicantData as any });
      console.log('Session created successfully:', res.data);
      setApplicant(fullApplicantData as any);
      setSessionId(res.data.session_id);
      setStep(3); // Move to Document Upload
    } catch (err) {
      console.error('Session creation failed:', err);
      alert(`Failed to connect to backend and initialize session: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Briefcase size={18} color="var(--accent-blue)" />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Financial Profile</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Required for anti-money laundering compliance</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Employment Status</label>
            <select className="form-input" value={form.employment_status} onChange={e => set('employment_status', e.target.value)} style={{ appearance: 'auto' }}>
              {EMPLOYMENT_STATUSES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Annual Income (USD)</label>
            <input className={`form-input${errors.annual_income ? ' error' : ''}`} type="number" value={form.annual_income} onChange={e => set('annual_income', e.target.value)} placeholder="85000" />
            {errors.annual_income && <span style={{ fontSize: 12, color: 'var(--accent-red)' }}>{errors.annual_income}</span>}
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Source of Funds</label>
            <select className="form-input" value={form.source_of_funds} onChange={e => set('source_of_funds', e.target.value)} style={{ appearance: 'auto' }}>
              {FUNDING_SOURCES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Expected Monthly Volume (USD)</label>
            <input className={`form-input${errors.expected_monthly_volume ? ' error' : ''}`} type="number" value={form.expected_monthly_volume} onChange={e => set('expected_monthly_volume', e.target.value)} placeholder="5000" />
            {errors.expected_monthly_volume && <span style={{ fontSize: 12, color: 'var(--accent-red)' }}>{errors.expected_monthly_volume}</span>}
          </div>
        </div>

        <div className="form-group" style={{ background: 'rgba(239, 68, 68, 0.05)', padding: 16, borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.1)' }}>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Politically Exposed Person (PEP) Declaration</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Are you, or an immediate family member, a senior political figure, senior government official, or closely associated with one?
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
              <input type="radio" value="yes" checked={form.pep_declaration === 'yes'} onChange={() => set('pep_declaration', 'yes')} /> Yes
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
              <input type="radio" value="no" checked={form.pep_declaration === 'no'} onChange={() => set('pep_declaration', 'no')} /> No, I am not
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {loading ? 'Creating session...' : (<>Continue <ArrowRight size={16} /></>)}
          </button>
        </div>
      </form>
    </div>
  );
}
