/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Tahoma"', 'Helvetica', 'Arial', 'sans-serif'],
        headline: ['var(--font-open-sans)', '"Tahoma"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'primary-blue': 'rgb(var(--primary-blue) / <alpha-value>)',
        'dark-blue': 'rgb(var(--dark-blue) / <alpha-value>)',
        'default-grey': 'rgb(var(--default-grey) / <alpha-value>)',
        'light-grey': 'rgb(var(--light-grey) / <alpha-value>)',
        white: 'rgb(var(--white) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
