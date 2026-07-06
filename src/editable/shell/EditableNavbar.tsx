'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, ArrowUpRight, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

// Static, non-task navigation only. Directory / library archives are
// intentionally kept OUT of the nav — discovery lives in the footer and home.
const STATIC_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/92 text-[var(--editable-nav-text)] backdrop-blur-xl">
      <nav className="relative mx-auto flex min-h-[74px] w-full max-w-[var(--editable-container)] items-center gap-6 px-6 sm:px-8 lg:px-10">
        <Link href="/" className="group flex shrink-0 items-center gap-3">

            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object" />

          <span className="editable-display max-w-[240px] truncate text-lg font-semibold tracking-[-0.01em]">
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Absolutely centered nav links — stays visually centered regardless
            of the logo/actions widths on either side. */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:flex">
          {STATIC_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`pointer-events-auto editable-mono px-3 py-2 text-[0.72rem] font-normal uppercase tracking-[0.18em] transition duration-300 ${
                isActive(item.href)
                  ? 'text-[var(--slot4-accent)]'
                  : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-lg bg-[var(--slot4-page-text)] px-5 py-2.5 text-[0.8rem] font-medium text-[var(--slot4-page-bg)] transition duration-300 hover:opacity-90 sm:inline-flex"
              >
                Submit <ArrowUpRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="editable-mono hidden items-center px-2 text-[0.72rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="editable-mono hidden items-center rounded-lg border border-[var(--editable-border)] px-4 py-2.5 text-[0.72rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-page-text)] sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-lg bg-[var(--slot4-page-text)] px-5 py-2.5 text-[0.8rem] font-medium text-[var(--slot4-page-bg)] transition duration-300 hover:opacity-90 sm:inline-flex"
              >
                Get started <ArrowUpRight className="h-4 w-4" />
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-6 py-6 lg:hidden">
          <div className="grid gap-1">
            {[{ label: 'Home', href: '/' }, ...STATIC_LINKS].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`editable-mono rounded-lg px-4 py-3 text-[0.78rem] font-normal uppercase tracking-[0.18em] transition ${
                  isActive(item.href)
                    ? 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'
                    : 'text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-warm)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid gap-2 border-t border-[var(--editable-border)] pt-4">
              <Link
                href="/search"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--editable-border)] px-5 py-3 text-sm font-medium"
              >
                <Search className="h-4 w-4" /> Search
              </Link>
              {session ? (
                <>
                  <Link
                    href="/create"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--slot4-page-text)] px-5 py-3 text-sm font-medium text-[var(--slot4-page-bg)]"
                  >
                    Submit
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setOpen(false)
                    }}
                    className="rounded-lg border border-[var(--editable-border)] px-5 py-3 text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-lg border border-[var(--editable-border)] px-5 py-3 text-sm font-medium"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--slot4-page-text)] px-5 py-3 text-sm font-medium text-[var(--slot4-page-bg)]"
                  >
                    Get started <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
