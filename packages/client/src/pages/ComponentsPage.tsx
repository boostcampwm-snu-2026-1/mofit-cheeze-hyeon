import { useState, useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card, CardHeader, CardBody, CardFooter,
  Input,
  Badge,
  Display, Heading, SubHeading, CardTitle, BodyLarge, Body, Caption,
} from "@ui";

// ── Types ──────────────────────────────────────────────────────────────────

type ControlValue = string | boolean;
type Props = Record<string, ControlValue>;

type ControlDef =
  | { key: string; label: string; type: "select"; options: string[]; defaultValue: string }
  | { key: string; label: string; type: "boolean"; defaultValue: boolean }
  | { key: string; label: string; type: "text"; defaultValue: string };

type Story = { name: string; description?: string; node: ReactNode };

type ComponentDef = {
  id: string;
  name: string;
  description: string;
  controls: ControlDef[];
  playground: (props: Props) => ReactNode;
  stories: Story[];
  storyLayout?: "grid" | "list";
  code: (props: Props) => string;
};

// ── Component registry ──────────────────────────────────────────────────────

const COMPONENTS: ComponentDef[] = [
  {
    id: "button",
    name: "Button",
    description: "액션을 트리거한다. Primary는 Soft Blue(#4D8DFF). variant와 size로 위계를 조절한다.",
    controls: [
      { key: "variant", label: "Variant", type: "select", options: ["primary", "ghost", "cream", "pill"], defaultValue: "primary" },
      { key: "size", label: "Size", type: "select", options: ["sm", "md", "lg"], defaultValue: "md" },
      { key: "disabled", label: "Disabled", type: "boolean", defaultValue: false },
      { key: "label", label: "Label", type: "text", defaultValue: "예약하기" },
    ],
    playground: (p) => (
      <Button
        variant={p.variant as "primary" | "ghost" | "cream" | "pill"}
        size={p.size as "sm" | "md" | "lg"}
        disabled={p.disabled as boolean}
      >
        {p.label as string}
      </Button>
    ),
    stories: [
      { name: "Primary", description: "Soft Blue — 주요 CTA", node: <Button variant="primary">예약하기</Button> },
      { name: "Ghost", description: "테두리, 투명 배경", node: <Button variant="ghost">자세히 보기</Button> },
      { name: "Cream", description: "서피스 색 배경", node: <Button variant="cream">더 보기</Button> },
      { name: "Pill", description: "완전한 Pill 형태", node: <Button variant="pill">+ 추가</Button> },
      { name: "Small", description: "size=sm", node: <Button variant="primary" size="sm">지원하기</Button> },
      { name: "Large", description: "size=lg", node: <Button variant="primary" size="lg">매칭 신청</Button> },
      { name: "Disabled", description: "opacity-40", node: <Button variant="primary" disabled>Disabled</Button> },
      { name: "Ghost Disabled", description: "opacity-40", node: <Button variant="ghost" disabled>Disabled</Button> },
    ],
    code: (p) => {
      const v = p.variant !== "primary" ? ` variant="${p.variant}"` : "";
      const s = p.size !== "md" ? ` size="${p.size}"` : "";
      const d = p.disabled ? " disabled" : "";
      return `<Button${v}${s}${d}>\n  ${p.label}\n</Button>`;
    },
  },
  {
    id: "card",
    name: "Card",
    description: "콘텐츠를 그룹화하는 컨테이너. 흰 배경에 블루 계열 테두리. radius로 위계 구분.",
    controls: [
      { key: "radius", label: "Radius", type: "select", options: ["compact", "card", "container"], defaultValue: "card" },
      { key: "showHeader", label: "Header", type: "boolean", defaultValue: true },
      { key: "showFooter", label: "Footer", type: "boolean", defaultValue: true },
      { key: "title", label: "Title", type: "text", defaultValue: "카드 제목" },
    ],
    playground: (p) => (
      <Card radius={p.radius as "compact" | "card" | "container"} className="w-72">
        {p.showHeader && (
          <CardHeader>
            <CardTitle>{p.title as string}</CardTitle>
          </CardHeader>
        )}
        <CardBody>
          <Body className="text-muted">카드의 본문 내용이 들어가는 영역입니다.</Body>
        </CardBody>
        {p.showFooter && (
          <CardFooter>
            <div className="flex gap-2">
              <Button size="sm" variant="primary">확인</Button>
              <Button size="sm" variant="ghost">취소</Button>
            </div>
          </CardFooter>
        )}
      </Card>
    ),
    stories: [
      {
        name: "Standard",
        description: "radius=card (14px)",
        node: (
          <Card radius="card" className="w-56">
            <CardHeader><CardTitle>디자이너 카드</CardTitle></CardHeader>
            <CardBody><Body className="text-muted text-sm">강남구 · 커트 전문</Body></CardBody>
            <CardFooter><Button size="sm" variant="primary">프로필 보기</Button></CardFooter>
          </Card>
        ),
      },
      {
        name: "Compact",
        description: "radius=compact (8px)",
        node: (
          <Card radius="compact" className="w-56">
            <CardBody>
              <div className="flex justify-between items-center">
                <CardTitle>매칭 요청</CardTitle>
                <Badge variant="muted">대기중</Badge>
              </div>
            </CardBody>
          </Card>
        ),
      },
      {
        name: "Container",
        description: "radius=container (20px)",
        node: (
          <Card radius="container" className="w-56">
            <CardBody className="py-6 text-center">
              <p className="font-sans font-semibold text-3xl text-charcoal tracking-[-0.8px]">48</p>
              <Caption>활성 디자이너</Caption>
            </CardBody>
          </Card>
        ),
      },
      {
        name: "Body Only",
        description: "헤더·푸터 없는 미니멀",
        node: (
          <Card className="w-56">
            <CardBody>
              <Body className="text-muted text-sm">심플한 정보 카드. 최소한의 구조로 콘텐츠를 담는다.</Body>
            </CardBody>
          </Card>
        ),
      },
    ],
    code: (p) => {
      const r = p.radius !== "card" ? ` radius="${p.radius}"` : "";
      const header = p.showHeader
        ? `\n  <CardHeader>\n    <CardTitle>${p.title}</CardTitle>\n  </CardHeader>` : "";
      const footer = p.showFooter
        ? `\n  <CardFooter>\n    <Button size="sm">Action</Button>\n  </CardFooter>` : "";
      return `<Card${r}>${header}\n  <CardBody>\n    <Body>Content</Body>\n  </CardBody>${footer}\n</Card>`;
    },
  },
  {
    id: "input",
    name: "Input",
    description: "label, hint, error를 지원하는 폼 필드. 포커스 시 Primary Blue 테두리로 변경된다.",
    controls: [
      { key: "label", label: "Label", type: "text", defaultValue: "이메일" },
      { key: "placeholder", label: "Placeholder", type: "text", defaultValue: "you@example.com" },
      { key: "hint", label: "Hint", type: "text", defaultValue: "" },
      { key: "error", label: "Error", type: "text", defaultValue: "" },
      { key: "disabled", label: "Disabled", type: "boolean", defaultValue: false },
    ],
    playground: (p) => (
      <div className="w-72">
        <Input
          label={(p.label as string) || undefined}
          placeholder={p.placeholder as string}
          hint={(p.hint as string) || undefined}
          error={(p.error as string) || undefined}
          disabled={p.disabled as boolean}
        />
      </div>
    ),
    stories: [
      { name: "Default", node: <div className="w-56"><Input placeholder="값을 입력하세요" /></div> },
      { name: "With Label", node: <div className="w-56"><Input label="이름" placeholder="홍길동" /></div> },
      { name: "With Hint", node: <div className="w-56"><Input label="포트폴리오" placeholder="https://..." hint="https:// 포함하여 입력" /></div> },
      { name: "With Error", node: <div className="w-56"><Input label="이메일" defaultValue="not-valid" error="올바른 이메일을 입력해주세요" /></div> },
      { name: "Disabled", node: <div className="w-56"><Input label="아이디" placeholder="수정 불가" disabled /></div> },
    ],
    code: (p) => {
      const parts: string[] = [];
      if (p.label) parts.push(`  label="${p.label}"`);
      if (p.placeholder) parts.push(`  placeholder="${p.placeholder}"`);
      if (p.hint) parts.push(`  hint="${p.hint}"`);
      if (p.error) parts.push(`  error="${p.error}"`);
      if (p.disabled) parts.push("  disabled");
      return `<Input\n${parts.join("\n")}\n/>`;
    },
  },
  {
    id: "badge",
    name: "Badge",
    description: "Pill 형태의 상태 레이블. 세 가지 variant로 강조 수준을 조절한다.",
    controls: [
      { key: "variant", label: "Variant", type: "select", options: ["default", "muted", "outline"], defaultValue: "default" },
      { key: "label", label: "Label", type: "text", defaultValue: "신규" },
    ],
    playground: (p) => (
      <Badge variant={p.variant as "default" | "muted" | "outline"}>
        {p.label as string}
      </Badge>
    ),
    stories: [
      { name: "Default", description: "다크 채움 — 높은 강조", node: <Badge variant="default">추천</Badge> },
      { name: "Muted", description: "연한 톤 — 상태 표시", node: <Badge variant="muted">대기중</Badge> },
      { name: "Outline", description: "테두리만 — 카테고리", node: <Badge variant="outline">염색</Badge> },
      {
        name: "Mixed group",
        node: <div className="flex gap-2 flex-wrap"><Badge>신규</Badge><Badge variant="muted">진행중</Badge><Badge variant="outline">커트</Badge></div>,
      },
      {
        name: "In context",
        node: <div className="flex items-center gap-2"><Body>상태</Body><Badge variant="muted">활성</Badge></div>,
      },
    ],
    code: (p) => {
      const v = p.variant !== "default" ? ` variant="${p.variant}"` : "";
      return `<Badge${v}>\n  ${p.label}\n</Badge>`;
    },
  },
  {
    id: "typography",
    name: "Typography",
    description: "Pretendard. 크기와 굵기만으로 위계를 만든다. letter-spacing은 Display/Heading에만 적용.",
    storyLayout: "list",
    controls: [
      {
        key: "component",
        label: "Level",
        type: "select",
        options: ["Display", "Heading", "SubHeading", "CardTitle", "BodyLarge", "Body", "Caption"],
        defaultValue: "Heading",
      },
      { key: "text", label: "Text", type: "text", defaultValue: "모핏 헤어 스타일링" },
    ],
    playground: (p) => {
      const text = p.text as string;
      const map: Record<string, ReactNode> = {
        Display: <Display>{text}</Display>,
        Heading: <Heading>{text}</Heading>,
        SubHeading: <SubHeading>{text}</SubHeading>,
        CardTitle: <CardTitle>{text}</CardTitle>,
        BodyLarge: <BodyLarge>{text}</BodyLarge>,
        Body: <Body>{text}</Body>,
        Caption: <Caption>{text}</Caption>,
      };
      return map[p.component as string] ?? map["Heading"];
    },
    stories: [
      { name: "Display", description: "최대 헤드라인 · tracking −1.5px", node: <Display>모핏 헤어 스타일링</Display> },
      { name: "Heading", description: "섹션 제목 · tracking −1.2px", node: <Heading>모핏 헤어 스타일링</Heading> },
      { name: "SubHeading", description: "서브 제목 · tracking −0.9px", node: <SubHeading>모핏 헤어 스타일링</SubHeading> },
      { name: "CardTitle", description: "카드 제목 · 20px", node: <CardTitle>레이어드 커트 · 강남구 · 김지수 디자이너</CardTitle> },
      { name: "BodyLarge", description: "강조 본문 · 18px", node: <BodyLarge>헤어 스타일을 발견하고 나에게 맞는 디자이너를 매칭하세요.</BodyLarge> },
      { name: "Body", description: "일반 본문 · 16px", node: <Body>포트폴리오, 리뷰, 비용, 조건을 투명하게 노출한다. 신뢰를 기반으로 한 매칭 경험.</Body> },
      { name: "Caption", description: "보조 정보 · 14px · muted", node: <Caption>3일 전 업데이트 · 리뷰 128개 · 평균 4.9점</Caption> },
    ],
    code: (p) => `<${p.component}>\n  ${p.text}\n</${p.component}>`,
  },
];

