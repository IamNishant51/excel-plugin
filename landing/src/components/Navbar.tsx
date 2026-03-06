'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${scrolled ? 'bg-bg/80 backdrop-blur-md border-b border-border' : 'bg-transparent'}`}>
      <div className="max-w-[1100px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-fg font-semibold text-[15px] tracking-tight">
          <div className="relative w-[26px] h-[26px] rounded-md overflow-hidden">
            <Image
              src="https://ik.imagekit.io/9pfz6g8ri/excel_plugin_assets/icon-64-v2.png"
              alt="SheetOS AI"
              fill
              className="object-cover"
            />
          </div>
          SheetOS
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: 'Features', href: '#features' },
            { label: 'How it works', href: '#how-it-works' },
            { label: 'Security', href: '#security' },
            { label: 'Docs', href: '/docs' },
          ].map(link => (
            <a key={link.href} href={link.href} className="px-3 py-1.5 text-[14px] text-fg-muted hover:text-fg rounded-md hover:bg-surface transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 flex items-center justify-center rounded-md text-fg-muted hover:text-fg hover:bg-surface transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
              )}
            </button>
          )}
          <a
            href="#download"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-fg text-bg text-[13px] font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Download
          </a>
        </div>
      </div>
    </nav>
  );
}
