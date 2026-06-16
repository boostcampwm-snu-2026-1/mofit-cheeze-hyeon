import { type ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  /** 하단 고정 영역 — BottomNav 주입용 */
  footer?: ReactNode;
  /** 최대 너비 제한 없이 full-width */
  fullWidth?: boolean;
  className?: string;
}

export function PageLayout({
  children,
  header,
  footer,
  fullWidth = false,
  className = "",
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-cream text-charcoal font-sans flex flex-col">
      {header && (
        <header
          className="sticky top-0 z-20 bg-cream border-b border-border flex-shrink-0"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          {fullWidth ? <div className="max-w-[430px] mx-auto w-full">{header}</div> : header}
        </header>
      )}
      <main
        className={[
          "flex-1",
          fullWidth ? "w-full" : "max-w-[1200px] mx-auto px-6",
          "pb-8",
          className,
        ].join(" ")}
        style={!footer ? { paddingBottom: "env(safe-area-inset-bottom)" } : undefined}
      >
        {children}
      </main>
      {footer && (
        <footer
          className="sticky bottom-0 z-20 bg-cream border-t border-border flex-shrink-0"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {footer}
        </footer>
      )}
    </div>
  );
}
