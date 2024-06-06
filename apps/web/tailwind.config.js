/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#EAEDF6",
          main: "#3041C7",
          dark: "#000320",
          accent: "#0f30ab",
          "contrast-text": "#ffffff",
        },
      },
      animation: {
        move: "move 25s infinite alternate",
        "move-reverse": "move-reverse 25s infinite alternate",
      },
      keyframes: {
        move: {
          "0%": {
            transform: "translate(-100px, -50px) rotate(-90deg)",
            borderRadius: "24% 76% 35% 65% / 27% 36% 64% 73%",
          },
          "100%": {
            transform: "translate(500px, 100px) rotate(-10deg)",
            borderRadius: "76% 24% 33% 67% / 68% 55% 45% 32%",
          },
        },
        "move-reverse": {
          "0%": {
            transform: "translate(500px, 100px) rotate(10deg)",
            borderRadius: "76% 24% 33% 67% / 68% 55% 45% 32%",
          },
          "100%": {
            transform: "translate(-100px, -50px) rotate(90deg)",
            borderRadius: "24% 76% 35% 65% / 27% 36% 64% 73%",
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

// /** @type {import('tailwindcss').Config} */

// const {
//   createMuiTheme,
// } = require("@material-ui/core");

// module.exports = {
//   content: [
//     "./app/**/*.{js,ts,jsx,tsx}",
//     "./components/**/*.{js,ts,jsx,tsx}",
//     "./lib/**/*.{js,ts,jsx,tsx}",
//   ],
//   darkMode: "class",
//   theme: {
//   extend: {
//     spacing: {
//       "18px": "18px",
//       "22px": "22px",
//     },
//     keyframes: {
//       overlayShow: {
//         from: { opacity: '0' },
//         to: { opacity: '1' },
//       },
//       contentShow: {
//         from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
//         to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
//       },
//     },
//     animation: {
//       overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
//       contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
//     },
//   },
// },
//   plugins: [],
// };

// import type { Config } from 'tailwindcss'

// export default {
//   content: [
//     "./app/**/*.{js,ts,jsx,tsx}",
//     "./components/**/*.{js,ts,jsx,tsx}",
//     "./lib/**/*.{js,ts,jsx,tsx}",
//   ],
//   darkMode: "class",
//   theme: {
//     extend: {
//       spacing: {
//         "18px": "18px",
//         "22px": "22px",
//       },
//     },
//   },
//   plugins: [],
// } satisfies Config
