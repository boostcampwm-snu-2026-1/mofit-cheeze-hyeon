# 모핏 기술 스택 문서

## 개요

헤어 모델 ↔ 헤어 디자이너 매칭 플랫폼 **모핏**의 기술 스택 및 선택 근거를 정리한 문서입니다.

---

## 전체 아키텍처

```
📱 Frontend (React + Vite + Capacitor)
         ↕ REST API + WebSocket
🖥️ Backend (Node.js + Express + Socket.io)
         ↕
🗄️ Database (Supabase / PostgreSQL + Auth)
🖼️ Storage (Cloudflare R2)
🔔 Push 알림 (Firebase Cloud Messaging)
📦 모노레포 (Turborepo)
```

---

## 스택 상세

### 📱 Frontend

| 항목 | 선택 | 선택 근거 |
|------|------|-----------|
| UI 프레임워크 | React | 생태계, 팀 친숙도 |
| 빌드 툴 | Vite | 빠른 개발 환경, 경량 번들 |
| 앱 래핑 | Capacitor | 웹 코드베이스로 iOS/Android 동시 배포 |
| 스타일링 | TailwindCSS | 빠른 UI 개발 |
| 라우팅 | React Router | SPA 라우팅 |
| 상태관리 | Zustand | 가볍고 단순한 전역 상태 관리 |

**Next.js를 선택하지 않은 이유**
- 서비스 특성상 SEO 불필요 (로그인 후 사용하는 앱)
- Capacitor는 정적 파일만 번들링 → Next.js SSR 활용 불가
- Vite가 개발 경험 및 빌드 속도에서 유리

---

### 🖥️ Backend

| 항목 | 선택 | 선택 근거 |
|------|------|-----------|
| 런타임 | Node.js | 프론트와 언어 통일 (TypeScript) |
| 프레임워크 | Express | 경량, 유연한 미들웨어 구성 |
| 실시간 채팅 | Socket.io | WebSocket 기반 1:1 채팅 구현 |
| 이미지 처리 | sharp | 업로드 시 리사이징 및 WebP 변환 |

---

### 🗄️ Database

| 항목 | 선택 | 선택 근거 |
|------|------|-----------|
| DB | Supabase (PostgreSQL) | 관리형 PostgreSQL, 빠른 셋업 |
| Auth | Supabase Auth | 회원가입/로그인/토큰 관리 제공, 표준 JWT 사용 |

**Supabase Auth 마이그레이션 전략**

Supabase Auth는 표준 JWT를 발급하므로 향후 자체 Auth로 전환 시 토큰 검증 로직 한 줄만 교체하면 됨.
비즈니스 데이터는 `auth.users`가 아닌 `public.users`에 저장하여 Auth 의존도 최소화.

```sql
-- auth.users와 연결만 하고 비즈니스 데이터는 분리
CREATE TABLE public.users (
  id   UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('model', 'designer')),
  name TEXT,
  ...
);
```

---

### 🖼️ Storage

| 단계 | 선택 | 선택 근거 |
|------|------|-----------|
| MVP | Supabase Storage | 별도 설정 없이 바로 사용, 무료 1GB (디자이너 ~200명 수용) |
| 성장기 이후 | Cloudflare R2 | egress 무료, 10GB 영구 무료, CDN 기본 포함 |

**MVP → R2 이전 전략**

업로드 로직을 함수로 분리해두어 이전 시 해당 함수만 교체.

```javascript
// utils/storage.ts — 이 함수 내부만 교체하면 됨
export async function uploadImage(file, path) {
  return await supabase.storage.from('images').upload(path, file)
}
```

R2는 S3 호환 API를 사용하므로 데이터 마이그레이션 스크립트도 단순함.

```javascript
// 마이그레이션 스크립트 (이전 시 1회 실행)
for (const file of files) {
  const { data } = await supabase.storage.from('images').download(file.name)
  await s3Client.send(new PutObjectCommand({ Bucket: 'mofit', Key: file.name, Body: data }))
}
```

**이미지 최적화 전략**

포트폴리오/채팅 이미지 업로드 시 sharp로 사전 처리 후 저장.

```
원본 → 그대로 보관 (거의 미사용)
중간 (800px, WebP) → 피드/프로필 표시용
썸네일 (200px, WebP) → 목록 표시용
```

**폴더 구조 및 파일명 규칙**

