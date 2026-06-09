import { create } from "zustand";
import type { User, ModelProfile, DesignerProfile } from "@mofit/shared";

interface AuthState {
  user: User | null;
  modelProfile: ModelProfile | null;
  designerProfile: DesignerProfile | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setModelProfile: (profile: ModelProfile | null) => void;
  setDesignerProfile: (profile: DesignerProfile | null) => void;
  setLoading: (loading: boolean) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  modelProfile: null,
  designerProfile: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setModelProfile: (modelProfile) => set({ modelProfile }),
  setDesignerProfile: (designerProfile) => set({ designerProfile }),
  setLoading: (isLoading) => set({ isLoading }),
  clearSession: () =>
    set({ user: null, modelProfile: null, designerProfile: null }),
}));
