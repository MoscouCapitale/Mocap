import { type Config } from "tailwindcss";
// tailwindcss-animate
import * as twAnimate from "tailwindcss-animate";
import * as twScrollbar from "tailwind-scrollbar";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      black: "#000000",
      background: "#0C0C0C",
      text: "#F9F9F9",
      text_grey: {
        light: "#A3A3A3",
        DEFAULT: "#A3A3A3",
        dark: "#A3A3A3",
      },
      grey: {
        light: "#A3A3A3",
        DEFAULT: "#A3A3A3",
        dark: "#A3A3A3",
      },
      text_special: "#EA5959",
      main: "#007BFF",
      second: "#4476AB",
      success: "#40C057",
      warning: "#F19B4B",
      error: "#EA5959",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      dropShadow: {
        "platformIcon": "0px 0px 30px #FFFFFFFF",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      outline: {
        inputerror: ["2px solid #EA5959", "2px"],
      },
    },
  },
  plugins: [twAnimate, function ({ addUtilities }) {
    const newUtilities = {
      ".pos-center": {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      },
      ".node-highlight": {
        // TODO: better highlight, and using theme colors
        boxShadow: "0px 0px 30px 10px #FFFFFF33",
      },
    };

    addUtilities(newUtilities, ["responsive", "hover"]);
  }, twScrollbar],
} satisfies Config;
