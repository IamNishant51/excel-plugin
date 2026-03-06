'use client';

import { useFadeIn } from '@/hooks/useFadeIn';

const stats = [
  { value: '6+', label: 'LLM Providers' },
  { value: '100+', label: 'Operation Types' },
  { value: '200+', label: 'Banned Patterns' },
  { value: '<50ms', label: 'Validation Speed' },
];

export default function Stats() {
  const ref = useFadeIn({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-12 border-y border-border">
      <div className="fade-in max-w-[1100px] mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <div className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">{s.value}</div>
            <div className="text-[13px] text-fg-faint mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
