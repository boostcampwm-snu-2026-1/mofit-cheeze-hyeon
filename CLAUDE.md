# mofit — Project Rules

## Design System

**모든 UI는 디자인 시스템 컴포넌트를 통해 만든다.**
새 페이지나 컴포넌트를 만들 때 raw `<div className="...">` 대신 `@ui`에서 가져온 컴포넌트를 우선 사용한다.

### Import 경로

```ts
import { Button, Card, Input, Badge, PageLayout, Avatar, BottomNav } from '@ui';
import { Display, Heading, Body, Caption } from '@ui';
```

`@ui` = `src/shared/ui/index.ts` (path alias, Vite + TypeScript 모두 설정됨)  
`@/` = `src/` 전체

### 사용 가능한 컴포넌트

| 컴포넌트 | 용도 |
|---|---|
| `PageLayout` | **모든 앱 페이지의 최상위 래퍼** — header/footer 슬롯, 크림 배경 |
| `BottomNav` | 모바일 하단 탭 네비게이션 — PageLayout의 footer에 주입 |
| `Button` | variant: `primary` \| `ghost` \| `cream` \| `pill`, size: `sm` \| `md` \| `lg` |
| `Card` + `CardHeader/Body/Footer` | radius: `compact`(8px) \| `card`(12px) \| `container`(16px) |
| `Input` | label, placeholder, hint, error, disabled |
| `Badge` | variant: `default` \| `muted` \| `outline` |
| `Avatar` | src?, name(이니셜 폴백), size: `sm` \| `md` \| `lg` \| `xl` |
| `EmptyState` | title, description?, action? — 리스트가 비었을 때 |
| `Divider` | 구분선, label? prop으로 텍스트 구분선 가능 |
| `Display`, `Heading`, `SubHeading` | 대형 헤드라인 — letter-spacing 자동 적용 |
| `CardTitle`, `BodyLarge`, `Body`, `Caption` | 본문 계층 |

### 새 페이지 기본 구조

모바일 Capacitor 앱 — 모든 앱 페이지는 모바일 퍼스트로 작성한다.

```tsx
import { PageLayout, BottomNav } from '@ui';
import { Heading } from '@ui';

export function SomePage() {
  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={<div className="px-5 py-4"><p className="font-sans font-semibold text-base text-charcoal">페이지 제목</p></div>}
      footer={<BottomNav />}
    >
      <div className="max-w-[430px] mx-auto px-5 pt-4 pb-6">
        {/* 내용 */}
      </div>
    </PageLayout>
  );
}
```

Auth 페이지(로그인/회원가입)는 BottomNav 없이 사용:
```tsx
<PageLayout fullWidth className="p-0 py-0">
  <div className="w-full max-w-sm mx-auto px-6 py-16">
    {/* 폼 내용 */}
  </div>
</PageLayout>
```

## 새 컴포넌트 규칙 ← 반드시 지킬 것

**페이지 작업 중 `@ui`에 없는 UI 패턴이 필요하면, 페이지에 인라인으로 작성하지 말고 반드시 디자인 시스템에 먼저 추가한다.**

### 절차

1. `src/shared/ui/ComponentName.tsx` 생성 — 디자인 토큰 사용, 재사용 가능하게
2. `src/shared/ui/index.ts`에 export 추가
3. 페이지에서 `import { ComponentName } from '@ui'` 로 사용
4. (선택) `/components` 페이지의 `COMPONENTS` 배열에 stories 추가

### 판단 기준 — 언제 @ui에 추가하나?

- 다른 페이지에서도 쓸 가능성이 있는 패턴 → **@ui에 추가**
- 특정 페이지에만 완전히 종속된 레이아웃 → 페이지 파일 내 지역 컴포넌트로 허용
- 예: `UserCard`, `MatchRequestItem`, `ChatBubble` → @ui 추가 대상
- 예: 특정 페이지의 hero 섹션 레이아웃 → 페이지 내 허용

## 색상 규칙

Tailwind 유틸리티로 디자인 토큰을 사용한다. 임의 hex 값 금지.

| 용도 | 클래스 |
|---|---|
| 페이지/카드 배경 | `bg-cream` |
| 주요 텍스트 | `text-charcoal` |
| 보조 텍스트 | `text-muted` |
| 기본 테두리 | `border-border` |
| 인터랙티브 테두리 | `border-border-interactive` |
| 다크 버튼 배경 | `bg-charcoal` |

**절대 금지**: `bg-white`, `text-black`, `border-gray-*`, 임의 `text-[#...]` / `bg-[#...]`

## 타이포그래피 규칙

- 폰트 굵기 최대 `font-semibold` (600) — `font-bold` 사용 금지
- 헤드라인은 Typography 컴포넌트 사용 (`<Heading>`, `<Display>` 등)
- 본문은 `<Body>` 또는 `font-sans text-base leading-normal`

## 컴포넌트 레퍼런스

개발 서버 실행 후 브라우저에서 확인:
- `/design-system` — 색상, 타이포그래피, 스페이싱 토큰
- `/components` — 컴포넌트 Playground + Stories (인터랙티브 props 조작 가능)

## 프로젝트 구조

```
packages/
  client/          # React 앱 (Vite + Tailwind + Capacitor)
    src/
      shared/ui/   # 디자인 시스템 컴포넌트 (@ui alias) ← 새 UI는 여기에
      pages/       # 페이지 컴포넌트
      router/      # React Router 설정
      store/       # Zustand 스토어
      lib/         # supabase, socket 클라이언트
  server/          # Express 서버
```

## 기술 스택

- React 19, TypeScript, Vite, Capacitor (iOS/Android)
- Tailwind CSS 3 (디자인 토큰은 `tailwind.config.js`에 정의)
- React Router v7, Zustand, Supabase, Socket.IO
