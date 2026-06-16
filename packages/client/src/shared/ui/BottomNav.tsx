import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { useMatchStore } from "../../store/matchStore";
import { useNotificationStore } from "../../store/notificationStore";

interface Tab {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

function NavBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] rounded-pill bg-primary text-offwhite text-[9px] font-sans font-semibold flex items-center justify-center px-1 leading-none">
      {count > 9 ? "9+" : count}
    </span>
  );
}

const ICONS = {
  discover: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  matching: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  chat: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  ),
  schedule: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  notifications: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  profile: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
};

function vtNavigate(navigate: ReturnType<typeof useNavigate>, to: string) {
  if ("startViewTransition" in document) {
    document.startViewTransition(() => navigate(to));
  } else {
    navigate(to);
  }
}

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  const { modelMatchings, designerMatchings } = useMatchStore();
  const { notifications } = useNotificationStore();

  const isDesigner = user?.role === "designer";
  const allMatchings = isDesigner ? designerMatchings : modelMatchings;

  const chatBadge = allMatchings.filter((m) => m.status === "accepted").length;
  const notifBadge = notifications.filter((n) => !n.read).length;

  const MODEL_TABS: Tab[] = [
    { to: "/discover", label: "탐색", icon: ICONS.discover },
    { to: "/matching/inbox", label: "매칭", icon: ICONS.matching },
    { to: "/chat", label: "채팅", icon: ICONS.chat, badge: chatBadge },
    { to: "/notifications", label: "알림", icon: ICONS.notifications, badge: notifBadge },
    { to: "/profile", label: "프로필", icon: ICONS.profile },
  ];

  const DESIGNER_TABS: Tab[] = [
    { to: "/matching/inbox", label: "매칭", icon: ICONS.matching },
    { to: "/chat", label: "채팅", icon: ICONS.chat, badge: chatBadge },
    { to: "/schedule", label: "스케줄", icon: ICONS.schedule },
    { to: "/notifications", label: "알림", icon: ICONS.notifications, badge: notifBadge },
    { to: "/profile", label: "프로필", icon: ICONS.profile },
  ];

  const tabs = isDesigner ? DESIGNER_TABS : MODEL_TABS;

  return (
    <nav className="flex items-stretch bg-cream max-w-[430px] mx-auto w-full">
      {tabs.map((tab) => {
        const isActive = pathname === tab.to || pathname.startsWith(tab.to + "/");
        return (
          <button
            key={tab.to}
            onClick={() => vtNavigate(navigate, tab.to)}
            className={[
              "flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors",
              isActive ? "text-primary" : "text-muted hover:text-charcoal",
            ].join(" ")}
          >
            <div className="relative">
              {tab.icon}
              <NavBadge count={tab.badge ?? 0} />
            </div>
            <span className="font-sans text-[10px] leading-none">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
