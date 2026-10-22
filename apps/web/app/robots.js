

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/checkout',
          '/account/orders/*',
          '/account/returns/*',
          '/admin/*',
          '/api/*',
        ],
      },
    ],
    sitemap: 'https://nexusmarket.in/sitemap.xml',
  };
}
