import { useState } from 'react';
import cornerstoneMark from './assets/cornerstone-mark.png';

const navItems = [
  { label: 'Platform', href: '#product' },
  { label: 'CRM', href: '#crm' },
  { label: 'HRIS', href: '#hris' },
  { label: 'Payroll', href: '#payroll' },
  { label: 'AI', href: '#ai' },
  { label: 'About Us', href: '#about' },
];

const coreProducts = [
  {
    id: 'crm',
    label: 'CRM',
    caption: 'Pipeline, customers, and follow-ups',
    icon: 'user-plus',
    className: 'node-crm',
    tone: 'green',
  },
  {
    id: 'hris',
    label: 'HRIS',
    caption: 'People records and employee workflows',
    icon: 'people',
    className: 'node-hris',
    tone: 'blue',
  },
  {
    id: 'payroll',
    label: 'Payroll',
    caption: 'Accurate pay from approved data',
    icon: 'wallet',
    className: 'node-payroll',
    tone: 'green',
  },
];

const orbitCapabilities = [
  ['AI Layer', 'spark', 'micro-ai'],
  ['Live Reports', 'chart', 'micro-analytics'],
  ['Attendance', 'clock', 'micro-timekeeping'],
  ['Recruitment', 'user-plus', 'micro-biometrics'],
  ['End-to-End Operations', 'window', 'micro-webbundy'],
  ['AI-Assisted Application', 'spark', 'micro-scheduling'],
];

const benefits = [
  ['One Source of Truth', 'Customer, employee, attendance, and payroll data stay connected.', 'spark'],
  ['Less Manual Work', 'Replace repetitive admin steps with guided workflows and approvals.', 'clock'],
  ['Payroll-Ready Data', 'Approved attendance and employee records flow into reliable payroll.', 'shield'],
  ['Focused Rollout', 'Start with the clearest business need, then expand when ready.', 'chart'],
];

const products = [
  {
    id: 'crm',
    title: 'CRM',
    lead: 'Give your team a simple way to manage leads, customers, follow-ups, and sales visibility without a heavy enterprise CRM rollout.',
    icon: 'user-plus',
    tone: 'green',
    items: ['Lead and pipeline management', 'Customer profiles and activity history', 'Follow-up reminders and task ownership', 'Sales reports without spreadsheet tracking'],
  },
  {
    id: 'hris',
    title: 'HRIS',
    lead: 'Centralize employee records, requests, documents, and HR workflows so HR can move faster with fewer manual approvals.',
    icon: 'people',
    tone: 'blue',
    items: ['Employee records and documents', 'Leave, overtime, and attendance workflows', 'Recruitment and onboarding visibility', 'Self-service requests and approval tracking'],
  },
  {
    id: 'payroll',
    title: 'Payroll',
    lead: 'Turn approved employee data, timekeeping, deductions, loans, and adjustments into payroll runs your team can trust.',
    icon: 'wallet',
    tone: 'green',
    items: ['Payroll computation and approvals', 'Tax, deductions, and compliance support', 'Loans, advances, and payroll adjustments', 'Timekeeping and end-to-end operations inputs'],
  },
];

const operatingOutcomes = [
  {
    title: 'Leadership visibility',
    copy: 'A clearer view of customers, people, attendance, and payroll without forcing teams to jump across disconnected tools.',
    solves: ['Connected dashboards', 'Phased implementation', 'Cleaner decision data'],
  },
  {
    title: 'HR efficiency',
    copy: 'Employee records, requests, recruitment, onboarding, and approvals organized into practical workflows your team can actually use.',
    solves: ['Self-service requests', 'Guided approvals', 'Central employee records'],
  },
  {
    title: 'Payroll confidence',
    copy: 'Payroll runs supported by approved employee data, attendance inputs, deductions, loans, and review-ready records.',
    solves: ['Payroll-ready inputs', 'Exception checks', 'Review trail'],
  },
  {
    title: 'Employee clarity',
    copy: 'A simpler way for employees to check requests, pay information, leave balances, and basic HR updates without waiting on manual follow-ups.',
    solves: ['Employee portal', 'Faster updates', 'Clear request status'],
  },
];

