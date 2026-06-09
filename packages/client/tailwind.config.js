/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f7f4ed",
        charcoal: "#1c1c1c",
        offwhite: "#fcfbf8",
        muted: "#5f5f5d",
        border: {
          DEFAULT: "#eceae4",
          interactive: "rgba(28,28,28,0.4)",
        },
        surface: {
          hover: "rgba(28,28,28,0.04)",
          subtle: "rgba(28,28,28,0.03)",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        micro: "4px",
        DEFAULT: "6px",
        compact: "8px",
        card: "12px",
        container: "16px",
        pill: "9999px",
      },
      boxShadow: {
        "btn-primary":
          "rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px",
        focus: "rgba(0,0,0,0.1) 0px 4px 12px",
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
