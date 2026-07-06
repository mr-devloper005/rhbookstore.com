import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

// Renamed pair (user-visible): listing → Local Directory · pdf → Reference Library.
// Never uses the forbidden literal strings "Business Listing", "PDFs", or "Documents".
export const taskPageVoices = {
  article: {
    eyebrow: 'Reading desk',
    headline: 'Long-form reads and guides that reward attention.',
    description: 'Essays, explainers, and story-led posts. The layout reads like a publication, not a directory.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Reading surfaces get space, hierarchy, and fewer distractions.',
    chips: ['Editorial pacing', 'Topic filters', 'Long-read friendly'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Fast-moving notices, offers, and time-sensitive posts.',
    description: 'Content on the notice board scans quickly and leads to action, not decoration.',
    filterLabel: 'Filter notice category',
    secondaryNote: 'Prioritize urgency, short summaries, and direct browsing.',
    chips: ['Fast scan', 'Offers', 'Action cues'],
  },
  sbm: {
    eyebrow: 'Saved shelves',
    headline: 'A shelf of links, tools, and references worth keeping.',
    description: 'Saved links appear like curated collections — useful resources gathered in one place.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated resources need grouping and calm metadata.',
    chips: ['Collections', 'Resources', 'Reference flow'],
  },
  profile: {
    eyebrow: 'People and teams',
    headline: 'Profiles with identity, trust, and reputation cues.',
    description: 'Profile surfaces make people, brands, and teams feel discoverable rather than buried in a generic feed.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'Make identity and credibility visible before the grid begins.',
    chips: ['Identity first', 'Trust cues', 'Team & brand cards'],
  },
  pdf: {
    eyebrow: 'Reference library',
    headline: 'A library of download-ready references, guides, and reports.',
    description: 'Every entry in the reference library is presented with file-context and clear browsing.',
    filterLabel: 'Filter reference type',
    secondaryNote: 'Reference surfaces need archive cues, file context, and clear browsing.',
    chips: ['Download-ready', 'Guides', 'Archive ready'],
  },
  listing: {
    eyebrow: 'Local directory',
    headline: 'A directory built for discovery and comparison.',
    description: 'Entries in the local directory behave like a proper directory — trust cues, metadata, and a practical search rhythm.',
    filterLabel: 'Filter directory category',
    secondaryNote: 'Prioritize comparison, location, and direct action paths.',
    chips: ['Directory', 'Compare', 'Local discovery'],
  },
  image: {
    eyebrow: 'Visual desk',
    headline: 'Image posts with a gallery-first browsing rhythm.',
    description: 'Image pages lead with visual impact, stronger cards, and a portfolio-like flow.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let images carry the page before long text does.',
    chips: ['Gallery', 'Visual-first', 'Portfolio mood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
