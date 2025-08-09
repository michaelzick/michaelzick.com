/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'primary-blue': 'var(--primary-blue)',
        'dark-blue': 'var(--dark-blue)',
        'default-grey': 'var(--default-grey)',
        'light-grey': 'var(--light-grey)',
        'white': 'var(--white)',
      },
    },
  },
  plugins: [],
}
