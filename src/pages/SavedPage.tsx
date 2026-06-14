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
        <h1 className="text-2xl font-bold text-gray-900">Salvate </h1>
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
            <ActivityCard key={a.id} activity={a}
              onClick={() => navigate(`/activity/${a.id}`, { state: { activity: a } })} />
          ))}
        </div>
      )}
    </div>
  );
}