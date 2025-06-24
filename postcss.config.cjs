module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    cssnano: process.env.NODE_ENV === 'production' ? {
      preset: ['default', {
        discardComments: { removeAll: true },
        minifyFontValues: true,
        minifySelectors: true,
        normalizeWhitespace: true,
        reduceIdents: true
      }]
    } : false,
  },
} 