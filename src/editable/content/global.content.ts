import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A local directory + reference library',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Local directory · Reference library',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Submit', href: '/create' },
      secondary: { label: 'Search', href: '/search' },
    },
  },
  footer: {
    tagline: 'A directory for local places, a library for useful references.',
    description: `${slot4BrandConfig.siteName} is a paired platform for discovering places nearby and downloading reference guides — one calm surface for both.`,
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'Local Directory', href: '/listing' },
          { label: 'Reference Library', href: '/pdf' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Local directory · Reference library',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
