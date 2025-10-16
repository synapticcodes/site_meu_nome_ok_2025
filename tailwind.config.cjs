/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,md,mdx,js,jsx,ts,tsx}',
    './public/**/*.html'
  ],
  darkMode: ['class'],
  theme: {
    fontFamily: {
      sans: ['"Inter"', 'system-ui', 'sans-serif'],
      display: ['"Poppins"', 'system-ui', 'sans-serif'],
      mono: ['"Fira Code"', 'monospace']
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#662ae7',
          dark: '#000080',
          light: '#8b5cf6'
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          500: '#6b7280',
          900: '#111827'
        },
        feedback: {
          success: '#10b981',
          error: '#ef4444',
          warning: '#f59e0b'
        }
      },
      boxShadow: {
        soft: '0 10px 30px -15px rgba(102, 42, 231, 0.3)',
        outline: '0 0 0 3px rgba(102, 42, 231, 0.25)'
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
        '12': '3rem',
        '16': '4rem',
        '24': '6rem'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      keyframes: {
        grid: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(0,-50%,0)' }
        },
        'partner-marquee-forward': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'partner-marquee-forward-offset': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'partner-marquee-reverse': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'partner-marquee-reverse-offset': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      animation: {
        grid: 'grid 35s linear infinite',
        'partner-marquee-forward': 'partner-marquee-forward 32s linear infinite',
        'partner-marquee-forward-offset':
          'partner-marquee-forward-offset 32s linear infinite',
        'partner-marquee-reverse': 'partner-marquee-reverse 36s linear infinite',
        'partner-marquee-reverse-offset':
          'partner-marquee-reverse-offset 36s linear infinite'
      },
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px'
      },
      fontSize: {
        h1: ['2.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        h2: ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        h3: ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        h4: ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        h5: ['1.125rem', { lineHeight: '1.45', fontWeight: '600' }],
        h6: ['1rem', { lineHeight: '1.5', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        small: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }]
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
