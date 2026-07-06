import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Sign in', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-14 px-6 py-20 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:px-10">
          <EditableReveal>
            <p className="editable-mono text-[0.72rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-accent)]">◆ {pagesContent.auth.login.badge}</p>
            <h1 className="editable-display mt-6 max-w-xl text-balance text-[3rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[4rem]">{pagesContent.auth.login.title}</h1>
            <p className="mt-6 max-w-lg text-lg leading-[1.6] text-[var(--slot4-muted-text)]">{pagesContent.auth.login.description}</p>
          </EditableReveal>
          <EditableReveal index={1}>
            <div className="rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
              <h2 className="editable-display text-2xl font-semibold tracking-[-0.015em]">{pagesContent.auth.login.formTitle}</h2>
              <div className="mt-6">
                <EditableLocalLoginForm />
              </div>
              <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
                New here?{' '}
                <Link href="/signup" className="font-medium text-[var(--slot4-accent)] underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link>
              </p>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
