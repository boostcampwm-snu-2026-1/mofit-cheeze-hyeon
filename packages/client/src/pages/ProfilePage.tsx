import { useNavigate } from "react-router-dom";
import {
  PageLayout,
  Avatar,
  Button,
  Badge,
  Divider,
  BottomNav,
  Body,
} from "@ui";
import { useAuthStore } from "../store/auth";
import { supabase } from "../lib/supabase";

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, modelProfile, designerProfile, clearSession } = useAuthStore();

  async function handleSignOut() {
    await supabase.auth.signOut();
    clearSession();
    navigate("/login", { replace: true });
  }

  if (!user) return null;

  const isModel = user.role === "model";
  const profile = isModel ? modelProfile : designerProfile;

  const tags = isModel
    ? (modelProfile?.preferredStyles ?? [])
    : (designerProfile?.specialties ?? []);

  const subtitle = isModel
    ? [
        "헤어 모델",
        designerProfile === null && modelProfile?.ageGroup,
      ]
        .filter(Boolean)
        .join(" · ")
    : [
        "헤어 디자이너",
        designerProfile?.region,
        designerProfile?.career,
      ]
        .filter(Boolean)
        .join(" · ");

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={
        <div className="flex items-center justify-between px-5 py-4">
          <p className="font-sans font-semibold text-base text-charcoal">
            프로필
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile/edit")}
          >
            편집
          </Button>
        </div>
      }
      footer={<BottomNav />}
    >
      <div className="max-w-[430px] mx-auto px-5 pt-6 pb-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Avatar
            src={user.avatarUrl}
            name={user.name}
            size="xl"
            className="mb-4"
          />
          <p className="font-sans font-semibold text-xl text-charcoal tracking-[-0.4px]">
            {user.name}
          </p>
          <p className="font-sans text-sm text-muted mt-1">{subtitle}</p>
        </div>

        {!profile && (
          <div className="mb-6 rounded-card border border-border p-4 text-center">
            <Body className="text-muted mb-3">
              프로필을 완성하면 매칭 확률이 높아져요
            </Body>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                navigate(
                  isModel ? "/onboarding/model" : "/onboarding/designer"
                )
              }
            >
              프로필 완성하기
            </Button>
          </div>
        )}

        {!isModel && (
          <>
            <Divider className="mb-4" />
            <div className="mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => navigate("/portfolio")}
              >
                포트폴리오 관리
              </Button>
            </div>
          </>
        )}

        {profile?.bio && (
          <>
            <Divider className="mb-6" />
            <div className="mb-6">
              <p className="font-sans font-semibold text-sm text-charcoal mb-3">
                소개
              </p>
              <Body className="text-muted leading-relaxed">{profile.bio}</Body>
            </div>
          </>
        )}

        {tags.length > 0 && (
          <>
            <Divider className="mb-6" />
            <div className="mb-8">
              <p className="font-sans font-semibold text-sm text-charcoal mb-3">
                {isModel ? "선호 스타일" : "전문 분야"}
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <Divider className="mb-6" />

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full py-3 font-sans text-sm text-muted hover:text-charcoal transition-colors text-center"
        >
          로그아웃
        </button>
      </div>
    </PageLayout>
  );
}
