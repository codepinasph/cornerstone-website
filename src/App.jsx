import { useState } from 'react';
import cornerstoneMark from './assets/cornerstone-mark.png';

const navItems = [
  { label: 'Platform', href: '#product' },
  { label: 'CRM', href: '#crm' },
  { label: 'HRIS', href: '#hris' },
  { label: 'Payroll', href: '#payroll' },
  { label: 'Timekeeping', href: '#timekeeping' },
  { label: 'AI', href: '#ai' },
  { label: 'Contact', href: '#contact' },
];

const coreProducts = [
  {
    id: 'crm',
    label: 'CRM',
    caption: 'Customers, pipeline, sales activity',
    icon: 'user-plus',
    className: 'node-crm',
    tone: 'green',
  },
  {
    id: 'hris',
    label: 'HRIS',
    caption: 'People, leave, documents, performance',
    icon: 'people',
    className: 'node-hris',
    tone: 'blue',
  },
  {
    id: 'payroll',
    label: 'Payroll',
    caption: 'Salary, compliance, deductions',
    icon: 'wallet',
    className: 'node-payroll',
    tone: 'green',
  },
];

const orbitCapabilities = [
  ['AI Intelligence', 'spark', 'micro-ai'],
  ['Analytics', 'chart', 'micro-analytics'],
  ['Timekeeping', 'clock', 'micro-timekeeping'],
  ['Biometrics', 'fingerprint', 'micro-biometrics'],
  ['Web Bundy', 'window', 'micro-webbundy'],
  ['Scheduling', 'calendar', 'micro-scheduling'],
];

const benefits = [
  ['Save Time', 'Automate repetitive work across sales, HR, and payroll.', 'clock'],
  ['Stay Compliant', 'Keep payroll, attendance, and workforce data organized.', 'shield'],
  ['Move Faster', 'Give teams one system instead of scattered spreadsheets.', 'spark'],
  ['Decide Smarter', 'Use dashboards and AI insights to see what needs action.', 'chart'],
];

const products = [
  {
    id: 'crm',
    title: 'CRM',
    lead: 'Manage leads, customers, sales activity, and business relationships.',
    icon: 'user-plus',
    tone: 'green',
    items: ['Lead & pipeline management', 'Customer profiles', 'Activity tracking', 'Sales forecasting'],
  },
  {
    id: 'hris',
    title: 'HRIS',
    lead: 'Build one reliable source of truth for employee operations.',
    icon: 'people',
    tone: 'blue',
    items: ['Employee records', 'Leave & attendance', 'Performance & goals', 'Documents & assets'],
  },
  {
    id: 'payroll',
    title: 'Payroll',
    lead: 'Run accurate payroll with timekeeping, compliance, and audit readiness.',
    icon: 'wallet',
    tone: 'green',
    items: ['Payroll automation', 'Government compliance', 'Tax & deductions', 'Loans & advances', 'Timekeeping & Web Bundy'],
  },
];

const workforce = [
  ['Timekeeping', 'Track time accurately with rules and schedules.', 'clock'],
  ['Biometrics', 'Connect biometric data for accurate attendance.', 'fingerprint'],
  ['Web Bundy', 'Let employees clock in through your own web bundy.', 'window'],
  ['Scheduling', 'Create shifts and manage team coverage.', 'calendar'],
  ['Overtime', 'Automate overtime requests, rules, and approvals.', 'timer'],
  ['Attendance Rules', 'Set custom attendance policies that fit your company.', 'checklist'],
];

const aiActions = [
  ['“File my leave tomorrow”', 'AI prepares the request and routes it for approval.', 'chat'],
  ['“Compute my final pay”', 'AI checks pay, deductions, benefits, and adjustments.', 'calculator'],
  ['“Show tax exposure”', 'AI summarizes payroll risk and tax data.', 'report'],
  ['“Generate payroll audit”', 'AI creates audit-ready findings and flags anomalies.', 'shield'],
];

