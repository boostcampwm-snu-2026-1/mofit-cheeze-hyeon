import { useState } from "react";
import { Link } from "react-router-dom";

const SECTIONS = [
  "Colors",
  "Typography",
  "Gradients",
  "Components",
  "Elevation",
  "Spacing",
  "Motion",
  "Principles",
] as const;

type Section = (typeof SECTIONS)[number];

// ── Data ─────────────────────────────────────────────────────────────────────

const colorGroups = [
  {
    label: "Brand",
    items: [
      { name: "Soft Blue", role: "Primary", hex: "#4D8DFF", usage: "주요 CTA, 예약하기, 매칭 신청, 링크, 활성 상태", dark: false },
      { name: "—", role: "Primary Hover", hex: "#3B7EF5", usage: "Primary 버튼·요소 호버 상태", dark: false },
      { name: "Soft Blue Light", role: "Primary Light", hex: "#8AB8FF", usage: "배경 요소, 그라데이션, Hero 영역", dark: false },
      { name: "Soft Coral", role: "Accent", hex: "#FF8E7E", usage: "추천 태그, 신규 배지, 이벤트, 하이라이트", dark: false },
    ],
  },
  {
    label: "Foundation",
    items: [
      { name: "Soft Blue Gray", role: "Background", hex: "#F3F8FF", usage: "전체 앱 배경", dark: true },
      { name: "White", role: "Surface", hex: "#F8F9FA", usage: "카드, 모달, 입력창", dark: true, bordered: true },
      { name: "—", role: "Border", hex: "#E4EDF9", usage: "구분선, 카드·입력창 테두리", dark: true },
    ],
  },
  {
    label: "Text",
    items: [
      { name: "—", role: "Text Primary", hex: "#172033", usage: "주요 본문 텍스트", dark: false },
      { name: "—", role: "Text Secondary", hex: "#6B7280", usage: "보조·설명 텍스트", dark: false },
    ],
  },
  {
    label: "Status",
    items: [
      { name: "—", role: "Success", hex: "#22C55E", usage: "성공 상태", dark: false },
      { name: "—", role: "Warning", hex: "#F59E0B", usage: "경고 상태", dark: false },
      { name: "—", role: "Error", hex: "#EF4444", usage: "오류 상태", dark: false },
    ],
  },
];

const typeScale = [
  { role: "Hero", size: "36px", weight: "700" },
  { role: "H1", size: "28px", weight: "700" },
  { role: "H2", size: "24px", weight: "700" },
  { role: "H3", size: "20px", weight: "600" },
  { role: "Body Large", size: "18px", weight: "500" },
  { role: "Body", size: "16px", weight: "400" },
  { role: "Caption", size: "14px", weight: "400" },
  { role: "Small", size: "12px", weight: "400" },
];

const gradients = [
  {
    name: "Primary",
    css: "linear-gradient(135deg, #4D8DFF, #8AB8FF)",
    usage: "Hero, CTA, 강조 카드",
    from: "#4D8DFF",
    to: "#8AB8FF",
  },
  {
    name: "Light",
    css: "linear-gradient(135deg, #F8F9FA, #EAF3FF)",
    usage: "배경, 카드",
    from: "#F8F9FA",
    to: "#EAF3FF",
    bordered: true,
  },
  {
    name: "Accent",
    css: "linear-gradient(135deg, #4D8DFF, #FFB7A8)",
    usage: "이벤트, 프로모션",
    from: "#4D8DFF",
    to: "#FFB7A8",
  },
];

const elevationLevels = [
  { level: "Level 0", usage: "배경", shadow: null },
  { level: "Level 1", usage: "Card", shadow: "0 8px 24px rgba(77,141,255,0.08)" },
  { level: "Level 2", usage: "Hover", shadow: "0 16px 40px rgba(77,141,255,0.12)" },
  { level: "Level 3", usage: "Modal", shadow: "0 24px 64px rgba(77,141,255,0.18)" },
];

