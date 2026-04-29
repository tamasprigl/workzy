export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ImpresszumPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm sm:p-16">
        <div className="prose prose-slate max-w-none">
          <h1 className="mb-8 text-4xl font-extrabold text-slate-900">Impresszum</h1>
          
          <h2 className="text-2xl font-bold text-slate-800">Szolgáltató adatai</h2>
          <ul className="list-none pl-0">
            <li><strong>Cégnév:</strong> CÉGNÉV KFT.</li>
            <li><strong>Székhely:</strong> 1234 Budapest, Példa utca 1.</li>
            <li><strong>Cégjegyzékszám:</strong> 01-09-123456</li>
            <li><strong>Adószám:</strong> 12345678-2-41</li>
            <li><strong>Képviseli:</strong> Ügyvezető Igazgató</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800">Elérhetőségek</h2>
          <ul className="list-none pl-0">
            <li><strong>E-mail:</strong> <a href="mailto:info@cegnev.hu">info@cegnev.hu</a></li>
            <li><strong>Telefonszám:</strong> +36 30 123 4567</li>
            <li><strong>Weboldal:</strong> www.cegnev.hu</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800">Tárhelyszolgáltató</h2>
          <ul className="list-none pl-0">
            <li><strong>Cégnév:</strong> Tárhelyszolgáltató Kft.</li>
            <li><strong>Székhely:</strong> 1234 Budapest, Szerver utca 1.</li>
            <li><strong>E-mail:</strong> info@tarhelyszolgaltato.hu</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
