'use client'

import { Building2, FileText, Library, Mail, MapPin, Phone, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pastelFor } from '@/editable/cards/PostCards'

// Lanes framed for the Local Directory + Reference Library platform purpose.
const lanes = [
  { icon: Building2, title: 'Directory submissions', body: 'Add a new place, correct a detail, or request verification for an entry in the local directory.' },
  { icon: Library, title: 'Reference contributions', body: 'Share reports, guides, and reference files to publish in the library.' },
  { icon: MapPin, title: 'Coverage requests', body: 'Ask for a new city, category, or reference collection — we shape the platform around real needs.' },
  { icon: Sparkles, title: 'Partnerships', body: 'Talk about bulk publishing, community programs, and long-term collaborations.' },
  { icon: FileText, title: 'Editorial notes', body: 'Feedback on tone, structure, or specific content that could be sharper.' },
  { icon: Phone, title: 'General support', body: 'Anything else that doesn\'t fit above — an actual human replies.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-6 py-16 sm:px-8 sm:py-24 lg:px-10 lg:py-[7.5rem]">
          <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <EditableReveal>
                <p className="editable-mono text-[0.72rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-accent)]">◆ {pagesContent.contact.eyebrow}</p>
                <h1 className="editable-display mt-6 text-balance text-[3rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[3.75rem] lg:text-[4.5rem]">{pagesContent.contact.title}</h1>
                <p className="mt-6 max-w-xl text-lg leading-[1.6] text-[var(--slot4-muted-text)]">{pagesContent.contact.description}</p>
              </EditableReveal>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {lanes.map((lane, i) => (
                  <EditableReveal key={lane.title} index={i}>
                    <div className="rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6">
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-lg text-[var(--slot4-page-text)]"
                        style={{ backgroundColor: pastelFor(lane.title) }}
                      >
                        <lane.icon className="h-5 w-5" />
                      </span>
                      <h2 className="editable-display mt-4 text-lg font-semibold tracking-[-0.015em]">{lane.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{lane.body}</p>
                    </div>
                  </EditableReveal>
                ))}
              </div>
            </div>

            <EditableReveal index={1}>
              <div className="rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 sm:p-9 lg:sticky lg:top-24">
                <h2 className="editable-display text-2xl font-semibold tracking-[-0.02em]">{pagesContent.contact.formTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">Tell us the lane and we'll route it to the right person.</p>
                <div className="mt-6">
                  <EditableContactLeadForm />
                </div>
                <div className="editable-mono mt-8 flex items-center gap-2 border-t border-[var(--editable-border)] pt-6 text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
                  <Mail className="h-3.5 w-3.5" /> Replies typically within 48h
                </div>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
