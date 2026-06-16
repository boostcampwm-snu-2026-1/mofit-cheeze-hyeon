import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useVtNavigate } from "@ui";
import { PageLayout, PageHeader, Avatar, Input, Button, Caption } from "@ui";
import { useAuthStore } from "../store/auth";
import { useMatchStore } from "../store/matchStore";
import { useChatStore } from "../store/chatStore";

const OTHER_NAME = "김소연";

export function ChatRoomPage() {
  const navigate = useVtNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuthStore();
  const { modelMatchings, designerMatchings } = useMatchStore();
  const { getMessages, addMessage } = useChatStore();
  const isDesigner = user?.role === "designer";
  const matching = (isDesigner ? designerMatchings : modelMatchings).find((m) => m.id === roomId);
  const counterpartName = matching
    ? isDesigner ? matching.modelName : matching.designerName
    : OTHER_NAME;

  const messages = getMessages(roomId ?? "");
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text || !roomId) return;
    addMessage(roomId, {
      id: Date.now(),
      sender: "me",
      content: text,
      time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    });
    setDraft("");
  };

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0 flex flex-col"
      header={
        <PageHeader
          onBack={() => navigate(-1)}
          title={
            <div className="flex items-center gap-2">
              <Avatar name={counterpartName} size="sm" />
              <p className="font-sans font-semibold text-sm text-charcoal truncate">
                {counterpartName}
              </p>
            </div>
          }
        />
      }
    >
      <div className="max-w-[430px] mx-auto w-full flex-1 flex flex-col min-h-0">
        {/* Messages */}
        <div className="flex-1 min-h-0 px-4 py-4 flex flex-col gap-3 overflow-y-auto">
          <div className="flex justify-center mb-2">
            <Caption className="text-muted">매칭이 수락되었어요 · 일정을 조율해보세요</Caption>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={["flex gap-2", msg.sender === "me" ? "flex-row-reverse" : "flex-row"].join(
                " "
              )}
            >
              {msg.sender === "other" && (
                <Avatar name={counterpartName} size="sm" className="flex-shrink-0 mt-0.5" />
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
        <div className="px-4 py-3 border-t border-border flex items-center gap-2 bg-cream">
          <button
            type="button"
            disabled
            title="사진 첨부는 준비 중이에요"
            className="flex-shrink-0 w-11 h-11 rounded-card border border-border text-muted flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="10" r="1.5" />
              <path d="M21 16l-5-5-4 4-2-2-5 5" />
            </svg>
          </button>
          <div className="flex-1">
            <Input
              placeholder="메시지 입력..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="w-full"
            />
          </div>
          <Button variant="primary" size="md" onClick={send}>
            전송
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