const aiActions = [
  ['“File my leave tomorrow”', 'AI prepares the request and routes it for approval.', 'chat'],
  ['“Compute my final pay”', 'AI checks pay, deductions, benefits, and adjustments.', 'calculator'],
  ['“Show payroll risks”', 'AI summarizes payroll exceptions before release.', 'report'],
  ['“Generate audit notes”', 'AI creates audit-ready findings from connected records.', 'shield'],
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
        {navItems.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}
      </nav>

      <div className="header-actions">
        <a className="btn btn-primary" href="#booking">Book Appointment</a>
        <button className="menu-toggle" type="button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          <span /><span /><span />
        </button>
      </div>

      <nav className={`mobile-panel ${menuOpen ? 'open' : ''}`} aria-label="Mobile navigation">
        {navItems.map((item) => <a key={item.label} href={item.href} onClick={closeMenu}>{item.label}</a>)}
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
          <circle className="orbit-dot dot-green" r="6"><animateMotion dur="14s" repeatCount="indefinite" path={orbitPathA} /></circle>
          <circle className="orbit-dot dot-blue" r="4.5"><animateMotion dur="14s" begin="-7s" repeatCount="indefinite" path={orbitPathA} /></circle>
        </g>
        <g className="orbit-group orbit-group-b" transform="rotate(60 360 320)">
          <path className="orbit-track blue-track" d={orbitPathB} />
          <circle className="orbit-dot dot-blue" r="6"><animateMotion dur="17s" repeatCount="indefinite" path={orbitPathB} /></circle>
          <circle className="orbit-dot dot-purple" r="4.5"><animateMotion dur="17s" begin="-8.5s" repeatCount="indefinite" path={orbitPathB} /></circle>
        </g>
        <g className="orbit-group orbit-group-c" transform="rotate(-58 360 320)">
          <path className="orbit-track purple-track" d={orbitPathC} />
          <circle className="orbit-dot dot-purple" r="6"><animateMotion dur="21s" repeatCount="indefinite" path={orbitPathC} /></circle>
          <circle className="orbit-dot dot-cyan" r="4.5"><animateMotion dur="21s" begin="-10.5s" repeatCount="indefinite" path={orbitPathC} /></circle>
        </g>
      </svg>

      <svg className="triangle-path" viewBox="0 0 720 640" aria-hidden="true">
        <path d="M360 106 L142 462 L578 462 Z" />
        <path d="M360 320 L360 106" />
        <path d="M360 320 L142 462" />
        <path d="M360 320 L578 462" />
      </svg>

      <div className="core-glow" />
      <div className="core-card">
        <img src={cornerstoneMark} alt="Cornerstone platform" />
        <strong>Cornerstone</strong>
        <span>Focused business operating layer</span>
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
        <p className="eyebrow">One core business platform</p>
        <h1>
          Run your business <span>from one connected core</span>
        </h1>
        <p className="hero-subtitle">
          Cornerstone connects the workflows companies feel every day: customers to manage, employees to support, attendance to verify, and payroll to release accurately.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary btn-large" href="#booking">Book an Appointment <span>→</span></a>
          <a className="video-link" href="#product">See the Focus</a>
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
        <p className="eyebrow mini-eyebrow">Focused platform</p>
        <h2>One operating core for customers, people, and payroll.</h2>
        <p>Start with the workflow that matters most, then connect CRM, HRIS, and Payroll as one clear operating layer when your team is ready.</p>
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
            <ul>{product.items.map((item) => <li key={item}>{item}</li>)}</ul>
            <a className="learn-more" href="#booking" aria-label={`Book an appointment about ${product.title}`}>Learn more <span>→</span></a>
          </article>
        ))}
      </div>
    </section>
  );
}

