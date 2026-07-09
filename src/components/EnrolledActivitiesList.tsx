// src/components/EnrolledActivitiesList.tsx
import React, { useState } from 'react';
import { EnrollmentData, Enrollment } from '../hooks/useEnrollment';
import api from '../services/api';

interface Props {
  profileId: string;
  enrollments: Enrollment[];
  loading: boolean;
  refetch: () => void;
}

const RECURRENCE_LABELS: Record<string, string> = {
  none: 'O singură dată', daily: 'Zilnic', weekly: 'Săptămânal', monthly: 'Lunar',
};

// ── Stele interactive ──────────────────────────────────────────────────────────
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontSize: 28, color: star <= (hovered || value) ? '#939D7A' : '#E8E0DB',
            transition: 'color 0.1s',
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ── Modal review ───────────────────────────────────────────────────────────────
interface ReviewModalProps {
  profileId: string;
  activityId: string;
  activityTitle: string;
  existingReview: { rating: number; message: string } | null;
  onClose: () => void;
  onSaved: () => void;
}

function ReviewModal({ profileId, activityId, activityTitle, existingReview, onClose, onSaved }: ReviewModalProps) {
  const [rating,  setRating]  = useState(existingReview?.rating  || 0);
  const [message, setMessage] = useState(existingReview?.message || '');
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 12,
    border: '1px solid #F8DCD9', fontFamily: 'DM Sans, sans-serif',
    fontSize: 14, color: '#3D3D3D', outline: 'none',
    boxSizing: 'border-box', backgroundColor: 'white', resize: 'vertical',
  };

  const btnBase: React.CSSProperties = {
    flex: 1, padding: '12px 20px', borderRadius: 50,
    fontFamily: 'Playfair Display, serif', fontSize: 14,
    fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
    border: '1px solid #939D7A',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (rating === 0) { setError('Selectează un rating.'); return; }
    setSaving(true);
    try {
      await api.post(`/profiles/${profileId}/reviews/${activityId}`, { rating, message });
      onSaved();
      onClose();
    } catch {
      setError('A apărut o eroare. Încearcă din nou.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Ștergi reviewul?')) return;
    setSaving(true);
    try {
      await api.delete(`/profiles/${profileId}/reviews/${activityId}`);
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 20, border: '1px solid #F8DCD9', padding: 28, width: '100%', maxWidth: 420, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 18, color: '#A89E9C', cursor: 'pointer' }}>✕</button>

        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#3D3D3D', margin: '0 0 4px' }}>
          {existingReview ? 'Modifică recenzia' : 'Lasă o recenzie'}
        </p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#A89E9C', margin: '0 0 20px' }}>{activityTitle}</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: '#A89E9C', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>Rating *</p>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: '#A89E9C', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Mesaj (opțional)</p>
            <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Cum a fost experiența? Ce a plăcut cel mai mult?"
              style={inputStyle} />
          </div>

          {error && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#C0392B', backgroundColor: '#FDF0EE', padding: '10px 14px', borderRadius: 10, margin: 0 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose}
              style={{ ...btnBase, backgroundColor: 'white', color: '#939D7A' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0F2EC')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}>
              Renunță
            </button>
            <button type="submit" disabled={saving}
              style={{ ...btnBase, backgroundColor: saving ? '#F0F2EC' : '#939D7A', color: saving ? '#939D7A' : '#FDF0EE' }}>
              {saving ? 'Se salvează...' : existingReview ? 'Salvează' : 'Trimite'}
            </button>
          </div>

          {existingReview && (
            <button type="button" onClick={handleDelete} disabled={saving}
              style={{ background: 'none', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#C0392B', cursor: 'pointer', textDecoration: 'underline', padding: 0, textAlign: 'center' }}>
              Șterge recenzia
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

// ── Modal modificare detalii participare ───────────────────────────────────────
interface EditEnrollModalProps {
  profileId: string;
  activityId: string;
  activityTitle: string;
  current: { start_date: string; start_time: string; recurrence: string; notes?: string };
  onClose: () => void;
  onSaved: () => void;
}

const RECURRENCE_OPTIONS = [
  { value: 'none', label: 'O singură dată' },
  { value: 'weekly', label: 'Săptămânal' },
  { value: 'monthly', label: 'Lunar' },
  { value: 'daily', label: 'Zilnic' },
] as const;

function EditEnrollModal({ profileId, activityId, activityTitle, current, onClose, onSaved }: EditEnrollModalProps) {
  const [form, setForm] = useState<EnrollmentData>({
    start_date: current.start_date?.split('T')[0] || '',
    start_time: current.start_time?.slice(0, 5) || '',
    recurrence: current.recurrence as any || 'none',
    notes: current.notes || '',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');
  const today = new Date().toISOString().split('T')[0];

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 12,
    border: '1px solid #F8DCD9', fontFamily: 'DM Sans, sans-serif',
    fontSize: 14, color: '#3D3D3D', outline: 'none',
    boxSizing: 'border-box', backgroundColor: 'white',
  };

  const btnBase: React.CSSProperties = {
    flex: 1, padding: '12px 20px', borderRadius: 50,
    fontFamily: 'Playfair Display, serif', fontSize: 14,
    fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
    border: '1px solid #939D7A',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.start_date) { setError('Selectează o dată.'); return; }
    if (!form.start_time) { setError('Selectează o oră.'); return; }
    setSaving(true);
    try {
      await api.post(`/profiles/${profileId}/enrollments/${activityId}`, form);
      onSaved();
      onClose();
    } catch {
      setError('A apărut o eroare.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 20, border: '1px solid #F8DCD9', padding: 28, width: '100%', maxWidth: 420, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 18, color: '#A89E9C', cursor: 'pointer' }}>✕</button>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#3D3D3D', margin: '0 0 4px' }}>Modifică detaliile</p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#A89E9C', margin: '0 0 20px' }}>{activityTitle}</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: '#A89E9C', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Data *</p>
            <input type="date" min={today} value={form.start_date} style={inputStyle}
              onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} required />
          </div>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: '#A89E9C', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Ora *</p>
            <input type="time" value={form.start_time} style={inputStyle}
              onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} required />
          </div>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: '#A89E9C', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Frecvență</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {RECURRENCE_OPTIONS.map(opt => (
                <label key={opt.value} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
                  borderRadius: 12, border: `1px solid ${form.recurrence === opt.value ? '#939D7A' : '#F8DCD9'}`,
                  backgroundColor: form.recurrence === opt.value ? '#F0F2EC' : 'white',
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 14,
                  color: form.recurrence === opt.value ? '#7A8465' : '#5D5D5D',
                  fontWeight: form.recurrence === opt.value ? 600 : 400,
                }}>
                  <input type="radio" name="rec" value={opt.value}
                    checked={form.recurrence === opt.value}
                    onChange={() => setForm(f => ({ ...f, recurrence: opt.value }))}
                    style={{ display: 'none' }} />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: '#A89E9C', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Note (opțional)</p>
            <textarea rows={2} value={form.notes} style={{ ...inputStyle, resize: 'vertical' }}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          {error && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#C0392B', backgroundColor: '#FDF0EE', padding: '10px 14px', borderRadius: 10, margin: 0 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose}
              style={{ ...btnBase, backgroundColor: 'white', color: '#939D7A' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0F2EC')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}>
              Renunță
            </button>
            <button type="submit" disabled={saving}
              style={{ ...btnBase, backgroundColor: saving ? '#F0F2EC' : '#939D7A', color: saving ? '#939D7A' : '#FDF0EE' }}>
              {saving ? 'Se salvează...' : 'Salvează'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Componenta principala ──────────────────────────────────────────────────────
export function EnrolledActivitiesList({ profileId, enrollments, loading, refetch }: Props) {
  //const { enrollments, loading, refetch } = useEnrollments(profileId);

  const [confirmRemove,  setConfirmRemove]  = useState<string | null>(null); // activityId
  const [reviewModal,    setReviewModal]    = useState<{ activityId: string; title: string } | null>(null);
  const [editModal,      setEditModal]      = useState<string | null>(null); // activityId
  const [existingReview, setExistingReview] = useState<{ rating: number; message: string } | null>(null);
  const [removing,       setRemoving]       = useState(false);

  const handleRemove = async (activityId: string) => {
    setRemoving(true);
    try {
      await api.delete(`/profiles/${profileId}/enrollments/${activityId}`);
      refetch();
    } finally {
      setRemoving(false);
      setConfirmRemove(null);
    }
  };

  const openReview = async (activityId: string, title: string) => {
    const res = await api.get(`/profiles/${profileId}/reviews/${activityId}`).catch(() => ({ data: { review: null } }));
    setExistingReview(res.data.review ? { rating: res.data.review.rating, message: res.data.review.message || '' } : null);
    setReviewModal({ activityId, title });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '1rem', color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>Se încarcă...</div>;

  if (enrollments.length === 0) return (
    <div style={{ textAlign: 'center', padding: '24px 0', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#A89E9C' }}>
      Nu ești înscris la nicio activitate încă.
    </div>
  );

  const currentEditEnrollment = enrollments.find(e => e.activity_id === editModal);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {enrollments.map(enr => (
          <div key={enr.activity_id} style={{ backgroundColor: 'white', border: '1px solid #F8DCD9', borderRadius: 16, padding: '16px 18px' }}>
            {/* Titlu + detalii */}
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 700, color: '#3D3D3D', margin: '0 0 4px' }}>
              {enr.title}
            </p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#A89E9C', margin: '0 0 12px' }}>
              {new Date(enr.start_date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
              {' · '}{enr.start_time?.slice(0, 5)}
              {enr.recurrence !== 'none' && ` · ${RECURRENCE_LABELS[enr.recurrence]}`}
              {enr.zone && ` · ${enr.zone}`}
            </p>

            {/* Butoane actiuni */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => openReview(enr.activity_id, enr.title || '')}
                style={{ padding: '7px 14px', borderRadius: 50, border: '1px solid #939D7A', backgroundColor: 'white', color: '#939D7A', fontFamily: 'DM Sans, sans-serif', fontSize: 13, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0F2EC')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
              >
                ⭐ Lasă recenzie
              </button>

              <button
                onClick={() => setEditModal(enr.activity_id)}
                style={{ padding: '7px 14px', borderRadius: 50, border: '1px solid #939D7A', backgroundColor: 'white', color: '#939D7A', fontFamily: 'DM Sans, sans-serif', fontSize: 13, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0F2EC')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
              >
                ✏️ Modifică detaliile
              </button>

              <button
                onClick={() => setConfirmRemove(enr.activity_id)}
                style={{ padding: '7px 14px', borderRadius: 50, border: '1px solid #C0392B', backgroundColor: 'white', color: '#C0392B', fontFamily: 'DM Sans, sans-serif', fontSize: 13, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF0EE')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
              >
                Am renunțat
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal confirmare renuntare */}
      {confirmRemove && (
        <div onClick={() => setConfirmRemove(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 20, border: '1px solid #F8DCD9', padding: 28, width: '100%', maxWidth: 380 }}>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#3D3D3D', margin: '0 0 8px' }}>Renunți la activitate?</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#A89E9C', margin: '0 0 24px' }}>
              Activitatea va fi scoasă din lista ta și din calendar.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmRemove(null)}
                style={{ flex: 1, padding: '12px', borderRadius: 50, border: '1px solid #939D7A', backgroundColor: 'white', color: '#939D7A', fontFamily: 'Playfair Display, serif', fontSize: 14, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0F2EC')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}>
                Nu, păstrează
              </button>
              <button onClick={() => handleRemove(confirmRemove)} disabled={removing}
                style={{ flex: 1, padding: '12px', borderRadius: 50, border: '1px solid #C0392B', backgroundColor: '#C0392B', color: 'white', fontFamily: 'Playfair Display, serif', fontSize: 14, cursor: 'pointer' }}>
                {removing ? 'Se șterge...' : 'Da, renunț'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal review */}
      {reviewModal && (
        <ReviewModal
          profileId={profileId}
          activityId={reviewModal.activityId}
          activityTitle={reviewModal.title}
          existingReview={existingReview}
          onClose={() => setReviewModal(null)}
          onSaved={refetch}
        />
      )}

      {/* Modal editare detalii */}
      {editModal && currentEditEnrollment && (
        <EditEnrollModal
          profileId={profileId}
          activityId={editModal}
          activityTitle={currentEditEnrollment.title || ''}
          current={currentEditEnrollment}
          onClose={() => setEditModal(null)}
          onSaved={refetch}
        />
      )}
    </>
  );
}

export default EnrolledActivitiesList;
