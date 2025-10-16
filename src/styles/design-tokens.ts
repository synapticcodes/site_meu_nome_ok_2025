export const colors = {
  primary: {
    base: '#662ae7',
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
} as const;

export const typography = {
  h1: { size: '2.5rem', lineHeight: '1.1', fontWeight: '700' },
  h2: { size: '2rem', lineHeight: '1.2', fontWeight: '700' },
  h3: { size: '1.5rem', lineHeight: '1.3', fontWeight: '600' },
  h4: { size: '1.25rem', lineHeight: '1.4', fontWeight: '600' },
  h5: { size: '1.125rem', lineHeight: '1.45', fontWeight: '600' },
  h6: { size: '1rem', lineHeight: '1.5', fontWeight: '600' },
  body: { size: '1rem', lineHeight: '1.6', fontWeight: '400' },
  small: { size: '0.875rem', lineHeight: '1.5', fontWeight: '400' }
} as const;

export const spacing = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem',
  24: '6rem'
} as const;

export const shadows = {
  soft: '0 10px 30px -15px rgba(102, 42, 231, 0.3)',
  outline: '0 0 0 3px rgba(102, 42, 231, 0.25)'
} as const;

export const breakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1440
} as const;
