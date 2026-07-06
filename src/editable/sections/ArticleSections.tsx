import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export function EditableArticleArchive({ posts, pagination, category = 'all', basePath = '/article' }: { posts: SitePost[]; pagination: SiteFeedPagination; category?: string; basePath?: string }) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) => `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-16 sm:pt-24 lg:pt-[6rem]`}>
        <EditableReveal>
          <p className={dc.type.eyebrow}>◆ {voice.eyebrow}</p>
          <h1 className={`${dc.type.heroTitle} mt-6 max-w-4xl text-balance text-[var(--slot4-page-text)]`}>{voice.headline}</h1>
          <p className={`mt-6 max-w-2xl text-lg leading-[1.65] ${pal.mutedText}`}>{voice.description}</p>
        </EditableReveal>
        <EditableReveal index={1}>
          <form action={basePath} className="mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
            <select name="category" defaultValue={category || 'all'} className={`editable-mono min-w-0 flex-1 rounded-lg border ${pal.border} bg-[var(--slot4-surface-bg)] px-5 py-3 text-[0.72rem] font-normal uppercase tracking-[0.16em] ${pal.panelText} outline-none`}>
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button className={dc.button.primary}>Filter</button>
          </form>
        </EditableReveal>
      </section>

      <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        {posts.length ? (
          <div className="grid gap-5">
            {posts.map((post, index) => (
              <EditableReveal key={post.id} index={index % 6}>
                <ArticleListCard post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * pagination.limit} />
              </EditableReveal>
            ))}
          </div>
        ) : (
          <div className={`${dc.surface.soft} p-8 text-center`}>
            <h2 className="editable-display text-2xl font-semibold tracking-[-0.015em]">No articles found</h2>
            <p className={`mt-3 text-sm leading-7 ${pal.mutedText}`}>Try another category or return to all articles.</p>
          </div>
        )}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? <Link href={pageHref(page - 1)} className={`rounded-lg border ${pal.border} bg-[var(--slot4-surface-bg)] px-5 py-3 text-sm font-medium`}>Previous</Link> : null}
          <span className={`editable-mono rounded-lg border ${pal.border} bg-[var(--slot4-surface-bg)] px-5 py-3 text-[0.7rem] font-normal uppercase tracking-[0.16em] ${pal.mutedText}`}>Page {page} of {pagination.totalPages || 1}</span>
          {pagination.hasNextPage ? <Link href={pageHref(page + 1)} className={`rounded-lg border ${pal.border} bg-[var(--slot4-surface-bg)] px-5 py-3 text-sm font-medium`}>Next</Link> : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-14 sm:pt-20`}>
        <EditableReveal>
          <Link href="/article" className="editable-mono inline-flex items-center gap-1.5 text-[0.7rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
            <ArrowLeft className="h-3.5 w-3.5" /> Articles
          </Link>
          <p className={`mt-8 ${dc.type.eyebrow}`}>◆ {voice.eyebrow}</p>
          <h1 className={`${dc.type.heroTitle} mt-6 max-w-4xl text-balance text-[var(--slot4-page-text)]`}>{post?.title || pagesContent.detailPages.article.fallbackTitle}</h1>
        </EditableReveal>
      </section>
      <section className="mx-auto w-full max-w-5xl px-6 pb-20 pt-6 sm:px-8 lg:px-10 lg:pb-28">
        <EditableReveal index={1}>
          <div className={`rounded-[24px] border ${pal.border} bg-[var(--slot4-surface-bg)] p-8 sm:p-10`}>
            <p className={`text-base leading-8 ${pal.mutedText}`}>{post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}</p>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-page-text)]">
              Get in touch <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>
      </section>
    </main>
  )
}
