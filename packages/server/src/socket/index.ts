import { Server } from "socket.io";
import type { Message } from "@mofit/shared";

export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    socket.on("room:join", ({ roomId }: { roomId: string }) => {
      socket.join(roomId);
    });

    socket.on("message:send", (msg: Omit<Message, "id" | "createdAt">) => {
      const full: Message = {
        ...msg,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      io.to(msg.roomId).emit("message:receive", full);
    });
  });
}
