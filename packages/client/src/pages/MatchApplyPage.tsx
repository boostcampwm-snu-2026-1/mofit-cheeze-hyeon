import { useState } from "react";
import { useParams } from "react-router-dom";
import { useVtNavigate } from "@ui";
import {
  PageLayout,
  PageHeader,
  Button,
  Switch,
  ImageUpload,
  Body,
  Caption,
  type UploadImage,
} from "@ui";
import { MOCK_DESIGNERS } from "../lib/mockData";
import { formatSlotParts } from "../lib/date";
import { useAuthStore } from "../store/auth";
import { useMatchStore } from "../store/matchStore";

const HAIR_LENGTHS = ["단발", "미디엄", "롱"];
const HAIR_CONDITIONS = ["건강", "보통", "손상"];
const HAIR_COLORS = ["자연 흑발", "갈색", "밝은 갈색", "금발·블론드", "탈색됨", "기타 염색"];

function addFiles(
  setter: React.Dispatch<React.SetStateAction<UploadImage[]>>,
  files: FileList
) {
  const imgs: UploadImage[] = Array.from(files).map((file) => ({
    id: `new_${crypto.randomUUID()}`,
    url: URL.createObjectURL(file),
    file,
  }));
  setter((prev) => [...prev, ...imgs]);
}

