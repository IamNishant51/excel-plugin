'use client';

import { useFadeIn } from '@/hooks/useFadeIn';

const items = [
  { icon: '✓', title: 'AST Code Validation', body: 'Every generated line is parsed and validated before execution.' },
  { icon: '✓', title: '200+ Banned Patterns', body: 'eval(), network calls, file access — all blocked at parser level.' },
  { icon: '✓', title: 'Safe API Whitelist', body: 'Only curated Office.js operations are permitted.' },
  { icon: '✓', title: 'AES-GCM Encryption', body: 'API keys encrypted locally with device-specific salts.' },
  { icon: '✓', title: 'Dry-Run Previews', body: 'See changes cell-by-cell before anything is applied.' },
  { icon: '✓', title: 'Instant Rollback', body: 'Every operation captures a snapshot. Undo with one click.' },
];

export default function Security() {
  const ref = useFadeIn({ threshold: 0.1 });

  return (
    <section ref={ref} id="security" className="py-20 sm:py-28 border-t border-border">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-start">
          {/* Left */}
          <div className="fade-in">
            <p className="text-[13px] font-medium text-accent uppercase tracking-wider mb-3">Security</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-fg tracking-tight mb-4">
              No black boxes.<br />Every action audited.
            </h2>
            <p className="text-fg-muted text-[15px] leading-relaxed">
              SheetOS doesn&apos;t just generate code and run it wild. Every operation passes through robust validation layers. You have full transparency and control over what touches your data.
            </p>
          </div>

          {/* Right */}
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map(item => (
              <div key={item.title} className="fade-in p-5 rounded-xl border border-border hover:bg-surface transition-colors">
                <div className="w-6 h-6 rounded-full bg-accent/10 text-accent text-[12px] flex items-center justify-center mb-3 font-bold" aria-hidden="true">
                  {item.icon}
                </div>
                <h3 className="text-[14px] font-semibold text-fg mb-1">{item.title}</h3>
                <p className="text-[13px] text-fg-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
