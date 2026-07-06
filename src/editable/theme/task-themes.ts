import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Task surfaces — one shared visual language.

  Every task (archive + detail) shares one cohesive identity:
    #F3E4C9 cream paper · #0A2947 deep navy ink · #D3D4C0 sage separators ·
    #8B5E3C warm brown accent. Space Grotesk display + Inter body.
  Only the per-task copy (kicker / note) varies so each section keeps a little
  voice. Tokens are delivered via CSS variables (`--tk-*`).
*/

export type TaskTheme = {
  /** short flavour word shown as an eyebrow kicker */
  kicker: string
  /** one-line mood note for the page intro */
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY = "'Space Grotesk', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
const BODY = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// Shared palette — deep navy ink, warm cream paper, sage separators, warm brown accent.
const base = {
  dark: false,
  fontDisplay: DISPLAY,
  fontBody: BODY,
  bg: '#f3e4c9',
  surface: '#fbf4e2',
  raised: '#eddcbe',
  text: '#0a2947',
  muted: '#4a5c72',
  line: '#d3d4c0',
  accent: '#8b5e3c',
  accentSoft: '#ead8c1',
  onAccent: '#f3e4c9',
  glow: 'rgba(139,94,60,0.12)',
  radius: '1.25rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Field Notes', note: 'Long-form reads, guides and stories worth your time.' },
  listing: { ...base, kicker: 'Local Directory', note: 'Find, compare and connect with places near you.' },
  classified: { ...base, kicker: 'Notice Board', note: 'Fresh offers and postings, ready to act on.' },
  image: { ...base, kicker: 'Visual Desk', note: 'A visual feed of standout images and galleries.' },
  sbm: { ...base, kicker: 'Saved Links', note: 'Curated resources and links worth keeping.' },
  pdf: { ...base, kicker: 'Reference Library', note: 'Download-ready guides, reports and reference files.' },
  profile: { ...base, kicker: 'Profiles', note: 'Discover the people and teams behind the work.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    // Re-point the shared article-body accent vars so post HTML (headings,
    // links) inherits this task's accent instead of the global site accent.
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
