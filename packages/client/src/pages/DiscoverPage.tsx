import { useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout, Input, Badge, Card, Avatar, BottomNav, Caption } from "@ui";

const CATEGORIES = ["전체", "커트", "펌", "염색", "탈색", "스타일링"] as const;
type Category = (typeof CATEGORIES)[number];

const DESIGNERS = [
  { id: "1", name: "김소연", specialty: "내추럴 커트", location: "서울 강남", matchCount: 24, tags: ["커트", "스타일링"] },
  { id: "2", name: "이미래", specialty: "웨이브 · 볼륨 펌", location: "부산 해운대", matchCount: 18, tags: ["펌"] },
  { id: "3", name: "박지현", specialty: "염색 · 탈색", location: "서울 홍대", matchCount: 31, tags: ["염색", "탈색"] },
  { id: "4", name: "최다은", specialty: "데일리 스타일링", location: "인천 송도", matchCount: 12, tags: ["스타일링"] },
  { id: "5", name: "정하늘", specialty: "롱헤어 펌", location: "서울 성수", matchCount: 27, tags: ["펌"] },
  { id: "6", name: "한서윤", specialty: "톤다운 염색", location: "대구 중구", matchCount: 9, tags: ["염색"] },
];

export function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("전체");

  const filtered = DESIGNERS.filter((d) => {
    const matchesQuery =
      !query || d.name.includes(query) || d.specialty.includes(query);
    const matchesCategory =
      category === "전체" || d.tags.includes(category as never);
    return matchesQuery && matchesCategory;
  });

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
        <Input
          placeholder="디자이너 이름, 시술 분야 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-4"
        />

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

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((designer) => (
            <Link key={designer.id} to={`/designers/${designer.id}`}>
              <Card radius="card" className="hover:border-border-interactive transition-colors">
                <div className="p-4">
                  <Avatar name={designer.name} size="lg" className="mb-3" />
                  <p className="font-sans font-semibold text-sm text-charcoal leading-tight">
                    {designer.name}
                  </p>
                  <p className="font-sans text-xs text-muted mt-0.5">{designer.specialty}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Caption>{designer.location}</Caption>
                    <Caption>{designer.matchCount}회 매칭</Caption>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Caption>검색 결과가 없어요</Caption>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
