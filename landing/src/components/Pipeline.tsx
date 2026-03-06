'use client';

import { useEffect, useRef } from 'react';

const steps = [
  { num: '01', title: 'Intent', desc: 'Classify task' },
  { num: '02', title: 'Schema', desc: 'Extract fields' },
  { num: '03', title: 'Generate', desc: 'Build code' },
  { num: '04', title: 'Validate', desc: 'AST scanning' },
  { num: '05', title: 'Preview', desc: 'Dry-run test' },
  { num: '06', title: 'Execute', desc: 'Apply changes' },
];

export default function Pipeline() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current?.querySelector('.fade-in');
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 sm:py-28 border-t border-border">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[13px] font-medium text-accent uppercase tracking-wider mb-3">Architecture</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
            6-stage validation pipeline.
          </h2>
          <p className="text-fg-muted text-base mt-3 max-w-md mx-auto">Every operation passes through six layers before touching your data.</p>
        </div>

        <div className="fade-in grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((s, i) => (
            <div key={s.num} className="text-center p-4 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors">
              <div className="text-[12px] font-mono text-fg-faint mb-2">{s.num}</div>
              <div className="text-[14px] font-semibold text-fg mb-1">{s.title}</div>
              <div className="text-[12px] text-fg-muted">{s.desc}</div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 text-fg-faint">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
