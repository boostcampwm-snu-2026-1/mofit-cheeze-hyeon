#!/usr/bin/env node
/**
 * mofit 데모 자동화 스크립트 (화면 녹화용)
 *
 * 사전 조건:
 *   개발 서버 실행: VITE_USE_MOCK=true pnpm dev  (packages/client 에서)
 *   playwright 브라우저: npx playwright install chromium
 *
 * 실행: node demo/create-demo.mjs
 *
 * 브라우저가 자동으로 열리고 데모 플로우를 진행합니다.
 * QuickTime 등으로 화면 녹화를 시작한 후 이 스크립트를 실행하세요.
 */

import { chromium } from "playwright";
import { spawnSync } from "child_process";

const BASE_URL = "http://localhost:5173";

const VOICE = "Jian (Premium)";
const SPEECH_RATE = 200;
const FAST = process.argv.includes("--fast");

// ─── 나레이션 텍스트 ──────────────────────────────────────────────────────────

const SEGMENTS = [
  // [0-A] 자기소개
  "안녕하세요, 자유전공학부 최주현입니다. 최종 과제 발표를 시작하겠습니다.",

  // [0-B] 서비스 소개 + 문제 정의
  "제가 개발한 서비스는 헤어 모델과 디자이너를 연결하는 매칭 플랫폼, 모핏입니다. 헤어 디자이너는 포트폴리오 촬영을 위한 모델을 구하기 어렵고, 헤어 모델은 저렴하게 시술받을 기회를 찾기 어렵습니다. 모핏은 이 두 그룹을 직접 연결해 상호 이익을 만들어냅니다.",

  // [1] 역할 선택
  "서비스는 헤어 모델과 헤어 디자이너, 두 역할로 구분됩니다. 먼저 헤어 모델로 체험해 보겠습니다.",

  // [2] 필터 + 탐색
  "탐색 화면에서는 지역, 시술 스타일, 비용 등 다양한 조건으로 원하는 디자이너를 필터링할 수 있습니다.",

  // [3] 목록 스크롤
  "각 카드에는 디자이너의 전문 시술, 경력, 지역 정보와 현재 모집 중인 공고 내용이 함께 표시됩니다.",

  // [4] 디자이너 상세 + 포트폴리오
  "디자이너 상세 페이지에서 포트폴리오 사진을 통해 실제 시술 결과물을 확인할 수 있습니다.",

  // [5] 리뷰 섹션
  "이전 매칭 모델들의 리뷰도 확인할 수 있으며, 신뢰할 수 있는 디자이너를 선택하는 데 도움이 됩니다.",

  // [6] 매칭 신청 — 날짜 선택
  "매칭 신청 화면에서는 디자이너가 제시한 날짜 중 가능한 날짜를 선택합니다.",

  // [7] 헤어 상태 입력
  "현재 헤어 길이, 모발 상태, 컬러를 선택하면 디자이너가 시술 가능 여부를 미리 판단할 수 있습니다. 불필요한 커뮤니케이션을 줄이는 핵심 기능입니다.",

  // [8] 동의 조건
  "콘텐츠 활용 동의와 얼굴 공개 동의 여부도 미리 합의합니다. 촬영 결과물 사용 범위를 신청 단계에서 명확히 정합니다.",

  // [9] 신청함 상태 탭
  "신청이 완료되면 신청함에서 상태를 확인할 수 있습니다. 대기중, 수락됨, 거절됨 탭으로 구분되어 있습니다.",

  // [10] 신청서 상세 (모델) + 취소
  "신청서를 열면 신청 내용을 확인하고, 수락 전이라면 취소도 할 수 있습니다.",

  // [11] 알림
  "수락 알림은 알림 탭에서 확인됩니다. 읽지 않은 알림 수가 하단 탭에 뱃지로 표시됩니다.",

  // [12] 채팅
  "매칭이 수락되면 채팅으로 바로 연결되어 시술 일정과 세부 사항을 조율할 수 있습니다.",

  // [13] 모델 프로필
  "프로필 탭에서는 신청 횟수, 수락된 매칭 통계와 최근 매칭 내역을 확인할 수 있습니다.",

  // [14] 디자이너로 전환
  "이번에는 디자이너 시점으로 전환해 보겠습니다.",

  // [15] 디자이너 신청함
  "디자이너 신청함에 모델들의 매칭 요청이 들어와 있습니다.",

  // [16] 신청서 상세 (디자이너) + 수락
  "신청서를 열면 모델의 현재 헤어 상태가 가장 먼저 보입니다. 이 정보로 시술 가능 여부를 빠르게 판단하고 수락 또는 거절을 결정합니다.",

  // [17] 공고 목록
  "디자이너는 여러 개의 모집 공고를 동시에 운영할 수 있습니다. 시술 스타일별로 별도 공고를 올려서 다양한 모델을 모집할 수 있습니다.",

  // [18] 새 공고 작성
  "새 공고를 작성할 때는 시술 스타일을 입력하고, 비용과 모집 가능 날짜를 선택합니다.",

  // [19] 스케줄
  "스케줄 탭에서는 수락된 매칭 일정을 날짜별로 한눈에 관리할 수 있습니다.",

  // [20] 디자이너 프로필
  "디자이너 프로필에서는 총 매칭 수, 리뷰, 평점 등 활동 통계와 포트폴리오 미리보기, 등록된 공고 목록까지 한 곳에서 확인할 수 있습니다.",

  // [21] 서비스 데모 마무리 → 아키텍처 전환
  "서비스 데모를 마치고, 이제 아키텍처와 개발 방식을 설명드리겠습니다.",

  // ── 아키텍처 ────────────────────────────────────────────────────────
  // [22] 전체 구조
  "모핏은 Front-end, Back-end, Database 세 계층으로 구성된 풀스택 서비스입니다. REST API와 WebSocket으로 클라이언트와 서버가 통신합니다.",

  // [23] Frontend
  "Front-end는 React 19와 Vite를 기반으로, Tailwind CSS로 디자인 시스템을 구축했습니다. Capacitor를 통해 하나의 웹 코드베이스에서 iOS와 Android 앱을 동시에 빌드할 수 있습니다.",

  // [24] Backend & Infra
  "Back-end는 Node.js Express와 Socket.IO 기반의 실시간 채팅 구조로 설계했습니다. 데이터베이스는 Supabase PostgreSQL, 이미지 스토리지는 Cloudflare R2, 푸시 알림은 Firebase Cloud Messaging을 활용할 계획입니다.",

  // [25] 모노레포
  "Front-end, Back-end, 공유 타입 패키지를 Turborepo와 pnpm 워크스페이스로 하나의 모노레포에서 관리합니다. 패키지 간 타입을 공유하고 병렬 빌드를 활용해 개발 효율을 높였습니다.",

  // ── AI 워크플로우 ────────────────────────────────────────────────────
  // [26] AI 개발 개요
  "이 서비스는 Claude Code를 중심으로 한 AI 에이전트 개발 워크플로우로 만들어졌습니다. 기획부터 구현까지 모든 단계에서 AI를 적극 활용했습니다.",

  // [27] 문서 기반 컨텍스트
  "먼저 PRD, SPEC, FSD, DESIGN 문서를 작성해 AI에게 프로젝트 전체 컨텍스트를 제공했습니다. CLAUDE.md에는 디자인 토큰 규칙, 컴포넌트 사용 원칙 등 AI가 일관된 코드를 작성하기 위한 규칙을 정의했습니다.",

  // [28] GitHub Issue 기반 개발
  "개발은 GitHub Issue 단위로 진행했습니다. 기능 요구사항을 이슈로 등록하면 Claude Code가 이슈를 읽고 코드를 구현하며, 변경사항을 PR로 제출하는 방식입니다.",

  // [29] 커스텀 스킬 & 자동화
  "git-commit-grouper라는 커스텀 스킬을 만들어, 변경된 파일들을 의미 단위로 자동 그룹핑해 커밋하게 했습니다. AI가 커밋 메시지까지 작성하며 반복 작업을 자동화했습니다.",

  // [30] 아웃트로
  "이 워크플로우 덕분에 혼자 풀스택 서비스를 단기간에 구현하면서도 디자인 시스템 일관성을 유지할 수 있었습니다. 이상으로 발표를 마치겠습니다. 감사합니다.",
];