function Icon({ name, className = '' }) {
  const common = {
    className: `icon ${className}`,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': 'true',
  };

  switch (name) {
    case 'user-plus':
      return (
        <svg {...common}>
          <path d="M15 20a6 6 0 0 0-12 0" />
          <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M19 8v6" />
          <path d="M22 11h-6" />
        </svg>
      );
    case 'people':
      return (
        <svg {...common}>
          <path d="M16 19a5 5 0 0 0-10 0" />
          <path d="M11 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M22 19a4 4 0 0 0-4-4" />
          <path d="M17 4a3 3 0 0 1 0 6" />
        </svg>
      );
    case 'wallet':
      return (
        <svg {...common}>
          <path d="M4 7h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h13" />
          <path d="M17 13h4" />
          <path d="M17 13a2 2 0 1 0 0 .01" />
        </svg>
      );
    case 'spark':
      return (
        <svg {...common}>
          <path d="M13 2 9.8 8.8 3 12l6.8 3.2L13 22l3.2-6.8L23 12l-6.8-3.2L13 2Z" />
          <path d="m5 3 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h17" />
          <path d="M8 16v-5" />
          <path d="M13 16V8" />
          <path d="M18 16v-9" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-5" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...common}>
          <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    case 'fingerprint':
      return (
        <svg {...common}>
          <path d="M7 12a5 5 0 0 1 10 0" />
          <path d="M12 12c0 4-1.5 7-3 9" />
          <path d="M12 12c0 4 1.5 7 3 9" />
          <path d="M6 18c-1-2-2-4-2-6a8 8 0 0 1 16 0c0 2-.6 4-1.4 6" />
          <path d="M9 4.6A9 9 0 0 1 21 13" />
        </svg>
      );
    case 'window':
      return (
        <svg {...common}>
          <path d="M4 5h16v14H4z" />
          <path d="M4 9h16" />
          <path d="M8 5v4" />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...common}>
          <path d="M7 3v4" />
          <path d="M17 3v4" />
          <path d="M4 7h16" />
          <path d="M5 5h14a1 1 0 0 1 1 1v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1Z" />
          <path d="m8 14 2 2 5-5" />
        </svg>
      );
    case 'timer':
      return (
        <svg {...common}>
          <path d="M10 2h4" />
          <path d="M12 14v-4" />
          <path d="M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
          <path d="m18 7 2-2" />
        </svg>
      );
    case 'checklist':
      return (
        <svg {...common}>
          <path d="m4 7 1.5 1.5L8 6" />
          <path d="M11 7h9" />
          <path d="m4 12 1.5 1.5L8 11" />
          <path d="M11 12h9" />
          <path d="m4 17 1.5 1.5L8 16" />
          <path d="M11 17h9" />
        </svg>
      );
    case 'chat':
      return (
        <svg {...common}>
          <path d="M21 12a8 8 0 0 1-8 8H7l-4 2 1.5-4A8 8 0 1 1 21 12Z" />
          <path d="M8 12h.01" />
          <path d="M12 12h.01" />
          <path d="M16 12h.01" />
        </svg>
      );
    case 'calculator':
      return (
        <svg {...common}>
          <path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          <path d="M8 7h8" />
          <path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" />
        </svg>
      );
    case 'report':
      return (
        <svg {...common}>
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v5h5" />
          <path d="M9 17v-4" />
          <path d="M13 17v-7" />
          <path d="M17 17v-3" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...common}>
          <path d="M4 6h16v12H4z" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    default:
      return null;
  }
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Cornerstone home" onClick={closeMenu}>
        <img src={cornerstoneMark} alt="Cornerstone logo mark" />
        <div>
          <span>Corner<span>stone</span></span>
          <small>CRM | HRIS | PAYROLL</small>
        </div>
      </a>

      <nav className="desktop-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <a key={item.label} href={item.href}>{item.label}</a>
        ))}
      </nav>

      <div className="header-actions">
        <a className="btn btn-ghost" href="#contact">Send Message</a>
        <a className="btn btn-primary" href="#booking">Book Appointment</a>
        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav className={`mobile-panel ${menuOpen ? 'open' : ''}`} aria-label="Mobile navigation">
        {navItems.map((item) => (
          <a key={item.label} href={item.href} onClick={closeMenu}>{item.label}</a>
        ))}
      </nav>
    </header>
  );
}

