export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SimplePayTajekoztatoPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm sm:p-16">
        <div className="prose prose-slate max-w-none">
          <h1 className="mb-2 text-4xl font-extrabold text-slate-900">SimplePay fizetési tájékoztató</h1>
          <p className="text-slate-500">a Workzy fizetős szolgáltatásainak online fizetéséről</p>
          <p>
            Aktuális változat &middot; v1.0
            <br />
            Hatályos: 2026. augusztus 1-től
            <br />
            Közzétéve: 2026. augusztus 1.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">1. A fizetési szolgáltató</h2>
          <p>
            A Workzy fizetős csomagjainak online kiegyenlítését a SimplePay (OTP Mobil Kft.) biztosítja.
          </p>
          <ul className="list-none pl-0">
            <li><strong>Fizetési szolgáltató:</strong> SimplePay (OTP Mobil Kft.)</li>
            <li><strong>Székhely:</strong> 1138 Budapest, Váci út 135&ndash;139. B. ép. 5. em.</li>
            <li><strong>Weboldal:</strong> <a href="https://simplepay.hu">https://simplepay.hu</a></li>
          </ul>
          <p>
            A SimplePay hatályos kereskedői feltételei, adatkezelési tájékoztatói és vásárlóknak szóló fizetési tájékoztatója a{" "}
            <a href="https://simplepay.hu">simplepay.hu</a> oldalon érhetők el.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">2. A Workzy mint kereskedő</h2>
          <ul className="list-none pl-0">
            <li><strong>Kereskedő:</strong> Prigl Tamás egyéni vállalkozó</li>
            <li><strong>Platform / szolgáltatás neve:</strong> Workzy</li>
            <li><strong>Székhely:</strong> 2484 Gárdony, Géza utca 28.</li>
            <li><strong>Adószám:</strong> 92233913-1-27</li>
            <li><strong>Weboldal:</strong> <a href="https://workzy.hu">https://workzy.hu</a></li>
            <li><strong>Kapcsolat:</strong> <a href="mailto:info@workzy.hu">info@workzy.hu</a> | +36 70 432 7579</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800">3. Elérhető fizetési módok</h2>
          <p>A Workzy fizetős csomagjait (Workzy Portál, Workzy Kampány, Workzy Kampány Pro) kizárólag a SimplePay online fizetési felületén, az alábbi módokon lehet kiegyenlíteni:</p>
          <ul>
            <li><strong>SimplePay bankkártyás fizetés</strong> &ndash; a nagyobb nemzetközi kártyatársaságok által elfogadott bankkártyákkal, a SimplePay biztonságos fizetőoldalán.</li>
            <li><strong>SimplePay qvik</strong> &ndash; azonnali fizetési mód, amelyet a vásárló saját banki alkalmazásában hagy jóvá.</li>
          </ul>
          <p>Kézi banki átutalás a Workzy online rendelési folyamatában nem elérhető.</p>
          <p>
            Minden csomag <strong>egyszeri fizetés</strong>; a Workzy nem indít automatikus megújulást, előfizetést vagy ismétlődő
            bankkártya-terhelést.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">4. A fizetés menete</h2>
          <p>4.1. A Megrendelő a checkout során szerkeszthető végleges megrendelési összesítőt kap, amely tartalmazza a fizetendő végösszeget és a fizetési módot.</p>
          <p>4.2. A megrendelés elküldésekor a Workzy a SimplePay biztonságos fizetőoldalára irányítja át a Megrendelőt.</p>
          <p>4.3. A fizetés eredményét a Workzy kizárólag a SimplePay hiteles, szerveroldali visszaigazolása alapján dolgozza fel; a böngészőben megjelenő SimplePay sikeroldal önmagában nem jelenti a szolgáltatás aktiválását.</p>
          <p>
            4.4. A fizetéssel, a szerződés létrejöttével, a számlázással, a lemondással és a visszatérítéssel kapcsolatos részletes szabályokat a{" "}
            <a href="/fizetes-lemondas-visszaterites">Fizetési, Lemondási és Visszatérítési Szabályzat</a> tartalmazza.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">5. Adatkezelés és adattovábbítás</h2>
          <p>5.1. A bankkártyaadatokat a Workzy nem kezeli és nem tárolja; azok megadása és feldolgozása kizárólag a SimplePay saját, biztonságos felületén történik.</p>
          <p>
            5.2. A fizetés lebonyolításához szükséges mértékben a Workzy a megrendeléshez és a kapcsolattartóhoz kapcsolódó adatokat (például
            név, email-cím, rendelésazonosító, fizetendő összeg) továbbítja a SimplePay részére. A checkout felületén a SimplePay mindenkor
            hatályos, hivatalosan előírt adattovábbítási nyilatkozata jelenik meg, amelyet a fizetés indítása előtt külön el kell fogadni.
          </p>
          <p>5.3. Jelöltprofil, önéletrajz és szűrési válasz soha nem kerül továbbításra a SimplePay részére.</p>
          <p>
            5.4. A SimplePayhez kapcsolódó adatkezelésről bővebben a <a href="/adatkezelesi-tajekoztato">Adatkezelési Tájékoztató</a> és a
            SimplePay saját adatkezelési tájékoztatói nyújtanak felvilágosítást.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">6. Segítség és panasz</h2>
          <p>
            6.1. A fizetéssel kapcsolatos technikai problémát a SimplePay ügyfélszolgálata, a Workzy szolgáltatásával, aktiválásával vagy
            számlázásával kapcsolatos kérdést pedig a Workzy ügyfélszolgálata (<a href="mailto:info@workzy.hu">info@workzy.hu</a>, +36 70 432
            7579) kezeli.
          </p>
          <p>
            6.2. Fizetési, számlázási vagy visszatérítési panaszt a <a href="/panaszkezeles">Panaszkezelési Tájékoztatóban</a> leírt módon
            lehet benyújtani.
          </p>

          <p>
            Kapcsolódó dokumentumok: <a href="/aszf">Általános Szerződési Feltételek</a>,{" "}
            <a href="/fizetes-lemondas-visszaterites">Fizetési, Lemondási és Visszatérítési Szabályzat</a>,{" "}
            <a href="/adatkezelesi-tajekoztato">Adatkezelési Tájékoztató</a>. A teljes jogi dokumentumlista a{" "}
            <a href="/jogi">Jogi Dokumentumközpontban</a> érhető el.
          </p>
        </div>
      </div>
    </main>
  );
}
