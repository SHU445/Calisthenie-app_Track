/** @type {import('next-sitemap').IConfig} */
const siteUrl = 'https://calisthenie-track.vercel.app';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: true, // désactive l'index, un seul sitemap simple
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/api/*',
    '/auth/*',
    '/entrainements/modifier/*',
    '/exercices/modifier/*',
    '/exercices/ajouter',
    '/entrainements/ajouter',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/'],
      },
    ],
  },
};
