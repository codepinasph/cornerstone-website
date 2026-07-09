import { useEffect, useState, useCallback, useRef } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Database,
  FileText,
  Filter,
  LayoutDashboard,
  LineChart,
  Link2,
  Lock,
  Menu,
  Network,
  Plug,
  Repeat,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
  X,
  Zap,
  Clock,
  UserCheck,
  DollarSign,
  Briefcase,
  Mail,
  MapPin,
  Phone,
  Sun,
  Moon,
  Palette,
  type LucideIcon,
} from 'lucide-react';
import { ParticleField, AuroraBlobs, Card3D, ScrollProgress } from './three-d';

/* ================================================================== */
/*  THEME SYSTEM                                                        */
/* ================================================================== */

type ThemeMode = 'light' | 'dark';
type AccentColor = 'lime' | 'teal' | 'blue' | 'rose' | 'amber';

const ACCENT_PRESETS: Record<AccentColor, { light: string; lightHover: string; dark: string; darkHover: string; label: string }> = {
  lime:  { light: '#84CC16', lightHover: '#65A30D', dark: '#A3E635', darkHover: '#84CC16', label: 'Lime'  },
  teal:  { light: '#0D9488', lightHover: '#0F766E', dark: '#2DD4BF', darkHover: '#14B8A6', label: 'Teal'  },
  blue:  { light: '#2563EB', lightHover: '#1D4ED8', dark: '#60A5FA', darkHover: '#3B82F6', label: 'Blue'  },
  rose:  { light: '#E11D48', lightHover: '#BE123C', dark: '#FB7185', darkHover: '#F43F5E', label: 'Rose'  },
  amber: { light: '#D97706', lightHover: '#B45309', dark: '#FBBF24', darkHover: '#F59E0B', label: 'Amber' },
};

function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem('cos-theme-mode') as ThemeMode) || 'light';
  });
  const [accent, setAccent] = useState<AccentColor>(() => {
    if (typeof window === 'undefined') return 'lime';
    return (localStorage.getItem('cos-theme-accent') as AccentColor) || 'lime';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', mode);
    root.classList.add('theme-transition');
    const timer = setTimeout(() => root.classList.remove('theme-transition'), 500);
    localStorage.setItem('cos-theme-mode', mode);
    return () => clearTimeout(timer);
  }, [mode]);

  useEffect(() => {
    const root = document.documentElement;
    const preset = ACCENT_PRESETS[accent];
    if (mode === 'light') {
      root.style.setProperty('--primary', preset.light);
      root.style.setProperty('--primary-hover', preset.lightHover);
    } else {
      root.style.setProperty('--primary', preset.dark);
      root.style.setProperty('--primary-hover', preset.darkHover);
    }
    root.style.setProperty('--brand-gradient', `linear-gradient(135deg, ${preset[mode === 'light' ? 'light' : 'dark']} 0%, var(--accent) 100%)`);
    root.style.setProperty('--brand-gradient-hover', `linear-gradient(135deg, ${preset[mode === 'light' ? 'lightHover' : 'darkHover']} 0%, var(--accent-hover) 100%)`);
    root.style.setProperty('--glow-primary', `${preset[mode === 'light' ? 'light' : 'dark']}33`);
    localStorage.setItem('cos-theme-accent', accent);
  }, [accent, mode]);

  const toggleMode = useCallback(() => setMode((m) => (m === 'light' ? 'dark' : 'light')), []);
  return { mode, accent, setMode, setAccent, toggleMode };
}

/* ================================================================== */
/*  HOOKS                                                               */
/* ================================================================== */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

/* ================================================================== */
/*  PARALLAX — subtle scroll-based movement (respects reduced-motion)   */
/* ================================================================== */

function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
        el.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return ref;
}

/* ================================================================== */
/*  LOGO — responsive width-based sizing                                */
/* ================================================================== */

function LogoImage({ className = '' }: { className?: string }) {
  return (
    <img
      src="/images/cornerstoneOS-logo.png"
      alt="CornerstoneOS"
      className={`h-auto w-auto max-w-full object-contain ${className}`}
      draggable={false}
    />
  );
}

/* ================================================================== */
/*  THEME CUSTOMIZER                                                    */
/* ================================================================== */

