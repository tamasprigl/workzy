import Link from "next/link";

const stats = [
  {
    title: "Összes jelentkező",
    value: "1,248",
    change: "+12% a héten",
    changeType: "positive",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    iconColor: "text-sky-300",
  },
  {
    title: "Aktív állások",
    value: "24",
    change: "Változatlan",
    changeType: "neutral",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 12h.01" />
        <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <path d="M22 13v-6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6" />
        <path d="M2 13 4 20h16l2-7" />
      </svg>
    ),
    iconColor: "text-violet-200",
  },
  {
    title: "Havi bevétel",
    value: "2.4M Ft",
    change: "+18% az előző hónaphoz",
    changeType: "positive",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    iconColor: "text-emerald-200",
  },
  {
    title: "Sikeres közvetítés",
    value: "156",
    change: "+5 ezen a héten",
    changeType: "positive",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    iconColor: "text-pink-200",
  },
];

const recentApplicants = [
  { name: "Kovács Péter", job: "Teherautó szerelő", time: "2 órája", status: "Új" },
  { name: "Nagy Anna", job: "Gépkezelő", time: "5 órája", status: "Új" },
  { name: "Szabó Tamás", job: "Raktáros", time: "1 napja", status: "Feldolgozás alatt" },
];

function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
  iconColor,
}: {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "neutral";
  icon: React.ReactNode;
  iconColor: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-9 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className={`absolute right-8 top-8 opacity-90 ${iconColor}`}>{icon}</div>

      <p className="mb-4 text-[18px] font-medium text-slate-500">{title}</p>
      <p className="text-6xl font-semibold tracking-tight text-slate-950">{value}</p>

      <div className="mt-8">
        <span
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${
            changeType === "positive"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {changeType === "positive" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 16 4 4 4-4" />
              <path d="M7 20V4" />
              <path d="m21 8-4-4-4 4" />
              <path d="M17 4v16" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" x2="19" y1="12" y2="12" />
            </svg>
          )}
          {change}
        </span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-12">
      <section>
        <p className="text-lg font-medium text-slate-400">Workzy Admin</p>
        <h2 className="mt-2 text-6xl font-semibold tracking-tight text-slate-950">
          Álláskezelés és kampányindítás
        </h2>
        <p className="mt-6 text-2xl text-slate-500">
          Üdvözöljük a Workzy adminisztrációs felületén.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-4 md:grid-cols-2">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType as "positive" | "neutral"}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </section>

      <section>
        <h2 className="mb-8 text-5xl font-semibold tracking-tight text-slate-950">
          Gyorselérés & Újdonságok
        </h2>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.08fr_1fr]">
          <Link href="/admin/jobs/new" className="group block h-full">
            <div className="relative flex min-h-[360px] h-full flex-col justify-between overflow-hidden rounded-[32px] border border-indigo-200 bg-gradient-to-br from-indigo-100 via-indigo-50 to-white p-12 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_30%)]" />
              <div className="absolute -bottom-6 -right-2 text-indigo-300/80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="140"
                  height="140"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              </div>

              <div className="relative z-10 max-w-2xl">
                <h3 className="text-6xl font-semibold tracking-tight text-slate-950">
                  Új állás meghirdetése
                </h3>
                <p className="mt-8 max-w-xl text-2xl leading-relaxed text-slate-600">
                  Töltsd ki az űrlapot és indítsd el a kampányt másodpercek alatt az AI
                  asszisztens segítségével.
                </p>
              </div>

              <div className="relative z-10 mt-10">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-sm transition group-hover:bg-blue-500">
                  Állás rögzítése
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          <div className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <h3 className="mb-8 text-5xl font-semibold tracking-tight text-slate-950">
              Legutóbbi jelentkezések
            </h3>

            <div className="space-y-4">
              {recentApplicants.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-[24px] border border-slate-100 px-5 py-5 transition hover:border-slate-200 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl font-semibold text-slate-700">
                      {item.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>

                    <div>
                      <p className="text-2xl font-medium text-slate-900">{item.name}</p>
                      <p className="mt-1 text-lg text-slate-500">
                        {item.job} • {item.time}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex rounded-xl px-4 py-2 text-lg font-medium ${
                      item.status === "Új"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/admin/applications"
              className="mt-8 block text-center text-lg font-medium text-slate-500 transition hover:text-slate-900"
            >
              Minden jelentkezés megtekintése →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}