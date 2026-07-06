'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pastelFor } from '@/editable/cards/PostCards'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: FileText,
}

const fieldClass = 'w-full rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-page-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]
  const activeLabel = activeTask ? getTaskTheme(activeTask.key as TaskKey).kicker : 'entry'

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] px-6 py-20 text-[var(--slot4-page-text)] sm:px-8 lg:px-10">
          <section className="mx-auto grid max-w-5xl gap-10 rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 md:grid-cols-[0.9fr_1.1fr] md:p-12">
            <div className="flex h-full min-h-72 items-center justify-center rounded-[20px] bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
              <Lock className="h-20 w-20 opacity-80" />
            </div>
            <div className="self-center">
              <p className="editable-mono text-[0.72rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-accent)]">◆ {pagesContent.create.locked.badge}</p>
              <h1 className="editable-display mt-5 text-[3rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[4rem]">{pagesContent.create.locked.title}</h1>
              <p className="mt-6 max-w-xl text-lg leading-[1.6] text-[var(--slot4-muted-text)]">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-[var(--slot4-page-text)] px-6 py-3 text-sm font-medium text-[var(--slot4-page-bg)] transition hover:opacity-90">Sign in <ArrowUpRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg border border-[var(--editable-border)] px-6 py-3 text-sm font-medium">Get started</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-6 py-16 sm:px-8 sm:py-24 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <EditableReveal>
              <aside>
                <p className="editable-mono text-[0.72rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-accent)]">◆ {pagesContent.create.hero.badge}</p>
                <h1 className="editable-display mt-6 text-balance text-[3rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[3.75rem] lg:text-[4.5rem]">{pagesContent.create.hero.title}</h1>
                <p className="mt-6 max-w-xl text-lg leading-[1.6] text-[var(--slot4-muted-text)]">{pagesContent.create.hero.description}</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {enabledTasks.map((item) => {
                    const Icon = taskIcon[item.key] || FileText
                    const active = item.key === task
                    const theme = getTaskTheme(item.key as TaskKey)
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setTask(item.key)}
                        className={`rounded-[16px] border p-4 text-left transition ${active ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)]' : 'border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] hover:border-[var(--slot4-page-text)]'}`}
                      >
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--slot4-page-text)]"
                          style={{ backgroundColor: pastelFor(item.key) }}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="editable-display mt-3 block text-base font-semibold tracking-[-0.01em]">{theme.kicker}</span>
                        <span className="mt-1 block text-xs leading-5 opacity-70">{theme.note}</span>
                      </button>
                    )
                  })}
                </div>
              </aside>
            </EditableReveal>

            <EditableReveal index={1}>
              <form onSubmit={submit} className="rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="editable-mono text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">◆ New entry · {activeLabel}</p>
                    <h2 className="editable-display mt-2 text-[1.75rem] font-semibold tracking-[-0.02em]">{pagesContent.create.formTitle}</h2>
                  </div>
                  <span className="editable-mono rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-3 py-1.5 text-[0.65rem] font-normal uppercase tracking-[0.16em]">{session.name}</span>
                </div>

                <div className="mt-6 grid gap-4">
                  <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Entry title" required />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                    <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                  </div>
                  <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                  <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                  <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
                </div>

                {created ? (
                  <div className="mt-5 rounded-lg border border-[var(--editable-border)] bg-[color:var(--slot4-mint)] p-4">
                    <p className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                    <p className="mt-1 text-sm opacity-80">{created.title}</p>
                  </div>
                ) : null}

                <button type="submit" className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--slot4-page-text)] px-6 text-sm font-medium text-[var(--slot4-page-bg)] transition hover:opacity-90">
                  <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                </button>
              </form>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
