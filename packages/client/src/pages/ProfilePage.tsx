import { useVtNavigate } from "@ui";
import {
  PageLayout,
  PageHeader,
  Avatar,
  Button,
  Badge,
  Divider,
  BottomNav,
  Body,
  Caption,
} from "@ui";
import { useAuthStore } from "../store/auth";
import { useMatchStore } from "../store/matchStore";
import { usePostingStore } from "../store/postingStore";
import { MOCK_DESIGNERS } from "../lib/mockData";

const STATUS_LABEL: Record<string, string> = {
  pending: "대기중",
  accepted: "수락됨",
  rejected: "거절됨",
  cancelled: "취소됨",
};
const STATUS_VARIANT: Record<string, "default" | "muted" | "outline"> = {
  pending: "outline",
  accepted: "default",
  rejected: "muted",
  cancelled: "muted",
};

export function ProfilePage() {
  const navigate = useVtNavigate();
  const { user, modelProfile, designerProfile, clearSession } = useAuthStore();
  const { modelMatchings, designerMatchings } = useMatchStore();
  const { postings } = usePostingStore();

  function handleSignOut() {
    clearSession();
    navigate("/demo", { replace: true });
  }

  if (!user) return null;

  const isDesigner = user.role === "designer";
  const profile = isDesigner ? designerProfile : modelProfile;
  const tags = isDesigner
    ? (designerProfile?.specialties ?? [])
    : (modelProfile?.preferredStyles ?? []);

  // Find matching designer entry for stats (designer only)
  const designerEntry = isDesigner
    ? MOCK_DESIGNERS.find((d) => d.name === user.name)
    : null;

  // Portfolio images for designer preview
  const portfolioImages = designerEntry?.portfolios.flatMap((p) => p.imageUrls) ?? [];

  // Matching data
  const allMatchings = isDesigner ? designerMatchings : modelMatchings;
  const recentMatchings = allMatchings.slice(0, 3);

  const subtitle = isDesigner
    ? [
        "헤어 디자이너",
        designerProfile?.region,
        designerProfile?.career && `경력 ${designerProfile.career}`,
      ].filter(Boolean).join(" · ")
    : [
        "헤어 모델",
        modelProfile?.ageGroup,
        modelProfile?.gender === "female" ? "여성" : modelProfile?.gender === "male" ? "남성" : undefined,
      ].filter(Boolean).join(" · ");

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={
        <PageHeader
          title="프로필"
          right={
            <Button variant="ghost" size="sm" onClick={() => navigate("/profile/edit")}>
              편집
            </Button>
          }
        />
      }
      footer={<BottomNav />}
    >
      <div className="max-w-[430px] mx-auto px-5 pt-6 pb-10">
        {/* Avatar + name */}
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar src={user.avatarUrl} name={user.name} size="xl" className="mb-4" />
          <p className="font-sans font-semibold text-xl text-charcoal tracking-[-0.4px]">
            {user.name}
          </p>
          <p className="font-sans text-sm text-muted mt-1">{subtitle}</p>
          {isDesigner && designerProfile?.salonName && (
            <p className="font-sans text-xs text-muted mt-0.5">{designerProfile.salonName}</p>
          )}
        </div>

        {/* Stats */}
        {isDesigner && designerEntry ? (
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="flex flex-col items-center p-3 rounded-card border border-border">
              <p className="font-sans font-semibold text-xl text-charcoal">{designerEntry.matchCount}</p>
              <Caption className="mt-0.5">총 매칭</Caption>
            </div>
            <div className="flex flex-col items-center p-3 rounded-card border border-border">
              <p className="font-sans font-semibold text-xl text-charcoal">{designerEntry.reviews.length}</p>
              <Caption className="mt-0.5">리뷰</Caption>
            </div>
            <div className="flex flex-col items-center p-3 rounded-card border border-border">
              <p className="font-sans font-semibold text-xl text-charcoal">★ {designerEntry.rating}</p>
              <Caption className="mt-0.5">평점</Caption>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="flex flex-col items-center p-3 rounded-card border border-border">
              <p className="font-sans font-semibold text-xl text-charcoal">{allMatchings.length}</p>
              <Caption className="mt-0.5">신청 횟수</Caption>
            </div>
            <div className="flex flex-col items-center p-3 rounded-card border border-border">
              <p className="font-sans font-semibold text-xl text-charcoal">
                {allMatchings.filter((m) => m.status === "accepted").length}
              </p>
              <Caption className="mt-0.5">수락됨</Caption>
            </div>
          </div>
        )}

        {/* Incomplete profile nudge */}
        {!profile && (
          <div className="mb-6 rounded-card border border-border p-4 text-center">
            <Body className="text-muted mb-3">프로필을 완성하면 매칭 확률이 높아져요</Body>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(isDesigner ? "/onboarding/designer" : "/onboarding/model")}
            >
              프로필 완성하기
            </Button>
          </div>
        )}

        {/* Bio */}
        {profile?.bio && (
          <>
            <Divider className="mb-6" />
            <div className="mb-6">
              <p className="font-sans font-semibold text-sm text-charcoal mb-3">소개</p>
              <Body className="text-muted leading-relaxed">{profile.bio}</Body>
            </div>
          </>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <>
            <Divider className="mb-6" />
            <div className="mb-6">
              <p className="font-sans font-semibold text-sm text-charcoal mb-3">
                {isDesigner ? "전문 분야" : "선호 스타일"}
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Designer: my postings */}
        {isDesigner && (
          <>
            <Divider className="mb-6" />
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-sans font-semibold text-sm text-charcoal">내 모집 공고</p>
                <button
                  type="button"
                  onClick={() => navigate("/my-postings")}
                  className="font-sans text-xs text-muted hover:text-charcoal transition-colors"
                >
                  전체보기
                </button>
              </div>
              {postings.length === 0 ? (
                <button
                  type="button"
                  onClick={() => navigate("/my-postings/new")}
                  className="w-full rounded-card border border-dashed border-border p-4 text-center hover:border-border-interactive transition-colors"
                >
                  <Caption className="text-muted">+ 첫 공고 올리기</Caption>
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  {postings.slice(0, 2).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => navigate(`/my-postings/${p.id}/edit`)}
                      className="w-full flex items-center justify-between gap-3 rounded-card border border-border p-3 hover:bg-surface-hover transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm font-medium text-charcoal truncate">{p.recruitStyle}</p>
                        <Caption>
                          {p.proposedPrice === 0 ? "무료 협업" : `${p.proposedPrice.toLocaleString()}원`}
                          {" · "}
                          {p.availableSlots.length}일
                        </Caption>
                      </div>
                      <Badge variant="default">모집중</Badge>
                    </button>
                  ))}
                  {postings.length > 2 && (
                    <Caption className="text-center text-muted">+{postings.length - 2}개 더보기</Caption>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Designer: portfolio preview */}
        {isDesigner && portfolioImages.length > 0 && (
          <>
            <Divider className="mb-6" />
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-sans font-semibold text-sm text-charcoal">포트폴리오</p>
                <button
                  type="button"
                  onClick={() => navigate("/portfolio")}
                  className="font-sans text-xs text-muted hover:text-charcoal transition-colors"
                >
                  관리
                </button>
              </div>
              <div className="grid grid-cols-3 gap-0.5 rounded-compact overflow-hidden">
                {portfolioImages.slice(0, 6).map((url, i) => (
                  <div key={i} className="aspect-square overflow-hidden">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Recent matchings */}
        {recentMatchings.length > 0 && (
          <>
            <Divider className="mb-6" />
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-sans font-semibold text-sm text-charcoal">
                  {isDesigner ? "최근 신청" : "최근 매칭"}
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/matching/inbox")}
                  className="font-sans text-xs text-muted hover:text-charcoal transition-colors"
                >
                  전체보기
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {recentMatchings.map((m) => {
                  const name = isDesigner ? m.modelName : m.designerName;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => navigate(`/matching/${m.id}`)}
                      className="w-full flex items-center gap-3 py-2.5 hover:bg-surface-hover rounded-card px-2 -mx-2 transition-colors text-left"
                    >
                      <Avatar name={name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm font-medium text-charcoal">{name}</p>
                        <Caption className="truncate">{m.treatmentStyle}</Caption>
                      </div>
                      <Badge variant={STATUS_VARIANT[m.status]}>
                        {STATUS_LABEL[m.status]}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <Divider className="mb-4" />
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
