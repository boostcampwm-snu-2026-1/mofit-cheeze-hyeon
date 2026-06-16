import { useEffect, useState } from "react";
import { useVtNavigate } from "@ui";
import {
  PageLayout,
  PageHeader,
  Button,
  EmptyState,
  Badge,
  BottomNav,
  Body,
  Caption,
} from "@ui";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/auth";

interface Portfolio {
  id: string;
  title: string;
  description: string | null;
  isVisible: boolean;
  createdAt: string;
  thumbnailUrl: string | null;
  imageCount: number;
}

export function PortfolioPage() {
  const navigate = useVtNavigate();
  const { user } = useAuthStore();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!user) return;
    setLoading(true);

    const { data: rows } = await supabase
      .from("portfolios")
      .select(`
        id, title, description, is_visible, created_at,
        portfolio_images ( storage_key, order_index )
      `)
      .eq("designer_id", user.id)
      .order("created_at", { ascending: false });

    if (!rows) {
      setLoading(false);
      return;
    }

    const items: Portfolio[] = rows.map((row) => {
      const images: { storage_key: string; order_index: number }[] =
        (row.portfolio_images as { storage_key: string; order_index: number }[]) ?? [];
      const first = images.sort((a, b) => a.order_index - b.order_index)[0];
      const thumbnailUrl = first
        ? supabase.storage
            .from("portfolios")
            .getPublicUrl(first.storage_key).data.publicUrl
        : null;

      return {
        id: row.id,
        title: row.title,
        description: row.description,
        isVisible: row.is_visible,
        createdAt: row.created_at,
        thumbnailUrl,
        imageCount: images.length,
      };
    });

    setPortfolios(items);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [user]);

  async function toggleVisibility(id: string, current: boolean) {
    await supabase
      .from("portfolios")
      .update({ is_visible: !current })
      .eq("id", id);
    setPortfolios((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isVisible: !current } : p))
    );
  }

  async function deletePortfolio(id: string) {
    if (!confirm("포트폴리오를 삭제할까요?")) return;

    // Get image keys to delete from storage
    const { data: images } = await supabase
      .from("portfolio_images")
      .select("storage_key")
      .eq("portfolio_id", id);

    if (images?.length) {
      await supabase.storage
        .from("portfolios")
        .remove(images.map((i) => i.storage_key));
    }

    await supabase.from("portfolios").delete().eq("id", id);
    setPortfolios((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={
        <PageHeader
          title="포트폴리오"
          onBack={() => navigate(-1)}
          right={
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/portfolio/new")}
            >
              + 추가
            </Button>
          }
        />
      }
      footer={<BottomNav />}
    >
      <div className="max-w-[430px] mx-auto px-5 pt-4 pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Caption className="text-muted">불러오는 중…</Caption>
          </div>
        ) : portfolios.length === 0 ? (
          <EmptyState
            title="포트폴리오가 없어요"
            description="시술 전/후 사진을 등록해 모델에게 실력을 보여주세요"
            action={
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate("/portfolio/new")}
              >
                첫 포트폴리오 추가하기
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {portfolios.map((p) => (
              <div
                key={p.id}
                className="rounded-card border border-border overflow-hidden"
              >
                <div className="flex">
                  {p.thumbnailUrl ? (
                    <img
                      src={p.thumbnailUrl}
                      alt=""
                      className="w-24 h-24 object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-surface-subtle shrink-0 flex items-center justify-center">
                      <Caption className="text-muted">사진 없음</Caption>
                    </div>
                  )}
                  <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-sans font-medium text-sm text-charcoal truncate">
                          {p.title}
                        </p>
                        <Badge variant={p.isVisible ? "default" : "muted"}>
                          {p.isVisible ? "공개" : "비공개"}
                        </Badge>
                      </div>
                      {p.description && (
                        <Body className="text-muted text-xs line-clamp-2">
                          {p.description}
                        </Body>
                      )}
                      <Caption className="text-muted mt-1">
                        사진 {p.imageCount}장
                      </Caption>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => navigate(`/portfolio/${p.id}/edit`)}
                        className="font-sans text-xs text-muted hover:text-charcoal transition-colors"
                      >
                        편집
                      </button>
                      <button
                        onClick={() => toggleVisibility(p.id, p.isVisible)}
                        className="font-sans text-xs text-muted hover:text-charcoal transition-colors"
                      >
                        {p.isVisible ? "비공개로" : "공개로"}
                      </button>
                      <button
                        onClick={() => deletePortfolio(p.id)}
                        className="font-sans text-xs text-muted hover:text-red-500 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