export function MatchApplyPage() {
  const navigate = useVtNavigate();
  const { designerId } = useParams<{ designerId: string }>();
  const { user } = useAuthStore();
  const { addMatching } = useMatchStore();

  const designer = MOCK_DESIGNERS.find((d) => d.id === designerId);

  // Hair state
  const [hairLength, setHairLength] = useState("");
  const [hairCondition, setHairCondition] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [hairStateImages, setHairStateImages] = useState<UploadImage[]>([]);

  // Dates, memo, reference images, consent
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [memo, setMemo] = useState("");
  const [refImages, setRefImages] = useState<UploadImage[]>([]);
  const [allowContentUsage, setAllowContentUsage] = useState(false);
  const [allowFaceExposure, setAllowFaceExposure] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function toggleSlot(slot: string) {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (selectedSlots.length === 0) {
      setError("가능한 날짜를 1개 이상 선택해주세요.");
      return;
    }
    if (!hairLength || !hairCondition || !currentColor) {
      setError("현재 헤어 상태를 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);

    addMatching({
      id: `m_${Date.now()}`,
      modelId: user?.id ?? "mock-user-id",
      modelName: user?.name ?? "홍길동",
      designerId: designerId ?? "1",
      designerName: designer?.name ?? "",
      treatmentStyle: designer?.recruitStyle ?? "",
      availableDates: selectedSlots,
      proposedPrice: designer?.proposedPrice ?? 0,
      allowContentUsage,
      allowFaceExposure,
      status: "pending",
      createdAt: new Date().toISOString(),
      memo,
      hairLength,
      hairCondition,
      currentColor,
    });

    navigate("/matching/inbox", { replace: true });
  }

  if (!designer) {
    return (
      <PageLayout
        fullWidth
        className="p-0 py-0"
        header={<PageHeader title="매칭 신청" onBack={() => navigate(-1)} />}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <Body className="text-muted">디자이너를 찾을 수 없어요</Body>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={<PageHeader title="매칭 신청" onBack={() => navigate(-1)} />}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[430px] mx-auto px-5 py-6 flex flex-col"
      >
        {/* Designer summary */}
        <div className="flex items-center gap-3 p-4 rounded-card border border-border mb-6">
          <div className="w-10 h-10 rounded-pill bg-surface-subtle flex items-center justify-center font-sans font-medium text-sm text-charcoal flex-shrink-0">
            {designer.name.charAt(0)}
          </div>
          <div>
            <p className="font-sans font-medium text-sm text-charcoal">{designer.name}</p>
            <p className="font-sans text-xs text-muted">{designer.specialty} · {designer.region}</p>
          </div>
        </div>

        {/* Recruit info */}
        <div className="rounded-card border border-border p-4 mb-7 flex flex-col gap-3">
          <p className="font-sans text-sm font-semibold text-charcoal">모집 정보</p>
          <div className="flex items-center justify-between">
            <Caption>시술 스타일</Caption>
            <p className="font-sans text-sm font-medium text-charcoal text-right">{designer.recruitStyle}</p>
          </div>
          <div className="flex items-center justify-between">
            <Caption>제안 비용</Caption>
            <p className="font-sans text-sm font-medium text-charcoal">
              {designer.proposedPrice === 0 ? "무료 협업" : `${designer.proposedPrice.toLocaleString()}원`}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-7">
          {/* Date selection */}
          <div>
            <p className="font-sans text-sm font-medium text-charcoal mb-1">
              가능한 날짜 선택 <span className="text-red-400">*</span>
            </p>
            <Body className="text-muted mb-3">디자이너가 제시한 날짜 중 가능한 날짜를 모두 선택해주세요</Body>
            <div className="grid grid-cols-4 gap-2">
              {designer.availableSlots.map((slot) => {
                const { month, day, weekday } = formatSlotParts(slot);
                const selected = selectedSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleSlot(slot)}
                    className={[
                      "flex flex-col items-center justify-center gap-0.5 rounded-card border py-3 transition-colors",
                      selected
                        ? "border-primary bg-primary text-offwhite"
                        : "border-border text-charcoal hover:border-border-interactive",
                    ].join(" ")}
                  >
                    <span className="font-sans text-xs">{month}월</span>
                    <span className="font-sans text-base font-semibold">{day}</span>
                    <span className="font-sans text-xs">{weekday}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current hair state */}
          <div>
            <p className="font-sans text-sm font-medium text-charcoal mb-1">
              현재 헤어 상태 <span className="text-red-400">*</span>
            </p>
            <Body className="text-muted mb-4">디자이너가 시술 가능 여부를 판단하는 데 사용해요</Body>

            <div className="flex flex-col gap-4">
              {/* Length */}
              <div>
                <Caption className="block mb-2">헤어 길이</Caption>
                <div className="flex gap-2">
                  {HAIR_LENGTHS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setHairLength(l)}
                      className={[
                        "flex-1 py-2.5 rounded-card border font-sans text-sm transition-colors",
                        hairLength === l
                          ? "border-charcoal bg-charcoal text-offwhite"
                          : "border-border text-muted hover:border-border-interactive hover:text-charcoal",
                      ].join(" ")}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <Caption className="block mb-2">모발 상태</Caption>
                <div className="flex gap-2">
                  {HAIR_CONDITIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setHairCondition(c)}
                      className={[
                        "flex-1 py-2.5 rounded-card border font-sans text-sm transition-colors",
                        hairCondition === c
                          ? "border-charcoal bg-charcoal text-offwhite"
                          : "border-border text-muted hover:border-border-interactive hover:text-charcoal",
                      ].join(" ")}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current color */}
              <div>
                <Caption className="block mb-2">현재 컬러</Caption>
                <div className="flex flex-wrap gap-2">
                  {HAIR_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrentColor(c)}
                      className={[
                        "px-3 py-1.5 rounded-pill border font-sans text-sm transition-colors",
                        currentColor === c
                          ? "border-charcoal bg-charcoal text-offwhite"
                          : "border-border text-muted hover:border-border-interactive hover:text-charcoal",
                      ].join(" ")}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current hair photos */}
              <div>
                <Caption className="block mb-1">현재 헤어 사진 <span className="text-muted font-normal">(선택)</span></Caption>
                <Body className="text-muted text-xs mb-2">앞·옆·뒤 사진을 올리면 수락 확률이 높아져요</Body>
                <ImageUpload
                  images={hairStateImages}
                  onAdd={(f) => addFiles(setHairStateImages, f)}
                  onRemove={(id) => setHairStateImages((p) => p.filter((i) => i.id !== id))}
                  maxImages={3}
                />
              </div>
            </div>
          </div>

          {/* Reference images */}
          <div>
            <p className="font-sans text-sm font-medium text-charcoal mb-2">
              원하는 스타일 사진 <span className="text-muted font-normal">(선택)</span>
            </p>
            <ImageUpload
              images={refImages}
              onAdd={(f) => addFiles(setRefImages, f)}
              onRemove={(id) => setRefImages((p) => p.filter((i) => i.id !== id))}
              maxImages={5}
            />
          </div>

          {/* Memo */}
          <div>
            <p className="font-sans text-sm font-medium text-charcoal mb-2">
              상세 요청 메모 <span className="text-muted font-normal">(선택)</span>
            </p>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="원하는 스타일, 모발 상태, 주의사항 등을 자유롭게 알려주세요"
              rows={3}
              className="w-full rounded-card border border-border bg-cream font-sans text-sm text-charcoal placeholder:text-muted px-3 py-2.5 resize-none focus:outline-none focus:border-border-interactive transition-colors"
            />
          </div>

          {/* Consent */}
          <div className="border-t border-border pt-5 flex flex-col gap-4">
            <p className="font-sans text-sm font-medium text-charcoal">동의 조건</p>
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

        {error && <p className="mt-4 font-sans text-xs text-red-500">{error}</p>}

        <Button variant="primary" size="lg" className="w-full mt-8" disabled={submitting}>
          {submitting ? "신청 중…" : "매칭 신청하기"}
        </Button>
      </form>
    </PageLayout>
  );
}
