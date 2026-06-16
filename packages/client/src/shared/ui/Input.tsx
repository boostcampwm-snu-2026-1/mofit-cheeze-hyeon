import { forwardRef, useId, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-sans text-charcoal leading-normal">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            "w-full bg-cream text-charcoal placeholder:text-muted",
            "border rounded-card px-3 py-2.5 text-sm font-sans leading-normal",
            "outline-none transition-shadow",
            error
              ? "border-error focus:shadow-focus"
              : "border-border focus:border-primary focus:shadow-focus",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            className,
          ].join(" ")}
          {...props}
        />
        {error && <p className="text-xs font-sans text-error leading-normal">{error}</p>}
        {hint && !error && <p className="text-xs font-sans text-muted leading-normal">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
