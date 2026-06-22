// src/components/EnrollButton.tsx
import React, { useState } from 'react';
import { useEnrollment, EnrollmentData } from '../hooks/useEnrollment';

interface Props {
  activityId: string;
  activityTitle: string;
  profileId: string | null;
}

const RECURRENCE_OPTIONS = [
  { value: 'none',    label: 'O singură dată' },
  { value: 'weekly',  label: 'Săptămânal' },
  { value: 'monthly', label: 'Lunar' },
  { value: 'daily',   label: 'Zilnic' },
] as const;

const RECURRENCE_LABELS: Record<string, string> = {
  none: 'O singură dată', weekly: 'Săptămânal', monthly: 'Lunar', daily: 'Zilnic',
};

export function EnrollButton({ activityId, activityTitle, profileId }: Props) {
  const { enrolled, enrollment, loading, saving, enroll, unenroll } =
    useEnrollment(profileId, activityId);

  const [showForm, setShowForm]                   = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [error, setError]                         = useState('');
  const [form, setForm] = useState<EnrollmentData>({
    start_date: '', start_time: '', recurrence: 'none', notes: '',
  });

  const today = new Date().toISOString().split('T')[0];

  const btnBase: React.CSSProperties = {
    padding: '14px 20px',
    borderRadius: '50px',
    fontFamily: 'Playfair Display, serif',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #939D7A',
  };

  if (!profileId || loading) {
    return (
      <button disabled style={{ ...btnBase, backgroundColor: '#F0F2EC', color: '#939D7A', opacity: 0.6, cursor: 'default' }}>
        {loading ? '...' : 'M-am înscris'}
      </button>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.start_date) { setError('Selectează o dată.'); return; }
    if (!form.start_time) { setError('Selectează o oră.'); return; }
    try {
      await enroll(form);
      setShowForm(false);
    } catch {
      setError('A apărut o eroare. Încearcă din nou.');
    }
  };

  // ── Stare: deja inscris ──
  if (enrolled && enrollment) {
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            backgroundColor: '#F0FBF6', color: '#0A7A51',
            fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
            padding: '4px 12px', borderRadius: 20, width: 'fit-content',
          }}>
            ✓ Înscris
          </span>
          <span style={{ fontSize: 12, color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>
            {new Date(enrollment.start_date + 'T00:00:00').toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
            {' · '}{enrollment.start_time?.slice(0, 5)}
            {enrollment.recurrence !== 'none' && ` · ${RECURRENCE_LABELS[enrollment.recurrence]}`}
          </span>
          <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
            <button
              onClick={() => { setForm({ start_date: enrollment.start_date, start_time: enrollment.start_time?.slice(0,5), recurrence: enrollment.recurrence, notes: enrollment.notes || '' }); setShowForm(true); }}
              style={{ ...btnBase, padding: '8px 16px', fontSize: 13, backgroundColor: 'white', color: '#939D7A' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0F2EC')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
            >
              Modifică
            </button>
            <button
              onClick={() => setShowConfirmRemove(true)}
              style={{ ...btnBase, padding: '8px 16px', fontSize: 13, backgroundColor: 'white', color: '#C0392B', borderColor: '#C0392B' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF0EE')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
            >
              Anulează
            </button>
          </div>
        </div>

        {showConfirmRemove && (
          <Modal onClose={() => setShowConfirmRemove(false)}>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#3D3D3D', margin: '0 0 8px' }}>
              Anulezi înscrierea?
            </p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#A89E9C', margin: '0 0 24px' }}>
              Vei fi șters din calendar pentru <strong style={{ color: '#3D3D3D' }}>{activityTitle}</strong>.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowConfirmRemove(false)}
                style={{ ...btnBase, flex: 1, backgroundColor: 'white', color: '#939D7A' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0F2EC')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}>
                Nu, păstrează
              </button>
              <button onClick={async () => { await unenroll(); setShowConfirmRemove(false); }} disabled={saving}
                style={{ ...btnBase, flex: 1, backgroundColor: '#C0392B', color: 'white', borderColor: '#C0392B' }}>
                {saving ? 'Se șterge...' : 'Da, anulează'}
              </button>
            </div>
          </Modal>
        )}

        {showForm && (
          <EnrollForm
            title={activityTitle} form={form} setForm={setForm}
            error={error} saving={saving} today={today}
            onSubmit={handleSubmit} onClose={() => setShowForm(false)}
            isEdit btnBase={btnBase}
          />
        )}
      </>
    );
  }

  // ── Stare: neinscris ──
  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        style={{ ...btnBase, backgroundColor: '#939D7A', color: '#FDF0EE' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7A8465')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#939D7A')}
      >
        M-am înscris
      </button>

      {showForm && (
        <EnrollForm
          title={activityTitle} form={form} setForm={setForm}
          error={error} saving={saving} today={today}
          onSubmit={handleSubmit} onClose={() => setShowForm(false)}
          isEdit={false} btnBase={btnBase}
        />
      )}
    </>
  );
}

// ── Modal wrapper ──────────────────────────────────────────────────────────────
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'white', borderRadius: 20, border: '1px solid #F8DCD9', padding: 28, width: '100%', maxWidth: 420, position: 'relative' }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Formular inscriere ─────────────────────────────────────────────────────────
interface FormProps {
  title: string;
  form: EnrollmentData;
  setForm: React.Dispatch<React.SetStateAction<EnrollmentData>>;
  error: string;
  saving: boolean;
  today: string;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isEdit: boolean;
  btnBase: React.CSSProperties;
}

function EnrollForm({ title, form, setForm, error, saving, today, onSubmit, onClose, isEdit, btnBase }: FormProps) {
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 12,
    border: '1px solid #F8DCD9', fontFamily: 'DM Sans, sans-serif',
    fontSize: 15, color: '#3D3D3D', outline: 'none', boxSizing: 'border-box',
    backgroundColor: 'white',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600,
    color: '#A89E9C', textTransform: 'uppercase', letterSpacing: '0.05em',
    marginBottom: 6, display: 'block',
  };

  return (
    <Modal onClose={onClose}>
      <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 18, color: '#A89E9C', cursor: 'pointer' }}>✕</button>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#3D3D3D', margin: '0 0 4px' }}>
          {isEdit ? 'Modifică înscrierea' : 'Înscrie-te'}
        </p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#A89E9C', margin: 0 }}>{title}</p>
      </div>

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Data activității *</label>
          <input type="date" min={today} value={form.start_date} style={inputStyle}
            onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} required />
        </div>

        <div>
          <label style={labelStyle}>Ora *</label>
          <input type="time" value={form.start_time} style={inputStyle}
            onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} required />
        </div>

        <div>
          <label style={labelStyle}>Frecvență</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {RECURRENCE_OPTIONS.map(opt => (
              <label key={opt.value} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
                borderRadius: 12, border: `1px solid ${form.recurrence === opt.value ? '#939D7A' : '#F8DCD9'}`,
                backgroundColor: form.recurrence === opt.value ? '#F0F2EC' : 'white',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 14,
                color: form.recurrence === opt.value ? '#7A8465' : '#5D5D5D', fontWeight: form.recurrence === opt.value ? 600 : 400,
              }}>
                <input type="radio" name="recurrence" value={opt.value}
                  checked={form.recurrence === opt.value}
                  onChange={() => setForm(f => ({ ...f, recurrence: opt.value }))}
                  style={{ display: 'none' }} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Note (opțional)</label>
          <textarea value={form.notes} rows={2} style={{ ...inputStyle, resize: 'vertical' }}
            placeholder="Ex: echipament necesar, sala B..."
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>

        {error && (
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#C0392B', backgroundColor: '#FDF0EE', padding: '10px 14px', borderRadius: 10, margin: 0 }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button type="button" onClick={onClose}
            style={{ ...btnBase, flex: 1, backgroundColor: 'white', color: '#939D7A' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0F2EC')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}>
            Renunță
          </button>
          <button type="submit" disabled={saving}
            style={{ ...btnBase, flex: 1, backgroundColor: saving ? '#F0F2EC' : '#939D7A', color: saving ? '#939D7A' : '#FDF0EE' }}>
            {saving ? 'Se salvează...' : isEdit ? 'Salvează' : 'Confirmă'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EnrollButton;
