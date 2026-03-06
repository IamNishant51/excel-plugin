'use client';

import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';

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
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Logo size={32} />
                <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.02em' }}>
                    SheetOS
                </span>
            </div>
        </div>
    );
}
