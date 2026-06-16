interface TagSelectorProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  max?: number;
}

export function TagSelector({ options, value, onChange, max }: TagSelectorProps) {
  const toggle = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else if (!max || value.length < max) {
      onChange([...value, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((tag) => {
        const selected = value.includes(tag);
        const disabled = !selected && !!max && value.length >= max;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            disabled={disabled}
            className={[
              "px-3 py-1.5 rounded-pill border text-sm font-sans transition-colors",
              selected
                ? "border-primary bg-primary text-offwhite"
                : disabled
                ? "border-border text-muted/40 cursor-not-allowed"
                : "border-border text-muted hover:border-primary hover:text-primary",
            ].join(" ")}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
