interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className = "" }: TabsProps) {
  return (
    <div className={`flex border-b border-border ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={[
              "flex-1 py-3 font-sans text-sm font-medium transition-colors relative",
              isActive ? "text-primary" : "text-muted hover:text-charcoal",
            ].join(" ")}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`ml-1.5 text-xs ${isActive ? "text-primary" : "text-muted"}`}>
                {tab.count}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
