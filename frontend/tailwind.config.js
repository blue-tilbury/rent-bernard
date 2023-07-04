/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      flex: {
        2: "2 2 0%",
        3: "3 3 0%",
        "1/3": "0 1 33.333333%",
      },
      colors: {
        "rent-blue": "#AAF0FF",
        "rent-green": "#90FF7E",
        "rent-dark-gray": "#D9D9D9",
        "rent-light-gray": "#F9F8F8",
        "rent-background-gray": "#F5F7F7",
      },
    },
    fontFamily: {
      Roboto: ["Roboto", "sans-serif"],
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        lg: "1124px",
        xl: "1124px",
        "2xl": "1124px",
      },
    },
  },
  plugins: [],
};
