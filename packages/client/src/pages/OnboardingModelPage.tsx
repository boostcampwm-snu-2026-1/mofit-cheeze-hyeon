import { useState } from "react";
import { useVtNavigate } from "@ui";
import { PageLayout, Button, Body, TagSelector, Switch } from "@ui";
import { useAuthStore } from "../store/auth";

const STYLE_OPTIONS = [
  "내추럴",
  "웨이브",
  "레이어드",
  "단발",
  "긴머리",
  "뱅헤어",
  "염색",
  "탈색",
  "펌",
  "매직",
  "두피케어",
  "볼륨매직",
];

const AGE_GROUPS = ["10대", "20대 초반", "20대 후반", "30대", "40대 이상"];

const GENDERS = [
  { value: "female", label: "여성" },
  { value: "male", label: "남성" },
  { value: "other", label: "기타" },
] as const;

export function OnboardingModelPage() {
  const navigate = useVtNavigate();
  const { user, setModelProfile } = useAuthStore();

  const [gender, setGender] = useState<"female" | "male" | "other" | "">(
    ""
  );
  const [ageGroup, setAgeGroup] = useState("");
  const [preferredStyles, setPreferredStyles] = useState<string[]>([]);
  const [hasTreatmentExperience, setHasTreatmentExperience] = useState(false);
  const [bio, setBio] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setModelProfile({
      userId: user.id,
      gender: gender || undefined,
      ageGroup: ageGroup || undefined,
      preferredStyles,
      hasTreatmentExperience,
      bio: bio || undefined,
    });

    navigate("/discover", { replace: true });
  }

  return (
    <PageLayout fullWidth className="p-0 py-0">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-auto px-6 py-12 flex flex-col"
      >
        <div className="mb-8">
          <p className="font-sans text-sm text-muted mb-1">기본 정보 입력</p>
          <p className="font-sans font-semibold text-[1.5rem] leading-tight tracking-[-0.5px] text-charcoal">
            모델 프로필을 완성해요
          </p>
        </div>

        <div className="flex flex-col gap-7">
          <div>
            <p className="font-sans text-sm font-medium text-charcoal mb-3">
              성별
            </p>
            <div className="flex gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGender(g.value)}
                  className={[
                    "flex-1 py-2.5 rounded-card border font-sans text-sm transition-colors",
                    gender === g.value
                      ? "border-charcoal bg-charcoal text-offwhite"
                      : "border-border text-muted hover:border-border-interactive hover:text-charcoal",
                  ].join(" ")}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-sans text-sm font-medium text-charcoal mb-3">
              연령대
            </p>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map((ag) => (
                <button
                  key={ag}
                  type="button"
                  onClick={() => setAgeGroup(ag === ageGroup ? "" : ag)}
                  className={[
                    "px-4 py-2 rounded-pill border font-sans text-sm transition-colors",
                    ageGroup === ag
                      ? "border-charcoal bg-charcoal text-offwhite"
                      : "border-border text-muted hover:border-border-interactive hover:text-charcoal",
                  ].join(" ")}
                >
                  {ag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-sans text-sm font-medium text-charcoal mb-1">
              선호 스타일
            </p>
            <Body className="text-muted mb-3">최대 5개 선택</Body>
            <TagSelector
              options={STYLE_OPTIONS}
              value={preferredStyles}
              onChange={setPreferredStyles}
              max={5}
            />
          </div>

          <div className="border-t border-border pt-5">
            <Switch
              checked={hasTreatmentExperience}
              onChange={setHasTreatmentExperience}
              label="시술 경험 있음"
              description="이전에 헤어 시술을 받아본 적이 있어요"
            />
          </div>

          <div>
            <p className="font-sans text-sm font-medium text-charcoal mb-2">
              자기소개 <span className="text-muted font-normal">(선택)</span>
            </p>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="디자이너에게 하고 싶은 스타일이나 주의사항을 알려주세요"
              rows={3}
              className="w-full rounded-card border border-border bg-cream font-sans text-sm text-charcoal placeholder:text-muted px-3 py-2.5 resize-none focus:outline-none focus:border-border-interactive transition-colors"
            />
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full mt-8"
        >
          완료
        </Button>

        <button
          type="button"
          onClick={() => navigate("/discover", { replace: true })}
          className="mt-3 text-center font-sans text-sm text-muted hover:text-charcoal transition-colors"
        >
          나중에 하기
        </button>
      </form>
    </PageLayout>
  );
}
