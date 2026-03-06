'use client';

import { useEffect, useRef, useState } from 'react';

export default function SplashScreen() {
    const ref = useRef<HTMLDivElement>(null);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (ref.current) {
                ref.current.style.opacity = '0';
                ref.current.style.transition = 'opacity 0.4s ease';
            }
            setTimeout(() => setDone(true), 400);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    if (done) return null;

    return (
        <div
            ref={ref}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--fg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                </svg>
                <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.02em' }}>
                    SheetOS
                </span>
            </div>
        </div>
    );
}
