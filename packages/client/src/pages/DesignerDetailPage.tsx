import { useNavigate } from "react-router-dom";
import { PageLayout, Avatar, Button, Badge, Divider, Body, Caption } from "@ui";

const MOCK_DESIGNER = {
  name: "김소연",
  specialty: "내추럴 커트 · 헤어 디자이너",
  location: "서울 강남",
  matchCount: 24,
  rating: 4.9,
  bio: "3년차 헤어 디자이너입니다. 얼굴형에 맞는 레이어드 커트와 자연스러운 스타일링을 전문으로 합니다. 포트폴리오 촬영용 모델 모집 중이며, 콘텐츠 활용에 동의해 주시는 분을 우선 매칭합니다.",
  tags: ["커트", "레이어드", "내추럴", "스타일링"],
  works: ["포트폴리오 촬영 30+", "시술 모델 협업 12+", "일반 커트 80+"],
};

export function DesignerDetailPage() {
  const navigate = useNavigate();
  const d = MOCK_DESIGNER;

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={
        <div className="flex items-center px-5 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-sans text-muted hover:text-charcoal transition-colors mr-4"
          >
            ←
          </button>
          <p className="font-sans font-semibold text-base text-charcoal">{d.name}</p>
        </div>
      }
    >
      <div className="max-w-[430px] mx-auto px-5 pt-6 pb-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Avatar name={d.name} size="xl" className="mb-4" />
          <p className="font-sans font-semibold text-xl text-charcoal tracking-[-0.4px]">
            {d.name}
          </p>
          <p className="font-sans text-sm text-muted mt-1">{d.specialty}</p>
          <div className="flex items-center gap-4 mt-3">
            <Caption>{d.location}</Caption>
            <Caption>★ {d.rating}</Caption>
            <Caption>매칭 {d.matchCount}회</Caption>
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          <Button variant="primary" size="md" className="flex-1">
            매칭 신청
          </Button>
          <Button variant="ghost" size="md" className="flex-1">
            채팅하기
          </Button>
        </div>

        <Divider className="mb-6" />

        <div className="mb-6">
          <p className="font-sans font-semibold text-sm text-charcoal mb-3">전문 분야</p>
          <div className="flex flex-wrap gap-2">
            {d.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>

        <Divider className="mb-6" />

        <div className="mb-6">
          <p className="font-sans font-semibold text-sm text-charcoal mb-3">소개</p>
          <Body className="text-muted leading-relaxed">{d.bio}</Body>
        </div>

        <Divider className="mb-6" />

        <div>
          <p className="font-sans font-semibold text-sm text-charcoal mb-3">작업 이력</p>
          <div className="flex flex-col gap-2">
            {d.works.map((w) => (
              <div key={w} className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-pill bg-muted flex-shrink-0" />
                <Caption>{w}</Caption>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
