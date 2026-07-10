import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { Activity } from '../services/api';
import { useProfileStore } from '../store/useProfileStore';
import ActivityCard from '../components/ActivityCard';

export default function SavedPage() {
  const navigate = useNavigate();
  const { activeProfile } = useProfileStore();
  const [saved,   setSaved]   = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeProfile) { setLoading(false); return; }
    api.get(`/profiles/${activeProfile.id}/saved`)
      .then(({ data }) => setSaved(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeProfile]);

  if (!activeProfile) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4"></div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Niciun profil activ</h2>
      <p className="text-gray-500 mb-6">Completează chestionarul pentru a salva activități</p>
      <button onClick={() => navigate('/profile')}
        className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold hover:opacity-90">
        Completează quiz-ul
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Salvate</h1>
        <p className="text-gray-500 mt-1">{activeProfile.child_name} · {activeProfile.child_age} ani</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Se încarcă...</div>
      ) : saved.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">💡</div>
          <div className="font-medium">Nicio activitate salvată</div>
          <div className="text-sm mt-1">Explorează și apasă ❤️ pentru a salva</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map(a => (
            <div key={a.id} className="relative">
              <ActivityCard
                activity={a}
                onClick={() => navigate(`/activity/${a.id}`, { state: { activity: a } })}
              />
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await api.delete(`/profiles/${activeProfile.id}/saved/${a.id}`);
                    await api.post(`/activities/${a.id}/interact`, {
                      profileId: activeProfile.id,
                      action: 'unsave',
                    });
                    setSaved(prev => prev.filter(s => s.id !== a.id));
                  } catch {}
                }}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  border: '1px solid #F8DCD9',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  zIndex: 10,
                }}
                title="Elimină din salvate"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}