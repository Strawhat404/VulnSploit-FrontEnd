import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Shield, Zap, Terminal, Globe, Search, Lock,
  ChevronRight, ArrowRight, Cpu, Network, Bug,
  Activity, Database, Code2
} from 'lucide-react';

// Animated typing terminal demo
const terminalLines = [
  { text: '$ vulnsploit recon --target acme-corp.com --mode full', delay: 0, color: 'text-blue-400' },
  { text: '[*] Initializing reconnaissance engine...', delay: 800, color: 'text-gray-400' },
  { text: '[*] Target: acme-corp.com | Mode: Full Assessment', delay: 1400, color: 'text-gray-400' },
  { text: '[+] Session created → ID: 0x4F2A', delay: 2000, color: 'text-cyan-400' },
  { text: '[*] Running passive reconnaissance...', delay: 2800, color: 'text-gray-400' },
  { text: '[+] Discovered 14 subdomains across attack surface', delay: 3600, color: 'text-blue-300' },
  { text: '[*] Scanning ports and enumerating services...', delay: 4200, color: 'text-gray-400' },
  { text: 'FINDING  SEVERITY  DESCRIPTION', delay: 4800, color: 'text-amber-400' },
  { text: '[!] Port 3306 exposed to internet — CRITICAL', delay: 5200, color: 'text-red-400' },
  { text: '[!] Missing HSTS header — HIGH', delay: 5600, color: 'text-orange-400' },
  { text: '[!] SSL/TLS: TLS 1.0 enabled — MEDIUM', delay: 6000, color: 'text-blue-300' },
  { text: '[✓] Assessment complete. PDF report generated.', delay: 6600, color: 'text-cyan-400' },
];

function TerminalDemo() {
  const [visibleLines, setVisibleLines] = useState([]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    terminalLines.forEach((line) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
      }, line.delay);
    });
  }, [inView]);

  return (
    <div ref={ref} className="rounded-lg overflow-hidden border border-blue-500/20">
      {/* Terminal header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#252830] border-b border-[#1a1d26]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-blue-500/70" />
        </div>
        <span className="text-xs text-gray-500 font-mono tracking-widest">vulnsploit — bash</span>
      </div>
      {/* Terminal body */}
      <div className="bg-[#050507] p-5 min-h-[280px] font-mono text-sm">
        {visibleLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={`leading-7 ${line.color}`}
          >
            {line.text}
          </motion.div>
        ))}
        {visibleLines.length < terminalLines.length && (
          <span className="inline-block w-2 h-4 bg-blue-400 animate-blink ml-0.5" />
        )}
      </div>
    </div>
  );
}

