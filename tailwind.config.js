/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        press: ["'Press Start 2P'", "ui-sans-serif", "system-ui"],
      },
      keyframes: {
        gradientShift: {
          "0%": { "background-position": "0% 50%" },
          "100%": { "background-position": "200% 50%" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        gradientShift: "gradientShift 2.5s infinite alternate",
        marquee: "marquee 20s linear infinite",
      },
    },
  },
  plugins: [],
};
