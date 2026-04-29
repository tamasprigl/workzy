import React from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type IconName =
  | "bolt"
  | "target"
  | "shield"
  | "users"
  | "clock"
  | "file"
  | "trend"
  | "building"
  | "check"
  | "briefcase"
  | "globe"
  | "home"
  | "search"
  | "handshake"
  | "headset"
  | "chart"
  | "phone"
  | "rocket";

const theme = {
  navy: "#071b3d",
  blue: "#075cab",
  light: "#f8fbff",
  softBlue: "#eaf3ff",
  border: "#dbeafe",
};

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const props = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<IconName, React.ReactNode> = {
    bolt: <path d="M13 2L4 14h7l-1 8 10-13h-7V2z" />,
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" />
      </>
    ),
    shield: <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />,
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7.5" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.8" />
        <path d="M16 3.2a4 4 0 0 1 0 7.6" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8M8 17h6" />
      </>
    ),
    trend: (
      <>
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M14 7h7v7" />
      </>
    ),
    building: (
      <>
        <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
        <path d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 12.5l2.2 2.2 4.8-5.2" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
        <path d="M3 12h18" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c3 3 3 15 0 18" />
        <path d="M12 3c-3 3-3 15 0 18" />
      </>
    ),
    home: (
      <>
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v11h14V10" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M16 16l5 5" />
      </>
    ),
    handshake: (
      <>
        <path d="M7 12L3 9l4-5 4 3" />
        <path d="M17 12l4-3-4-5-4 3" />
        <path d="M8 12l3-3 5 5a2 2 0 0 1-3 3l-1-1" />
        <path d="M9 15l2 2a2 2 0 0 0 3 0" />
      </>
    ),
    headset: (
      <>
        <path d="M4 13a8 8 0 0 1 16 0" />
        <path d="M4 13v4a2 2 0 0 0 2 2h2v-6H6a2 2 0 0 0-2 2" />
        <path d="M20 13v4a2 2 0 0 1-2 2h-2v-6h2a2 2 0 0 1 2 2" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V4" />
        <path d="M4 20h16" />
        <path d="M8 16v-4M12 16V8M16 16v-7" />
        <path d="M7 9l4-4 4 3 4-5" />
      </>
    ),
    phone: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L9 10.6a16 16 0 0 0 4.4 4.4l1.2-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
    ),
    rocket: (
      <>
        <path d="M12 15l-3-3c1-5 4-8 10-9-1 6-4 9-9 10z" />
        <path d="M9 12H5l-2 4 5-1" />
        <path d="M12 15v4l-4 2 1-5" />
        <circle cx="16" cy="8" r="1.5" />
      </>
    ),
  };

  return <svg {...props}>{paths[name]}</svg>;
}

function Slide({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <section className="slide relative mx-auto mb-8 overflow-hidden bg-white shadow-xl print:mb-0 print:shadow-none">
      <div className="absolute left-8 top-8 z-30 flex h-9 w-9 items-center justify-center rounded-lg bg-[#071b3d] text-lg font-black text-white shadow-md">
        {n}
      </div>
      {children}
    </section>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${light ? "text-white" : "text-[#071b3d]"}`}>
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-md text-lg font-black ${
          light ? "bg-white text-[#075cab]" : "bg-[#071b3d] text-white"
        }`}
      >
        M
      </div>
      <div className="text-sm font-black">MÁDA PLUSZ KFT.</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center text-[42px] font-black leading-[1.12] text-[#071b3d]">
      {children}
    </h2>
  );
}

