import { useVtNavigate } from "@ui";
import { PageLayout, PageHeader, Avatar, BottomNav, EmptyState, Divider, Caption } from "@ui";
import { useNotificationStore } from "../store/notificationStore";

const TYPE_ICON: Record<string, string> = {
  match_accepted: "✓",
  match_request: "♡",
  match_rejected: "✕",
  chat: "✉",
  system: "i",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}시간 전`;
  return `${Math.floor(hrs / 24)}일 전`;
}

export function NotificationsPage() {
  const navigate = useVtNavigate();
  const { notifications, markRead, markAllRead } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleClick(n: (typeof notifications)[number]) {
    markRead(n.id);
    if (n.href) navigate(n.href);
  }

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={
        <PageHeader
          title={
            <div className="flex items-center gap-2">
              <span>알림</span>
              {unreadCount > 0 && (
                <span className="w-5 h-5 rounded-pill bg-charcoal text-offwhite text-xs flex items-center justify-center font-sans font-medium">
                  {unreadCount}
                </span>
              )}
            </div>
          }
          right={
            unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="font-sans text-xs text-muted hover:text-charcoal transition-colors"
              >
                모두 읽음
              </button>
            )
          }
        />
      }
      footer={<BottomNav />}
    >
      <div className="max-w-[430px] mx-auto pt-2 pb-6">
        {notifications.length === 0 ? (
          <EmptyState
            title="알림이 없어요"
            description="새로운 매칭 요청이나 메시지가 오면 여기서 확인할 수 있어요"
          />
        ) : (
          notifications.map((n, i) => (
            <div key={n.id}>
              <button
                type="button"
                onClick={() => handleClick(n)}
                className={[
                  "w-full flex items-start gap-3 px-5 py-4 text-left transition-colors",
                  !n.read ? "bg-surface-subtle" : "hover:bg-surface-hover",
                ].join(" ")}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {n.name ? (
                    <Avatar name={n.name} size="sm" />
                  ) : (
                    <div className="w-8 h-8 rounded-pill border border-border flex items-center justify-center text-xs font-medium text-charcoal bg-cream">
                      {TYPE_ICON[n.type]}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-charcoal leading-snug">
                    {n.name && <span className="font-medium">{n.name}님이 </span>}
                    {n.message}
                  </p>
                  <Caption className="mt-1">{timeAgo(n.time)}</Caption>
                </div>
                {!n.read && (
                  <div className="w-1.5 h-1.5 rounded-pill bg-primary flex-shrink-0 mt-2" />
                )}
              </button>
              {i < notifications.length - 1 && <Divider className="mx-5" />}
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
}
