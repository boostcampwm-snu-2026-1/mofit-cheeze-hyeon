interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className = "" }: DividerProps) {
  if (label) {
    return (
      <div className={["flex items-center gap-3", className].join(" ")}>
        <div className="flex-1 h-px bg-border" />
        <span className="font-sans text-xs text-muted">{label}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    );
  }
  return <hr className={["border-0 border-t border-border my-0", className].join(" ")} />;
}
