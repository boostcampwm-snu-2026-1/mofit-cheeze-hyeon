import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout, Button, Input, Body, TagSelector, Switch } from "@ui";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/auth";

const SPECIALTY_OPTIONS = [
  "커트",
  "염색",
  "탈색",
  "펌",
  "매직",
  "볼륨매직",
  "두피케어",
  "클리닉",
  "웨이브",
  "스타일링",
];

const CAREER_OPTIONS = [
  "1년 미만",
  "1~3년",
  "3~5년",
  "5~10년",
  "10년 이상",
];

const REGIONS = [
  "서울 강남",
  "서울 강북",
  "서울 마포·홍대",
  "서울 신촌·이대",
  "서울 강동",
  "서울 강서",
  "서울 종로·중구",
  "경기 성남",
  "경기 수원",
  "경기 고양",
  "인천",
  "부산",
  "대구",
  "대전",
  "광주",
  "제주",
  "기타",
];

export function OnboardingDesignerPage() {
  const navigate = useNavigate();
  const { user, setDesignerProfile } = useAuthStore();

  const [salonName, setSalonName] = useState("");
  const [region, setRegion] = useState("");
  const [career, setCareer] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [allowContentUsage, setAllowContentUsage] = useState(false);
  const [allowFaceExposure, setAllowFaceExposure] = useState(false);
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    if (!region) {
      setError("지역을 선택해주세요.");
      return;
    }
    if (!career) {
      setError("경력을 선택해주세요.");
      return;
    }

    setError("");
    setSubmitting(true);

    const { error: dbError } = await supabase
      .from("designer_profiles")
      .upsert({
        user_id: user.id,
        salon_name: salonName || null,
        region,
        career,
        specialties,
        allow_content_usage: allowContentUsage,
        allow_face_exposure: allowFaceExposure,
        bio: bio || null,
      });

    if (dbError) {
      setError("프로필 저장 중 오류가 발생했습니다.");
      setSubmitting(false);
      return;
    }

    setDesignerProfile({
      userId: user.id,
      salonName: salonName || undefined,
      region,
      career,
      specialties,
      allowContentUsage,
      allowFaceExposure,
      bio: bio || undefined,
    });

    navigate("/matching/inbox", { replace: true });
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
            디자이너 프로필을 완성해요
          </p>
        </div>

        <div className="flex flex-col gap-7">
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
            <p className="font-sans text-sm font-medium text-charcoal mb-1">
              전문 분야
            </p>
            <Body className="text-muted mb-3">최대 5개 선택</Body>
            <TagSelector
              options={SPECIALTY_OPTIONS}
              value={specialties}
              onChange={setSpecialties}
              max={5}
            />
          </div>

          <div className="border-t border-border pt-5 flex flex-col gap-4">
            <p className="font-sans text-sm font-medium text-charcoal">
              포트폴리오 활용 조건
            </p>
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

          <div>
            <p className="font-sans text-sm font-medium text-charcoal mb-2">
              자기소개 <span className="text-muted font-normal">(선택)</span>
            </p>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="전문 분야, 작업 스타일, 매칭 시 원하는 조건을 알려주세요"
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
          {submitting ? "저장 중…" : "완료"}
        </Button>

        <button
          type="button"
          onClick={() => navigate("/matching/inbox", { replace: true })}
          className="mt-3 text-center font-sans text-sm text-muted hover:text-charcoal transition-colors"
        >
          나중에 하기
        </button>
      </form>
    </PageLayout>
  );
}
