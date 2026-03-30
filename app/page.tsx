import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-black text-white">
      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Workzy</h1>

        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl">
          Automatizált toborzás és álláskeresés egy platformon. Találd meg a
          megfelelő embert vagy a következő munkád gyorsabban, mint valaha.
        </p>

        <div className="flex gap-4">
          <Link href="/jobs">
            <span className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition inline-block">
              Állást keresek
            </span>
          </Link>

          <Link href="/employers">
            <span className="border border-gray-600 px-6 py-3 rounded-xl hover:bg-gray-800 transition inline-block">
              Munkaadóknak
            </span>
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="bg-gray-900 p-6 rounded-2xl">
          <h3 className="text-xl font-semibold mb-2">Gyors jelentkezés</h3>
          <p className="text-gray-400">
            Jelentkezz egy kattintással, egyszerűen.
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl">
          <h3 className="text-xl font-semibold mb-2">AI alapú párosítás</h3>
          <p className="text-gray-400">
            Automatikusan összekötünk a legjobb lehetőségekkel.
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl">
          <h3 className="text-xl font-semibold mb-2">Gyors felvétel</h3>
          <p className="text-gray-400">
            Munkaadóknak: kevesebb HR, több eredmény.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Kezdj el most</h2>

        <Link href="/jobs">
          <span className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition inline-block">
            Regisztráció
          </span>
        </Link>
      </section>
    </main>
  );
}