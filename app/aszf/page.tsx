export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AszfPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm sm:p-16">
        <div className="prose prose-slate max-w-none">
          <h1 className="mb-8 text-4xl font-extrabold text-slate-900">Általános Szerződési Feltételek (ÁSZF)</h1>
          <p>Hatályos: 2024. január 1-től</p>

          <h2 className="text-2xl font-bold text-slate-800">1. Szolgáltató adatai</h2>
          <p><strong>Név:</strong> CÉGNÉV KFT.<br/>
          <strong>Székhely:</strong> 1234 Budapest, Példa utca 1.<br/>
          <strong>Adószám:</strong> 12345678-2-41</p>

          <h2 className="text-2xl font-bold text-slate-800">2. A Szolgáltatás leírása</h2>
          <p>A Szolgáltató szoftverszolgáltatást (SaaS) nyújt munkáltatók (Ügyfelek) és álláskeresők (Felhasználók) számára.</p>

          <h2 className="text-2xl font-bold text-slate-800">3. Regisztráció, fiók létrehozása</h2>
          <p>A platform funkcióinak teljeskörű használata regisztrációhoz kötött. A regisztráció során megadott adatoknak a valóságnak meg kell felelniük.</p>

          <h2 className="text-2xl font-bold text-slate-800">4. Szerzői jogok</h2>
          <p>A weboldalon található minden tartalom, design, és forráskód a Szolgáltató szellemi tulajdonát képezi, azok felhasználása csak a Szolgáltató előzetes írásbeli engedélyével lehetséges.</p>

          <h2 className="text-2xl font-bold text-slate-800">5. Felelősség kizárása</h2>
          <p>A Szolgáltató nem vállal felelősséget a platformon közzétett álláshirdetések valóságtartalmáért, illetve a munkáltatók és álláskeresők közötti jogviszonyból eredő semmilyen kárért.</p>
        </div>
      </div>
    </main>
  );
}
