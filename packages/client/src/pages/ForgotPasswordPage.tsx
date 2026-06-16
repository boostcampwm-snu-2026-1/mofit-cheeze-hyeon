import { useState } from "react";
import { useVtNavigate } from "@ui";
import { PageLayout, PageHeader, Input, Button, Body } from "@ui";
import { supabase } from "../lib/supabase";

export function ForgotPasswordPage() {
  const navigate = useVtNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/reset-password` }
    );

    if (resetError) {
      setError(resetError.message);
      setSubmitting(false);
      return;
    }

    setSent(true);
    setSubmitting(false);
  }

  return (
    <PageLayout
      fullWidth
      className="flex items-center justify-center p-0 py-0"
      header={<PageHeader onBack={() => navigate(-1)} />}
    >
      <div className="w-full max-w-sm mx-auto px-6 py-10 flex flex-col">
        <div className="mb-8">
          <p className="font-sans font-semibold text-[1.75rem] leading-tight tracking-[-0.6px] text-charcoal">
            비밀번호 재설정
          </p>
          <p className="font-sans text-muted text-base mt-1">
            가입 이메일로 재설정 링크를 보내드려요
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-card bg-surface-subtle border border-border p-4">
              <Body className="text-charcoal">
                <span className="font-medium">{email}</span>로 재설정 링크를
                발송했습니다. 메일함을 확인해주세요.
              </Body>
            </div>
            <Button
              variant="ghost"
              size="md"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              로그인으로 돌아가기
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="이메일"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && (
              <p className="font-sans text-xs text-red-500">{error}</p>
            )}

            <Button
              variant="primary"
              size="lg"
              className="w-full mt-2"
              disabled={submitting}
            >
              {submitting ? "전송 중…" : "재설정 링크 보내기"}
            </Button>
          </form>
        )}
      </div>
    </PageLayout>
  );
}
