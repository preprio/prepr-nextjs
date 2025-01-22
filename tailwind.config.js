/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{ts,tsx}'],
    prefix: 'prp-',
    theme: {
        extend: {
            colors: {
                purple: {
                    50: 'rgb(240, 239, 251)',
                    100: 'rgb(221, 219, 245)',
                    200: 'rgb(202, 199, 240)',
                    300: 'rgb(183, 178, 235)',
                    400: 'rgb(163, 158, 229)',
                    500: 'rgb(144, 138, 224)',
                    600: 'rgb(125, 117, 218)',
                    700: 'rgb(106, 97, 213)',
                    800: 'rgb(86, 76, 207)',
                    900: 'rgb(67, 56, 202)',
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
                shadow: '#C3C3C3',
            },
        },
    },
    plugins: [],
}
