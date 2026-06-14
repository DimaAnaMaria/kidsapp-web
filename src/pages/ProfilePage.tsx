import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_LABELS } from '../constants/theme';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { activeProfile, profiles, setActiveProfile, clearProfiles } = useProfileStore();

  function handleLogout() {
    if (window.confirm('Ești sigur că vrei să te deconectezi?')) {
      clearProfiles(); logout(); navigate('/login');
    }
  }

  const cat = activeProfile?.dominant_profile || '';
  const colors = cat ? CATEGORY_COLORS[cat] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profilul meu</h1>
        <p className="text-gray-700 font-medium mt-1">{user?.firstName} {user?.lastName}</p>
        <p className="text-gray-400 text-sm">{user?.email}</p>
      </div>

      {activeProfile && colors ? (
        <div className="rounded-2xl p-8 mb-6 text-center" style={{ backgroundColor: colors.bg }}>
          <div className="text-5xl mb-3">{CATEGORY_ICONS[cat]}</div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: colors.text }}>Profilul activ</p>
          <h2 className="text-2xl font-bold" style={{ color: colors.text }}>{activeProfile.child_name}</h2>
          <p className="text-sm mt-1" style={{ color: colors.text }}>{CATEGORY_LABELS[cat]} · {activeProfile.child_age} ani</p>
          <div className="mt-6 grid grid-cols-5 gap-2">
            {Object.entries(activeProfile.scores).sort((a,b) => b[1]-a[1]).map(([k, v]) => (
              <div key={k} className="bg-white bg-opacity-60 rounded-xl p-2 text-center">
                <div className="text-lg">{CATEGORY_ICONS[k]}</div>
                <div className="text-xs font-bold" style={{ color: colors.text }}>{v}%</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-6 text-center">
          <div className="text-4xl mb-3"></div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Niciun profil completat</h2>
          <p className="text-gray-500 text-sm">Completează chestionarul pentru recomandări personalizate</p>
        </div>
      )}

      <button onClick={() => navigate('/quiz')}
        className="w-full bg-gray-900 text-white py-3 rounded-full font-bold hover:opacity-90 transition-opacity mb-4">
         {activeProfile ? 'Completează din nou quiz-ul' : 'Completează quiz-ul de profil'}
      </button>

      {profiles.length > 1 && (
        <div className="bg-white rounded-2xl p-5 border border-gray-200 mb-4">
          <h3 className="font-bold text-gray-900 mb-3">Profilurile mele ({profiles.length})</h3>
          {profiles.map(p => (
            <button key={p.id} onClick={() => setActiveProfile(p)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl mb-2 transition-all text-left ${activeProfile?.id === p.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
              <span className="text-2xl">{CATEGORY_ICONS[p.dominant_profile]}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{p.child_name}</div>
                <div className="text-xs text-gray-400">{CATEGORY_LABELS[p.dominant_profile]} · {p.child_age} ani</div>
              </div>
              {activeProfile?.id === p.id && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Activ</span>}
            </button>
          ))}
        </div>
      )}

      <button onClick={handleLogout}
        className="w-full border border-red-200 text-red-500 py-3 rounded-full font-medium hover:bg-red-50 transition-all">
        Deconectare
      </button>
    </div>
  );
}