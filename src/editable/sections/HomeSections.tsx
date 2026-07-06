import Link from 'next/link'
import {
  ArrowUpRight, BookOpen, Building2, FileText, Library, Search, Sparkles,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import {
  EditorialFeatureCard,
  getEditableCategory,
  getEditableExcerpt,
  getEditablePostImage,
  pastelFor,
  postHref,
} from '@/editable/cards/PostCards'
import { EditableHeroCollage } from '@/editable/sections/EditableHeroCollage'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: FileText,
  image: FileText,
  sbm: BookOpen,
  pdf: Library,
  profile: FileText,
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-6 sm:px-8 lg:px-10'

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function latestPostImages(posts: SitePost[], max = 8) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (!img || img.includes('placeholder') || seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

/* ------------------------------- Hero band ------------------------------ */
export function EditableHomeHero({ posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroImages = latestPostImages(pool)
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `Discover the best of ${SITE_CONFIG.name}`
  const stats = [
    { value: `${pool.length}+`, label: 'Live entries' },
    { value: `${SITE_CONFIG.tasks.filter((t) => t.enabled).length}`, label: 'Collections' },
    { value: '24/7', label: 'Open access' },
  ]

  return (
    <section className="relative border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`${container} grid gap-12 pb-16 pt-16 sm:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-24 lg:pt-[6rem]`}>
        <EditableReveal className="flex flex-col justify-center">
          <span className="editable-mono inline-flex w-fit items-center gap-2 text-[0.72rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
            <Sparkles className="h-3.5 w-3.5" /> {pagesContent.home.hero.badge || 'Local directory + reference library'}
          </span>
          <h1 className={`${dc.type.heroTitle} mt-6 max-w-3xl text-balance text-[var(--slot4-page-text)]`}>
            {heroTitle}
          </h1>
          <p className={`mt-6 max-w-xl text-base leading-[1.6] ${pal.mutedText} sm:text-lg`}>{pagesContent.home.hero.description}</p>

          <form action="/search" className="mt-9 flex w-full max-w-xl items-center gap-2 rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-2 pl-5">
            <Search className="h-5 w-5 shrink-0 text-[var(--slot4-muted-text)]" />
            <input
              name="q"
              placeholder={pagesContent.home.hero.searchPlaceholder || 'Search places, guides, references…'}
              className="w-full bg-transparent py-2.5 text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]"
            />
            <button className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--slot4-page-text)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-page-bg)] transition hover:opacity-90">
              Search
            </button>
          </form>

          <div className="mt-10 grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="editable-display text-3xl font-semibold tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-[2.25rem]">{stat.value}</p>
                <p className="editable-mono mt-2 text-[0.68rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </EditableReveal>

        <EditableReveal index={1} className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-media-bg)] sm:aspect-[4/4] lg:aspect-[4/5]">
            <EditableHeroCollage images={heroImages} />
            <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-page-bg)]/95 p-5 backdrop-blur">
              <p className="editable-mono text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-accent)]">Latest additions</p>
              <p className="mt-2 text-sm font-medium text-[var(--slot4-page-text)]">Fresh entries and reference material pulled in from the live feed.</p>
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

