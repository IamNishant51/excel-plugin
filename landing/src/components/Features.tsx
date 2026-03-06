'use client';

import { useEffect, useRef } from 'react';

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18" /><path d="M9 21V9" />
      </svg>
    ),
    tag: 'Excel',
    title: 'Spreadsheet Automation',
    body: 'Data cleaning, formula generation, conditional formatting, pivot summaries, trend detection, and risk auditing — all from plain English.',
    pills: ['Data Cleaning', 'Formulas', 'Formatting', 'Analysis'],
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    tag: 'Word',
    title: 'Document AI',
    body: 'Resume optimization with ATS scoring, writing enhancement, professional templates, and bulk formatting.',
    pills: ['ATS Scoring', 'Writing Polish', 'Templates'],
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    tag: 'PDF → Excel',
    title: 'Document Extraction',
    body: 'Parse invoices, resumes, and contracts into structured Excel rows. Hybrid regex + LLM extraction pipeline.',
    pills: ['Invoice Parsing', 'Resume Import', 'Table Detection'],
  },
];

const tools = [
  { icon: 'ƒx', title: 'Smart Formulas', body: 'Auto-generates VLOOKUP, SUMIF, INDEX/MATCH from descriptions.' },
  { icon: '⚑', title: 'Risk Audit', body: 'Scans for merged cells, broken refs, missing values. 0-100 risk score.' },
  { icon: '⇄', title: 'Reconciliation', body: 'Match records across sheets, flag discrepancies automatically.' },
  { icon: '⚡', title: 'Multi-LLM', body: 'OpenAI, Gemini, Claude, Deepseek, Groq, and local models.' },
];

export default function Features() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.fade-in');
    if (!els) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id="features" className="py-20 sm:py-28 border-t border-border">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="fade-in text-center mb-14">
          <p className="text-[13px] font-medium text-accent uppercase tracking-wider mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
            Everything you need, nothing you don&apos;t.
          </h2>
        </div>

        {/* Main feature cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map(f => (
            <div key={f.title} className="fade-in p-6 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors group">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-fg-muted group-hover:text-accent transition-colors">{f.icon}</span>
                <span className="text-[11px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded">{f.tag}</span>
              </div>
              <h3 className="text-[16px] font-semibold text-fg mb-2">{f.title}</h3>
              <p className="text-[14px] text-fg-muted leading-relaxed mb-4">{f.body}</p>
              <div className="flex flex-wrap gap-1.5">
                {f.pills.map(p => (
                  <span key={p} className="text-[12px] text-fg-faint bg-bg border border-border px-2 py-0.5 rounded">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tool cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map(t => (
            <div key={t.title} className="fade-in p-5 rounded-xl border border-border hover:bg-surface transition-colors">
              <div className="text-xl mb-3">{t.icon}</div>
              <h4 className="text-[14px] font-semibold text-fg mb-1">{t.title}</h4>
              <p className="text-[13px] text-fg-muted leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
