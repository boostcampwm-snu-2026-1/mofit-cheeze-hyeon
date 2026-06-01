import { PageLayout, Avatar, Button, Badge, Divider, BottomNav, Body, Caption } from "@ui";

const MOCK_USER = {
  name: "홍길동",
  role: "헤어 모델",
  location: "서울 마포",
  bio: "염색·펌 시술 모델로 활동 중입니다. 자연스러운 톤과 레이어드 스타일을 선호하며, 포트폴리오 촬영에도 참여 가능해요.",
  stats: [
    { label: "매칭", value: "8" },
    { label: "완료", value: "5" },
    { label: "평점", value: "4.8" },
  ],
  tags: ["내추럴", "웨이브", "레이어드"],
};

export function ProfilePage() {
  const u = MOCK_USER;

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={
        <div className="flex items-center justify-between px-5 py-4">
          <p className="font-sans font-semibold text-base text-charcoal">프로필</p>
          <Button variant="ghost" size="sm">편집</Button>
        </div>
      }
      footer={<BottomNav />}
    >
      <div className="max-w-[430px] mx-auto px-5 pt-6 pb-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Avatar name={u.name} size="xl" className="mb-4" />
          <p className="font-sans font-semibold text-xl text-charcoal tracking-[-0.4px]">{u.name}</p>
          <p className="font-sans text-sm text-muted mt-1">
            {u.role} · {u.location}
          </p>
        </div>

        <div className="flex divide-x divide-border border border-border rounded-card mb-8">
          {u.stats.map((s) => (
            <div key={s.label} className="flex-1 py-4 text-center">
              <p className="font-sans font-semibold text-xl text-charcoal tracking-[-0.4px]">{s.value}</p>
              <Caption>{s.label}</Caption>
            </div>
          ))}
        </div>

        <Divider className="mb-6" />

        <div className="mb-6">
          <p className="font-sans font-semibold text-sm text-charcoal mb-3">소개</p>
          <Body className="text-muted leading-relaxed">{u.bio}</Body>
        </div>

        <Divider className="mb-6" />

        <div className="mb-8">
          <p className="font-sans font-semibold text-sm text-charcoal mb-3">스타일 태그</p>
          <div className="flex flex-wrap gap-2">
            {u.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>

        <Button variant="ghost" size="md" className="w-full">
          로그아웃
        </Button>
      </div>
    </PageLayout>
  );
}
