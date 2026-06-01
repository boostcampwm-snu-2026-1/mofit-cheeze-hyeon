import { HTMLAttributes } from "react";

type BadgeVariant = "default" | "muted" | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-charcoal text-offwhite",
  muted: "bg-[rgba(28,28,28,0.06)] text-muted",
  outline: "bg-transparent text-charcoal border border-border-interactive",
};

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-sans font-normal leading-normal",
        variantStyles[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}
