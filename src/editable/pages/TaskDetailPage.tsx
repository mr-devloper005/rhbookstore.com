import { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowUpRight, BadgeCheck, Bookmark, Camera, CheckCircle2, Clock,
  Download, ExternalLink, FileText, Globe2, Layers, Mail, MapPin, Phone,
  ShieldCheck, Tag, UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pastelFor } from '@/editable/cards/PostCards'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
/**
 * Format a byte count as a compact human-readable string
 * (e.g. 1536 → "1.5 KB", 4_800_000 → "4.6 MB").
 * Returns '' for invalid input so callers can fall back to their placeholder.
 */
const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return ''
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let i = 0
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i += 1
  }
  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10
  return `${rounded} ${units[i]}`
}

/**
 * HEAD-fetch the file URL to read its real Content-Length header, then format.
 * Memoized per request via React.cache so the same URL isn't hit twice in one render.
 * Silently returns '' on network / HEAD-not-supported / non-numeric headers.
 */
const fetchRealFileSize = cache(async (url: string): Promise<string> => {
  if (!url || !/^https?:\/\//i.test(url)) return ''
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4000)
    let response = await fetch(url, { method: 'HEAD', signal: controller.signal, redirect: 'follow' })
    // Some CDNs disallow HEAD — fall back to a ranged GET that only pulls the first byte.
    if (!response.ok || !response.headers.get('content-length')) {
      response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
        headers: { Range: 'bytes=0-0' },
      })
    }
    clearTimeout(timer)
    const contentRange = response.headers.get('content-range')
    const contentLength = response.headers.get('content-length')
    // "bytes 0-0/12345" — pull the total after the slash.
    let total = 0
    if (contentRange && /\/\d+$/.test(contentRange)) {
      total = Number(contentRange.split('/').pop())
    } else if (contentLength) {
      total = Number(contentLength)
    }
    return formatBytes(total)
  } catch {
    return ''
  }
})

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const theme = getTaskTheme(task)
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="editable-mono inline-flex items-center gap-1.5 text-[0.7rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-3.5 w-3.5" /> Back to {theme.kicker}
    </Link>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-7' : 'text-[1.0625rem] leading-8'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

/* ==========================================================================
   ARTICLE — quiet centered reading column
   ========================================================================== */
