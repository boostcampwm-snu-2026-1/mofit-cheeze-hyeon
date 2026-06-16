import { type ReactNode } from "react";

interface PageHeaderProps {
  title?: ReactNode;
  onBack?: () => void;
  right?: ReactNode;
}

/** 모든 페이지 헤더의 표준 — 높이(56px)와 뒤로가기 위치/스타일을 통일한다 */
export function PageHeader({ title, onBack, right }: PageHeaderProps) {
  return (
    <div className="h-14 flex items-center gap-2 px-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="flex-shrink-0 -ml-1 w-9 h-9 rounded-pill flex items-center justify-center text-charcoal hover:bg-surface-hover transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
      {title && (
        <div
          className={[
            "flex-1 min-w-0 font-sans font-semibold text-base text-charcoal truncate",
            onBack ? "" : "px-2",
          ].join(" ")}
        >
          {title}
        </div>
      )}
      {!title && <div className="flex-1" />}
      {right && <div className="flex-shrink-0 flex items-center gap-2">{right}</div>}
    </div>
  );
}
