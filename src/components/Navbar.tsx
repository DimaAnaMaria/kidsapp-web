import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '../constants/theme';

export default function Navbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuthStore();
  const { activeProfile, profiles, setActiveProfile } = useProfileStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const links = [
    { to: '/',        label: 'Acasă'   },
    { to: '/search',  label: 'Caută'   },
    { to: '/saved',   label: 'Salvate' },
    { to: '/profile', label: 'Profil'  },
  ];

  return (
    <nav style={{ backgroundColor: '#939D7A' }} className="sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo — doar text cu font elegant */}
          <Link to="/" className="flex items-center gap-1">
            <span
              className="text-2xl font-bold tracking-wide"
              style={{ fontFamily: 'Playfair Display, serif', color: '#FDF0EE' }}
            >
              KidsApp
            </span>
            <span
              className="text-sm font-light hidden sm:block ml-1"
              style={{ fontFamily: 'DM Sans, sans-serif', color: '#D4C9C7', letterSpacing: '0.05em' }}
            >
              București
            </span>
          </Link>

          {/* Navigare — doar text, fara emoji */}
          <div className="flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 rounded-full text-sm transition-all"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: location.pathname === link.to ? 600 : 400,
                  color: location.pathname === link.to ? '#939D7A' : '#FDF0EE',
                  backgroundColor: location.pathname === link.to ? '#FDF0EE' : 'transparent',
                  letterSpacing: '0.02em',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Dreapta: dropdown profil + logout */}
          <div className="flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
                style={{
                  backgroundColor: 'rgba(253,240,238,0.2)',
                  border: '1px solid rgba(253,240,238,0.4)',
                }}
              >
                {activeProfile ? (
                  <>
                    <span>{CATEGORY_ICONS[activeProfile.dominant_profile]}</span>
                    <span
                      className="hidden sm:block text-sm"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#FDF0EE' }}
                    >
                      {activeProfile.child_name}
                    </span>
                  </>
                ) : (
                  <span style={{ color: '#FDF0EE', fontSize: '0.875rem', fontFamily: 'DM Sans, sans-serif' }}>
                    Profil
                  </span>
                )}
                <span style={{ color: 'rgba(253,240,238,0.7)', fontSize: '0.75rem' }}>▾</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-lg overflow-hidden z-50"
                  style={{ backgroundColor: '#FDF0EE', border: '1px solid #F8DCD9' }}>

                  {profiles.length > 0 && (
                    <div className="px-3 py-2" style={{ borderBottom: '1px solid #F8DCD9' }}>
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#939D7A' }}>
                        Profilurile mele
                      </p>
                    </div>
                  )}

                  {profiles.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectProfile(p)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                      style={{
                        backgroundColor: activeProfile?.id === p.id ? '#F8DCD9' : 'transparent',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F8DCD9')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = activeProfile?.id === p.id ? '#F8DCD9' : 'transparent')}
                    >
                      <span className="text-xl">{CATEGORY_ICONS[p.dominant_profile]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate" style={{ color: '#3D3D3D', fontFamily: 'DM Sans, sans-serif' }}>
                          {p.child_name}
                        </div>
                        <div className="text-xs" style={{ color: '#939D7A' }}>
                          {CATEGORY_LABELS[p.dominant_profile]} · {p.child_age} ani
                        </div>
                      </div>
                      {activeProfile?.id === p.id && (
                        <span style={{ color: '#939D7A' }}>✓</span>
                      )}
                    </button>
                  ))}

                  <div style={{ borderTop: '1px solid #F8DCD9' }} />

                  <button
                    onClick={() => { setDropdownOpen(false); navigate('/quiz'); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F8DCD9')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span className="text-xl">＋</span>
                    <span className="text-sm font-medium" style={{ color: '#939D7A', fontFamily: 'DM Sans, sans-serif' }}>
                      Adaugă profil nou
                    </span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="text-sm transition-colors px-2 py-1"
              style={{ color: 'rgba(253,240,238,0.7)', fontFamily: 'DM Sans, sans-serif' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FDF0EE')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(253,240,238,0.7)')}
            >
              Ieși
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}