function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
        <BackLink task="article" />
        <EditableReveal>
          <p className="editable-mono mt-10 text-[0.7rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-accent)]">◆ {categoryOf(post, 'Article')}</p>
          <h1 className="editable-display mt-5 text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]">{post.title}</h1>
        </EditableReveal>
        {images[0] ? <img src={images[0]} alt="" className="mt-10 aspect-[16/9] w-full rounded-[20px] border border-[var(--tk-line)] object-cover" /> : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ==========================================================================
   LISTING — premium directory record (spec: hero image, quick facts,
   body + gallery, inline map, sticky sidebar w/ contact + trust + ad,
   related "More directory" strip)
   ========================================================================== */
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const theme = getTaskTheme('listing')
  const images = getImages(post)
  const hero = images[0]
  const gallery = images.slice(1, 7)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'openHours', 'schedule'])
  const category = getField(post, ['category']) || post.tags?.[0] || ''
  const mapSrc = mapSrcFor(post)
  const tags = Array.isArray(post.tags) ? post.tags.filter(Boolean).slice(0, 8) : []

  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:px-8 sm:py-20 lg:px-10">
      <BackLink task="listing" />

      {/* Chip row + display-scale h1 + lead */}
      <EditableReveal>
        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <span
            className="editable-mono rounded-lg px-3 py-1.5 text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-text)]"
            style={{ backgroundColor: pastelFor(post.slug || post.title) }}
          >
            ◆ {theme.kicker}
          </span>
          {category ? (
            <span className="editable-mono rounded-lg border border-[var(--tk-line)] px-3 py-1.5 text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-muted)]">
              {category}
            </span>
          ) : null}
          <span className="editable-mono inline-flex items-center gap-1.5 rounded-lg border border-[var(--tk-line)] px-3 py-1.5 text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-accent)]">
            <BadgeCheck className="h-3.5 w-3.5" /> Verified entry
          </span>
        </div>
        <h1 className="editable-display mt-6 text-balance text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[3.75rem] lg:text-[4.75rem]">
          {post.title}
        </h1>
        {leadText(post) ? <p className="mt-6 max-w-3xl text-lg leading-[1.6] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
      </EditableReveal>

      {/* Hero image — 16:9 */}
      {hero ? (
        <EditableReveal index={1}>
          <div className="mt-10 overflow-hidden rounded-[24px] border border-[var(--tk-line)]">
            <img src={hero} alt="" className="aspect-[16/9] w-full object-cover" />
          </div>
        </EditableReveal>
      ) : null}

      {/* Quick-facts strip */}
      <EditableReveal index={2}>
        <div className="mt-10 grid gap-3 rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 sm:grid-cols-2 lg:grid-cols-4">
          <QuickFact icon={MapPin} label="Location" value={address || 'Not disclosed'} />
          <QuickFact icon={Phone} label="Phone" value={phone || 'On request'} />
          <QuickFact icon={Clock} label="Hours" value={hours || 'By appointment'} />
          <QuickFact icon={ShieldCheck} label="Verified" value="Reviewed" />
        </div>
      </EditableReveal>

      {/* Body + sidebar */}
      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
        <article className="min-w-0">
          <EditableReveal>
            <h2 className="editable-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2.5rem]">About this place</h2>
          </EditableReveal>
          <BodyContent post={post} />

          {tags.length ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={tag}
                  className="editable-mono rounded-lg px-3 py-1.5 text-[0.65rem] font-normal uppercase tracking-[0.16em] text-[var(--tk-text)]"
                  style={{ backgroundColor: pastelFor(tag + i) }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          {/* Photo gallery under body */}
          {gallery.length ? (
            <section className="mt-12">
              <p className="editable-mono text-[0.68rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-accent)]">◆ Gallery</p>
              <h3 className="editable-display mt-3 text-2xl font-semibold tracking-[-0.015em]">More views</h3>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((image, index) => (
                  <img key={`${image}-${index}`} src={image} alt="" className="aspect-square rounded-[16px] border border-[var(--tk-line)] object-cover" />
                ))}
              </div>
            </section>
          ) : null}

          {mapSrc ? (
            <section className="mt-12">
              <p className="editable-mono text-[0.68rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-accent)]">◆ Find it</p>
              <div className="mt-4 overflow-hidden rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <iframe src={mapSrc} title="Map" loading="lazy" className="h-80 w-full border-0" />
              </div>
            </section>
          ) : null}
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Contact card */}
          <div className="rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
            <p className="editable-mono text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-muted)]">◆ Get in touch</p>
            <h3 className="editable-display mt-3 text-xl font-semibold tracking-[-0.015em]">Contact card</h3>
            <div className="mt-5 space-y-3">
              {address ? <ContactRow icon={MapPin} label="Address" value={address} /> : null}
              {phone ? <ContactRow icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} /> : null}
              {email ? <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} /> : null}
              {website ? <ContactRow icon={Globe2} label="Website" value={website.replace(/^https?:\/\//, '')} href={website} external /> : null}
              {hours ? <ContactRow icon={Clock} label="Hours" value={hours} /> : null}
            </div>
            {(website || phone) ? (
              <Link
                href={website || `tel:${phone}`}
                {...(website ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--tk-text)] px-5 py-3 text-sm font-medium text-[var(--tk-bg)] transition hover:opacity-90"
              >
                {website ? 'Visit website' : 'Call now'} <ArrowUpRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>

          {/* Trust panel */}
          <div className="rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
            <p className="editable-mono text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-muted)]">◆ Trust signals</p>
            <div className="mt-5 space-y-3">
              <TrustRow icon={ShieldCheck} title="Verified entry" note={`Reviewed by ${SITE_CONFIG.name} editors.`} />
              <TrustRow icon={CheckCircle2} title="Contact confirmed" note="Phone, email, or website reachable at submission." />
              <TrustRow icon={BadgeCheck} title="Community-vetted" note="Listed after review of the submission." />
            </div>
          </div>

          {/* Listing detail → sidebar ad. */}
          <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel />
        </aside>
      </div>

      <RelatedStrip task="listing" related={related} />
    </section>
  )
}

/* ==========================================================================
   PDF — premium document workspace (spec: chip row w/ theme.kicker + PDF +
   category, VERY LARGE h1, lead as pull-quote, dual CTA, quick facts,
   large iframe centerpiece, two-column body, tag chips, repeated CTA callout,
   article-bottom ad, sticky sidebar w/ document identity + Download +
   What's inside, related strip w/ document glyphs — NO photography anywhere
   in the article column except the sidebar identity glyph.)
   ========================================================================== */
async function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const theme = getTaskTheme('pdf')
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const filename = getField(post, ['filename', 'fileName']) || (post.slug ? `${post.slug}.pdf` : 'reference.pdf')
  const category = getField(post, ['category']) || post.tags?.[0] || 'Reference'
  const pages = getField(post, ['pages', 'pageCount']) || '—'
  // Prefer the real HEAD-fetched file size; fall back to any pre-set field on the post.
  const realSize = await fetchRealFileSize(fileUrl)
  const size = realSize || getField(post, ['size', 'fileSize']) || '—'
  const uploader = getField(post, ['author', 'uploader', 'submittedBy']) || SITE_CONFIG.name
  const updated = getField(post, ['updated', 'lastUpdated', 'revised']) || '—'
  const tags = Array.isArray(post.tags) ? post.tags.filter(Boolean).slice(0, 8) : []
  const insideRaw = getField(post, ['whatsInside', 'sections', 'toc']) || ''
  const insideItems = insideRaw ? insideRaw.split(/\n|,|;|·/).map((s) => s.trim()).filter(Boolean).slice(0, 6) : []
  const insideFallback = ['Executive summary', 'Key concepts', 'Case examples', 'References']

  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:px-8 sm:py-20 lg:px-10">
      <BackLink task="pdf" />

      {/* Chip row: theme kicker + PDF badge + category */}
      <EditableReveal>
        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <span
            className="editable-mono rounded-lg px-3 py-1.5 text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-text)]"
            style={{ backgroundColor: pastelFor(post.slug || post.title) }}
          >
            ◆ {theme.kicker}
          </span>
          <span className="editable-mono rounded-lg border border-[var(--tk-line)] px-3 py-1.5 text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-text)]">
            Reference document
          </span>
          <span className="editable-mono rounded-lg border border-[var(--tk-line)] px-3 py-1.5 text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-muted)]">
            {category}
          </span>
        </div>
        {/* Very large h1 — bigger than listing */}
        <h1 className="editable-display mt-7 text-balance text-[3.25rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-[4.25rem] lg:text-[5.75rem]">
          {post.title}
        </h1>
      </EditableReveal>

      {/* Lead paragraph as pull-quote */}
      {leadText(post) ? (
        <EditableReveal index={1}>
          <blockquote className="editable-display mt-10 max-w-4xl border-l-4 border-[var(--tk-accent)] pl-6 text-[1.5rem] font-medium leading-[1.35] tracking-[-0.01em] text-[var(--tk-text)] sm:text-[1.875rem]">
            {leadText(post)}
          </blockquote>
        </EditableReveal>
      ) : null}

      {/* Dual CTA */}
      <EditableReveal index={2}>
        <div className="mt-10 flex flex-wrap gap-3">
          {fileUrl ? (
            <>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-[var(--tk-text)] px-6 py-3.5 text-sm font-medium text-[var(--tk-bg)] transition hover:opacity-90">
                Download PDF <Download className="h-4 w-4" />
              </Link>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[var(--tk-line)] bg-[var(--tk-surface)] px-6 py-3.5 text-sm font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-text)]">
                Open in new tab <ExternalLink className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <span className="editable-mono text-[0.7rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-muted)]">File pending upload</span>
          )}
        </div>
      </EditableReveal>

      {/* Quick facts */}
      <EditableReveal index={3}>
        <div className="mt-10 grid gap-3 rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 sm:grid-cols-2 lg:grid-cols-2">
         
          <QuickFact icon={FileText} label="File size" value={size} />
          <QuickFact icon={Tag} label="Format" value="PDF" />
          
        </div>
      </EditableReveal>

      {/* Body row: preview + sidebar */}
      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
        <article className="min-w-0">
          {/* Large PDF preview centerpiece — the article's ONLY visual */}
          {fileUrl ? (
            <EditableReveal>
              <div className="overflow-hidden rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <div className="editable-mono flex items-center justify-between gap-3 border-b border-[var(--tk-line)] px-4 py-3 text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-muted)]">
                  <span>◆ Preview</span>
                  <span>{filename}</span>
                </div>
                <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[84vh] w-full bg-[var(--tk-raised)]" />
              </div>
            </EditableReveal>
          ) : (
            <div className="editable-mono rounded-[24px] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] p-16 text-center text-[0.7rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-muted)]">
              Preview will appear once a file is attached.
            </div>
          )}

          {/* Two-column body under preview */}
          <section className="mt-14">
            <EditableReveal>
              <h2 className="editable-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2.75rem]">Inside this reference</h2>
            </EditableReveal>
            <div className="mt-8 grid gap-10 md:grid-cols-2">
              <div className="min-w-0">
                <BodyContent post={post} />
              </div>
              <div className="min-w-0 space-y-6">
                {tags.length ? (
                  <div>
                    <p className="editable-mono text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-accent)]">◆ Topics covered</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag, i) => (
                        <span
                          key={tag}
                          className="editable-mono rounded-lg px-3 py-1.5 text-[0.65rem] font-normal uppercase tracking-[0.16em] text-[var(--tk-text)]"
                          style={{ backgroundColor: pastelFor(tag + i) }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
                  <p className="editable-mono text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-muted)]">◆ Attribution</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--tk-text)]">
                    Compiled and shared through the {SITE_CONFIG.name} {theme.kicker.toLowerCase()}. Full credit to the original source.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Repeated CTA callout at bottom of article */}
          {fileUrl ? (
            <EditableReveal>
              <div className="mt-14 rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-text)] p-8 text-[var(--tk-bg)] sm:p-10">
                <p className="editable-mono text-[0.65rem] font-normal uppercase tracking-[0.18em] text-white/55">◆ Take it with you</p>
                <h3 className="editable-display mt-3 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2.25rem]">Download the full reference.</h3>
                <p className="mt-3 max-w-lg text-sm leading-6 text-white/70">Grab the full reference to keep, print, or share.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-[var(--tk-bg)] px-6 py-3.5 text-sm font-medium text-[var(--tk-text)] transition hover:opacity-90">
                    Download PDF <Download className="h-4 w-4" />
                  </Link>
                  <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/10">
                    Open in new tab <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </EditableReveal>
          ) : null}

          {/* Reference-Library detail → article-bottom ad, before related strip */}
          <div className="mt-14">
            <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel />
          </div>
        </article>

        {/* Sticky sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Document identity block */}
          <div className="rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
            <div
              className="editable-display flex h-28 w-full items-center justify-center rounded-[16px] text-[3rem] font-semibold tracking-[-0.02em] text-[var(--tk-text)]"
              style={{ backgroundColor: pastelFor(post.slug || post.title) }}
              aria-hidden
            >
              PDF
            </div>
            <p className="editable-mono mt-5 truncate text-[0.68rem] font-normal uppercase tracking-[0.16em] text-[var(--tk-muted)]">{filename}</p>
            <div className="editable-mono mt-5 space-y-3 border-t border-[var(--tk-line)] pt-5 text-[0.7rem] uppercase tracking-[0.14em]">
              <MetaRow label="Category" value={category} />
             
              <MetaRow label="File size" value={size} />
              <MetaRow label="Uploaded by" value={uploader} />
             
            </div>
            {fileUrl ? (
              <Link
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--tk-text)] px-5 py-3.5 text-sm font-medium text-[var(--tk-bg)] transition hover:opacity-90"
              >
                Download <Download className="h-4 w-4" />
              </Link>
            ) : null}
          </div>

          {/* What's inside */}
          <div className="rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
            <p className="editable-mono text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-muted)]">◆ What&apos;s inside</p>
            <ul className="mt-4 space-y-2.5">
              {(insideItems.length ? insideItems : insideFallback).map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-[var(--tk-text)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Related documents strip — glyph tiles, NO photography */}
      <PdfRelatedStrip related={related} />
    </section>
  )
}

