import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { pastelFor } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => {
  const raw = post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''
  return stripHtml(raw).replace(/\s+/g, ' ').trim()
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  // Renamed label — pull from theme kicker so listing/pdf show "Local Directory" / "Reference Library".
  const label = task ? getTaskTheme(task).kicker : 'Post'
  const strong = index % 5 === 0

  return (
    <EditableReveal index={index % 6}>
      <Link href={href} className={`group flex h-full flex-col overflow-hidden rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] shadow-[0_1px_2px_rgba(35,31,35,0.04)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_50px_-30px_rgba(35,31,35,0.4)] ${strong ? 'md:col-span-2' : ''}`}>
        {image ? (
          <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
            <img src={image} alt="" className="h-full w-full object-cover transition duration-[600ms] group-hover:scale-[1.03]" />
            <span
              className="editable-mono absolute left-4 top-4 rounded-lg px-3 py-1.5 text-[0.62rem] font-normal uppercase tracking-[0.16em] text-[var(--slot4-page-text)]"
              style={{ backgroundColor: pastelFor(label) }}
            >
              {label}
            </span>
          </div>
        ) : null}
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          {!image ? (
            <span
              className="editable-mono w-fit rounded-lg px-3 py-1.5 text-[0.62rem] font-normal uppercase tracking-[0.16em] text-[var(--slot4-page-text)]"
              style={{ backgroundColor: pastelFor(label) }}
            >
              {label}
            </span>
          ) : null}
          <h2 className="editable-display mt-4 line-clamp-3 text-2xl font-semibold leading-[1.15] tracking-[-0.015em] text-[var(--slot4-page-text)]">{post.title}</h2>
          {summary ? <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--slot4-muted-text)]">{summary}</p> : null}
          <span className="editable-mono mt-5 inline-flex items-center gap-1.5 text-[0.7rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-page-text)]">Open <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
        </div>
      </Link>
    </EditableReveal>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
          <EditableReveal>
            <p className="editable-mono text-[0.72rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-accent)]">◆ {pagesContent.search.hero.badge}</p>
            <h1 className="editable-display mt-4 text-balance text-[3rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[4rem] lg:text-[5rem]">{pagesContent.search.hero.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-[1.6] text-[var(--slot4-muted-text)]">{pagesContent.search.hero.description}</p>
          </EditableReveal>

          <EditableReveal index={1}>
            <form action="/search" className="mt-10 rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-4 sm:p-5">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-3">
                <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-[var(--slot4-muted-text)]" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <label className="flex items-center gap-2 rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-3">
                  <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-muted-text)]" />
                </label>
                <select name="task" defaultValue={task} className="editable-mono rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-3 text-[0.72rem] font-normal uppercase tracking-[0.16em] outline-none">
                  <option value="">All collections</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{getTaskTheme(item.key as TaskKey).kicker}</option>)}
                </select>
                <button className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[var(--slot4-page-text)] px-6 text-sm font-medium text-[var(--slot4-page-bg)] transition hover:opacity-90" type="submit">
                  Search <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </EditableReveal>

          <EditableReveal index={2}>
            <div className="mt-14 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="editable-mono text-[0.68rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">{results.length} results</p>
                <h2 className="editable-display mt-2 text-[2rem] font-semibold tracking-[-0.02em] sm:text-[2.5rem]">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
              </div>
              <Link href="/" className="editable-mono inline-flex items-center gap-2 rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-[0.72rem] font-normal uppercase tracking-[0.18em]">
                Browse home <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </EditableReveal>

          {results.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-[20px] border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-12 text-center">
              <p className="editable-display text-2xl font-semibold tracking-[-0.015em]">No matches yet.</p>
              <p className="mt-3 text-sm leading-6 text-[var(--slot4-muted-text)]">Try a different keyword, collection, or category.</p>
            </div>
          )}

          {/* Search page → footer ad. */}
          <div className="mt-16">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
