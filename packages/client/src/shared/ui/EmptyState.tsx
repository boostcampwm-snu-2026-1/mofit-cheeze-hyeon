import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div
      className={["flex flex-col items-center justify-center py-16 px-6 text-center", className].join(
        " "
      )}
    >
      <div className="w-12 h-12 rounded-card border border-border flex items-center justify-center mb-5 bg-[rgba(28,28,28,0.03)]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="text-muted"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <p className="font-sans font-semibold text-base text-charcoal">{title}</p>
      {description && (
        <p className="font-sans text-sm text-muted mt-1.5 max-w-xs leading-normal">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
