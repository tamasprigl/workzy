export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function CookieTajekoztatoPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm sm:p-16">
        <div className="prose prose-slate max-w-none">
          <h1 className="mb-8 text-4xl font-extrabold text-slate-900">Cookie (Süti) Tájékoztató</h1>

          <p>A CÉGNÉV KFT. (továbbiakban: Adatkezelő) a weboldalon sütiket (cookie-kat) használ a felhasználói élmény javítása és az oldal megfelelő működése érdekében.</p>

          <h2 className="text-2xl font-bold text-slate-800">1. Mik azok a sütik?</h2>
          <p>A süti egy kis szöveges fájl, amelyet a weboldal az Ön számítógépén vagy mobil eszközén tárol el, amikor Ön meglátogatja a weboldalt. Ennek segítségével a weboldal megjegyzi az Ön cselekedeteit és beállításait egy bizonyos ideig.</p>

          <h2 className="text-2xl font-bold text-slate-800">2. Milyen sütiket használunk?</h2>
          <h3 className="text-xl font-semibold text-slate-700">A) Elengedhetetlenül szükséges sütik</h3>
          <p>Ezek a sütik szükségesek a weboldal alapvető funkcióinak működéséhez. Ezek nélkül az oldal nem tud megfelelően működni.</p>
          
          <h3 className="text-xl font-semibold text-slate-700">B) Analitikai / Teljesítmény sütik</h3>
          <p>Ezek a sütik segítenek megérteni, hogyan interakcióznak a látogatók a weboldallal, statisztikai adatokat gyűjtenek anonim módon.</p>

          <h3 className="text-xl font-semibold text-slate-700">C) Marketing sütik</h3>
          <p>A marketing sütiket a látogatók weboldalakon átívelő nyomon követésére használják releváns hirdetések megjelenítése céljából.</p>

          <h2 className="text-2xl font-bold text-slate-800">3. Sütik kezelése és törlése</h2>
          <p>A böngészők többsége alapértelmezés szerint elfogadja a sütiket. Ön azonban módosíthatja böngészője beállításait a sütik elutasítására vagy törlésére.</p>
        </div>
      </div>
    </main>
  );
}
