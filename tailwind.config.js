/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "360px",
      md: "1080px",
      lg: "1024",
      xl: "1280px",
    },
    colors: {
      yellow: "#F4E4C3",
      pink: "#E18EA5",
      darkPink: "#43383F",
      green: "#222E29",
      gold: "#9F8761",
      gray: "#B3B3B3",
      black: "#000",
      white: "#fff",
      cream: "#D8CEC3",
    },
    fontFamily: {
      sygma: ["Sygma", "sans-serif"],
      maintelas: ["Maintelas Blomite", "sans-serif"],
      notoSansJP: ["Noto Sans JP", " sans-serif"],
      poppins: ["Poppins", "sans-serif"],
      westiga: ["Westiga", "sans-serif"],
      NT: ["NT Fabulous", "sans-serif"],
      NTalt: ["NT Fabulous alternative", "sans-serif"],
    },
    extend: {
      transformOrigin: {
        "top-left-1/3-3/4": "33% 75%",
      },
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
    },
    borderWidth: {
      DEFAULT: "1px",
      0: "0",
      2: "2px",
      3: "3px",
      4: "4px",
      6: "6px",
      8: "8px",
    },
  },
  plugins: [],
};