function OrbitDiagram() {
  const orbitPathA = 'M90 320a270 145 0 1 0 540 0a270 145 0 1 0 -540 0';
  const orbitPathB = 'M88 320a272 150 0 1 0 544 0a272 150 0 1 0 -544 0';
  const orbitPathC = 'M72 320a288 172 0 1 0 576 0a288 172 0 1 0 -576 0';

  return (
    <div className="atom-stage" aria-label="Cornerstone CRM, HRIS and Payroll atom diagram">
      <div className="atom-bg" />

      <svg className="atom-orbits" viewBox="0 0 720 640" aria-hidden="true">
        <g className="orbit-group orbit-group-a">
          <path className="orbit-track green-track" d={orbitPathA} />
          <circle className="orbit-dot dot-green" r="6">
            <animateMotion dur="14s" repeatCount="indefinite" path={orbitPathA} />
          </circle>
          <circle className="orbit-dot dot-blue" r="4.5">
            <animateMotion dur="14s" begin="-7s" repeatCount="indefinite" path={orbitPathA} />
          </circle>
        </g>
        <g className="orbit-group orbit-group-b" transform="rotate(60 360 320)">
          <path className="orbit-track blue-track" d={orbitPathB} />
          <circle className="orbit-dot dot-blue" r="6">
            <animateMotion dur="17s" repeatCount="indefinite" path={orbitPathB} />
          </circle>
          <circle className="orbit-dot dot-purple" r="4.5">
            <animateMotion dur="17s" begin="-8.5s" repeatCount="indefinite" path={orbitPathB} />
          </circle>
        </g>
        <g className="orbit-group orbit-group-c" transform="rotate(-58 360 320)">
          <path className="orbit-track purple-track" d={orbitPathC} />
          <circle className="orbit-dot dot-purple" r="6">
            <animateMotion dur="21s" repeatCount="indefinite" path={orbitPathC} />
          </circle>
          <circle className="orbit-dot dot-cyan" r="4.5">
            <animateMotion dur="21s" begin="-10.5s" repeatCount="indefinite" path={orbitPathC} />
          </circle>
        </g>
      </svg>

      <svg className="triangle-path" viewBox="0 0 720 640" aria-hidden="true">
        <path d="M360 102 L152 454 L568 454 Z" />
        <path d="M360 320 L360 102" />
        <path d="M360 320 L152 454" />
        <path d="M360 320 L568 454" />
      </svg>

      <div className="core-glow" />
      <div className="core-card">
        <img src={cornerstoneMark} alt="Cornerstone platform" />
        <strong>Cornerstone</strong>
        <span>CRM • HRIS • Payroll</span>
      </div>

      {coreProducts.map((node) => (
        <a key={node.id} href={`#${node.id}`} className={`main-node ${node.className} ${node.tone}`}>
          <Icon name={node.icon} />
          <strong>{node.label}</strong>
          <span>{node.caption}</span>
        </a>
      ))}

      {orbitCapabilities.map(([label, icon, className]) => (
        <div key={label} className={`micro-node ${className}`}>
          <Icon name={icon} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">AI-powered CRM, HRIS & Payroll platform</p>
        <h1>
          CRM, HRIS & Payroll <span>in One Connected System</span>
        </h1>
        <p className="hero-subtitle">
          Connect your customers, employees, attendance, and payroll in a simple, futuristic platform built for growing teams.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary btn-large" href="#booking">Book an Appointment <span>→</span></a>
          <a className="video-link" href="#product">Explore the Platform</a>
        </div>
      </div>
      <OrbitDiagram />
    </section>
  );
}

function BenefitStrip() {
  return (
    <section className="benefit-strip" aria-label="Cornerstone benefits">
      {benefits.map(([title, copy, icon]) => (
        <article key={title} className="benefit-card">
          <div className="soft-icon"><Icon name={icon} /></div>
          <div>
            <h3>{title}</h3>
            <p>{copy}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

function ProductCards() {
  return (
    <section className="section product-section" id="product">
      <div className="section-heading">
        <p className="eyebrow mini-eyebrow">Core product</p>
        <h2>Three highlights. <span>One connected platform.</span></h2>
        <p>Keep the message simple: CRM for customers, HRIS for people, Payroll for accurate pay.</p>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <article key={product.id} id={product.id} className={`product-card ${product.tone}`}>
            <div className="product-top">
              <div className="soft-icon"><Icon name={product.icon} /></div>
              <div>
                <h3>{product.title}</h3>
                <p>{product.lead}</p>
              </div>
            </div>
            <ul>
              {product.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function WorkforceCapabilities() {
  return (
    <section className="compact-section" id="timekeeping" aria-label="Payroll and workforce capabilities">
      <div className="section-heading compact-heading">
        <p className="eyebrow mini-eyebrow">Payroll support layer</p>
        <h2>Timekeeping is included, not another product.</h2>
        <p>Biometrics and Web Bundy feed attendance data into HRIS and Payroll.</p>
      </div>
      <div className="mini-grid">
        {workforce.map(([title, copy, icon]) => (
          <article key={title} className="mini-card">
            <div className="mini-icon"><Icon name={icon} /></div>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AiActions() {
  return (
    <section className="ai-section" id="ai" aria-label="AI that works for you">
      <div className="section-heading compact-heading">
        <p className="eyebrow mini-eyebrow">AI layer</p>
        <h2><span>AI</span> that helps teams move faster</h2>
      </div>
      <div className="ai-grid">
        {aiActions.map(([title, copy, icon]) => (
          <article key={title} className="ai-card">
            <div className="ai-icon"><Icon name={icon} /></div>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactBooking() {
  const [form, setForm] = useState({ name: '', email: '', company: '', interest: 'Book a demo', message: '' });

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Cornerstone ${form.interest} - ${form.company || form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nInterest: ${form.interest}\n\nMessage:\n${form.message}`,
    );
    window.location.href = `mailto:codepinasph@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-copy">
        <p className="eyebrow mini-eyebrow">Send a message or book an appointment</p>
        <h2>Ready to see how Cornerstone fits your business?</h2>
        <p>
          Tell us what you want to improve first: customer management, HR operations, payroll, or timekeeping.
        </p>
        <div className="contact-pills">
          <span>CRM</span><span>HRIS</span><span>Payroll</span><span>Timekeeping</span><span>AI</span>
        </div>
      </div>

      <form className="contact-form" id="booking" onSubmit={submit}>
        <label>
          Full name
          <input name="name" value={form.name} onChange={update} placeholder="Juan Dela Cruz" required />
        </label>
        <label>
          Work email
          <input name="email" type="email" value={form.email} onChange={update} placeholder="you@company.com" required />
        </label>
        <label>
          Company
          <input name="company" value={form.company} onChange={update} placeholder="Company name" />
        </label>
        <label>
          I want to
          <select name="interest" value={form.interest} onChange={update}>
            <option>Book a demo</option>
            <option>Ask a question</option>
            <option>Discuss CRM</option>
            <option>Discuss HRIS</option>
            <option>Discuss Payroll</option>
            <option>Discuss Timekeeping / Biometrics</option>
          </select>
        </label>
        <label className="full-field">
          Message
          <textarea name="message" value={form.message} onChange={update} rows="4" placeholder="Tell us about your current process or requirements." />
        </label>
        <button className="btn btn-primary btn-large full-field" type="submit">
          <Icon name="mail" /> Send Message
        </button>
      </form>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta">
      <div className="cube-stack left" aria-hidden="true"><span /><span /><span /><span /></div>
      <div>
        <h2>Simple enough to understand. Powerful enough to scale.</h2>
        <p>Start with CRM, HRIS, and Payroll. Extend with timekeeping, biometrics, Web Bundy, and AI when your team is ready.</p>
      </div>
      <div className="cta-actions">
        <a className="btn btn-light" href="#booking">Book a Demo <span>→</span></a>
        <a className="btn btn-outline-light" href="#contact">Send Message</a>
      </div>
      <div className="cube-stack right" aria-hidden="true"><span /><span /><span /><span /></div>
    </section>
  );
}

export default function App() {
  return (
    <div className="page-shell">
      <Header />
      <main>
        <Hero />
        <BenefitStrip />
        <ProductCards />
        <WorkforceCapabilities />
        <AiActions />
        <ContactBooking />
        <FinalCta />
      </main>
    </div>
  );
}
