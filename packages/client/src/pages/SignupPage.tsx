import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageLayout, Input, Button, Caption, Divider } from "@ui";

type Role = "model" | "designer";

export function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("model");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <PageLayout fullWidth className="p-0 py-0">
      <div className="w-full max-w-sm mx-auto px-6 py-12 flex flex-col">
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-sans text-muted hover:text-charcoal transition-colors mb-10 w-fit"
        >
          ← 뒤로
        </button>

        <div className="mb-8">
          <p className="font-sans font-semibold text-[1.75rem] leading-tight tracking-[-0.6px] text-charcoal">
            계정 만들기
          </p>
          <p className="font-sans text-muted text-base mt-1">모핏에서 시작해보세요</p>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label="이름"
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            placeholder="8자 이상"
            hint="영문, 숫자 포함 8자 이상"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Divider label="나는" className="my-6" />

        <div className="flex gap-2">
          {(["model", "designer"] as Role[]).map((r) => (
            <button
              key={r}
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

        <Button variant="primary" size="lg" className="w-full mt-6">
          시작하기
        </Button>

        <div className="mt-4 text-center">
          <Caption>
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="text-charcoal underline underline-offset-2">
              로그인
            </Link>
          </Caption>
        </div>

        <p className="font-sans text-xs text-muted text-center mt-6 leading-relaxed">
          가입하면{" "}
          <span className="text-charcoal underline underline-offset-1 cursor-pointer">
            이용약관
          </span>
          {" "}및{" "}
          <span className="text-charcoal underline underline-offset-1 cursor-pointer">
            개인정보처리방침
          </span>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </PageLayout>
  );
}
