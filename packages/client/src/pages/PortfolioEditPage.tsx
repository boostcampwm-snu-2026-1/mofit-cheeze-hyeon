import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useVtNavigate } from "@ui";
import {
  PageLayout,
  PageHeader,
  Input,
  Button,
  Switch,
  ImageUpload,
  type UploadImage,
} from "@ui";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/auth";

export function PortfolioEditPage() {
  const navigate = useVtNavigate();
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuthStore();
  const isNew = !id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [images, setImages] = useState<UploadImage[]>([]);
  const [removedKeys, setRemovedKeys] = useState<string[]>([]);

  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    async function loadPortfolio() {
      const { data: portfolio } = await supabase
        .from("portfolios")
        .select("title, description, is_visible")
        .eq("id", id)
        .single();

      if (portfolio) {
        setTitle(portfolio.title);
        setDescription(portfolio.description ?? "");
        setIsVisible(portfolio.is_visible);
      }

      const { data: imgRows } = await supabase
        .from("portfolio_images")
        .select("id, storage_key, order_index")
        .eq("portfolio_id", id)
        .order("order_index");

      if (imgRows) {
        setImages(
          imgRows.map((row) => ({
            id: row.id,
            url: supabase.storage
              .from("portfolios")
              .getPublicUrl(row.storage_key).data.publicUrl,
          }))
        );
      }

      setLoading(false);
    }
    loadPortfolio();
  }, [id]);

  function handleAddImages(files: FileList) {
    const newImgs: UploadImage[] = Array.from(files).map((file) => ({
      id: `new_${crypto.randomUUID()}`,
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...newImgs]);
  }

  function handleRemoveImage(imgId: string) {
    const img = images.find((i) => i.id === imgId);
    if (img && !img.file) {
      // Existing image — mark for removal from storage
      const key = img.url.split("/portfolios/")[1];
      if (key) setRemovedKeys((prev) => [...prev, key]);
    }
    setImages((prev) => prev.filter((i) => i.id !== imgId));
  }

  async function uploadImage(
    file: File,
    designerId: string,
    portfolioId: string
  ): Promise<string> {
    const ext = file.name.split(".").pop() ?? "jpg";
    const key = `${designerId}/${portfolioId}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("portfolios")
      .upload(key, file);
    if (uploadError) throw uploadError;
    return key;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (images.length === 0) {
      setError("사진을 최소 1장 이상 추가해주세요.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      let portfolioId = id;

      if (isNew) {
        const { data, error: insertError } = await supabase
          .from("portfolios")
          .insert({
            designer_id: user.id,
            title: title.trim(),
            description: description.trim() || null,
            is_visible: isVisible,
          })
          .select("id")
          .single();

        if (insertError || !data) throw insertError ?? new Error("포트폴리오 생성 실패");
        portfolioId = data.id;
      } else {
        await supabase
          .from("portfolios")
          .update({
            title: title.trim(),
            description: description.trim() || null,
            is_visible: isVisible,
          })
          .eq("id", id);
      }

      // Delete removed images from storage
      if (removedKeys.length) {
        await supabase.storage.from("portfolios").remove(removedKeys);
        // Delete from portfolio_images by storage_key
        for (const key of removedKeys) {
          await supabase
            .from("portfolio_images")
            .delete()
            .eq("portfolio_id", portfolioId!)
            .eq("storage_key", key);
        }
      }

      // Upload new images and insert rows
      const newImages = images.filter((img) => !!img.file);
      const existingCount = images.filter((img) => !img.file).length;

      for (let i = 0; i < newImages.length; i++) {
        const img = newImages[i];
        const key = await uploadImage(img.file!, user.id, portfolioId!);
        await supabase.from("portfolio_images").insert({
          portfolio_id: portfolioId,
          storage_key: key,
          order_index: existingCount + i,
        });
      }

      navigate("/portfolio", { replace: true });
    } catch {
      setError("저장 중 오류가 발생했습니다.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <PageLayout
        fullWidth
        className="p-0 py-0"
        header={<PageHeader title={isNew ? "포트폴리오 추가" : "포트폴리오 편집"} onBack={() => navigate(-1)} />}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="font-sans text-sm text-muted">불러오는 중…</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={<PageHeader title={isNew ? "포트폴리오 추가" : "포트폴리오 편집"} onBack={() => navigate(-1)} />}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[430px] mx-auto px-5 py-6 flex flex-col"
      >
        <div className="flex flex-col gap-6">
          <Input
            label="제목"
            placeholder="예: 내추럴 웨이브 펌"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <p className="font-sans text-sm font-medium text-charcoal mb-2">
              설명 <span className="text-muted font-normal">(선택)</span>
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="시술 내용, 사용 약품, 소요 시간 등을 알려주세요"
              rows={3}
              className="w-full rounded-card border border-border bg-cream font-sans text-sm text-charcoal placeholder:text-muted px-3 py-2.5 resize-none focus:outline-none focus:border-border-interactive transition-colors"
            />
          </div>

          <div>
            <p className="font-sans text-sm font-medium text-charcoal mb-3">
              사진
            </p>
            <ImageUpload
              images={images}
              onAdd={handleAddImages}
              onRemove={handleRemoveImage}
              maxImages={10}
            />
            <p className="font-sans text-xs text-muted mt-2">
              최대 10장까지 추가할 수 있어요
            </p>
          </div>

          <div className="border-t border-border pt-5">
            <Switch
              checked={isVisible}
              onChange={setIsVisible}
              label="공개"
              description="모델이 내 포트폴리오를 볼 수 있어요"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 font-sans text-xs text-red-500">{error}</p>
        )}

        <Button
          variant="primary"
          size="lg"
          className="w-full mt-8"
          disabled={submitting}
        >
          {submitting ? "저장 중…" : isNew ? "등록하기" : "저장"}
        </Button>
      </form>
    </PageLayout>
  );
}
