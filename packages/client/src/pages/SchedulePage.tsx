import { PageLayout, PageHeader, Card, CardBody, Avatar, Badge, BottomNav, Caption, Divider } from "@ui";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(d.getDate() + n);
  return r;
}

function fmtDate(d: Date, prefix?: string) {
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const wd = WEEKDAYS[d.getDay()];
  return prefix ?? `${m}월 ${day}일 ${wd}요일`;
}

function buildSchedule() {
  const today = new Date();
  const d1 = addDays(today, 5);
  const d2 = addDays(today, 12);

  return [
    {
      date: `오늘, ${today.getMonth() + 1}월 ${today.getDate()}일 ${WEEKDAYS[today.getDay()]}요일`,
      items: [
        { id: "s1", time: "14:00", name: "강민서", desc: "미디엄 레이어드", status: "확정" },
        { id: "s2", time: "17:30", name: "이수진", desc: "레이어드 커트 + 스타일링", status: "확정" },
      ],
    },
    {
      date: fmtDate(d1),
      items: [
        { id: "s3", time: "11:00", name: "최예린", desc: "내추럴 단발 커트", status: "대기중" },
      ],
    },
    {
      date: fmtDate(d2),
      items: [
        { id: "s4", time: "14:00", name: "김예나", desc: "애쉬 그레이 탈색", status: "확정" },
        { id: "s5", time: "16:30", name: "윤지원", desc: "내추럴 브라운 톤다운", status: "확정" },
      ],
    },
  ];
}

export function SchedulePage() {
  const schedule = buildSchedule();
  const today = new Date();

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={
        <PageHeader
          title="스케줄"
          right={
            <p className="font-sans text-sm text-muted">
              {today.getFullYear()}년 {today.getMonth() + 1}월
            </p>
          }
        />
      }
      footer={<BottomNav />}
    >
      <div className="max-w-[430px] mx-auto px-5 pt-4 pb-6 flex flex-col gap-6">
        {schedule.map((group) => (
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
