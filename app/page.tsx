"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useTransform, useMotionValue, animate } from "framer-motion";
import { useEffect } from "react";

// ─── Animation helpers ────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];


// ─── Nav ─────────────────────────────────────────────────────────────────────

const navItems = [
  ["#problem", "Miért Workzy?"],
  ["#system", "Rendszer"],
  ["#features", "Funkciók"],
  ["#pricing", "Árak"],
  ["#faq", "GYIK"],
];

function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="rounded-[28px] border border-white/80 bg-white/90 px-4 py-3.5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:px-5"
        >
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex shrink-0 items-center">
              <Image
                src="/logo.png"
                alt="Workzy"
                width={150}
                height={44}
                className="h-auto w-[110px] sm:w-[140px]"
                priority
              />
            </Link>

            <nav className="hidden items-center gap-7 lg:flex">
              {navItems.map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm font-bold text-slate-500 transition hover:text-slate-950"
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/admin/login"
                className="hidden rounded-2xl border border-slate-200/70 bg-white px-5 py-2.5 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:inline-flex"
              >
                Belépés
              </Link>
              <Link
                href="/hire"
                className="inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-5 py-2.5 text-sm font-black text-white shadow-[0_14px_36px_rgba(14,165,233,0.30)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(14,165,233,0.40)]"
              >
                Állást adok fel
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

// ─── Section tag ──────────────────────────────────────────────────────────────

function SectionTag({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold shadow-sm backdrop-blur-xl ${
        dark
          ? "border-white/15 bg-white/10 text-cyan-200"
          : "border-slate-200/80 bg-white/86 text-slate-600"
      }`}
    >
      <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
      {text}
    </div>
  );
}

// ─── Counter ─────────────────────────────────────────────────────────────────

function Counter({ to, delay = 0.7 }: { to: number; delay?: number }) {
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => Math.round(v).toString());
  useEffect(() => {
    const c = animate(count, to, { duration: 1.6, delay, ease: [0.0, 0.0, 0.2, 1.0] });
    return () => c.stop();
  }, [count, to, delay]);
  return <motion.span>{display}</motion.span>;
}

// ─── Trend chart ─────────────────────────────────────────────────────────────

function TrendChart() {
  const line = "M0 34 L18 27 L36 23 L54 13 L72 19 L90 8 L110 3";
  const area = `${line} L110 40 L0 40 Z`;
  return (
    <svg viewBox="0 0 110 40" fill="none" className="mt-2 w-full" style={{ height: 38 }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill="url(#chartGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.8 }}
      />
      <motion.path
        d={line}
        stroke="#22d3ee"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.9, ease: EASE }}
      />
      <motion.circle
        cx="110" cy="3" r="3"
        fill="#22d3ee"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 2.1 }}
      />
    </svg>
  );
}

// ─── Hero visual ─────────────────────────────────────────────────────────────

function HeroVisual() {
  return (
    <div className="relative min-h-[640px] w-full select-none lg:min-h-[720px]">

      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[8%] top-[5%] h-[420px] w-[420px] rounded-full bg-cyan-300/[0.22] blur-[100px]" />
        <div className="absolute left-[5%] bottom-[15%] h-[280px] w-[280px] rounded-full bg-blue-300/[0.12] blur-[80px]" />
        <div className="absolute right-[20%] bottom-[5%] h-[200px] w-[200px] rounded-full bg-sky-300/[0.10] blur-[70px]" />
      </div>

      {/* ── MAIN AD CARD ─────────────────────────────────────────────────── */}
      <motion.div
        className="absolute left-0 top-0 z-10 w-[78%] max-w-[460px]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.08, ease: EASE }}
          className="overflow-hidden rounded-[32px] bg-white shadow-[0_50px_140px_rgba(15,23,42,0.22),0_10px_36px_rgba(15,23,42,0.10)]"
        >
          {/* Facebook-style ad header */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-[11px] font-black text-white shadow-[0_4px_14px_rgba(14,165,233,0.40)]">
                IMZ
              </div>
              <div>
                <div className="text-[14px] font-black text-slate-950">IMZ Kft.</div>
                <div className="text-[11px] font-medium text-slate-400">Szponzorált · 🌍</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
                <span className="text-[10px] font-black uppercase tracking-[0.12em] text-emerald-600">Élő</span>
              </div>
              <div className="flex items-center gap-0.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-1 w-1 rounded-full bg-slate-300" />
                ))}
              </div>
            </div>
          </div>

          {/* Image / creative area */}
          <div className="relative h-[248px] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(14,165,233,0.22),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(6,182,212,0.12),transparent_45%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.06)_1px,transparent_1px)] [background-size:26px_26px]" />
            <div
              className="absolute right-4 bottom-0 text-[140px] leading-none select-none"
              style={{ opacity: 0.22, filter: "drop-shadow(0 0 30px rgba(6,182,212,0.4))" }}
            >
              👷
            </div>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
              className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm"
            >
              <span className="text-[11px] font-bold text-white/90">📍 Hajdúszoboszló</span>
            </motion.div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/92 via-slate-950/55 to-transparent px-5 pb-4 pt-14">
              <div className="text-[8.5px] font-black uppercase tracking-[0.42em] text-cyan-400/80">
                Havi nettó kereset
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
                className="mt-1 flex items-end gap-2"
              >
                <span className="text-[54px] font-black leading-none tracking-[-0.04em] text-white">
                  500 000
                </span>
                <span className="mb-1.5 text-[20px] font-black text-cyan-400">Ft</span>
              </motion.div>
            </div>
          </div>

          {/* Ad body */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-[20px] font-black leading-tight tracking-[-0.04em] text-slate-950">
                  Targoncavezető
                </h3>
                <p className="mt-0.5 text-[12px] font-semibold text-slate-500">
                  IMZ Kft. · Hajdúszoboszló · Azonnali
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-cyan-200/60 bg-cyan-50 px-2.5 py-1 text-[10px] font-black text-cyan-700">
                Teljes munkaidő
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                "⚡ Azonnali felvétel",
                "🏠 Szállás biztosított",
                "💰 Havi bónusz",
                "📋 Bejelentett",
              ].map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-slate-200/70 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold text-slate-600"
                >
                  {b}
                </span>
              ))}
            </div>

            <motion.div
              className="mt-4 rounded-2xl"
              animate={{
                boxShadow: [
                  "0 6px 20px rgba(14,165,233,0.22)",
                  "0 6px 34px rgba(14,165,233,0.50)",
                  "0 6px 20px rgba(14,165,233,0.22)",
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 py-3.5 text-[15px] font-black text-white">
                Jelentkezem most →
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── STATS BADGE — Applicants (dominant outcome) ──────────────────── */}
      <motion.div
        className="absolute right-0 top-[10%] z-30"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.3 }}
      >
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.88 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.65, ease: EASE }}
          className="w-[178px] rounded-[22px] border border-white/90 bg-white p-4 shadow-[0_28px_80px_rgba(15,23,42,0.18),0_0_0_1px_rgba(14,165,233,0.12),0_0_40px_rgba(14,165,233,0.07)]"
          style={{ rotate: 2.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="text-[7px] font-black uppercase leading-tight tracking-[0.28em] text-slate-400">
              Jelentkezők<br />7 nap alatt
            </div>
            <div className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              <span className="text-[7px] font-black uppercase text-emerald-600">Live</span>
            </div>
          </div>
          <div className="mt-1.5 text-[52px] font-black leading-none tracking-[-0.08em] text-slate-950">
            +<Counter to={32} delay={0.9} />
          </div>
          <div className="-mt-0.5 text-[10px] font-bold text-slate-400">jelentkező</div>
          <TrendChart />
        </motion.div>
      </motion.div>

      {/* ── BADGE — Campaign active + CTR ────────────────────────────────── */}
      <motion.div
        className="absolute bottom-[22%] right-[2%] z-20"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <motion.div
          initial={{ opacity: 0, x: 14, y: 8 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1, ease: EASE }}
          className="flex items-center gap-2 rounded-[16px] border border-white/85 bg-white/98 px-4 py-3 shadow-[0_12px_36px_rgba(15,23,42,0.10)] backdrop-blur-xl"
          style={{ rotate: 1.5 }}
        >
          <div className="flex items-center gap-1.5">
            <motion.span
              className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.80)]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.9, repeat: Infinity }}
            />
            <span className="text-[12px] font-black text-slate-800">Kampány aktív</span>
          </div>
          <div className="h-3.5 w-px bg-slate-200" />
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-black text-emerald-600">
            +18% CTR
          </span>
        </motion.div>
      </motion.div>

      {/* ── BADGE — New applicants today ─────────────────────────────────── */}
      <motion.div
        className="absolute bottom-[6%] left-[4%] z-20"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2.7 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -14, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.6, delay: 1.25, ease: EASE }}
          className="rounded-[16px] border border-white/85 bg-white/98 px-4 py-3 shadow-[0_12px_36px_rgba(15,23,42,0.10)] backdrop-blur-xl"
          style={{ rotate: -1.5 }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-sm">
              👤
            </div>
            <div>
              <div className="text-[7.5px] font-black uppercase tracking-[0.22em] text-slate-400">
                Új ma
              </div>
              <div className="mt-0.5 text-[20px] font-black leading-none tracking-[-0.05em] text-slate-950">
                +<Counter to={5} delay={1.3} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
}

// ─── Hero section ─────────────────────────────────────────────────────────────

function HeroSection() {

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pb-12 lg:pt-14">
      <div className="grid items-center gap-10 lg:grid-cols-[44fr_56fr] lg:gap-8 xl:gap-10">

        {/* ── LEFT ─────────────────────────────────────────────────────── */}
        <div className="max-w-[520px]">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
          >
            <SectionTag text="5 jelentkezőig ingyen" />
          </motion.div>

          <h1
            className="mt-6 font-black leading-[0.88] tracking-[-0.065em] text-slate-950"
            style={{ fontSize: "clamp(44px, 5.8vw, 80px)" }}
          >
            <motion.span
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.22, ease: EASE }}
              className="block"
            >
              Ne csak állást<br />adj fel.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.36, ease: EASE }}
              className="block bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 bg-clip-text text-transparent"
            >
              Indíts toborzási<br />rendszert.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.38, ease: EASE }}
            className="mt-6 max-w-[420px] text-[17px] leading-[1.80] text-slate-600 sm:text-[18px]"
          >
            Egy pozícióból komplett kampány,
            <br className="hidden sm:block" />
            kreatívokkal és jelentkezőkkel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.60, delay: 0.52, ease: EASE }}
            className="mt-8"
          >
            <div className="flex flex-wrap items-center gap-4">
              <motion.div
                className="rounded-2xl"
                animate={{
                  boxShadow: [
                    "0 0 26px rgba(14,165,233,0.28), 0 16px 36px rgba(14,165,233,0.14)",
                    "0 0 58px rgba(14,165,233,0.60), 0 16px 44px rgba(14,165,233,0.26)",
                    "0 0 26px rgba(14,165,233,0.28), 0 16px 36px rgba(14,165,233,0.14)",
                  ],
                }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/hire"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-10 py-5 text-[16px] font-black text-white transition hover:-translate-y-0.5"
                >
                  <span className="absolute -inset-8 bg-white/22 opacity-0 blur-2xl transition group-hover:opacity-100" />
                  <span className="relative">Állást adok fel →</span>
                </Link>
              </motion.div>
              <a
                href="#system"
                className="inline-flex items-center rounded-2xl border border-slate-200/80 bg-white/80 px-8 py-5 text-[15px] font-black text-slate-700 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
              >
                Megnézem hogyan működik
              </a>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.90)]" />
                <span className="text-[13px] font-semibold text-slate-500">1 perc alatt elindul</span>
              </div>
              <div className="flex items-center gap-2" style={{ transform: "translateX(1px)" }}>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                <span className="text-[13px] font-semibold text-slate-400">5 jelentkezőig ingyen</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT ────────────────────────────────────────────────────── */}
        <HeroVisual />
      </div>
    </section>
  );
}

// ─── Problem section ──────────────────────────────────────────────────────────

const problems = [
  {
    icon: "📉",
    title: "Kevés figyelem",
    text: "A pozíció elveszik a sablon hirdetések tengerében. Senki sem áll meg.",
  },
  {
    icon: "😶",
    title: "Gyenge első benyomás",
    text: "A bér és az előnyök nem kapnak elég hangsúlyt. A jelölt továbblép.",
  },
  {
    icon: "🎯",
    title: "Nincs kampánylogika",
    text: "A hirdetés nem kampányra optimalizált rendszerként működik.",
  },
  {
    icon: "🧩",
    title: "Széteső jelentkezés",
    text: "A jelöltek útja túl hosszú vagy bizalmatlan. Elvesznek a folyamatban.",
  },
];

function ProblemSection() {
  return (
    <section id="problem" className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="overflow-hidden rounded-[42px] border border-slate-900 bg-slate-950 p-8 shadow-[0_40px_110px_rgba(15,23,42,0.24)] sm:p-10 lg:p-14"
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <SectionTag text="A probléma" dark />
            <h2 className="mt-6 text-[36px] font-black leading-[1] tracking-[-0.055em] text-white sm:text-[48px] lg:text-[58px]">
              A sima álláshirdetés ma már kevés.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-slate-300">
              A munkavállaló nem listákat böngész. Gyors döntést hoz. Ha a bér, az ajánlat és a jelentkezési út nem elég erős, elveszíted.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {problems.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                whileHover={{ y: -4, scale: 1.015, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden rounded-[26px] border border-white/8 bg-white/[0.06] p-5 transition"
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.12), transparent 70%)" }}
                />
                <div className="relative">
                  <div className="text-2xl">{p.icon}</div>
                  <div className="mt-3 text-[16px] font-black text-white">{p.title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{p.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── System / How it works ────────────────────────────────────────────────────

const steps = [
  { n: "01", title: "Megadod a pozíciót", text: "Pozíció, helyszín, bér, rövid leírás. Ennyi kell az induláshoz.", color: "from-cyan-400 to-sky-500" },
  { n: "02", title: "Workzy felépíti", text: "Állásoldal, vizuális megjelenés és jelentkezési logika automatikusan összeáll.", color: "from-blue-400 to-indigo-500" },
  { n: "03", title: "Jelöltek érkeznek", text: "A jelentkezők egy dashboardban jelennek meg, átláthatóan, kezelhetően.", color: "from-violet-400 to-blue-500" },
  { n: "04", title: "Kampány aktiválható", text: "Ha értéket látsz, aktiválod a kampányt és feloldod a további jelölteket.", color: "from-emerald-400 to-cyan-500" },
];

function SystemSection() {
  return (
    <section id="system" className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionTag text="Hogyan működik" />
          <h2 className="mx-auto mt-6 max-w-3xl text-[36px] font-black leading-[1] tracking-[-0.055em] text-slate-950 sm:text-[48px] lg:text-[58px]">
            Egy pozícióból működő toborzás.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Nem csak feltöltöd az állást — egy végiggondolt recruitment flow épül köré, ahol minden elem a jelöltek megszerzésére van optimalizálva.
          </p>
        </motion.div>
      </div>

      <div className="relative mt-14">
        {/* Connecting line */}
        <div className="absolute left-1/2 top-10 hidden h-[calc(100%-80px)] w-px -translate-x-1/2 bg-gradient-to-b from-cyan-400/40 via-blue-400/30 to-transparent lg:block" />

        <div className="grid gap-6 lg:gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`flex items-start gap-6 lg:w-[48%] ${i % 2 === 0 ? "lg:self-start" : "lg:self-end lg:ml-auto"}`}
            >
              <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-[15px] font-black text-white shadow-[0_16px_36px_rgba(14,165,233,0.28)]`}>
                {s.n}
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition group-hover:opacity-100" />
              </div>
              <div className="flex-1 rounded-[28px] border border-white/80 bg-white/82 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.07)] backdrop-blur-xl">
                <h3 className="text-xl font-black tracking-[-0.03em] text-slate-950">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-slate-600">{s.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-12 text-center"
      >
        <Link
          href="/hire"
          className="inline-flex rounded-2xl bg-slate-950 px-8 py-4 text-sm font-black text-white shadow-[0_18px_44px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          Első állás indítása →
        </Link>
      </motion.div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

const features = [
  { icon: "✦", title: "AI kreatív generálás", text: "A pozíció adataiból azonnal kampányra kész vizuált készít. Nincs szükség designerre.", accent: "from-violet-400/20 to-indigo-400/10", border: "border-violet-200/60" },
  { icon: "📣", title: "Kampány logika", text: "A struktúra Meta és Google felületekre van optimalizálva. Készen áll a futtatásra.", accent: "from-cyan-400/20 to-sky-400/10", border: "border-cyan-200/60" },
  { icon: "👥", title: "Jelentkező dashboard", text: "Minden jelölt egy helyen. Státuszok, szűrők, gyors áttekintés. Nincs email-káosz.", accent: "from-emerald-400/20 to-teal-400/10", border: "border-emerald-200/60" },
  { icon: "🔒", title: "Paywall rendszer", text: "5 jelöltig ingyenes. Utána az ügyfél már értéket lát — nem ígéretet fizet.", accent: "from-orange-400/20 to-amber-400/10", border: "border-orange-200/60" },
  { icon: "⚡", title: "Gyors indítás", text: "1 perc alatt él az álláshirdetés, az oldal és a jelentkezési rendszer.", accent: "from-yellow-400/20 to-orange-400/10", border: "border-yellow-200/60" },
  { icon: "📊", title: "Konverziós flow", text: "Mobilbarát, egyszerű jelentkezési út. Minimális lemorzsolódás a folyamat közben.", accent: "from-blue-400/20 to-indigo-400/10", border: "border-blue-200/60" },
];

function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionTag text="Funkciók" />
          <h2 className="mx-auto mt-6 max-w-3xl text-[36px] font-black leading-[1] tracking-[-0.055em] text-slate-950 sm:text-[48px] lg:text-[56px]">
            Minden, ami kell — semmi, ami nem.
          </h2>
        </motion.div>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: EASE }}
            whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.22 } }}
            className={`group relative overflow-hidden rounded-[30px] border ${f.border} bg-white/80 p-7 shadow-[0_22px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${f.accent} opacity-60 transition-opacity duration-300 group-hover:opacity-100`} />
            <div className="absolute inset-0 rounded-[30px] border border-white/60 transition-opacity duration-300 group-hover:border-white/90" />
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                {f.icon}
              </div>
              <h3 className="mt-5 text-xl font-black tracking-[-0.03em] text-slate-950">{f.title}</h3>
              <p className="mt-2.5 text-[15px] leading-7 text-slate-600">{f.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Social proof ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    name: "Horváth Péter",
    role: "HR vezető, LogiTrans Kft.",
    text: "3 nap alatt 18 komoly jelentkezőnk lett. Korábban ugyanehhez 3 hét kellett és egy ügynökség.",
    avatar: "HP",
  },
  {
    name: "Farkas Eszter",
    role: "Ügyvezető, FreshFood Bt.",
    text: "A kampányra kész kreatív azonnal futásra kész volt Meta-n. Sosem volt ilyen egyszerű toborzás.",
    avatar: "FE",
  },
  {
    name: "Balogh Richárd",
    role: "Termelési vezető, AutoParts Zrt.",
    text: "A dashboard tiszta, az értesítők azonnaliak. Pontosan tudom, hol tart minden jelölt.",
    avatar: "BR",
  },
];

