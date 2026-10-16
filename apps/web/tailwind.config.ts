import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#090A0F',
          surface: '#0F1219',
          border: '#1F2433',
        },
        card: {
          slate: '#12151E',
          hover: '#181C28',
        },
        nexus: {
          amber: '#F59E0B',
          'amber-hover': '#D97706',
          cyan: '#06B6D4',
          'cyan-hover': '#0891B2',
          emerald: '#10B981',
          rose: '#EF4444',
        },
      },
      fontFamily: {
        display: ['var(--font-jakarta)', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
