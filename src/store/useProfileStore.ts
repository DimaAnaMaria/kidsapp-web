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

export const useProfileStore = create<ProfileState>((set) => ({
  activeProfile: null,
  profiles: [],

  setActiveProfile: (p) => {
    localStorage.setItem('active_profile', JSON.stringify(p));
    set({ activeProfile: p });
  },

  setProfiles: (ps) => {
    if (ps.length === 0) {
      localStorage.removeItem('active_profile');
      set({ profiles: [], activeProfile: null });
      return;
    }

    const stored = localStorage.getItem('active_profile');
    let activeProfile = ps[0];//implicit setare primul copil din lista

    if (stored) {
      try {
        const storedProfile = JSON.parse(stored) as ChildProfile;
        const found = ps.find(p => p.id === storedProfile.id);
        if (found) {
          activeProfile = found;
        } else {
          localStorage.removeItem('active_profile');
          activeProfile = ps[0];
        }
      } catch {
        localStorage.removeItem('active_profile');
      }
    }

    localStorage.setItem('active_profile', JSON.stringify(activeProfile));
    set({ profiles: ps, activeProfile });
  },

  clearProfiles: () => {
    localStorage.removeItem('active_profile');
    set({ activeProfile: null, profiles: [] });
  },

  initialize: () => {
    set({ activeProfile: null, profiles: [] });
  },
}));