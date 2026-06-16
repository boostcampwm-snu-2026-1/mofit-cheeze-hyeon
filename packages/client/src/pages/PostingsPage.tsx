import { useVtNavigate } from "@ui";
import { PageLayout, PageHeader, BottomNav, Badge, Button, EmptyState, Caption } from "@ui";
import { usePostingStore } from "../store/postingStore";

export function PostingsPage() {
  const navigate = useVtNavigate();
  const { postings, deletePosting } = usePostingStore();

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={
        <PageHeader
          title="내 모집 공고"
          onBack={() => navigate(-1)}
          right={
            <Button variant="primary" size="sm" onClick={() => navigate("/my-postings/new")}>
              + 새 공고
            </Button>
          }
        />
      }
      footer={<BottomNav />}
    >
      <div className="max-w-[430px] mx-auto px-5 py-6">
        {postings.length === 0 ? (
          <EmptyState
            title="등록된 공고가 없어요"
            description="첫 번째 모집 공고를 올려보세요"
            action={
              <Button variant="primary" size="sm" onClick={() => navigate("/my-postings/new")}>
                공고 올리기
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {postings.map((posting) => (
              <div
                key={posting.id}
                className="rounded-card border border-border p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-medium text-sm text-charcoal truncate">
                      {posting.recruitStyle}
                    </p>
                    <Caption className="mt-0.5">
                      {posting.proposedPrice === 0
                        ? "무료 협업"
                        : `${posting.proposedPrice.toLocaleString()}원 제안`}
                    </Caption>
                  </div>
                  <Badge variant="default">모집중</Badge>
                </div>

                {posting.availableSlots.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {posting.availableSlots.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="inline-block px-2 py-0.5 rounded-compact border border-border font-sans text-xs text-muted"
                      >
                        {s.slice(5).replace("-", "/")}
                      </span>
                    ))}
                    {posting.availableSlots.length > 4 && (
                      <Caption>+{posting.availableSlots.length - 4}</Caption>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-1 border-t border-border">
                  <button
                    type="button"
                    onClick={() => navigate(`/my-postings/${posting.id}/edit`)}
                    className="flex-1 py-1.5 font-sans text-sm text-charcoal hover:text-primary transition-colors text-center"
                  >
                    수정
                  </button>
                  <div className="w-px bg-border" />
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("이 공고를 삭제할까요?")) deletePosting(posting.id);
                    }}
                    className="flex-1 py-1.5 font-sans text-sm text-muted hover:text-red-500 transition-colors text-center"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
