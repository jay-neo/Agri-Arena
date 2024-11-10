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
      typography: ({ theme }) => ({
        pink: {
          css: {
            "--tw-prose-body": theme("colors.pink[800]"),
            "--tw-prose-headings": theme("colors.pink[900]"),
            "--tw-prose-lead": theme("colors.pink[700]"),
            "--tw-prose-links": theme("colors.pink[900]"),
            "--tw-prose-bold": theme("colors.pink[900]"),
            "--tw-prose-counters": theme("colors.pink[600]"),
            "--tw-prose-bullets": theme("colors.pink[400]"),
            "--tw-prose-hr": theme("colors.pink[300]"),
            "--tw-prose-quotes": theme("colors.pink[900]"),
            "--tw-prose-quote-borders": theme("colors.pink[300]"),
            "--tw-prose-captions": theme("colors.pink[700]"),
            "--tw-prose-code": theme("colors.pink[900]"),
            "--tw-prose-pre-code": theme("colors.pink[100]"),
            "--tw-prose-pre-bg": theme("colors.pink[900]"),
            "--tw-prose-th-borders": theme("colors.pink[300]"),
            "--tw-prose-td-borders": theme("colors.pink[200]"),
            "--tw-prose-invert-body": theme("colors.pink[200]"),
            "--tw-prose-invert-headings": theme("colors.white"),
            "--tw-prose-invert-lead": theme("colors.pink[300]"),
            "--tw-prose-invert-links": theme("colors.white"),
            "--tw-prose-invert-bold": theme("colors.white"),
            "--tw-prose-invert-counters": theme("colors.pink[400]"),
            "--tw-prose-invert-bullets": theme("colors.pink[600]"),
            "--tw-prose-invert-hr": theme("colors.pink[700]"),
            "--tw-prose-invert-quotes": theme("colors.pink[100]"),
            "--tw-prose-invert-quote-borders": theme("colors.pink[700]"),
            "--tw-prose-invert-captions": theme("colors.pink[400]"),
            "--tw-prose-invert-code": theme("colors.white"),
            "--tw-prose-invert-pre-code": theme("colors.pink[300]"),
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": theme("colors.pink[600]"),
            "--tw-prose-invert-td-borders": theme("colors.pink[700]"),
          },
        },
      }),
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
  plugins: [require("@tailwindcss/typography")],
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
