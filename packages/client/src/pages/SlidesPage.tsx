import { useSearchParams } from "react-router-dom";

/* ── 슬라이드 데이터 ──────────────────────────────────────────────────── */

const SLIDES = [
  // ── 아키텍처 ────────────────────────────────────────────────────────
  {
    id: "arch-overview",
    section: "아키텍처",
    title: "전체 시스템 구조",
    content: <ArchOverview />,
  },
  {
    id: "arch-frontend",
    section: "아키텍처",
    title: "Frontend",
    content: <ArchFrontend />,
  },
  {
    id: "arch-backend",
    section: "아키텍처",
    title: "Backend & Infra",
    content: <ArchBackend />,
  },
  {
    id: "arch-monorepo",
    section: "아키텍처",
    title: "모노레포 구조",
    content: <ArchMonorepo />,
  },
  // ── AI 워크플로우 ────────────────────────────────────────────────────
  {
    id: "ai-overview",
    section: "AI Agent 개발",
    title: "AI 기반 개발 워크플로우",
    content: <AiOverview />,
  },
  {
    id: "ai-docs",
    section: "AI Agent 개발",
    title: "문서 기반 컨텍스트 관리",
    content: <AiDocs />,
  },
  {
    id: "ai-github",
    section: "AI Agent 개발",
    title: "GitHub Issue 기반 개발",
    content: <AiGithub />,
  },
  {
    id: "ai-skills",
    section: "AI Agent 개발",
    title: "커스텀 스킬 & 자동화",
    content: <AiSkills />,
  },
];

/* ── 페이지 ──────────────────────────────────────────────────────────── */

export function SlidesPage() {
  const [params] = useSearchParams();
  const n = Math.max(0, Math.min(parseInt(params.get("n") ?? "0"), SLIDES.length - 1));
  const slide = SLIDES[n];

  return (
    <div className="min-h-screen bg-cream flex flex-col" style={{ fontFamily: "var(--font-sans, sans-serif)" }}>
      {/* 상단 섹션 레이블 */}
      <div className="px-8 pt-8 pb-2">
        <span className="inline-block px-3 py-1 rounded-pill bg-primary text-offwhite text-xs font-semibold tracking-wide">
          {slide.section}
        </span>
      </div>

      {/* 타이틀 */}
      <div className="px-8 pb-6">
        <h1 className="text-2xl font-semibold text-charcoal tracking-tight">{slide.title}</h1>
      </div>

      {/* 본문 */}
      <div className="flex-1 px-8 pb-8 overflow-auto">
        {slide.content}
      </div>

      {/* 하단 페이지 표시 */}
      <div className="px-8 py-4 flex items-center justify-between border-t border-border">
        <span className="text-xs text-muted font-mono">mofit · 최주현</span>
        <span className="text-xs text-muted">{n + 1} / {SLIDES.length}</span>
      </div>
    </div>
  );
}

/* ── 슬라이드 콘텐츠 컴포넌트 ────────────────────────────────────────── */

