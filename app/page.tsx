import Image from "next/image";
import Link from "next/link";

type FlowVariant = "admin" | "landing" | "creative" | "results";

function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-[26px] border border-white/80 bg-white/86 px-4 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-xl sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex shrink-0 items-center">
              <Image
                src="/logo.png"
                alt="Workzy"
                width={148}
                height={44}
                className="h-auto w-[118px] sm:w-[148px]"
                priority
              />
            </Link>

            <nav className="hidden items-center gap-8 lg:flex">
              {[
                ["#flow", "Folyamat"],
                ["#screens", "Képernyők"],
                ["#why-better", "Miért jobb?"],
                ["#pricing", "Árak"],
                ["#faq", "GYIK"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/admin/login"
                className="hidden rounded-2xl border border-white/90 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition hover:bg-white md:inline-flex"
              >
                Belépés
              </Link>

              <Link
                href="/hire"
                className="inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(14,165,233,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(14,165,233,0.32)] sm:px-5"
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
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/86 px-4 py-2 text-sm font-medium text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.04)] backdrop-blur-md">
      <span className="inline-block h-2 w-2 rounded-full bg-cyan-400/90" />
      {text}
    </div>
  );
}

function HeroFeature({
  value,
  label,
  featured = false,
}: {
  value: string;
  label: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-[22px] border px-4 py-4 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${
        featured
          ? "border-sky-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(240,249,255,0.94))] shadow-sky-100/50"
          : "border-slate-200/70 bg-white/76"
      }`}
    >
      <div className="text-[17px] font-black leading-none tracking-[-0.03em] text-slate-900 sm:text-[18px]">
        {value}
      </div>
      <div className="mt-1.5 text-[12px] font-semibold text-slate-500">
        {label}
      </div>
    </div>
  );
}

function BrowserPreview() {
  return (
    <div className="absolute left-1/2 top-1/2 z-10 h-[350px] w-full max-w-[620px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[30px] border border-white/75 bg-white/48 shadow-[0_28px_90px_rgba(15,23,42,0.09)] backdrop-blur-xl sm:h-[430px] lg:left-[57%] lg:h-[500px] lg:w-[700px] lg:max-w-none">
      <div className="flex h-12 items-center gap-2.5 border-b border-white/60 bg-white/42 px-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        </div>

        <div className="ml-2 hidden h-7 w-[280px] items-center rounded-full border border-white/70 bg-white/58 px-3 text-[13px] text-slate-400 sm:flex">
          workzy.hu/admin
        </div>
      </div>

      <div className="relative h-[calc(100%-48px)] p-3 sm:p-5">
        <div className="absolute right-[-30px] top-[-10px] h-[150px] w-[150px] rounded-full bg-cyan-200/18 blur-[80px]" />
        <div className="absolute bottom-[-20px] left-[-20px] h-[120px] w-[120px] rounded-full bg-emerald-100/18 blur-[80px]" />

        <div className="grid h-full gap-3 sm:grid-cols-[1.08fr_0.92fr] sm:gap-4">
          <div className="rounded-[24px] border border-white/60 bg-white/36 p-4">
            <div className="h-32 rounded-[20px] bg-gradient-to-br from-slate-200/80 via-slate-100/90 to-cyan-50/70 sm:h-36" />
            <div className="mt-4 space-y-2.5">
              <div className="h-2.5 w-24 rounded-full bg-cyan-100/90" />
              <div className="h-6 w-[68%] rounded-xl bg-slate-200/75" />
              <div className="h-6 w-[52%] rounded-xl bg-slate-200/65" />
              <div className="h-2.5 w-[92%] rounded-full bg-slate-200/60" />
              <div className="h-2.5 w-[78%] rounded-full bg-slate-200/50" />
              <div className="mt-4 flex gap-2">
                <div className="h-8 w-28 rounded-xl bg-gradient-to-r from-cyan-400/80 to-sky-500/80" />
                <div className="h-8 w-20 rounded-xl bg-white/70" />
              </div>
            </div>
          </div>

          <div className="hidden flex-col gap-3 sm:flex">
            <div className="rounded-[20px] border border-white/60 bg-white/34 p-3.5">
              <div className="h-2.5 w-20 rounded-full bg-slate-200/75" />
              <div className="mt-3 h-6 w-16 rounded-xl bg-slate-300/70" />
              <div className="mt-2.5 h-2.5 w-24 rounded-full bg-slate-200/55" />
            </div>

            <div className="rounded-[20px] border border-white/60 bg-white/34 p-3.5">
              <div className="h-2.5 w-24 rounded-full bg-emerald-100/85" />
              <div className="mt-3 h-6 w-32 rounded-xl bg-emerald-200/75" />
              <div className="mt-2.5 h-2.5 w-20 rounded-full bg-emerald-100/60" />
            </div>

            <div className="rounded-[20px] border border-white/60 bg-white/34 p-3.5">
              <div className="h-2.5 w-24 rounded-full bg-slate-200/75" />
              <div className="mt-3 space-y-2.5">
                <div className="h-2 rounded-full bg-slate-200/65" />
                <div className="h-2 w-[82%] rounded-full bg-slate-200/55" />
                <div className="h-2 w-[68%] rounded-full bg-slate-200/45" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSideCard() {
  return (
    <div className="absolute left-[4%] top-[110px] z-20 hidden w-[220px] rotate-[-7deg] opacity-90 transition duration-500 hover:-translate-y-2 hover:rotate-[-3deg] hover:scale-[1.02] lg:block">
      <div className="rounded-[24px] border border-white/90 bg-white/92 p-4 shadow-[0_22px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
        <div className="relative h-24 overflow-hidden rounded-2xl">
          <Image src="/job-raktaros.jpg" alt="Raktáros" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
          <div className="absolute left-3 top-3 rounded-full border border-white/85 bg-white/88 px-2 py-1 text-[9px] font-extrabold tracking-[0.16em] text-slate-700">
            AKTÍV POZÍCIÓ
          </div>
        </div>

        <div className="mt-3 text-[11px] font-extrabold tracking-[0.18em] text-cyan-600">
          NETTÓ 400–500.000 FT
        </div>
        <div className="mt-2 text-[22px] font-black leading-tight tracking-[-0.04em] text-slate-900">
          Raktáros
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
            📍
          </span>
          Budapest, IX. kerület
        </div>
      </div>
    </div>
  );
}

function HeroMainCard() {
  return (
    <div className="absolute left-[49%] top-[200px] z-40 w-[270px] -translate-x-1/2 rotate-[-1.5deg] transition duration-500 hover:z-[999] hover:-translate-y-2 hover:rotate-0 hover:scale-[1.02] sm:left-[54%] sm:w-[300px] lg:left-[220px] lg:top-[210px] lg:w-[340px] lg:translate-x-0">
      <div className="relative">
        <div className="absolute -inset-5 rounded-[40px] bg-cyan-200/25 blur-3xl" />
        <div className="relative overflow-hidden rounded-[28px] border border-white/90 bg-white/96 shadow-[0_34px_100px_rgba(15,23,42,0.16)] backdrop-blur-xl">
          <div className="relative h-40 w-full overflow-hidden lg:h-44">
            <Image
              src="/job-operator.jpg"
              alt="Betanított operátor"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
            <div className="absolute left-3 top-3 rounded-full border border-white/85 bg-white/90 px-2.5 py-1 text-[9px] font-extrabold tracking-[0.2em] text-slate-700 backdrop-blur">
              ÚJ KAMPÁNY
            </div>
          </div>

          <div className="border-b border-slate-100 px-4 py-2.5">
            <div className="text-[10px] font-extrabold tracking-[0.2em] text-cyan-600">
              NETTÓ 360–430.000 FT
            </div>
          </div>

          <div className="px-4 py-4">
            <h3 className="text-[20px] font-black leading-tight tracking-[-0.04em] text-slate-900 lg:text-[22px]">
              Betanított operátor
            </h3>
            <p className="mt-1.5 text-[13px] leading-5 text-slate-500">
              Prémium álláskártya és kampányra optimalizált jelentkezési flow.
            </p>

            <div className="mt-3 space-y-2.5 text-[13px]">
              <div className="flex items-center gap-2.5 text-slate-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-50 text-xs text-cyan-600">
                  📍
                </span>
                <span>Székesfehérvár</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-600">
                  ⏱
                </span>
                <span>Azonnali kezdés</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-xs text-emerald-600">
                  ⚡
                </span>
                <span>Gyors jelentkezés</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />
          <div className="grid grid-cols-2 gap-2 px-4 py-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center">
              <div className="text-lg font-black text-slate-900">23</div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                jelentkező
              </div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center">
              <div className="text-lg font-black text-emerald-600">Aktív</div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-emerald-500">
                kampány
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroStatsCard() {
  return (
    <div className="absolute right-[2%] top-[72px] z-30 hidden w-[230px] rotate-[4deg] opacity-80 transition duration-500 hover:-translate-y-2 hover:rotate-[2deg] hover:scale-[1.02] lg:block">
      <div className="rounded-[24px] border border-white/90 bg-white/92 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          jelentkezések
        </div>
        <div className="mt-2 text-[34px] font-black leading-none tracking-[-0.04em] text-slate-900">
          23
        </div>
        <div className="mt-3 h-2 rounded-full bg-slate-100">
          <div className="h-2 w-[72%] rounded-full bg-gradient-to-r from-cyan-500 to-sky-500" />
        </div>
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="text-xs font-black uppercase tracking-[0.14em] text-emerald-500">
            kampány
          </div>
          <div className="mt-1 text-xl font-black text-emerald-600">
            Meta + Google aktív
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowSection() {
  const steps = [
    {
      step: "1.",
      label: "Pozíció megadása",
      title: "Add meg a pozíciót",
      description: "Néhány alapadatból elindul a teljes recruitment folyamat.",
      variant: "admin" as const,
      featured: false,
    },
    {
      step: "2.",
      label: "Automatikus generálás",
      title: "Automatikus állásoldal",
      description:
        "A rendszer azonnal egy modern, konverzióra optimalizált megjelenést épít.",
      variant: "landing" as const,
      featured: true,
    },
    {
      step: "3.",
      label: "Hirdetés",
      title: "Kampányra kész kreatív",
      description:
        "A pozícióból figyelemfelkeltő, hirdetésben is jól működő megjelenés készül.",
      variant: "creative" as const,
      featured: false,
    },
    {
      step: "4.",
      label: "Eredmény",
      title: "Jelentkezők egy helyen",
      description:
        "A beérkező pályázókat gyorsan, átláthatóan és egy rendszerben kezeled.",
      variant: "results" as const,
      featured: false,
    },
  ];

  return (
    <section
      id="flow"
      className="relative z-10 mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:mt-20 lg:px-8"
    >
      <div className="text-center">
        <SectionTag text="Így lesz ebből toborzás" />
        <h2 className="mx-auto mt-4 max-w-4xl text-[30px] font-black leading-[1.05] tracking-[-0.04em] text-slate-900 sm:text-[40px] lg:text-[48px]">
          Így lesz az álláshirdetésből toborzási rendszer.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-7 text-slate-600 sm:text-[17px]">
          A Workzy nem csak közzéteszi a pozíciót, hanem végigépíti a teljes
          recruitment flow-t a létrehozástól a jelentkezők kezeléséig.
        </p>
      </div>

      <div className="relative mt-10 lg:mt-12">
        <div className="absolute left-1/2 top-[40%] h-[200px] w-[92%] max-w-[900px] -translate-x-1/2 rounded-full bg-cyan-200/15 blur-[100px]" />
        <div className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((item) => (
            <FlowCard
              key={item.step}
              step={item.step}
              label={item.label}
              title={item.title}
              description={item.description}
              variant={item.variant}
              featured={item.featured}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlowCard({
  step,
  label,
  title,
  description,
  variant,
  featured = false,
}: {
  step: string;
  label: string;
  title: string;
  description: string;
  variant: FlowVariant;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-[28px] border p-5 transition duration-300 hover:-translate-y-1 hover:scale-[1.01] sm:p-6 ${
        featured
          ? "z-10 border-sky-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(240,249,255,0.9))] shadow-[0_22px_56px_rgba(14,165,233,0.10)]"
          : "border-slate-200/80 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_46px_rgba(15,23,42,0.08)]"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
            featured
              ? "bg-sky-500 text-white shadow-sm shadow-sky-200"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {step}
        </div>
        <div
          className={`text-[11px] font-black uppercase tracking-widest ${
            featured ? "text-sky-600" : "text-slate-500"
          }`}
        >
          {label}
        </div>
      </div>

      <h3 className="mt-4 text-[21px] font-black leading-tight tracking-[-0.03em] text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{description}</p>

      <div className="mt-auto pt-5">
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
      <div className="border-b border-slate-200/60 bg-white px-4 py-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Új állás
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
          <div className="text-lg">💼</div>
          <div className="h-2 w-24 rounded-full bg-slate-200" />
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
          <div className="text-lg">📍</div>
          <div className="h-2 w-16 rounded-full bg-slate-200" />
        </div>
        <div className="mt-2 h-9 w-full rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 shadow-md" />
      </div>
    </div>
  );
}

function LandingFlowPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm ring-1 ring-sky-100/50">
      <div className="relative h-28">
        <Image
          src="/job-raktaros.jpg"
          alt="Landing preview"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <div className="text-[10px] font-black text-sky-300">
            NETTÓ 400.000 FT
          </div>
          <div className="mt-0.5 text-lg font-black text-white">Raktáros</div>
        </div>
      </div>
      <div className="space-y-2.5 p-4">
        <div className="flex gap-2">
          <div className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
            Azonnali kezdés
          </div>
          <div className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
            1 műszak
          </div>
        </div>
        <div className="h-2 w-[85%] rounded-full bg-slate-100" />
        <div className="h-2 w-[65%] rounded-full bg-slate-100" />
        <div className="mt-2 h-8 w-full rounded-xl bg-sky-500 shadow-sm shadow-sky-200" />
      </div>
    </div>
  );
}

function CreativeFlowPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
          f
        </div>
        <div className="text-[10px] font-bold text-slate-600">Szponzorált</div>
      </div>
      <div className="relative h-40">
        <Image
          src="/job-operator.jpg"
          alt="Creative preview"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-900/40 to-transparent" />
        <div className="absolute left-3 right-3 top-3 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur-md">
          <div className="text-[10px] font-bold text-slate-500">KERESÜNK</div>
          <div className="text-sm font-black text-slate-900">
            Betanított operátor
          </div>
          <div className="mt-1 text-xs font-bold text-sky-600">
            Nettó 430.000 Ft-ig
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsFlowPreview() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-500">Új jelentkezők</div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
            <span>+12</span>
            <span className="text-[16px]">↑</span>
          </div>
        </div>
        <div className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          23
        </div>
      </div>

      {["Kovács Péter", "Nagy Anna"].map((name, index) => (
        <div
          key={name}
          className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm">
              {index === 0 ? "👨‍🔧" : "👩‍🔧"}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{name}</div>
              <div className="text-[10px] font-medium text-slate-500">
                {index === 0 ? "2 perce jelentkezett" : "1 órája jelentkezett"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScreenShowcase({
  title,
  text,
  image,
  reverse = false,
  badge,
  eyebrow,
}: {
  title: string;
  text: string;
  image: string;
  reverse?: boolean;
  badge: string;
  eyebrow: string;
}) {
  return (
    <div
      className={`grid items-center gap-10 rounded-[36px] border border-white/85 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-8 lg:p-10 ${
        reverse ? "lg:grid-cols-[1.05fr_0.95fr]" : "lg:grid-cols-[0.95fr_1.05fr]"
      }`}
    >
      <div className={reverse ? "lg:order-2" : ""}>
        <SectionTag text={badge} />
        <div className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-cyan-600">
          {eyebrow}
        </div>
        <h3 className="mt-3 text-[30px] font-black leading-[1] tracking-[-0.05em] text-slate-900 sm:text-[38px] lg:text-[46px]">
          {title}
        </h3>
        <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
          {text}
        </p>
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

          <div className="relative h-[280px] sm:h-[380px] lg:h-[420px]">
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
      className={`rounded-[30px] border p-6 shadow-[0_22px_56px_rgba(15,23,42,0.07)] backdrop-blur-xl sm:p-8 ${
        good
          ? "border-cyan-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(240,249,255,0.92))]"
          : "border-white/85 bg-white/84"
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
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
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
      className={`relative rounded-[32px] border p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 sm:p-8 ${
        featured
          ? "border-cyan-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(240,249,255,0.92))]"
          : "border-white/85 bg-white/84"
      }`}
    >
      {featured && (
        <div className="mb-5 inline-flex rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_26px_rgba(14,165,233,0.25)] sm:absolute sm:right-6 sm:top-6 sm:mb-0">
          Ajánlott
        </div>
      )}

      <h3 className="text-[28px] font-black tracking-[-0.04em] text-slate-900">
        {title}
      </h3>
      <div className="mt-4 text-[38px] font-black leading-none tracking-[-0.05em] text-slate-900 lg:text-[46px]">
        {price}
      </div>
      <p className="mt-4 text-[15px] leading-7 text-slate-600">{text}</p>

      <div className="mt-6 space-y-3">
        {points.map((point) => (
          <div key={point} className="flex items-start gap-3 text-sm text-slate-700">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
              ✓
            </span>
            <span>{point}</span>
          </div>
        ))}
      </div>

      <Link
        href="/hire"
        className={`mt-8 inline-flex w-full items-center justify-center rounded-2xl px-5 py-4 text-sm font-semibold transition ${
          featured
            ? "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 text-white shadow-[0_16px_38px_rgba(14,165,233,0.24)] hover:-translate-y-0.5"
            : "border border-white/90 bg-white/86 text-slate-800 shadow-[0_12px_28px_rgba(15,23,42,0.05)] hover:bg-white"
        }`}
      >
        Ezt választom
      </Link>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
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
    <footer className="relative z-10 mt-20 border-t border-white/70 lg:mt-24">
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

          {[
            ["Termék", ["Állásoldalak", "Kampányindítás", "Automatikus kreatív", "Jelentkezési flow"]],
            ["Cég", ["Rólunk", "Kapcsolat", "Partnerek", "Blog"]],
            ["Jogi", ["ÁSZF", "Adatkezelés", "Cookie tájékoztató"]],
          ].map(([title, items]) => (
            <div key={title as string}>
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-900">
                {title as string}
              </h3>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                {(items as string[]).map((item) => (
                  <div key={item}>{item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/70 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>© 2026 Workzy. Minden jog fenntartva.</div>
          <div>AI-alapú toborzási rendszer</div>
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
        <div className="absolute inset-0 bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.03]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(255,255,255,0.72))]" />
      </div>

      <Header />

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-7 sm:px-6 lg:px-8 lg:pb-14 lg:pt-9">
        <div className="grid items-center gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:gap-12">
          <div className="max-w-2xl">
            <SectionTag text="5 jelentkezőig ingyenes" />

            <h1 className="mt-5 text-[42px] font-black leading-[1.02] tracking-[-0.055em] text-slate-900 sm:text-[54px] md:text-[64px] lg:text-[72px]">
              Egy állásból
              <br />
              <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-400 bg-clip-text text-transparent">
                komplett toborzás.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-[17px] leading-7 text-slate-600 sm:text-[19px] sm:leading-8">
              Add meg a pozíciót, a Workzy pedig felépíti hozzá a megjelenést, a
              kampánylogikát és a jelentkezési flow-t.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/hire"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-7 py-4 text-[15px] font-bold text-white shadow-[0_16px_36px_rgba(14,165,233,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(14,165,233,0.28)]"
              >
                <span className="absolute -inset-6 rounded-[34px] bg-cyan-300/24 blur-2xl opacity-70" />
                <span className="absolute inset-0 bg-white/10 opacity-0 transition duration-300 group-hover:opacity-100" />
                <span className="relative">Ingyenes állásfeladás →</span>
              </Link>

              <a
                href="#flow"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200/70 bg-white/72 px-7 py-4 text-[15px] font-bold text-slate-700 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-slate-900"
              >
                ▶ Megnézem a működését
              </a>
            </div>

            <div className="mt-6 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              <HeroFeature value="1 perc" label="kampányra kész" featured />
              <HeroFeature value="AI" label="automatikus kreatív" />
              <HeroFeature value="Meta + Google" label="egy rendszerben" />
            </div>
          </div>

          <div className="relative min-h-[400px] sm:min-h-[520px] lg:min-h-[650px]">
            <div className="absolute left-1/2 top-1/2 h-[460px] w-[90%] max-w-[660px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/20 blur-[140px] lg:left-[58%] lg:h-[580px] lg:w-[740px]" />
            <div className="absolute left-1/2 top-1/2 h-[380px] w-[80%] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/75 blur-[100px] lg:left-[58%] lg:h-[480px] lg:w-[620px]" />

            <BrowserPreview />

            <div className="hidden lg:block">
              <HeroSideCard />
              <HeroMainCard />
              <HeroStatsCard />
            </div>
          </div>
        </div>
      </section>

      <FlowSection />

      <section
        id="screens"
        className="relative z-10 mx-auto mt-20 max-w-7xl space-y-8 px-4 sm:px-6 lg:mt-24 lg:px-8"
      >
        <ScreenShowcase
          badge="Admin nézet"
          eyebrow="AUTOMATIKUS GENERÁLÁS"
          title="A pozícióból nem adatlap lesz, hanem rendszer"
          text="A Workzy strukturáltan építi fel az állást, hogy abból ne csak egy hirdetés, hanem egy használható recruitment flow induljon."
          image="/job-raktaros.jpg"
        />

        <ScreenShowcase
          badge="Kész állásoldal"
          eyebrow="PRÉMIUM MEGJELENÉS"
          title="Prémium állásoldal, jobb első benyomással"
          text="A pozíció nem vész el egy listában. Önálló, erős megjelenést kap, amely jobban kommunikálja az ajánlatot és könnyebben viszi tovább a jelentkezőt."
          image="/job-operator.jpg"
          reverse
        />

        <ScreenShowcase
          badge="Kampányra kész kreatív"
          eyebrow="HIRDETÉSI LOGIKA"
          title="A hirdetés logikája is összeáll"
          text="A Workzy úgy építi fel a megjelenést, hogy az ne csak szép legyen, hanem kampányban is jobban működjön."
          image="/job-gepkezelo.jpg"
        />
      </section>

      <section
        id="why-better"
        className="relative z-10 mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:mt-24 lg:px-8"
      >
        <div className="text-center">
          <SectionTag text="Miért jobb, mint egy sima álláshirdetés?" />
          <h2 className="mx-auto mt-6 max-w-4xl text-[34px] font-black leading-[1] tracking-[-0.05em] text-slate-900 sm:text-[44px] lg:text-[52px]">
            Nem csak szebb. Több jelentkezőt is hozhat.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <CompareCard
            title="Sima álláshirdetés"
            points={[
              "Gyenge első benyomás, sablonos megjelenés",
              "A bér és az ajánlat gyakran nem kap elég hangsúlyt",
              "Kampányban nehezebben kommunikálható",
              "A jelentkezési út gyakran szétesik",
            ]}
          />
          <CompareCard
            title="Workzy megjelenés"
            good
            points={[
              "Erősebb vizuális megjelenés és jobb first impression",
              "A pozíció, bér és előnyök jobban kiemelhetők",
              "Landing + kreatív + jelentkezési flow egy rendszerben",
              "Kampányra alkalmasabb, modernebb recruitment logika",
            ]}
          />
        </div>
      </section>

      <section
        id="pricing"
        className="relative z-10 mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:mt-24 lg:px-8"
      >
        <div className="text-center">
          <SectionTag text="Árak" />
          <h2 className="mx-auto mt-6 max-w-4xl text-[34px] font-black leading-[1] tracking-[-0.05em] text-slate-900 sm:text-[44px] lg:text-[52px]">
            Kezdd ingyen. Akkor fizess, amikor jönnek a jelentkezők.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <PriceCard
            title="Start"
            price="0 Ft"
            text="Kezdd el kockázat nélkül. Az első jelentkezőkig kipróbálhatod a rendszert."
            points={[
              "Állásoldal létrehozása",
              "Alap recruitment flow",
              "5 jelentkezőig ingyenes",
              "Gyors indulás",
            ]}
          />
          <PriceCard
            title="Growth"
            price="Prémium"
            featured
            text="Azoknak, akik erősebb megjelenést és kampányra kész recruitment rendszert akarnak."
            points={[
              "Prémium állásoldal",
              "Kampánybarát megjelenés",
              "AI kreatív logika",
              "Meta + Google alap",
            ]}
          />
          <PriceCard
            title="Custom"
            price="Egyedi"
            text="Több pozícióhoz, nagyobb volumenhez vagy testreszabott működéshez."
            points={[
              "Egyedi workflow",
              "Összetettebb kampánylogika",
              "Csapat- és partnerkezelés",
              "Testreszabott megjelenés",
            ]}
          />
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:mt-24 lg:px-8">
        <div className="rounded-[38px] border border-white/85 bg-white/80 p-6 shadow-[0_26px_70px_rgba(15,23,42,0.07)] backdrop-blur-xl sm:p-8 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <SectionTag text="Demo / kapcsolat" />
              <h2 className="mt-6 text-[34px] font-black leading-[1] tracking-[-0.05em] text-slate-900 sm:text-[44px] lg:text-[52px]">
                Nézd meg, hogyan nézne ki nálad ugyanez.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Ha szeretnéd, megmutatjuk, hogyan lehet a mostani állásfeladási
                folyamatodból egy erősebb, modernebb recruitment megjelenést építeni.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/hire"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-8 py-5 text-lg font-semibold text-white shadow-[0_18px_42px_rgba(14,165,233,0.24)] transition hover:-translate-y-0.5"
                >
                  Demót kérek
                </Link>

                <Link
                  href="/admin/login"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/90 bg-white/86 px-8 py-5 text-lg font-semibold text-slate-800 shadow-[0_14px_30px_rgba(15,23,42,0.05)] transition hover:bg-white"
                >
                  Kapcsolat
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Gyors indulás", "1 pozícióból indulhatsz"],
                ["Kampánybarát", "Meta + Google logika"],
                ["Megjelenés", "Prémium állásoldal"],
                ["Egyszerűség", "1 rendszerben kezelve"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[24px] border border-white/85 bg-white/88 p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)]"
                >
                  <div className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                    {label}
                  </div>
                  <div className="mt-3 text-2xl font-black tracking-[-0.04em] text-slate-900">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="relative z-10 mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:mt-24 lg:px-8"
      >
        <div className="text-center">
          <SectionTag text="GYIK" />
          <h2 className="mx-auto mt-6 max-w-4xl text-[34px] font-black leading-[1] tracking-[-0.05em] text-slate-900 sm:text-[44px] lg:text-[52px]">
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