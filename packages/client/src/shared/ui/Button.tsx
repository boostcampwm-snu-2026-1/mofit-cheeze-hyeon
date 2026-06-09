import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost" | "cream" | "pill";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-charcoal text-offwhite rounded-[6px] shadow-btn-primary active:opacity-80 focus:shadow-focus",
  ghost:
    "bg-transparent text-charcoal rounded-[6px] border border-border-interactive active:opacity-80 focus:shadow-focus",
  cream:
    "bg-cream text-charcoal rounded-[6px] active:opacity-80 focus:shadow-focus",
  pill:
    "bg-cream text-charcoal rounded-pill shadow-btn-primary opacity-50 hover:opacity-80 active:opacity-80",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          "inline-flex items-center justify-center gap-2 font-sans font-normal leading-normal cursor-pointer transition-opacity outline-none disabled:opacity-40 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
