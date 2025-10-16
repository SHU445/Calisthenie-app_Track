/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://calisthenie-tracker.vercel.app/",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
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
        disallow: ['/api/', '/auth/', '/*.json$'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
    ],
    additionalSitemaps: [
      'https://calisthenie-tracker.vercel.app/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Définir les priorités et fréquences personnalisées
    let priority = 0.7;
    let changefreq = 'daily';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path === '/exercices') {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path === '/entrainements') {
      priority = 0.8;
      changefreq = 'daily';
    } else if (path === '/progres') {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path === '/rangs') {
      priority = 0.6;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq: changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
