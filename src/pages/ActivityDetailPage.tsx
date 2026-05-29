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

  // Timpul petrecut pe pagina
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (!activity || !activeProfile) return;

    // Logheaza "view" cand se deschide pagina
    api.post(`/activities/${activity.id}/interact`, {
      profileId: activeProfile.id,
      action: 'view',
    }).catch(() => {});

    // Logheaza durata cand paraseste pagina
    return () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      if (duration > 2) {
        api.post(`/activities/${activity.id}/interact`, {
          profileId: activeProfile.id,
          action: 'view',
          durationSeconds: duration,
        }).catch(() => {});
      }
    };
  }, [activity?.id, activeProfile?.id]);

  if (!activity) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400">
      <div className="text-4xl mb-3">😕</div>
      <div>Activitatea nu a fost găsită.</div>
      <button onClick={() => navigate(-1)} className="mt-4 text-sm text-gray-500 hover:text-gray-700">
        ← Înapoi
      </button>
    </div>
  );

  const colors     = CATEGORY_COLORS[activity.category] || CATEGORY_COLORS.sociabil;
  const priceLabel = activity.price === 0 && activity.price_type === 'free'
  ? 'Gratuit'
  : activity.price_type === 'variable'
  ? 'Nespecificat'
  : activity.price === 0
  ? 'Gratuit'
  : `${activity.price} RON/${activity.price_type === 'monthly' ? 'lună' : 'ședință'}`;

  async function handleSave() {
    if (!activeProfile) { alert('Completează mai întâi chestionarul de profil.'); return; }
    try {
      await api.post(`/profiles/${activeProfile.id}/saved/${activity.id}`, {});
      // Logheaza actiunea de save — semnal puternic pentru ML
      await api.post(`/activities/${activity.id}/interact`, {
        profileId: activeProfile.id,
        action: 'save',
      });
      setSaved(true);
    } catch { alert('Nu s-a putut salva activitatea.'); }
  }

  async function handleContact() {
    if (!activeProfile) return;
    // Logheaza click pe contact — semnal de interes ridicat
    await api.post(`/activities/${activity.id}/interact`, {
      profileId: activeProfile.id,
      action: 'click_contact',
    }).catch(() => {});
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 mb-6 block">
        ← Înapoi
      </button>

      <div className="rounded-2xl p-8 mb-6" style={{ backgroundColor: colors.bg }}>
        <div className="text-5xl mb-3">{CATEGORY_ICONS[activity.category]}</div>
        <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.text }}>
          {CATEGORY_LABELS[activity.category]}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">{activity.title}</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Chip icon="👶" text={`${activity.age_min}–${activity.age_max} ani`} />
        <Chip icon="💰" text={priceLabel} />
        {activity.zone && <Chip icon="📍" text={activity.zone} />}
        {activity.is_recurring && <Chip icon="🔄" text="Curs recurent" />}
        {activity.schedule_time && <Chip icon="🕐" text={activity.schedule_time} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {activity.address && (
          <InfoCard title="Locație">
            {activity.location_name && <p className="font-medium text-gray-800">{activity.location_name}</p>}
            <p className="text-gray-500 text-sm">{activity.address}</p>
          </InfoCard>
        )}
        {(activity.schedule_days || activity.schedule_time) && (
          <InfoCard title="Program">
            {activity.schedule_days && <p className="text-gray-800">{activity.schedule_days.join(', ')}</p>}
            {activity.schedule_time && <p className="text-gray-500 text-sm">{activity.schedule_time}</p>}
          </InfoCard>
        )}
        {(activity.phone || activity.organizer_name) && (
          <InfoCard title="Contact">
            {activity.organizer_name && <p className="font-medium text-gray-800">{activity.organizer_name}</p>}
            {activity.phone && (
              <a href={`tel:${activity.phone}`} onClick={handleContact}
                className="text-blue-600 hover:underline text-sm">
                📞 {activity.phone}
              </a>
            )}
          </InfoCard>
        )}
        <InfoCard title="Preț">
          <p className="text-lg font-bold text-gray-900">{priceLabel}</p>
          {activity.price_notes && <p className="text-sm text-gray-500 mt-1">💡 {activity.price_notes}</p>}
        </InfoCard>
      </div>

      {(activity.description || activity.short_description) && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Despre activitate</h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            {activity.description || activity.short_description}
          </p>
        </div>
      )}

      <div className="flex gap-3">
        {activity.phone && (
          <a href={`tel:${activity.phone}`} onClick={handleContact}
            className="flex-1 bg-gray-900 text-white py-3 rounded-full text-center font-bold hover:opacity-90">
            📞 Sună acum
          </a>
        )}
        {activity.website && (
          <a href={activity.website} target="_blank" rel="noopener noreferrer"
            className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-full text-center font-medium hover:border-gray-400">
            🌐 Website
          </a>
        )}
        <button onClick={handleSave} disabled={saved}
          className={`flex-1 py-3 rounded-full font-bold transition-all ${
            saved ? 'bg-purple-100 text-purple-700 cursor-default' : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
          }`}>
          {saved ? '✓ Salvat' : '❤️ Salvează'}
        </button>
      </div>
    </div>
  );
}

function Chip({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5">
      <span className="text-sm">{icon}</span>
      <span className="text-xs font-medium text-gray-600">{text}</span>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{title}</h3>
      {children}
    </div>
  );
}