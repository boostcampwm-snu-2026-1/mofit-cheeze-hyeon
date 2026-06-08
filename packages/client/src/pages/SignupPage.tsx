import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageLayout, Input, Button, Caption, Divider } from "@ui";
import { supabase } from "../lib/supabase";

type Role = "model" | "designer";

export function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("model");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setSubmitting(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !data.user) {
      setError(authError?.message ?? "회원가입에 실패했습니다.");
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("users").insert({
      id: data.user.id,
      role,
      name,
    });

    if (insertError) {
      setError("계정 생성 중 오류가 발생했습니다.");
      setSubmitting(false);
      return;
    }

    // Email confirmation이 켜진 경우 세션이 없을 수 있음
    if (!data.session) {
      navigate("/signup/verify", { state: { email } });
      return;
    }

    navigate(role === "model" ? "/onboarding/model" : "/onboarding/designer", {
      replace: true,
    });
  }

  return (
    <PageLayout fullWidth className="p-0 py-0">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-auto px-6 py-12 flex flex-col"
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-sans text-muted hover:text-charcoal transition-colors mb-10 w-fit"
        >
          ← 뒤로
        </button>

        <div className="mb-8">
          <p className="font-sans font-semibold text-[1.75rem] leading-tight tracking-[-0.6px] text-charcoal">
            계정 만들기
          </p>
          <p className="font-sans text-muted text-base mt-1">
            모핏에서 시작해보세요
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label="이름"
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="이메일"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="8자 이상"
            hint="영문, 숫자 포함 8자 이상"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Divider label="나는" className="my-6" />

        <div className="flex gap-2">
          {(["model", "designer"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={[
                "flex-1 py-3 rounded-card border font-sans text-sm transition-colors",
                role === r
                  ? "border-charcoal bg-charcoal text-offwhite"
                  : "border-border text-muted hover:border-border-interactive hover:text-charcoal",
              ].join(" ")}
            >
              {r === "model" ? "헤어 모델" : "헤어 디자이너"}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-3 font-sans text-xs text-red-500">{error}</p>
        )}

        <Button
          variant="primary"
          size="lg"
          className="w-full mt-6"
          disabled={submitting}
        >
          {submitting ? "처리 중…" : "시작하기"}
        </Button>

        <div className="mt-4 text-center">
          <Caption>
            이미 계정이 있으신가요?{" "}
            <Link
              to="/login"
              className="text-charcoal underline underline-offset-2"
            >
              로그인
            </Link>
          </Caption>
        </div>

        <p className="font-sans text-xs text-muted text-center mt-6 leading-relaxed">
          가입하면{" "}
          <span className="text-charcoal underline underline-offset-1 cursor-pointer">
            이용약관
          </span>{" "}
          및{" "}
          <span className="text-charcoal underline underline-offset-1 cursor-pointer">
            개인정보처리방침
          </span>
          에 동의하는 것으로 간주됩니다.
        </p>
      </form>
    </PageLayout>
  );
}
