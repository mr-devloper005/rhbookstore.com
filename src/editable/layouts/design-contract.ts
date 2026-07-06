import type { CSSProperties } from 'react'

/*
  Design contract — nerdstack-inspired rhythm on a 4-color palette:
    #0A2947 deep navy · #F3E4C9 warm cream · #D3D4C0 sage · #8B5E3C warm brown

  Cream page paper, deep-navy ink, sage separators, warm-brown accent.
  Space Grotesk display + Inter body + Fragment Mono labels.
  Soft-corner buttons (8px), bordered-lift cards on cream, refined scroll reveals.

  Every downstream component consumes these via the `--slot4-*` / `--editable-*`
  CSS variables, so the whole site re-skins from this one file.
*/

export const editableRootStyle = {
  // Palette: deep navy ink, warm cream paper, sage separators, warm brown accent.
  //   #0A2947 navy · #F3E4C9 cream · #D3D4C0 sage · #8B5E3C brown
  '--slot4-page-bg': '#f3e4c9',
  '--slot4-page-text': '#0a2947',
  '--slot4-panel-bg': '#fbf4e2',
  '--slot4-surface-bg': '#fbf4e2',
  '--slot4-muted-text': '#4a5c72',
  '--slot4-soft-muted-text': '#7a8a9d',
  '--slot4-accent': '#8b5e3c',
  '--slot4-accent-fill': '#8b5e3c',
  '--slot4-accent-soft': '#ead8c1',
  '--slot4-on-accent': '#f3e4c9',
  '--slot4-dark-bg': '#0a2947',
  '--slot4-dark-text': '#f3e4c9',
  '--slot4-media-bg': '#e5d7ba',
  '--slot4-cream': '#f3e4c9',
  '--slot4-warm': '#eddcbe',
  '--slot4-lavender': '#e6ebe0',
  '--slot4-gray': '#d3d4c0',
  // Category tints — rotating variations of the 4 palette anchors.
  '--slot4-mint': '#d3d4c0',
  '--slot4-sky': '#c6d3e1',
  '--slot4-peach': '#eddaba',
  '--slot4-orchid': '#d4b99c',
  '--slot4-sand': '#f3e4c9',
  '--slot4-coral': '#b87849',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#f3e4c9',
  '--editable-page-text': '#0a2947',
  '--editable-container': '1440px',
  '--editable-border': '#d3d4c0',
  '--editable-dark-border': '#1e3a5c',
  '--editable-nav-bg': '#f3e4c9',
  '--editable-nav-text': '#0a2947',
  '--editable-nav-active': '#8b5e3c',
  '--editable-nav-active-text': '#f3e4c9',
  '--editable-cta-bg': '#0a2947',
  '--editable-cta-text': '#f3e4c9',
  '--editable-search-bg': '#fbf4e2',
  '--editable-footer-bg': '#0a2947',
  '--editable-footer-text': '#f3e4c9',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-[var(--editable-dark-border)]',
  shadow: 'shadow-[0_1px_2px_rgba(35,31,35,0.04)]',
  shadowStrong: 'shadow-[0_30px_60px_-38px_rgba(35,31,35,0.5)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(26,23,26,0.05),rgba(26,23,26,0.72))]',
} as const

// Mono label font applied inline so components stay declarative.
const MONO = 'font-[family-name:var(--editable-font-mono)]'

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-6 sm:px-8 lg:px-10',
    sectionY: 'py-16 sm:py-24 lg:py-[7.5rem]',
    sectionYLg: 'py-20 sm:py-28 lg:py-[10rem]',
    sectionYSm: 'py-12 sm:py-16 lg:py-[4rem]',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[220px] shrink-0 snap-start sm:w-[250px]',
  },
  type: {
    // Fragment Mono eyebrow — uppercase, tracked, plum.
    eyebrow: `${MONO} inline-flex items-center gap-2 text-[0.72rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-accent)]`,
    label: `${MONO} text-[0.72rem] font-normal uppercase tracking-[0.18em]`,
    // Space Grotesk display — tight negative tracking on the big sizes.
    heroTitle:
      'editable-display text-[3.25rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[4rem] lg:text-[5.5rem]',
    sectionTitle:
      'editable-display text-[2.25rem] font-semibold leading-[1.06] tracking-[-0.02em] sm:text-[2.75rem] lg:text-[3rem]',
    subTitle: 'editable-display text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.015em] sm:text-[2.5rem]',
    body: 'text-base leading-[1.65] text-[var(--slot4-muted-text)] sm:text-[1.05rem]',
    // Emphasis in this reference = a word painted in the plum accent (not italic).
    emphasis: 'text-[var(--slot4-accent)]',
  },
  surface: {
    // Bordered-lift white card on cream — nerdstack's core card treatment.
    card: `rounded-[20px] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow} overflow-hidden`,
    soft: `rounded-[20px] border ${editablePalette.border} ${editablePalette.warmBg}`,
    dark: `rounded-[20px] ${editablePalette.darkBg} ${editablePalette.darkText}`,
  },
  button: {
    // Soft-corner buttons (8px) — the reference's shape. Ink primary, plum accent.
    primary:
      'group inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--slot4-page-text)] px-5 py-3 text-sm font-medium text-[var(--slot4-page-bg)] transition duration-300 hover:opacity-90 active:scale-[0.99]',
    secondary:
      'group inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-page-text)] active:scale-[0.99]',
    accent:
      'group inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--slot4-accent-fill)] px-5 py-3 text-sm font-medium text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-110 active:scale-[0.99]',
    ghost:
      'group inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-page-text)] underline-offset-[6px] transition duration-300 hover:text-[var(--slot4-accent)] hover:underline',
  },
  badge: {
    pill: `${MONO} inline-flex items-center gap-2 rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3 py-1.5 text-[0.68rem] font-normal uppercase tracking-[0.16em] text-[var(--slot4-page-text)]`,
    accentPill: `${MONO} inline-flex items-center gap-2 rounded-lg bg-[var(--slot4-accent-fill)] px-3 py-1.5 text-[0.68rem] font-normal uppercase tracking-[0.16em] text-[var(--slot4-on-accent)]`,
  },
  media: {
    frame: `relative overflow-hidden rounded-[16px] ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden ${editablePalette.mediaBg}`,
    ratio: 'aspect-[16/10]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_50px_-30px_rgba(35,31,35,0.45)]',
    fade: 'transition duration-300 hover:opacity-80',
    zoom: 'transition duration-[600ms] group-hover:scale-[1.03]',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all homepage sections consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so AI can redesign the whole home experience in one file.',
  'Use wide readable grids; never create skinny columns for paragraphs or cards.',
  'Use horizontal rails for dense post browsing.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
