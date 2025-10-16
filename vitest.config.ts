import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/tests/setup.ts'],
    coverage: {
      reporter: ['text', 'html']
    }
  },
  resolve: {
    alias: {
      '@utils': '/src/utils',
      '@lib': '/src/lib',
      '@content': '/src/content',
      '@config': '/src/config'
    }
  }
});
