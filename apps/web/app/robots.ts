import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
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
