'use client';

import { useEffect, useRef } from 'react';
import { useFadeIn } from '@/hooks/useFadeIn';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Hero uses staggered entrance (not scroll-triggered), so it needs custom logic
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.fade-in');
    if (!els) return;
    const timer = setTimeout(() => {
      els.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 100);
      });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={ref} className="pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="max-w-[1100px] mx-auto px-6 text-center">

        <div className="fade-in inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-[13px] text-fg-muted font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
          Now available for Excel &amp; Word
        </div>

        <h1 className="fade-in text-4xl sm:text-5xl lg:text-6xl font-semibold text-fg tracking-tight leading-[1.1] max-w-3xl mx-auto mb-6">
          Write what you want.
          <br />
          <span className="text-fg-muted">SheetOS handles the rest.</span>
        </h1>

        <p className="fade-in text-fg-muted text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          AI-powered automation that sits inside your spreadsheets. Describe tasks in plain English — SheetOS generates, validates, and executes safely.
        </p>

        <div className="fade-in flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#download" className="w-full sm:w-auto px-5 py-2.5 bg-fg text-bg text-[14px] font-medium rounded-lg hover:opacity-90 transition-opacity text-center">
            Download for free →
          </a>
          <a href="#how-it-works" className="w-full sm:w-auto px-5 py-2.5 border border-border text-fg text-[14px] font-medium rounded-lg hover:bg-surface transition-colors text-center">
            See how it works
          </a>
        </div>

        {/* Mock UI */}
        <div className="fade-in mt-16 sm:mt-20 max-w-3xl mx-auto">
          <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="flex gap-1.5" aria-hidden="true">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              </div>
              <span className="text-[12px] text-fg-faint ml-2">SheetOS AI — Q3_Sales.xlsx</span>
            </div>
            {/* Content */}
            <div className="p-6 sm:p-8 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F7B5F" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                </div>
                <div className="bg-surface-hover rounded-lg px-4 py-3 text-[14px] text-fg leading-relaxed flex-1">
                  &quot;Highlight all rows where Q3 revenue dropped more than 15% compared to Q2, and add a summary row at the bottom.&quot;
                </div>
              </div>
              <div className="ml-10 space-y-2">
                <div className="flex items-center gap-2 text-[13px] text-fg-muted">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F7B5F" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  Parsed 1,402 rows — 3 operations planned
                </div>
                <div className="flex items-center gap-2 text-[13px] text-fg-muted">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F7B5F" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  AST validated — 0 banned patterns detected
                </div>
                <div className="flex items-center gap-2 text-[13px] text-accent font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
                  Applying conditional formatting...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
