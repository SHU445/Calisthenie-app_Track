/** @type {import('next-sitemap').IConfig} */

const dev = process.env.NODE_ENV !== 'production';

module.exports = {
  siteUrl: dev ? 'https://calisthenie-track.vercel.app' : 'https://calisthenie-track.vercel.app',
};