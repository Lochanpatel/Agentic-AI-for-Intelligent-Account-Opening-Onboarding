import React, { useState } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { createSession } from '../../api/client';
import { ArrowRight, User } from 'lucide-react';

interface FormData {
  first_name: string; last_name: string; email: string;
  phone: string; date_of_birth: string; nationality: string; address: string;
}

const NATIONALITIES = ['US', 'UK', 'IN', 'DE', 'FR', 'SG', 'AE', 'AU', 'CA', 'JP', 'Other'];

export default function Step1PersonalInfo() {
  const { setApplicant, setSessionId, setStep } = useOnboardingStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [form, setForm] = useState<FormData>({
    first_name: '', last_name: '', email: '', phone: '',
    date_of_birth: '', nationality: 'US', address: '',
  });

  const set = (k: keyof FormData, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.first_name.trim()) e.first_name = 'Required';
    if (!form.last_name.trim()) e.last_name = 'Required';
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = 'Invalid email';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.date_of_birth) e.date_of_birth = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await createSession({ applicant: form });
      setApplicant(form);
      setSessionId(res.data.session_id);
      setStep(2);
    } catch (err) {
      alert('Failed to create session. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={18} color="var(--accent-blue)" />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Personal Information</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Tell us about yourself</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input className={`form-input${errors.first_name ? ' error' : ''}`} value={form.first_name} onChange={e => set('first_name', e.target.value)} placeholder="John" />
            {errors.first_name && <span style={{ fontSize: 12, color: 'var(--accent-red)' }}>{errors.first_name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input className={`form-input${errors.last_name ? ' error' : ''}`} value={form.last_name} onChange={e => set('last_name', e.target.value)} placeholder="Doe" />
            {errors.last_name && <span style={{ fontSize: 12, color: 'var(--accent-red)' }}>{errors.last_name}</span>}
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className={`form-input${errors.email ? ' error' : ''}`} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" />
            {errors.email && <span style={{ fontSize: 12, color: 'var(--accent-red)' }}>{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className={`form-input${errors.phone ? ' error' : ''}`} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 234 567 8900" />
            {errors.phone && <span style={{ fontSize: 12, color: 'var(--accent-red)' }}>{errors.phone}</span>}
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input className={`form-input${errors.date_of_birth ? ' error' : ''}`} type="date" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} />
            {errors.date_of_birth && <span style={{ fontSize: 12, color: 'var(--accent-red)' }}>{errors.date_of_birth}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Nationality</label>
            <select className="form-input" value={form.nationality} onChange={e => set('nationality', e.target.value)} style={{ appearance: 'auto' }}>
              {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Residential Address</label>
          <input className={`form-input${errors.address ? ' error' : ''}`} value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main St, City, State, ZIP" />
          {errors.address && <span style={{ fontSize: 12, color: 'var(--accent-red)' }}>{errors.address}</span>}
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
