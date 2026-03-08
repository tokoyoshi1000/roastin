export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://roastin.me/sitemap.xml',
    host: 'https://roastin.me',
  }
}
