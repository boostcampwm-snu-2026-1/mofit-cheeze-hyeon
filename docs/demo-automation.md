# Playwright로 발표 데모 영상 자동화하기

이번 프로젝트([모핏](https://mofit-cheeze-hyeon-client.vercel.app/) — 헤어 모델·디자이너 매칭 플랫폼)에서는 Playwright로 브라우저를 자동 제어하고, macOS의 `say` 명령어로 나레이션을 동기화하는 방식으로 데모 영상을 완전 자동화했다. AI로 만드는 프로젝트인 만큼, 발표 영상 역시 AI를 활용해 제작하고 싶었다.

---

## 전체 구조

```
node demo/create-demo.mjs
  └─ Playwright가 Chromium 브라우저 실행
       ├─ 페이지 이동 (nav / spaNav)
       ├─ 클릭·스크롤 인터랙션
       └─ narrate(n) → macOS say 명령 (blocking)
```

스크립트를 실행하는 동안 QuickTime으로 화면 녹화를 켜두면 된다. 나레이션과 화면이 자동으로 맞춰지므로, 별도 편집 없이 발표 영상을 바로 얻을 수 있다.

---

## 핵심 구현 1 — macOS `say`로 나레이션 동기화

```js
import { spawnSync } from "child_process";

const VOICE = "Jian (Premium)";
const SPEECH_RATE = 200;

const narrate = async (idx) => {
  const text = SEGMENTS[idx];
  spawnSync("say", ["-v", VOICE, "-r", String(SPEECH_RATE), text]);
  await page.waitForTimeout(400);
};
```

핵심은 `spawnSync`를 쓴 것이다. `spawn`(비동기)을 사용하면 말이 끝나기 전에 다음 인터랙션이 시작되어 화면과 나레이션이 어긋난다. `spawnSync`는 `say` 프로세스가 종료될 때까지 블로킹되므로, 별도 타이밍 조정 없이 자연스럽게 동기화된다.

`--fast` 플래그를 넘기면 `say`를 건너뛰고 최소 대기만 두어 빠르게 디버깅할 수 있다.

```js
const FAST = process.argv.includes("--fast");

if (!FAST) spawnSync("say", ["-v", VOICE, "-r", String(SPEECH_RATE), text]);
```

---

## 핵심 구현 2 — SPA 내비게이션으로 Zustand 상태 유지

서비스는 React SPA다. `page.goto(url)`로 전체 페이지를 새로 로드하면 Zustand에 저장된 로그인 상태가 초기화된다. "모델로 로그인"된 상태에서 디자이너 시점으로 전환하거나 여러 페이지를 오갈 때 문제가 생긴다.

해결책은 앱 내부의 `navigate` 함수를 개발 환경에서 `window`에 노출하는 것이다.

```ts
// main.tsx (개발 환경 전용)
function DevNavigationExposer() {
  const navigate = useNavigate();
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__demo = {
        ...window.__demo,
        navigate: (path) => {
          if ("startViewTransition" in document) {
            document.startViewTransition(() => navigate(path));
          } else {
            navigate(path);
          }
        },
      };
    }
  }, [navigate]);
  return null;
}
```

스크립트에서는 `page.evaluate()`로 이 함수를 호출한다.

```js
const spaNav = async (path) => {
  await page.evaluate((p) => window.__demo.navigate(p), path);
  await page.waitForURL(`**${path.split("?")[0]}`);
  await settle(300);
};

// 역할 전환 (Zustand 상태 유지)
await page.evaluate(() => window.__demo.switchToDesigner());
await spaNav("/matching/inbox");
```

`nav()`(전체 로드)와 `spaNav()`(SPA 이동)를 용도에 맞게 구분해 쓴다. 역할 전환이나 탭 이동은 `spaNav`, 초기 진입만 `nav`를 사용한다.

---

## 핵심 구현 3 — 커스텀 마우스 커서 오버레이

기본 OS 커서는 화면 녹화에서 잘 보이지 않을 수 있다. `addInitScript`로 모든 페이지 이동 후 자동으로 파란 원형 커서 오버레이를 주입한다.

```js
await page.addInitScript(() => {
  const init = () => {
    const el = document.createElement("div");
    el.id = "__cursor__";
    Object.assign(el.style, {
      position: "fixed",
      width: "18px", height: "18px",
      background: "rgba(77,141,255,0.85)",
      border: "2.5px solid #fff",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "2147483647",
      transform: "translate(-50%,-50%)",
      transition: "left 0.04s, top 0.04s",
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
```

서비스 Primary 컬러(`#4D8DFF`)와 동일한 색상을 사용해 브랜드 일관성도 맞췄다.

---

## 핵심 구현 4 — `viewport: null`로 앱 배경 꽉 채우기

Playwright 기본 설정에서 viewport를 지정하면, 창 내부에 그 크기로 렌더링되고 남는 공간은 회색 여백으로 채워진다. 모바일 앱처럼 보이려면 여백 없이 배경이 꽉 찬 형태여야 한다.

```js
const browser = await chromium.launch({
  headless: false,
  slowMo: 40,
  args: ["--window-size=430,900", "--window-position=300,30"],
});

const context = await browser.newContext({
  viewport: null, // Chrome이 결정한 실제 창 크기로 렌더링
  locale: "ko-KR",
});
```

`viewport: null`을 설정하면 `--window-size`로 지정한 창 크기 그대로 렌더링되어 회색 여백이 사라진다.

---

## 가장 삽질했던 부분 — narrate() 인덱스 off-by-one

나레이션 세그먼트 배열은 0-indexed지만, 코드 내 주석은 `[0-A]`, `[0-B]`, `[1]`, `[2]`... 형식의 표시 레이블을 붙였다.

```js
const SEGMENTS = [
  // [0-A] 자기소개        → 인덱스 0
  "안녕하세요...",
  // [0-B] 서비스 소개     → 인덱스 1
  "제가 개발한 서비스는...",
  // [1] 역할 선택          → 인덱스 2  ← 여기서 레이블과 인덱스가 어긋나기 시작
  "서비스는 헤어 모델과...",
  // [2] 필터 + 탐색        → 인덱스 3
  ...
];
```

`[0-A]`와 `[0-B]`가 레이블 0을 공유하기 때문에, 레이블 `[1]`부터 실제 배열 인덱스와 1씩 차이가 난다. 초반에 이를 인지하지 못한 채 레이블 번호를 그대로 `narrate(N)`에 넣었더니, 화면과 나레이션이 전부 한 박자씩 밀렸다.

```js
// 잘못된 코드 (레이블 기준)
await narrate(1);  // [1] 역할 선택 → 실제로는 [0-B] 서비스 소개가 재생됨
await page.getByText("헤어 모델로 체험").click();
await narrate(2);  // [2] 필터 → 실제로는 [1] 역할 선택이 재생됨

// 수정된 코드 (실제 배열 인덱스)
await narrate(2);  // 인덱스 2 = [1] 역할 선택
await page.getByText("헤어 모델로 체험").click();
await narrate(3);  // 인덱스 3 = [2] 필터 + 탐색
```

구간 [1]부터 끝까지 모든 `narrate()` 호출을 +1씩 수정해야 했다. 레이블 체계를 처음부터 1:1 매핑으로 설계했어야 했다.

---

## CSS View Transitions로 앱처럼 보이게

화면 전환이 끊기면 데모 영상 퀄리티가 떨어진다. CSS View Transitions API로 슬라이드 애니메이션을 추가했다.

```css
@keyframes vt-slide-in {
  from { opacity: 0; transform: translateX(24px); }
}
@keyframes vt-fade-out {
  to { opacity: 0; transform: translateX(-8px); }
}
::view-transition-old(root) {
  animation: 180ms ease-in vt-fade-out both;
}
::view-transition-new(root) {
  animation: 280ms cubic-bezier(0.22, 1, 0.36, 1) vt-slide-in both;
}
```

React Router v7의 `<BrowserRouter>`에서는 `viewTransition` prop이 동작하지 않는다(data router 전용). 대신 `navigate()`를 `document.startViewTransition()`으로 직접 감싸는 `useVtNavigate` 훅을 만들어 전체 앱에 적용했다.

```ts
export function useVtNavigate() {
  const navigate = useNavigate();
  return (to, options) => {
    if ("startViewTransition" in document) {
      document.startViewTransition(() => navigate(to, options));
    } else {
      navigate(to, options);
    }
  };
}
```

---

## 실행 방법

```bash
# 1. 개발 서버 실행 (목업 데이터 활성화)
VITE_USE_MOCK=true pnpm dev

# 2. Playwright 브라우저 설치 (최초 1회)
npx playwright install chromium

# 3. QuickTime 화면 녹화 시작 후 실행
node demo/create-demo.mjs

# 빠른 디버깅 (나레이션 생략)
node demo/create-demo.mjs --fast
```

---

## 마치며

Playwright는 보통 E2E 테스트 도구로 쓰이지만, 발표 데모 자동화에도 잘 맞는다. 브라우저 제어, 인터랙션, 타이밍 조정을 전부 코드로 관리할 수 있어, 어떤 상황에서도 동일한 결과물을 재현할 수 있다는 점이 가장 큰 장점이다.

특히 `spawnSync`로 나레이션을 블로킹하는 패턴은 별도 타이밍 로직 없이 "말이 끝나면 다음 단계"라는 자연스러운 흐름을 만들어준다. 비슷한 발표를 준비한다면 한번 시도해 볼 만한 접근이다.
