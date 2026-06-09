import { useEffect, type ReactNode } from "react";
import { supabase } from "./supabase";
import { useAuthStore } from "../store/auth";
import type { User, ModelProfile, DesignerProfile } from "@mofit/shared";

const IS_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const MOCK_USER: User = {
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

async function fetchUserRow(id: string): Promise<User | null> {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (!data) return null;
  return {
    id: data.id,
    role: data.role,
    name: data.name,
    avatarUrl: data.avatar_key
      ? supabase.storage.from("avatars").getPublicUrl(data.avatar_key).data.publicUrl
      : undefined,
    createdAt: data.created_at,
  };
}

async function fetchModelProfile(userId: string): Promise<ModelProfile | null> {
  const { data } = await supabase
    .from("model_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (!data) return null;
  return {
    userId: data.user_id,
    gender: data.gender,
    ageGroup: data.age_group,
    preferredStyles: data.preferred_styles ?? [],
    hasTreatmentExperience: data.has_treatment_experience,
    bio: data.bio,
  };
}

async function fetchDesignerProfile(userId: string): Promise<DesignerProfile | null> {
  const { data } = await supabase
    .from("designer_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (!data) return null;
  return {
    userId: data.user_id,
    salonName: data.salon_name,
    region: data.region,
    career: data.career,
    specialties: data.specialties ?? [],
    allowContentUsage: data.allow_content_usage,
    allowFaceExposure: data.allow_face_exposure,
    bio: data.bio,
  };
}

export async function loadUserSession(userId: string) {
  const { setUser, setModelProfile, setDesignerProfile, setLoading } =
    useAuthStore.getState();

  const user = await fetchUserRow(userId);
  if (!user) {
    setLoading(false);
    return;
  }
  setUser(user);

  if (user.role === "model") {
    setModelProfile(await fetchModelProfile(userId));
  } else {
    setDesignerProfile(await fetchDesignerProfile(userId));
  }
  setLoading(false);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setLoading, clearSession, setUser, setModelProfile } = useAuthStore();

  useEffect(() => {
    if (IS_MOCK) {
      setUser(MOCK_USER);
      setModelProfile(MOCK_MODEL_PROFILE);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUserSession(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          loadUserSession(session.user.id);
        } else {
          clearSession();
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
