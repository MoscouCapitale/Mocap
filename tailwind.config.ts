import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    colors: {
      background: "#060606",
      text: "#F9F9F9",
      text_grey: {
        light: "#A3A3A3",
        DEFAULT: "#A3A3A3",
        dark: "#A3A3A3",
      },
      text_special: "#EA5959",
      main: "#007BFF",
      second: "#4476AB",
      success: "#40C057",
      warning: "#F19B4B",
      error: "#EA5959"
    },
    extend: {
      outline: {
        inputerror: ['2px solid #EA5959', '2px'],
      }
    }
  },
} satisfies Config;