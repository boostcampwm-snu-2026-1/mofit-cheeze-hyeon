import { useState } from "react";
import { useParams } from "react-router-dom";
import { useVtNavigate } from "@ui";
import { PageLayout, PageHeader, Button, Input, Badge, Body, Caption } from "@ui";
import { usePostingStore } from "../store/postingStore";
import { formatSlotParts, formatSlotCompact } from "../lib/date";

const PRICE_PRESETS = [
  { id: "free", label: "무료 협업", value: 0 },
  { id: "30000", label: "3만원", value: 30000 },
  { id: "50000", label: "5만원", value: 50000 },
  { id: "100000", label: "10만원", value: 100000 },
  { id: "custom", label: "직접 입력", value: -1 },
];

function getInitialPriceId(price: number) {
  return PRICE_PRESETS.find((p) => p.value === price)?.id ?? "custom";
}

function generateUpcomingDates(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split("T")[0];
  });
}

export function PostingEditPage() {
  const navigate = useVtNavigate();
  const { id } = useParams<{ id: string }>();
  const { postings, addPosting, updatePosting } = usePostingStore();

  const isEdit = !!id;
  const existing = isEdit ? postings.find((p) => p.id === id) : undefined;

  const [recruitStyle, setRecruitStyle] = useState(existing?.recruitStyle ?? "");
  const [priceId, setPriceId] = useState(() =>
    existing ? getInitialPriceId(existing.proposedPrice) : "free"
  );
  const [customPrice, setCustomPrice] = useState(() =>
    existing && !PRICE_PRESETS.some((p) => p.value === existing.proposedPrice && p.id !== "custom")
      ? existing.proposedPrice.toString()
      : ""
  );
  const [selectedSlots, setSelectedSlots] = useState<string[]>(existing?.availableSlots ?? []);

  const upcomingDates = generateUpcomingDates(21);

  function toggleSlot(slot: string) {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const preset = PRICE_PRESETS.find((p) => p.id === priceId);
    const price =
      priceId === "custom" ? parseInt(customPrice.replace(/[^0-9]/g, "")) || 0 : preset!.value;

    if (isEdit && id) {
      updatePosting(id, { recruitStyle, proposedPrice: price, availableSlots: selectedSlots });
    } else {
      addPosting({ recruitStyle, proposedPrice: price, availableSlots: selectedSlots });
    }
    navigate("/my-postings");
  }

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={
        <PageHeader
          title={isEdit ? "공고 수정" : "새 공고 올리기"}
          onBack={() => navigate(-1)}
        />
      }
    >
      <form
        onSubmit={handleSave}
        className="w-full max-w-[430px] mx-auto px-5 py-6 flex flex-col gap-7"
      >
        <Input
          label="시술 스타일"
          placeholder="예: 레이어드 커트 + 스타일링"
          value={recruitStyle}
          onChange={(e) => setRecruitStyle(e.target.value)}
        />

        <div>
          <p className="font-sans text-sm font-medium text-charcoal mb-3">제안 비용</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {PRICE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPriceId(p.id)}
                className={[
                  "py-2.5 rounded-card border font-sans text-sm transition-colors",
                  priceId === p.id
                    ? "border-charcoal bg-charcoal text-offwhite"
                    : "border-border text-muted hover:border-border-interactive hover:text-charcoal",
                ].join(" ")}
              >
                {p.label}
              </button>
            ))}
          </div>
          {priceId === "custom" && (
            <Input
              placeholder="금액 입력 (원)"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value.replace(/[^0-9]/g, ""))}
            />
          )}
        </div>

        <div>
          <p className="font-sans text-sm font-medium text-charcoal mb-1">모집 가능 날짜</p>
          <Body className="text-muted mb-3">모델이 선택할 수 있는 날짜를 골라주세요</Body>

          {selectedSlots.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedSlots.sort().map((s) => (
                <Badge key={s} variant="default">
                  {formatSlotCompact(s)}
                </Badge>
              ))}
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            {upcomingDates.map((slot) => {
              const { month, day, weekday } = formatSlotParts(slot);
              const sel = selectedSlots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggleSlot(slot)}
                  className={[
                    "flex flex-col items-center justify-center gap-0.5 rounded-card border py-3 transition-colors",
                    sel
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

          {selectedSlots.length === 0 && (
            <Caption className="mt-2 text-muted">날짜를 1개 이상 선택해주세요</Caption>
          )}
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!recruitStyle.trim() || selectedSlots.length === 0}
        >
          {isEdit ? "저장" : "공고 올리기"}
        </Button>
      </form>
    </PageLayout>
  );
}
