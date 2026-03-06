'use client';

import { useEffect, useRef } from 'react';

/**
 * Shared hook for scroll-triggered fade-in animations.
 * Observes `.fade-in` children and adds `.visible` when they enter the viewport.
 * Supports both single-element and multi-element modes.
 */
export function useFadeIn(options?: { threshold?: number; once?: boolean }) {
    const ref = useRef<HTMLElement>(null);
    const threshold = options?.threshold ?? 0.15;
    const once = options?.once ?? true;

    useEffect(() => {
        const els = ref.current?.querySelectorAll('.fade-in');
        if (!els?.length) return;

        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add('visible');
                        if (once) obs.unobserve(e.target);
                    }
                });
            },
            { threshold }
        );

        els.forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, [threshold, once]);

    return ref;
}
