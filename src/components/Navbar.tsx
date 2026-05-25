import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { CATEGORY_ICONS } from '../constants/theme';

export default function Navbar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuthStore();
  const { activeProfile } = useProfileStore();

  function handleLogout() {
    useProfileStore.getState().clearProfiles();
    logout();
    navigate('/login');
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

          {/* Profil activ + logout */}
          <div className="flex items-center gap-3">
            {activeProfile && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{CATEGORY_ICONS[activeProfile.dominant_profile]}</span>
                <span className="hidden sm:block font-medium text-gray-700">
                  {activeProfile.child_name}
                </span>
              </div>
            )}
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
