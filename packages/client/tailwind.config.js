/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "bg-primary", "bg-primary-hover", "bg-primary-light",
    "text-primary", "text-offwhite", "text-accent",
    "bg-offwhite", "bg-cream", "bg-tag",
    "bg-surface-hover", "bg-surface-subtle",
    "border-primary", "border-border-interactive",
    "focus:border-primary", "focus:shadow-focus",
    "hover:bg-surface-hover", "hover:bg-surface-subtle",
    "hover:border-border-interactive", "hover:border-primary",
    "rounded-card", "rounded-container", "rounded-compact",
    "shadow-card-1", "shadow-card-2", "shadow-modal", "shadow-focus",
  ],
  theme: {
    extend: {
      colors: {
        // MOFIT brand
        primary: {
          DEFAULT: "#4D8DFF",
          hover: "#3B7EF5",
          light: "#8AB8FF",
        },
        accent: "#FF8E7E",
        tag: "#FFF3F0",
        // Foundation
        cream: "#F3F8FF",
        charcoal: "#172033",
        offwhite: "#F8F9FA",
        muted: "#6B7280",
        border: {
          DEFAULT: "#E4EDF9",
          interactive: "rgba(77,141,255,0.4)",
        },
        surface: {
          hover: "rgba(77,141,255,0.06)",
          subtle: "rgba(77,141,255,0.03)",
        },
        // Status
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
      },
      borderRadius: {
        micro: "4px",
        DEFAULT: "6px",
        compact: "8px",
        card: "14px",
        container: "20px",
        pill: "9999px",
      },
      boxShadow: {
        "btn-primary":
          "rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px",
        focus: "0 0 0 3px rgba(77,141,255,0.25)",
        "card-1": "0 8px 24px rgba(77,141,255,0.08)",
        "card-2": "0 16px 40px rgba(77,141,255,0.12)",
        "modal": "0 24px 64px rgba(77,141,255,0.18)",
      },
      letterSpacing: {
        display: "-1.5px",
        heading: "-1.2px",
        subheading: "-0.9px",
      },
    },
  },
  plugins: [],
};
