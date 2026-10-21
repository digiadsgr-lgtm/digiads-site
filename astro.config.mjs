// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.digiads.gr',
  adapter: vercel(),
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/support-ticket'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});