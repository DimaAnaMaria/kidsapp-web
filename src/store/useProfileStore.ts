import { create } from 'zustand';
import { ChildProfile } from '../services/api';

interface ProfileState {
  activeProfile: ChildProfile | null;
  profiles: ChildProfile[];
  setActiveProfile: (p: ChildProfile) => void;
  setProfiles: (ps: ChildProfile[]) => void;
  clearProfiles: () => void;
  initialize: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  activeProfile: null,
  profiles: [],

  setActiveProfile: (p) => {
    localStorage.setItem('active_profile', JSON.stringify(p));
    set({ activeProfile: p });
  },

  setProfiles: (ps) => {
    // Verifica daca exista un profil activ salvat in localStorage
    const stored = localStorage.getItem('active_profile');
    let activeProfile = ps[0] || null;

    if (stored) {
      try {
        const storedProfile = JSON.parse(stored) as ChildProfile;
        // Cauta profilul salvat in lista noua
        const found = ps.find(p => p.id === storedProfile.id);
        if (found) {
          // Profilul salvat exista — pastreaza-l
          activeProfile = found;
        }
      } catch {}
    }

    // Salveaza profilul activ in localStorage
    if (activeProfile) {
      localStorage.setItem('active_profile', JSON.stringify(activeProfile));
    }

    set({ profiles: ps, activeProfile });
  },

  clearProfiles: () => {
    localStorage.removeItem('active_profile');
    set({ activeProfile: null, profiles: [] });
  },

  initialize: () => {
    const stored = localStorage.getItem('active_profile');
    if (stored) {
      try {
        const profile = JSON.parse(stored) as ChildProfile;
        set({ activeProfile: profile });
      } catch {}
    }
  },
}));