function Chip({ children, color = "default" }: { children: React.ReactNode; color?: "blue" | "green" | "orange" | "purple" | "default" }) {
  const colors = {
    blue: "bg-primary text-offwhite",
    green: "bg-emerald-500 text-white",
    orange: "bg-orange-400 text-white",
    purple: "bg-violet-500 text-white",
    default: "bg-offwhite border border-border text-charcoal",
  };
  return (
    <span className={`inline-block px-3 py-1.5 rounded-card text-sm font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}

function Layer({ icon, label, items, color }: { icon: string; label: string; items: string[]; color: string }) {
  return (
    <div className={`rounded-card border-2 ${color} p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <span className="font-semibold text-sm text-charcoal">{label}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center py-1">
      <span className="text-muted text-xl">↕</span>
    </div>
  );
}

function ArchOverview() {
  return (
    <div className="flex flex-col gap-1">
      <Layer icon="📱" label="Frontend" items={["React 19", "Vite", "Capacitor (iOS · Android)"]} color="border-primary/40" />
      <Arrow />
      <div className="rounded-card border border-border bg-offwhite px-4 py-2 text-center">
        <span className="text-xs text-muted font-mono">REST API + WebSocket</span>
      </div>
      <Arrow />
      <Layer icon="🖥️" label="Backend" items={["Express", "Socket.IO"]} color="border-violet-400/40" />
      <Arrow />
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-card border border-border p-3 text-center">
          <div className="text-lg mb-1">🗄️</div>
          <div className="text-xs font-medium text-charcoal">Supabase</div>
          <div className="text-xs text-muted">PostgreSQL + Auth</div>
        </div>
        <div className="rounded-card border border-border p-3 text-center">
          <div className="text-lg mb-1">🖼️</div>
          <div className="text-xs font-medium text-charcoal">Cloudflare R2</div>
          <div className="text-xs text-muted">이미지 스토리지</div>
        </div>
        <div className="rounded-card border border-border p-3 text-center">
          <div className="text-lg mb-1">🔔</div>
          <div className="text-xs font-medium text-charcoal">FCM</div>
          <div className="text-xs text-muted">푸시 알림</div>
        </div>
      </div>
    </div>
  );
}

function ArchFrontend() {
  const stacks = [
    { label: "React 19", desc: "UI 프레임워크", color: "blue" as const },
    { label: "TypeScript", desc: "타입 안전성", color: "blue" as const },
    { label: "Vite", desc: "빌드 툴", color: "default" as const },
    { label: "Tailwind CSS", desc: "디자인 시스템", color: "default" as const },
    { label: "React Router v7", desc: "SPA 라우팅", color: "default" as const },
    { label: "Zustand", desc: "전역 상태 관리", color: "default" as const },
    { label: "Capacitor", desc: "iOS · Android 네이티브 빌드", color: "orange" as const },
    { label: "Socket.IO Client", desc: "실시간 채팅", color: "default" as const },
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-card border border-border bg-offwhite p-3 text-xs text-muted leading-relaxed">
        웹 코드베이스 하나로 iOS · Android · Web을 동시에 지원합니다.<br />
        Next.js 대신 Vite를 선택한 이유: Capacitor는 정적 파일만 번들링 → SSR 활용 불가
      </div>
      <div className="flex flex-col gap-2">
        {stacks.map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-card border border-border p-3">
            <Chip color={s.color}>{s.label}</Chip>
            <span className="text-sm text-muted">{s.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArchBackend() {
  const stacks = [
    { label: "Node.js", desc: "런타임 — 프론트와 언어 통일 (TypeScript)", color: "green" as const },
    { label: "Express", desc: "REST API 서버", color: "default" as const },
    { label: "Socket.IO", desc: "WebSocket 기반 1:1 실시간 채팅", color: "default" as const },
    { label: "Supabase", desc: "PostgreSQL + Auth (JWT 기반 인증)", color: "green" as const },
    { label: "Cloudflare R2", desc: "포트폴리오 · 프로필 이미지 저장", color: "default" as const },
    { label: "Firebase FCM", desc: "매칭 수락 · 채팅 푸시 알림", color: "orange" as const },
    { label: "sharp", desc: "업로드 이미지 WebP 변환 · 리사이징", color: "default" as const },
  ];
  return (
    <div className="flex flex-col gap-2">
      {stacks.map((s) => (
        <div key={s.label} className="flex items-center gap-3 rounded-card border border-border p-3">
          <Chip color={s.color}>{s.label}</Chip>
          <span className="text-sm text-muted">{s.desc}</span>
        </div>
      ))}
    </div>
  );
}

function ArchMonorepo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-card border border-border bg-offwhite p-3 text-xs text-muted">
        Turborepo + pnpm workspaces — 프론트/백엔드/공유 타입을 단일 레포에서 관리
      </div>
      <div className="font-mono text-sm bg-charcoal text-offwhite rounded-card p-4 leading-relaxed">
        <div className="text-muted text-xs mb-2">프로젝트 구조</div>
        <div>📦 mofit/</div>
        <div className="ml-4">├── 📱 packages/client &nbsp;<span className="text-primary">← React + Vite + Capacitor</span></div>
        <div className="ml-4">├── 🖥️ packages/server &nbsp;<span className="text-primary">← Express + Socket.IO</span></div>
        <div className="ml-4">└── 🔗 packages/shared &nbsp;<span className="text-primary">← 공유 타입 (Message 등)</span></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-card border border-border p-3 text-center">
          <div className="font-semibold text-sm text-charcoal">Turborepo</div>
          <div className="text-xs text-muted mt-1">병렬 빌드 · 캐싱</div>
        </div>
        <div className="rounded-card border border-border p-3 text-center">
          <div className="font-semibold text-sm text-charcoal">pnpm workspace</div>
          <div className="text-xs text-muted mt-1">패키지 간 의존성</div>
        </div>
      </div>
    </div>
  );
}

function FlowStep({ icon, label, sub, arrow = true }: { icon: string; label: string; sub: string; arrow?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-card border-2 border-primary/30 bg-offwhite px-4 py-3 text-center w-full">
        <div className="text-xl mb-1">{icon}</div>
        <div className="font-semibold text-sm text-charcoal">{label}</div>
        <div className="text-xs text-muted mt-0.5">{sub}</div>
      </div>
      {arrow && <div className="text-muted text-lg py-1">↓</div>}
    </div>
  );
}

function AiOverview() {
  return (
    <div className="flex flex-col gap-1">
      <div className="rounded-card border border-border bg-offwhite p-3 text-xs text-muted mb-2 leading-relaxed">
        기획부터 구현·리뷰까지 모든 단계에 Claude Code를 중심으로 한 AI 에이전트를 활용했습니다.
      </div>
      <FlowStep icon="📄" label="문서 작성" sub="PRD · SPEC · FSD · DESIGN" />
      <FlowStep icon="🤖" label="CLAUDE.md 설정" sub="AI에게 프로젝트 규칙 주입" />
      <FlowStep icon="🐙" label="GitHub Issue 생성" sub="기능 단위로 태스크 분리" />
      <FlowStep icon="⚡" label="Claude Code 구현" sub="이슈 읽고 코드 자동 작성" />
      <FlowStep icon="🔀" label="자동 커밋 & PR" sub="git-commit-grouper 스킬" arrow={false} />
    </div>
  );
}

function AiDocs() {
  const docs = [
    { file: "PRD.md", desc: "제품 목표 · 타겟 · 시나리오 · 성공 지표" },
    { file: "SPEC.md", desc: "기술 스택 · 아키텍처 · 선택 근거" },
    { file: "FSD.md", desc: "기능 상세 명세 · API 설계" },
    { file: "DESIGN.md", desc: "디자인 원칙 · 컬러 · 타이포그래피" },
    { file: "CLAUDE.md", desc: "컴포넌트 규칙 · 색상 토큰 · 파일 구조 — AI 작업 규칙" },
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-card border border-border bg-offwhite p-3 text-xs text-muted leading-relaxed">
        AI가 일관된 코드를 작성하려면 <strong>충분한 컨텍스트</strong>가 필요합니다.<br />
        모든 설계 결정을 문서화하고, CLAUDE.md로 AI에게 주입했습니다.
      </div>
      <div className="flex flex-col gap-2">
        {docs.map((d) => (
          <div key={d.file} className="flex items-start gap-3 rounded-card border border-border p-3">
            <span className="font-mono text-xs bg-charcoal text-offwhite px-2 py-1 rounded-compact flex-shrink-0">{d.file}</span>
            <span className="text-xs text-muted leading-relaxed">{d.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiGithub() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-card border border-border bg-offwhite p-3 text-xs text-muted leading-relaxed">
        기능을 GitHub Issue 단위로 쪼개고, Claude Code가 이슈를 컨텍스트로 읽어 개발합니다.
      </div>
      <div className="font-mono text-xs bg-charcoal text-offwhite rounded-card p-4 leading-loose">
        <div className="text-muted mb-1"># 개발 플로우</div>
        <div><span className="text-primary">1.</span> gh issue create <span className="text-yellow-300">"feat: 매칭 신청 헤어 상태 입력"</span></div>
        <div><span className="text-primary">2.</span> Claude Code가 이슈 읽고 구현</div>
        <div><span className="text-primary">3.</span> git-commit-grouper 스킬로 커밋 묶기</div>
        <div><span className="text-primary">4.</span> gh pr create → 코드 리뷰 요청</div>
      </div>
      <div className="rounded-card border border-border p-3">
        <div className="text-xs font-semibold text-charcoal mb-2">PR 템플릿 (.github/pull_request_template.md)</div>
        <div className="text-xs text-muted leading-relaxed">작업 요약 · 주요 변경 사항 · 참고 사항을 항상 일정한 포맷으로 작성하도록 강제해 리뷰 효율을 높였습니다.</div>
      </div>
    </div>
  );
}

function AiSkills() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-card border-2 border-primary/30 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">⚡</span>
          <span className="font-semibold text-sm text-charcoal">git-commit-grouper</span>
          <span className="text-xs text-muted ml-auto">커스텀 스킬</span>
        </div>
        <div className="text-xs text-muted leading-relaxed">
          변경된 파일을 의미 단위로 자동 그룹핑해 커밋합니다.<br />
          "feat: 디자인 시스템 버튼 컴포넌트", "fix: 라우터 리다이렉트" 처럼 AI가 커밋 메시지까지 작성해요.
        </div>
      </div>
      <div className="rounded-card border border-border p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🤖</span>
          <span className="font-semibold text-sm text-charcoal">Claude Code CLI</span>
        </div>
        <div className="text-xs text-muted leading-relaxed">
          터미널에서 직접 대화하며 코드 작성 · 리팩토링 · 버그 수정을 진행합니다.<br />
          CLAUDE.md의 규칙을 자동으로 읽어 일관된 디자인 토큰 · 컴포넌트 사용을 유지해요.
        </div>
      </div>
      <div className="rounded-card border border-border p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">📋</span>
          <span className="font-semibold text-sm text-charcoal">효과</span>
        </div>
        <div className="text-xs text-muted leading-relaxed">
          혼자 풀스택 서비스를 단기간에 구현 · 디자인 시스템 일관성 유지 · 반복 작업 자동화.<br />
          AI가 코드를 쓰는 동안 사람은 <strong>설계와 판단</strong>에 집중할 수 있었습니다.
        </div>
      </div>
    </div>
  );
}
