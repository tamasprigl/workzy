import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
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

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-6 lg:px-8">
        <header className="mb-10">
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

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="inline-flex rounded-2xl border border-white/90 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 shadow-[0_10px_26px_rgba(15,23,42,0.05)] transition hover:bg-white"
                >
                  Vissza a főoldalra
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center">
          <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="hidden lg:block">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/78 px-4 py-2 text-sm font-medium text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.04)] backdrop-blur-md">
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-400/80" />
                  Admin hozzáférés
                </div>

                <h1 className="mt-8 text-[46px] font-black leading-[0.94] tracking-[-0.055em] text-slate-900 sm:text-[58px] lg:text-[72px]">
                  Belépés a
                  <br />
                  <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-400 bg-clip-text text-transparent">
                    Workzy adminba.
                  </span>
                </h1>

                <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
                  Kezeld egy helyen a pozíciókat, a jelentkezéseket és az onboarding
                  folyamatot a Workzy prémium admin felületén.
                </p>

                <div className="mt-8 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-[24px] border border-white/85 bg-white/82 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-md">
                    <div className="text-[22px] font-black leading-none tracking-[-0.04em] text-slate-900">
                      Admin
                    </div>
                    <div className="mt-2 text-sm text-slate-500">kezelőfelület</div>
                  </div>

                  <div className="rounded-[24px] border border-white/85 bg-white/82 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-md">
                    <div className="text-[22px] font-black leading-none tracking-[-0.04em] text-slate-900">
                      Gyors
                    </div>
                    <div className="mt-2 text-sm text-slate-500">hozzáférés</div>
                  </div>

                  <div className="rounded-[24px] border border-white/85 bg-white/82 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-md">
                    <div className="text-[22px] font-black leading-none tracking-[-0.04em] text-slate-900">
                      Biztonságos
                    </div>
                    <div className="mt-2 text-sm text-slate-500">belépés</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-6 rounded-[40px] bg-cyan-200/20 blur-3xl" />

              <div className="relative rounded-[32px] border border-white/85 bg-white/78 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-8 lg:p-10">
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
                      className="w-full rounded-2xl border border-white/90 bg-white/90 px-5 py-4 text-base text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.05)] outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
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
                      className="w-full rounded-2xl border border-white/90 bg-white/90 px-5 py-4 text-base text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.05)] outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-[0_18px_42px_rgba(14,165,233,0.24)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_52px_rgba(14,165,233,0.32)]"
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