/* --------------------------- Browse collections ------------------------- */
export function EditableStoryRail(_props: HomeSectionProps) {
  const categories = SITE_CONFIG.tasks.filter((task) => task.enabled)
  if (!categories.length) return null
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${dc.shell.sectionY} ${container}`}>
        <EditableReveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className={dc.type.eyebrow}>◆ Start here</span>
            <h2 className={`${dc.type.sectionTitle} mt-4 text-[var(--slot4-page-text)]`}>Two ways to explore.</h2>
          </div>
          <p className={`${pal.mutedText} max-w-sm text-sm leading-relaxed sm:text-base`}>
            Jump into the local directory for places nearby, or open the reference library for download-ready guides and reports.
          </p>
        </EditableReveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {categories.map((task, i) => {
            const Icon = taskIcon[task.key] || FileText
            const theme = getTaskTheme(task.key as TaskKey)
            const tint = pastelFor(task.key)
            return (
              <EditableReveal key={task.key} index={i}>
                <Link
                  href={task.route}
                  className={`group flex h-full flex-col gap-5 rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 ${dc.motion.lift}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] text-[var(--slot4-page-text)] transition group-hover:scale-105"
                      style={{ backgroundColor: tint }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--slot4-muted-text)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--slot4-accent)]" />
                  </div>
                  <div>
                    <h3 className="editable-display text-2xl font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)]">{theme.kicker}</h3>
                    <p className={`mt-2 text-sm leading-relaxed ${pal.mutedText}`}>{theme.note}</p>
                  </div>
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------- Featured + recently added -------------------- */
function ActivityCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = getEditableCategory(post)
  const image = getEditablePostImage(post)
  return (
    <EditableReveal index={index}>
      <Link href={href} className={`group flex h-full flex-col overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
        <div className={`${dc.media.frame} aspect-[3/2]`}>
          <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-[600ms] group-hover:scale-[1.03]" loading="lazy" />
          {category ? (
            <span
              className="editable-mono absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[0.62rem] font-normal uppercase tracking-[0.16em] text-[var(--slot4-page-text)]"
              style={{ backgroundColor: pastelFor(post.slug || post.title) }}
            >
              {category}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="editable-display line-clamp-2 text-lg font-semibold leading-[1.2] tracking-[-0.01em] text-[var(--slot4-page-text)]">{post.title}</h3>
          <p className={`mt-2 line-clamp-2 flex-1 text-sm leading-6 ${pal.mutedText}`}>{getEditableExcerpt(post, 130)}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-page-text)]">
            Open <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </EditableReveal>
  )
}

// Named export needed by cards module barrel (re-exported below for other files).
export { ActivityCard }

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activity = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  if (!activity.length) return null
  const [feature, ...rest] = activity
  const grid = rest.slice(0, 4)

  return (
    <section className="bg-[var(--slot4-warm)]">
      <div className={`${dc.shell.sectionY} ${container}`}>
        <EditableReveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className={dc.type.eyebrow}>◆ Recently added</span>
            <h2 className={`${dc.type.sectionTitle} mt-4 text-[var(--slot4-page-text)]`}>Fresh finds across {SITE_CONFIG.name}.</h2>
          </div>
          <Link href={primaryRoute} className={dc.button.secondary}>
            Browse all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </EditableReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <EditableReveal>
            <EditorialFeatureCard post={feature} href={postHref(primaryTask, feature, primaryRoute)} label={getEditableCategory(feature)} />
          </EditableReveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {grid.map((post, i) => (
              <ActivityCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------- Time-based discovery sections -------------------- */
const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: '◆ This week', title: 'New in the last 7 days' },
  browse: { eyebrow: '◆ Trending', title: 'Most-viewed this month' },
  index: { eyebrow: '◆ Evergreen', title: 'From the archive' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, index) => {
        const copy = sectionCopy[section.key] || { eyebrow: '◆ Discover', title: 'More to explore' }
        return (
          <section key={section.key} className={index % 2 === 0 ? 'bg-[var(--slot4-page-bg)]' : 'bg-[var(--slot4-warm)]'}>
            <div className={`${dc.shell.sectionY} ${container}`}>
              <EditableReveal className="flex items-end justify-between gap-4">
                <div>
                  <span className={dc.type.eyebrow}>{copy.eyebrow}</span>
                  <h2 className={`${dc.type.subTitle} mt-4 text-[var(--slot4-page-text)]`}>{copy.title}</h2>
                </div>
                <Link href={section.href || primaryRoute} className="editable-mono inline-flex shrink-0 items-center gap-1.5 text-[0.72rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-accent)] hover:underline">
                  See all <ArrowUpRight className="h-4 w-4" />
                </Link>
              </EditableReveal>
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, i) => (
                  <ActivityCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={i} />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* -------------------------------- CTA band ------------------------------ */
export function EditableHomeCta() {
  return (
    <section id="get-app" className="scroll-mt-24 bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
      <div className={`flex flex-col items-center gap-7 py-20 text-center sm:py-28 ${container}`}>
        <EditableReveal className="flex flex-col items-center gap-7">
          <span className="editable-mono inline-flex items-center gap-2 rounded-lg border border-[var(--editable-dark-border)] px-3 py-1.5 text-[0.68rem] font-normal uppercase tracking-[0.18em] text-white/70">
            ◆ {pagesContent.home.cta.badge || 'Get listed'}
          </span>
          <h2 className="editable-display max-w-3xl text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[3.75rem]">
            {pagesContent.home.cta.title}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">{pagesContent.home.cta.description}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={pagesContent.home.cta.primaryCta.href} className="inline-flex items-center gap-2 rounded-lg bg-[var(--slot4-page-bg)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:opacity-90">
              {pagesContent.home.cta.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href={pagesContent.home.cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-lg border border-[var(--editable-dark-border)] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/10">
              {pagesContent.home.cta.secondaryCta.label}
            </Link>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}
