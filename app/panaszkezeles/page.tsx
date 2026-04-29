export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function PanaszkezelesPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm sm:p-16">
        <div className="prose prose-slate max-w-none">
          <h1 className="mb-8 text-4xl font-extrabold text-slate-900">Panaszkezelés</h1>

          <h2 className="text-2xl font-bold text-slate-800">1. A panasz benyújtása</h2>
          <p>Célunk, hogy szolgáltatásainkat a legmagasabb minőségben biztosítsuk. Amennyiben Önnek mégis panasza merülne fel, az alábbi elérhetőségeken jelezheti felénk:</p>
          <ul>
            <li><strong>E-mail:</strong> panasz@cegnev.hu</li>
            <li><strong>Levelezési cím:</strong> 1234 Budapest, Példa utca 1.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800">2. A panasz kivizsgálása</h2>
          <p>A beérkezett panaszokat minden esetben 30 napon belül érdemben kivizsgáljuk és írásban megválaszoljuk. Szóbeli panasz esetén – amennyiben az lehetséges – a panaszt azonnal orvosoljuk.</p>

          <h2 className="text-2xl font-bold text-slate-800">3. További jogorvoslati lehetőségek</h2>
          <p>Amennyiben a panaszkezelésünkkel nem elégedett, az alábbi hatóságokhoz fordulhat:</p>
          <ul>
            <li><strong>Békéltető Testület:</strong> A lakóhelye vagy tartózkodási helye szerint illetékes Békéltető Testület.</li>
            <li><strong>Fogyasztóvédelmi Hatóság:</strong> A területileg illetékes járási hivatal.</li>
            <li><strong>Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH):</strong> Adatkezelési problémák esetén.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
