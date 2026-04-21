import Image from "next/image";
import Link from "next/link";

type TeaserCardProps = {
  title: string;
  salary: string;
  location: string;
  image: string;
  badge: string;
  accentGlow: string;
  className?: string;
};

function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-5 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-[24px] border border-white/80 bg-white/78 px-4 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex shrink-0 items-center">
              <Image
                src="/logo.png"
                alt="Workzy"
                width={140}
                height={42}
                className="h-auto w-auto"
                priority
              />
            </Link>

            <nav className="hidden items-center gap-7 lg:flex">
              <a
                href="#flow"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                Folyamat
              </a>
              <a
                href="#screens"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                Képernyők
              </a>
              <a
                href="#why-better"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                Miért jobb?
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                Árak
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/login"
                className="hidden rounded-2xl border border-white/90 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 shadow-[0_10px_26px_rgba(15,23,42,0.05)] transition hover:bg-white md:inline-flex"
              >
                Belépés
              </Link>

              <Link
                href="/employers"
                className="inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(14,165,233,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(14,165,233,0.32)]"
              >
                Állást adok fel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function SectionTag({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/78 px-4 py-2 text-sm font-medium text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.04)] backdrop-blur-md">
      <span className="inline-block h-2 w-2 rounded-full bg-cyan-400/80" />
      {text}
    </div>
  );
}

function FeaturePill({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/90 bg-white/84 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-md">
      <span className="mr-2">{icon}</span>
      {text}
    </div>
  );
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[24px] border border-white/85 bg-white/82 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-md">
      <div className="text-[26px] font-black leading-none tracking-[-0.04em] text-slate-900">
        {value}
      </div>
      <div className="mt-2 text-sm text-slate-500">{label}</div>
    </div>
  );
}

