import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PageLayout,
  Input,
  Button,
  Switch,
  TagSelector,
  ImageUpload,
  Body,
  type UploadImage,
} from "@ui";
import { MOCK_DESIGNERS } from "../lib/mockData";
import { useAuthStore } from "../store/auth";
import { useMatchStore } from "../store/matchStore";

const STYLE_OPTIONS = [
  "커트", "레이어드", "단발", "웨이브", "볼륨 펌", "스파이럴 펌",
  "염색", "탈색", "애쉬", "브라운", "매직", "스타일링",
];

export function MatchApplyPage() {
  const navigate = useNavigate();
  const { designerId } = useParams<{ designerId: string }>();
  const { user } = useAuthStore();
  const { addMatching } = useMatchStore();

  const designer = MOCK_DESIGNERS.find((d) => d.id === designerId);

  const [styles, setStyles] = useState<string[]>([]);
  const [memo, setMemo] = useState("");
  const [images, setImages] = useState<UploadImage[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>(["", ""]);
  const [proposedPrice, setProposedPrice] = useState("");
  const [allowContentUsage, setAllowContentUsage] = useState(false);
  const [allowFaceExposure, setAllowFaceExposure] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function addDateSlot() {
    if (availableDates.length < 5) setAvailableDates((d) => [...d, ""]);
  }

  function updateDate(idx: number, val: string) {
    setAvailableDates((d) => d.map((v, i) => (i === idx ? val : v)));
  }

  function handleAddImages(files: FileList) {
    const newImgs: UploadImage[] = Array.from(files).map((file) => ({
      id: `new_${crypto.randomUUID()}`,
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...newImgs]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (styles.length === 0) {
      setError("원하는 시술 스타일을 선택해주세요.");
      return;
    }
    const filledDates = availableDates.filter(Boolean);
    if (filledDates.length === 0) {
      setError("가능한 날짜를 최소 1개 입력해주세요.");
      return;
    }

    setSubmitting(true);

    // Mock: add to store
    addMatching({
      id: `m_${Date.now()}`,
      modelId: user?.id ?? "mock-user-id",
      modelName: user?.name ?? "홍길동",
      designerId: designerId ?? "1",
      designerName: designer?.name ?? "",
      treatmentStyle: styles.join(", "),
      availableDates: filledDates,
      proposedPrice: parseInt(proposedPrice.replace(/,/g, "")) || 0,
      allowContentUsage,
      allowFaceExposure,
      status: "pending",
      createdAt: new Date().toISOString(),
      memo,
    });

    navigate("/matching/inbox", { replace: true });
  }

  if (!designer) {
    return (
      <PageLayout fullWidth className="p-0 py-0">
        <div className="flex items-center justify-center min-h-screen">
          <Body className="text-muted">디자이너를 찾을 수 없어요</Body>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout fullWidth className="p-0 py-0">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[430px] mx-auto px-5 py-6 flex flex-col"
      >
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="font-sans text-sm text-muted hover:text-charcoal transition-colors"
          >
            ← 뒤로
          </button>
          <p className="font-sans font-semibold text-base text-charcoal">
            매칭 신청
          </p>
        </div>

        {/* Designer summary */}
        <div className="flex items-center gap-3 p-4 rounded-card border border-border mb-6">
          <div className="w-10 h-10 rounded-pill bg-surface-subtle flex items-center justify-center font-sans font-medium text-sm text-charcoal flex-shrink-0">
            {designer.name.charAt(0)}
          </div>
          <div>
            <p className="font-sans font-medium text-sm text-charcoal">
              {designer.name}
            </p>
            <p className="font-sans text-xs text-muted">{designer.specialty} · {designer.region}</p>
          </div>
        </div>

        <div className="flex flex-col gap-7">
          {/* Treatment styles */}
          <div>
            <p className="font-sans text-sm font-medium text-charcoal mb-1">
              원하는 시술 스타일 <span className="text-red-400">*</span>
            </p>
            <Body className="text-muted mb-3">여러 개 선택 가능</Body>
            <TagSelector
              options={STYLE_OPTIONS}
              value={styles}
              onChange={setStyles}
            />
          </div>

          {/* Memo */}
          <div>
            <p className="font-sans text-sm font-medium text-charcoal mb-2">
              상세 요청 메모{" "}
              <span className="text-muted font-normal">(선택)</span>
            </p>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="원하는 스타일, 모발 상태, 주의사항 등을 자유롭게 알려주세요"
              rows={3}
              className="w-full rounded-card border border-border bg-cream font-sans text-sm text-charcoal placeholder:text-muted px-3 py-2.5 resize-none focus:outline-none focus:border-border-interactive transition-colors"
            />
          </div>

          {/* Reference images */}
          <div>
            <p className="font-sans text-sm font-medium text-charcoal mb-2">
              참고 이미지{" "}
              <span className="text-muted font-normal">(선택)</span>
            </p>
            <ImageUpload
              images={images}
              onAdd={handleAddImages}
              onRemove={(imgId) =>
                setImages((prev) => prev.filter((i) => i.id !== imgId))
              }
              maxImages={5}
            />
          </div>

          {/* Available dates */}
          <div>
            <p className="font-sans text-sm font-medium text-charcoal mb-3">
              가능한 날짜 <span className="text-red-400">*</span>
            </p>
            <div className="flex flex-col gap-2">
              {availableDates.map((date, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => updateDate(i, e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="flex-1 h-11 rounded-card border border-border bg-cream font-sans text-sm text-charcoal px-3 focus:outline-none focus:border-border-interactive transition-colors"
                  />
                  {availableDates.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setAvailableDates((d) => d.filter((_, j) => j !== i))
                      }
                      className="font-sans text-sm text-muted hover:text-charcoal px-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            {availableDates.length < 5 && (
              <button
                type="button"
                onClick={addDateSlot}
                className="mt-2 font-sans text-sm text-muted hover:text-charcoal transition-colors"
              >
                + 날짜 추가
              </button>
            )}
          </div>

          {/* Proposed price */}
          <Input
            label="제안 비용 (선택)"
            type="number"
            placeholder="0 (무료 협업)"
            hint="0이면 무료 협업으로 신청됩니다"
            value={proposedPrice}
            onChange={(e) => setProposedPrice(e.target.value)}
          />

          {/* Consent */}
          <div className="border-t border-border pt-5 flex flex-col gap-4">
            <p className="font-sans text-sm font-medium text-charcoal">
              동의 조건
            </p>
            <Switch
              checked={allowContentUsage}
              onChange={setAllowContentUsage}
              label="콘텐츠 활용 동의"
              description="시술 사진을 SNS·포트폴리오에 활용할 수 있어요"
            />
            <Switch
              checked={allowFaceExposure}
              onChange={setAllowFaceExposure}
              label="얼굴 공개 동의"
              description="얼굴이 포함된 사진을 게시할 수 있어요"
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
          {submitting ? "신청 중…" : "매칭 신청하기"}
        </Button>
      </form>
    </PageLayout>
  );
}
