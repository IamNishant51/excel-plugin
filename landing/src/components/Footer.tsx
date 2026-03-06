import Link from 'next/link';
import Logo from './Logo';

const links = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Security', href: '#security' },
    { label: 'Download', href: '#download' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'Changelog', href: '#' },
    { label: 'Support', href: '#' },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid sm:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-fg font-semibold text-[15px] mb-3">
              <Logo size={18} />
              SheetOS AI
            </div>
            <p className="text-[13px] text-fg-muted leading-relaxed max-w-[240px]">
              AI-powered automation for Excel &amp; Word. Stop writing formulas, start describing them.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-[12px] font-semibold text-fg-faint uppercase tracking-wider mb-3">{title}</h4>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-[14px] text-fg-muted hover:text-fg transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t border-border text-[13px] text-fg-faint">
          <span>© {new Date().getFullYear()} SheetOS AI. All rights reserved.</span>
          <span>Built with ❤ in India.</span>
        </div>
      </div>
    </footer>
  );
}
