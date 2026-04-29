export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdatkezelesiTajekoztatoPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm sm:p-16">
        <div className="prose prose-slate max-w-none">
          <h1 className="mb-8 text-4xl font-extrabold text-slate-900">Adatkezelési Tájékoztató</h1>
          
          <p>Hatályos: 2024. január 1-től</p>

          <h2 className="text-2xl font-bold text-slate-800">1. Az Adatkezelő megnevezése</h2>
          <p><strong>Cégnév:</strong> CÉGNÉV KFT.<br/>
          <strong>Székhely:</strong> 1234 Budapest, Példa utca 1.<br/>
          <strong>E-mail:</strong> info@cegnev.hu</p>

          <h2 className="text-2xl font-bold text-slate-800">2. Az adatkezelés alapelvei</h2>
          <p>Személyes adatait a GDPR és a hazai jogszabályok előírásainak megfelelően, tisztességesen és törvényesen kezeljük. Adatait bizalmasan kezeljük és megteszünk minden biztonsági intézkedést azok védelme érdekében.</p>

          <h2 className="text-2xl font-bold text-slate-800">3. Kezelt adatok köre, célja és jogalapja</h2>
          <h3 className="text-xl font-semibold text-slate-700">3.1. Regisztráció és fióklétrehozás</h3>
          <ul>
            <li><strong>Kezelt adatok:</strong> Név, e-mail cím, jelszó.</li>
            <li><strong>Cél:</strong> Felhasználói fiók biztosítása.</li>
            <li><strong>Jogalap:</strong> Szerződés teljesítése [GDPR 6. cikk (1) bekezdés b) pont].</li>
          </ul>

          <h3 className="text-xl font-semibold text-slate-700">3.2. Állásra jelentkezés</h3>
          <ul>
            <li><strong>Kezelt adatok:</strong> Név, e-mail cím, telefonszám, önéletrajz.</li>
            <li><strong>Cél:</strong> Kiválasztási folyamat lebonyolítása.</li>
            <li><strong>Jogalap:</strong> Érintett hozzájárulása [GDPR 6. cikk (1) bekezdés a) pont].</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800">4. Az Érintettek jogai</h2>
          <p>Ön jogosult kérelmezni az adatkezelőtől a rá vonatkozó személyes adatokhoz való hozzáférést, azok helyesbítését, törlését vagy kezelésének korlátozását. Továbbá tiltakozhat az ilyen személyes adatok kezelése ellen, valamint élhet az adathordozhatósághoz való jogával.</p>
        </div>
      </div>
    </main>
  );
}
