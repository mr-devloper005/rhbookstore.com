'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

type EditableRevealProps = {
  children: ReactNode
  /** Stagger index — each step adds `step`ms of transition-delay. */
  index?: number
  /** Per-item stagger in ms (default 70ms, matching the reference cadence). */
  step?: number
  /** Render element (default div). */
  as?: ElementType
  className?: string
  /** Reveal once then stop observing (default true). */
  once?: boolean
}

/*
  Scroll reveal — IntersectionObserver-driven fade + slide-up.

  The hidden state (`data-reveal-ready`) is only applied AFTER mount, so a
  visitor with JavaScript disabled always sees fully-rendered content: the
  element ships visible and only becomes "hide-then-reveal" once this client
  component hydrates. `prefers-reduced-motion` is handled in editable-global.css.
*/
export function EditableReveal({
  children,
  index = 0,
  step = 70,
  as,
  className = '',
  once = true,
}: EditableRevealProps) {
  const Tag = (as || 'div') as ElementType
  const ref = useRef<HTMLElement | null>(null)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setReady(true)
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  return (
    <Tag
      ref={ref}
      data-reveal-ready={ready ? 'true' : undefined}
      className={`editable-reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${index * step}ms` : '0ms' }}
    >
      {children}
    </Tag>
  )
}
