import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(to right, #1e40af, #60a5fa, #8b5cf6)", // blue-800, blue-400, purple-400
      },
    },
  },
  plugins: [daisyui],
};
