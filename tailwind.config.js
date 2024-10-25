/**
 * @format
 * @type {import('tailwindcss').Config}
 */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "text-color": "#6E6E6E",
        primary: "#4b68cf",
      },
      backgroundImage: {
        "gradient-to-r":
          "linear-gradient(94.57deg, #677CC9 11.99%, #945F91 49.01%, #ECC89C 94.35%)",
      },
      boxShadow: {
        one: "2px 2px 4px 0px #FFFFFF21 inset, -2px -2px 4px 0px #FFFFFF21 inset",
        red: "box-shadow: 2px 2px 4px 0px #FF355121 inset, -2px -2px 4px 0px #FF355121 inset;",
      },
    },
  },
  plugins: [],
};
