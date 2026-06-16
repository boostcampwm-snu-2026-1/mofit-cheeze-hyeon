import { create } from "zustand";

export interface ChatMessage {
  id: number;
  sender: "me" | "other";
  content: string;
  time: string;
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  { id: 1, sender: "other", content: "안녕하세요! 매칭 요청 감사해요 😊", time: "14:30" },
  { id: 2, sender: "me", content: "네, 포트폴리오 보고 연락드렸어요!", time: "14:31" },
  { id: 3, sender: "other", content: "어떤 시술을 원하시는지 알려주세요.", time: "14:32" },
  { id: 4, sender: "me", content: "레이어드 커트에 애쉬 브라운 염색을 생각하고 있어요.", time: "14:33" },
];

interface ChatStore {
  messagesByRoom: Record<string, ChatMessage[]>;
  getMessages: (roomId: string) => ChatMessage[];
  addMessage: (roomId: string, message: ChatMessage) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messagesByRoom: {},

  getMessages: (roomId) => get().messagesByRoom[roomId] ?? DEFAULT_MESSAGES,

  addMessage: (roomId, message) =>
    set((state) => ({
      messagesByRoom: {
        ...state.messagesByRoom,
        [roomId]: [...(state.messagesByRoom[roomId] ?? DEFAULT_MESSAGES), message],
      },
    })),
}));
