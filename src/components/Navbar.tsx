import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '../constants/theme';

export default function Navbar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuthStore();
  const { activeProfile, profiles, setActiveProfile } = useProfileStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Inchide dropdown-ul cand se face click in afara lui
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    useProfileStore.getState().clearProfiles();
    logout();
    navigate('/login');
  }

  function handleSelectProfile(profile: any) {
    setActiveProfile(profile);
    setDropdownOpen(false);
  }

  function handleNewProfile() {
    setDropdownOpen(false);
    navigate('/quiz');
  }

  const links = [
    { to: '/',        label: 'Acasă',   icon: '🏠' },
    { to: '/search',  label: 'Caută',   icon: '🔍' },
    { to: '/saved',   label: 'Salvate', icon: '❤️' },
    { to: '/profile', label: 'Profil',  icon: '👤' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">🧭</span>
            <span className="font-bold text-gray-900">KidsApp</span>
            <span className="text-sm text-gray-400 hidden sm:block">București</span>
          </Link>

          {/* Navigare */}
          <div className="flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === link.to
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <span>{link.icon}</span>
                <span className="hidden md:block">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Dreapta: dropdown profil + logout */}
          <div className="flex items-center gap-3">

            {/* Dropdown profil */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full hover:border-gray-400 transition-all text-sm"
              >
                {activeProfile ? (
                  <>
                    <span>{CATEGORY_ICONS[activeProfile.dominant_profile]}</span>
                    <span className="font-medium text-gray-700 hidden sm:block">
                      {activeProfile.child_name}
                    </span>
                  </>
                ) : (
                  <>
                    <span>👤</span>
                    <span className="font-medium text-gray-500 hidden sm:block">
                      Niciun profil
                    </span>
                  </>
                )}
                <span className="text-gray-400 text-xs">▾</span>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-50">

                  {/* Header dropdown */}
                  {profiles.length > 0 && (
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Profilurile mele
                      </p>
                    </div>
                  )}

                  {/* Lista profiluri */}
                  {profiles.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectProfile(p)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        activeProfile?.id === p.id ? 'bg-gray-50' : ''
                      }`}
                    >
                      <span className="text-xl">{CATEGORY_ICONS[p.dominant_profile]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm truncate">
                          {p.child_name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {CATEGORY_LABELS[p.dominant_profile]} · {p.child_age} ani
                        </div>
                      </div>
                      {activeProfile?.id === p.id && (
                        <span className="text-green-500 text-xs">✓</span>
                      )}
                    </button>
                  ))}

                  {/* Separator */}
                  <div className="border-t border-gray-100" />

                  {/* Buton profil nou */}
                  <button
                    onClick={handleNewProfile}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors text-blue-600"
                  >
                    <span className="text-xl">＋</span>
                    <span className="text-sm font-medium">Adaugă profil nou</span>
                  </button>

                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
            >
              Ieși
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}