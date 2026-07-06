import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Get started', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-14 px-6 py-20 sm:px-8 lg:grid-cols-[0.9fr_1fr] lg:px-10">
          <EditableReveal>
            <div className="rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
              <h1 className="editable-display text-2xl font-semibold tracking-[-0.015em]">{pagesContent.auth.signup.formTitle}</h1>
              <div className="mt-6">
                <EditableLocalSignupForm />
              </div>
              <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-[var(--slot4-accent)] underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link>
              </p>
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <p className="editable-mono text-[0.72rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-accent)]">◆ {pagesContent.auth.signup.badge}</p>
            <h2 className="editable-display mt-6 max-w-xl text-balance text-[3rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[4rem]">{pagesContent.auth.signup.title}</h2>
            <p className="mt-6 max-w-lg text-lg leading-[1.6] text-[var(--slot4-muted-text)]">{pagesContent.auth.signup.description}</p>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
