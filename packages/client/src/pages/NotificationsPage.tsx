import { PageLayout, Avatar, BottomNav, EmptyState, Divider, Caption } from "@ui";

type NotifType = "match_accepted" | "match_request" | "chat" | "system";

const NOTIFICATIONS = [
  { id: "1", type: "match_accepted" as NotifType, name: "김소연", message: "매칭 요청을 수락했어요", time: "1시간 전", read: false },
  { id: "2", type: "match_request" as NotifType, name: "이미래", message: "새로운 매칭 요청이 있어요", time: "3시간 전", read: false },
  { id: "3", type: "chat" as NotifType, name: "박지현", message: "새 메시지: '일정 확인 부탁드려요'", time: "어제", read: true },
  { id: "4", type: "system" as NotifType, name: "", message: "프로필 작성을 완료하면 매칭 확률이 높아져요", time: "2일 전", read: true },
];

const typeIcon: Record<NotifType, string> = {
  match_accepted: "✓",
  match_request: "♡",
  chat: "✉",
  system: "i",
};

export function NotificationsPage() {
  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={
        <div className="px-5 py-4">
          <p className="font-sans font-semibold text-base text-charcoal">알림</p>
        </div>
      }
      footer={<BottomNav />}
    >
      <div className="max-w-[430px] mx-auto pt-2 pb-6">
        {NOTIFICATIONS.length === 0 ? (
          <EmptyState
            title="알림이 없어요"
            description="새로운 매칭 요청이나 메시지가 오면 여기서 확인할 수 있어요"
          />
        ) : (
          NOTIFICATIONS.map((n, i) => (
            <div key={n.id}>
              <div
                className={[
                  "flex items-start gap-3 px-5 py-4",
                  !n.read ? "bg-[rgba(28,28,28,0.02)]" : "",
                ].join(" ")}
              >
                <div className="w-9 h-9 rounded-pill border border-border flex items-center justify-center flex-shrink-0 bg-cream text-xs font-semibold text-charcoal mt-0.5">
                  {n.name ? (
                    <Avatar name={n.name} size="sm" />
                  ) : (
                    <span>{typeIcon[n.type]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-charcoal leading-snug">
                    {n.name && (
                      <span className="font-semibold">{n.name}님이 </span>
                    )}
                    {n.message}
                  </p>
                  <Caption className="mt-1">{n.time}</Caption>
                </div>
                {!n.read && (
                  <div className="w-1.5 h-1.5 rounded-pill bg-charcoal flex-shrink-0 mt-2" />
                )}
              </div>
              {i < NOTIFICATIONS.length - 1 && <Divider className="mx-5" />}
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
}
