import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { Activity } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import ActivityCard from '../components/ActivityCard';
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_LABELS } from '../constants/theme';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { activeProfile, setProfiles } = useProfileStore();
  const [activities,  setActivities]  = useState<Activity[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bună dimineața';
    if (h < 18) return 'Bună ziua';
    return 'Bună seara';
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/profiles');
        if (data.data?.length > 0) setProfiles(data.data);
      } catch {}
      await fetchActivities('');
    })();
  }, []);

  async function fetchActivities(category: string) {
    setLoading(true);
    try {
      const params: any = { limit: 30 };
      if (category) params.category = category;
      if (activeProfile) params.age = activeProfile.child_age;
      const { data } = await api.get('/activities', { params });
      setActivities(data.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleCategory(cat: string) {
    const next = activeCategory === cat ? '' : cat;
    setActiveCategory(next);
    await fetchActivities(next);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
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
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-gray-400 transition-all"
        >
          🧭 Quiz profil
        </button>
      </div>

      {/* Filtre categorii */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => handleCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            !activeCategory
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
          }`}
        >
          Toate
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              activeCategory === cat
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
          >
            <span>{CATEGORY_ICONS[cat]}</span>
            <span>{CATEGORY_LABELS[cat]}</span>
          </button>
        ))}
      </div>

      {/* Grid activitati */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400 text-lg">Se încarcă activitățile...</div>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <div className="font-medium">Nicio activitate găsită</div>
          <div className="text-sm mt-1">Încearcă o altă categorie</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onClick={() => navigate(`/activity/${activity.id}`, { state: { activity } })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
