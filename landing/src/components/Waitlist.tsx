'use client';

import { useEffect, useRef, useState } from 'react';

export default function Waitlist() {
  const ref = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');

  useEffect(() => {
    const el = ref.current?.querySelector('.fade-in');
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) { setStatus('ok'); setEmail(''); }
      else setStatus('err');
    } catch { setStatus('err'); }
  }

  return (
    <section ref={ref} id="waitlist" className="py-20 sm:py-28 border-t border-border">
      <div className="fade-in max-w-md mx-auto px-6 text-center">
        <p className="text-[13px] font-medium text-accent uppercase tracking-wider mb-3">Early access</p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-fg tracking-tight mb-3">
          Join the waitlist.
        </h2>
        <p className="text-fg-muted text-[15px] mb-8 leading-relaxed">
          Get priority access to advanced Pro tools, team collaboration features, and dedicated server options.
        </p>

        {status === 'ok' ? (
          <div className="p-5 rounded-xl bg-accent/10 border border-accent/20">
            <p className="text-[14px] font-medium text-accent">You&apos;re on the list! We&apos;ll notify you when spots open.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-bg text-fg text-[14px] placeholder:text-fg-faint focus:outline-none focus:border-fg-muted transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-5 py-2.5 bg-fg text-bg text-[14px] font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
            >
              {status === 'loading' ? 'Joining...' : 'Join waitlist'}
            </button>
          </form>
        )}
        {status === 'err' && (
          <p className="text-red-500 text-[13px] mt-3">Something went wrong. Please try again.</p>
        )}
      </div>
    </section>
  );
}
