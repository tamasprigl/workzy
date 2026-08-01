export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ImpresszumPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm sm:p-16">
        <div className="prose prose-slate max-w-none">
          <h1 className="mb-2 text-4xl font-extrabold text-slate-900">Impresszum &ndash; Cégadatok és kapcsolat</h1>
          <p className="text-slate-500">Közzétéve: 2026. augusztus 1.</p>

          <p>
            A Workzy a Prigl Tamás egyéni vállalkozó által működtetett online álláshirdetési és toborzási marketingplatform. Az alábbi adatok
            a szolgáltató hivatalos azonosító és kapcsolattartási adatai.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">Szolgáltató adatai</h2>
          <ul className="list-none pl-0">
            <li><strong>Szolgáltató neve:</strong> Prigl Tamás egyéni vállalkozó</li>
            <li><strong>Platform neve:</strong> Workzy</li>
            <li><strong>Székhely:</strong> 2484 Gárdony, Géza utca 28.</li>
            <li><strong>Adószám:</strong> 92233913-1-27</li>
            <li><strong>Egyéni vállalkozói nyilvántartási szám:</strong> 62599289</li>
            <li><strong>Nyilvántartást vezető szerv:</strong> Nemzeti Adó- és Vámhivatal (NAV) &ndash; Egyéni Vállalkozók Nyilvántartása</li>
            <li><strong>Kamarai nyilvántartási szám:</strong> FE92233913</li>
            <li><strong>Statisztikai számjel:</strong> 92233913-7311-231-07</li>
            <li><strong>Egyéni vállalkozói tevékenység kezdete:</strong> 2026. július 23.</li>
            <li><strong>Áfa-jogállás:</strong> alanyi adómentes</li>
          </ul>

          <h3 className="text-xl font-semibold text-slate-700">Nyilvántartott tevékenységek</h3>
          <ul>
            <li>731101 &ndash; Reklámtervezés, -készítés és -elhelyezés</li>
            <li>639101 &ndash; Internetes keresőportállal kapcsolatos tevékenység</li>
            <li>631002 &ndash; Online hirdetési hely értékesítése webgazda által</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800">Elérhetőségek</h2>
          <ul className="list-none pl-0">
            <li><strong>E-mail:</strong> <a href="mailto:info@workzy.hu">info@workzy.hu</a></li>
            <li><strong>Telefonszám:</strong> +36 70 432 7579</li>
            <li><strong>Weboldal:</strong> <a href="https://workzy.hu">https://workzy.hu</a></li>
            <li><strong>Postai kapcsolattartás:</strong> 2484 Gárdony, Géza utca 28.</li>
          </ul>
          <p>
            Írásbeli megkeresését az info@workzy.hu címre küldheti. Panasz esetén kérjük, adja meg a vállalkozás nevét és adószámát, a
            rendelés vagy kampány azonosítóját, a probléma részletes leírását és a kért megoldást &ndash; részletek a{" "}
            <a href="/panaszkezeles">Panaszkezelési Tájékoztatóban</a>.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">Tárhelyszolgáltatás</h2>
          <p>
            A Workzy weboldalát a Vercel Inc. üzemelteti (hosting és technikai kiszolgálás), a mögöttes adatbázist és fájltárolást a Supabase
            biztosítja, a domain- és DNS-szolgáltatást a Rackhost nyújtja. A technikai szolgáltatók pontos szerződéses adatairól és
            adatvédelmi szerepéről az <a href="/adatkezelesi-tajekoztato">Adatkezelési Tájékoztató</a> és az{" "}
            <a href="/adatfeldolgozasi-melleklet">Adatfeldolgozási Melléklet</a> ad tájékoztatást.
          </p>

          <p>
            Jogi dokumentumok: <a href="/aszf">Általános Szerződési Feltételek</a>, <a href="/adatkezelesi-tajekoztato">Adatkezelési Tájékoztató</a>,{" "}
            <a href="/cookie-tajekoztato">Cookie-tájékoztató</a>, <a href="/panaszkezeles">Panaszkezelési Tájékoztató</a>. A teljes jogi
            dokumentumlista a <a href="/jogi">Jogi Dokumentumközpontban</a> érhető el.
          </p>
        </div>
      </div>
    </main>
  );
}
