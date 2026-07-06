import Link from 'next/link'
import { ArrowUpRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing published here yet',
  description = 'Fresh entries will appear here automatically once this collection has published content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-10 text-center', className)}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-warm)]">
        <SearchX className="h-6 w-6 text-[var(--slot4-muted-text)]" />
      </div>
      <h2 className="editable-display mt-5 text-2xl font-semibold tracking-[-0.02em] text-[var(--slot4-page-text)]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--slot4-muted-text)]">{description}</p>
      <Link href={actionHref} className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)]">
        {actionLabel}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

// Renamed pair (Local Directory / Reference Library) — taskLabel comes from the
// caller (typically the task theme kicker), never the forbidden strings.
export function TaskEmptyState({ taskLabel = 'entries', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel.toLowerCase()} available yet`}
      description={`Newly published items in ${taskLabel} will appear here automatically. The layout stays ready even when the feed is empty.`}
      actionLabel="Explore the platform"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your request has been saved and routed through the contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
