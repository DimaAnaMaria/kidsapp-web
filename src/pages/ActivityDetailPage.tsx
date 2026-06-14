import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useProfileStore } from '../store/useProfileStore';
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_LABELS } from '../constants/theme';

export default function ActivityDetailPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const activity  = (location.state as any)?.activity;
  const { activeProfile } = useProfileStore();
  const [saved, setSaved] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (!activity?.id || !activeProfile?.id) return;
    const profileId  = activeProfile.id;
    const activityId = activity.id;
    api.post(`/activities/${activityId}/interact`, { profileId, action: 'view' }).catch(() => {});
    return () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      if (duration > 2) {
        api.post(`/activities/${activityId}/interact`, { profileId, action: 'view', durationSeconds: duration }).catch(() => {});
      }
    };
  }, [activity?.id, activeProfile?.id]);

  if (!activity) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center" style={{ color: '#A89E9C' }}>
      <div className="text-4xl mb-3">🔍</div>
      <div style={{ fontFamily: 'DM Sans, sans-serif' }}>Activitatea nu a fost găsită.</div>
      <button onClick={() => navigate(-1)} className="mt-4 text-sm hover:opacity-70"
        style={{ color: '#939D7A', fontFamily: 'DM Sans, sans-serif' }}>
        ← Înapoi
      </button>
    </div>
  );

  const colors = CATEGORY_COLORS[activity.category] || CATEGORY_COLORS.sociabil;

  const priceLabel = activity.price_type === 'free' || activity.price === 0
    ? 'Gratuit'
    : activity.price_type === 'variable'
    ? 'Nespecificat'
    : `${activity.price} RON/${activity.price_type === 'monthly' ? 'lună' : 'ședință'}`;

  async function handleSave() {
    if (!activeProfile) { alert('Completează mai întâi chestionarul de profil.'); return; }
    try {
      await api.post(`/profiles/${activeProfile.id}/saved/${activity.id}`, {});
      await api.post(`/activities/${activity.id}/interact`, { profileId: activeProfile.id, action: 'save' });
      setSaved(true);
    } catch { alert('Nu s-a putut salva activitatea.'); }
  }

  async function handleContact() {
    if (!activeProfile) return;
    await api.post(`/activities/${activity.id}/interact`, { profileId: activeProfile.id, action: 'click_contact' }).catch(() => {});
  }

  const btnBase = {
    flex: '1',
    padding: '14px 20px',
    borderRadius: '50px',
    fontFamily: 'Playfair Display, serif',
    fontSize: '14px',
    fontWeight: 500,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center' as const,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const btnPrimary = {
    ...btnBase,
    backgroundColor: '#939D7A',
    color: '#FDF0EE',
    border: '1px solid #939D7A',
  };

  const btnSecondary = {
    ...btnBase,
    backgroundColor: 'white',
    color: '#939D7A',
    border: '1px solid #939D7A',
  };

  const btnDisabled = {
    ...btnBase,
    backgroundColor: '#F0F2EC',
    color: '#939D7A',
    border: '1px solid #939D7A',
    opacity: 0.7,
    cursor: 'default' as const,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)}
        className="text-sm mb-6 block hover:opacity-70 transition-opacity"
        style={{ color: '#939D7A', fontFamily: 'DM Sans, sans-serif' }}>
        ← Înapoi
      </button>

      {/* Header card */}
      <div className="rounded-2xl p-8 mb-6" style={{ backgroundColor: colors.bg }}>
        <div className="text-4xl mb-3">{CATEGORY_ICONS[activity.category]}</div>
        <div className="text-xs font-bold uppercase tracking-wider mb-2"
          style={{ color: colors.text, fontFamily: 'DM Sans, sans-serif' }}>
          {CATEGORY_LABELS[activity.category]}
        </div>
        <h1 className="text-2xl font-bold leading-tight"
          style={{ fontFamily: 'Playfair Display, serif', color: '#3D3D3D' }}>
          {activity.title}
        </h1>
      </div>

      {/* Chips info */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Chip label={`${activity.age_min}–${activity.age_max} ani`} />
        <Chip label={priceLabel} />
        {activity.zone && <Chip label={activity.zone} />}
        {activity.is_recurring && <Chip label="Curs recurent" />}
        {activity.schedule_time && <Chip label={activity.schedule_time} />}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {activity.address && (
          <InfoCard title="Locație">
            {activity.location_name && (
              <p className="font-medium text-sm mb-0.5" style={{ color: '#3D3D3D', fontFamily: 'DM Sans, sans-serif' }}>
                {activity.location_name}
              </p>
            )}
            <p className="text-sm" style={{ color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>
              {activity.address}
            </p>
          </InfoCard>
        )}
        {(activity.schedule_days || activity.schedule_time) && (
          <InfoCard title="Program">
            {activity.schedule_days && (
              <p className="text-sm" style={{ color: '#3D3D3D', fontFamily: 'DM Sans, sans-serif' }}>
                {activity.schedule_days.join(', ')}
              </p>
            )}
            {activity.schedule_time && (
              <p className="text-sm" style={{ color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>
                {activity.schedule_time}
              </p>
            )}
          </InfoCard>
        )}
        {(activity.phone || activity.organizer_name) && (
          <InfoCard title="Contact">
            {activity.organizer_name && (
              <p className="font-medium text-sm mb-0.5" style={{ color: '#3D3D3D', fontFamily: 'DM Sans, sans-serif' }}>
                {activity.organizer_name}
              </p>
            )}
            {activity.phone && (
              <a href={`tel:${activity.phone}`} onClick={handleContact}
                className="text-sm hover:opacity-70 transition-opacity"
                style={{ color: '#939D7A', fontFamily: 'DM Sans, sans-serif' }}>
                {activity.phone}
              </a>
            )}
          </InfoCard>
        )}
        <InfoCard title="Preț">
          <p className="text-lg font-bold" style={{ color: '#3D3D3D', fontFamily: 'Playfair Display, serif' }}>
            {priceLabel}
          </p>
          {activity.price_notes && (
            <p className="text-xs mt-1" style={{ color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>
              {activity.price_notes}
            </p>
          )}
        </InfoCard>
      </div>

      {/* Descriere */}
      {(activity.description || activity.short_description) && (
        <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: 'white', border: '1px solid #F8DCD9' }}>
          <h3 className="font-bold mb-3 text-sm uppercase tracking-wider"
            style={{ color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>
            Despre activitate
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: '#5D5D5D', fontFamily: 'DM Sans, sans-serif' }}>
            {activity.description || activity.short_description}
          </p>
        </div>
      )}

      {/* Butoane — acelasi stil */}
      <div className="flex gap-3">
        {activity.phone && (
          <a href={`tel:${activity.phone}`} onClick={handleContact} style={btnPrimary}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7A8465')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#939D7A')}>
            Sună acum
          </a>
        )}
        {activity.website && (
          <a href={activity.website} target="_blank" rel="noopener noreferrer"
            style={btnSecondary}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0F2EC')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}>
            Website
          </a>
        )}
        <button onClick={handleSave} disabled={saved}
          style={saved ? btnDisabled : btnSecondary}
          onMouseEnter={e => { if (!saved) (e.currentTarget as HTMLElement).style.backgroundColor = '#F0F2EC'; }}
          onMouseLeave={e => { if (!saved) (e.currentTarget as HTMLElement).style.backgroundColor = 'white'; }}>
          {saved ? 'Salvat' : 'Salvează'}
        </button>
      </div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <div className="flex items-center px-3 py-1.5 rounded-full"
      style={{ backgroundColor: 'white', border: '1px solid #F8DCD9' }}>
      <span className="text-xs font-medium" style={{ color: '#7A8465', fontFamily: 'DM Sans, sans-serif' }}>
        {label}
      </span>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: 'white', border: '1px solid #F8DCD9' }}>
      <h3 className="text-xs font-bold uppercase tracking-wider mb-2"
        style={{ color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
