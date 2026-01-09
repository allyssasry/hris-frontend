// tailwind.config.js
const withOpacity = (variable) => ({ opacityValue }) =>
  opacityValue === undefined ? `rgb(var(${variable}))`
                             : `rgb(var(${variable}) / ${opacityValue})`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: withOpacity('--brand'),
          secondary: withOpacity('--brand-secondary'),
          accent: withOpacity('--brand-accent'),
        },
        semantic: {
          success: withOpacity('--success'),
          warning: withOpacity('--warning'),
          danger:  withOpacity('--danger'),
          info:    withOpacity('--info'),
        },
        neutral: {
          100: withOpacity('--neutral-100'),
          200: withOpacity('--neutral-200'),
          300: withOpacity('--neutral-300'),
          400: withOpacity('--neutral-400'),
          500: withOpacity('--neutral-500'),
          700: withOpacity('--neutral-700'),
          900: withOpacity('--neutral-900'),
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      borderRadius: { md: 'var(--radius-md)' },
      boxShadow: { soft: 'var(--shadow-soft)' },
    },
  },
  plugins: [],
};
