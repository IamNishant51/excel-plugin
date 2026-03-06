"use client";

import { useRef, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";

/* ── Configuration ── */
const PARTICLE_COUNT = 24;
const REPULSION_RADIUS = 180;
const REPULSION_STRENGTH = 6;
const FRICTION = 0.94;
const DRIFT_SPEED = 0.25;
const CURSOR_LERP = 0.12;

/* ── Types ── */
interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    baseOpacity: number;
    rotation: number;
    rotationSpeed: number;
    shape: number;
}

/* ── Shape renderers (outlined geometric icons) ── */
function drawShape(ctx: CanvasRenderingContext2D, shape: number, s: number) {
    ctx.beginPath();
    switch (shape) {
        case 0: // Circle
            ctx.arc(0, 0, s, 0, Math.PI * 2);
            ctx.stroke();
            break;
        case 1: // Diamond
            ctx.moveTo(0, -s);
            ctx.lineTo(s, 0);
            ctx.lineTo(0, s);
            ctx.lineTo(-s, 0);
            ctx.closePath();
            ctx.stroke();
            break;
        case 2: // Square
            ctx.rect(-s * 0.7, -s * 0.7, s * 1.4, s * 1.4);
            ctx.stroke();
            break;
        case 3: // Triangle
            ctx.moveTo(0, -s);
            ctx.lineTo(s * 0.87, s * 0.5);
            ctx.lineTo(-s * 0.87, s * 0.5);
            ctx.closePath();
            ctx.stroke();
            break;
        case 4: // Plus / Cross
            ctx.moveTo(-s, 0);
            ctx.lineTo(s, 0);
            ctx.moveTo(0, -s);
            ctx.lineTo(0, s);
            ctx.stroke();
            break;
        case 5: // Hexagon
            for (let i = 0; i < 6; i++) {
                const a = (Math.PI / 3) * i - Math.PI / 2;
                const px = Math.cos(a) * s;
                const py = Math.sin(a) * s;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
            break;
        case 6: // Grid (mini spreadsheet icon)
            ctx.rect(-s * 0.7, -s * 0.7, s * 1.4, s * 1.4);
            ctx.moveTo(-s * 0.7, -s * 0.2);
            ctx.lineTo(s * 0.7, -s * 0.2);
            ctx.moveTo(-s * 0.7, s * 0.25);
            ctx.lineTo(s * 0.7, s * 0.25);
            ctx.moveTo(-s * 0.1, -s * 0.7);
            ctx.lineTo(-s * 0.1, s * 0.7);
            ctx.stroke();
            break;
        case 7: // Dot ring
            ctx.arc(0, 0, s, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2);
            ctx.fill();
            break;
    }
}

export default function CursorBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const cursorRef = useRef({ x: -9999, y: -9999 });
    const particlesRef = useRef<Particle[]>([]);
    const rafRef = useRef(0);
    const { resolvedTheme } = useTheme();

    /* ── Initialise particles spread across the viewport ── */
    const initParticles = useCallback((w: number, h: number) => {
        const isMobile = w < 768;
        const count = isMobile ? 10 : PARTICLE_COUNT;
        const sizeMin = isMobile ? 5 : 8;
        const sizeRange = isMobile ? 8 : 16;
        const baseOpMin = isMobile ? 0.08 : 0.12;
        const baseOpRange = isMobile ? 0.1 : 0.2;
        const arr: Particle[] = [];
        for (let i = 0; i < count; i++) {
            const baseOp = baseOpMin + Math.random() * baseOpRange;
            arr.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * DRIFT_SPEED,
                vy: (Math.random() - 0.5) * DRIFT_SPEED,
                size: sizeMin + Math.random() * sizeRange,
                opacity: baseOp,
                baseOpacity: baseOp,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.015,
                shape: Math.floor(Math.random() * 8),
            });
        }
        particlesRef.current = arr;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        /* ── Resize handler ── */
        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (particlesRef.current.length === 0) initParticles(w, h);
        };
        resize();
        window.addEventListener("resize", resize);

        /* ── Mouse tracking ── */
        const onMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        const onLeave = () => {
            mouseRef.current = { x: -9999, y: -9999 };
        };
        window.addEventListener("mousemove", onMove);
        document.addEventListener("mouseleave", onLeave);

        /* ── Animation loop ── */
        const animate = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            ctx.clearRect(0, 0, w, h);

            const dark = resolvedTheme === "dark";
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            // Smooth-follow cursor position (feels premium)
            cursorRef.current.x += (mx - cursorRef.current.x) * CURSOR_LERP;
            cursorRef.current.y += (my - cursorRef.current.y) * CURSOR_LERP;
            const cx = cursorRef.current.x;
            const cy = cursorRef.current.y;

            // ── Particles with antigravity physics ──
            for (const p of particlesRef.current) {
                const dx = p.x - cx;
                const dy = p.y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < REPULSION_RADIUS && dist > 1) {
                    const force = ((REPULSION_RADIUS - dist) / REPULSION_RADIUS);
                    const angle = Math.atan2(dy, dx);
                    p.vx += Math.cos(angle) * force * REPULSION_STRENGTH;
                    p.vy += Math.sin(angle) * force * REPULSION_STRENGTH;
                    // Brighten when near cursor
                    p.opacity = Math.min(0.65, p.baseOpacity + force * 0.45);
                    // Speed up rotation
                    p.rotation += p.rotationSpeed * 4;
                } else {
                    p.opacity += (p.baseOpacity - p.opacity) * 0.03;
                    p.rotation += p.rotationSpeed;
                }

                // Friction
                p.vx *= FRICTION;
                p.vy *= FRICTION;

                // Gentle random drift
                p.vx += (Math.random() - 0.5) * 0.04;
                p.vy += (Math.random() - 0.5) * 0.04;

                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges with padding
                if (p.x < -60) p.x = w + 60;
                if (p.x > w + 60) p.x = -60;
                if (p.y < -60) p.y = h + 60;
                if (p.y > h + 60) p.y = -60;

                // Draw the particle
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                const color = dark ? `16, 185, 129` : `15, 123, 95`;
                ctx.strokeStyle = `rgba(${color}, ${p.opacity})`;
                ctx.fillStyle = `rgba(${color}, ${p.opacity * 0.6})`;
                ctx.lineWidth = 1.5;
                drawShape(ctx, p.shape, p.size);
                ctx.restore();
            }

            // ── Cursor glow ──
            if (mx > -999 && my > -999) {
                // Soft outer glow
                const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
                g1.addColorStop(0, dark ? "rgba(16,185,129,0.10)" : "rgba(15,123,95,0.08)");
                g1.addColorStop(1, "transparent");
                ctx.fillStyle = g1;
                ctx.beginPath();
                ctx.arc(cx, cy, 80, 0, Math.PI * 2);
                ctx.fill();

                // Bright inner glow
                const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, 24);
                g2.addColorStop(0, dark ? "rgba(16,185,129,0.25)" : "rgba(15,123,95,0.2)");
                g2.addColorStop(1, "transparent");
                ctx.fillStyle = g2;
                ctx.beginPath();
                ctx.arc(cx, cy, 24, 0, Math.PI * 2);
                ctx.fill();

                // Thin ring
                ctx.strokeStyle = dark ? "rgba(16,185,129,0.35)" : "rgba(15,123,95,0.3)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(cx, cy, 14, 0, Math.PI * 2);
                ctx.stroke();

                // Center dot
                ctx.fillStyle = dark ? "rgba(16,185,129,0.7)" : "rgba(15,123,95,0.6)";
                ctx.beginPath();
                ctx.arc(cx, cy, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseleave", onLeave);
        };
    }, [resolvedTheme, initParticles]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 9999,
            }}
            aria-hidden="true"
        />
    );
}
