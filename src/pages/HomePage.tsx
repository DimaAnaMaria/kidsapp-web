import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { Activity } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import ActivityCard from '../components/ActivityCard';
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_LABELS } from '../constants/theme';




//  Iconita profil temperament 
function TemperamentIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="10" r="6.5" stroke="#939D7A" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6 26 Q6 20 16 20 Q26 20 26 26" stroke="#939D7A" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M20 6 C19 4 21 2 22 4 C23 2 25 4 24 6 C23 8 22 9 22 9 C22 9 21 8 20 6Z"
        fill="#939D7A" opacity="0.8" />
    </svg>
  );
}

//  Iconita popularitate 
function PopularityIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 4 L19 12 L28 12 L21 17 L24 25 L16 20 L8 25 L11 17 L4 12 L13 12 Z"
        stroke="#B5A090" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="24" y1="3" x2="27" y2="6" stroke="#B5A090" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="24" y1="7" x2="28" y2="7" stroke="#B5A090" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="26" y1="2" x2="26" y2="6" stroke="#B5A090" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

//  Iconita utilizatori similari
function UsersIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="12" cy="11" r="5.5" stroke="#939D7A" strokeWidth="1.5" />
      <path d="M3 26 Q3 20 12 20 Q21 20 21 26" stroke="#939D7A" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="23" cy="10" r="4" stroke="#939D7A" strokeWidth="1.2" opacity="0.55" />
      <path d="M17 26 Q17 21 23 21 Q29 21 29 26" stroke="#939D7A" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

//  Iconita busola pentru quiz 
function CompassIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#939D7A" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="1.5" fill="#939D7A" />
      <line x1="8" y1="1" x2="8" y2="3.5" stroke="#939D7A" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="8" y1="12.5" x2="8" y2="15" stroke="#939D7A" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="1" y1="8" x2="3.5" y2="8" stroke="#939D7A" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12.5" y1="8" x2="15" y2="8" stroke="#939D7A" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5 5 L8 6.5 L11 11 L8 9.5 Z" fill="#939D7A" opacity="0.7" />
    </svg>
  );
}