// ── UI Primitives ───────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        "relative w-9 h-5 rounded-pill transition-colors outline-none focus:shadow-focus flex-shrink-0",
        checked ? "bg-primary" : "bg-border",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-0.5 w-4 h-4 bg-offwhite rounded-pill transition-transform",
          checked ? "translate-x-[18px]" : "translate-x-0.5",
        ].join(" ")}
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
      />
    </button>
  );
}

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={[
            "px-2.5 py-1 rounded-micro text-xs font-sans transition-colors outline-none",
            value === opt
              ? "bg-primary text-offwhite"
              : "bg-surface-subtle text-charcoal hover:bg-surface-hover",
          ].join(" ")}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function ControlsPanel({
  controls,
  values,
  onChange,
  onReset,
}: {
  controls: ControlDef[];
  values: Props;
  onChange: (key: string, value: ControlValue) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <p className="font-sans font-semibold text-[10px] tracking-widest uppercase text-muted">
        Controls
      </p>
      {controls.map((ctrl) => {
        const raw = values[ctrl.key];
        return (
          <div key={ctrl.key} className="flex flex-col gap-1.5">
            <label className="font-sans text-xs text-muted">{ctrl.label}</label>

            {ctrl.type === "select" && (
              <SegmentedControl
                options={ctrl.options}
                value={raw !== undefined ? (raw as string) : ctrl.defaultValue}
                onChange={(v) => onChange(ctrl.key, v)}
              />
            )}

            {ctrl.type === "boolean" && (
              <Toggle
                checked={raw !== undefined ? (raw as boolean) : ctrl.defaultValue}
                onChange={(v) => onChange(ctrl.key, v)}
              />
            )}

            {ctrl.type === "text" && (
              <input
                type="text"
                value={raw !== undefined ? (raw as string) : ctrl.defaultValue}
                onChange={(e) => onChange(ctrl.key, e.target.value)}
                className="bg-offwhite border border-border rounded-[6px] px-2.5 py-1.5 text-sm font-sans text-charcoal outline-none focus:border-primary focus:shadow-focus placeholder:text-muted w-full transition-colors"
              />
            )}
          </div>
        );
      })}

      <button
        onClick={onReset}
        className="mt-1 text-xs font-sans text-muted hover:text-charcoal transition-colors text-left w-fit"
      >
        ↺ Reset
      </button>
    </div>
  );
}

