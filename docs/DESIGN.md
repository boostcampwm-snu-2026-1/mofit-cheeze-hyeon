# Design System

## 1. Brand Philosophy

### Product Identity

모핏(MOFIT)은 헤어 모델과 헤어 디자이너를 연결하는 스타일 매칭 플랫폼이다.

사용자는 디자이너를 찾기 위해 방문하는 것이 아니라, **자신이 원하는 스타일을 발견하기 위해** 방문한다.

모핏은 **스타일 탐색 → 매칭 → 상담 → 예약 → 시술 → 리뷰** 까지의 경험을 연결한다.

---

### Emotional Goals

| 감정 | 맥락 |
|---|---|
| 설렘 | 새로운 스타일을 발견하는 순간 |
| 기대감 | 포트폴리오를 탐색하는 경험 |
| 신뢰 | 내 머리를 맡길 수 있다는 확신 |
| 만족감 | 스타일 변화가 성공적으로 이루어진 경험 |

---

### Design Principles

| 원칙 | 설명 |
|---|---|
| **Portfolio First** | 사용자는 디자이너보다 결과물을 먼저 본다 |
| **Trust Through Transparency** | 포트폴리오, 리뷰, 비용, 조건을 투명하게 노출한다 |
| **Airy Professionalism** | 가볍고 세련되지만 전문성을 잃지 않는다 |
| **Mobile Native** | 모든 경험은 모바일 중심으로 설계한다 |

---

## 2. Visual Theme & Atmosphere

| 인스피레이션 | 비주얼 키워드 |
|---|---|
| Airbnb | Airy |
| Apple | Premium |
| Pinterest | Clean |
| Instagram | Trustworthy |
| — | Modern |
| — | Transformative |

### Visual Direction

모핏은 따뜻한 크림톤보다 **밝고 공기감 있는 블루 계열**의 분위기를 사용한다.

전체 UI는 화이트 기반으로 구성하며, 브랜드 경험은 **Soft Blue Gradient**를 통해 표현한다.

### Atmosphere Principles

| 원칙 | 설명 |
|---|---|
| **Soft Blue Atmosphere** | 서비스 전반에 은은한 블루 톤을 활용한다 |
| **Floating Shapes** | 큰 원형 오브젝트와 블러 효과를 적극 활용한다 |
| **Glass Layers** | 반투명 레이어와 부드러운 그라데이션을 활용한다 |
| **Minimal Surface** | 카드는 단순하고 깨끗하게 유지한다 |

---

## 3. Color Palette

| 이름 | 역할 | HEX | 용도 |
|---|---|---|---|
| Soft Blue | Primary | `#4D8DFF` | 주요 CTA, 예약하기, 매칭 신청, 링크, 활성 상태 |
| — | Primary Hover | `#3B7EF5` | Primary 버튼·요소 호버 상태 |
| Soft Blue Light | Primary Light | `#8AB8FF` | 배경 요소, 그라데이션, Hero 영역 |
| Soft Coral | Accent | `#FF8E7E` | 추천 태그, 신규 배지, 이벤트, 하이라이트 |
| Soft Blue Gray | Background | `#F3F8FF` | 전체 앱 배경 |
| White | Surface | `#F8F9FA` | 카드, 모달, 입력창 |
| — | Border | `#E4EDF9` | 구분선, 카드·입력창 테두리 |
| — | Text Primary | `#172033` | 주요 본문 텍스트 |
| — | Text Secondary | `#6B7280` | 보조·설명 텍스트 |
| — | Success | `#22C55E` | 성공 상태 |
| — | Warning | `#F59E0B` | 경고 상태 |
| — | Error | `#EF4444` | 오류 상태 |

---

## 4. Gradient System

| 이름 | CSS | 용도 |
|---|---|---|
| Primary | `linear-gradient(135deg, #4D8DFF, #8AB8FF)` | Hero, CTA, 강조 카드 |
| Light | `linear-gradient(135deg, #F8F9FA, #EAF3FF)` | 배경, 카드 |
| Accent | `linear-gradient(135deg, #4D8DFF, #FFB7A8)` | 이벤트, 프로모션 |

---

## 5. Typography

**Font Family** — `Pretendard` / Fallback: `system-ui, sans-serif`

| Role | Size | Weight |
|---|---|---|
| Hero | 36px | 700 |
| H1 | 28px | 700 |
| H2 | 24px | 700 |
| H3 | 20px | 600 |
| Body Large | 18px | 500 |
| Body | 16px | 400 |
| Caption | 14px | 400 |
| Small | 12px | 400 |

---

## 6. Component System

| 컴포넌트 | 배경 | 텍스트 | 테두리 | Radius | 기타 |
|---|---|---|---|---|---|
| Primary Button | `#4D8DFF` | `#F8F9FA` | — | `14px` | — |
| Secondary Button | `#F8F9FA` | — | `1px solid #E4EDF9` | — | — |
| Tag | `#FFF3F0` | `#FF8E7E` | — | `999px` | — |
| Card | `#F8F9FA` | — | `1px solid #E4EDF9` | `20px` | — |

---

## 7. Portfolio Experience

### 탐색 우선순위

| 순위 | 요소 |
|---|---|
| 1 | 결과 이미지 |
| 2 | Before / After |
| 3 | 스타일명 |
| 4 | 디자이너 |
| 5 | 비용 |
| 6 | 리뷰 |

### Layout & Hero

Pinterest + Instagram 구조. 이미지가 가장 중요하다.

Hero 영역은 **대형 이미지 + Soft Gradient + 블러 오브젝트** 조합을 사용한다.

---

## 8. Layout Principles

**Base Unit** — `8px`

**Container** — `max-width: 768px` (Mobile First)

**Safe Area** — `padding-left: 20px` / `padding-right: 20px`

**Section Gap** — `40px` / **Card Gap** — `16px`

---

## 9. Elevation

| 레벨 | 용도 | Shadow |
|---|---|---|
| Level 0 | 배경 | 없음 |
| Level 1 | Card | `0 8px 24px rgba(77,141,255,0.08)` |
| Level 2 | Hover | `0 16px 40px rgba(77,141,255,0.12)` |
| Level 3 | Modal | `0 24px 64px rgba(77,141,255,0.18)` |

---

## 10. Motion

| 속도 | Duration | 용도 |
|---|---|---|
| Fast | `150ms` | 즉각 반응이 필요한 전환 |
| Normal | `250ms` | 일반적인 상태 변화 |
| Slow | `350ms` | 페이지·모달 진입 |

**Animation Style** — Smooth · Premium · Natural

---

## 11. Do's & Don'ts

| Do | Don't |
|---|---|
| 공기감 있는 블루 톤 사용 | 핑크 위주의 UI |
| 부드러운 그라데이션 활용 | 과도한 색상 사용 |
| 큰 곡선 오브젝트 활용 | 강한 그림자 |
| 포트폴리오 이미지 우선 노출 | 복잡한 정보 밀집 |
| 충분한 여백 확보 | 쇼핑몰 스타일 배너 |

---

## 12. Agent Prompt Guide

> 모핏은 헤어 포트폴리오 기반 매칭 플랫폼이다.
> Apple, Airbnb, Pinterest의 미니멀한 감성을 참고한다.
>
> - Primary Color: Soft Blue `#4D8DFF`
> - Accent Color: Soft Coral `#FF8E7E`
> - Background: Soft Blue Gray `#F3F8FF`
> - 비주얼 키워드: Airy · Premium · Trustworthy · Modern
> - 대형 블러 오브젝트와 Soft Gradient를 적극 활용한다
