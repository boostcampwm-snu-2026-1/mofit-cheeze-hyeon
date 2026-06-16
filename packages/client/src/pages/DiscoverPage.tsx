import { useState, useMemo } from "react";
import { VtLink } from "@ui";
import {
  PageLayout,
  PageHeader,
  Input,
  Badge,
  Card,
  Avatar,
  BottomNav,
  Caption,
  TagSelector,
  Switch,
  Button,
  EmptyState,
} from "@ui";
import { MOCK_DESIGNERS } from "../lib/mockData";
import { formatSlotCompact } from "../lib/date";

const CATEGORIES = ["전체", "커트", "펌", "염색", "탈색", "스타일링", "두피케어"] as const;
type Category = (typeof CATEGORIES)[number];

const REGIONS = ["서울", "경기", "인천", "부산", "대구", "대전", "광주", "제주"];
const PRICE_OPTIONS = [
  { id: "all", label: "전체" },
  { id: "free", label: "무료" },
  { id: "low", label: "3만원 이하" },
  { id: "mid", label: "3~10만원" },
  { id: "high", label: "10만원 이상" },
];

const ALL_DATE_SLOTS = Array.from(
  new Set(MOCK_DESIGNERS.flatMap((d) => d.availableSlots))
).sort();

interface Filters {
  regions: string[];
  specialties: string[];
  contentUsage: boolean;
  faceExposure: boolean;
  price: string;
  dateSlot: string;
}

const DEFAULT_FILTERS: Filters = {
  regions: [],
  specialties: [],
  contentUsage: false,
  faceExposure: false,
  price: "all",
  dateSlot: "all",
};

function countActiveFilters(f: Filters) {
  return (
    f.regions.length +
    f.specialties.length +
    (f.contentUsage ? 1 : 0) +
    (f.faceExposure ? 1 : 0) +
    (f.price !== "all" ? 1 : 0) +
    (f.dateSlot !== "all" ? 1 : 0)
  );
}

function matchesPrice(price: number, option: string) {
  switch (option) {
    case "free":
      return price === 0;
    case "low":
      return price > 0 && price <= 30000;
    case "mid":
      return price > 30000 && price <= 100000;
    case "high":
      return price > 100000;
    default:
      return true;
  }
}