const spacingItems = [
  { px: 8, usage: "기본 단위 (Base Unit)" },
  { px: 16, usage: "Card Gap" },
  { px: 20, usage: "Safe Area padding" },
  { px: 24, usage: "중간 간격" },
  { px: 32, usage: "대형 간격" },
  { px: 40, usage: "Section Gap" },
  { px: 64, usage: "히어로 여백" },
  { px: 96, usage: "최대 여백" },
];

const motionTokens = [
  { speed: "Fast", duration: "150ms", usage: "즉각 반응이 필요한 전환" },
  { speed: "Normal", duration: "250ms", usage: "일반적인 상태 변화" },
  { speed: "Slow", duration: "350ms", usage: "페이지·모달 진입" },
];

const designPrinciples = [
  { name: "Portfolio First", desc: "사용자는 디자이너보다 결과물을 먼저 본다." },
  { name: "Trust Through Transparency", desc: "포트폴리오, 리뷰, 비용, 조건을 투명하게 노출한다." },
  { name: "Airy Professionalism", desc: "가볍고 세련되지만 전문성을 잃지 않는다." },
  { name: "Mobile Native", desc: "모든 경험은 모바일 중심으로 설계한다." },
];

const dosAndDonts = [
  { do: "공기감 있는 블루 톤 사용", dont: "핑크 위주의 UI" },
  { do: "부드러운 그라데이션 활용", dont: "과도한 색상 사용" },
  { do: "큰 곡선 오브젝트 활용", dont: "강한 그림자" },
  { do: "포트폴리오 이미지 우선 노출", dont: "복잡한 정보 밀집" },
  { do: "충분한 여백 확보", dont: "쇼핑몰 스타일 배너" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionBlock({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="py-14 border-b border-border last:border-b-0">
      <div className="mb-8">
        <h2 className="font-sans font-semibold text-2xl text-charcoal mb-2">{title}</h2>
        <p className="font-sans text-sm text-muted leading-normal">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-sans text-[11px] text-muted">{label}</span>
      <code className="font-mono text-xs text-charcoal bg-cream px-2 py-1 rounded-[6px] border border-border whitespace-nowrap">
        {value}
      </code>
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[11px] font-semibold text-muted mb-3 uppercase tracking-wider">
      {children}
    </p>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState<Section>("Colors");

  const scrollTo = (section: Section) => {
    setActiveSection(section);
    document.getElementById(section.toLowerCase())?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex min-h-screen bg-cream font-sans">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-52 border-r border-border bg-cream flex flex-col z-10">
        <div className="px-5 py-6 border-b border-border">
          <p className="font-sans font-semibold text-sm text-charcoal">Design System</p>
          <p className="font-sans text-xs text-muted mt-0.5">MOFIT</p>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className={[
                "w-full text-left px-3 py-2 rounded-[6px] font-sans text-sm transition-colors",
                activeSection === s
                  ? "bg-surface-hover text-primary font-semibold"
                  : "text-muted hover:text-charcoal hover:bg-surface-subtle",
              ].join(" ")}
            >
              {s}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-border">
          <Link
            to="/components"
            className="font-sans text-xs text-muted hover:text-charcoal transition-colors"
          >
            → Components
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="ml-52 flex-1 px-12 max-w-4xl">
        {/* Header */}
        <div className="py-16 border-b border-border">
          <h1 className="font-sans font-semibold text-[2rem] text-charcoal mb-3">MOFIT Design System</h1>
          <p className="font-sans text-base text-muted leading-relaxed max-w-lg">
            헤어 포트폴리오 기반 스타일 매칭 플랫폼. Airbnb · Apple · Pinterest의 감성에서 영감을 받은 Airy & Premium 디자인 시스템.
          </p>
          <div className="flex flex-wrap gap-5 mt-6">
            <span className="font-sans text-xs text-muted">
              Primary — <code className="font-mono text-primary">#4D8DFF</code>
            </span>
            <span className="font-sans text-xs text-muted">
              Accent — <code className="font-mono text-accent">#FF8E7E</code>
            </span>
            <span className="font-sans text-xs text-muted">
              Background — <code className="font-mono text-charcoal">#F3F8FF</code>
            </span>
            <span className="font-sans text-xs text-muted">
              Font — <code className="font-mono text-charcoal">Pretendard</code>
            </span>
          </div>
        </div>

        {/* ── Colors ─────────────────────────────────────────────────────── */}
        <SectionBlock
          id="colors"
          title="Colors"
          description="Soft Blue를 중심으로 한 에어리하고 신뢰감 있는 컬러 시스템. Elevation shadow도 블루 기반으로 일관된다."
        >
          <div className="flex flex-col gap-8">
            {colorGroups.map((group) => (
              <div key={group.label}>
                <GroupLabel>{group.label}</GroupLabel>
                <div className="grid grid-cols-4 gap-3">
                  {group.items.map((color) => (
                    <div key={`${group.label}-${color.hex}`} className="flex flex-col gap-2">
                      <div
                        className="h-14 rounded-card flex items-end p-2.5"
                        style={{
                          backgroundColor: color.hex,
                          border: color.bordered ? "1px solid #E4EDF9" : undefined,
                        }}
                      >
                        <code
                          className="font-mono text-[10px] font-semibold"
                          style={{ color: color.dark ? "#172033" : "#F8F9FA" }}
                        >
                          {color.hex}
                        </code>
                      </div>
                      <div>
                        <p className="font-sans text-xs font-semibold text-charcoal">{color.role}</p>
                        {color.name !== "—" && (
                          <p className="font-sans text-[10px] text-primary">{color.name}</p>
                        )}
                        <p className="font-sans text-[10px] text-muted mt-0.5 leading-snug">{color.usage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>

        {/* ── Typography ──────────────────────────────────────────────────── */}
        <SectionBlock
          id="typography"
          title="Typography"
          description="Pretendard / fallback: system-ui, sans-serif. 계층은 크기와 굵기로만 구분한다."
        >
          <div className="divide-y divide-border">
            {typeScale.map((row) => (
              <div key={row.role} className="py-4 flex items-baseline gap-6 flex-wrap">
                <div
                  className="font-sans text-charcoal flex-1 min-w-[200px]"
                  style={{ fontSize: row.size, fontWeight: row.weight }}
                >
                  모핏 헤어 스타일링
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <Chip label="Role" value={row.role} />
                  <Chip label="Size" value={row.size} />
                  <Chip label="Weight" value={row.weight} />
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>

        {/* ── Gradients ───────────────────────────────────────────────────── */}
        <SectionBlock
          id="gradients"
          title="Gradients"
          description="모핏의 브랜드 경험은 Soft Blue Gradient를 통해 표현한다. 방향은 135deg 고정."
        >
          <div className="grid grid-cols-3 gap-5 mb-6">
            {gradients.map((g) => (
              <div key={g.name} className="flex flex-col gap-3">
                <div
                  className="h-24 rounded-container"
                  style={{
                    background: g.css,
                    border: g.bordered ? "1px solid #E4EDF9" : undefined,
                  }}
                />
                <div>
                  <p className="font-sans text-sm font-semibold text-charcoal mb-1">{g.name}</p>
                  <p className="font-sans text-[11px] text-muted mb-2">{g.usage}</p>
                  <div className="flex gap-2">
                    <Chip label="From" value={g.from} />
                    <Chip label="To" value={g.to} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Atmosphere preview */}
          <div className="border border-border rounded-card p-4 bg-offwhite">
            <p className="font-sans text-xs font-semibold text-charcoal mb-3">
              Floating Shapes + Glass Layers 조합
            </p>
            <div
              className="relative h-32 rounded-compact overflow-hidden"
              style={{ background: "linear-gradient(135deg, #4D8DFF, #8AB8FF)" }}
            >
              <div
                className="absolute -top-8 -right-8 w-36 h-36 rounded-full blur-2xl opacity-40"
                style={{ background: "#F8F9FA" }}
              />
              <div
                className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full blur-xl opacity-30"
                style={{ background: "#8AB8FF" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="px-4 py-2 rounded-card font-sans text-sm font-semibold text-offwhite"
                  style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
                >
                  스타일 매칭 시작하기
                </div>
              </div>
            </div>
          </div>
        </SectionBlock>

        {/* ── Components ──────────────────────────────────────────────────── */}
        <SectionBlock
          id="components"
          title="Components"
          description="Primary는 Soft Blue(#4D8DFF). Card는 20px radius + Level 1 shadow. Tag는 Soft Coral 기반."
        >
          <div className="flex flex-col gap-10">
            {/* Buttons & Tag */}
            <div>
              <GroupLabel>Buttons & Tag</GroupLabel>
              <div className="flex flex-wrap gap-3 items-center mb-5">
                <button
                  className="inline-flex items-center justify-center px-5 py-2.5 font-sans text-sm font-semibold text-offwhite rounded-card transition-colors"
                  style={{ backgroundColor: "#4D8DFF" }}
                >
                  예약하기
                </button>
                <button className="inline-flex items-center justify-center px-5 py-2.5 font-sans text-sm text-charcoal rounded-card border border-border bg-offwhite transition-colors">
                  Secondary
                </button>
                <span
                  className="inline-flex items-center px-3 py-1 font-sans text-sm rounded-pill"
                  style={{ backgroundColor: "#FFF3F0", color: "#FF8E7E" }}
                >
                  추천
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3 max-w-xl">
                <Chip label="Primary bg" value="#4D8DFF" />
                <Chip label="Primary text" value="#F8F9FA" />
                <Chip label="Primary radius" value="14px" />
                <Chip label="Tag bg" value="#FFF3F0" />
                <Chip label="Secondary bg" value="#F8F9FA" />
                <Chip label="Secondary border" value="1px solid #E4EDF9" />
                <Chip label="Tag text" value="#FF8E7E" />
                <Chip label="Tag radius" value="999px" />
              </div>
            </div>

            {/* Card */}
            <div>
              <GroupLabel>Card</GroupLabel>
              <div
                className="max-w-xs p-5 rounded-container border border-border bg-offwhite mb-5"
                style={{ boxShadow: "0 8px 24px rgba(77,141,255,0.08)" }}
              >
                <p className="font-sans font-semibold text-base text-charcoal mb-1">레이어드 커트</p>
                <p className="font-sans text-sm text-muted mb-3">김지수 디자이너 · 강남구</p>
                <div className="flex items-center justify-between">
                  <span
                    className="font-sans text-xs px-2.5 py-1 rounded-pill"
                    style={{ backgroundColor: "#FFF3F0", color: "#FF8E7E" }}
                  >
                    추천
                  </span>
                  <span className="font-sans text-sm font-semibold text-primary">₩0 (모델)</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 max-w-xl">
                <Chip label="bg" value="#F8F9FA" />
                <Chip label="border" value="1px solid #E4EDF9" />
                <Chip label="radius" value="20px" />
                <Chip label="shadow" value="Level 1" />
              </div>
            </div>
          </div>
        </SectionBlock>

        {/* ── Elevation ───────────────────────────────────────────────────── */}
        <SectionBlock
          id="elevation"
          title="Elevation"
          description="Shadow 베이스 컬러가 rgba(77,141,255)로 블루 계열. 레벨이 높아질수록 offset과 opacity가 증가한다."
        >
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {elevationLevels.map((lv) => (
              <div key={lv.level} className="flex flex-col gap-3">
                <div
                  className="h-24 rounded-container border border-border bg-offwhite flex items-center justify-center"
                  style={{ boxShadow: lv.shadow ?? undefined }}
                >
                  <span className="font-sans text-xs font-semibold text-charcoal">{lv.level}</span>
                </div>
                <div>
                  <p className="font-sans text-xs font-semibold text-charcoal">{lv.usage}</p>
                  <p className="font-mono text-[10px] text-muted mt-1 leading-relaxed break-all">
                    {lv.shadow ?? "shadow: none"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>

        {/* ── Spacing ─────────────────────────────────────────────────────── */}
        <SectionBlock
          id="spacing"
          title="Spacing"
          description="Base unit 8px. Container max-width 768px · Safe Area 20px · Card Gap 16px · Section Gap 40px."
        >
          <div className="flex flex-col gap-3">
            {spacingItems.map(({ px, usage }) => (
              <div key={px} className="flex items-center gap-5">
                <span className="font-mono text-xs text-muted w-10 text-right flex-shrink-0">{px}px</span>
                <div
                  className="flex-shrink-0 rounded-micro"
                  style={{
                    width: `${Math.min(px * 4.5, 480)}px`,
                    height: "10px",
                    backgroundColor: "#4D8DFF",
                    opacity: 0.15 + (px / 96) * 0.65,
                  }}
                />
                <span className="font-sans text-xs text-muted">{usage}</span>
              </div>
            ))}
          </div>
        </SectionBlock>

        {/* ── Motion ──────────────────────────────────────────────────────── */}
        <SectionBlock
          id="motion"
          title="Motion"
          description="Smooth · Premium · Natural 스타일을 따른다. 움직임은 항상 목적이 있어야 한다."
        >
          <div className="grid grid-cols-3 gap-4 mb-8">
            {motionTokens.map((m) => (
              <div key={m.speed} className="border border-border rounded-card p-4 bg-offwhite">
                <p className="font-sans font-semibold text-sm text-charcoal mb-1">{m.speed}</p>
                <code className="font-mono text-xl text-primary">{m.duration}</code>
                <p className="font-sans text-[11px] text-muted mt-2 leading-normal">{m.usage}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {["Smooth", "Premium", "Natural"].map((s) => (
              <span
                key={s}
                className="font-sans text-xs px-3 py-1.5 rounded-pill border border-border text-charcoal"
              >
                {s}
              </span>
            ))}
          </div>
        </SectionBlock>

        {/* ── Principles ──────────────────────────────────────────────────── */}
        <SectionBlock
          id="principles"
          title="Principles"
          description="모핏 디자인의 4가지 핵심 원칙. Airbnb · Apple · Pinterest의 미니멀한 감성을 참고한다."
        >
          <div className="grid grid-cols-1 gap-4 mb-10 sm:grid-cols-2">
            {designPrinciples.map((p) => (
              <div key={p.name} className="border border-border rounded-card p-4 bg-offwhite">
                <p className="font-sans font-semibold text-sm text-primary mb-1.5">{p.name}</p>
                <p className="font-sans text-sm text-muted leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <GroupLabel>Do's & Don'ts</GroupLabel>
          <div className="border border-border rounded-card overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-border">
              <div className="bg-offwhite p-5">
                <p className="font-sans text-xs font-semibold text-success mb-3">✓ Do</p>
                <ul className="flex flex-col gap-2.5">
                  {dosAndDonts.map((item) => (
                    <li key={item.do} className="font-sans text-sm text-charcoal">{item.do}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-offwhite p-5">
                <p className="font-sans text-xs font-semibold text-error mb-3">✕ Don't</p>
                <ul className="flex flex-col gap-2.5">
                  {dosAndDonts.map((item) => (
                    <li key={item.dont} className="font-sans text-sm text-muted">{item.dont}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </SectionBlock>

        <div className="h-24" />
      </main>
    </div>
  );
}
