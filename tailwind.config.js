/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "ss-orange": "#F5822B",
        "ss-dark-gray": "#444444",
        "ss-light-gray": "#eeeeee",
      },
      fontFamily: {
        sans: ["Raleway", "sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
