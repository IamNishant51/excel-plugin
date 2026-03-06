'use client';

import { useEffect, useRef } from 'react';

const steps = [
  {
    num: '1',
    title: 'Describe',
    body: 'Tell SheetOS what you want in plain English. No formulas, no syntax, no code.',
    example: '"Remove duplicate emails and format column C as currency"',
  },
  {
    num: '2',
    title: 'Validate',
    body: 'Every operation is parsed into an AST, scanned against 200+ banned patterns, and dry-run previewed.',
    example: 'AST validated — 0 risks detected',
  },
  {
    num: '3',
    title: 'Execute',
    body: 'Only after validation does SheetOS apply changes. Every operation is logged and instantly reversible.',
    example: 'Applied 3 operations to 42 cells',
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.fade-in');
    if (!els) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id="how-it-works" className="py-20 sm:py-28">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="fade-in text-center mb-14">
          <p className="text-[13px] font-medium text-accent uppercase tracking-wider mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
            Three steps. Zero ambiguity.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(step => (
            <div key={step.num} className="fade-in p-6 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors">
              <div className="w-8 h-8 rounded-full bg-fg text-bg text-[13px] font-semibold flex items-center justify-center mb-4">
                {step.num}
              </div>
              <h3 className="text-lg font-semibold text-fg mb-2">{step.title}</h3>
              <p className="text-[14px] text-fg-muted leading-relaxed mb-4">{step.body}</p>
              <div className="text-[13px] font-mono text-fg-faint bg-bg rounded-lg px-3 py-2 border border-border">
                {step.example}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