function ThemeCustomizer({ mode, accent, setMode, setAccent }: {
  mode: ThemeMode; accent: AccentColor;
  setMode: (m: ThemeMode) => void; setAccent: (a: AccentColor) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
        aria-label="Theme settings"
      >
        <Palette className="h-4.5 w-4.5" style={{ color: 'var(--primary)' }} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-xl" style={{ boxShadow: 'var(--shadow-float)' }}>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--text)]">Theme Settings</span>
              <button onClick={() => setOpen(false)} className="text-[var(--text-dim)] hover:text-[var(--text)]">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mode toggle */}
            <div className="mb-5">
              <div className="mb-2.5 text-xs font-medium text-[var(--text-muted)]">Appearance</div>
              <div className="grid grid-cols-2 gap-2">
                {(['light', 'dark'] as ThemeMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all"
                    style={mode === m
                      ? { borderColor: 'var(--primary)', background: 'var(--primary-light)', color: 'var(--primary)' }
                      : { borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-muted)' }}
                  >
                    {m === 'light' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                    {m === 'light' ? 'Light' : 'Dark'}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent color */}
            <div>
              <div className="mb-2.5 text-xs font-medium text-[var(--text-muted)]">Accent Color</div>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(ACCENT_PRESETS) as AccentColor[]).map((key) => {
                  const preset = ACCENT_PRESETS[key];
                  const color = mode === 'light' ? preset.light : preset.dark;
                  return (
                    <button
                      key={key}
                      onClick={() => setAccent(key)}
                      className="group relative flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-[10px] font-medium transition-all"
                      style={accent === key
                        ? { borderColor: color, background: `${color}15`, color }
                        : { borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-muted)' }}
                    >
                      <span className="h-3 w-3 rounded-full" style={{ background: color }} />
                      {preset.label}
                      {accent === key && <Check className="h-3 w-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mt-4 border-t border-[var(--border-soft)] pt-3 text-[10px] text-[var(--text-dim)]">
              Your preference is saved automatically.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/* ================================================================== */
/*  SHARED UI                                                            */
/* ================================================================== */

function Pill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)]/60 px-3.5 py-1.5 text-xs font-medium text-[var(--text-muted)] backdrop-blur ${className}`}>
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <span className="h-px w-8 bg-[var(--primary)]" />
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">
        {children}
      </span>
    </div>
  );
}

function PrimaryButton({ children, href = '#booking', className = '' }: { children: React.ReactNode; href?: string; className?: string }) {
  return (
    <a href={href} className={`group inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-[0_0_40px_-6px_var(--glow-primary)] hover:brightness-110 hover:-translate-y-0.5 ${className}`}>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );
}

function GhostButton({ children, href = '#product', className = '' }: { children: React.ReactNode; href?: string; className?: string }) {
  return (
    <a href={href} className={`inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)]/40 px-6 py-3.5 text-sm font-semibold text-[var(--text)] backdrop-blur transition-all duration-300 hover:border-[var(--accent)]/40 hover:bg-[var(--bg-card)] ${className}`}>
      {children}
    </a>
  );
}

/* ================================================================== */
/*  NAVBAR                                                              */
/* ================================================================== */

const NAV_LINKS = [
  { label: 'Platform', href: '#product' },
  { label: 'CRM',      href: '#crm' },
  { label: 'HRIS',     href: '#hris' },
  { label: 'Payroll',  href: '#payroll' },
  { label: 'AI',       href: '#ai' },
  { label: 'About Us', href: '#about' },
];

function Navbar({ mode, accent, setMode, setAccent }: {
  mode: ThemeMode; accent: AccentColor; setMode: (m: ThemeMode) => void; setAccent: (a: AccentColor) => void;
}) {
  const scrolled = useScrolled(20);
  const [open, setOpen] = useState(false);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'glass-strong border-b border-[var(--border)] shadow-sm' : 'border-b border-transparent bg-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-18 sm:gap-4 sm:px-8">

        {/* Logo — clamp-based responsive width: ~112px mobile → ~170px desktop */}
        <a href="#top" className="flex flex-none items-center transition-transform duration-300 hover:scale-[1.02]" aria-label="CornerstoneOS home">
          <LogoImage
            className="w-[130px] min-[375px]:w-[150px] sm:w-[180px] lg:w-[200px]"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="group relative rounded-full px-3.5 py-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]">
              {l.label}
              <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 scale-x-0 rounded-full bg-brand-gradient transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <ThemeCustomizer mode={mode} accent={accent} setMode={setMode} setAccent={setAccent} />
          <a href="#booking" className="group hidden items-center gap-1.5 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 hover:shadow-[0_0_28px_-6px_var(--glow-primary)] hover:-translate-y-0.5 sm:inline-flex">
            Book Appointment
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <button onClick={() => setOpen((v) => !v)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text)] transition-colors hover:bg-[var(--bg-elevated)] lg:hidden" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`overflow-hidden border-t border-[var(--border)] glass-strong transition-all duration-300 lg:hidden ${open ? 'max-h-96' : 'max-h-0 border-t-0'}`}>
        <nav className="flex flex-col gap-1 px-4 py-4 sm:px-8">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card)] hover:text-[var(--text)]">
              {l.label}
            </a>
          ))}
          <a href="#booking" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-gradient px-5 py-3 text-sm font-semibold text-white">
            Book Appointment <ArrowUpRight className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ================================================================== */
/*  HERO                                                                */
/* ================================================================== */

function Hero() {
  const blob1Ref = useParallax(0.15);
  const blob2Ref = useParallax(0.25);

  return (
    <section id="top" className="scene-3d relative overflow-hidden pt-32 pb-20 sm:pt-44 sm:pb-28 depth-bg">
      <ParticleField density={50} />
      <AuroraBlobs />
      <div className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-70" />
      <div ref={blob1Ref} className="parallax pointer-events-none absolute left-1/3 top-0 h-[500px] w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-[130px]" style={{ background: 'var(--primary)' }} />
      <div ref={blob2Ref} className="parallax pointer-events-none absolute right-1/4 top-10 h-[400px] w-[500px] rounded-full opacity-15 blur-[130px]" style={{ background: 'var(--accent)' }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--bg)] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">

          <div className="animate-fade-up">
            <Pill className="mb-8 glass" >
              <span className="h-1.5 w-1.5 rounded-full animate-blink" style={{ background: 'var(--primary)' }} />
              One core business platform — AI | CRM | HRIS | Payroll
            </Pill>
          </div>

          <h1 className="animate-fade-up text-balance text-4xl font-bold leading-[1.06] tracking-tight text-[var(--text)] sm:text-6xl lg:text-[4.25rem]" style={{ animationDelay: '60ms' }}>
            Don't Just{' '}
            <span className="relative inline-block">
              <span className="text-[var(--text-dim)] italic">Simplify</span>
              <svg className="draw-line absolute -bottom-1 left-0 w-full" viewBox="0 0 200 10" fill="none" preserveAspectRatio="none">
                <path d="M2 7C50 2 150 2 198 7" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
            .<br />
            Make Them{' '}
            <span className="text-brand-gradient gradient-animate">Accurate</span>,{' '}
            <span className="text-brand-gradient gradient-animate">Connected</span>,
            <br className="hidden sm:block" />
            {' '}and <span className="text-brand-gradient gradient-animate">Intelligent</span>
          </h1>

          <p className="animate-fade-up mx-auto mt-7 max-w-2xl text-pretty text-base leading-relaxed text-[var(--text-muted)] sm:text-lg" style={{ animationDelay: '120ms' }}>
            Bring CRM, HRIS, and Payroll together with AI-driven workflows that help reduce errors,
            improve decisions, and keep every process connected from start to finish.
          </p>

          <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: '180ms' }}>
            <PrimaryButton>Book an Appointment</PrimaryButton>
            <GhostButton href="#product">
              <LayoutDashboard className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              See the Platform
            </GhostButton>
          </div>
        </div>

        <div className="animate-scale-in relative mx-auto mt-20 max-w-5xl perspective-wrap" style={{ animationDelay: '260ms' }}>
          <PlatformVisual />
        </div>
      </div>
    </section>
  );
}

function PlatformVisual() {
  const modules = [
    { label: 'CRM',     icon: TrendingUp,  desc: 'Pipeline, customers, and follow-ups',   href: '#crm' },
    { label: 'HRIS',    icon: Users,       desc: 'People records and employee workflows', href: '#hris' },
    { label: 'Payroll', icon: DollarSign,  desc: 'Accurate pay from approved data',       href: '#payroll' },
  ];
  const chips = [
    { label: 'AI Layer',       icon: Sparkles },
    { label: 'Live Reports',   icon: LineChart },
    { label: 'Attendance',     icon: Clock },
    { label: 'Recruitment',    icon: UserCheck },
    { label: 'End-to-End Ops', icon: Workflow },
  ];

  return (
    <div className="glass glass-strong preserve-3d relative rounded-2xl p-6 sm:p-10" style={{ transform: 'rotateX(2deg)', boxShadow: 'var(--shadow-3d-lift)' }}>
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-50" style={{ background: 'linear-gradient(135deg, var(--glow-primary) 0%, transparent 50%, var(--glow-accent) 100%)' }} />

      <div className="relative">
        {/* Header with logo */}
        <div className="tilt-layer-sm mb-8 flex items-center justify-between">
          <LogoImage className="w-[130px] sm:w-[150px]" />
          <div className="flex items-center gap-1.5 rounded-full glass px-3 py-1">
            <span className="h-2 w-2 rounded-full animate-blink" style={{ background: 'var(--primary)' }} />
            <span className="text-xs font-medium text-[var(--text-dim)]">Live</span>
          </div>
        </div>

        {/* Module cards — 3D floating tiles */}
        <div className="grid gap-3 sm:grid-cols-3">
          {modules.map((m, i) => (
            <a key={m.label} href={m.href} className="float-panel group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 transition-all duration-300 hover:border-[var(--accent)]/40 hover:bg-[var(--bg-elevated)] animate-float-slow" style={{ animationDelay: `${i * 0.8}s` }}>
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'var(--glow-accent)' }} />
              <div className="relative">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border transition-transform duration-300 group-hover:scale-110" style={{ borderColor: 'var(--glow-primary)', background: 'var(--primary-light)' }}>
                  <m.icon className="h-4 w-4 transition-transform duration-300 group-hover:animate-bounce-sm" style={{ color: 'var(--primary)' }} />
                </div>
                <div className="text-sm font-semibold text-[var(--text)]">{m.label}</div>
                <div className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">{m.desc}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((c) => (
            <div key={c.label} className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs text-[var(--text-muted)]">
              <c.icon className="h-3 w-3" style={{ color: 'var(--accent)' }} />
              {c.label}
            </div>
          ))}
        </div>

        {/* Footer bar */}
        <div className="glass mt-5 flex items-center justify-between rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--primary)' }} />
            AI-Assisted Application
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
            <Lock className="h-3 w-3" />
            SOC 2 · ISO 27001
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  STATS BAR                                                           */
/* ================================================================== */

function StatsBar() {
  const stats = [
    { value: '73%',   label: 'Less manual admin work' },
    { value: '4.2×',  label: 'Faster payroll cycles' },
    { value: '99.2%', label: 'Data accuracy across modules' },
    { value: '1',     label: 'Source of truth for the whole org' },
  ];
  return (
    <section className="border-y border-[var(--border)] depth-bg">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-px sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className="glass float-panel group px-6 py-8 text-center sm:py-10">
              <div className="text-3xl font-bold tracking-tight transition-transform duration-300 group-hover:scale-110 sm:text-4xl" style={{ color: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)' }}>
                {s.value}
              </div>
              <div className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  PLATFORM OVERVIEW                                                   */
/* ================================================================== */

function PlatformOverview() {
  const features = [
    { icon: Database,  useAccent: false, title: 'One Source of Truth',   desc: 'Customer, employee, attendance, and payroll data stay connected — no more reconciling spreadsheets across teams.' },
    { icon: Workflow,  useAccent: true,  title: 'Less Manual Work',       desc: 'Replace repetitive admin steps with guided workflows and approvals that move data forward automatically.' },
    { icon: Sparkles,  useAccent: false, title: 'Smarter Decisions',      desc: 'AI surfaces anomalies, suggests next actions, and flags risks before they become costly mistakes.' },
    { icon: Shield,    useAccent: true,  title: 'Controlled & Auditable', desc: 'Every change is logged. Role-based access keeps the right people in the right data at the right time.' },
  ];

  return (
    <section id="product" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="reveal mx-auto max-w-3xl text-center">
          <SectionLabel>The Platform</SectionLabel>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-[var(--text)] sm:text-5xl">
            One connected core for your{' '}
            <span className="text-brand-gradient">whole operation</span>
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            CornerstoneOS unifies the systems that run your business — sales, people, and pay — into
            a single layer where data flows freely and every action is traceable.
          </p>
        </div>

        <div className="reveal reveal-stagger mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const color = f.useAccent ? 'var(--accent)' : 'var(--primary)';
            return (
              <Card3D key={f.title} className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 hover:bg-[var(--bg-elevated)]">
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" style={{ background: f.useAccent ? 'var(--glow-accent)' : 'var(--glow-primary)' }} />
                <div className="relative tilt-layer-sm">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110" style={{ borderColor: f.useAccent ? 'var(--glow-accent)' : 'var(--glow-primary)', background: f.useAccent ? 'var(--accent-soft)' : 'var(--primary-light)' }}>
                    <f.icon className="h-5 w-5 transition-transform duration-300 group-hover:animate-bounce-sm" style={{ color }} />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text)]">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{f.desc}</p>
                </div>
              </Card3D>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  MODULE SECTIONS                                                     */
/* ================================================================== */

type ModuleDef = {
  id: string; label: string; name: string; tagline: string; description: string;
  icon: LucideIcon; useAccent: boolean; bullets: string[]; mock: React.ReactNode;
};

function ModuleSection({ mod, index }: { mod: ModuleDef; index: number }) {
  const reversed = index % 2 === 1;
  const color = mod.useAccent ? 'var(--accent)' : 'var(--primary)';
  const glow  = mod.useAccent ? 'var(--glow-accent)' : 'var(--glow-primary)';
  const soft  = mod.useAccent ? 'var(--accent-soft)' : 'var(--primary-light)';
  const glowRef = useRef<HTMLDivElement>(null);

  return (
    <section id={mod.id} className="relative py-20 sm:py-28 depth-bg">
      <div ref={glowRef} className="parallax pointer-events-none absolute top-1/4 h-[400px] w-[500px] rounded-full blur-[130px] opacity-30" style={{ background: reversed ? 'var(--glow-accent)' : 'var(--glow-primary)', [reversed ? 'left' : 'right' as const]: '5%' }} />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className={`grid items-center gap-12 lg:grid-cols-2 ${reversed ? 'lg:[&>*:first-child]:order-2' : ''}`}>
          <div className="reveal">
            <SectionLabel>{mod.label}</SectionLabel>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border" style={{ borderColor: glow, background: soft }}>
              <mod.icon className="h-6 w-6" style={{ color }} />
            </div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">{mod.name}</h2>
            <p className="mt-2 text-sm font-semibold" style={{ color }}>{mod.tagline}</p>
            <p className="mt-5 text-pretty text-base leading-relaxed text-[var(--text-muted)]">{mod.description}</p>
            <ul className="mt-7 space-y-3">
              {mod.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full" style={{ background: soft }}>
                    <Check className="h-3 w-3" style={{ color }} />
                  </span>
                  <span className="text-sm leading-relaxed text-[var(--text-muted)]">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <GhostButton href="#booking">
                Explore {mod.label}
                <ArrowRight className="h-4 w-4" style={{ color }} />
              </GhostButton>
            </div>
          </div>
          <div className="reveal">{mod.mock}</div>
        </div>
      </div>
    </section>
  );
}

/* --- CRM mock --- */
function CrmMock() {
  const stages = [
    { name: 'Lead',      count: 24, value: '$184K', fill: 30 },
    { name: 'Qualified', count: 12, value: '$312K', fill: 55 },
    { name: 'Proposal',  count:  7, value: '$248K', fill: 75 },
    { name: 'Closed',    count:  4, value: '$176K', fill: 100 },
  ];
  return (
    <div className="glass float-panel relative rounded-2xl p-5 sm:p-6" >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-[var(--text)]">Sales Pipeline</div>
          <div className="text-xs text-[var(--text-dim)]">Q3 · 47 deals · $920K weighted</div>
        </div>
        <div className="flex items-center gap-2">
          {[Filter, Search].map((Icon, i) => (
            <div key={i} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)]">
              <Icon className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {stages.map((s) => (
          <div key={s.name} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3 transition-transform duration-300 hover:scale-[1.03]">
            <div className="text-xs font-medium text-[var(--text-muted)]">{s.name}</div>
            <div className="mt-1 text-lg font-bold text-[var(--text)]">{s.count}</div>
            <div className="text-xs font-medium" style={{ color: 'var(--primary)' }}>{s.value}</div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--bg)]">
              <div className="h-full rounded-full" style={{ width: `${s.fill}%`, background: 'var(--brand-gradient)' }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {[
          { name: 'Northwind Logistics',  stage: 'Proposal',  value: '$48K', tag: 'Hot'  },
          { name: 'Atlas Manufacturing',  stage: 'Qualified', value: '$72K', tag: 'Warm' },
          { name: 'Cobalt Retail Group',  stage: 'Closed',    value: '$36K', tag: 'Won'  },
        ].map((d) => (
          <div key={d.name} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-card)]/60 px-3.5 py-2.5 transition-colors hover:bg-[var(--bg-elevated)]">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ background: 'var(--brand-gradient)' }}>
                {d.name[0]}
              </div>
              <div>
                <div className="text-xs font-medium text-[var(--text)]">{d.name}</div>
                <div className="text-[10px] text-[var(--text-dim)]">{d.stage}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[var(--text)]">{d.value}</span>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={d.tag === 'Won'
                  ? { background: 'var(--primary-light)', color: 'var(--primary)' }
                  : d.tag === 'Hot'
                    ? { background: 'rgba(249,115,22,0.15)', color: '#f97316' }
                    : { background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                {d.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- HRIS mock --- */
function HrisMock() {
  const people = [
    { name: 'Maya Chen',    role: 'Operations Lead',     dept: 'Ops',     status: 'Active',   initials: 'MC' },
    { name: 'Daniel Ortiz', role: 'Sales Manager',       dept: 'Sales',   status: 'Active',   initials: 'DO' },
    { name: 'Priya Nair',   role: 'HR Business Partner', dept: 'People',  status: 'On leave', initials: 'PN' },
    { name: 'Tom Becker',   role: 'Finance Analyst',     dept: 'Finance', status: 'Active',   initials: 'TB' },
  ];
  return (
    <div className="glass float-panel relative rounded-2xl p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-[var(--text)]">People Directory</div>
          <div className="text-xs text-[var(--text-dim)]">128 employees · 6 departments</div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 text-[10px] font-semibold" style={{ color: 'var(--accent)' }}>
          <span className="h-1.5 w-1.5 rounded-full animate-blink" style={{ background: 'var(--accent)' }} />
          Synced
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label: 'Headcount',         value: '128', icon: Users,     useAccent: false },
          { label: 'Present today',     value: '119', icon: UserCheck, useAccent: true  },
          { label: 'Pending approvals', value: '7',   icon: FileText,  useAccent: false },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3 transition-transform duration-300 hover:scale-[1.03]">
            <c.icon className="h-4 w-4" style={{ color: c.useAccent ? 'var(--accent)' : 'var(--primary)' }} />
            <div className="mt-2 text-xl font-bold text-[var(--text)]">{c.value}</div>
            <div className="text-[10px] text-[var(--text-muted)]">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {people.map((p) => (
          <div key={p.name} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-card)]/60 px-3.5 py-2.5 transition-colors hover:bg-[var(--bg-elevated)]">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ background: 'var(--brand-gradient)' }}>
                {p.initials}
              </div>
              <div>
                <div className="text-xs font-medium text-[var(--text)]">{p.name}</div>
                <div className="text-[10px] text-[var(--text-dim)]">{p.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">{p.dept}</span>
              <span className="flex items-center gap-1 text-[10px]" style={{ color: p.status === 'Active' ? 'var(--primary)' : '#f59e0b' }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.status === 'Active' ? 'var(--primary)' : '#f59e0b' }} />
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Payroll mock --- */
function PayrollMock() {
  const rows = [
    { name: 'Maya Chen',    gross: '$8,400', net: '$6,420', status: 'Approved' },
    { name: 'Daniel Ortiz', gross: '$7,200', net: '$5,510', status: 'Approved' },
    { name: 'Priya Nair',   gross: '$6,800', net: '$5,210', status: 'Pending'  },
    { name: 'Tom Becker',   gross: '$5,400', net: '$4,150', status: 'Approved' },
  ];
  return (
    <div className="glass float-panel relative rounded-2xl p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-[var(--text)]">Payroll Run · July</div>
          <div className="text-xs text-[var(--text-dim)]">Cycle 14 · 128 employees</div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 text-[10px] font-semibold" style={{ color: 'var(--primary)' }}>
          <CheckCircle2 className="h-3 w-3" style={{ color: 'var(--primary)' }} />
          Reconciled
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3.5 transition-transform duration-300 hover:scale-[1.03]">
          <div className="text-[10px] text-[var(--text-muted)]">Total gross</div>
          <div className="mt-1 text-xl font-bold text-[var(--text)]">$1.084M</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3.5 transition-transform duration-300 hover:scale-[1.03]">
          <div className="text-[10px] text-[var(--text-muted)]">Variance vs. budget</div>
          <div className="mt-1 text-xl font-bold" style={{ color: 'var(--primary)' }}>-0.4%</div>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)]">
        <div className="grid grid-cols-3 border-b border-[var(--border)] bg-[var(--bg-card)]/60 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-dim)]">
          <span>Employee</span><span className="text-right">Net pay</span><span className="text-right">Status</span>
        </div>
        {rows.map((r) => (
          <div key={r.name} className="grid grid-cols-3 items-center border-b border-[var(--border-soft)] px-3.5 py-2.5 last:border-0 transition-colors hover:bg-[var(--bg-elevated)]">
            <div>
              <div className="text-xs font-medium text-[var(--text)]">{r.name}</div>
              <div className="text-[10px] text-[var(--text-dim)]">{r.gross} gross</div>
            </div>
            <span className="text-right text-xs font-semibold text-[var(--text)]">{r.net}</span>
            <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={r.status === 'Approved'
                ? { background: 'var(--primary-light)', color: 'var(--primary)' }
                : { background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const MODULES: ModuleDef[] = [
  {
    id: 'crm', label: 'CRM', name: 'CRM that closes the loop', useAccent: false,
    tagline: 'Pipeline, customers, and follow-ups',
    description: 'Track every deal from first contact to signed contract. CornerstoneOS keeps your pipeline honest with real-time stage updates, automated follow-ups, and AI-scored deal health — so nothing slips through the cracks.',
    icon: TrendingUp,
    bullets: ['Visual pipeline with weighted forecasting', 'AI-suggested next actions and follow-up reminders', 'Customer 360 with full interaction history', 'Quotes, contracts, and e-signature in one flow'],
    mock: <CrmMock />,
  },
  {
    id: 'hris', label: 'HRIS', name: 'People records that stay current', useAccent: true,
    tagline: 'People records and employee workflows',
    description: 'Onboard, manage, and offboard employees with a single record that every other module trusts. Attendance, leave, and org structure update automatically — payroll never reads stale data again.',
    icon: Users,
    bullets: ['Self-service employee profiles and documents', 'Attendance and leave tracking with approvals', 'Org chart and reporting lines, always in sync', 'Onboarding checklists that trigger downstream workflows'],
    mock: <HrisMock />,
  },
  {
    id: 'payroll', label: 'Payroll', name: 'Accurate pay from approved data', useAccent: false,
    tagline: 'Accurate pay from approved data',
    description: 'Run payroll from the same data your HR and finance teams already approved. CornerstoneOS reconciles attendance, changes, and earnings automatically — so every run closes clean the first time.',
    icon: DollarSign,
    bullets: ['Pay runs built from approved HRIS data', 'Automated tax, deduction, and benefits calculation', 'Variance alerts before you submit a run', 'Payslips, bank files, and reports in one click'],
    mock: <PayrollMock />,
  },
];

/* ================================================================== */
/*  AI SECTION                                                          */
/* ================================================================== */

function AiSection() {
  const glowRef = useParallax(0.12);
  const capabilities = [
    { icon: Sparkles, useAccent: false, title: 'Anomaly detection',       desc: 'AI flags unusual pay, attendance, or deal changes before they cost you.' },
    { icon: Zap,      useAccent: true,  title: 'Next-best-action',         desc: 'Suggested steps for sales reps, HR, and payroll owners — grounded in your data.' },
    { icon: FileText, useAccent: false, title: 'Natural-language reports', desc: 'Ask "show me overtime by department this month" and get an answer in seconds.' },
    { icon: Repeat,   useAccent: true,  title: 'Workflow automation',      desc: 'Turn multi-step approvals into one-click flows that still keep full audit trails.' },
  ];
  return (
    <section id="ai" className="relative overflow-hidden py-24 sm:py-32 depth-bg">
      <div ref={glowRef} className="parallax pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]" style={{ background: 'radial-gradient(circle, var(--glow-primary) 0%, var(--glow-accent) 60%, transparent 100%)' }} />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="reveal mx-auto max-w-3xl text-center">
          <SectionLabel>AI Layer</SectionLabel>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-[var(--text)] sm:text-5xl">
            Intelligence woven into{' '}
            <span className="text-brand-gradient">every workflow</span>
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            CornerstoneOS doesn't bolt AI on top. It's built into the data layer — so every module
            benefits from the same context, the same rules, and the same audit trail.
          </p>
        </div>

        <div className="reveal mt-16 grid gap-4 lg:grid-cols-2">
          {/* Chat mock */}
          <div className="glass float-panel relative overflow-hidden rounded-2xl p-6">
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border" style={{ borderColor: 'var(--glow-primary)', background: 'var(--primary-light)' }}>
                <Sparkles className="h-4 w-4" style={{ color: 'var(--primary)' }} />
              </div>
              <span className="text-sm font-semibold text-[var(--text)]">CornerstoneAI</span>
              <span className="ml-auto text-xs text-[var(--text-dim)]">Powered by your data</span>
            </div>
            <div className="space-y-3">
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-xs text-white" style={{ background: 'var(--brand-gradient)' }}>
                Show me overtime cost by department for June and flag anything above budget.
              </div>
              <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--bg-card)] px-3.5 py-2.5 text-xs leading-relaxed text-[var(--text-muted)]">
                Operations ran 22% over budget ($14.8K vs $12.1K), driven by weekend coverage.
                Logistics was 8% under. I've drafted an approval to adjust the July cap — want me to
                send it to Finance?
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="h-1.5 w-1.5 rounded-full animate-blink" style={{ background: 'var(--primary)' }} />
                <span className="text-[10px] text-[var(--text-dim)]">Generating report…</span>
              </div>
            </div>
          </div>

          {/* Capability cards */}
          <div className="reveal reveal-stagger grid gap-3 sm:grid-cols-2">
            {capabilities.map((c) => {
              const color = c.useAccent ? 'var(--accent)' : 'var(--primary)';
              const glow  = c.useAccent ? 'var(--glow-accent)' : 'var(--glow-primary)';
              const soft  = c.useAccent ? 'var(--accent-soft)' : 'var(--primary-light)';
              return (
                <Card3D key={c.title} className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 hover:bg-[var(--bg-elevated)]">
                  <div className="tilt-layer-sm">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110" style={{ borderColor: glow, background: soft }}>
                      <c.icon className="h-5 w-5 transition-transform duration-300 group-hover:animate-bounce-sm" style={{ color }} />
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--text)]">{c.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">{c.desc}</p>
                  </div>
                </Card3D>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  HOW IT WORKS                                                        */
/* ================================================================== */

function HowItWorks() {
  const steps = [
    { n: '01', icon: Plug,      useAccent: false, title: 'Connect your data',  desc: 'Import from spreadsheets, your existing CRM, HR system, or payroll provider. CornerstoneOS maps it to one unified schema.' },
    { n: '02', icon: Network,   useAccent: true,  title: 'Link the workflows', desc: 'Define approvals, handoffs, and rules once. Every module respects them — so data moves cleanly from sales to people to pay.' },
    { n: '03', icon: Sparkles,  useAccent: false, title: 'Let AI assist',       desc: 'Anomaly detection, next-best-actions, and natural-language reporting run continuously across your connected data.' },
    { n: '04', icon: LineChart, useAccent: true,  title: 'Run from one core',  desc: 'Your teams work in their familiar views, but every action updates the same source of truth — in real time, fully audited.' },
  ];
  return (
    <section className="relative py-24 sm:py-32 depth-bg">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="reveal mx-auto max-w-3xl text-center">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-[var(--text)] sm:text-5xl">
            From disconnected tools to{' '}
            <span className="text-brand-gradient">one operating layer</span>
          </h2>
        </div>
        <div className="reveal reveal-stagger mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const color = s.useAccent ? 'var(--accent)' : 'var(--primary)';
            const glow  = s.useAccent ? 'var(--glow-accent)' : 'var(--glow-primary)';
            const soft  = s.useAccent ? 'var(--accent-soft)' : 'var(--primary-light)';
            return (
              <div key={s.n} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-full top-12 hidden h-px w-full -translate-x-4 bg-gradient-to-r from-[var(--border)] to-transparent lg:block" />
                )}
                <Card3D className="group relative h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 hover:bg-[var(--bg-elevated)]">
                  <div className="tilt-layer-sm mb-5 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110" style={{ borderColor: glow, background: soft }}>
                      <s.icon className="h-5 w-5 transition-transform duration-300 group-hover:animate-bounce-sm" style={{ color }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color }}>{s.n}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text)]">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{s.desc}</p>
                </Card3D>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  INTEGRATIONS                                                        */
/* ================================================================== */

function Integrations() {
  const logos = [
    'slack', 'google-workspace', 'microsoft-365', 'quickbooks',
    'xero', 'gusto', 'bamboohr', 'rippling',
    'docusign', 'stripe', 'zapier', 'workday',
    'sap', 'oracle', 'adp',
  ];

  return (
    <section className="relative border-y border-[var(--border)] py-16 sm:py-20 depth-bg overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-dim)]">
          Connects with the tools you already use
        </p>
      </div>

      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--bg)] to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--bg)] to-transparent sm:w-40" />

      {/* Single row — infinite scroll right to left */}
      <div className="marquee-pause relative flex overflow-hidden">
        <div className="animate-marquee flex flex-none items-center gap-12 pr-12 sm:gap-16 sm:pr-16">
          {logos.map((name) => <LogoTile key={`a-${name}`} name={name} />)}
        </div>
        <div className="animate-marquee flex flex-none items-center gap-12 pr-12 sm:gap-16 sm:pr-16" aria-hidden>
          {logos.map((name) => <LogoTile key={`b-${name}`} name={name} />)}
        </div>
      </div>
    </section>
  );
}

function LogoTile({ name }: { name: string }) {
  const label = name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <div className="logo-tile flex flex-none items-center justify-center">
      <img
        src={`/logos/${name}.svg`}
        alt={label}
        className="h-7 w-auto max-w-[140px] sm:h-8"
        loading="lazy"
      />
    </div>
  );
}

/* ================================================================== */
/*  ABOUT                                                               */
/* ================================================================== */

function About() {
  const values = [
    { icon: Shield, useAccent: false, title: 'Accuracy first',            desc: "We build for the teams that can't afford a wrong number on payday." },
    { icon: Link2,  useAccent: true,  title: 'Connection by default',      desc: 'No module is an island. Every feature assumes data flows to the next.' },
    { icon: Lock,   useAccent: false, title: 'Trust through transparency', desc: 'Full audit trails, role-based access, and no black-box decisions.' },
  ];
  return (
    <section id="about" className="relative py-24 sm:py-32 depth-bg">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="reveal">
            <SectionLabel>About Us</SectionLabel>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
              Built for teams who are tired of{' '}
              <span className="text-brand-gradient">stitching tools together</span>
            </h2>
            <p className="mt-5 text-pretty text-base leading-relaxed text-[var(--text-muted)]">
              CornerstoneOS started inside a mid-market operator running CRM, HR, and payroll on five
              different platforms — and losing hours every week reconciling them. We built a single
              layer where customer, people, and pay data live together, move together, and stay
              accurate together.
            </p>
            <p className="mt-4 text-pretty text-base leading-relaxed text-[var(--text-muted)]">
              Today we help growing companies replace fragmented back-office tooling with one
              connected core — and put AI to work on the data that already flows through it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Pill><Briefcase className="h-3 w-3" style={{ color: 'var(--primary)' }} /> Mid-market focused</Pill>
              <Pill><MapPin   className="h-3 w-3" style={{ color: 'var(--accent)'  }} /> Remote-first team</Pill>
              <Pill><Lock     className="h-3 w-3" style={{ color: 'var(--primary)' }} /> SOC 2 Type II</Pill>
            </div>
          </div>
          <div className="reveal reveal-stagger space-y-3">
            {values.map((v) => {
              const color = v.useAccent ? 'var(--accent)' : 'var(--primary)';
              const glow  = v.useAccent ? 'var(--glow-accent)' : 'var(--glow-primary)';
              const soft  = v.useAccent ? 'var(--accent-soft)' : 'var(--primary-light)';
              return (
                <Card3D key={v.title} className="group flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 hover:bg-[var(--bg-elevated)]">
                  <div className="tilt-layer-sm flex h-11 w-11 flex-none items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110" style={{ borderColor: glow, background: soft }}>
                    <v.icon className="h-5 w-5 transition-transform duration-300 group-hover:animate-bounce-sm" style={{ color }} />
                  </div>
                  <div className="tilt-layer-sm">
                    <h3 className="text-base font-semibold text-[var(--text)]">{v.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">{v.desc}</p>
                  </div>
                </Card3D>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  BOOKING                                                             */
/* ================================================================== */

function Booking() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', size: '50-200', service: '', message: '' });
  const blob1Ref = useParallax(0.15);
  const blob2Ref = useParallax(0.22);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  return (
    <section id="booking" className="relative overflow-hidden py-24 sm:py-32 depth-bg">
      <div ref={blob1Ref} className="parallax pointer-events-none absolute left-1/4 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full blur-[120px]" style={{ background: 'var(--glow-primary)' }} />
      <div ref={blob2Ref} className="parallax pointer-events-none absolute right-1/4 top-20 h-[300px] w-[500px] rounded-full blur-[120px]" style={{ background: 'var(--glow-accent)' }} />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="reveal">
            <SectionLabel>Book an appointment</SectionLabel>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-[var(--text)] sm:text-5xl">
              See CornerstoneOS on{' '}
              <span className="text-brand-gradient">your data</span>
            </h2>
            <p className="mt-5 text-pretty text-base leading-relaxed text-[var(--text-muted)]">
              Book a 30-minute walkthrough. We'll connect a sample of your CRM, HR, and payroll data
              and show you exactly where the errors, gaps, and manual steps are hiding.
            </p>
            <ul className="mt-8 space-y-3">
              {['Live demo on your own data shape', 'Accuracy and variance report, free', 'No sales pitch — just the product'].map((b, i) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: i % 2 === 0 ? 'var(--primary-light)' : 'var(--accent-soft)' }}>
                    <Check className="h-3 w-3" style={{ color: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)' }} />
                  </span>
                  <span className="text-sm text-[var(--text-muted)]">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal">
            <div className="glass glass-strong float-panel relative rounded-2xl p-6 sm:p-8">
              {submitted ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'var(--primary-light)' }}>
                    <CheckCircle2 className="h-7 w-7" style={{ color: 'var(--primary)' }} />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text)]">Request received</h3>
                  <p className="mt-2 max-w-xs text-sm text-[var(--text-muted)]">
                    Thanks, {form.name || 'there'}. Our team will reach out within one business day to schedule your walkthrough{form.service ? ` about ${form.service}` : ''}.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 text-xs font-medium hover:underline" style={{ color: 'var(--primary)' }}>
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name"  icon={Users}    value={form.name}    onChange={(v) => setForm({ ...form, name: v })}    placeholder="Jane Doe"         required />
                    <Field label="Work email" icon={Mail}     value={form.email}   onChange={(v) => setForm({ ...form, email: v })}   placeholder="jane@company.com" required type="email" />
                  </div>
                  <Field label="Company" icon={Briefcase} value={form.company} onChange={(v) => setForm({ ...form, company: v })} placeholder="Acme Inc." required />
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">Company size</label>
                    <div className="flex flex-wrap gap-2">
                      {['1-50','50-200','200-1000','1000+'].map((s) => (
                        <button key={s} type="button" onClick={() => setForm({ ...form, size: s })}
                          className="rounded-full border px-4 py-2 text-xs font-medium transition-colors"
                          style={form.size === s
                            ? { borderColor: 'var(--primary)', background: 'var(--primary-light)', color: 'var(--primary)' }
                            : { borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ServiceSelect value={form.service} onChange={(v) => setForm({ ...form, service: v })} />
                  <div>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} placeholder="e.g. payroll accuracy, CRM-to-onboarding flow…"
                      className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none" />
                  </div>
                  <button type="submit" className="group flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 hover:shadow-[0_0_36px_-6px_var(--glow-primary)]">
                    Request walkthrough
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <p className="text-center text-[10px] text-[var(--text-dim)]">By submitting you agree to our privacy policy. We never share your data.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    'CRM System',
    'HRIS System',
    'Payroll Services',
    'Biometrics & Attendance',
    'AI-Assisted Business Solutions',
    'End-to-End Business Software Package',
    'System Integration',
    'Custom Software Development',
    'Not sure yet / Need consultation',
  ];
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">
        Service Interested In <span style={{ color: 'var(--primary)' }}>*</span>
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--bg-card)] py-3 pl-4 pr-10 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
        >
          <option value="" disabled>Select a service…</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-dim)]" />
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, value, onChange, placeholder, type = 'text', required = false }: {
  label: string; icon: LucideIcon; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">
        {label} {required && <span style={{ color: 'var(--primary)' }}>*</span>}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-dim)]" />
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] py-3 pl-10 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none" />
      </div>
    </div>
  );
}

/* ================================================================== */
/*  RELIABILITY & SERVICE ASSURANCE                                     */
/* ================================================================== */

function Reliability() {
  const points = [
    { icon: CheckCircle2, useAccent: false, title: 'Payroll validation before finalization', desc: 'Every pay run goes through structured review and data checks before it is finalized and submitted.' },
    { icon: Repeat,       useAccent: true,  title: 'Backup and recovery process',             desc: 'We maintain backup files and recovery procedures so payroll continues even if a system issue occurs.' },
    { icon: Shield,       useAccent: false, title: 'Support for system or data issues',        desc: 'Our team coordinates directly with you to resolve data discrepancies, system errors, or processing gaps.' },
    { icon: Link2,        useAccent: true,  title: 'Integration review for third-party tools', desc: 'We assess your existing timekeeping, HRIS, and accounting tools to recommend the best integration approach.' },
    { icon: FileText,     useAccent: false, title: 'Compliance-oriented payroll processing',   desc: 'SSS, PhilHealth, Pag-IBIG, withholding tax, annualization, and statutory reports are handled as part of the service.' },
    { icon: Lock,         useAccent: true,  title: 'Access level depends on subscription',     desc: 'System access — dashboards, reports, approvals, employee records — is provided based on your selected plan.' },
  ];
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 depth-bg">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full blur-[140px]" style={{ background: 'radial-gradient(circle, var(--glow-primary) 0%, transparent 70%)' }} />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="reveal mx-auto max-w-3xl text-center">
          <SectionLabel>Reliability & Service Assurance</SectionLabel>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-[var(--text)] sm:text-5xl">
            Reliable Payroll Service Built for{' '}
            <span className="text-brand-gradient">Accuracy and Continuity</span>
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            Payroll must be accurate, compliant, and delivered on time. Our service includes structured
            validation, payroll review, backup procedures, and support coordination to help protect your
            business from payroll delays, system issues, and manual processing errors.
          </p>
        </div>
        <div className="reveal reveal-stagger mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((p) => {
            const color = p.useAccent ? 'var(--accent)' : 'var(--primary)';
            const glow  = p.useAccent ? 'var(--glow-accent)' : 'var(--glow-primary)';
            const soft  = p.useAccent ? 'var(--accent-soft)' : 'var(--primary-light)';
            return (
              <Card3D key={p.title} className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 hover:bg-[var(--bg-elevated)]">
                <div className="tilt-layer-sm mb-4 flex h-10 w-10 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110" style={{ borderColor: glow, background: soft }}>
                  <p.icon className="h-5 w-5" style={{ color }} />
                </div>
                <h3 className="text-sm font-semibold text-[var(--text)]">{p.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">{p.desc}</p>
              </Card3D>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  FAQ — categorized, searchable, progressive reveal                   */
/* ================================================================== */

type FaqItem = { q: string; a: string };
type FaqCategory = { id: string; label: string; items: FaqItem[] };

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'general', label: 'General',
    items: [
      { q: 'Do I have to replace my current CRM or HR system?', a: 'No. CornerstoneOS connects to your existing tools and unifies the data. You can run everything from our layer or keep using familiar UIs — the value is in the connected core, not ripping out what works.' },
      { q: 'How long does implementation take?', a: 'Most mid-market teams are live in 2–4 weeks. We map your existing data, configure workflows and approvals, and run a parallel cycle before you cut over.' },
      { q: 'Is my data secure?', a: 'Yes. We are SOC 2 Type II and ISO 27001 certified, with role-based access control, full audit logging, and encryption in transit and at rest. You own your data — we never share it.' },
      { q: 'What does the AI actually do?', a: 'It runs continuously across your connected data: detecting anomalies, suggesting next actions, generating natural-language reports, and automating multi-step approvals — all with full audit trails.' },
    ],
  },
  {
    id: 'crm', label: 'CRM',
    items: [
      { q: 'Can the CRM help us track leads from inquiry to closed deal?', a: 'Yes. The CRM should help track the full sales pipeline, from initial inquiry, follow-up, quotation, negotiation, closing, and customer history.' },
      { q: 'Can we customize the sales pipeline based on our process?', a: 'Yes. The pipeline should be customizable so each business can define its own stages, statuses, follow-up rules, and sales workflow.' },
      { q: 'Can the CRM reduce missed follow-ups?', a: 'Yes. The system should support reminders, task assignments, lead status updates, and activity tracking so sales teams do not lose important opportunities.' },
      { q: 'Can managers monitor sales team performance?', a: 'Yes. Managers should be able to view lead progress, sales activities, conversion rates, pending follow-ups, and team performance reports.' },
      { q: 'Can the CRM integrate with our existing tools?', a: 'Yes, where technically possible. The CRM should be designed to connect with commonly used tools such as email, forms, websites, accounting systems, messaging platforms, or other business applications.' },
      { q: 'What if our sales team is not used to CRM software?', a: 'The system should be designed with a simple and user-friendly interface. Proper onboarding and training should also be provided to help the team adopt the CRM faster.' },
      { q: 'Can we control who can access customer data?', a: 'Yes. Role-based access should be available so only authorized users can view, edit, or manage sensitive customer and sales information.' },
      { q: 'Can the CRM help improve customer service?', a: 'Yes. By keeping customer details, transaction history, notes, and communication records in one place, the team can respond faster and provide better service.' },
    ],
  },
  {
    id: 'hris', label: 'HRIS',
    items: [
      { q: 'Can the HRIS manage the full employee lifecycle?', a: 'Yes. The HRIS should support employee records from recruitment, onboarding, employment, movement, performance, offboarding, final pay, clearance, and retirement.' },
      { q: 'Can employees access their own records?', a: 'Yes. Employee self-service should allow employees to view or update selected information, check leave balances, submit requests, and access important HR-related records depending on their permissions.' },
      { q: 'Can the HRIS help reduce manual HR work?', a: 'Yes. The system should help reduce repetitive tasks such as employee record updates, leave filing, approvals, timekeeping review, document tracking, and report generation.' },
      { q: 'Can the HRIS integrate with existing timekeeping or biometric devices?', a: 'Yes, if the device or third-party provider allows integration. The system should be prepared to connect with biometrics, attendance systems, or other timekeeping applications when technically supported.' },
      { q: 'Can the HRIS support approvals for leave, overtime, and schedule changes?', a: 'Yes. The HRIS should support approval workflows so requests can be reviewed by managers or HR based on company policy.' },
      { q: 'Can we control access for HR, managers, and employees?', a: 'Yes. Role-based access should be available so each user only sees the information and actions relevant to their role.' },
      { q: 'Can the HRIS generate HR reports?', a: 'Yes. The HRIS should provide useful reports such as employee masterlist, attendance, leave usage, overtime, manpower movement, onboarding status, and other HR operational reports.' },
      { q: 'What happens if our HR process is different from the default setup?', a: 'The system should be configurable to match company policies, workflows, approval levels, and employee data requirements where possible.' },
      { q: 'Is employee data secure?', a: 'Yes. The system should follow secure access controls, proper data handling, and permission-based visibility to protect employee information.' },
      { q: 'How difficult is the transition from manual HR records to HRIS?', a: 'The transition depends on the quality and readiness of the company\u2019s existing data. The system should support proper onboarding, data preparation, migration assistance, and user training.' },
    ],
  },
  {
    id: 'payroll', label: 'Payroll',
    items: [
      { q: 'Can you integrate with our existing timekeeping system?', a: 'Yes. We can integrate with your existing timekeeping setup, whether it is biometrics, manual attendance files, HRIS attendance records, or supported third-party timekeeping applications. We will review your current process and recommend the best integration approach.' },
      { q: 'Can you integrate with third-party applications?', a: 'Yes. We can support integrations with third-party applications depending on the available API, data export format, or technical compatibility. This may include attendance systems, HRIS platforms, accounting tools, and other business software.' },
      { q: 'Can payroll data be integrated with our accounting software?', a: 'Yes. We can help integrate or prepare payroll data for accounting systems. This may include payroll journal entries, government contribution reports, tax-related summaries, and other accounting-ready payroll outputs.' },
      { q: 'Are you offering a payroll system?', a: 'Our main offer is Payroll Services, not a standalone payroll system. Depending on the subscription plan, system access may be provided to support payroll processing, reports, approvals, and employee-related payroll data.' },
      { q: 'Will clients have access to the payroll platform?', a: 'Access may be provided depending on the selected subscription. Some plans may include limited or full access to payroll-related dashboards, reports, employee records, and approval workflows.' },
      { q: 'What happens if there is a system failure?', a: 'We follow reliability and backup processes to reduce service disruption. If a system issue occurs, we will coordinate with the client, apply the necessary recovery steps, and ensure payroll continuity through backup files, manual validation, or alternative processing procedures when needed.' },
      { q: 'How reliable is your payroll service?', a: 'Our payroll service is designed with accuracy, validation, and continuity in mind. We use structured payroll processing, review steps, data checks, and backup procedures to help ensure payroll is processed correctly and on time.' },
      { q: 'Can you handle government compliance?', a: 'Yes. We can support payroll-related compliance such as SSS, PhilHealth, Pag-IBIG, withholding tax, annualization, government reports, and other payroll-related statutory requirements.' },
      { q: 'Can you process payroll even if our company has different shifts, overtime, allowances, and deductions?', a: 'Yes. We can handle complex payroll scenarios including different work schedules, overtime, night differential, allowances, deductions, loans, absences, leaves, and other company-specific payroll rules.' },
      { q: 'Can you customize the payroll process based on our company policy?', a: 'Yes. We will review your existing payroll policies and configure or adjust the payroll process based on your approved rules, provided they are compliant with applicable labor and tax regulations.' },
    ],
  },
  {
    id: 'integrations', label: 'Integrations',
    items: [
      { q: 'Which tools can CornerstoneOS connect with?', a: 'We support integrations with commonly used business tools including Slack, Google Workspace, Microsoft 365, QuickBooks, Xero, Gusto, BambooHR, Rippling, DocuSign, Stripe, Zapier, Workday, SAP, Oracle HCM, and ADP — depending on available APIs and data formats.' },
      { q: 'How do integrations work technically?', a: 'Integrations use available APIs, data export/import formats, or webhooks depending on the third-party platform. We review each tool\u2019s technical compatibility and recommend the best approach.' },
      { q: 'Can you build a custom integration if our tool is not listed?', a: 'Yes, in many cases. If your tool provides an API or supports data export, we can assess feasibility and build a custom connector. We will let you know upfront if a tool is not technically compatible.' },
      { q: 'Do integrations require additional setup time?', a: 'Some integrations may add a few days to implementation depending on complexity. We include integration review as part of the onboarding process and set expectations before we begin.' },
    ],
  },
  {
    id: 'security', label: 'Security & Reliability',
    items: [
      { q: 'Is my data secure?', a: 'Yes. We follow SOC 2 Type II and ISO 27001 controls, with role-based access, full audit logging, and encryption in transit and at rest. You own your data — we never share it.' },
      { q: 'What happens if there is a system failure?', a: 'We follow reliability and backup processes to reduce service disruption. If a system issue occurs, we coordinate with the client, apply recovery steps, and ensure continuity through backup files, manual validation, or alternative processing procedures.' },
      { q: 'How reliable is your payroll service?', a: 'Our payroll service is designed with accuracy, validation, and continuity in mind. We use structured processing, review steps, data checks, and backup procedures to help ensure payroll is processed correctly and on time.' },
      { q: 'Do you have backup and recovery procedures?', a: 'Yes. We maintain backup files and recovery procedures so payroll and operations continue even if a system issue occurs. Our team coordinates directly with you to resolve any disruption quickly.' },
      { q: 'Who can access our company data?', a: 'Access is controlled through role-based permissions. Only authorized users within your organization can view or manage data, and our team accesses your data only with your consent for support and processing purposes.' },
    ],
  },
];

const INITIAL_VISIBLE = 4;

function Faq() {
  const [activeCat, setActiveCat] = useState<string>('general');
  const [search, setSearch] = useState('');
  const [openKey, setOpenKey] = useState<string | null>('general-0');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const activeItems = (() => {
    const cat = FAQ_CATEGORIES.find((c) => c.id === activeCat);
    if (!cat) return [];
    if (!search.trim()) return cat.items;
    const q = search.toLowerCase();
    return cat.items.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  })();

  const visibleItems = activeItems.slice(0, visibleCount);
  const hasMore = visibleCount < activeItems.length;

  const handleCatChange = (id: string) => {
    setActiveCat(id);
    setSearch('');
    setVisibleCount(INITIAL_VISIBLE);
    setOpenKey(`${id}-0`);
  };

  return (
    <section className="py-24 sm:py-32 depth-bg">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="reveal text-center">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">Questions, answered</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[var(--text-muted)]">
            Browse by category or search to find what you need.
          </p>
        </div>

        {/* Search */}
        <div className="reveal mx-auto mt-8 max-w-md">
          <div className="glass relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-dim)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(INITIAL_VISIBLE); setOpenKey(null); }}
              placeholder="Search FAQs…"
              className="w-full bg-transparent py-3 pl-10 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 rounded-full"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="reveal mt-6 flex flex-wrap justify-center gap-2">
          {FAQ_CATEGORIES.map((cat) => {
            const isActive = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCatChange(cat.id)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${isActive ? '' : 'glass'}`}
                style={isActive
                  ? { borderColor: 'var(--primary)', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary)' }
                  : {}}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQ items — two-column on desktop, stacked on mobile */}
        <div className="reveal mt-10 grid gap-3 lg:grid-cols-2">
          {visibleItems.length === 0 ? (
            <div className="glass col-span-full py-12 text-center">
              <p className="text-sm text-[var(--text-muted)]">No FAQs match your search. Try a different keyword or category.</p>
            </div>
          ) : (
            visibleItems.map((f, i) => {
              const key = `${activeCat}-${i}`;
              const isOpen = openKey === key;
              return (
                <div key={key} className="glass float-panel overflow-hidden transition-colors hover:bg-[var(--bg-elevated)]">
                  <button onClick={() => setOpenKey(isOpen ? null : key)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                    <span className="text-sm font-semibold text-[var(--text)]">{f.q}</span>
                    <ChevronDown className="h-4 w-4 flex-none transition-transform duration-300" style={{ color: 'var(--primary)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </button>
                  <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--text-muted)]">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View more */}
        {hasMore && visibleItems.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setVisibleCount((c) => c + INITIAL_VISIBLE)}
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--primary)]/40 hover:text-[var(--text)]"
            >
              View more FAQs
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ================================================================== */
/*  FOOTER                                                              */
/* ================================================================== */

function Footer() {
  const cols = [
    { title: 'Platform',  links: ['Overview','CRM','HRIS','Payroll','AI Layer','Integrations'] },
    { title: 'Company',   links: ['About','Careers','Partners','Contact'] },
    { title: 'Resources', links: ['Documentation','API reference','Security','Changelog','Status'] },
  ];
  return (
    <footer className="glass-strong border-t border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            {/* Footer logo — ~160px desktop, ~130px mobile */}
            <LogoImage className="w-[130px] sm:w-[160px]" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--text-muted)]">
              One connected core for CRM, HRIS, and Payroll — accurate, connected, and intelligent.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-[var(--text-dim)]">
              <Mail className="h-3.5 w-3.5" /> hello@cornerstoneos.com
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-xs text-[var(--text-dim)]">
              <Phone className="h-3.5 w-3.5" /> +1 (415) 555-0142
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)]">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-[var(--text-muted)] transition-all hover:translate-x-0.5 hover:text-[var(--text)]">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row">
          <p className="text-xs text-[var(--text-dim)]">© {new Date().getFullYear()} CornerstoneOS. All rights reserved.</p>
          <div className="flex items-center gap-5 text-xs text-[var(--text-dim)]">
            {['Privacy','Terms','Security'].map((l) => <a key={l} href="#" className="transition-colors hover:text-[var(--text-muted)]">{l}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================== */
/*  APP                                                                 */
/* ================================================================== */

export default function App() {
  useReveal();
  const { mode, accent, setMode, setAccent } = useTheme();

  return (
    <div className="relative min-h-screen bg-[var(--bg)]">
      <ScrollProgress />
      <Navbar mode={mode} accent={accent} setMode={setMode} setAccent={setAccent} />
      <main>
        <Hero />
        <StatsBar />
        <PlatformOverview />
        {MODULES.map((mod, i) => <ModuleSection key={mod.id} mod={mod} index={i} />)}
        <AiSection />
        <HowItWorks />
        <Integrations />
        <About />
        <Reliability />
        <Booking />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