```
images/
├── avatars/
│   └── {userId}.webp                                    # 프로필 사진 (덮어쓰기로 업데이트)
├── portfolios/
│   └── {designerId}/
│       └── {portfolioId}/                               # 포트폴리오 단위 폴더
│           ├── {imageId}_thumb.webp                     # 썸네일
│           └── {imageId}_md.webp                        # 중간 크기
└── chats/
    └── {roomId}/
        └── {messageId}.webp                             # 채팅 첨부 사진
```

파일명은 UUID 기반으로 생성. 한글/공백/순서 번호 사용 금지.

```javascript
// ✅ 올바른 예
`portfolios/${designerId}/${portfolioId}/${imageId}_md.webp`

// ❌ 잘못된 예
`portfolios/홍길동/염색사진.jpg`   // 한글, 공백 문제
`portfolios/123/1_md.webp`        // 순서를 파일명에 포함 → rename 불가
```

**파일명에 순서를 넣지 않는 이유**

스토리지(S3, R2, Supabase)는 rename 기능이 없음. 이름 변경 = 복사 + 삭제로 비용/속도 낭비 발생.
사진 순서는 DB의 `order_index` 컬럼으로 관리하여 스토리지를 건드리지 않고 업데이트.

**DB 구조**

```sql
-- 포트폴리오 (시술 단위)
CREATE TABLE portfolios (
  id          UUID PRIMARY KEY,
  designer_id UUID REFERENCES public.users(id),
  title       TEXT,
  description TEXT,
  created_at  TIMESTAMPTZ
);

-- 포트폴리오 이미지 (여러 장)
CREATE TABLE portfolio_images (
  id           UUID PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id),
  storage_key  TEXT,    -- 'portfolios/did/pid/iid_md.webp' 경로만 저장
  order_index  INT,     -- 사진 순서 (스토리지 건드리지 않고 DB만 업데이트)
  created_at   TIMESTAMPTZ
);
```

실제 URL은 DB에 저장하지 않고 경로로 조합하여 스토리지 이전 시 환경변수만 교체.

```javascript
const url = `${STORAGE_BASE_URL}/${image.storage_key}`
```

---

### 🔔 Push 알림

| 항목 | 선택 | 선택 근거 |
|------|------|-----------|
| 푸시 서비스 | Firebase Cloud Messaging (FCM) | Capacitor Push 플러그인과 표준 조합 |

**적용 이벤트** (FSD 7.1 기준)
- 매칭 신청 / 수락 / 거절
- 채팅 메시지 수신
- 예약 확정 / 변경 / 취소
- 리뷰 작성 요청

---

### 📦 모노레포

| 항목 | 선택 | 선택 근거 |
|------|------|-----------|
| 모노레포 툴 | Turborepo | 의존성 순서 자동 파악, 빌드 캐싱, 루트에서 일괄 실행 |
| 패키지 매니저 | pnpm | 빠른 설치, 디스크 효율 |

**레포 구조**

```
mofit/
├── packages/
│   ├── client/          # React + Vite + Capacitor
│   │   ├── src/
│   │   ├── ios/
│   │   └── android/
│   ├── server/          # Node.js + Express + Socket.io
│   └── shared/          # 공통 타입 (TypeScript)
│       └── types/
│           ├── user.ts
│           ├── matching.ts
│           └── chat.ts
├── docs/
│   ├── FSD.md
│   ├── PRD.md
│   └── TECH_STACK.md
├── package.json
└── turbo.json
```

---

## 기능-기술 매핑

| FSD 기능 | 담당 기술 |
|----------|-----------|
| 회원가입 / 로그인 (6) | Supabase Auth |
| 프로필 / 포트폴리오 (1) | PostgreSQL + Cloudflare R2 |
| 매칭 신청 / 수락 / 거절 (2) | REST API + PostgreSQL |
| 1:1 채팅 (3.1) | Socket.io + PostgreSQL |
| 캘린더 연동 (3.1.4 ~ 3.1.5) | Capacitor Calendar 플러그인 |
| 예약 관리 (4) | REST API + PostgreSQL |
| 리뷰 / 평점 (5) | REST API + PostgreSQL |
| 푸시 알림 (7) | FCM + Capacitor Push 플러그인 |
| 신고 / 차단 (8) | REST API + PostgreSQL |