// Feature cards
const features = [
  {
    icon: Network,
    title: 'Port & Service Discovery',
    desc: 'Comprehensive TCP/UDP port scanning with service identification, version detection, and OS fingerprinting across your entire attack surface.',
    color: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  {
    icon: Bug,
    title: 'Injection & Exploitation Testing',
    desc: 'Automated detection of injection vulnerabilities including SQL, command, and parameter tampering across web application entry points.',
    color: 'text-cyan-400',
    border: 'border-cyan-500/20',
  },
  {
    icon: Globe,
    title: 'Attack Surface Mapping',
    desc: 'Passive and active reconnaissance to enumerate subdomains, exposed assets, and external-facing infrastructure at scale.',
    color: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  {
    icon: Search,
    title: 'Hidden Endpoint Discovery',
    desc: 'Intelligent directory and file enumeration to uncover exposed admin panels, sensitive endpoints, and misconfigured resources.',
    color: 'text-cyan-400',
    border: 'border-cyan-500/20',
  },
  {
    icon: Activity,
    title: 'CVE & Vulnerability Detection',
    desc: 'Template-based scanning against thousands of known CVEs, combined with real-time enrichment from the National Vulnerability Database.',
    color: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  {
    icon: Code2,
    title: 'SSL/TLS & Headers Analysis',
    desc: 'Deep inspection of SSL/TLS configuration, certificate validity, cipher suites, and HTTP security header misconfigurations.',
    color: 'text-cyan-400',
    border: 'border-cyan-500/20',
  },
];

// Stats
const stats = [
  { value: '10+', label: 'Attack Vectors' },
  { value: 'AI', label: 'Powered Reports' },
  { value: 'Real-time', label: 'Scan Monitoring' },
  { value: '100%', label: 'Automated' },
];

function StatCard({ value, label, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="text-center"
    >
      <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-1">{value}</div>
      <div className="text-xs text-gray-500 tracking-widest uppercase">{label}</div>
    </motion.div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Scanline overlay */}
      <div className="scanline-overlay" />

      {/* Grid background */}
      <div className="fixed inset-0 grid-bg opacity-50 pointer-events-none" />

      {/* ─── PUBLIC NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1d26] bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <Shield className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <div className="absolute inset-0 blur-sm bg-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-black text-base tracking-widest">
                <span className="text-white">VULN</span>
                <span className="text-blue-400">SPLOIT</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm font-mono text-gray-500">
              <a href="#features"      className="hover:text-blue-400 transition-colors">Capabilities</a>
              <a href="#architecture"  className="hover:text-blue-400 transition-colors">How It Works</a>
              <a href="#cta"           className="hover:text-blue-400 transition-colors">Get Started</a>
            </div>

            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold tracking-widest rounded hover:bg-blue-500 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>LOGIN</span>
            </Link>
            <Link
              to="/register"
              className="hidden sm:flex items-center gap-2 px-4 py-2 border border-blue-500/30 text-blue-400 text-sm font-bold tracking-widest rounded hover:bg-blue-500/10 transition-all"
            >
              REGISTER
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        {/* Radial glow behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-blue-500/30 bg-blue-500/5 text-blue-400 text-xs font-mono tracking-widest mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              ADVANCED VULNERABILITY SCANNER
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight mb-6"
            >
              <span className="text-white">VULN</span>
              <span className="text-blue-400">SPLOIT</span>
              <br />
              <span className="text-2xl md:text-3xl font-light text-gray-400 tracking-widest">
                PENETRATION TESTING ENGINE
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-base leading-relaxed mb-8 max-w-lg"
            >
              A professional-grade penetration testing platform for automated
              reconnaissance, vulnerability assessment, and security reporting.
              Identify exposed ports, misconfigurations, CVEs, and SSL weaknesses —
              then generate{' '}
              <span className="text-cyan-400">AI-powered PDF reports</span> with
              remediation guidance in minutes.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/login"
                className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold text-sm tracking-widest rounded hover:bg-blue-500 transition-all duration-200"
              >
                LAUNCH CONSOLE
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 px-6 py-3 border border-blue-500/30 text-blue-400 text-sm font-semibold tracking-widest rounded hover:bg-blue-500/10 transition-all duration-200"
              >
                EXPLORE TOOLS
                <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Capability pills — no tech stack, just what it does */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-2 mt-8"
            >
              {['Automated Scanning', 'AI Reports', 'CVE Detection', 'SSL Analysis', 'Zero Config', 'Secure Access'].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-mono text-gray-500 border border-[#1a1d26] rounded bg-[#0d0d0f]"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — terminal demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <TerminalDemo />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
        >
          <span className="text-xs tracking-widest">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-blue-500/50 to-transparent"
          />
        </motion.div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-16 border-y border-[#1a1d26] bg-[#050507]/50">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} index={i} />
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-mono tracking-widest mb-4">
              <span className="w-8 h-px bg-blue-500/50" />
              CAPABILITIES
              <span className="w-8 h-px bg-blue-500/50" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Full Coverage. One Platform.
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Every phase of a professional security assessment — from reconnaissance to exploitation to reporting — automated and unified.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative p-6 rounded-lg bg-[#0d0d0f] border ${f.border} hover:bg-[#252830]/30 transition-all duration-300 group`}
              >
                <div className={`w-10 h-10 rounded-lg bg-[#050507] border ${f.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ARCHITECTURE ─── */}
      <section id="architecture" className="py-24 px-4 bg-[#050507]/30 border-y border-[#1a1d26]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest mb-4">
              <span className="w-8 h-px bg-cyan-500/50" />
              HOW IT WORKS
              <span className="w-8 h-px bg-cyan-500/50" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              From Target to Report in Minutes
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Cpu,
                title: 'Define Your Target',
                desc: 'Enter a domain, IP address, or URL. VulnSploit validates and scopes the assessment automatically — no complex configuration required.',
                color: 'text-blue-400',
                tag: '01',
              },
              {
                icon: Database,
                title: 'Automated Assessment',
                desc: 'A full suite of security checks runs in sequence — port scanning, web vulnerability testing, SSL analysis, CVE detection, and more.',
                color: 'text-cyan-400',
                tag: '02',
              },
              {
                icon: Zap,
                title: 'AI-Powered Report',
                desc: 'Every finding is analyzed, prioritized by severity, and compiled into a professional PDF report with actionable remediation steps.',
                color: 'text-amber-400',
                tag: '03',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative p-6 rounded-lg bg-[#0d0d0f] border border-[#1a1d26] text-center"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#050507] border border-[#1a1d26] rounded text-xs font-mono text-gray-500">
                  {item.tag}
                </div>
                <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-3 mt-2`} />
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Flow arrows */}
          <div className="flex items-center justify-center gap-4 mt-8 text-xs font-mono text-gray-600">
            <span className="text-blue-400">Define Target</span>
            <span>──→</span>
            <span className="text-cyan-400">Run Assessment</span>
            <span>──→</span>
            <span className="text-amber-400">Get Report</span>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section id="cta" className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-10 rounded-xl border border-blue-500/20 bg-[#0d0d0f] overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />

            <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">
              Start Your Assessment
            </h2>
            <p className="text-gray-400 mb-8">
              Identify vulnerabilities before attackers do. Run your first
              security assessment in minutes — no configuration required.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold tracking-widest rounded hover:bg-blue-500 transition-all"
            >
              <Lock className="w-4 h-4" />
              ACCESS CONSOLE
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[#1a1d26] py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400/50" />
              <span className="font-black text-sm tracking-widest">
                <span className="text-white">VULN</span>
                <span className="text-blue-400">SPLOIT</span>
              </span>
            </Link>
            <div className="flex items-center gap-6 text-xs font-mono text-gray-600">
              <a href="#features"     className="hover:text-blue-400 transition-colors">Capabilities</a>
              <a href="#architecture" className="hover:text-blue-400 transition-colors">How It Works</a>
              <a href="#cta"          className="hover:text-blue-400 transition-colors">Get Started</a>
              <Link to="/login"       className="hover:text-blue-400 transition-colors">Login</Link>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-700 font-mono border-t border-[#1a1d26] pt-6">
            <span>VULNSPLOIT v1.0.0 — ALL RIGHTS RESERVED</span>
            <span className="text-yellow-600/60">⚠ FOR AUTHORIZED PENETRATION TESTING ONLY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
