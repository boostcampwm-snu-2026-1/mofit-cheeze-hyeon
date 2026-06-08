import { useLocation, useNavigate } from "react-router-dom";
import { PageLayout, Button, Body } from "@ui";

export function SignupVerifyPage() {
  const navigate = useNavigate();
  const email = (useLocation().state as { email?: string })?.email ?? "";

  return (
    <PageLayout fullWidth className="flex items-center justify-center min-h-screen p-0 py-0">
      <div className="w-full max-w-sm mx-auto px-6 py-16 flex flex-col items-center text-center">
        <div className="text-4xl mb-6">✉️</div>
        <p className="font-sans font-semibold text-[1.5rem] leading-tight tracking-[-0.5px] text-charcoal mb-2">
          이메일을 확인해주세요
        </p>
        {email && (
          <Body className="text-muted mb-1">
            <span className="text-charcoal font-medium">{email}</span>
          </Body>
        )}
        <Body className="text-muted mb-8">
          인증 링크를 클릭하면 가입이 완료됩니다.
        </Body>
        <Button
          variant="ghost"
          size="md"
          className="w-full"
          onClick={() => navigate("/login")}
        >
          로그인 화면으로
        </Button>
      </div>
    </PageLayout>
  );
}