function TeaserCard({
  title,
  salary,
  location,
  image,
  badge,
  accentGlow,
  className = "",
}: TeaserCardProps) {
  return (
    <div
      className={`group absolute ${className} transition-all duration-500 ease-out hover:z-[999]`}
    >
      <div className="relative">
        <div
          className={`absolute -inset-4 rounded-[42px] blur-3xl opacity-25 transition duration-500 group-hover:opacity-60 ${accentGlow}`}
        />
        <div className="relative overflow-hidden rounded-[30px] border border-white/90 bg-white/96 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-4 group-hover:scale-[1.035] group-hover:rotate-0 group-hover:shadow-[0_55px_140px_rgba(15,23,42,0.18)]">
          <div className="relative h-40 w-full overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover object-center transition duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-slate-950/5 to-transparent" />
            <div className="absolute left-4 top-4 rounded-full border border-white/85 bg-white/88 px-3 py-1 text-[10px] font-extrabold tracking-[0.22em] text-slate-700 backdrop-blur">
              {badge}
            </div>
          </div>

          <div className="border-b border-slate-100 px-5 py-3">
            <div className="text-[11px] font-extrabold tracking-[0.22em] text-cyan-600">
              {salary}
            </div>
          </div>

          <div className="px-5 py-4">
            <h3 className="text-[22px] font-black leading-tight tracking-[-0.04em] text-slate-900">
              {title}
            </h3>

            <div className="mt-3 space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-700">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                  📍
                </span>
                <span>{location}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />
          <div className="grid grid-cols-2 gap-3 px-5 py-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
              <div className="text-xl font-black text-slate-900">23</div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                jelentkező
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
              <div className="text-xl font-black text-emerald-600">Aktív</div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-emerald-500">
                kampány
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroMainCard() {
  return (
    <div className="absolute left-[50%] top-[235px] z-40 w-[280px] -translate-x-1/2 rotate-[-2deg] transition duration-500 hover:z-[999] hover:-translate-y-3 hover:rotate-0 hover:scale-[1.02] sm:left-[54%] sm:w-[300px] lg:left-[245px] lg:top-[250px] lg:w-[336px] lg:translate-x-0">
      <div className="relative">
        <div className="absolute -inset-5 rounded-[40px] bg-cyan-200/24 blur-3xl" />
        <div className="relative overflow-hidden rounded-[30px] border border-white/90 bg-white/96 shadow-[0_34px_100px_rgba(15,23,42,0.16)] backdrop-blur-xl">
          <div className="relative h-44 w-full overflow-hidden lg:h-48">
            <Image
              src="/job-operator.jpg"
              alt="Betanított operátor"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
            <div className="absolute left-4 top-4 rounded-full border border-white/85 bg-white/90 px-3 py-1 text-[10px] font-extrabold tracking-[0.22em] text-slate-700 backdrop-blur">
              ÚJ KAMPÁNY
            </div>
          </div>

          <div className="border-b border-slate-100 px-5 py-3">
            <div className="text-[11px] font-extrabold tracking-[0.22em] text-cyan-600">
              NETTÓ 360–430.000 FT
            </div>
          </div>

          <div className="px-5 py-5">
            <h3 className="text-[24px] font-black leading-tight tracking-[-0.04em] text-slate-900 lg:text-[26px]">
              Betanított operátor
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Prémium álláskártya és kampányra optimalizált jelentkezési flow.
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-700">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                  📍
                </span>
                <span>Székesfehérvár</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  ⏱
                </span>
                <span>Azonnali kezdés</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  ⚡
                </span>
                <span>Gyors jelentkezés</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />
          <div className="grid grid-cols-2 gap-3 px-5 py-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
              <div className="text-xl font-black text-slate-900">23</div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                jelentkező
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
              <div className="text-xl font-black text-emerald-600">Aktív</div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-emerald-500">
                kampány
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrowserPreview() {
  return (
    <div className="absolute left-1/2 top-1/2 z-10 h-[420px] w-full max-w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[34px] border border-white/75 bg-white/42 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:h-[500px] lg:left-[63%] lg:h-[560px] lg:w-[780px] lg:max-w-none lg:-translate-x-1/2">
      <div className="flex h-14 items-center gap-3 border-b border-white/60 bg-white/38 px-5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
        </div>

        <div className="ml-2 hidden h-9 w-[340px] items-center rounded-full border border-white/70 bg-white/55 px-4 text-sm text-slate-400 sm:flex">
          workzy.hu/job-preview
        </div>
      </div>

      <div className="relative h-[calc(100%-56px)] bg-[linear-gradient(180deg,rgba(255,255,255,0.26),rgba(255,255,255,0.16))] p-4 sm:p-6">
        <div className="absolute right-[-30px] top-[-20px] h-[160px] w-[160px] rounded-full bg-cyan-200/18 blur-[80px]" />
        <div className="absolute bottom-[-20px] left-[-20px] h-[140px] w-[140px] rounded-full bg-emerald-100/18 blur-[80px]" />

        <div className="grid h-full gap-4 sm:grid-cols-[1.08fr_0.92fr] sm:gap-5">
          <div className="rounded-[28px] border border-white/60 bg-white/34 p-4 sm:p-5">
            <div className="h-36 rounded-[22px] bg-gradient-to-br from-slate-200/80 via-slate-100/90 to-cyan-50/70 sm:h-44" />
            <div className="mt-5 space-y-3">
              <div className="h-3 w-24 rounded-full bg-cyan-100/90" />
              <div className="h-8 w-[68%] rounded-xl bg-slate-200/75" />
              <div className="h-8 w-[52%] rounded-xl bg-slate-200/65" />
              <div className="h-3 w-[92%] rounded-full bg-slate-200/60" />
              <div className="h-3 w-[78%] rounded-full bg-slate-200/50" />
              <div className="mt-5 flex gap-3">
                <div className="h-10 w-32 rounded-2xl bg-gradient-to-r from-cyan-400/80 to-sky-500/80" />
                <div className="h-10 w-24 rounded-2xl bg-white/70" />
              </div>
            </div>
          </div>

          <div className="hidden flex-col gap-4 sm:flex">
            <div className="rounded-[24px] border border-white/60 bg-white/34 p-4">
              <div className="h-3 w-20 rounded-full bg-slate-200/75" />
              <div className="mt-4 h-8 w-16 rounded-xl bg-slate-300/70" />
              <div className="mt-3 h-3 w-24 rounded-full bg-slate-200/55" />
            </div>

            <div className="rounded-[24px] border border-white/60 bg-white/34 p-4">
              <div className="h-3 w-24 rounded-full bg-emerald-100/85" />
              <div className="mt-4 h-8 w-32 rounded-xl bg-emerald-200/75" />
              <div className="mt-3 h-3 w-20 rounded-full bg-emerald-100/60" />
            </div>

            <div className="rounded-[24px] border border-white/60 bg-white/34 p-4">
              <div className="h-3 w-24 rounded-full bg-slate-200/75" />
              <div className="mt-4 space-y-3">
                <div className="h-2.5 rounded-full bg-slate-200/65" />
                <div className="h-2.5 w-[82%] rounded-full bg-slate-200/55" />
                <div className="h-2.5 w-[68%] rounded-full bg-slate-200/45" />
              </div>
            </div>

            <div className="rounded-[24px] border border-white/60 bg-white/30 p-4">
              <div className="h-11 rounded-2xl bg-white/55" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- FLOW SECTION – ÚJRADOLGOZVA -------------------- */

function FlowSection() {
  const steps = [
    {
      step: "01",
      label: "ADMIN OLDAL",
      title: "Pozíció megadása",
      variant: "admin" as const,
      featured: false,
    },
    {
      step: "02",
      label: "LANDING PREVIEW",
      title: "Kész állásoldal",
      variant: "landing" as const,
      featured: true,
    },
    {
      step: "03",
      label: "CREATIVE PREVIEW",
      title: "AI kampánykreatív",
      variant: "creative" as const,
      featured: false,
    },
    {
      step: "04",
      label: "BEÉRKEZŐ FLOW",
      title: "Jelentkezések",
      variant: "results" as const,
      featured: false,
    },
  ];

  return (
    <section
      id="flow"
      className="relative z-10 mx-auto mt-20 max-w-7xl px-5 sm:px-6 lg:mt-24 lg:px-8"
    >
      <div className="text-center">
        <SectionTag text="Így lesz ebből toborzás" />
        <h2 className="mx-auto mt-6 max-w-5xl text-[34px] font-black leading-[1.02] tracking-[-0.05em] text-slate-900 sm:text-[46px] lg:text-[60px]">
          Nem csak feladod az állást.
          <br className="hidden sm:block" />
          Meg is mutatjuk, mi történik utána.
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
          A Workzy vizuálisan végigviszi a teljes flow-t a pozíció létrehozásától
          a kampányra kész megjelenésig és a jelentkezésekig.
        </p>
      </div>

      <div className="relative mt-12 lg:mt-14">
        <div className="absolute left-1/2 top-[38%] h-[260px] w-[92%] max-w-[1100px] -translate-x-1/2 rounded-full bg-cyan-200/18 blur-[120px]" />

        <div className="relative grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              <FlowCard
                step={item.step}
                label={item.label}
                title={item.title}
                variant={item.variant}
                featured={item.featured}
              />

              {index < steps.length - 1 && (
                <div className="pointer-events-none absolute -right-4 top-1/2 z-20 hidden -translate-y-1/2 xl:flex">
                  <FlowArrow />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlowArrow() {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/90 bg-white/90 shadow-[0_14px_36px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="absolute inset-0 rounded-full bg-cyan-200/20 blur-xl" />
      <span className="relative text-base font-black text-cyan-600">→</span>
    </div>
  );
}

function FlowCard({
  step,
  label,
  title,
  variant,
  featured = false,
}: {
  step: string;
  label: string;
  title: string;
  variant: "admin" | "landing" | "creative" | "results";
  featured?: boolean;
}) {
  return (
    <div
      className={`relative h-full rounded-[30px] border p-5 shadow-[0_24px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 lg:p-6 ${
        featured
          ? "border-cyan-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(240,249,255,0.96))] shadow-[0_30px_80px_rgba(14,165,233,0.10)]"
          : "border-white/85 bg-white/84"
      }`}
    >
      {featured && (
        <div className="absolute -inset-2 -z-10 rounded-[40px] bg-cyan-200/18 blur-2xl" />
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-black tracking-[0.16em] text-slate-500">
          {step}
        </div>
        <div className="text-right text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 sm:text-[11px]">
          {label}
        </div>
      </div>

      <h3 className="mt-5 min-h-[62px] text-[22px] font-black leading-[1.03] tracking-[-0.04em] text-slate-900 lg:text-[26px]">
        {title}
      </h3>

      <div className="mt-5">
        {variant === "admin" && <AdminFlowPreview />}
        {variant === "landing" && <LandingFlowPreview />}
        {variant === "creative" && <CreativeFlowPreview />}
        {variant === "results" && <ResultsFlowPreview />}
      </div>
    </div>
  );
}

function AdminFlowPreview() {
  return (
    <div className="overflow-hidden rounded-[26px] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.94))] shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
      <div className="border-b border-slate-100 px-4 py-4">
        <div className="h-4 w-28 rounded-full bg-slate-200/85" />
      </div>

      <div className="space-y-3 p-4">
        <div className="h-11 rounded-2xl bg-slate-100" />
        <div className="h-11 rounded-2xl bg-slate-100" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-11 rounded-2xl bg-slate-100" />
          <div className="h-11 rounded-2xl bg-slate-100" />
        </div>
        <div className="h-24 rounded-[22px] bg-slate-100" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-11 rounded-2xl bg-slate-100" />
          <div className="h-11 rounded-2xl bg-slate-100" />
        </div>
        <div className="h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 shadow-[0_14px_30px_rgba(14,165,233,0.18)]" />
      </div>
    </div>
  );
}

function LandingFlowPreview() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/90 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="relative h-40">
        <Image
          src="/job-raktaros.jpg"
          alt="Landing preview"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/45 via-slate-950/12 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-white/88 px-3 py-1 text-[10px] font-black tracking-[0.18em] text-slate-700">
          AKTÍV ÁLLÁS
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-[10px] font-extrabold tracking-[0.18em] text-cyan-300">
            NETTÓ 400–500.000 FT
          </div>
          <div className="mt-1 text-[28px] font-black leading-none tracking-[-0.04em] text-white">
            Raktáros
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="h-3 w-24 rounded-full bg-cyan-100" />
        <div className="h-8 w-[78%] rounded-xl bg-slate-200/75" />
        <div className="h-3 w-[92%] rounded-full bg-slate-200/55" />
        <div className="h-3 w-[76%] rounded-full bg-slate-200/45" />
        <div className="flex gap-3 pt-2">
          <div className="h-11 w-32 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 shadow-[0_14px_28px_rgba(14,165,233,0.18)]" />
          <div className="h-11 w-24 rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

function CreativeFlowPreview() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/90 bg-[linear-gradient(135deg,#eef6ff,#f5f8ff)] shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="relative h-[280px]">
        <Image
          src="/job-operator.jpg"
          alt="Creative preview"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(29,78,216,0.72),rgba(56,189,248,0.14),rgba(255,255,255,0.02))]" />

        <div className="absolute left-4 top-4 rounded-full bg-white/88 px-3 py-1 text-[10px] font-black tracking-[0.18em] text-slate-700">
          KREATÍV PREVIEW
        </div>

        <div className="absolute bottom-4 left-4 right-4 rounded-[24px] bg-white/92 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.14)] backdrop-blur">
          <div className="text-[15px] font-bold text-slate-500">nettó</div>
          <div className="mt-1 text-[34px] font-black leading-none tracking-[-0.05em] text-cyan-600">
            360–430.000
            <br />
            Ft/hó
          </div>
          <div className="mt-4 text-[13px] leading-6 text-slate-600">
            Kampányra kész recruitment kreatív, erős első benyomással.
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsFlowPreview() {
  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-white/90 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
        <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
          Jelentkezők
        </div>
        <div className="mt-4 text-4xl font-black leading-none tracking-[-0.05em] text-slate-900">
          23
        </div>
        <div className="mt-4 h-3 rounded-full bg-slate-100">
          <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-cyan-400 to-sky-500" />
        </div>
      </div>

      <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/80 p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
        <div className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-500">
          Kampány
        </div>
        <div className="mt-4 text-[20px] font-black leading-snug tracking-[-0.03em] text-emerald-600">
          Meta + Google aktív
        </div>
      </div>

      <div className="rounded-[24px] border border-white/90 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
        <div className="space-y-3">
          <div className="h-3 rounded-full bg-slate-100" />
          <div className="h-3 w-[84%] rounded-full bg-slate-100" />
          <div className="h-3 w-[62%] rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

function ScreenShowcase({
  title,
  text,
  image,
  reverse = false,
  badge,
}: {
  title: string;
  text: string;
  image: string;
  reverse?: boolean;
  badge: string;
}) {
  return (
    <div
      className={`grid items-center gap-10 rounded-[36px] border border-white/85 bg-white/78 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:p-10 ${
        reverse ? "lg:grid-cols-[1.05fr_0.95fr]" : "lg:grid-cols-[0.95fr_1.05fr]"
      }`}
    >
      <div className={reverse ? "lg:order-2" : ""}>
        <SectionTag text={badge} />
        <h3 className="mt-6 text-[34px] font-black leading-[0.98] tracking-[-0.05em] text-slate-900 lg:text-[48px]">
          {title}
        </h3>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">{text}</p>
      </div>

      <div className={reverse ? "lg:order-1" : ""}>
        <div className="relative overflow-hidden rounded-[30px] border border-white/85 bg-white/84 shadow-[0_26px_70px_rgba(15,23,42,0.08)]">
          <div className="flex h-14 items-center gap-3 border-b border-white/70 bg-white/68 px-5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
            <div className="ml-3 hidden h-9 w-[240px] items-center rounded-full border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 sm:flex">
              workzy preview
            </div>
          </div>

          <div className="relative h-[320px] sm:h-[380px] lg:h-[420px]">
            <Image src={image} alt={title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/14 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareCard({
  title,
  good,
  points,
}: {
  title: string;
  good?: boolean;
  points: string[];
}) {
  return (
    <div
      className={`rounded-[30px] border p-8 shadow-[0_22px_56px_rgba(15,23,42,0.07)] backdrop-blur-xl ${
        good
          ? "border-cyan-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(240,249,255,0.92))]"
          : "border-white/85 bg-white/82"
      }`}
    >
      <div
        className={`inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${
          good
            ? "bg-gradient-to-r from-cyan-500 to-sky-500 text-white"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {title}
      </div>

      <div className="mt-6 space-y-4">
        {points.map((point) => (
          <div key={point} className="flex items-start gap-3 text-slate-700">
            <span
              className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${
                good ? "bg-cyan-50 text-cyan-600" : "bg-slate-100 text-slate-500"
              }`}
            >
              {good ? "✓" : "–"}
            </span>
            <span className="text-[15px] leading-7">{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceCard({
  title,
  price,
  text,
  featured = false,
  points,
}: {
  title: string;
  price: string;
  text: string;
  featured?: boolean;
  points: string[];
}) {
  return (
    <div
      className={`relative rounded-[32px] border p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl ${
        featured
          ? "border-cyan-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(240,249,255,0.92))]"
          : "border-white/85 bg-white/84"
      }`}
    >
      {featured && (
        <div className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_26px_rgba(14,165,233,0.25)]">
          Ajánlott
        </div>
      )}

      <h3 className="text-[28px] font-black tracking-[-0.04em] text-slate-900">
        {title}
      </h3>
      <div className="mt-4 text-[42px] font-black leading-none tracking-[-0.05em] text-slate-900 lg:text-[46px]">
        {price}
      </div>
      <p className="mt-4 text-[15px] leading-7 text-slate-600">{text}</p>

      <div className="mt-6 space-y-3">
        {points.map((point) => (
          <div key={point} className="flex items-start gap-3 text-sm text-slate-700">
            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
              ✓
            </span>
            <span>{point}</span>
          </div>
        ))}
      </div>

      <button
        className={`mt-8 w-full rounded-2xl px-5 py-4 text-sm font-semibold transition ${
          featured
            ? "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 text-white shadow-[0_16px_38px_rgba(14,165,233,0.24)] hover:-translate-y-0.5"
            : "border border-white/90 bg-white/86 text-slate-800 shadow-[0_12px_28px_rgba(15,23,42,0.05)] hover:bg-white"
        }`}
      >
        Ezt választom
      </button>
    </div>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/85 bg-white/84 p-6 shadow-[0_18px_44px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <h3 className="text-lg font-black tracking-[-0.02em] text-slate-900">
        {question}
      </h3>
      <p className="mt-3 text-[15px] leading-7 text-slate-600">{answer}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-white/70">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Image
              src="/logo.png"
              alt="Workzy"
              width={150}
              height={44}
              className="h-auto w-auto"
            />
            <p className="mt-5 max-w-md text-[15px] leading-7 text-slate-600">
              Prémium megjelenésű, kampányra kész recruitment rendszer, ahol egy
              pozícióból landing oldal, kreatív és jelentkezési flow épül.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-900">
              Termék
            </h3>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div>Állásoldalak</div>
              <div>Kampányindítás</div>
              <div>Automatikus kreatív</div>
              <div>Jelentkezési flow</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-900">
              Cég
            </h3>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div>Rólunk</div>
              <div>Kapcsolat</div>
              <div>Partnerek</div>
              <div>Blog</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-900">
              Jogi
            </h3>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div>ÁSZF</div>
              <div>Adatkezelés</div>
              <div>Cookie tájékoztató</div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/70 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>© 2026 Workzy. Minden jog fenntartva.</div>
          <div>Modern recruitment platform</div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f7f9] text-slate-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#f4f7f9]" />
        <div className="absolute left-[-120px] top-[-100px] h-[320px] w-[320px] rounded-full bg-cyan-200/34 blur-[110px]" />
        <div className="absolute right-[-120px] top-[40px] h-[340px] w-[340px] rounded-full bg-sky-200/28 blur-[120px]" />
        <div className="absolute bottom-[-140px] left-[35%] h-[320px] w-[320px] rounded-full bg-emerald-100/28 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(255,255,255,0.70))]" />
      </div>

      <Header />

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-10 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="max-w-2xl pt-4 lg:pt-8">
            <SectionTag text="Modern recruitment platform" />

            <h1 className="mt-8 text-[46px] font-black leading-[0.94] tracking-[-0.055em] text-slate-900 sm:text-[62px] md:text-[74px] lg:text-[92px]">
              Állásfeladás.
              <br />
              <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-400 bg-clip-text text-transparent">
                Azonnal.
              </span>
              <br />
              Egyszerűen.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-[20px] sm:leading-9">
              A Workzy nem egy klasszikus állásportál. Egy pozícióból komplett,
              kampányra kész toborzási rendszert épít.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/employers"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-8 py-5 text-lg font-semibold text-white shadow-[0_18px_42px_rgba(14,165,233,0.24)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_52px_rgba(14,165,233,0.32)]"
              >
                <span className="absolute -inset-6 rounded-[34px] bg-cyan-300/24 blur-2xl opacity-70" />
                <span className="absolute inset-0 bg-white/10 opacity-0 transition duration-300 group-hover:opacity-100" />
                <span className="relative">Állást adok fel →</span>
              </Link>

              <a
                href="#flow"
                className="inline-flex items-center justify-center rounded-2xl border border-white/90 bg-white/82 px-8 py-5 text-lg font-semibold text-slate-800 shadow-[0_14px_30px_rgba(15,23,42,0.05)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white"
              >
                ▶ Megnézem hogyan működik
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <FeaturePill icon="⚡" text="AI landing page" />
              <FeaturePill icon="🎨" text="Automatikus kreatív" />
              <FeaturePill icon="🚀" text="Kampányindítás" />
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
              <MetricCard value="1" label="pozíció egy rendszerben" />
              <MetricCard value="Gyors" label="jelentkezési flow" />
              <MetricCard value="Meta + Google" label="kampányindítás" />
            </div>
          </div>

          <div className="relative min-h-[580px] sm:min-h-[680px] lg:min-h-[840px]">
            <div className="absolute left-1/2 top-1/2 h-[560px] w-[92%] max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/20 blur-[150px] lg:left-[63%] lg:h-[680px] lg:w-[820px]" />
            <div className="absolute left-1/2 top-1/2 h-[440px] w-[82%] max-w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/68 blur-[120px] lg:left-[63%] lg:h-[560px] lg:w-[680px]" />

            <BrowserPreview />

            <div className="hidden lg:block">
              <TeaserCard
                title="Raktáros"
                salary="NETTÓ 400–500.000 FT"
                location="Budapest, IX. kerület"
                image="/job-raktaros.jpg"
                badge="AKTÍV POZÍCIÓ"
                accentGlow="bg-cyan-300/40"
                className="left-[18px] top-[66px] z-30 w-[300px] rotate-[-12deg]"
              />

              <TeaserCard
                title="Gépkezelő"
                salary="NETTÓ 420–550.000 FT"
                location="Győr"
                image="/job-gepkezelo.jpg"
                badge="KIEMELT"
                accentGlow="bg-emerald-300/40"
                className="right-[-6px] top-[78px] z-40 w-[300px] rotate-[11deg]"
              />
            </div>

            <HeroMainCard />
          </div>
        </div>
      </section>

      <FlowSection />

      <section
        id="screens"
        className="relative z-10 mx-auto mt-24 max-w-7xl space-y-8 px-5 sm:px-6 lg:px-8"
      >
        <ScreenShowcase
          badge="Admin nézet"
          title="Így néz ki a pozíció felépítése a rendszerben"
          text="A pozíció nem csak egy űrlap. Strukturáltan adod meg az adatokat, amelyekből egy kész recruitment megjelenés épül."
          image="/job-raktaros.jpg"
        />

        <ScreenShowcase
          badge="Kész állásoldal"
          title="A pozícióból prémium állásoldal lesz"
          text="Nem sablonos listatétel, hanem önálló landing élmény. Erősebb első benyomás, jobb olvashatóság, gyorsabb jelentkezési út."
          image="/job-operator.jpg"
          reverse
        />

        <ScreenShowcase
          badge="Kampányra kész kreatív"
          title="A megjelenés már hirdetési logikában is működik"
          text="A Workzy vizuálisan kampánybarát irányban építi fel a pozíciót, így a kreatív és a landing logikája jobban összeáll."
          image="/job-gepkezelo.jpg"
        />
      </section>

      <section
        id="why-better"
        className="relative z-10 mx-auto mt-24 max-w-7xl px-5 sm:px-6 lg:px-8"
      >
        <div className="text-center">
          <SectionTag text="Miért jobb, mint egy sima álláshirdetés?" />
          <h2 className="mx-auto mt-6 max-w-4xl text-[38px] font-black leading-[0.98] tracking-[-0.05em] text-slate-900 lg:text-[56px]">
            A különbség nem csak a kinézetben van.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <CompareCard
            title="Sima álláshirdetés"
            points={[
              "Sokszor sablonos és vizuálisan gyenge első benyomás",
              "Nem kampányra optimalizált felépítés",
              "A pozíció csak információként jelenik meg",
              "Könnyebben elveszik a többi hirdetés között",
            ]}
          />
          <CompareCard
            title="Workzy megjelenés"
            good
            points={[
              "Prémiumabb vizuális megjelenés és erősebb first impression",
              "Landing + kreatív + recruitment flow egy rendszerben",
              "Kampánybarát, jobban kommunikálható struktúra",
              "A pozíció jobban eladható, átláthatóbb és modernebb",
            ]}
          />
        </div>
      </section>

      <section
        id="pricing"
        className="relative z-10 mx-auto mt-24 max-w-7xl px-5 sm:px-6 lg:px-8"
      >
        <div className="text-center">
          <SectionTag text="Árak" />
          <h2 className="mx-auto mt-6 max-w-4xl text-[38px] font-black leading-[0.98] tracking-[-0.05em] text-slate-900 lg:text-[56px]">
            Egyszerű indulás. Skálázható recruitment rendszer.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <PriceCard
            title="Start"
            price="0 Ft"
            text="Kipróbálásra, első pozíciókhoz és az alap workflow megismerésére."
            points={[
              "Állásoldal létrehozása",
              "Alap megjelenés",
              "Jelentkezési flow",
              "Egyszerű admin nézet",
            ]}
          />
          <PriceCard
            title="Growth"
            price="Prémium"
            featured
            text="Azoknak, akik erősebb megjelenést és kampányra kész recruitment logikát akarnak."
            points={[
              "Prémium állásoldal",
              "Kreatív logika",
              "Meta + Google kampány alap",
              "Jobb konverziós megjelenés",
            ]}
          />
          <PriceCard
            title="Custom"
            price="Egyedi"
            text="Nagyobb volumenhez, ügynökségi vagy több pozíciós működéshez."
            points={[
              "Egyedi workflow",
              "Több kampánylogika",
              "Csapat- vagy partnerkezelés",
              "Testreszabott megjelenés",
            ]}
          />
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-24 max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="rounded-[38px] border border-white/85 bg-white/76 p-8 shadow-[0_26px_70px_rgba(15,23,42,0.07)] backdrop-blur-xl lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <SectionTag text="Demo / kapcsolat" />
              <h2 className="mt-6 text-[38px] font-black leading-[0.98] tracking-[-0.05em] text-slate-900 lg:text-[56px]">
                Nézd meg, hogyan nézne ki nálad ugyanez.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Ha szeretnéd, megmutatjuk, hogyan lehet a mostani állásfeladási
                folyamatodból egy erősebb, modernebb recruitment megjelenést
                építeni.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button className="rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-8 py-5 text-lg font-semibold text-white shadow-[0_18px_42px_rgba(14,165,233,0.24)] transition hover:-translate-y-0.5">
                  Demót kérek
                </button>
                <button className="rounded-2xl border border-white/90 bg-white/86 px-8 py-5 text-lg font-semibold text-slate-800 shadow-[0_14px_30px_rgba(15,23,42,0.05)] transition hover:bg-white">
                  Kapcsolat
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/85 bg-white/88 p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
                <div className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                  Gyors indulás
                </div>
                <div className="mt-3 text-2xl font-black tracking-[-0.04em] text-slate-900">
                  1 pozícióból indulhatsz
                </div>
              </div>
              <div className="rounded-[24px] border border-white/85 bg-white/88 p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
                <div className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                  Kampánybarát
                </div>
                <div className="mt-3 text-2xl font-black tracking-[-0.04em] text-slate-900">
                  Meta + Google logika
                </div>
              </div>
              <div className="rounded-[24px] border border-white/85 bg-white/88 p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
                <div className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                  Megjelenés
                </div>
                <div className="mt-3 text-2xl font-black tracking-[-0.04em] text-slate-900">
                  Prémium állásoldal
                </div>
              </div>
              <div className="rounded-[24px] border border-white/85 bg-white/88 p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
                <div className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                  Egyszerűség
                </div>
                <div className="mt-3 text-2xl font-black tracking-[-0.04em] text-slate-900">
                  1 rendszerben kezelve
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-24 max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <SectionTag text="GYIK" />
          <h2 className="mx-auto mt-6 max-w-4xl text-[38px] font-black leading-[0.98] tracking-[-0.05em] text-slate-900 lg:text-[56px]">
            Gyakori kérdések
          </h2>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <FAQItem
            question="Ez egy klasszikus állásportál?"
            answer="Nem. A Workzy inkább egy recruitment rendszer, amely egy pozícióból prémium megjelenésű állásoldalt és kampányra alkalmas struktúrát épít."
          />
          <FAQItem
            question="Kell hozzá külön marketinges vagy designer?"
            answer="Nem feltétlenül. A cél épp az, hogy a megjelenés és a recruitment logika sokkal jobban összeálljon egy rendszerben."
          />
          <FAQItem
            question="Használható kampányindításhoz is?"
            answer="Igen, a koncepció alapja, hogy a pozíció ne csak információként jelenjen meg, hanem kampányra alkalmas felületként működjön."
          />
          <FAQItem
            question="Mobilon is jól működik?"
            answer="Igen, a teljes logika mobilbarát recruitment flow-ra épül, mert a jelentkezések jelentős része ott történik."
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}