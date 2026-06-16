import { useVtNavigate } from "@ui";
import { PageLayout, PageHeader, Avatar, BottomNav, EmptyState, Divider, Caption } from "@ui";
import { useAuthStore } from "../store/auth";
import { useMatchStore } from "../store/matchStore";
import { useChatStore } from "../store/chatStore";

export function ChatListPage() {
  const navigate = useVtNavigate();
  const { user } = useAuthStore();
  const { modelMatchings, designerMatchings } = useMatchStore();
  const { getMessages } = useChatStore();

  const isDesigner = user?.role === "designer";
  const chats = (isDesigner ? designerMatchings : modelMatchings).filter(
    (m) => m.status === "accepted"
  );

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={<PageHeader title="채팅" />}
      footer={<BottomNav />}
    >
      <div className="max-w-[430px] mx-auto">
        {chats.length === 0 ? (
          <EmptyState
            title="아직 채팅이 없어요"
            description="매칭이 수락되면 채팅으로 일정을 조율할 수 있어요"
          />
        ) : (
          <div>
            {chats.map((m, i) => {
              const name = isDesigner ? m.modelName : m.designerName;
              const roomMessages = getMessages(m.id);
              const lastMessage = roomMessages[roomMessages.length - 1];
              return (
                <div key={m.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/chat/${m.id}`)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-surface-hover transition-colors text-left"
                  >
                    <Avatar name={name} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-medium text-sm text-charcoal">{name}</p>
                      <p className="font-sans text-xs text-muted mt-0.5 truncate">
                        {lastMessage?.content ?? m.treatmentStyle}
                      </p>
                    </div>
                    <Caption className="flex-shrink-0">{lastMessage?.time}</Caption>
                  </button>
                  {i < chats.length - 1 && <Divider className="mx-5" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
