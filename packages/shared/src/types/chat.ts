export type MessageType = "text" | "image" | "reservation_proposal" | "reservation_confirmed";

export interface ChatRoom {
  id: string;
  matchingId: string;
  participantIds: [string, string];
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  type: MessageType;
  content: string;
  imageUrl?: string;
  reservationData?: {
    proposedAt: string;
    location?: string;
  };
  createdAt: string;
}

export interface SocketEvents {
  // client → server
  "room:join": { roomId: string };
  "message:send": Omit<Message, "id" | "createdAt">;
  // server → client
  "message:receive": Message;
  "room:updated": ChatRoom;
}
