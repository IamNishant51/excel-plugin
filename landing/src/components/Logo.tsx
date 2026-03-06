'use client';

import { useState } from 'react';

const LOGO_URL = 'https://ik.imagekit.io/9pfz6g8ri/excel_plugin_assets/icon-64-v2.png';

function FallbackSvg({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
        </svg>
    );
}

export default function Logo({ size = 26, className = '' }: { size?: number; className?: string }) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return <FallbackSvg size={size} />;
    }

    return (
        <div
            className={className}
            style={{
                position: 'relative',
                width: size,
                height: size,
                borderRadius: size > 30 ? 12 : 6,
                overflow: 'hidden',
                flexShrink: 0,
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={LOGO_URL}
                alt="SheetOS AI"
                width={size}
                height={size}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={() => setFailed(true)}
            />
        </div>
    );
}
