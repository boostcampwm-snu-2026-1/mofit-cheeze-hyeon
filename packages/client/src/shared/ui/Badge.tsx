import { type HTMLAttributes } from "react";

type BadgeVariant = "default" | "muted" | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-primary text-offwhite",
  muted: "bg-surface-hover text-primary",
  outline: "bg-transparent text-charcoal border border-border",
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
