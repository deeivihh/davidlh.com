import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://davidlh.com',
      lastModified: new Date(),
    },
  ]
}