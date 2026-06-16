import { useEffect } from "react";
import { useVtNavigate } from "@ui";
import { useAuthStore } from "../store/auth";

export function DemoSelectPage() {
  const navigate = useVtNavigate();
  const { user, loginAsMockModel, loginAsMockDesigner } = useAuthStore();

  useEffect(() => {
    if (user?.role === "model") navigate("/discover", { replace: true });
    else if (user?.role === "designer") navigate("/matching/inbox", { replace: true });
  }, [user]);

  function selectModel() {
    loginAsMockModel();
    navigate("/discover", { replace: true });
  }

  function selectDesigner() {
    loginAsMockDesigner();
    navigate("/matching/inbox", { replace: true });
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 font-sans">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-14">
          <p className="font-semibold text-[2.5rem] text-charcoal tracking-[-2px] leading-none">
            mofit
          </p>
          <p className="text-sm text-muted mt-3">
            헤어 모델 × 디자이너 매칭 플랫폼
          </p>
        </div>

        <p className="text-xs font-medium text-muted text-center mb-4 tracking-wide uppercase">
          역할을 선택하세요
        </p>

        <div className="flex flex-col gap-3">
          {/* Model card */}
          <button
            type="button"
            onClick={selectModel}
            className="w-full rounded-container border-2 border-border bg-offwhite p-5 text-left hover:border-primary hover:bg-surface-hover transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-base text-charcoal mb-1">
                  헤어 모델로 체험
                </p>
                <p className="text-sm text-muted leading-relaxed">
                  원하는 스타일의 디자이너를 찾고<br />무료 또는 저비용으로 시술받아요
                </p>
              </div>
              <div className="w-10 h-10 rounded-pill bg-primary/10 flex items-center justify-center flex-shrink-0 ml-4 group-hover:bg-primary/20 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-primary">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              {["디자이너 탐색", "매칭 신청", "채팅"].map((t) => (
                <span key={t} className="text-[11px] text-muted border border-border rounded-pill px-2 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </button>

          {/* Designer card */}
          <button
            type="button"
            onClick={selectDesigner}
            className="w-full rounded-container border-2 border-border bg-offwhite p-5 text-left hover:border-charcoal hover:bg-surface-hover transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-base text-charcoal mb-1">
                  헤어 디자이너로 체험
                </p>
                <p className="text-sm text-muted leading-relaxed">
                  모델을 모집하고 시술 사례로<br />포트폴리오를 완성해요
                </p>
              </div>
              <div className="w-10 h-10 rounded-pill bg-surface-hover flex items-center justify-center flex-shrink-0 ml-4 group-hover:bg-border transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-charcoal">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 12l-4-4-4 4M12 8v8" />
                </svg>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              {["신청 관리", "수락·거절", "일정 관리"].map((t) => (
                <span key={t} className="text-[11px] text-muted border border-border rounded-pill px-2 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-muted mt-8">
          데모 버전 · 실제 데이터가 연동되지 않습니다
        </p>
      </div>
    </div>
  );
}
