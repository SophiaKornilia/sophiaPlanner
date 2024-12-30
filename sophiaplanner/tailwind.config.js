/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#a1dec9",
        secondary: "#d19fa7",
        background: "#FDF4E3",
        text: "#543c29",
        accent: "#5A3723 ",
        // Högkontrastfärger
        highContrastPrimary: "#005f5f",
        highContrastSecondary: "#7d0025",
        highContrastBackground: "#000000",
        highContrastText: "#35261A",
        highContrastAccent: "#ffcc00",
      },
      fontFamily: {
        sans: ["Parkinsans", "sans-serif"],
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
    },
  },
  plugins: [typography],
};

//color
//primary: En grundfärg som ofta används på knappar och framhävda element.
//secondary: En stödjande färg som kan användas för andra viktiga element.
//background: Färg för sidans bakgrund.
//text: Standardfärg för textinnehåll.
//accent: För specifika delar där du vill ha lite mer uppmärksamhet, till exempel //knappar eller andra interaktiva element.
