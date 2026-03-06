'use client';

import { useFadeIn } from '@/hooks/useFadeIn';

export default function Download() {
  const ref = useFadeIn({ threshold: 0.15 });

  return (
    <section ref={ref} id="download" className="py-20 sm:py-28 border-t border-border">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="fade-in text-center mb-12">
          <p className="text-[13px] font-medium text-accent uppercase tracking-wider mb-3">Install</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-fg tracking-tight mb-3">
            Start automating
          </h2>
          <p className="text-fg-muted text-base max-w-md mx-auto">
            Download the manifest file, upload it into Office, and instantly supercharge your workflow.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-12">
          <div className="fade-in p-6 rounded-xl border border-border bg-surface text-center hover:bg-surface-hover transition-colors">
            <div className="w-10 h-10 mx-auto mb-4 rounded-lg bg-accent/10 flex items-center justify-center" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F7B5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18" /><path d="M9 21V9" />
              </svg>
            </div>
            <h3 className="text-[15px] font-semibold text-fg mb-1">For Excel</h3>
            <p className="text-[13px] text-fg-muted mb-4">Manifest for Microsoft Excel</p>
            <a href="/manifest.xml" download className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-fg text-bg text-[13px] font-medium rounded-lg hover:opacity-90 transition-opacity">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Download XML
            </a>
          </div>

          <div className="fade-in p-6 rounded-xl border border-border bg-surface text-center hover:bg-surface-hover transition-colors">
            <div className="w-10 h-10 mx-auto mb-4 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h3 className="text-[15px] font-semibold text-fg mb-1">For Word</h3>
            <p className="text-[13px] text-fg-muted mb-4">Manifest for Microsoft Word</p>
            <a href="/manifest-word.xml" download className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 border border-border text-fg text-[13px] font-medium rounded-lg hover:bg-surface-hover transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Download XML
            </a>
          </div>
        </div>

        {/* Installation steps */}
        <div className="fade-in max-w-lg mx-auto p-6 rounded-xl border border-border bg-surface">
          <h3 className="text-[14px] font-semibold text-fg mb-4">Installation steps</h3>
          <ol className="space-y-3">
            {[
              'Download the manifest XML file for your Office app.',
              'Open Excel or Word → Insert → My Add-ins → Upload My Add-in.',
              'Select the XML file. SheetOS AI will initialize in your ribbon.',
            ].map((text, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-surface-hover border border-border flex items-center justify-center text-[11px] font-medium text-fg-muted flex-shrink-0 mt-0.5" aria-hidden="true">
                  {i + 1}
                </span>
                <p className="text-[14px] text-fg-muted leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
