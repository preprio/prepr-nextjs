/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{ts,tsx}'],
    prefix: 'prp-',
    theme: {
        extend: {
            spacing: {
                19.5: '4.875rem',
            },
            screens: {
                '2xl': '1440px',
            },
            colors: {
                indigo: {
                    default: '#4338CA',
                    300: '#A5B4FC',
                    600: '#4338CA',
                },
                orange: {
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
                    900: '#111827',
                },
            },
        },
    },
    plugins: [],
}
