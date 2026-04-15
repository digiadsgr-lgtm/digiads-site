// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.digiads.gr',
  integrations: [react(), sitemap()],
  redirects: {
    '/digital-marketing/google-ads-management/': {
      status: 301,
      destination: '/digital-marketing/performance-marketing'
    },
    '/touristiko-marketing-epitixias/': {
      status: 301,
      destination: '/touristiko-marketing'
    },
    '/digital-marketing/villa-hotel-promotion/': {
      status: 301,
      destination: '/touristiko-marketing'
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
});