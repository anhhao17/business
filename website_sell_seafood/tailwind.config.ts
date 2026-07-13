import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#eef9ff",
          100: "#d9f1ff",
          200: "#bce7ff",
          300: "#8ed8ff",
          400: "#59c0ff",
          500: "#33a4ff",
          600: "#1c85f5",
          700: "#156ae1",
          800: "#1856b6",
          900: "#1a4b8f",
          950: "#142f57",
        },
        abyss: {
          50: "#f0fbff",
          100: "#e1f6ff",
          200: "#c4edff",
          300: "#9bdfff",
          400: "#62c8ff",
          500: "#38aaff",
          600: "#1e8bf6",
          700: "#0f71e0",
          800: "#105bb6",
          900: "#134d91",
          950: "#0a2c54",
        },
        deep: {
          900: "#04111f",
          800: "#061a2e",
          700: "#0a2440",
          600: "#0e3055",
        },
        foam: "#f0fbff",
        coral: "#ff6b6b",
        sand: "#f5e9c9",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "ocean-radial":
          "radial-gradient(1200px 600px at 50% -10%, rgba(56,170,255,0.25), transparent 60%), radial-gradient(800px 400px at 80% 10%, rgba(30,139,246,0.18), transparent 60%)",
        "ocean-linear":
          "linear-gradient(180deg, #04111f 0%, #061a2e 40%, #0a2440 100%)",
        "wave-shine":
          "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56,170,255,0.25), 0 10px 40px -10px rgba(56,170,255,0.45)",
        "glow-lg": "0 0 60px -10px rgba(56,170,255,0.55)",
        card: "0 10px 30px -12px rgba(4,17,31,0.6)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "wave-pan": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%,100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "wave-pan": "wave-pan 18s linear infinite",
        shimmer: "shimmer 2.4s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
