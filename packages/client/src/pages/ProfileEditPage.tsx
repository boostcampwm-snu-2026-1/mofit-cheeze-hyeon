import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageLayout,
  Input,
  Button,
  Body,
  TagSelector,
  Switch,
} from "@ui";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/auth";

const STYLE_OPTIONS = [
  "내추럴", "웨이브", "레이어드", "단발", "긴머리", "뱅헤어",
  "염색", "탈색", "펌", "매직", "두피케어", "볼륨매직",
];
const SPECIALTY_OPTIONS = [
  "커트", "염색", "탈색", "펌", "매직", "볼륨매직",
  "두피케어", "클리닉", "웨이브", "스타일링",
];
const AGE_GROUPS = ["10대", "20대 초반", "20대 후반", "30대", "40대 이상"];
const GENDERS = [
  { value: "female", label: "여성" },
  { value: "male", label: "남성" },
  { value: "other", label: "기타" },
] as const;
const REGIONS = [
  "서울 강남", "서울 강북", "서울 마포·홍대", "서울 신촌·이대",
  "서울 강동", "서울 강서", "서울 종로·중구",
  "경기 성남", "경기 수원", "경기 고양",
  "인천", "부산", "대구", "대전", "광주", "제주", "기타",
];
const CAREER_OPTIONS = ["1년 미만", "1~3년", "3~5년", "5~10년", "10년 이상"];

