import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { Activity } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import ActivityCard from '../components/ActivityCard';
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_LABELS } from '../constants/theme';
import { WEATHER_API_KEY } from '../services/api';

// ── Iconite vreme SVG ────────────────────────────────────────────────────────
function WeatherIcon({ code }: { code: number }) {
  const s = { fill: 'none', stroke: '#939D7A', strokeWidth: '1.6', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  // Soare
  if (code === 800) return (
    <svg width="22" height="22" viewBox="0 0 22 22">
      <circle cx="11" cy="11" r="5" {...s}/>
      <line x1="11" y1="1" x2="11" y2="3.5" {...s}/>
      <line x1="11" y1="18.5" x2="11" y2="21" {...s}/>
      <line x1="1" y1="11" x2="3.5" y2="11" {...s}/>
      <line x1="18.5" y1="11" x2="21" y2="11" {...s}/>
      <line x1="3.8" y1="3.8" x2="5.6" y2="5.6" {...s}/>
      <line x1="16.4" y1="16.4" x2="18.2" y2="18.2" {...s}/>
      <line x1="18.2" y1="3.8" x2="16.4" y2="5.6" {...s}/>
      <line x1="5.6" y1="16.4" x2="3.8" y2="18.2" {...s}/>
    </svg>
  );

  // Noros (801-804)
  if (code >= 801 && code <= 804) return (
    <svg width="26" height="18" viewBox="0 0 26 18">
      <path d="M6 14 Q4 14 4 11 Q4 8 7 8 Q8 3 13 3 Q18 3 19 8 Q22 8 22 11 Q22 14 19 14 Z" {...s}/>
    </svg>
  );

  // Ploaie (300-321, 500-531)
  if ((code >= 300 && code <= 321) || (code >= 500 && code <= 531)) return (
    <svg width="26" height="26" viewBox="0 0 26 26">
      <path d="M5 12 Q4 12 4 9 Q4 6 7 6 Q8 2 13 2 Q18 2 19 6 Q22 6 22 9 Q22 12 19 12 Z" {...s}/>
      <line x1="8" y1="17" x2="6" y2="23" {...s}/>
      <line x1="15" y1="17" x2="13" y2="23" {...s}/>
    </svg>
  );

  // Ninsoare (600-622)
  if (code >= 600 && code <= 622) return (
    <svg width="22" height="22" viewBox="0 0 22 22">
      <line x1="11" y1="1" x2="11" y2="21" {...s}/>
      <line x1="1" y1="11" x2="21" y2="11" {...s}/>
      <line x1="3" y1="3" x2="19" y2="19" {...s}/>
      <line x1="19" y1="3" x2="3" y2="19" {...s}/>
      <line x1="7" y1="2" x2="11" y2="1" {...s}/>
      <line x1="15" y1="2" x2="11" y2="1" {...s}/>
      <line x1="7" y1="20" x2="11" y2="21" {...s}/>
      <line x1="15" y1="20" x2="11" y2="21" {...s}/>
      <circle cx="11" cy="11" r="2.5" fill="#939D7A" stroke="none"/>
    </svg>
  );

  // Furtuna (200-232)
  if (code >= 200 && code <= 232) return (
    <svg width="26" height="28" viewBox="0 0 26 28">
      <path d="M5 10 Q4 10 4 7 Q4 4 7 4 Q8 0 13 0 Q18 0 19 4 Q22 4 22 7 Q22 10 19 10 Z" {...s}/>
      <path d="M13 13 L9 20 L13 20 L9 28" {...s} strokeWidth="1.8"/>
    </svg>
  );

  // Default — soare partial (orice altceva)
  return (
    <svg width="22" height="22" viewBox="0 0 22 22">
      <circle cx="11" cy="11" r="5" {...s}/>
      <line x1="11" y1="1" x2="11" y2="3.5" {...s}/>
      <line x1="18.5" y1="11" x2="21" y2="11" {...s}/>
      <line x1="16.4" y1="5.6" x2="18.2" y2="3.8" {...s}/>
    </svg>
  );
}

// ── Iconita profil temperament ───────────────────────────────────────────────
function TemperamentIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="10" r="6.5" stroke="#939D7A" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M6 26 Q6 20 16 20 Q26 20 26 26" stroke="#939D7A" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M20 6 C19 4 21 2 22 4 C23 2 25 4 24 6 C23 8 22 9 22 9 C22 9 21 8 20 6Z"
        fill="#939D7A" opacity="0.8"/>
    </svg>
  );
}

// ── Iconita popularitate ─────────────────────────────────────────────────────
function PopularityIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 4 L19 12 L28 12 L21 17 L24 25 L16 20 L8 25 L11 17 L4 12 L13 12 Z"
        stroke="#B5A090" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="24" y1="3" x2="27" y2="6" stroke="#B5A090" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="24" y1="7" x2="28" y2="7" stroke="#B5A090" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="26" y1="2" x2="26" y2="6" stroke="#B5A090" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

// ── Iconita utilizatori similari ─────────────────────────────────────────────
function UsersIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="12" cy="11" r="5.5" stroke="#939D7A" strokeWidth="1.5"/>
      <path d="M3 26 Q3 20 12 20 Q21 20 21 26" stroke="#939D7A" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="23" cy="10" r="4" stroke="#939D7A" strokeWidth="1.2" opacity="0.55"/>
      <path d="M17 26 Q17 21 23 21 Q29 21 29 26" stroke="#939D7A" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
    </svg>
  );
}

