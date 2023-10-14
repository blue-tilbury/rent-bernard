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
        "rent-very-light-blue": "#4edcff",
        "rent-light-blue": "#00CCFF",
        "rent-blue": "#0080FF",
        "rent-dark-blue": "#283C63",
        "rent-green": "#90FF7E",
        "rent-dark-green": "#1dcc00",
        "rent-bg-gray": "#F5F7F7",
        "rent-input-gray": "#d7d7dc",
        "rent-light-gray": "#adafb7",
        "rent-gray": "#6f727f",
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
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("@tailwindcss/forms")({
      strategy: "base",
    }),
  ],
};
