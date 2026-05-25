import { create } from 'zustand';
import { ChildProfile } from '../services/api';

interface ProfileState {
  activeProfile: ChildProfile | null;
  profiles: ChildProfile[];
  setActiveProfile: (p: ChildProfile) => void;
  setProfiles: (ps: ChildProfile[]) => void;
  clearProfiles: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  activeProfile: null,
  profiles: [],
  setActiveProfile: (p) => set({ activeProfile: p }),
  setProfiles: (ps) => set({ profiles: ps, activeProfile: ps[0] || null }),
  clearProfiles: () => set({ activeProfile: null, profiles: [] }),
}));