function CodeBlock({
  code,
  onCopy,
  copied,
}: {
  code: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="border border-border rounded-card overflow-hidden mt-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-cream">
        <span className="font-sans text-[10px] tracking-widest uppercase text-muted">Usage</span>
        <button
          onClick={onCopy}
          className={[
            "font-sans text-xs transition-colors",
            copied ? "text-primary font-semibold" : "text-muted hover:text-charcoal",
          ].join(" ")}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre className="px-4 py-4 text-xs font-mono text-charcoal overflow-x-auto leading-relaxed bg-offwhite">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function StoryCard({ story }: { story: Story }) {
  return (
    <div className="border border-border rounded-card overflow-hidden group hover:border-primary-light transition-colors">
      <div className="min-h-28 flex items-center justify-center p-6 bg-cream">
        {story.node}
      </div>
      <div className="px-4 py-3 border-t border-border bg-offwhite">
        <p className="font-sans text-sm text-charcoal font-semibold leading-tight">{story.name}</p>
        {story.description && (
          <p className="font-sans text-xs text-muted mt-0.5 leading-normal">{story.description}</p>
        )}
      </div>
    </div>
  );
}

function StoryRow({ story }: { story: Story }) {
  return (
    <div className="border border-border rounded-card overflow-hidden group hover:border-primary-light transition-colors">
      <div className="flex items-center justify-between px-6 py-5 bg-cream">
        <div className="flex-1 overflow-hidden">{story.node}</div>
        {story.description && (
          <div className="flex-shrink-0 ml-8 text-right">
            <p className="font-sans text-sm text-charcoal font-semibold leading-tight">{story.name}</p>
            <p className="font-sans text-xs text-muted mt-0.5">{story.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────

export function ComponentsPage() {
  const [activeId, setActiveId] = useState(COMPONENTS[0].id);
  const [controlValues, setControlValues] = useState<Props>({});
  const [copied, setCopied] = useState(false);

  const component = COMPONENTS.find((c) => c.id === activeId)!;

  const resolvedProps = Object.fromEntries(
    component.controls.map((c) => [c.key, controlValues[c.key] ?? c.defaultValue])
  );

  const handleSelect = (id: string) => {
    setActiveId(id);
    setControlValues({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (key: string, value: ControlValue) => {
    setControlValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => setControlValues({});

  const handleCopy = () => {
    navigator.clipboard.writeText(component.code(resolvedProps));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    setCopied(false);
  }, [activeId]);

  return (
    <div className="flex min-h-screen bg-offwhite font-sans">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-52 border-r border-border bg-offwhite flex flex-col z-10">
        <div className="px-5 py-6 border-b border-border">
          <p className="font-sans font-semibold text-sm text-charcoal">Components</p>
          <p className="font-sans text-xs text-muted mt-0.5">MOFIT</p>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="px-3 mb-2 font-sans text-[10px] tracking-widest uppercase text-muted">
            Atoms
          </p>
          {COMPONENTS.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className={[
                "w-full text-left px-3 py-2 rounded-[6px] font-sans text-sm transition-colors",
                activeId === c.id
                  ? "bg-surface-hover text-primary font-semibold"
                  : "text-muted hover:text-charcoal hover:bg-surface-subtle",
              ].join(" ")}
            >
              {c.name}
            </button>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-border">
          <Link
            to="/design-system"
            className="font-sans text-xs text-muted hover:text-charcoal transition-colors"
          >
            ← Design Tokens
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-52 flex-1 pb-24">
        {/* Header */}
        <div className="px-10 py-12 border-b border-border">
          <h1 className="font-sans font-semibold text-[2rem] leading-tight tracking-[-0.8px] text-charcoal">
            {component.name}
          </h1>
          <p className="font-sans text-base text-muted mt-2 max-w-xl leading-normal">
            {component.description}
          </p>
        </div>

        {/* Playground + Controls */}
        <div className="px-10 py-10 flex gap-10 border-b border-border">
          <div className="flex-1 min-w-0">
            <p className="font-sans font-semibold text-[10px] tracking-widest uppercase text-muted mb-4">
              Playground
            </p>
            <div
              className="min-h-52 border border-border rounded-card flex items-center justify-center p-10"
              style={{
                backgroundImage: "radial-gradient(circle, #c5d8f5 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              {component.playground(resolvedProps)}
            </div>
            <CodeBlock
              code={component.code(resolvedProps)}
              onCopy={handleCopy}
              copied={copied}
            />
          </div>

          <div className="w-60 flex-shrink-0">
            <ControlsPanel
              controls={component.controls}
              values={controlValues}
              onChange={handleChange}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Stories */}
        <div className="px-10 py-10">
          <p className="font-sans font-semibold text-[10px] tracking-widest uppercase text-muted mb-6">
            Stories
          </p>

          {component.storyLayout === "list" ? (
            <div className="flex flex-col gap-3">
              {component.stories.map((story) => (
                <StoryRow key={story.name} story={story} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {component.stories.map((story) => (
                <StoryCard key={story.name} story={story} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
