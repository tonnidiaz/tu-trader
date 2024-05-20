import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  daisyui: {
      themes: [
          {
              tb: {
                  ...require("daisyui/src/theming/themes")["[data-theme=tb]"],
                  primary: "#ffa500",
                  secondary: "#f6d860",
                  accent: "#ecb847",
                  neutral: "#181818",
                  '.bg-2':{
                      'background-color': '#202020'
                  },
                  dark: '#292828',
                  "base-100": "#111111",
                  
              },
          },
          "dark",
          "halloween",
          "forest",
          "black",
          "business",
          "night",
          "dracula",
      ],
  },
  plugins: [require("daisyui")],
};
export default config;
