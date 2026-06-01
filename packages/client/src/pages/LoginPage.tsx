import { useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout, Input, Button, Body, Caption } from "@ui";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <PageLayout fullWidth className="flex items-center justify-center min-h-screen p-0 py-0">
      <div className="w-full max-w-sm mx-auto px-6 py-16 flex flex-col">
        <div className="mb-12">
          <p className="font-sans font-semibold text-[1.75rem] leading-tight tracking-[-0.6px] text-charcoal">
            모핏
          </p>
          <p className="font-sans text-muted text-base mt-1">패션과 모델의 연결고리</p>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label="이메일"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button variant="primary" size="lg" className="w-full mt-6">
          로그인
        </Button>

        <div className="mt-4 text-center">
          <Caption>
            계정이 없으신가요?{" "}
            <Link to="/signup" className="text-charcoal underline underline-offset-2">
              회원가입
            </Link>
          </Caption>
        </div>
      </div>
    </PageLayout>
  );
}