function SocialProofSection() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 gap-4 rounded-[36px] border border-white/80 bg-white/80 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:grid-cols-4"
      >
        {[
          ["1,200+", "álláshirdetés generálva"],
          ["8,400+", "beérkezett jelentkezés"],
          ["< 2 perc", "átlagos indítási idő"],
          ["94%", "munkáltatói elégedettség"],
        ].map(([val, label]) => (
          <div key={label} className="text-center">
            <div className="text-[36px] font-black tracking-[-0.05em] text-slate-950 lg:text-[44px]">{val}</div>
            <div className="mt-1.5 text-sm font-bold text-slate-500">{label}</div>
          </div>
        ))}
      </motion.div>

      {/* Testimonials */}
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
            className="rounded-[28px] border border-white/80 bg-white/84 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.07)] backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-black text-white">
                {t.avatar}
              </div>
              <div>
                <div className="text-sm font-black text-slate-950">{t.name}</div>
                <div className="text-xs font-semibold text-slate-500">{t.role}</div>
              </div>
            </div>
            <p className="mt-4 text-[15px] leading-7 text-slate-700">"{t.text}"</p>
            <div className="mt-3 flex gap-0.5 text-amber-400 text-sm">
              {"★★★★★"}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

const plans = [
  {
    title: "Start",
    price: "0 Ft",
    sub: "Kockázat nélküli indulás",
    featured: false,
    points: ["Állásoldal létrehozása", "Alap jelentkezési flow", "5 jelentkezőig ingyenes", "Dashboard hozzáférés"],
  },
  {
    title: "Growth",
    price: "Prémium",
    sub: "Ha komolyan veszed a toborzást",
    featured: true,
    points: ["Korlátlan jelentkezők", "Kampány aktiválás", "AI kreatív generálás", "Meta + Google ready", "Prémium megjelenés"],
  },
  {
    title: "Custom",
    price: "Egyedi",
    sub: "Több pozícióhoz, nagyobb volumenhez",
    featured: false,
    points: ["Több munkáltató kezelése", "Egyedi limitek", "Partner dashboard", "Egyedi workflow"],
  },
];