// Iconita refresh 
function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 7 A6 6 0 1 1 4 12" stroke="#939D7A" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M1 12 L1 7 L6 7" stroke="#939D7A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { activeProfile, setProfiles } = useProfileStore();

  const [recommended, setRecommended] = useState<Activity[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingRec, setLoadingRec] = useState(false);
  const [loadingAll, setLoadingAll] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [interactions, setInteractions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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
      } catch { }
      if (activeProfile) {
        api.get(`/profiles/${activeProfile.id}/interactions/count`)
          .then(({ data }) => setInteractions(data.count || 0))
          .catch(() => { });
      }
      await fetchActivities('');
    })();
  }, []);

  useEffect(() => {
    if (activeProfile) fetchRecommendations();
  }, [activeProfile?.id]);

  async function fetchRecommendations() {
    if (!activeProfile) return;
    setLoadingRec(true);
    try {
      // 1. Încearcă să ceară recomandările inteligente hibride (de la Node.js -> FastAPI)
      const { data } = await api.get(`/recommendations/${activeProfile.id}?n=6&fresh=false`);
      if (data.data?.length > 0) {
        setRecommended(data.data);
      } else {
        // 2. Fallback la nivel de date: dacă API-ul răspunde dar lista e goală, adu date brute filtrate pe vârstă și profil dominat
        const { data: fallback } = await api.get('/activities', {
          params: { category: activeProfile.dominant_profile, age: activeProfile.child_age, limit: 6 }
        });
        setRecommended(fallback.data || []);
      }
    } catch {
      // 3. Fallback la nivel de eroare: dacă serverul de ML este complet offline sau dă eroare, utilizatorul primește totuși activități sortate stabil pe categoria lui
      try {
        const { data: fallback } = await api.get('/activities', {
          params: { category: activeProfile.dominant_profile, age: activeProfile.child_age, limit: 6 }
        });
        setRecommended(fallback.data || []);
      } catch { }
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
    } catch { }
    setLoadingAll(false);
  }

  async function handleCategory(cat: string) {
    const next = activeCategory === cat ? '' : cat;
    setActiveCategory(next);
    setCurrentPage(1);
    await fetchActivities(next);
  }

  // Ponderi dinamice pentru afisare
  const getWeights = () => {
    if (interactions <= 10) return { cb: 60, pop: 35, cf: 5 };
    if (interactions <= 50) return { cb: 55, pop: 30, cf: 15 };
    if (interactions <= 100) return { cb: 50, pop: 25, cf: 25 };
    return { cb: 45, pop: 20, cf: 35 };
  };
  const weights = getWeights();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif', color: '#3D3D3D' }}>
            {greeting()}, {user?.firstName ?? 'bine ai venit'}!
          </h1>
          <p className="text-sm" style={{ color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>
            {activeProfile
              ? `Activități pentru ${activeProfile.child_name}, ${activeProfile.child_age} ani`
              : 'Descoperă activități din București'
            }

          </p>
        </div>
        <button
          onClick={() => navigate('/quiz')}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all"
          style={{ backgroundColor: 'white', border: '1px solid #939D7A', color: '#939D7A', fontFamily: 'DM Sans, sans-serif' }}
        >
          <CompassIcon />
          Quiz profil
        </button>
      </div>

      {/* ── Sectiunea recomandate ── */}
      {activeProfile && (
        <div className="mb-10">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2 L11 7 L16 7 L12 10 L14 15 L9 12 L4 15 L6 10 L2 7 L7 7 Z"
                    stroke="#939D7A" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
                <h2 className="text-lg font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#3D3D3D' }}>
                  Recomandat pentru {activeProfile.child_name}
                </h2>
              </div>
              <p className="text-sm" style={{ color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>
                Bazat pe profilul {CATEGORY_LABELS[activeProfile.dominant_profile]} și preferințele tale
              </p>
            </div>
            <button
              onClick={fetchRecommendations}
              className="flex items-center gap-1.5 text-xs mt-1 transition-colors"
              style={{ color: '#939D7A', fontFamily: 'DM Sans, sans-serif' }}
            >
              <RefreshIcon />
              Reîmprospătează
            </button>
          </div>

          {/* Explicatie algoritm */}
          <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: 'white', border: '1px solid #F8DCD9' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>
              Cum funcționează recomandările
            </p>
            <div className="grid grid-cols-3 gap-4">

              {/* Profil temperament */}
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0F2EC' }}>
                  <TemperamentIcon />
                </div>
                <div className="text-xs font-medium" style={{ color: '#3D3D3D', fontFamily: 'DM Sans, sans-serif' }}>
                  Profil temperament
                </div>
                <div className="text-xs" style={{ color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>
                  {weights.cb}% din scor
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: '#F0F2EC' }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${weights.cb}%`, backgroundColor: '#939D7A' }} />
                </div>
              </div>

              {/* Popularitate */}
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FDF5F4' }}>
                  <PopularityIcon />
                </div>
                <div className="text-xs font-medium" style={{ color: '#3D3D3D', fontFamily: 'DM Sans, sans-serif' }}>
                  Popularitate
                </div>
                <div className="text-xs" style={{ color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>
                  {weights.pop}% din scor
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: '#F0F2EC' }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${weights.pop}%`, backgroundColor: '#B5A090' }} />
                </div>
              </div>

              {/* Utilizatori similari */}
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EFF1EC' }}>
                  <UsersIcon />
                </div>
                <div className="text-xs font-medium" style={{ color: '#3D3D3D', fontFamily: 'DM Sans, sans-serif' }}>
                  Utilizatori similari
                </div>
                <div className="text-xs" style={{ color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>
                  {weights.cf}% din scor
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: '#F0F2EC' }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${weights.cf}%`, backgroundColor: '#939D7A' }} />
                </div>
              </div>

            </div>
            <p className="text-xs text-center mt-3" style={{ color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>
              {interactions === 0
                ? 'Interacționează cu activități pentru recomandări mai precise'
                : `Bazat pe ${interactions} interacțiuni — algoritmul învață din comportamentul tău`
              }
            </p>
          </div>

          {/* Grid recomandate */}
          {loadingRec ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-2xl p-5 animate-pulse" style={{ backgroundColor: 'white', border: '1px solid #F8DCD9' }}>
                  <div className="h-4 rounded mb-3 w-1/3" style={{ backgroundColor: '#F0F2EC' }} />
                  <div className="h-5 rounded mb-2" style={{ backgroundColor: '#F0F2EC' }} />
                  <div className="h-4 rounded w-2/3" style={{ backgroundColor: '#F0F2EC' }} />
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
            <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'white', border: '1px solid #F8DCD9' }}>
              <div className="text-3xl mb-2">🤖</div>
              <p className="text-sm" style={{ color: '#A89E9C' }}>
                Interacționează cu câteva activități pentru recomandări personalizate
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Toate activitatile ── */}
      <div>
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#3D3D3D' }}>
          {activeCategory ? `${CATEGORY_ICONS[activeCategory]} ${CATEGORY_LABELS[activeCategory]}` : 'Toate activitățile'}
        </h2>

        {/* Filtre */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => handleCategory('')}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: !activeCategory ? '#939D7A' : 'white',
              color: !activeCategory ? '#FDF0EE' : '#7A8465',
              border: `1px solid ${!activeCategory ? '#939D7A' : '#F8DCD9'}`,
              fontFamily: 'DM Sans, sans-serif',
            }}>
            Toate
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => handleCategory(cat)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: activeCategory === cat ? '#939D7A' : 'white',
                color: activeCategory === cat ? '#FDF0EE' : '#7A8465',
                border: `1px solid ${activeCategory === cat ? '#939D7A' : '#F8DCD9'}`,
                fontFamily: 'DM Sans, sans-serif',
              }}>
              <span>{CATEGORY_ICONS[cat]}</span>
              <span>{CATEGORY_LABELS[cat]}</span>
            </button>
          ))}
        </div>

        {/* Grid activitati */}
        {loadingAll ? (
          <div className="text-center py-12" style={{ color: '#A89E9C' }}>Se încarcă activitățile...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-16" style={{ color: '#A89E9C' }}>
            <div className="text-4xl mb-3">🔍</div>
            <div className="font-medium">Nicio activitate găsită</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities
                .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                .map(activity => (
                  <ActivityCard key={activity.id} activity={activity}
                    onClick={() => navigate(`/activity/${activity.id}`, { state: { activity } })} />
                ))}
            </div>

            {/* Paginare */}
            {activities.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0); }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-40"
                  style={{ border: '1px solid #F8DCD9', color: '#7A8465', backgroundColor: 'white', fontFamily: 'DM Sans, sans-serif' }}
                >
                  ← Anterior
                </button>
                {Array.from({ length: Math.ceil(activities.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => { setCurrentPage(page); window.scrollTo(0, 0); }}
                    className="w-9 h-9 rounded-full text-sm font-medium transition-all"
                    style={{
                      backgroundColor: currentPage === page ? '#939D7A' : 'white',
                      color: currentPage === page ? '#FDF0EE' : '#7A8465',
                      border: `1px solid ${currentPage === page ? '#939D7A' : '#F8DCD9'}`,
                      fontFamily: 'DM Sans, sans-serif',
                    }}>
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => { setCurrentPage(p => Math.min(Math.ceil(activities.length / ITEMS_PER_PAGE), p + 1)); window.scrollTo(0, 0); }}
                  disabled={currentPage === Math.ceil(activities.length / ITEMS_PER_PAGE)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-40"
                  style={{ border: '1px solid #F8DCD9', color: '#7A8465', backgroundColor: 'white', fontFamily: 'DM Sans, sans-serif' }}
                >
                  Următor →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
