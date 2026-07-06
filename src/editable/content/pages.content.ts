import { slot4BrandConfig } from '@/editable/theme/brand.config'

// Copy for a Local Directory + Reference Library platform.
// Never uses the forbidden literal strings "Business Listing", "PDFs", or "Documents"
// in user-visible fields.
export const pagesContent = {
  home: {
    metadata: {
      title: 'Local directory + reference library',
      description: `Find places near you and download useful references — one calm surface for discovery. ${slot4BrandConfig.siteName}.`,
      openGraphTitle: 'Local directory + reference library',
      openGraphDescription: 'Discover places nearby and download reference guides through one connected experience.',
      keywords: ['local directory', 'reference library', 'places near me', 'guides and reports', 'discovery platform'],
    },
    hero: {
      badge: 'Local directory · Reference library',
      title: ['A calmer way to find places', 'and useful references.'],
      description: 'Search the local directory for places nearby, or open the reference library for download-ready guides and reports — all in one clean surface.',
      primaryCta: { label: 'Browse the directory', href: '/listing' },
      secondaryCta: { label: 'Open the library', href: '/pdf' },
      searchPlaceholder: 'Search places, guides, and references',
      focusLabel: 'Focus',
      featureCardBadge: 'latest across the platform',
      featureCardTitle: 'Fresh entries shape the top of the page.',
      featureCardDescription: 'Recent additions in the directory and library stay at the center of the experience.',
    },
    intro: {
      badge: 'What this is',
      title: 'A paired platform for local discovery and download-ready references.',
      paragraphs: [
        'The directory helps you find places near you with the metadata that actually matters — location, hours, contact, and links.',
        'The reference library gathers guides and reports as clean, download-ready files with file-context and clear browsing.',
        'Both sit on one connected navigation so switching between "find a place" and "grab a reference" is a single step.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Local directory with practical metadata and comparison flow.',
        'Reference library with file-context, preview, and download-ready files.',
        'One calm navigation across both surfaces.',
        'Community-vetted entries with lightweight trust signals.',
      ],
      primaryLink: { label: 'Browse the directory', href: '/listing' },
      secondaryLink: { label: 'Open the library', href: '/pdf' },
    },
    cta: {
      badge: 'Get involved',
      title: 'Submit a place or a reference worth sharing.',
      description: 'Add an entry to the local directory or contribute a reference to the library — either takes a few minutes.',
      primaryCta: { label: 'Submit an entry', href: '/create' },
      secondaryCta: { label: 'Talk to us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest in {label}',
      descriptionSuffix: 'Newest additions in this collection.',
    },
  },
  about: {
    badge: 'Our approach',
    title: 'A calmer, clearer way to find places and references.',
    description: `${slot4BrandConfig.siteName} pairs a local directory with a reference library so discovery and download live in one place.`,
    paragraphs: [
      'Instead of splitting local discovery from reference material across separate sites, we keep them on one connected surface.',
      'Whether you arrive looking for a place nearby or a downloadable guide, the navigation lets you switch tracks without losing context.',
      'Every entry is community-vetted and reviewed before publishing — a lightweight but consistent editorial pass.',
    ],
    values: [
      {
        title: 'Discovery-first layout',
        description: 'Both the directory and the library privilege clarity, hierarchy, and clean browsing over decoration.',
      },
      {
        title: 'Connected content surfaces',
        description: 'Directory entries and reference files sit under one navigation so exploration stays natural.',
      },
      {
        title: 'Community-vetted entries',
        description: 'Every submission is reviewed before publishing — a small editorial pass that keeps the platform trustworthy.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Reach the right lane, not a generic inbox.',
    description: 'Tell us what you\'re trying to add, correct, or discuss. We route each request to the person best-suited to reply.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search across the local directory and the reference library — places, references, and posts in one query.',
    },
    hero: {
      badge: 'Search everything',
      title: 'Find places and references, fast.',
      description: 'Use keywords, category, or collection filters to pull results from the directory and the library at once.',
      placeholder: 'Search by keyword, category, or title',
    },
    resultsTitle: 'Latest across the platform',
  },
  create: {
    metadata: {
      title: 'Submit an entry',
      description: 'Submit a new place, reference, or post to the platform.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit an entry.',
      description: 'Use your account to open the contributor workspace and add a place or reference to the platform.',
    },
    hero: {
      badge: 'Contributor workspace',
      title: 'Add a place, a reference, or a post.',
      description: 'Pick a collection, fill in the essentials, and prepare a clean entry with the details that help discovery.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Submit entry',
    successTitle: 'Entry submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to your account.',
      badge: 'Member access',
      title: 'Welcome back to the contributor space.',
      description: 'Sign in to continue browsing, managing submissions, and adding new entries from your account.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then sign in.',
      success: 'Signed in. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create an account to contribute entries.',
      badge: 'Get started',
      title: 'Create your account and start contributing.',
      description: 'Create an account to open the contributor workspace, save drafts, and submit entries across the platform.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related reads',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'More in the directory',
      fallbackTitle: 'Directory entry',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested reads',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