function CheckLine({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base font-black ${
          light ? "bg-white text-[#075cab]" : "bg-[#075cab] text-white"
        }`}
      >
        ✓
      </span>
      <span className={`text-[19px] font-bold leading-snug ${light ? "text-white" : "text-slate-700"}`}>
        {children}
      </span>
    </div>
  );
}

function Feature({ icon, title }: { icon: IconName; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon name={icon} className="h-7 w-7 text-[#075cab]" />
      <span className="text-[15px] font-black leading-tight text-[#071b3d]">{title}</span>
    </div>
  );
}

function BackgroundGlow() {
  return (
    <>
      <div className="absolute inset-0 bg-[#f8fbff]" />
      <div className="absolute left-[-120px] top-[-120px] h-[340px] w-[340px] rounded-full bg-[#075cab]/10 blur-3xl" />
      <div className="absolute bottom-[-140px] right-[-120px] h-[360px] w-[360px] rounded-full bg-[#071b3d]/8 blur-3xl" />
    </>
  );
}

function ServiceCard({
  icon,
  title,
  desc,
}: {
  icon: IconName;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex h-[176px] min-w-0 gap-5 rounded-2xl border border-[#dbeafe] bg-white p-6 shadow-[0_12px_35px_rgba(7,27,61,0.08)]">
      <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-xl bg-[#075cab] text-white">
        <Icon name={icon} className="h-7 w-7" />
      </div>

      <div className="min-w-0">
        <h3 className="mb-2 break-words text-[18px] font-black leading-[1.15] text-[#071b3d]">
          {title}
        </h3>
        <p className="text-[13px] font-semibold leading-[1.38] text-slate-500">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function MadaPluszBemutatkozo() {
  const services = [
    {
      icon: "users" as IconName,
      title: "Munkaerő-kölcsönzés",
      desc: "Rugalmas, gyorsan skálázható létszámmegoldás átmeneti vagy tartós igényekre.",
    },
    {
      icon: "target" as IconName,
      title: "Munkaerő-közvetítés",
      desc: "Megfelelő jelölt, célzott előszűréssel, gyors és hatékony kiválasztással.",
    },
    {
      icon: "search" as IconName,
      title: "Executive Search",
      desc: "Kulcspozíciók precíz, diszkrét és szakmai fókuszú betöltése.",
    },
    {
      icon: "file" as IconName,
      title: "Bérszámfejtés & HR admin",
      desc: "Adminisztrációs és munkaügyi terhek biztonságos átvállalása.",
    },
    {
      icon: "chart" as IconName,
      title: "Szervezetfejlesztés",
      desc: "Hatékonyabb működés, jobb folyamatok és erősebb csapat.",
    },
    {
      icon: "headset" as IconName,
      title: "Operatív támogatás",
      desc: "Folyamatos kapcsolattartás, gyors reakció és stabil háttér.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 py-8 font-sans text-slate-900 print:bg-white print:py-0">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @page { size: A4 landscape; margin: 0; }

            .slide {
              width: 1123px;
              height: 794px;
            }

            * {
              box-sizing: border-box;
              letter-spacing: normal !important;
              word-spacing: normal !important;
              text-rendering: geometricPrecision;
            }

            @media print {
              html, body {
                width: 297mm;
                height: 210mm;
                background: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              header, nav, footer, .navbar, .footer, [data-testid="navbar"], [data-testid="footer"] {
                display: none !important;
              }

              .slide {
                width: 297mm !important;
                height: 210mm !important;
                break-after: page;
                page-break-after: always;
              }
            }
          `,
        }}
      />

      <div className="flex flex-col items-center print:block">
        {/* 1 */}
        <Slide n={1}>
          <img src="/m1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071b3d]/10 via-transparent to-transparent" />

          <div className="relative z-10 flex h-full flex-col justify-between p-[74px]">
            <div className="max-w-[550px] pt-8">
              <div className="mb-6 inline-flex rounded-full bg-[#075cab]/10 px-5 py-2 text-sm font-black uppercase text-[#075cab]">
                Máda Plusz Kft.
              </div>
              <h1 className="mb-7 text-[62px] font-black leading-[1.02] text-[#071b3d]">
                Az Ön
                <br />
                stratégiai
                <br />
                HR partnere
              </h1>
              <p className="max-w-[520px] text-[21px] font-semibold leading-[1.45] text-slate-600">
                Megoldások a munkaerőpiaci kihívásokra – gyorsan, hatékonyan,
                kiszámíthatóan.
              </p>
            </div>

            <div>
              <div className="mb-10 grid max-w-[610px] grid-cols-3 gap-8">
                <Feature icon="bolt" title="Gyors reakció" />
                <Feature icon="target" title="Hatékony megoldások" />
                <Feature icon="shield" title="Kiszámítható eredmények" />
              </div>
              <Logo />
            </div>
          </div>
        </Slide>

        {/* 2 */}
        <Slide n={2}>
          <BackgroundGlow />

          <div className="relative z-10 h-full p-[72px]">
            <SectionTitle>Ismerős kihívások?</SectionTitle>
            <p className="mt-4 text-center text-[19px] font-semibold text-slate-500">
              A mai munkaerőpiacon a cégek folyamatos nyomás alatt működnek.
            </p>

            <div className="mx-auto mt-[58px] grid max-w-[860px] grid-cols-2 gap-x-20 gap-y-12">
              {[
                { icon: "users" as IconName, title: "Munkaerőhiány", desc: "kritikus pozíciókban" },
                { icon: "clock" as IconName, title: "Lassú és", desc: "bizonytalan toborzás" },
                { icon: "file" as IconName, title: "Növekvő", desc: "adminisztrációs terhek" },
                { icon: "trend" as IconName, title: "Magas fluktuáció", desc: "és alacsony megtartás" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-6 rounded-2xl border border-[#dbeafe] bg-white/90 p-6 shadow-[0_12px_40px_rgba(7,27,61,0.08)] backdrop-blur">
                  <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-[#eaf3ff] text-[#075cab]">
                    <Icon name={item.icon} className="h-9 w-9" />
                  </div>
                  <div>
                    <h3 className="text-[21px] font-black leading-[1.25] text-[#071b3d]">{item.title}</h3>
                    <p className="text-[18px] font-bold leading-[1.25] text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-[52px] max-w-[860px] rounded-xl bg-[#075cab] px-8 py-5 text-center text-[18px] font-bold text-white shadow-[0_14px_35px_rgba(7,92,171,0.22)]">
              Eredmény: kieső termelés • növekvő költségek • instabil működés
            </div>
          </div>
        </Slide>

        {/* 3 */}
        <Slide n={3}>
          <BackgroundGlow />

          <div className="absolute right-[72px] top-[100px] h-[470px] w-[390px] rounded-[34px] border border-[#dbeafe] bg-white/90 shadow-2xl backdrop-blur">
            <div className="m-7 rounded-[24px] bg-[#075cab] p-8 text-white shadow-[0_16px_40px_rgba(7,92,171,0.22)]">
              <Icon name="handshake" className="mb-8 h-16 w-16" />
              <div className="text-2xl font-black leading-tight">Stratégiai HR támogatás</div>
            </div>
            <div className="px-8 pt-4">
              <div className="mb-5 h-6 rounded-full bg-[#eaf3ff]" />
              <div className="mb-5 h-6 w-[80%] rounded-full bg-[#eaf3ff]" />
              <div className="h-6 w-[90%] rounded-full bg-[#eaf3ff]" />
            </div>
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between p-[72px]">
            <div className="max-w-[620px]">
              <h2 className="mb-6 text-[43px] font-black leading-[1.15] text-[#071b3d]">
                Több mint HR szolgáltató –
                <br />
                stratégiai partner
              </h2>
              <p className="mb-9 max-w-[570px] text-[19px] font-semibold leading-[1.55] text-slate-600">
                A Máda Plusz nem egyszerű közvetítő, hanem teljes körű HR megoldás,
                amely leveszi a terhet a vállalat válláról.
              </p>

              <div className="space-y-5">
                <CheckLine>Komplett HR támogatás egy kézből</CheckLine>
                <CheckLine>Saját állományra épülő működés</CheckLine>
                <CheckLine>Dedikált szakértői csapat</CheckLine>
                <CheckLine>Stabil és gyorsan skálázható rendszer</CheckLine>
              </div>
            </div>

            <div className="w-[620px] rounded-xl bg-[#075cab] px-8 py-5 text-[21px] font-black text-white shadow-[0_14px_35px_rgba(7,92,171,0.22)]">
              Fókusz: eredmény, nem adminisztráció
            </div>
          </div>
        </Slide>

        {/* 4 */}
        <Slide n={4}>
          <BackgroundGlow />

          <div className="relative z-10 flex h-full flex-col justify-between p-[72px]">
            <SectionTitle>Ami valódi különbséget jelent</SectionTitle>

            <div className="grid grid-cols-4 gap-5">
              {[
                { icon: "users" as IconName, big: "150–200", title: "fős saját állomány", desc: "azonnali rendelkezésre állás" },
                { icon: "building" as IconName, big: "KKV +", title: "nagyvállalati tapasztalat", desc: "rugalmas működés minden helyzetben" },
                { icon: "file" as IconName, big: "Teljes", title: "tehermentesítés", desc: "Ön a core business-re fókuszál" },
                { icon: "target" as IconName, big: "Egyedi", title: "megoldások", desc: "nincs sablon, csak működő stratégia" },
              ].map((item) => (
                <div key={item.big} className="rounded-2xl border border-[#dbeafe] bg-white/90 p-7 text-center shadow-[0_12px_40px_rgba(7,27,61,0.08)] backdrop-blur">
                  <div className="mx-auto mb-6 flex h-[78px] w-[78px] items-center justify-center rounded-full bg-[#eaf3ff] text-[#075cab]">
                    <Icon name={item.icon} className="h-11 w-11" />
                  </div>
                  <div className="mb-2 text-[34px] font-black leading-[1.1] text-[#071b3d]">{item.big}</div>
                  <div className="mx-auto mb-5 text-[21px] font-black leading-[1.25] text-[#071b3d]">
                    {item.title}
                  </div>
                  <p className="text-[14px] font-semibold leading-[1.45] text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>

            <Logo />
          </div>
        </Slide>

        {/* 5 */}
        <Slide n={5}>
          <BackgroundGlow />

          <div className="relative z-10 flex h-full flex-col p-[64px]">
            <SectionTitle>Teljes HR ökoszisztéma</SectionTitle>

            <div className="mt-[38px] grid grid-cols-3 gap-5">
              {services.map((service) => (
                <ServiceCard
                  key={service.title}
                  icon={service.icon}
                  title={service.title}
                  desc={service.desc}
                />
              ))}
            </div>

            <div className="mt-auto flex justify-center pt-5">
              <Logo />
            </div>
          </div>
        </Slide>

        {/* 6 */}
        <Slide n={6}>
          <img src="/m3.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071b3d]/92 via-[#071b3d]/75 to-[#071b3d]/20" />

          <div className="relative z-10 grid h-full grid-cols-[48%_52%] items-center p-[72px] text-white">
            <div>
              <div className="mb-4 text-sm font-black uppercase tracking-wide text-[#b9e9ff]">
                Határokon átívelő megoldások
              </div>
              <h2 className="mb-10 text-[48px] font-black leading-[1.08]">
                Munkaerő
                <br />
                határok nélkül
              </h2>

              <div className="space-y-5">
                {[
                  { icon: "globe" as IconName, text: "Nemzetközi toborzás" },
                  { icon: "home" as IconName, text: "Szállás biztosítása" },
                  { icon: "briefcase" as IconName, text: "Utaztatás szervezése" },
                  { icon: "check" as IconName, text: "Teljes relokációs ügyintézés" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
                      <Icon name={item.icon} className="h-6 w-6" />
                    </div>
                    <span className="text-[19px] font-bold">{item.text}</span>
                  </div>
                ))}
              </div>

              <p className="mt-14 text-[24px] font-black leading-[1.25] text-[#b9e9ff]">
                Ön csak a munkára koncentrál –
                <br />
                mi működtetjük a hátteret.
              </p>
            </div>
          </div>
        </Slide>

        {/* 7 */}
        <Slide n={7}>
          <BackgroundGlow />

          <div className="relative z-10 flex h-full flex-col justify-between p-[72px]">
            <SectionTitle>Egyszerű, átlátható folyamat</SectionTitle>

            <div className="relative grid grid-cols-5 gap-4">
              <div className="absolute left-[9%] right-[9%] top-[56px] h-[3px] bg-[#dbeafe]" />
              {[
                { icon: "search" as IconName, title: "Igényfelmérés" },
                { icon: "file" as IconName, title: "Egyedi ajánlat" },
                { icon: "handshake" as IconName, title: "Szerződés" },
                { icon: "users" as IconName, title: "Toborzás" },
                { icon: "headset" as IconName, title: "Operatív támogatás" },
              ].map((step) => (
                <div key={step.title} className="relative text-center">
                  <div className="mx-auto mb-6 flex h-[112px] w-[112px] items-center justify-center rounded-full border-[3px] border-[#dbeafe] bg-white text-[#075cab] shadow-lg">
                    <Icon name={step.icon} className="h-12 w-12" />
                  </div>
                  <h3 className="text-[19px] font-black leading-[1.25] text-[#071b3d]">{step.title}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-8 text-center">
              {["Gyors indulás", "Folyamatos kommunikáció", "Teljes kontroll"].map((item) => (
                <div key={item} className="flex items-center justify-center gap-3 text-[17px] font-bold text-slate-600">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#075cab] text-[#075cab]">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Slide>

        {/* 8 */}
        <Slide n={8}>
          <img src="/m4.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/20" />

          <div className="relative z-10 grid h-full grid-cols-[58%_42%] items-center p-[72px]">
            <div>
              <h2 className="mb-10 text-[43px] font-black leading-[1.15] text-[#071b3d]">
                Üzleti előnyök röviden
              </h2>

              <div className="space-y-6">
                <CheckLine>Adminisztrációmentes működés</CheckLine>
                <CheckLine>Gyorsan skálázható kapacitás</CheckLine>
                <CheckLine>Fókusz a megtartáson, nem csak a felvételen</CheckLine>
                <CheckLine>Stabil, hosszú távú partnerség</CheckLine>
              </div>

              <p className="mt-14 text-[24px] font-black leading-[1.25] text-[#075cab]">
                Nem csak megoldjuk – optimalizáljuk is
                <br />
                a működését.
              </p>
            </div>
          </div>
        </Slide>

        {/* 9 */}
        <Slide n={9}>
          <img src="/m2.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/88 to-white/10" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="grid flex-1 grid-cols-[58%_42%] items-center px-[72px] pb-8 pt-[92px]">
              <div>
                <h2 className="mb-7 text-[43px] font-black leading-[1.15] text-[#071b3d]">
                  Vegye fel velünk
                  <br />
                  a kapcsolatot!
                </h2>
                <p className="mb-9 max-w-[540px] text-[19px] font-semibold leading-[1.55] text-slate-600">
                  Ne hagyja, hogy a munkaerőhiány visszafogja a növekedést.
                  Beszéljük át, és találjuk meg a legjobb megoldást az Ön vállalkozására.
                </p>

                <div className="grid max-w-[560px] grid-cols-3 gap-6 pt-4">
                  {[
                    { icon: "phone" as IconName, title: "Gyors konzultáció" },
                    { icon: "target" as IconName, title: "Egyedi megoldás" },
                    { icon: "rocket" as IconName, title: "Azonnali lépések" },
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-[#dbeafe] bg-white/80 p-5 text-center shadow-md backdrop-blur">
                      <Icon name={item.icon} className="mx-auto mb-3 h-8 w-8 text-[#075cab]" />
                      <p className="text-[14px] font-black leading-[1.25] text-[#071b3d]">{item.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#075cab] px-[72px] py-7 text-white">
              <Logo light />
              <div className="text-[17px] font-bold">Az Ön stratégiai HR partnere.</div>
            </div>
          </div>
        </Slide>
      </div>
    </main>
  );
}