function OperatingOutcomes() {
  return (
    <section className="buyer-section" id="outcomes">
      <div className="section-heading">
        <p className="eyebrow mini-eyebrow">Why Cornerstone</p>
        <h2>Built to solve operational gaps without adding complexity.</h2>
        <p>Cornerstone keeps implementation practical: solve the highest-friction workflow first, connect the adjacent data, then expand only when the core process is working well.</p>
      </div>
      <div className="insight-grid">
        {operatingOutcomes.map((group) => (
          <article className="insight-card" key={group.title}>
            <h3>{group.title}</h3>
            <p>{group.copy}</p>
            <ul>{group.solves.map((item) => <li key={item}>{item}</li>)}</ul>
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
        <p className="eyebrow mini-eyebrow">AI at the core</p>
        <h2><span>AI</span> built into the workflow</h2>
        <p>AI supports the daily work teams already do—requests, reviews, payroll checks, and audit notes—without turning the product into another scattered tool.</p>
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

function AboutUs() {
  return (
    <section className="about-section" id="about">
      <div className="about-card">
        <p className="eyebrow mini-eyebrow">About us</p>
        <h2>We are building focused business software for teams that have outgrown spreadsheets.</h2>
        <p>
          Cornerstone is designed for growing companies that need practical automation, not software that tries to solve everything at once. We focus on CRM, HRIS, and Payroll first because these are the workflows that directly affect revenue, people, and trust.
        </p>
      </div>
      <div className="about-points">
        <article><strong>Start focused</strong><span>Choose the highest-friction workflow first.</span></article>
        <article><strong>Connect data</strong><span>Reduce re-entry between customer, HR, attendance, and payroll records.</span></article>
        <article><strong>Scale responsibly</strong><span>Add adjacent workflows only when the core is working well.</span></article>
      </div>
    </section>
  );
}

function ContactBooking() {
  const [form, setForm] = useState({ name: '', email: '', company: '', role: '', interest: 'Book an appointment', message: '' });

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Cornerstone ${form.interest} - ${form.company || form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nRole: ${form.role}\nInterest: ${form.interest}\n\nMessage:\n${form.message}`,
    );
    window.location.href = `mailto:codepinasph@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="contact-section dark-contact" id="booking">
      <div className="contact-copy">
        <p className="eyebrow mini-eyebrow">Book appointment</p>
        <h2>Start with the workflow that matters most.</h2>
        <p>Book one focused conversation. We will help you identify the best starting point across CRM, HRIS, Payroll, Attendance, Recruitment, or End-to-End HRIS and Payroll.</p>
        <div className="booking-highlights">
          <article><Icon name="calendar" /><strong>Focused demo</strong><span>See only the workflows relevant to your business.</span></article>
          <article><Icon name="shield" /><strong>Process review</strong><span>Map pain points, gaps, and quick wins before rollout.</span></article>
        </div>
      </div>

      <form className="contact-form" onSubmit={submit}>
        <h3>Book Appointment</h3>
        <label>
          Full name
          <input name="name" value={form.name} onChange={update} placeholder="Juan Dela Cruz" required />
        </label>
        <label>
          Company
          <input name="company" value={form.company} onChange={update} placeholder="Your company" />
        </label>
        <label className="full-field">
          Work email
          <input name="email" type="email" value={form.email} onChange={update} placeholder="you@company.com" required />
        </label>
        <label>
          Your role
          <select name="role" value={form.role} onChange={update} required>
            <option value="">Select your role</option>
            <option>Executive / Owner</option>
            <option>HR Manager</option>
            <option>Payroll Officer</option>
            <option>Sales / Operations</option>
            <option>IT / Admin</option>
          </select>
        </label>
        <label>
          Main interest
          <select name="interest" value={form.interest} onChange={update}>
            <option>Book an appointment</option>
            <option>CRM</option>
            <option>HRIS</option>
            <option>Payroll</option>
            <option>Attendance / Timekeeping</option>
            <option>Recruitment</option>
            <option>End-to-End HRIS and Payroll</option>
          </select>
        </label>
        <label className="full-field">
          Message
          <textarea name="message" value={form.message} onChange={update} rows="4" placeholder="Tell us what is slow, manual, or painful in your current process." />
        </label>
        <button className="btn btn-primary btn-large full-field" type="submit"><Icon name="mail" /> Submit Request</button>
      </form>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <a className="brand footer-logo" href="#top" aria-label="Cornerstone home">
            <img src={cornerstoneMark} alt="Cornerstone logo mark" />
            <div><span>Corner<span>stone</span></span><small>BUSINESS SOLUTIONS</small></div>
          </a>
          <p>Focused software for growing teams that need CRM, HRIS, Payroll, Attendance, Recruitment, and AI-assisted operations without unnecessary complexity.</p>
          <div className="social-row"><a href="#top">in</a><a href="#top">x</a><a href="#top">f</a></div>
        </div>
        <div>
          <h3>Platform</h3>
          <a href="#crm">CRM</a><a href="#hris">HRIS</a><a href="#payroll">Payroll</a><a href="#ai">AI Layer</a><a href="#outcomes">Outcomes</a>
        </div>
        <div>
          <h3>Company</h3>
          <a href="#about">About Us</a><a href="#booking">Book Appointment</a><a href="#booking">Contact Sales</a><a href="#product">Product Focus</a>
        </div>
        <div>
          <h3>Resources</h3>
          <a href="#outcomes">Operating Outcomes</a><a href="#hris">Recruitment</a><a href="#payroll">Attendance</a><a href="#booking">Implementation Review</a>
        </div>
        <div>
          <h3>Legal</h3>
          <a href="#about">Privacy Policy</a><a href="#about">Terms of Service</a><a href="#about">Security</a><a href="#outcomes">Compliance</a>
        </div>
      </div>
      <div className="footer-contact"><span>✉ codepinasph@gmail.com</span><span>⌖ Philippines • Global-ready operations</span><span>Book a focused product walkthrough</span></div>
      <div className="footer-meta"><span>• Cloud-Based</span><span>• Focused Rollout</span><span>• AI-Assisted Workflows</span><span>• Payroll-Ready Data</span><span>• End-to-End Operations</span></div>
      <div className="footer-bottom"><span>© {year} Cornerstone Business Solutions. All rights reserved.</span><span>Powered by <strong>Artificial Intelligence</strong></span></div>
    </footer>
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
        <OperatingOutcomes />
        <AiActions />
        <AboutUs />
        <ContactBooking />
        <Footer />
      </main>
    </div>
  );
}