// ── Iconita busola pentru quiz ───────────────────────────────────────────────
function CompassIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#939D7A" strokeWidth="1.3"/>
      <circle cx="8" cy="8" r="1.5" fill="#939D7A"/>
      <line x1="8" y1="1" x2="8" y2="3.5" stroke="#939D7A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="8" y1="12.5" x2="8" y2="15" stroke="#939D7A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="1" y1="8" x2="3.5" y2="8" stroke="#939D7A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="12.5" y1="8" x2="15" y2="8" stroke="#939D7A" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M5 5 L8 6.5 L11 11 L8 9.5 Z" fill="#939D7A" opacity="0.7"/>
    </svg>
  );
}

// ── Iconita refresh ───────────────────────────────────────────────────────────
function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 7 A6 6 0 1 1 4 12" stroke="#939D7A" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M1 12 L1 7 L6 7" stroke="#939D7A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { activeProfile, setProfiles } = useProfileStore();

  const [recommended,    setRecommended]    = useState<Activity[]>([]);
  const [activities,     setActivities]     = useState<Activity[]>([]);
  const [loadingRec,     setLoadingRec]     = useState(false);
  const [loadingAll,     setLoadingAll]     = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [interactions,   setInteractions]   = useState(0);
  const [currentPage,    setCurrentPage]    = useState(1);
  const [weather,        setWeather]        = useState<{ code: number; temp: number } | null>(null);
  const ITEMS_PER_PAGE = 10;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bună dimineața';
    if (h < 18) return 'Bună ziua';
    return 'Bună seara';
  };

  // Incarca vreme din OpenWeatherMap
  useEffect(() => {
    const key = WEATHER_API_KEY;
    if (!key) return;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=Bucharest,ro&appid=${key}&units=metric`)
      .then(r => r.json())
      .then(d => {
        if (d.weather?.[0]?.id && d.main?.temp) {
          setWeather({ code: d.weather[0].id, temp: Math.round(d.main.temp) });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/profiles');
        if (data.data?.length > 0) setProfiles(data.data);
      } catch {}
      if (activeProfile) {
        api.get(`/profiles/${activeProfile.id}/interactions/count`)
          .then(({ data }) => setInteractions(data.count || 0))
          .catch(() => {});
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
      const { data } = await api.get(`/recommendations/${activeProfile.id}?n=6&fresh=false`);
      if (data.data?.length > 0) {
        setRecommended(data.data);
      } else {
        const { data: fallback } = await api.get('/activities', {
          params: { category: activeProfile.dominant_profile, age: activeProfile.child_age, limit: 6 }
        });
        setRecommended(fallback.data || []);
      }
    } catch {
      try {
        const { data: fallback } = await api.get('/activities', {
          params: { category: activeProfile.dominant_profile, age: activeProfile.child_age, limit: 6 }
        });
        setRecommended(fallback.data || []);
      } catch {}
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
    setCurrentPage(1);
    await fetchActivities(next);
  }

  // Ponderi dinamice pentru afisare
  const getWeights = () => {
    if (interactions <= 10)  return { cb: 60, pop: 35, cf: 5 };
    if (interactions <= 50)  return { cb: 55, pop: 30, cf: 15 };
    if (interactions <= 100) return { cb: 50, pop: 25, cf: 25 };
    return { cb: 45, pop: 20, cf: 35 };
  };
  const weights = getWeights();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#3D3D3D' }}>
              {greeting()}, {user?.firstName ?? 'bine ai venit'}!
            </h1>
            {weather ? (
              <WeatherIcon code={weather.code} />
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="5" stroke="#939D7A" strokeWidth="1.6" strokeLinecap="round"/>
                <line x1="11" y1="1" x2="11" y2="3.5" stroke="#939D7A" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="11" y1="18.5" x2="11" y2="21" stroke="#939D7A" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="1" y1="11" x2="3.5" y2="11" stroke="#939D7A" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="18.5" y1="11" x2="21" y2="11" stroke="#939D7A" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="3.8" y1="3.8" x2="5.6" y2="5.6" stroke="#939D7A" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="16.4" y1="16.4" x2="18.2" y2="18.2" stroke="#939D7A" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="18.2" y1="3.8" x2="16.4" y2="5.6" stroke="#939D7A" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="5.6" y1="16.4" x2="3.8" y2="18.2" stroke="#939D7A" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </div>
          <p className="text-sm" style={{ color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>
            {activeProfile
              ? `Activități pentru ${activeProfile.child_name}, ${activeProfile.child_age} ani`
              : 'Descoperă activități din București'
            }
            {weather && ` · ${weather.temp}°C în București`}
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
                    stroke="#939D7A" strokeWidth="1.4" strokeLinejoin="round"/>
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
              {[1,2,3].map(i => (
                <div key={i} className="rounded-2xl p-5 animate-pulse" style={{ backgroundColor: 'white', border: '1px solid #F8DCD9' }}>
                  <div className="h-4 rounded mb-3 w-1/3" style={{ backgroundColor: '#F0F2EC' }}/>
                  <div className="h-5 rounded mb-2" style={{ backgroundColor: '#F0F2EC' }}/>
                  <div className="h-4 rounded w-2/3" style={{ backgroundColor: '#F0F2EC' }}/>
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