export function ProfileEditPage() {
  const navigate = useNavigate();
  const { user, modelProfile, designerProfile, setModelProfile, setDesignerProfile } =
    useAuthStore();

  const isModel = user?.role === "model";

  // Model fields
  const [gender, setGender] = useState<"female" | "male" | "other" | "">(
    (modelProfile?.gender as "female" | "male" | "other" | "") ?? ""
  );
  const [ageGroup, setAgeGroup] = useState(modelProfile?.ageGroup ?? "");
  const [preferredStyles, setPreferredStyles] = useState<string[]>(
    modelProfile?.preferredStyles ?? []
  );
  const [hasTreatmentExperience, setHasTreatmentExperience] = useState(
    modelProfile?.hasTreatmentExperience ?? false
  );

  // Designer fields
  const [salonName, setSalonName] = useState(
    designerProfile?.salonName ?? ""
  );
  const [region, setRegion] = useState(designerProfile?.region ?? "");
  const [career, setCareer] = useState(designerProfile?.career ?? "");
  const [specialties, setSpecialties] = useState<string[]>(
    designerProfile?.specialties ?? []
  );
  const [allowContentUsage, setAllowContentUsage] = useState(
    designerProfile?.allowContentUsage ?? false
  );
  const [allowFaceExposure, setAllowFaceExposure] = useState(
    designerProfile?.allowFaceExposure ?? false
  );

  // Common
  const [bio, setBio] = useState(
    (isModel ? modelProfile?.bio : designerProfile?.bio) ?? ""
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (isModel) {
      const { error: dbError } = await supabase.from("model_profiles").upsert({
        user_id: user!.id,
        gender: gender || null,
        age_group: ageGroup || null,
        preferred_styles: preferredStyles,
        has_treatment_experience: hasTreatmentExperience,
        bio: bio || null,
      });
      if (dbError) {
        setError("저장 중 오류가 발생했습니다.");
        setSubmitting(false);
        return;
      }
      setModelProfile({
        userId: user!.id,
        gender: (gender as "female" | "male" | "other") || undefined,
        ageGroup: ageGroup || undefined,
        preferredStyles,
        hasTreatmentExperience,
        bio: bio || undefined,
      });
    } else {
      if (!region || !career) {
        setError("지역과 경력을 선택해주세요.");
        setSubmitting(false);
        return;
      }
      const { error: dbError } = await supabase
        .from("designer_profiles")
        .upsert({
          user_id: user!.id,
          salon_name: salonName || null,
          region,
          career,
          specialties,
          allow_content_usage: allowContentUsage,
          allow_face_exposure: allowFaceExposure,
          bio: bio || null,
        });
      if (dbError) {
        setError("저장 중 오류가 발생했습니다.");
        setSubmitting(false);
        return;
      }
      setDesignerProfile({
        userId: user!.id,
        salonName: salonName || undefined,
        region,
        career,
        specialties,
        allowContentUsage,
        allowFaceExposure,
        bio: bio || undefined,
      });
    }

    navigate("/profile", { replace: true });
  }

  return (
    <PageLayout fullWidth className="p-0 py-0">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[430px] mx-auto px-5 py-6 flex flex-col"
      >
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="font-sans text-sm text-muted hover:text-charcoal transition-colors"
          >
            ← 뒤로
          </button>
          <p className="font-sans font-semibold text-base text-charcoal">
            프로필 편집
          </p>
        </div>

        <div className="flex flex-col gap-7">
          {isModel ? (
            <>
              <div>
                <p className="font-sans text-sm font-medium text-charcoal mb-3">성별</p>
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
                <p className="font-sans text-sm font-medium text-charcoal mb-3">연령대</p>
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
                <p className="font-sans text-sm font-medium text-charcoal mb-1">선호 스타일</p>
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
            </>
          ) : (
            <>
              <Input
                label="소속 살롱"
                placeholder="살롱 이름 (선택)"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
              />

              <div>
                <p className="font-sans text-sm font-medium text-charcoal mb-3">
                  활동 지역 <span className="text-red-400">*</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRegion(r === region ? "" : r)}
                      className={[
                        "px-3 py-1.5 rounded-pill border font-sans text-sm transition-colors",
                        region === r
                          ? "border-charcoal bg-charcoal text-offwhite"
                          : "border-border text-muted hover:border-border-interactive hover:text-charcoal",
                      ].join(" ")}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-sans text-sm font-medium text-charcoal mb-3">
                  경력 <span className="text-red-400">*</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {CAREER_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCareer(c === career ? "" : c)}
                      className={[
                        "px-4 py-2 rounded-pill border font-sans text-sm transition-colors",
                        career === c
                          ? "border-charcoal bg-charcoal text-offwhite"
                          : "border-border text-muted hover:border-border-interactive hover:text-charcoal",
                      ].join(" ")}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-sans text-sm font-medium text-charcoal mb-1">전문 분야</p>
                <Body className="text-muted mb-3">최대 5개 선택</Body>
                <TagSelector
                  options={SPECIALTY_OPTIONS}
                  value={specialties}
                  onChange={setSpecialties}
                  max={5}
                />
              </div>

              <div className="border-t border-border pt-5 flex flex-col gap-4">
                <p className="font-sans text-sm font-medium text-charcoal">포트폴리오 활용 조건</p>
                <Switch
                  checked={allowContentUsage}
                  onChange={setAllowContentUsage}
                  label="콘텐츠 활용 동의"
                  description="시술 사진을 SNS, 포트폴리오 등에 활용할 수 있어요"
                />
                <Switch
                  checked={allowFaceExposure}
                  onChange={setAllowFaceExposure}
                  label="얼굴 공개 동의"
                  description="모델의 얼굴이 포함된 사진을 게시할 수 있어요"
                />
              </div>
            </>
          )}

          <div>
            <p className="font-sans text-sm font-medium text-charcoal mb-2">
              자기소개 <span className="text-muted font-normal">(선택)</span>
            </p>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="소개를 입력해주세요"
              rows={3}
              className="w-full rounded-card border border-border bg-cream font-sans text-sm text-charcoal placeholder:text-muted px-3 py-2.5 resize-none focus:outline-none focus:border-border-interactive transition-colors"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 font-sans text-xs text-red-500">{error}</p>
        )}

        <Button
          variant="primary"
          size="lg"
          className="w-full mt-8"
          disabled={submitting}
        >
          {submitting ? "저장 중…" : "저장"}
        </Button>
      </form>
    </PageLayout>
  );
}
