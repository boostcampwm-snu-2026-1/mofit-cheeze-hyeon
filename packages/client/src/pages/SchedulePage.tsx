import { PageLayout, Card, CardBody, Avatar, Badge, BottomNav, Caption, Divider } from "@ui";

const SCHEDULE = [
  {
    date: "오늘, 6월 1일",
    items: [
      { id: "1", time: "14:00", name: "김소연", desc: "피팅 세션 — 미니멀 룩 3벌", status: "확정" },
      { id: "2", time: "17:30", name: "정하늘", desc: "스타일링 컨설팅", status: "확정" },
    ],
  },
  {
    date: "6월 5일 목요일",
    items: [
      { id: "3", time: "10:00", name: "이미래", desc: "스트리트 룩북 촬영", status: "대기중" },
    ],
  },
  {
    date: "6월 12일 목요일",
    items: [
      { id: "4", time: "13:00", name: "박지현", desc: "오피스 룩 피팅", status: "확정" },
    ],
  },
];

export function SchedulePage() {
  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={
        <div className="px-5 py-4 flex items-center justify-between">
          <p className="font-sans font-semibold text-base text-charcoal">스케줄</p>
          <p className="font-sans text-sm text-muted">2026년 6월</p>
        </div>
      }
      footer={<BottomNav />}
    >
      <div className="max-w-[430px] mx-auto px-5 pt-4 pb-6 flex flex-col gap-6">
        {SCHEDULE.map((group) => (
          <div key={group.date}>
            <p className="font-sans font-semibold text-xs text-muted mb-3">{group.date}</p>
            <div className="flex flex-col gap-2">
              {group.items.map((item) => (
                <Card key={item.id} radius="compact">
                  <CardBody className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="text-right flex-shrink-0 w-10">
                        <p className="font-sans font-semibold text-xs text-charcoal">{item.time}</p>
                      </div>
                      <Divider className="h-8 w-px border-0 border-l border-border mx-1" />
                      <Avatar name={item.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-sans font-semibold text-sm text-charcoal">{item.name}</p>
                        <Caption className="truncate">{item.desc}</Caption>
                      </div>
                      <Badge variant={item.status === "확정" ? "default" : "outline"}>
                        {item.status}
                      </Badge>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
