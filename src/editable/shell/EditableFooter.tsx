'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* CTA strip — mirrors the reference's repeated end-of-page prompt. */}
      <div className="border-b border-[var(--editable-dark-border)]">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-col items-start gap-6 px-6 py-14 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <h2 className="editable-display max-w-2xl text-[2rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.75rem]">
            Have a place or a reference worth <span className="text-[color:var(--slot4-orchid)]">sharing?</span>
          </h2>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--slot4-page-bg)] px-6 py-3.5 text-sm font-medium text-[var(--slot4-page-text)] transition duration-300 hover:opacity-90"
          >
            Submit an entry <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-[var(--editable-container)] gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">

              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
            
            <span className="editable-display text-lg font-semibold tracking-[-0.01em]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">
            {globalContent.footer?.description || SITE_CONFIG.description}
          </p>
        </div>

        <div>
          <h3 className="editable-mono text-[0.68rem] font-normal uppercase tracking-[0.2em] text-white/55">
            Discover
          </h3>
          <div className="mt-5 grid gap-3">
            {taskLinks.map((task) => (
              <Link
                key={task.key}
                href={task.route}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition hover:text-white"
              >
                {getTaskTheme(task.key as TaskKey).kicker}
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
              </Link>
            ))}
            <Link href="/search" className="text-sm font-medium text-white/70 transition hover:text-white">
              Search
            </Link>
          </div>
        </div>

        <div>
          <h3 className="editable-mono text-[0.68rem] font-normal uppercase tracking-[0.2em] text-white/55">
            Resources
          </h3>
          <div className="mt-5 grid gap-3">
            {[
              ['About', '/about'],
              ['Contact', '/contact'],
              ['Submit an entry', '/create'],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-medium text-white/70 transition hover:text-white">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="editable-mono text-[0.68rem] font-normal uppercase tracking-[0.2em] text-white/55">
            Account
          </h3>
          <div className="mt-5 grid gap-3">
            {(session
              ? ([['Submit', '/create']] as const)
              : ([['Sign in', '/login'], ['Get started', '/signup']] as const)
            ).map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-medium text-white/70 transition hover:text-white">
                {label}
              </Link>
            ))}
            {session ? (
              <button
                type="button"
                onClick={logout}
                className="text-left text-sm font-medium text-white/70 transition hover:text-white"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--editable-dark-border)]">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-col items-center justify-between gap-2 px-6 py-6 text-center sm:flex-row sm:px-8 lg:px-10">
          <p className="editable-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/45">
            © {year} {SITE_CONFIG.name}
          </p>
          <p className="editable-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/45">
            {globalContent.footer?.bottomNote || 'Local directory + reference library'}
          </p>
        </div>
      </div>
    </footer>
  )
}
