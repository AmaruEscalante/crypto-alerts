const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ["VT323", ...defaultTheme.fontFamily.sans],
      logo: ["Iceberg"],
    },
    // extend: {},
    extend: {
      colors: {
        primary: {
          DEFAULT: "#131517",
        },
        secondary: {
          DEFAULT: "#1E1F23",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
