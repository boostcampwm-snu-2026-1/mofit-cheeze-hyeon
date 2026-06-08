import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  PageLayout,
  Input,
  Badge,
  Card,
  Avatar,
  BottomNav,
  Caption,
  TagSelector,
  Switch,
  Button,
} from "@ui";
import { MOCK_DESIGNERS } from "../lib/mockData";

const CATEGORIES = ["전체", "커트", "펌", "염색", "탈색", "스타일링", "두피케어"] as const;
type Category = (typeof CATEGORIES)[number];

const REGIONS = [
  "서울 강남", "서울 강북", "서울 마포·홍대", "서울 강동", "서울 강서",
  "경기", "인천", "부산", "대구", "대전", "광주", "제주",
];
const PRICE_OPTIONS = [
  { id: "all", label: "전체" },
  { id: "free", label: "무료" },
  { id: "low", label: "3만원 이하" },
  { id: "mid", label: "3~10만원" },
  { id: "high", label: "10만원 이상" },
];

interface Filters {
  regions: string[];
  specialties: string[];
  contentUsage: boolean;
  faceExposure: boolean;
  price: string;
}

const DEFAULT_FILTERS: Filters = {
  regions: [],
  specialties: [],
  contentUsage: false,
  faceExposure: false,
  price: "all",
};

function countActiveFilters(f: Filters) {
  return (
    f.regions.length +
    f.specialties.length +
    (f.contentUsage ? 1 : 0) +
    (f.faceExposure ? 1 : 0) +
    (f.price !== "all" ? 1 : 0)
  );
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
      if (query && !d.name.includes(query) && !d.specialty.includes(query)) return false;
      if (category !== "전체" && !d.specialties.some((s) => s.includes(category))) return false;
      if (filters.regions.length && !filters.regions.some((r) => d.region.includes(r.replace("서울 ", "")))) return false;
      if (filters.specialties.length && !filters.specialties.some((s) => d.specialties.includes(s))) return false;
      if (filters.contentUsage && !d.allowContentUsage) return false;
      if (filters.faceExposure && !d.allowFaceExposure) return false;
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
      className="p-0 py-0"
      header={
        <div className="px-5 py-4">
          <p className="font-sans font-semibold text-base text-charcoal">탐색</p>
        </div>
      }
      footer={<BottomNav />}
    >
      <div className="max-w-[430px] mx-auto px-5 pt-4 pb-6">
        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <Input
              placeholder="디자이너 이름, 시술 분야 검색"
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
          <div className="mb-4 rounded-container border border-border bg-cream p-4 flex flex-col gap-5">
            <div>
              <p className="font-sans text-sm font-medium text-charcoal mb-2">지역</p>
              <TagSelector
                options={REGIONS}
                value={pendingFilters.regions}
                onChange={(v) => setPendingFilters((f) => ({ ...f, regions: v }))}
              />
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
          디자이너 {filtered.length}명
        </p>

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((designer) => (
            <Link key={designer.id} to={`/designers/${designer.id}`}>
              <Card radius="card" className="hover:border-border-interactive transition-colors">
                <div className="p-4">
                  <Avatar name={designer.name} size="lg" className="mb-3" />
                  <p className="font-sans font-semibold text-sm text-charcoal leading-tight">
                    {designer.name}
                  </p>
                  <p className="font-sans text-xs text-muted mt-0.5 leading-snug">
                    {designer.specialty}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <Caption>{designer.region}</Caption>
                    <Caption>★ {designer.rating}</Caption>
                  </div>
                  {(designer.allowContentUsage || designer.allowFaceExposure) && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {designer.allowContentUsage && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">콘텐츠</Badge>
                      )}
                      {designer.allowFaceExposure && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">얼굴 공개</Badge>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Caption className="text-muted">조건에 맞는 디자이너가 없어요</Caption>
            <button
              type="button"
              onClick={() => { setFilters(DEFAULT_FILTERS); setQuery(""); setCategory("전체"); }}
              className="mt-3 font-sans text-sm text-charcoal underline underline-offset-2"
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