export function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("전체");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [pendingFilters, setPendingFilters] = useState<Filters>(DEFAULT_FILTERS);

  const activeCount = countActiveFilters(filters);

  const filtered = useMemo(() => {
    return MOCK_DESIGNERS.filter((d) => {
      if (
        query &&
        !d.name.includes(query) &&
        !d.specialty.includes(query) &&
        !d.recruitStyle.includes(query) &&
        !d.specialties.some((s) => s.includes(query))
      )
        return false;
      if (category !== "전체" && !d.specialties.some((s) => s.includes(category))) return false;
      if (filters.regions.length && !filters.regions.some((r) => d.region.includes(r))) return false;
      if (filters.specialties.length && !filters.specialties.some((s) => d.specialties.includes(s))) return false;
      if (filters.contentUsage && !d.allowContentUsage) return false;
      if (filters.faceExposure && !d.allowFaceExposure) return false;
      if (filters.price !== "all" && !matchesPrice(d.proposedPrice, filters.price)) return false;
      if (filters.dateSlot !== "all" && !d.availableSlots.includes(filters.dateSlot)) return false;
      return true;
    });
  }, [query, category, filters]);

  function applyFilters() {
    setFilters(pendingFilters);
    setShowFilter(false);
  }

  function resetFilters() {
    setPendingFilters(DEFAULT_FILTERS);
  }

  return (
    <PageLayout
      fullWidth
      className="p-0 pb-8"
      header={<PageHeader title="탐색" />}
      footer={<BottomNav />}
    >
      <div className="max-w-[430px] mx-auto px-5 pt-4">
        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <Input
              placeholder="시술 스타일, 디자이너 이름 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setPendingFilters(filters);
              setShowFilter((v) => !v);
            }}
            className={[
              "flex-shrink-0 h-11 px-3 rounded-card border font-sans text-sm transition-colors flex items-center gap-1.5",
              showFilter || activeCount > 0
                ? "border-charcoal bg-charcoal text-offwhite"
                : "border-border text-muted hover:border-border-interactive hover:text-charcoal",
            ].join(" ")}
          >
            <span>필터</span>
            {activeCount > 0 && (
              <span className="w-4 h-4 rounded-pill bg-offwhite text-charcoal text-xs flex items-center justify-center leading-none">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilter && (
          <div className="mb-4 rounded-container border border-border bg-offwhite p-4 flex flex-col gap-5">
            <div>
              <p className="font-sans text-sm font-medium text-charcoal mb-2">지역</p>
              <TagSelector
                options={REGIONS}
                value={pendingFilters.regions}
                onChange={(v) => setPendingFilters((f) => ({ ...f, regions: v }))}
              />
            </div>

            <div>
              <p className="font-sans text-sm font-medium text-charcoal mb-2">가능한 날짜</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setPendingFilters((f) => ({ ...f, dateSlot: "all" }))}
                  className={[
                    "px-3 py-1.5 rounded-pill border font-sans text-sm transition-colors",
                    pendingFilters.dateSlot === "all"
                      ? "border-charcoal bg-charcoal text-offwhite"
                      : "border-border text-muted hover:border-border-interactive hover:text-charcoal",
                  ].join(" ")}
                >
                  전체
                </button>
                {ALL_DATE_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setPendingFilters((f) => ({ ...f, dateSlot: slot }))}
                    className={[
                      "px-3 py-1.5 rounded-pill border font-sans text-sm transition-colors",
                      pendingFilters.dateSlot === slot
                        ? "border-charcoal bg-charcoal text-offwhite"
                        : "border-border text-muted hover:border-border-interactive hover:text-charcoal",
                    ].join(" ")}
                  >
                    {formatSlotCompact(slot)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-sans text-sm font-medium text-charcoal mb-2">전문 분야</p>
              <TagSelector
                options={["커트", "펌", "염색", "탈색", "매직", "볼륨매직", "두피케어", "스타일링"]}
                value={pendingFilters.specialties}
                onChange={(v) => setPendingFilters((f) => ({ ...f, specialties: v }))}
              />
            </div>

            <div>
              <p className="font-sans text-sm font-medium text-charcoal mb-2">제안 비용</p>
              <div className="flex gap-2 flex-wrap">
                {PRICE_OPTIONS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPendingFilters((f) => ({ ...f, price: p.id }))}
                    className={[
                      "px-3 py-1.5 rounded-pill border font-sans text-sm transition-colors",
                      pendingFilters.price === p.id
                        ? "border-charcoal bg-charcoal text-offwhite"
                        : "border-border text-muted hover:border-border-interactive hover:text-charcoal",
                    ].join(" ")}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-border pt-4">
              <Switch
                checked={pendingFilters.contentUsage}
                onChange={(v) => setPendingFilters((f) => ({ ...f, contentUsage: v }))}
                label="콘텐츠 활용 동의"
                description="SNS·포트폴리오 활용 가능한 디자이너만"
              />
              <Switch
                checked={pendingFilters.faceExposure}
                onChange={(v) => setPendingFilters((f) => ({ ...f, faceExposure: v }))}
                label="얼굴 공개 동의"
                description="얼굴 노출 가능한 디자이너만"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="ghost" size="sm" className="flex-1" onClick={resetFilters}>
                초기화
              </Button>
              <Button variant="primary" size="sm" className="flex-1" onClick={applyFilters}>
                적용하기
              </Button>
            </div>
          </div>
        )}

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="flex-shrink-0"
            >
              <Badge
                variant={category === c ? "default" : "muted"}
                className={category === c ? "" : "cursor-pointer hover:opacity-70 transition-opacity"}
              >
                {c}
              </Badge>
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="font-sans text-xs text-muted mb-3">
          공고 {filtered.length}건
        </p>

        <div className="flex flex-col gap-3">
          {filtered.map((d) => (
            <VtLink key={d.id} to={`/designers/${d.id}`}>
              <Card radius="card" className="hover:border-border-interactive transition-colors">
                <div className="p-4">
                  {/* Recruit headline */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="font-sans font-semibold text-base text-charcoal leading-snug">
                      {d.recruitStyle}
                    </p>
                    <Badge
                      variant={d.proposedPrice === 0 ? "muted" : "default"}
                      className="flex-shrink-0"
                    >
                      {d.proposedPrice === 0 ? "무료 협업" : `${d.proposedPrice.toLocaleString()}원`}
                    </Badge>
                  </div>

                  {/* Available dates */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-3">
                    {d.availableSlots.slice(0, 3).map((slot) => (
                      <Badge key={slot} variant="outline" className="text-[11px] px-2 py-0.5">
                        {formatSlotCompact(slot)}
                      </Badge>
                    ))}
                    {d.availableSlots.length > 3 && (
                      <Caption>+{d.availableSlots.length - 3}</Caption>
                    )}
                  </div>

                  {/* Designer info */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar name={d.name} size="sm" />
                      <p className="font-sans text-sm text-charcoal truncate">
                        {d.name}
                        <span className="text-muted"> · {d.region}</span>
                      </p>
                    </div>
                    <Caption className="flex-shrink-0">★ {d.rating}</Caption>
                  </div>

                  {(d.allowContentUsage || d.allowFaceExposure) && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {d.allowContentUsage && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">콘텐츠 활용</Badge>
                      )}
                      {d.allowFaceExposure && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">얼굴 공개</Badge>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </VtLink>
          ))}
        </div>

        {filtered.length === 0 && (
          <EmptyState
            title="조건에 맞는 공고가 없어요"
            description="검색어나 필터 조건을 변경해 다시 시도해보세요"
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setFilters(DEFAULT_FILTERS); setQuery(""); setCategory("전체"); }}
              >
                필터 초기화
              </Button>
            }
          />
        )}
      </div>
    </PageLayout>
  );
}
