/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  safelist: ['prepr-proximity-highlight'],
  prefix: 'p-',
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#eef2ff',
          '100': '#e0e7ff',
          '200': '#c7d2fe',
          '300': '#a5b4fc',
          '400': '#818cf8',
          '500': '#6366f1', 
          '600': '#4f46e5',
          '700': '#4338ca',
          '800': '#3730a3',
          '900': '#312e81',
          '950': '#1e1b4b',
        },
        secondary: {
          400: '#FB923C',
          500: '#F97316',
        },
        grey: {
          400: '#9CA3AF',
        },
        gray: {
          100: '#F3F4F6',
          300: '#D1D5DB',
          500: '#6B7280',
          800: '#1F2937',
          900: '#111827',
        },
        shadow: '#C3C3C3',
        prepr: {
          surface: {
            overlay: 'rgba(0, 0, 0, 0.1)',
            backdrop: 'rgba(31, 41, 55, 0.24)',
          }
        }
      },
      spacing: {
        4.5: '1.125rem',
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'prepr-overlay': '10000',
        'prepr-tooltip': '10001',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
