// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://www.meunomeok.com.br',
  integrations: [
    react(),
    tailwind({
      configFile: './tailwind.config.cjs',
      applyBaseStyles: false
    }),
    sitemap({
      i18n: {
        defaultLocale: 'pt-BR',
        locales: {
          'pt-BR': 'pt-br'
        }
      }
    }),
    compress(
      /** @type {any} */ ({
        css: true,
        html: true,
        img: false,
        svg: true
      })
    )
  ],
  output: 'static',
  build: {
    format: 'directory'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            forms: ['react-hook-form', '@hookform/resolvers', 'zod']
          }
        }
      }
    },
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
    },
    resolve: {
      alias: {
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@styles': '/src/styles',
        '@utils': '/src/utils',
        '@content': '/src/content',
        '@config': '/src/config',
        '@lib': '/src/lib'
      }
    },
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'Meu Nome OK',
          short_name: 'MeuNomeOK',
          description:
            'Solução moderna para negociação de dívidas e limpeza do seu nome com especialistas.',
          theme_color: '#662ae7',
          background_color: '#f9fafb',
          display: 'standalone',
          lang: 'pt-BR',
          icons: [
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ]
  }
});
