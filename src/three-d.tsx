import { useEffect, useRef, useCallback, useState, type ReactNode } from 'react';

/* ================================================================== */
/*  PARTICLE FIELD — lightweight canvas, respects reduced-motion       */
/* ================================================================== */

type Particle = { x: number; y: number; vx: number; vy: number; r: number; a: number };

export function ParticleField({ density = 60, className = '' }: { density?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let particles: Particle[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const getColor = () => {
      const style = getComputedStyle(document.documentElement);
      const primary = style.getPropertyValue('--primary').trim() || '#84CC16';
      const accent = style.getPropertyValue('--accent').trim() || '#0D9488';
      return { primary, accent };
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);

      const count = Math.min(density, Math.floor((w * h) / 14000));
      const { primary, accent } = getColor();
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.8 + 0.6,
        a: Math.random() * 0.4 + 0.1,
      }));
      canvas.dataset.primary = primary;
      canvas.dataset.accent = accent;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const primary = canvas.dataset.primary || '#84CC16';
      const accent = canvas.dataset.accent || '#0D9488';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? accent : primary;
        ctx.globalAlpha = p.a;
        ctx.fill();
      }

      // connection lines
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = primary;
            ctx.globalAlpha = (1 - dist / 120) * 0.08;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [density]);

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden />;
}

/* ================================================================== */
/*  TILT 3D HOOK — pointer-driven rotateX/rotateY                      */
/* ================================================================== */

export function useTilt3D(maxTilt = 8) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--tx', `${(px * maxTilt * 2).toFixed(2)}deg`);
    el.style.setProperty('--ty', `${(-py * maxTilt * 2).toFixed(2)}deg`);
  }, [maxTilt]);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--tx', '0deg');
    el.style.setProperty('--ty', '0deg');
  }, []);

  return { ref, onMouseMove: onMove, onMouseLeave: onLeave, onLeave };
}

/* ================================================================== */
/*  CARD 3D — tilt card with optional glow edge + shine                */
/* ================================================================== */

export function Card3D({
  children,
  className = '',
  glowEdge = true,
  shine = false,
  maxTilt = 8,
}: {
  children: ReactNode;
  className?: string;
  glowEdge?: boolean;
  shine?: boolean;
  maxTilt?: number;
}) {
  const tilt = useTilt3D(maxTilt);
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onLeave}
      className={`tilt-card ${glowEdge ? 'glow-edge' : ''} ${shine ? 'shine' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/* ================================================================== */
/*  GLASS CARD — glassmorphism with optional tilt                      */
/* ================================================================== */

export function GlassCard({
  children,
  className = '',
  tilt = false,
  strong = false,
  maxTilt = 6,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  strong?: boolean;
  maxTilt?: number;
}) {
  const tiltHook = useTilt3D(maxTilt);
  return (
    <div
      ref={tilt ? tiltHook.ref : undefined}
      onMouseMove={tilt ? tiltHook.onMouseMove : undefined}
      onMouseLeave={tilt ? tiltHook.onMouseLeave : undefined}
      className={`${tilt ? 'tilt-card' : ''} glass ${strong ? 'glass-strong' : ''} glow-edge ${className}`}
    >
      {children}
    </div>
  );
}

/* ================================================================== */
/*  SCROLL PROGRESS — top-of-page reading bar                          */
/* ================================================================== */

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
      <div
        className="h-full bg-brand-gradient transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/* ================================================================== */
/*  AURORA BLOBS — animated background gradient orbs                   */
/* ================================================================== */

export function AuroraBlobs({ className = '' }: { className?: string }) {
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let raf = 0;
    let t = 0;
    const animate = () => {
      t += 0.005;
      if (blob1Ref.current) {
        blob1Ref.current.style.transform = `translate(${Math.sin(t) * 40}px, ${Math.cos(t * 0.8) * 30}px)`;
      }
      if (blob2Ref.current) {
        blob2Ref.current.style.transform = `translate(${Math.cos(t * 0.7) * 50}px, ${Math.sin(t * 0.9) * 35}px)`;
      }
      if (blob3Ref.current) {
        blob3Ref.current.style.transform = `translate(${Math.sin(t * 1.1) * 30}px, ${Math.cos(t * 0.6) * 45}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div ref={blob1Ref} className="aurora" style={{ width: '500px', height: '500px', left: '10%', top: '5%', background: 'var(--primary)' }} />
      <div ref={blob2Ref} className="aurora" style={{ width: '450px', height: '450px', right: '5%', top: '10%', background: 'var(--accent)' }} />
      <div ref={blob3Ref} className="aurora" style={{ width: '380px', height: '380px', left: '40%', bottom: '5%', background: 'var(--primary)', opacity: 0.2 }} />
    </div>
  );
}
