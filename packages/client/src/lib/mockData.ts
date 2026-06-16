// Shared pool of hair/beauty portfolio images (Unsplash)
const P = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=400&h=500&fit=crop&auto=format`;

const IMGS = {
  a: P("1522337360788-8b13dee7a37e"),
  b: P("1605497788044-5a32c7078486"),
  c: P("1560869713-7d0a29430803"),
  d: P("1519345182560-3f2917c472ef"),
  e: P("1531746020798-e6953c6e8e04"),
  f: P("1522337660859-02fbefca4702"),
  g: P("1582095133179-bfd08e2585d7"),
  h: P("1559599101-f09722fb4948"),
};

export interface MockReview {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  treatmentStyle: string;
}

export interface MockPortfolio {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
}

export interface MockDesigner {
  id: string;
  name: string;
  specialty: string;
  region: string;
  career: string;
  specialties: string[];
  bio: string;
  matchCount: number;
  rating: number;
  allowContentUsage: boolean;
  allowFaceExposure: boolean;
  portfolios: MockPortfolio[];
  reviews: MockReview[];
  /** 디자이너가 이번 모집에서 지정한 시술 스타일 (모델이 변경 불가) */
  recruitStyle: string;
  /** 디자이너가 미리 정한 제안 비용 (0 = 무료 협업) */
  proposedPrice: number;
  /** 디자이너가 제시하는 시술 가능 날짜 (모델은 이 중에서 선택) */
  availableSlots: string[];
}

export const MOCK_DESIGNERS: MockDesigner[] = [
  {
    id: "1",
    name: "김소연",
    specialty: "내추럴 커트",
    region: "서울",
    career: "3~5년",
    specialties: ["커트", "레이어드", "스타일링"],
    bio: "얼굴형에 맞는 레이어드 커트와 자연스러운 스타일링을 전문으로 합니다. 포트폴리오 촬영용 모델을 모집 중이며, 콘텐츠 활용에 동의해 주시는 분을 우선 매칭합니다.",
    matchCount: 24,
    rating: 4.9,
    allowContentUsage: true,
    allowFaceExposure: false,
    recruitStyle: "레이어드 커트 + 스타일링",
    proposedPrice: 0,
    availableSlots: ["2026-06-20", "2026-06-21", "2026-06-22", "2026-06-25"],
    portfolios: [
      {
        id: "p1",
        title: "봄 내추럴 레이어드",
        description: "자연스러운 레이어드 커트 시술 사례",
        imageUrls: [IMGS.a, IMGS.b, IMGS.d],
      },
      {
        id: "p2",
        title: "미디엄 레이어드",
        description: "어깨 길이 미디엄 레이어드",
        imageUrls: [IMGS.e, IMGS.f],
      },
    ],
    reviews: [
      {
        id: "r1",
        reviewer: "이수진",
        rating: 5,
        comment: "얼굴형에 딱 맞는 레이어드로 해주셔서 너무 자연스러워요. 재방문 의사 100%입니다!",
        treatmentStyle: "레이어드 커트 + 스타일링",
      },
      {
        id: "r2",
        reviewer: "박민정",
        rating: 5,
        comment: "처음 모델 경험이었는데 편안하게 진행해주셨어요. 결과물도 기대 이상이었고 사진도 잘 나왔어요.",
        treatmentStyle: "미디엄 레이어드",
      },
    ],
  },
  {
    id: "2",
    name: "이미래",
    specialty: "웨이브 · 볼륨 펌",
    region: "부산",
    career: "1~3년",
    specialties: ["펌", "웨이브", "볼륨매직"],
    bio: "자연스러운 웨이브 펌과 볼륨 세팅을 전문으로 합니다. 손상 최소화 시술로 고객 만족도 높은 결과물을 만들어드립니다.",
    matchCount: 18,
    rating: 4.7,
    allowContentUsage: true,
    allowFaceExposure: true,
    recruitStyle: "C컬 자연 웨이브 펌",
    proposedPrice: 30000,
    availableSlots: ["2026-06-18", "2026-06-19", "2026-06-24"],
    portfolios: [
      {
        id: "p3",
        title: "C컬 자연 웨이브",
        description: "부드러운 C컬 웨이브 펌",
        imageUrls: [IMGS.c, IMGS.g],
      },
    ],
    reviews: [],
  },
  {
    id: "3",
    name: "박지현",
    specialty: "염색 · 탈색",
    region: "서울",
    career: "5~10년",
    specialties: ["염색", "탈색", "클리닉"],
    bio: "5년 이상의 컬러 경력으로 다양한 톤 작업을 진행해왔습니다. 손상 모발 케어 전문 클리닉도 함께 진행합니다.",
    matchCount: 31,
    rating: 4.8,
    allowContentUsage: true,
    allowFaceExposure: true,
    recruitStyle: "애쉬 그레이 탈색",
    proposedPrice: 0,
    availableSlots: ["2026-06-15", "2026-06-16", "2026-06-23"],
    portfolios: [
      {
        id: "p4",
        title: "애쉬 그레이 탈색",
        description: "자연 모발 → 애쉬 그레이 탈염색",
        imageUrls: [IMGS.c, IMGS.h, IMGS.g],
      },
      {
        id: "p5",
        title: "내추럴 브라운 톤다운",
        description: "밝은 모발 → 내추럴 브라운",
        imageUrls: [IMGS.b, IMGS.e],
      },
    ],
    reviews: [
      {
        id: "r3",
        reviewer: "김예나",
        rating: 5,
        comment: "탈색 후 애쉬 그레이로 염색했는데 너무 예쁘게 나왔어요! 손상도 최소화해주셔서 감사해요.",
        treatmentStyle: "애쉬 그레이 탈색",
      },
      {
        id: "r4",
        reviewer: "윤지원",
        rating: 4,
        comment: "원하는 색감으로 잘 나왔어요. 전문적인 케어도 함께 해주셔서 좋았어요.",
        treatmentStyle: "내추럴 브라운 톤다운",
      },
    ],
  },
  {
    id: "4",
    name: "최다은",
    specialty: "데일리 스타일링",
    region: "인천",
    career: "1년 미만",
    specialties: ["스타일링", "커트"],
    bio: "데일리 스타일링과 간단한 커트를 주로 합니다. 처음 협업하는 분도 편하게 작업할 수 있도록 충분히 소통합니다.",
    matchCount: 12,
    rating: 4.5,
    allowContentUsage: false,
    allowFaceExposure: false,
    recruitStyle: "데일리 펌 스타일링",
    proposedPrice: 15000,
    availableSlots: ["2026-06-17", "2026-06-19"],
    portfolios: [],
    reviews: [],
  },
  {
    id: "5",
    name: "정하늘",
    specialty: "롱헤어 펌",
    region: "서울",
    career: "5~10년",
    specialties: ["펌", "매직", "볼륨매직"],
    bio: "롱헤어 전문 펌 디자이너입니다. 긴 머리를 아름답게 살리는 다양한 펌 기술을 보유하고 있습니다.",
    matchCount: 27,
    rating: 4.9,
    allowContentUsage: true,
    allowFaceExposure: false,
    recruitStyle: "롱 스파이럴 펌",
    proposedPrice: 50000,
    availableSlots: ["2026-06-21", "2026-06-22", "2026-06-28"],
    portfolios: [
      {
        id: "p6",
        title: "롱 스파이럴 펌",
        description: "롱헤어 스파이럴 볼륨 펌",
        imageUrls: [IMGS.f, IMGS.a, IMGS.d],
      },
    ],
    reviews: [
      {
        id: "r5",
        reviewer: "최서현",
        rating: 5,
        comment: "롱헤어 스파이럴 펌인데 탄력이 너무 예뻐요! 오래 유지될 것 같고 시술 내내 꼼꼼하게 설명해주셨어요.",
        treatmentStyle: "롱 스파이럴 펌",
      },
    ],
  },
  {
    id: "6",
    name: "한서윤",
    specialty: "톤다운 염색",
    region: "대구",
    career: "3~5년",
    specialties: ["염색", "두피케어"],
    bio: "자연스러운 톤다운 염색을 전문으로 합니다. 두피 케어와 함께 진행하여 건강한 헤어를 유지해드립니다.",
    matchCount: 9,
    rating: 4.6,
    allowContentUsage: true,
    allowFaceExposure: true,
    recruitStyle: "쿨톤 다운 염색 + 두피케어",
    proposedPrice: 0,
    availableSlots: ["2026-06-16", "2026-06-20", "2026-06-27"],
    portfolios: [
      {
        id: "p7",
        title: "쿨 애쉬 브라운",
        description: "웜톤 → 쿨 애쉬 브라운 톤 변환",
        imageUrls: [IMGS.g, IMGS.h],
      },
    ],
    reviews: [],
  },
];

export interface MockMatching {
  id: string;
  modelId: string;
  modelName: string;
  designerId: string;
  designerName: string;
  treatmentStyle: string;
  availableDates: string[];
  proposedPrice: number;
  allowContentUsage: boolean;
  allowFaceExposure: boolean;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  memo: string;
  hairLength?: string;
  hairCondition?: string;
  currentColor?: string;
}

export const DEFAULT_MOCK_MATCHINGS_MODEL: MockMatching[] = [
  {
    id: "m1",
    modelId: "mock-user-id",
    modelName: "홍길동",
    designerId: "3",
    designerName: "박지현",
    treatmentStyle: "애쉬 그레이 탈색",
    availableDates: ["2026-06-15", "2026-06-16"],
    proposedPrice: 0,
    allowContentUsage: true,
    allowFaceExposure: false,
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    memo: "자연 모발에서 처음 탈색 도전입니다. 경험이 없어서 조심스럽지만 잘 부탁드립니다.",
    hairLength: "미디엄",
    hairCondition: "건강",
    currentColor: "자연 흑발",
  },
  {
    id: "m2",
    modelId: "mock-user-id",
    modelName: "홍길동",
    designerId: "1",
    designerName: "김소연",
    treatmentStyle: "레이어드 커트",
    availableDates: ["2026-06-10"],
    proposedPrice: 0,
    allowContentUsage: true,
    allowFaceExposure: true,
    status: "accepted",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    memo: "",
    hairLength: "롱",
    hairCondition: "보통",
    currentColor: "갈색",
  },
];

export const DEFAULT_MOCK_MATCHINGS_DESIGNER: MockMatching[] = [
  {
    id: "d1",
    modelId: "user-a",
    modelName: "이수진",
    designerId: "mock-designer-id",
    designerName: "김소연",
    treatmentStyle: "레이어드 커트 + 스타일링",
    availableDates: ["2026-06-20", "2026-06-21", "2026-06-22"],
    proposedPrice: 0,
    allowContentUsage: true,
    allowFaceExposure: false,
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    memo: "어깨선 커트 원해요. 포트폴리오 촬영용이라 사진 퀄리티 중요합니다.",
    hairLength: "미디엄",
    hairCondition: "건강",
    currentColor: "자연 흑발",
  },
  {
    id: "d2",
    modelId: "user-b",
    modelName: "최예린",
    designerId: "mock-designer-id",
    designerName: "김소연",
    treatmentStyle: "내추럴 단발 커트",
    availableDates: ["2026-06-18"],
    proposedPrice: 0,
    allowContentUsage: false,
    allowFaceExposure: false,
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    memo: "처음 단발에 도전하는데 얼굴형에 맞게 잘 부탁드려요.",
    hairLength: "롱",
    hairCondition: "보통",
    currentColor: "갈색",
  },
  {
    id: "d3",
    modelId: "user-c",
    modelName: "강민서",
    designerId: "mock-designer-id",
    designerName: "김소연",
    treatmentStyle: "미디엄 레이어드",
    availableDates: ["2026-06-12"],
    proposedPrice: 0,
    allowContentUsage: true,
    allowFaceExposure: true,
    status: "accepted",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    memo: "",
    hairLength: "롱",
    hairCondition: "건강",
    currentColor: "자연 흑발",
  },
];
