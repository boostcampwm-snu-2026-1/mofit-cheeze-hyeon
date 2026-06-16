interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, description, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className="flex items-center justify-between w-full gap-4 py-1 disabled:opacity-50"
    >
      {(label || description) && (
        <div className="flex flex-col items-start text-left">
          {label && (
            <span className="font-sans text-sm font-medium text-charcoal">{label}</span>
          )}
          {description && (
            <span className="font-sans text-xs text-muted mt-0.5">{description}</span>
          )}
        </div>
      )}
      <div
        className={[
          "relative inline-flex h-6 w-11 shrink-0 rounded-pill border-2 border-transparent transition-colors duration-200",
          checked ? "bg-primary" : "bg-border",
        ].join(" ")}
      >
        <span
          className={[
            "pointer-events-none inline-block h-5 w-5 rounded-pill bg-offwhite shadow-sm transform transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0",
          ].join(" ")}
        />
      </div>
    </button>
  );
}
