'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function DocsLayout() {
  return (
    <div className="min-h-screen pt-20 bg-bg">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-bg/70 backdrop-blur-2xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden">
              <Image
                src="https://ik.imagekit.io/9pfz6g8ri/excel_plugin_assets/icon-64-v2.png"
                alt="SheetOS AI"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-xl font-bold text-t-white">SheetOS</span>
              <span className="text-accent font-heading text-lg font-bold">AI</span>
            </div>
          </Link>
          <Link href="/" className="text-sm font-medium text-t-500 hover:text-t-white">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-heading text-5xl font-bold text-t-white mb-6">Documentation</h1>
        <p className="text-lg text-t-400 mb-12">
          Complete guide to using SheetOS AI for Excel and Word automation.
        </p>

        {/* Getting Started */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-t-white mb-4">Getting Started</h2>
          <div className="p-6 rounded-xl border border-accent/20 bg-accent/5 mb-6">
            <p className="text-t-400 leading-relaxed">
              SheetOS AI is an Office Add-in that brings AI-powered automation to Excel and Word.
              Instead of writing formulas or macros, you describe what you want in plain English.
            </p>
          </div>
        </section>

        {/* Installation */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-t-white mb-6">Installation</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-xl font-semibold text-t-white mb-3">Step 1: Download Manifest</h3>
              <div className="flex gap-3">
                <a href="/manifest.xml" download className="px-4 py-2 bg-accent/10 border border-accent/30 text-accent rounded-lg text-sm font-medium hover:bg-accent/20">
                  Download for Excel
                </a>
                <a href="/manifest-word.xml" download className="px-4 py-2 bg-purple-brand/10 border border-purple-brand/30 text-purple-brand rounded-lg text-sm font-medium hover:bg-purple-brand/20">
                  Download for Word
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-xl font-semibold text-t-white mb-3">Step 2: Upload to Office</h3>
              <ol className="space-y-3 list-decimal list-inside text-t-400">
                <li>Open Excel or Word desktop application</li>
                <li>Go to <strong className="text-t-white">Insert → My Add-ins</strong></li>
                <li>Click <strong className="text-t-white">Upload My Add-in → Browse</strong></li>
                <li>Select the downloaded manifest XML file</li>
                <li>SheetOS AI appears in your ribbon</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-t-white mb-6">Excel Features</h2>

          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-heading text-xl font-semibold text-accent mb-3">Data Cleaning</h3>
              <p className="text-t-400 mb-3">Remove duplicates, trim whitespace, standardize formatting.</p>
              <div className="p-4 rounded-lg bg-surface border border-border font-mono text-sm space-y-1">
                <div className="text-t-500">› remove duplicates in column B</div>
                <div className="text-t-500">› trim whitespace in selected cells</div>
                <div className="text-t-500">› convert text to numbers in column D</div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-heading text-xl font-semibold text-accent mb-3">Formula Generation</h3>
              <p className="text-t-400 mb-3">Generate VLOOKUP, SUMIF, INDEX/MATCH formulas automatically.</p>
              <div className="p-4 rounded-lg bg-surface border border-border font-mono text-sm space-y-1">
                <div className="text-t-500">› add VLOOKUP from sheet1 to sheet2</div>
                <div className="text-t-500">› create SUMIF for sales greater than 10000</div>
                <div className="text-t-500">› generate running total in column E</div>
              </div>
            </div>
          </div>
        </section>

        {/* Word Features */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-t-white mb-6">Word Features</h2>

          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-heading text-xl font-semibold text-purple-brand mb-3">Resume Optimization</h3>
              <p className="text-t-400 mb-3">ATS-friendly formatting, keyword injection, action verb enhancement.</p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-heading text-xl font-semibold text-purple-brand mb-3">Writing Enhancement</h3>
              <p className="text-t-400 mb-3">Grammar fixes, style improvements, conciseness editing.</p>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-t-white mb-6">Security & Privacy</h2>

          <div className="p-6 rounded-xl border border-accent/20 bg-accent/5 space-y-4">
            <div>
              <h4 className="font-semibold text-t-white mb-2">AST Validation</h4>
              <p className="text-t-400 text-sm">Every generated code is parsed and scanned before execution.</p>
            </div>
            <div>
              <h4 className="font-semibold text-t-white mb-2">200+ Banned Patterns</h4>
              <p className="text-t-400 text-sm">eval(), network calls, file access — all blocked.</p>
            </div>
            <div>
              <h4 className="font-semibold text-t-white mb-2">Local Encryption</h4>
              <p className="text-t-400 text-sm">API keys encrypted with AES-GCM using device-specific salts.</p>
            </div>
          </div>
        </section>

        <div className="mt-12 p-6 rounded-xl border border-blue-brand/20 bg-blue-brand/5">
          <h3 className="font-heading text-lg font-semibold text-t-white mb-2">Need more help?</h3>
          <p className="text-t-400 text-sm">
            Join our community or check the GitHub repository for detailed examples.
          </p>
        </div>
      </div>
    </div>
  );
}
