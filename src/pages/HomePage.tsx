import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { Activity } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import ActivityCard from '../components/ActivityCard';
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_LABELS } from '../constants/theme';

export default function HomePage() {
  const navigate = useNavigate();
  const { user }  = useAuthStore();
  const { activeProfile, setProfiles } = useProfileStore();

  const [recommended,    setRecommended]    = useState<Activity[]>([]);
  const [activities,     setActivities]     = useState<Activity[]>([]);
  const [loadingRec,     setLoadingRec]     = useState(false);
  const [loadingAll,     setLoadingAll]     = useState(true);
  const [activeCategory, setActiveCategory] = useState('');

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bună dimineața';
    if (h < 18) return 'Bună ziua';
    return 'Bună seara';
  };

  useEffect(() => {
    (async () => {
      // Incarca profilurile
      try {
        const { data } = await api.get('/profiles');
        if (data.data?.length > 0) setProfiles(data.data);
      } catch {}
      await fetchActivities('');
    })();
  }, []);

  // Cand se schimba profilul activ, incarca recomandarile ML
  useEffect(() => {
    if (activeProfile) fetchRecommendations();
  }, [activeProfile?.id]);

  async function fetchRecommendations() {
    if (!activeProfile) return;
    setLoadingRec(true);
    try {
      const { data } = await api.get(`/recommendations/${activeProfile.id}?n=6`);
      setRecommended(data.data || []);
    } catch {
      // Daca ML-ul nu e disponibil, nu afisam sectiunea
      setRecommended([]);
    }
    setLoadingRec(false);
  }

  async function fetchActivities(category: string) {
    setLoadingAll(true);
    try {
      const params: any = { limit: 100 };
      if (category) params.category = category;
      if (activeProfile) params.age = activeProfile.child_age;
      const { data } = await api.get('/activities', { params });
      setActivities(data.data || []);
    } catch {}
    setLoadingAll(false);
  }

  async function handleCategory(cat: string) {
    const next = activeCategory === cat ? '' : cat;
    setActiveCategory(next);
    await fetchActivities(next);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting()}, {user?.firstName ?? 'bine ai venit'}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            {activeProfile
              ? `Activități pentru ${activeProfile.child_name}, ${activeProfile.child_age} ani`
              : 'Descoperă activități din București'
            }
          </p>
        </div>
        <button onClick={() => navigate('/quiz')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-gray-400 transition-all">
          🧭 Quiz profil
        </button>
      </div>

      {/* ── SECTIUNEA RECOMANDATE ─────────────────────────── */}
      {activeProfile && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                ✨ Recomandat pentru {activeProfile.child_name}
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">
                Bazat pe profilul {activeProfile.dominant_profile} și preferințele tale
              </p>
            </div>
            <button onClick={fetchRecommendations}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              🔄 Reîmprospătează
            </button>
          </div>

          {loadingRec ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-200 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded mb-3 w-1/3" />
                  <div className="h-5 bg-gray-100 rounded mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : recommended.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommended.map(activity => (
                <ActivityCard key={activity.id} activity={activity}
                  onClick={() => navigate(`/activity/${activity.id}`, { state: { activity } })} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center text-gray-400">
              <div className="text-3xl mb-2">🤖</div>
              <p className="text-sm">Interacționează cu câteva activități pentru recomandări personalizate</p>
            </div>
          )}
        </div>
      )}

      {/* ── TOATE ACTIVITATILE ────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          {activeCategory
            ? `${CATEGORY_ICONS[activeCategory]} ${CATEGORY_LABELS[activeCategory]}`
            : 'Toate activitățile'
          }
        </h2>

        {/* Filtre */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => handleCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              !activeCategory ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}>
            Toate
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => handleCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
              }`}>
              <span>{CATEGORY_ICONS[cat]}</span>
              <span>{CATEGORY_LABELS[cat]}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {loadingAll ? (
          <div className="text-center py-12 text-gray-400">Se încarcă activitățile...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <div className="font-medium">Nicio activitate găsită</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map(activity => (
              <ActivityCard key={activity.id} activity={activity}
                onClick={() => navigate(`/activity/${activity.id}`, { state: { activity } })} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}