function PdfRelatedStrip({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  const theme = getTaskTheme('pdf')
  const taskConfig = getTaskConfig('pdf')
  return (
    <section className="border-t border-[var(--tk-line)] pt-14 sm:pt-20 mt-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="editable-mono text-[0.68rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-accent)]">◆ More references</p>
          <h2 className="editable-display mt-3 text-[2rem] font-semibold tracking-[-0.02em] sm:text-[2.5rem]">More in the {theme.kicker}</h2>
        </div>
        <Link href={taskConfig?.route || '/'} className="editable-mono inline-flex items-center gap-1.5 text-[0.7rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-text)] hover:text-[var(--tk-accent)]">
          View all <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((item) => {
          const size = getField(item, ['size', 'fileSize'])
          const href = `${getTaskConfig('pdf')?.route || '/pdf'}/${item.slug}`
          return (
            <Link key={item.id || item.slug} href={href} className="group flex flex-col overflow-hidden rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-30px_rgba(35,31,35,0.4)]">
              <div
                className="editable-display flex h-24 w-full items-center justify-center rounded-[14px] text-2xl font-semibold tracking-[-0.02em] text-[var(--tk-text)]"
                style={{ backgroundColor: pastelFor(item.slug || item.title) }}
                aria-hidden
              >
                PDF
              </div>
              <h3 className="editable-display mt-5 line-clamp-3 text-base font-semibold leading-[1.2] tracking-[-0.01em]">{item.title}</h3>
              <div className="editable-mono mt-4 flex items-center justify-between text-[0.6rem] font-normal uppercase tracking-[0.16em] text-[var(--tk-muted)]">
                <span className="rounded-lg border border-[var(--tk-line)] px-2 py-1">{size || '— MB'}</span>
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

/* ==========================================================================
   CLASSIFIED — price-forward
   ========================================================================== */
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const theme = getTaskTheme('classified')
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-6 py-14 sm:px-8 sm:py-20 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <div className="mt-7 rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
            <p className="editable-mono text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-accent)]">◆ {theme.kicker}</p>
            <h1 className="editable-display mt-4 text-2xl font-semibold leading-tight tracking-[-0.015em]">{post.title}</h1>
            <p className="editable-display mt-6 text-[2.75rem] font-semibold tracking-[-0.03em] text-[var(--tk-text)]">{price || 'Open offer'}</p>
            <div className="mt-6 space-y-2.5">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-lg bg-[var(--tk-text)] px-5 py-2.5 text-sm font-medium text-[var(--tk-bg)] transition hover:opacity-90"><Phone className="h-4 w-4" /> Call now</a> : null}
              {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-lg border border-[var(--tk-line)] px-5 py-2.5 text-sm font-medium transition hover:border-[var(--tk-text)]"><Mail className="h-4 w-4" /> Email</a> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          {images.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {images.slice(0, 4).map((image, i) => <img key={`${image}-${i}`} src={image} alt="" className="aspect-[4/3] rounded-[20px] border border-[var(--tk-line)] object-cover" />)}
            </div>
          ) : null}
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* ==========================================================================
   IMAGE — gallery
   ========================================================================== */
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const theme = getTaskTheme('image')
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:px-8 sm:py-20 lg:px-10">
        <BackLink task="image" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="editable-mono inline-flex items-center gap-2 rounded-lg border border-[var(--tk-line)] px-3 py-1.5 text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-muted)]">
              <Camera className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> ◆ {theme.kicker}
            </div>
            <h1 className="editable-display mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{post.title}</h1>
            {leadText(post) ? <p className="mt-6 text-lg leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* ==========================================================================
   BOOKMARK
   ========================================================================== */
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const theme = getTaskTheme('sbm')
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <BackLink task="sbm" />
        <div
          className="mt-10 flex h-16 w-16 items-center justify-center rounded-[16px] text-[var(--tk-text)]"
          style={{ backgroundColor: pastelFor(post.slug || post.title) }}
        >
          <Bookmark className="h-7 w-7" />
        </div>
        <p className="editable-mono mt-6 text-[0.68rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-accent)]">◆ {theme.kicker}</p>
        <h1 className="editable-display mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{post.title}</h1>
        {leadText(post) ? <p className="mt-6 text-lg leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--tk-text)] px-5 py-3 text-sm font-medium text-[var(--tk-bg)] transition hover:opacity-90">
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <BodyContent post={post} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* ==========================================================================
   PROFILE
   ========================================================================== */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const theme = getTaskTheme('profile')
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:px-8 sm:py-20 lg:px-10">
        <BackLink task="profile" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />}
              </div>
              <h1 className="editable-display mt-6 text-2xl font-semibold tracking-[-0.015em]">{post.title}</h1>
              {role ? <p className="editable-mono mt-2 text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-accent)]">{role}</p> : null}
              <ContactAction website={website} email={email} bare />
            </div>
          </aside>
          <article className="min-w-0">
            <p className="editable-mono text-[0.68rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-accent)]">◆ {theme.kicker}</p>
            <BodyContent post={post} />
            {images.slice(1).length ? (
              <section className="mt-10">
                <p className="editable-mono text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-muted)]">◆ Gallery</p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {images.slice(1, 9).map((image, i) => <img key={`${image}-${i}`} src={image} alt="" className="aspect-[4/3] rounded-[16px] border border-[var(--tk-line)] object-cover" />)}
                </div>
              </section>
            ) : null}
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* ==========================================================================
   Shared primitives
   ========================================================================== */
function QuickFact({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="editable-mono flex items-center gap-2 text-[0.62rem] font-normal uppercase tracking-[0.16em] text-[var(--tk-muted)]">
        <Icon className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {label}
      </p>
      <p className="mt-2 truncate text-sm font-medium leading-6 text-[var(--tk-text)]">{value}</p>
    </div>
  )
}

function ContactRow({ icon: Icon, label, value, href, external }: { icon: typeof MapPin; label: string; value: string; href?: string; external?: boolean }) {
  const inner = (
    <span className="flex min-w-0 items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--tk-raised)] text-[var(--tk-accent)]"><Icon className="h-4 w-4" /></span>
      <span className="min-w-0">
        <span className="editable-mono block text-[0.6rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-muted)]">{label}</span>
        <span className="mt-1 block truncate text-sm font-medium leading-5 text-[var(--tk-text)]">{value}</span>
      </span>
    </span>
  )
  if (!href) return <div>{inner}</div>
  return (
    <Link href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} className="block rounded-lg transition hover:bg-[var(--tk-raised)]">{inner}</Link>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[0.68rem]">
      <span className="text-[var(--tk-muted)]">{label}</span>
      <span className="truncate text-[var(--tk-text)]">{value}</span>
    </div>
  )
}

function TrustRow({ icon: Icon, title, note }: { icon: typeof MapPin; title: string; note: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--tk-raised)] text-[var(--tk-accent)]"><Icon className="h-4 w-4" /></span>
      <div className="min-w-0">
        <p className="text-sm font-medium leading-5 text-[var(--tk-text)]">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-[var(--tk-muted)]">{note}</p>
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[var(--tk-line)] bg-[var(--tk-raised)] px-4 py-3 text-sm">
      <span className="editable-mono text-[0.6rem] font-normal uppercase tracking-[0.16em] text-[var(--tk-muted)]">{label}</span>
      <span className="font-medium text-[var(--tk-text)]">{value}</span>
    </div>
  )
}

function ContactAction({ website, phone, email, bare = false }: { website?: string; phone?: string; email?: string; bare?: boolean }) {
  if (!website && !phone && !email) return null
  const buttons = (
    <div className={`flex flex-wrap gap-2.5 ${bare ? 'justify-center' : ''}`}>
      {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-[var(--tk-text)] px-4 py-2.5 text-sm font-medium text-[var(--tk-bg)] transition hover:opacity-90">Website <ExternalLink className="h-4 w-4" /></Link> : null}
      {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-lg border border-[var(--tk-line)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--tk-text)]"><Phone className="h-4 w-4" /> Call</a> : null}
      {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-lg border border-[var(--tk-line)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--tk-text)]"><Mail className="h-4 w-4" /> Email</a> : null}
    </div>
  )
  if (bare) return <div className="mt-6">{buttons}</div>
  return (
    <div className="mt-8 rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <p className="editable-mono text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-muted)]">◆ Quick actions</p>
      <div className="mt-4">{buttons}</div>
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const theme = getTaskTheme(task)
  const taskConfig = getTaskConfig(task)
  const more =
    task === 'listing' ? 'More in the directory'
    : task === 'sbm' ? 'More saved links'
    : `More ${theme.kicker.toLowerCase()}`
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="flex items-center justify-between">
          <h2 className="editable-display text-2xl font-semibold tracking-[-0.015em] sm:text-[2rem]">{more}</h2>
          <Link href={taskConfig?.route || '/'} className="editable-mono inline-flex items-center gap-1.5 text-[0.7rem] font-normal uppercase tracking-[0.18em] text-[var(--tk-text)] hover:text-[var(--tk-accent)]">View all <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  return (
    <Link href={href} className="group block overflow-hidden rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-30px_rgba(35,31,35,0.4)]">
      <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-[600ms] group-hover:scale-[1.03]" /> : <div className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[var(--tk-muted)]" /></div>}
      </div>
      <div className="p-5">
        <h3 className="editable-display line-clamp-2 text-base font-semibold leading-snug tracking-[-0.01em]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}
