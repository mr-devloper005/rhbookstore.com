import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pastelFor } from '@/editable/cards/PostCards'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-6 py-16 sm:px-8 sm:py-24 lg:px-10 lg:py-[7.5rem]">
          <EditableReveal>
            <p className="editable-mono text-[0.72rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-accent)]">◆ {pagesContent.about.badge}</p>
            <h1 className="editable-display mt-6 max-w-4xl text-balance text-[3rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[4rem] lg:text-[5.5rem]">
              About {SITE_CONFIG.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-[1.65] text-[var(--slot4-muted-text)]">{pagesContent.about.description}</p>
          </EditableReveal>

          <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <EditableReveal>
              <article className="rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-12">
                <h2 className="editable-display text-[2rem] font-semibold tracking-[-0.02em]">What we're building</h2>
                <div className="mt-6 space-y-5 text-base leading-[1.75] text-[var(--slot4-muted-text)]">
                  {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </article>
            </EditableReveal>
            <aside className="space-y-5">
              {pagesContent.about.values.map((value, i) => (
                <EditableReveal key={value.title} index={i}>
                  <div className="rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7">
                    <span
                      className="editable-mono inline-flex rounded-lg px-3 py-1.5 text-[0.62rem] font-normal uppercase tracking-[0.16em] text-[var(--slot4-page-text)]"
                      style={{ backgroundColor: pastelFor(value.title) }}
                    >
                      ◆ 0{i + 1}
                    </span>
                    <h3 className="editable-display mt-4 text-xl font-semibold tracking-[-0.015em]">{value.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                  </div>
                </EditableReveal>
              ))}
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
