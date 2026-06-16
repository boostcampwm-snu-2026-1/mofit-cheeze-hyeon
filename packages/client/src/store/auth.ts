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
  loginAsMockModel: () => void;
  loginAsMockDesigner: () => void;
}

const MOCK_MODEL_USER: User = {
  id: "mock-user-id",
  role: "model",
  name: "홍길동",
  createdAt: new Date().toISOString(),
};

const MOCK_MODEL_PROFILE: ModelProfile = {
  userId: "mock-user-id",
  gender: "female",
  ageGroup: "20대 초반",
  preferredStyles: ["내추럴", "웨이브", "레이어드"],
  hasTreatmentExperience: true,
  bio: "염색·펌 시술 모델로 활동 중입니다. 자연스러운 톤과 레이어드 스타일을 선호해요.",
};

const MOCK_DESIGNER_USER: User = {
  id: "mock-designer-id",
  role: "designer",
  name: "김소연",
  createdAt: new Date().toISOString(),
};

const MOCK_DESIGNER_PROFILE: DesignerProfile = {
  userId: "mock-designer-id",
  salonName: "소연 헤어",
  region: "서울 마포·홍대",
  career: "3~5년",
  specialties: ["커트", "레이어드", "스타일링"],
  allowContentUsage: true,
  allowFaceExposure: false,
  bio: "얼굴형에 맞는 레이어드 커트와 자연스러운 스타일링을 전문으로 합니다. 포트폴리오 촬영용 모델을 우선 매칭합니다.",
};

export { MOCK_MODEL_USER, MOCK_MODEL_PROFILE, MOCK_DESIGNER_USER, MOCK_DESIGNER_PROFILE };

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
  loginAsMockModel: () =>
    set({
      user: MOCK_MODEL_USER,
      modelProfile: MOCK_MODEL_PROFILE,
      designerProfile: null,
      isLoading: false,
    }),
  loginAsMockDesigner: () =>
    set({
      user: MOCK_DESIGNER_USER,
      modelProfile: null,
      designerProfile: MOCK_DESIGNER_PROFILE,
      isLoading: false,
    }),
}));
