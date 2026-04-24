import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f7f9] text-slate-900">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}} />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#f4f7f9]" />
        <div className="absolute left-[-120px] top-[-100px] h-[320px] w-[320px] rounded-full bg-cyan-200/20 blur-[80px]" />
        <div className="absolute right-[-120px] top-[40px] h-[340px] w-[340px] rounded-full bg-sky-200/15 blur-[90px]" />
        <div className="absolute bottom-[-140px] left-[35%] h-[320px] w-[320px] rounded-full bg-emerald-100/15 blur-[90px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(255,255,255,0.70))]" />
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_70%_50%,rgba(2,6,23,0.06),transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <div className="rounded-[24px] border border-white/80 bg-white/78 px-4 py-3 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-5">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex shrink-0 items-center">
                <Image
                  src="/logo.png"
                  alt="Workzy"
                  width={120}
                  height={36}
                  className="h-auto w-auto"
                  priority
                />
              </Link>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="inline-flex rounded-xl border border-white/90 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_10px_26px_rgba(15,23,42,0.05)] transition hover:bg-white"
                >
                  Vissza a főoldalra
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full flex-col gap-10 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div className="relative text-center lg:text-left">
              <div className="absolute -inset-20 -z-10 hidden rounded-full bg-gradient-to-r from-sky-200/40 to-blue-200/20 blur-2xl lg:block" />
              <div className="absolute -left-10 -top-10 -z-10 h-[400px] w-[400px] animate-[float_8s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-sky-200 via-blue-200 to-indigo-200 opacity-15 blur-xl" />
              
              <div className="relative mx-auto max-w-lg lg:mx-0">
                <div className="absolute -inset-10 -z-10 rounded-[32px] bg-gradient-to-br from-slate-100/15 to-transparent" />
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/78 px-3 py-1 text-xs font-medium text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.04)] backdrop-blur-md">
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-400/80" />
                  Admin hozzáférés
                </div>

                <h1 className="mt-4 text-[48px] font-black leading-[1.05] tracking-[-0.055em] text-slate-900 lg:text-[52px]">
                  Belépés a
                  <br />
                  <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-400 bg-clip-text text-transparent">
                    Workzy adminba.
                  </span>
                </h1>

                <p className="mx-auto mt-4 max-w-md text-lg leading-8 text-slate-700 lg:mx-0">
                  Kezeld egy helyen a pozíciókat, a jelentkezéseket és az onboarding
                  folyamatot a Workzy prémium admin felületén.
                </p>

                <div className="mx-auto mt-8 grid max-w-lg grid-cols-1 gap-4 text-left sm:grid-cols-3 lg:mx-0">
                  <div className="rounded-2xl border border-white/85 bg-white/80 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.05)] opacity-90 backdrop-blur-md transition-all duration-200 hover:-translate-y-[1px] hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] hover:opacity-100">
                    <div className="text-base font-bold leading-none tracking-[-0.04em] text-slate-900">
                      Admin
                    </div>
                    <div className="mt-2 text-xs text-slate-500">kezelőfelület</div>
                  </div>

                  <div className="rounded-2xl border border-white/85 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md transition-all duration-200 scale-[1.03] hover:-translate-y-[1px] hover:scale-[1.04] hover:shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
                    <div className="text-base font-bold leading-none tracking-[-0.04em] text-slate-900">
                      Gyors
                    </div>
                    <div className="mt-2 text-xs text-slate-500">hozzáférés</div>
                  </div>

                  <div className="rounded-2xl border border-white/85 bg-white/80 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.05)] opacity-90 backdrop-blur-md transition-all duration-200 hover:-translate-y-[1px] hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] hover:opacity-100">
                    <div className="text-base font-bold leading-none tracking-[-0.04em] text-slate-900">
                      Biztonságos
                    </div>
                    <div className="mt-2 text-xs text-slate-500">belépés</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative w-full animate-[float_6s_ease-in-out_infinite] lg:ml-auto lg:max-w-lg">
              <div className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-sky-300/30 via-blue-300/20 to-indigo-300/20 blur-2xl opacity-60" />
              <div className="absolute -inset-4 -z-10 rounded-[28px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6),transparent_70%)] blur-md" />

              <div className="relative rounded-[32px] border border-slate-200/70 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.15),0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-white/40 before:opacity-40 transition-transform duration-500 lg:scale-[1.02] lg:p-10">
                <div className="mb-8">
                  <div className="inline-flex rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_12px_26px_rgba(14,165,233,0.24)]">
                    Admin login
                  </div>

                  <h2 className="mt-5 text-[34px] font-black leading-[0.98] tracking-[-0.05em] text-slate-900 sm:text-[42px]">
                    Jelentkezz be
                  </h2>

                  <p className="mt-3 text-[16px] leading-7 text-slate-600">
                    Add meg a hozzáférési adataidat az admin felület eléréséhez.
                  </p>
                </div>

                <form action="/api/admin/login" method="POST" className="space-y-5">
                  <div>
                    <label
                      htmlFor="username"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Felhasználónév
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      placeholder="Add meg a felhasználóneved"
                      className="h-16 w-full rounded-2xl border border-slate-200 bg-white/80 px-5 text-base text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.06),inset_0_2px_4px_0_rgba(226,232,240,0.4)] outline-none transition hover:border-slate-300 placeholder:text-slate-400 focus:border-sky-500 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)] focus:ring-2 focus:ring-sky-300"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Jelszó
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Add meg a jelszavad"
                      className="h-16 w-full rounded-2xl border border-slate-200 bg-white/80 px-5 text-base text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.06),inset_0_2px_4px_0_rgba(226,232,240,0.4)] outline-none transition hover:border-slate-300 placeholder:text-slate-400 focus:border-sky-500 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)] focus:ring-2 focus:ring-sky-300"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="relative overflow-hidden inline-flex h-16 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 hover:from-sky-600 hover:via-blue-600 hover:to-indigo-600 px-8 text-lg font-semibold text-white shadow-[0_12px_35px_rgba(37,99,235,0.35)] before:absolute before:inset-0 before:rounded-[inherit] before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity transition-all duration-200 ease-out hover:scale-[1.03] hover:shadow-[0_25px_60px_rgba(37,99,235,0.45)] active:scale-[0.97]"
                  >
                    Belépés az adminba
                  </button>
                </form>

                <div className="mt-6 rounded-[24px] border border-cyan-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(240,249,255,0.92))] p-5">
                  <div className="text-sm font-semibold text-slate-700">
                    Tipp
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Bejelentkezés után az onboarding vagy az admin dashboard nyílik meg,
                    attól függően, hogy a profil beállítása kész van-e már.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}