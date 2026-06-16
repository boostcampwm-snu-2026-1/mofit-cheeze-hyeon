import { create } from "zustand";

type NotifType = "match_accepted" | "match_request" | "match_rejected" | "chat" | "system";

export interface Notification {
  id: string;
  type: NotifType;
  name?: string;
  message: string;
  time: string;
  read: boolean;
  href?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
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
    href: "/chat/m2",
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

interface NotificationStore {
  notifications: Notification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: INITIAL_NOTIFICATIONS,
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),
}));
