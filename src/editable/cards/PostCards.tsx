import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

// Rotating pastel category tints — nerdstack's signature soft card colors.
const PASTELS = [
  'var(--slot4-mint)',
  'var(--slot4-sky)',
  'var(--slot4-peach)',
  'var(--slot4-orchid)',
  'var(--slot4-sand)',
] as const

export function pastelFor(seed: string | number) {
  const n = typeof seed === 'number'
    ? seed
    : Array.from(String(seed)).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return PASTELS[Math.abs(n) % PASTELS.length]
}

// Small trailing arrow — the reference's text-button affordance. Subtle nudge on hover.
function ArrowBadge({ tone = 'ink' }: { tone?: 'ink' | 'accent' }) {
  const cls =
    tone === 'accent'
      ? 'bg-[var(--slot4-accent-fill)] text-[var(--slot4-on-accent)]'
      : 'bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)]'
  return (
    <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${cls} transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}>
      <ArrowUpRight className="h-4 w-4" />
    </span>
  )
}

// Feature card — bordered-lift white panel with a cover image and a pastel
// category chip. Airy nerdstack treatment (not a dark image overlay).
export function EditorialFeatureCard({ post, href, label = 'Featured read' }: { post: SitePost; href: string; label?: string }) {
  const tint = pastelFor(post.slug || post.title || label)
  return (
    <Link href={href} className={`group flex h-full min-w-0 flex-col ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frameFull} aspect-[16/10]`}>
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-[600ms] group-hover:scale-[1.03]" />
        <span
          className="editable-mono absolute left-4 top-4 rounded-lg px-3 py-1.5 text-[0.64rem] font-normal uppercase tracking-[0.16em] text-[var(--slot4-page-text)]"
          style={{ backgroundColor: tint }}
        >
          {label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-7 sm:p-9">
        <h3 className="editable-display max-w-3xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-[2.5rem]">{post.title}</h3>
        <p className={`mt-4 max-w-2xl flex-1 text-sm leading-7 ${pal.mutedText} sm:text-base`}>{getEditableExcerpt(post, 190)}</p>
        <span className="mt-7 inline-flex w-fit items-center gap-2.5 text-sm font-medium text-[var(--slot4-page-text)]">
          Read more <ArrowBadge tone="accent" />
        </span>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} ${dc.media.ratio}`}>
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-[600ms] group-hover:scale-[1.03]" />
        <span className="editable-mono absolute left-3 top-3 rounded-lg bg-[var(--slot4-page-bg)]/95 px-2.5 py-1 text-[0.6rem] font-normal uppercase tracking-[0.16em] text-[var(--slot4-page-text)]">No. {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="p-5">
        <p className="editable-mono text-[0.68rem] font-normal uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
        <h3 className={`editable-display mt-3 line-clamp-3 text-xl font-semibold leading-[1.15] tracking-[-0.01em] ${pal.panelText}`}>{post.title}</h3>
        <p className={`mt-3 line-clamp-3 text-sm leading-6 ${pal.mutedText}`}>{getEditableExcerpt(post, 135)}</p>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 ${dc.surface.card} p-5 ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span
          className="editable-mono flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-normal text-[var(--slot4-page-text)]"
          style={{ backgroundColor: pastelFor(index) }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className="editable-mono text-[0.68rem] font-normal uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
          <h3 className={`editable-display mt-2 line-clamp-2 text-lg font-semibold leading-[1.15] tracking-[-0.01em] ${pal.panelText}`}>{post.title}</h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-6 ${pal.mutedText}`}>{getEditableExcerpt(post, 105)}</p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-5 overflow-hidden ${dc.surface.card} p-4 ${dc.motion.lift} sm:grid-cols-[240px_minmax(0,1fr)]`}>
      <div className={`${dc.media.frame} aspect-[16/12] sm:aspect-auto sm:min-h-[200px]`}>
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-[600ms] group-hover:scale-[1.03]" />
      </div>
      <div className="min-w-0 p-2 sm:py-4 sm:pr-5">
        <p className="editable-mono text-[0.68rem] font-normal uppercase tracking-[0.16em] text-[var(--slot4-accent)]">Read {String(index + 1).padStart(2, '0')}</p>
        <h2 className={`editable-display mt-3 line-clamp-3 text-2xl font-semibold leading-[1.1] tracking-[-0.015em] ${pal.panelText} sm:text-[1.75rem]`}>{post.title}</h2>
        <p className={`mt-4 line-clamp-3 text-sm leading-7 ${pal.mutedText}`}>{getEditableExcerpt(post, 180)}</p>
        <span className="mt-5 inline-flex items-center gap-2.5 text-sm font-medium text-[var(--slot4-page-text)]">Open <ArrowBadge /></span>
      </div>
    </Link>
  )
}
