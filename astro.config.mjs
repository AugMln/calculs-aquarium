// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO : remplacer par le vrai domaine une fois acheté (utilisé pour le sitemap et les URL canoniques).
const SITE = 'https://calcul-aquarium.example';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  trailingSlash: 'never',
  build: { format: 'file' },
});
