import { Link } from "react-router-dom";
import { PageLayout, Avatar, Badge, BottomNav, EmptyState, Button, Divider, Caption } from "@ui";

type MatchStatus = "대기중" | "수락됨" | "거절됨";

const REQUESTS = [
  { id: "1", name: "박지현", specialty: "염색 · 탈색", time: "방금 전", status: "대기중" as MatchStatus },
  { id: "2", name: "이미래", specialty: "웨이브 · 볼륨 펌", time: "2시간 전", status: "수락됨" as MatchStatus },
  { id: "3", name: "최다은", specialty: "데일리 스타일링", time: "어제", status: "거절됨" as MatchStatus },
];

const statusVariant: Record<MatchStatus, "default" | "muted" | "outline"> = {
  대기중: "outline",
  수락됨: "default",
  거절됨: "muted",
};

export function MatchingInboxPage() {
  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={
        <div className="px-5 py-4">
          <p className="font-sans font-semibold text-base text-charcoal">매칭 신청함</p>
        </div>
      }
      footer={<BottomNav />}
    >
      <div className="max-w-[430px] mx-auto pt-2 pb-6">
        {REQUESTS.length === 0 ? (
          <EmptyState
            title="아직 매칭 신청이 없어요"
            description="디자이너를 탐색하고 첫 매칭을 시작해보세요"
            action={
              <Link to="/discover">
                <Button variant="primary" size="sm">디자이너 탐색</Button>
              </Link>
            }
          />
        ) : (
          <div>
            {REQUESTS.map((req, i) => (
              <div key={req.id}>
                <div className="flex items-center gap-4 px-5 py-4">
                  <Avatar name={req.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-semibold text-sm text-charcoal">{req.name}</p>
                    <p className="font-sans text-xs text-muted mt-0.5 truncate">{req.specialty}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge variant={statusVariant[req.status]}>{req.status}</Badge>
                    <Caption>{req.time}</Caption>
                  </div>
                </div>
                {i < REQUESTS.length - 1 && <Divider className="mx-5" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