// ─── 헬퍼 ────────────────────────────────────────────────────────────────────

function log(segment, text) {
  const idx = String(segment).padStart(2, " ");
  console.log(`\n[${idx}] ${text}`);
}

// ─── 메인 플로우 ──────────────────────────────────────────────────────────────

async function runDemo() {
  // 개발 서버 체크
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error();
  } catch {
    console.error(`\n❌  개발 서버가 꺼져 있어요.\n    VITE_USE_MOCK=true pnpm dev 를 먼저 실행해주세요.\n`);
    process.exit(1);
  }

  const browser = await chromium.launch({
    headless: false,
    slowMo: 40,
    args: [
      "--window-size=430,900",
      "--window-position=300,30",
      "--disable-features=Translate,TranslateUI,StatusBubble",
      "--disable-translate",
      "--lang=ko",
      "--no-first-run",
    ],
  });

  // viewport: null → Chrome이 결정한 실제 창 크기로 렌더링
  // app 배경(bg-cream)이 양옆을 채워 회색 여백 없음
  const context = await browser.newContext({
    viewport: null,
    locale: "ko-KR",
  });

  const page = await context.newPage();

  // 마우스 커서 오버레이 — 모든 페이지 이동마다 자동 주입
  await page.addInitScript(() => {
    const init = () => {
      if (document.getElementById("__cursor__")) return;
      const el = document.createElement("div");
      el.id = "__cursor__";
      Object.assign(el.style, {
        position: "fixed", width: "18px", height: "18px",
        background: "rgba(77,141,255,0.85)", border: "2.5px solid #fff",
        borderRadius: "50%", pointerEvents: "none", zIndex: "2147483647",
        transform: "translate(-50%,-50%)", left: "-100px", top: "-100px",
        boxShadow: "0 0 0 3px rgba(77,141,255,0.25)", transition: "left 0.04s,top 0.04s",
      });
      document.body.appendChild(el);
      document.addEventListener("mousemove", (e) => {
        el.style.left = e.clientX + "px";
        el.style.top = e.clientY + "px";
      });
    };
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", init)
      : init();
  });

  const settle = (ms = 400) => page.waitForTimeout(FAST ? Math.min(ms, 150) : ms);

  // 페이지 이동 + 번역 팝업 자동 닫기
  const nav = async (url) => {
    const path = url.replace(BASE_URL, "") || "/";
    console.log(`  → ${path}`);
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    await page.keyboard.press("Escape");
    await settle(300);
  };

  // Zustand 상태 유지 SPA 이동 (역할 전환 등에 사용)
  const spaNav = async (path) => {
    console.log(`  ↪ ${path} (SPA)`);
    await page.evaluate((p) => window.__demo.navigate(p), path);
    // 쿼리스트링 포함 경로는 pathname 부분만 glob 매칭
    const pathname = path.split("?")[0];
    await page.waitForURL(`**${pathname}*`);
    await settle(300);
  };

  const narrate = async (idx) => {
    const text = SEGMENTS[idx];
    log(idx, `"${text}"`);
    if (!FAST) spawnSync("say", ["-v", VOICE, "-r", String(SPEECH_RATE), text]);
    await page.waitForTimeout(FAST ? 0 : 400);
  };

  // ── [0-A] 자기소개 ─────────────────────────────────────────────────────────
  console.log("\n🎬  데모 시작 — 화면 녹화를 시작해주세요!\n");
  await settle(1500); // 녹화 준비 시간

  await nav(BASE_URL);
  await settle(3500);
  await narrate(0);

  // ── [0-B] 서비스 소개 ──────────────────────────────────────────────────────
  await narrate(1);

  // ── [1] 역할 선택 → 모델로 진입 ────────────────────────────────────────────
  await narrate(2); // "서비스는 헤어 모델과 헤어 디자이너, 두 역할로..." — 역할 선택 화면
  await page.getByText("헤어 모델로 체험").click();
  await page.waitForURL("**/discover");
  await page.waitForLoadState("networkidle");
  await settle(350);

  // ── [2] 필터 + 카테고리 ─────────────────────────────────────────────────────
  await page.getByText("필터").click();
  await settle(2000);
  await page.getByText("무료 협업").click().catch(() => {});
  await settle(2000);
  await page.getByText("적용").click().catch(async () => {
    await page.keyboard.press("Escape");
  });
  await settle(800);
  await page.getByText("커트", { exact: true }).click();
  await settle(700);
  await page.getByText("전체", { exact: true }).first().click();
  await settle(600);
  await narrate(3); // "탐색 화면에서는 지역, 시술 스타일..."

  // ── [3] 목록 스크롤 ──────────────────────────────────────────────────────────
  await page.evaluate(() => window.scrollBy({ top: 280, behavior: "smooth" }));
  await settle(350);
  await page.evaluate(() => window.scrollBy({ top: 280, behavior: "smooth" }));
  await settle(400);
  await narrate(4); // "각 카드에는 디자이너의 전문 시술..."

  // ── [4] 디자이너 상세 + 포트폴리오 ──────────────────────────────────────────
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await settle(400);
  await page.locator('a[href^="/designers/"]').first().click();
  await page.waitForURL("**/designers/**");
  await page.waitForLoadState("networkidle");
  await settle(350);
  await page.evaluate(() => window.scrollBy({ top: 320, behavior: "smooth" }));
  await settle(400);
  await page.evaluate(() => window.scrollBy({ top: 200, behavior: "smooth" }));
  await settle(300);
  await narrate(5); // "디자이너 상세 페이지에서 포트폴리오..."

  // ── [5] 리뷰 섹션 ────────────────────────────────────────────────────────────
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: "smooth" }));
  await settle(350);
  await narrate(6); // "이전 매칭 모델들의 리뷰도..."

  // ── [6] 매칭 신청 → 날짜 선택 ───────────────────────────────────────────────
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await settle(400);
  await page.getByText("매칭 신청").first().click();
  await page.waitForURL("**/match/apply/**");
  await page.waitForLoadState("networkidle");
  await settle(350);
  const dateBtns = page.locator(".grid.grid-cols-4 button");
  await dateBtns.first().click();
  await settle(550);
  await dateBtns.nth(1).click();
  await settle(550);
  await narrate(7); // "매칭 신청 화면에서는 디자이너가 제시한 날짜 중..."

  // ── [7] 헤어 상태 입력 ───────────────────────────────────────────────────────
  await page.evaluate(() => window.scrollBy({ top: 420, behavior: "smooth" }));
  await settle(500);
  await page.getByText("미디엄").first().click();
  await settle(550);
  await page.getByText("건강").first().click();
  await settle(550);
  await page.getByText("자연 흑발").first().click();
  await settle(550);
  await narrate(8); // "현재 헤어 길이, 모발 상태, 컬러를..."

  // ── [8] 동의 조건 ────────────────────────────────────────────────────────────
  await page.evaluate(() => window.scrollBy({ top: 320, behavior: "smooth" }));
  await settle(500);
  await page.locator('button[role="switch"]').first().click();
  await settle(500);
  await page.locator('button[role="switch"]').nth(1).click();
  await settle(500);
  await narrate(9); // "콘텐츠 활용 동의와 얼굴 공개 동의..."

  // ── 제출 → [9] 신청함 탭 ─────────────────────────────────────────────────────
  await page.evaluate(() => window.scrollTo({ top: 99999, behavior: "smooth" }));
  await settle(400);
  await page.getByText("매칭 신청하기").click();
  await page.waitForURL("**/matching/inbox");
  await page.waitForLoadState("networkidle");
  await settle(350);

  const tab = (name) => page.locator("button.flex-1").filter({ hasText: name }).first();
  await tab("대기중").click();
  await settle(600);
  await tab("수락됨").click();
  await settle(600);
  await tab("전체").click();
  await settle(500);
  await narrate(10); // "신청이 완료되면 신청함에서 상태를..."

  // ── [10] 신청서 상세 (모델) + 취소 버튼 확인 ────────────────────────────────
  await tab("대기중").click();
  await settle(400);
  await page.locator("button.w-full").first().click().catch(async () => {
    await page.locator('button[class*="hover:bg-surface"]').first().click();
  });
  await page.waitForURL("**/matching/**");
  await page.waitForLoadState("networkidle");
  await settle(400);
  await narrate(11); // "신청서를 열면 신청 내용을 확인하고..."
  await page.goBack();
  await settle(350);

  // ── [11] 알림 ────────────────────────────────────────────────────────────────
  await spaNav("/notifications");
  await narrate(12); // "수락 알림은 알림 탭에서 확인됩니다..."

  // ── [12] 채팅 ────────────────────────────────────────────────────────────────
  await spaNav("/chat");
  await page.locator('a[href^="/chat/"], button[class*="hover:bg-surface"]').first().click().catch(async () => {
    await spaNav("/chat/m2");
  });
  await page.waitForURL("**/chat/**");
  await settle(350);
  await narrate(13); // "매칭이 수락되면 채팅으로 바로 연결되어..."

  // ── [13] 모델 프로필 ─────────────────────────────────────────────────────────
  await spaNav("/profile");
  await settle(350);
  await page.evaluate(() => window.scrollBy({ top: 250, behavior: "smooth" }));
  await settle(400);
  await page.evaluate(() => window.scrollBy({ top: 200, behavior: "smooth" }));
  await settle(300);
  await narrate(14); // "프로필 탭에서는 신청 횟수, 수락된 매칭 통계..."

  // ── [14] 디자이너로 전환 ─────────────────────────────────────────────────────
  await narrate(15); // "이번에는 디자이너 시점으로 전환해 보겠습니다." — 전환 전 재생
  await page.evaluate(() => window.__demo.switchToDesigner());
  await spaNav("/matching/inbox");
  await settle(350);

  // ── [15] 디자이너 신청함 ─────────────────────────────────────────────────────
  await narrate(16); // "디자이너 신청함에 모델들의 매칭 요청이..." — inbox에서 클릭 전 재생

  // ── [16] 신청서 상세 (디자이너) + 수락 ──────────────────────────────────────
  await page.locator('button[class*="hover:bg-surface"], button.w-full').first().click().catch(async () => {
    await page.locator("button").filter({ hasText: /이수진|최예린|레이어드/ }).first().click();
  });
  await page.waitForURL("**/matching/**");
  await page.waitForLoadState("networkidle");
  await settle(400);
  await page.evaluate(() => window.scrollBy({ top: 150, behavior: "smooth" }));
  await settle(400);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await settle(300);
  await narrate(17); // "신청서를 열면 모델의 현재 헤어 상태가..." — 상세 화면
  await page.getByRole("button", { name: "수락", exact: true }).click();
  await settle(600);

  // ── [17] 공고 목록 ───────────────────────────────────────────────────────────
  await spaNav("/my-postings");
  await settle(350);
  await narrate(18); // "디자이너는 여러 개의 모집 공고를..." — 공고 목록 화면

  // ── [18] 새 공고 작성 ────────────────────────────────────────────────────────
  await page.locator("button").filter({ hasText: /새 공고/ }).first().click();
  await page.waitForURL("**/my-postings/new");
  await settle(350);
  await narrate(19); // "새 공고를 작성할 때는..." — 폼 입력 전 재생
  await page.locator('input[placeholder*="레이어드"], input[placeholder*="스타일"]').first().fill("볼륨 매직 펌 + 스타일링");
  await settle(500);
  await page.getByText("5만원").click();
  await settle(550);
  const newDateBtns = page.locator(".grid.grid-cols-4 button");
  await newDateBtns.nth(1).click();
  await settle(450);
  await newDateBtns.nth(2).click();
  await settle(450);
  await newDateBtns.nth(4).click();
  await settle(450);

  // ── [19] 스케줄 ──────────────────────────────────────────────────────────────
  await spaNav("/schedule");
  await settle(350);
  await page.evaluate(() => window.scrollBy({ top: 200, behavior: "smooth" }));
  await settle(400);
  await narrate(20); // "스케줄 탭에서는 수락된 매칭 일정을..."

  // ── [20] 디자이너 프로필 ─────────────────────────────────────────────────────
  await spaNav("/profile");
  await settle(350);
  await page.evaluate(() => window.scrollBy({ top: 280, behavior: "smooth" }));
  await settle(400);
  await page.evaluate(() => window.scrollBy({ top: 250, behavior: "smooth" }));
  await settle(400);
  await page.evaluate(() => window.scrollBy({ top: 200, behavior: "smooth" }));
  await settle(300);
  await narrate(21); // "디자이너 프로필에서는 총 매칭 수, 리뷰..."

  // ── [21] 서비스 데모 마무리 → 슬라이드로 전환 ───────────────────────────────
  await narrate(22); // "서비스 데모를 마치고, 이제 아키텍처와..."

  // ── 아키텍처 슬라이드 ────────────────────────────────────────────────────────

  // [22] 전체 아키텍처 (slide 0)
  await spaNav("/slides?n=0");
  await settle(350);
  await narrate(23); // "모핏은 Front-end, Back-end, Database 세 계층으로..."

  // [23] Frontend (slide 1)
  await spaNav("/slides?n=1");
  await settle(350);
  await narrate(24); // "Front-end는 React 19와 Vite를..."

  // [24] Backend & Infra (slide 2)
  await spaNav("/slides?n=2");
  await settle(350);
  await narrate(25); // "Back-end는 Node.js Express 서버에..."

  // [25] 모노레포 (slide 3)
  await spaNav("/slides?n=3");
  await settle(350);
  await narrate(26); // "Front-end, Back-end, 공유 타입 패키지를..."

  // ── AI 워크플로우 슬라이드 ───────────────────────────────────────────────────

  // [26] AI 개발 개요 (slide 4)
  await spaNav("/slides?n=4");
  await settle(350);
  await narrate(27); // "이 서비스는 Claude Code를 중심으로..."

  // [27] 문서 기반 컨텍스트 (slide 5)
  await spaNav("/slides?n=5");
  await settle(350);
  await narrate(28); // "먼저 PRD, SPEC, FSD, DESIGN 문서를..."

  // [28] GitHub Issue 기반 개발 (slide 6)
  await spaNav("/slides?n=6");
  await settle(350);
  await narrate(29); // "개발은 GitHub Issue 단위로..."

  // [29] 커스텀 스킬 (slide 7)
  await spaNav("/slides?n=7");
  await settle(350);
  await narrate(30); // "git-commit-grouper라는 커스텀 스킬을..."

  // [30] 아웃트로
  await settle(400);
  await narrate(31); // "이 워크플로우 덕분에 혼자 풀스택 서비스를..."
  await settle(1500);

  console.log("\n✅  데모 완료! 화면 녹화를 종료해주세요.\n");
  await browser.close();
}

runDemo().catch((err) => {
  console.error("\n❌  오류:", err.message);
  process.exit(1);
});
