import { useState } from "react";
import { VtLink, useVtNavigate } from "@ui";
import { PageLayout, Input, Button, Caption } from "@ui";
import { supabase } from "../lib/supabase";
import { loadUserSession } from "../lib/AuthProvider";
import { useAuthStore } from "../store/auth";

export function LoginPage() {
  const navigate = useVtNavigate();
  const { setLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      setError(authError?.message ?? "로그인에 실패했습니다.");
      setSubmitting(false);
      setLoading(false);
      return;
    }

    await loadUserSession(data.user.id);

    const { user, modelProfile, designerProfile } = useAuthStore.getState();
    if (!user) {
      setError("계정 정보를 불러오지 못했습니다.");
      setSubmitting(false);
      return;
    }

    const profileExists =
      user.role === "model" ? !!modelProfile : !!designerProfile;

    if (!profileExists) {
      navigate(
        user.role === "model" ? "/onboarding/model" : "/onboarding/designer",
        { replace: true }
      );
    } else {
      navigate(user.role === "model" ? "/discover" : "/matching/inbox", {
        replace: true,
      });
    }
  }

  return (
    <PageLayout fullWidth className="flex items-center justify-center min-h-screen p-0 py-0">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-auto px-6 py-16 flex flex-col"
      >
        <div className="mb-12">
          <p className="font-sans font-semibold text-[1.75rem] leading-tight tracking-[-0.6px] text-charcoal">
            모핏
          </p>
          <p className="font-sans text-muted text-base mt-1">
            헤어 모델과 디자이너를 연결합니다
          </p>
        </div>

        <div className="flex flex-col gap-4">
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
          {submitting ? "로그인 중…" : "로그인"}
        </Button>

        <div className="mt-3 text-center">
          <VtLink
            to="/forgot-password"
            className="font-sans text-xs text-muted hover:text-charcoal underline underline-offset-2"
          >
            비밀번호 재설정
          </VtLink>
        </div>

        <div className="mt-4 text-center">
          <Caption>
            계정이 없으신가요?{" "}
            <VtLink
              to="/signup"
              className="text-charcoal underline underline-offset-2"
            >
              회원가입
            </VtLink>
          </Caption>
        </div>
      </form>
    </PageLayout>
  );
}
