import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout, Avatar, Input, Button } from "@ui";

type Message = {
  id: number;
  sender: "me" | "other";
  content: string;
  time: string;
};

const INITIAL_MESSAGES: Message[] = [
  { id: 1, sender: "other", content: "안녕하세요! 매칭 요청 감사해요 😊", time: "14:30" },
  { id: 2, sender: "me", content: "네, 포트폴리오 보고 연락드렸어요!", time: "14:31" },
  { id: 3, sender: "other", content: "어떤 스타일을 찾고 계신지 이야기해주세요.", time: "14:32" },
  { id: 4, sender: "me", content: "미니멀하면서 편안한 캐주얼 룩을 원해요.", time: "14:33" },
];

const OTHER_NAME = "김소연";

export function ChatRoomPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "me",
        content: text,
        time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setDraft("");
  };

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0 flex flex-col"
      header={
        <div className="flex items-center gap-3 px-5 py-3">
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-sans text-muted hover:text-charcoal transition-colors"
          >
            ←
          </button>
          <Avatar name={OTHER_NAME} size="sm" />
          <p className="font-sans font-semibold text-sm text-charcoal">{OTHER_NAME}</p>
        </div>
      }
    >
      <div className="max-w-[430px] mx-auto w-full flex flex-col h-full">
        {/* Messages */}
        <div className="flex-1 px-4 py-4 flex flex-col gap-3 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={["flex gap-2", msg.sender === "me" ? "flex-row-reverse" : "flex-row"].join(
                " "
              )}
            >
              {msg.sender === "other" && (
                <Avatar name={OTHER_NAME} size="sm" className="flex-shrink-0 mt-0.5" />
              )}
              <div
                className={[
                  "max-w-[72%] rounded-card px-3.5 py-2.5",
                  msg.sender === "me"
                    ? "bg-charcoal text-offwhite rounded-br-micro"
                    : "bg-cream border border-border text-charcoal rounded-bl-micro",
                ].join(" ")}
              >
                <p className="font-sans text-sm leading-relaxed">{msg.content}</p>
                <p
                  className={[
                    "font-sans text-[10px] mt-1",
                    msg.sender === "me" ? "text-[rgba(252,251,248,0.6)]" : "text-muted",
                  ].join(" ")}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="px-4 py-3 border-t border-border flex gap-2 bg-cream">
          <Input
            placeholder="메시지 입력..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1"
          />
          <Button variant="primary" size="md" onClick={send}>
            전송
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