function PricingSection() {
  return (
    <section id="pricing" className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionTag text="Árazás" />
          <h2 className="mx-auto mt-6 max-w-3xl text-[36px] font-black leading-[1] tracking-[-0.055em] text-slate-950 sm:text-[48px] lg:text-[58px]">
            Előbb jöjjenek a jelöltek. Utána döntesz.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Az első 5 jelentkezőig teljesen ingyenes. Fizetsz, amikor már látod, hogy érdeklődnek.
          </p>
        </motion.div>
      </div>

      <div className="mt-12 grid items-center gap-5 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            animate={plan.featured ? {
              boxShadow: [
                "0 0 0 1px rgba(6,182,212,0.25), 0 30px 90px rgba(14,165,233,0.12)",
                "0 0 0 1.5px rgba(6,182,212,0.60), 0 30px 90px rgba(14,165,233,0.28)",
                "0 0 0 1px rgba(6,182,212,0.25), 0 30px 90px rgba(14,165,233,0.12)",
              ]
            } : {}}
            transition={plan.featured ? {
              opacity: { duration: 0.55, delay: i * 0.1, ease: EASE },
              y: { duration: 0.55, delay: i * 0.1, ease: EASE },
              boxShadow: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
            } : { duration: 0.55, delay: i * 0.1, ease: EASE }}
            whileHover={{ y: plan.featured ? -4 : -3, scale: 1.01, transition: { duration: 0.22 } }}
            className={`relative overflow-hidden rounded-[36px] p-8 shadow-[0_30px_90px_rgba(15,23,42,0.10)] transition ${
              plan.featured
                ? "border border-cyan-300/50 bg-gradient-to-b from-white to-cyan-50/80 shadow-[0_0_0_1px_rgba(6,182,212,0.25),0_40px_110px_rgba(14,165,233,0.14)]"
                : "border border-white/85 bg-white/84 backdrop-blur-xl"
            } ${plan.featured ? "lg:scale-[1.04]" : ""}`}
          >
            {plan.featured && (
              <>
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600" />
                <div className="mb-5 inline-flex rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-[0_12px_28px_rgba(14,165,233,0.28)]">
                  Ajánlott
                </div>
              </>
            )}

            <h3 className="text-2xl font-black tracking-[-0.04em] text-slate-950">{plan.title}</h3>
            <div className="mt-3 text-[46px] font-black tracking-[-0.06em] text-slate-950">{plan.price}</div>
            <p className="mt-2 text-sm font-semibold text-slate-500">{plan.sub}</p>

            <div className="my-7 h-px bg-slate-100" />

            <div className="space-y-3">
              {plan.points.map((pt) => (
                <div key={pt} className="flex items-start gap-3 text-[14px] font-semibold text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 text-[11px]">✓</span>
                  {pt}
                </div>
              ))}
            </div>

            <Link
              href="/hire"
              className={`mt-8 inline-flex w-full items-center justify-center rounded-2xl px-5 py-4 text-sm font-black transition ${
                plan.featured
                  ? "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-[0_18px_42px_rgba(14,165,233,0.28)] hover:-translate-y-0.5"
                  : "border border-slate-200 bg-white text-slate-900 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
              }`}
            >
              Kipróbálom
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative overflow-hidden rounded-[44px] bg-slate-950 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.28)] sm:p-14 lg:p-20"
      >
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute left-[-10%] top-[-20%] h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[130px]"
            animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-20%] right-[-5%] h-[400px] w-[400px] rounded-full bg-blue-500/12 blur-[120px]"
            animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.025]" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <SectionTag text="Kezdj el most" dark />
          <h2 className="mt-7 text-[48px] font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-[64px] lg:text-[76px]">
            Próbáld ki az első{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
              állásoddal.
            </span>
          </h2>
          <p className="mt-7 text-[20px] font-semibold text-slate-300">
            1 perc alatt elindul. 5 jelentkezőig teljesen ingyenes.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <motion.div
              className="rounded-2xl"
              animate={{
                boxShadow: [
                  "0 0 28px rgba(14,165,233,0.30), 0 24px 60px rgba(14,165,233,0.18)",
                  "0 0 58px rgba(14,165,233,0.65), 0 24px 68px rgba(14,165,233,0.34)",
                  "0 0 28px rgba(14,165,233,0.30), 0 24px 60px rgba(14,165,233,0.18)",
                ],
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/hire"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-10 py-5 text-lg font-black text-white transition hover:-translate-y-0.5"
              >
                <span className="absolute -inset-8 bg-white/20 opacity-0 blur-2xl transition group-hover:opacity-100" />
                <span className="relative">Állást adok fel →</span>
              </Link>
            </motion.div>
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-10 py-5 text-lg font-black text-white backdrop-blur-xl transition hover:bg-white/15"
            >
              Belépés
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const faqs = [
  { q: "Ez egy klasszikus állásportál?", a: "Nem. A Workzy nem listázó oldal, hanem recruitment rendszer: állásoldal, kreatív, jelentkezési flow és dashboard egyben." },
  { q: "Kell hozzá marketinges vagy designer?", a: "Nem feltétlenül. Az alap adatokból is kampányra alkalmas megjelenést kapsz, automatikusan." },
  { q: "Miért 5 jelentkezőig ingyenes?", a: "Mert így először látsz értéket. Ha már vannak jelöltek, sokkal egyszerűbb kampányt aktiválni." },
  { q: "Mobilon is működik a jelentkezési flow?", a: "Igen. A folyamat mobilbarát logikára épül — a legtöbb jelölt telefonról dönt és jelentkezik." },
  { q: "Mennyi idő az indítás?", a: "Átlagosan 2 perc. Megadod a pozíciót, bért, helyszínt — az összes többi automatikusan elkészül." },
  { q: "Több pozíciót is kezelhetek?", a: "Igen, a Custom csomaggal több pozíció és munkáltató is kezelhetővé válik egy dashboardban." },
];

function FAQSection() {
  return (
    <section id="faq" className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionTag text="GYIK" />
          <h2 className="mx-auto mt-6 max-w-3xl text-[36px] font-black leading-[1] tracking-[-0.055em] text-slate-950 sm:text-[48px] lg:text-[56px]">
            Gyakori kérdések
          </h2>
        </motion.div>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {faqs.map((f, i) => (
          <motion.div
            key={f.q}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: (i % 2) * 0.08 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="rounded-[26px] border border-white/85 bg-white/84 p-6 shadow-[0_18px_44px_rgba(15,23,42,0.06)] backdrop-blur-xl"
          >
            <h3 className="text-[17px] font-black tracking-[-0.02em] text-slate-950">{f.q}</h3>
            <p className="mt-3 text-[15px] leading-7 text-slate-600">{f.a}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="relative z-10 mt-8 border-t border-white/70">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Image src="/logo.png" alt="Workzy" width={140} height={40} />
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
              Workzy — egy pozícióból komplett recruitment rendszer: állásoldal, kreatív, jelentkezési flow és munkáltatói dashboard.
            </p>
          </div>
          <Link
            href="/hire"
            className="inline-flex w-fit rounded-2xl bg-slate-950 px-7 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Állást adok fel
          </Link>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/70 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>© 2026 Workzy. Minden jog fenntartva.</div>
          <div>AI-alapú toborzási rendszer</div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f4f7f9] text-slate-900">
      {/* Global background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[#f4f7f9]" />
        <div className="absolute left-[-150px] top-[-120px] h-[500px] w-[500px] rounded-full bg-cyan-300/28 blur-[140px]" />
        <div className="absolute right-[-150px] top-[100px] h-[500px] w-[500px] rounded-full bg-blue-300/20 blur-[140px]" />
        <div className="absolute bottom-[-200px] left-[35%] h-[400px] w-[400px] rounded-full bg-emerald-200/22 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.032]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(255,255,255,0.80))]" />
      </div>

      <Header />
      <HeroSection />
      <ProblemSection />
      <SystemSection />
      <FeaturesSection />
      <SocialProofSection />
      <PricingSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </main>
  );
}
