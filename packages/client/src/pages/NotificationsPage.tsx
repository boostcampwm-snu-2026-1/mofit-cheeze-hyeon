import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout, Avatar, BottomNav, EmptyState, Divider, Caption } from "@ui";

type NotifType = "match_accepted" | "match_request" | "match_rejected" | "chat" | "system";

interface Notification {
  id: string;
  type: NotifType;
  name?: string;
  message: string;
  time: string;
  read: boolean;
  href?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "match_accepted",
    name: "김소연",
    message: "매칭 요청을 수락했어요",
    time: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: false,
    href: "/matching/m2",
  },
  {
    id: "2",
    type: "match_request",
    name: "이수진",
    message: "새로운 매칭 신청이 도착했어요",
    time: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read: false,
    href: "/matching/d1",
  },
  {
    id: "3",
    type: "match_rejected",
    name: "최다은",
    message: "매칭 요청을 거절했어요",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    href: "/matching/inbox",
  },
  {
    id: "4",
    type: "chat",
    name: "박지현",
    message: "'일정 확인 부탁드려요' 메시지가 도착했어요",
    time: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    read: true,
    href: "/chat/room1",
  },
  {
    id: "5",
    type: "system",
    message: "프로필을 완성하면 매칭 확률이 높아져요",
    time: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
    href: "/profile",
  },
];

const TYPE_ICON: Record<NotifType, string> = {
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
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function handleClick(n: Notification) {
    markRead(n.id);
    if (n.href) navigate(n.href);
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <p className="font-sans font-semibold text-base text-charcoal">
              알림
            </p>
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-pill bg-charcoal text-offwhite text-xs flex items-center justify-center font-sans font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="font-sans text-xs text-muted hover:text-charcoal transition-colors"
            >
              모두 읽음
            </button>
          )}
        </div>
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
                    {n.name && (
                      <span className="font-medium">{n.name}님이 </span>
                    )}
                    {n.message}
                  </p>
                  <Caption className="mt-1">{timeAgo(n.time)}</Caption>
                </div>
                {!n.read && (
                  <div className="w-1.5 h-1.5 rounded-pill bg-charcoal flex-shrink-0 mt-2" />
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
