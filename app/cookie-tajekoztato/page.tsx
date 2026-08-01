export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function CookieTajekoztatoPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm sm:p-16">
        <div className="prose prose-slate max-w-none">
          <h1 className="mb-2 text-4xl font-extrabold text-slate-900">Cookie-tájékoztató</h1>
          <p className="text-slate-500">a workzy.hu weboldal és webalkalmazás látogatói részére</p>
          <p>
            Aktuális változat &middot; v1.0
            <br />
            Hatályos: 2026. augusztus 1-től
            <br />
            Közzétéve: 2026. augusztus 1.
          </p>

          <ul className="list-none pl-0">
            <li><strong>Adatkezelő / szolgáltató:</strong> Prigl Tamás egyéni vállalkozó</li>
            <li><strong>Platform neve:</strong> Workzy</li>
            <li><strong>Székhely:</strong> 2484 Gárdony, Géza utca 28.</li>
            <li><strong>Adószám:</strong> 92233913-1-27</li>
            <li><strong>Weboldal:</strong> <a href="https://workzy.hu">https://workzy.hu</a></li>
            <li><strong>Kapcsolat:</strong> <a href="mailto:info@workzy.hu">info@workzy.hu</a></li>
          </ul>

          <p>
            A Workzy jelenleg kizárólag a weboldal és a szolgáltatás működéséhez feltétlenül szükséges cookie-kat és hasonló technológiákat
            alkalmazza (például bejelentkezés, munkamenet fenntartása, biztonság és a cookie-választás megjegyzése). Analitikai vagy marketing
            célú cookie-t a Workzy jelenleg nem használ. Ha ilyen technológia bevezetésre kerül, az kizárólag a látogató előzetes, aktív
            hozzájárulása után indulhat el, és a jelen tájékoztató a bevezetés előtt frissül a pontos szolgáltatói és cookie-adatokkal.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">1. A Tájékoztató célja és hatálya</h2>
          <p>1.1. A Tájékoztató célja, hogy átláthatóan bemutassa a végberendezésen tárolt vagy onnan kiolvasott információk, valamint az ezekhez kapcsolódó személyes adatok kezelését.</p>
          <p>1.2. A Tájékoztató kiterjed a workzy.hu teljes nyilvános felületére, a jelentkezői és munkáltatói fiókokra, a checkout-folyamatra, a fizetési visszatérési oldalakra, valamint minden olyan aloldalra, amelyen a Workzy által kezelt technikai azonosítók működnek.</p>
          <p>1.3. A SimplePay vagy más külső szolgáltató saját weboldalán elhelyezett cookie-kra elsődlegesen az adott szolgáltató tájékoztatója irányadó. A Workzy ugyanakkor tájékoztatja a látogatót az átirányításról és a releváns szolgáltatókról.</p>
          <p>
            1.4. A Tájékoztató az <a href="/adatkezelesi-tajekoztato">Adatkezelési Tájékoztatóval</a> együtt értelmezendő. Ha egy technológia
            személyes adatot kezel, az adatkezelés célja, jogalapja, címzettjei, megőrzési ideje és az érintetti jogok az Adatkezelési
            Tájékoztatóban is megjelennek.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">2. Fogalommeghatározások</h2>
          <ul>
            <li><strong>Cookie (süti):</strong> a böngészőben vagy más végberendezésen tárolt kis adatállomány, amely munkamenetet, beállítást, azonosítót vagy más információt hordozhat.</li>
            <li><strong>Hasonló technológia:</strong> a cookie-val azonos vagy hasonló célt szolgáló megoldás, például local storage, session storage, pixel, tag, SDK, szerveroldali esemény vagy eszközazonosító.</li>
            <li><strong>Első féltől származó:</strong> a workzy.hu domainhez kapcsolódóan elhelyezett vagy elért technológia.</li>
            <li><strong>Harmadik féltől származó:</strong> más szolgáltató domainjéhez, rendszeréhez vagy adatkezeléséhez kapcsolódó technológia.</li>
            <li><strong>Munkamenet-cookie:</strong> a böngészési munkamenet végéig vagy rövid technikai időre működő cookie.</li>
            <li><strong>Tartós cookie:</strong> a munkamenet után is megmaradó, meghatározott lejárati idővel rendelkező cookie.</li>
            <li><strong>CMP:</strong> Consent Management Platform, vagyis a hozzájárulások megadását, naplózását és visszavonását kezelő rendszer.</li>
            <li><strong>Tag:</strong> olyan kódrészlet, amely például analitikai, hirdetési vagy technikai eseményt kezelhet.</li>
            <li><strong>Hozzájárulási napló:</strong> a választás bizonyításához szükséges minimális technikai nyilvántartás, amely nem használható szükségtelen profilozásra.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800">3. Jogi és szakmai keret</h2>
          <p>3.1. A cookie-k és hasonló technológiák alkalmazására együttesen irányadó lehet az elektronikus hírközlés titkosságára vonatkozó szabályozás, a GDPR, az Infotv., valamint az alkalmazott külső szolgáltatók szerződéses és technikai követelményei.</p>
          <p>3.2. A végberendezésen történő tárolás vagy az ott tárolt információhoz való hozzáférés főszabály szerint előzetes, megfelelő tájékoztatáson alapuló hozzájárulást igényel. Kivételt képezhet a kizárólagos célként elektronikus hírközlési továbbítást szolgáló, illetve a felhasználó által kifejezetten kért szolgáltatáshoz feltétlenül szükséges technológia.</p>
          <p>3.3. A hozzájárulásnak önkéntesnek, konkrétnak, megfelelő tájékoztatáson alapulónak és egyértelműnek kell lennie. Előre bekapcsolt kapcsoló, hallgatás, görgetés vagy puszta továbblépés nem minősül elfogadásnak.</p>
          <p>3.4. A Workzy a hozzájárulást nem teszi a szolgáltatás igénybevételének feltételévé olyan technológiák esetében, amelyek nem szükségesek az adott szolgáltatás teljesítéséhez.</p>

          <h2 className="text-2xl font-bold text-slate-800">4. A technológiák kategóriái</h2>
          <table>
            <thead>
              <tr><th>Kategória</th><th>Alapállapot</th><th>Tipikus cél</th><th>Jogalapi megközelítés</th></tr>
            </thead>
            <tbody>
              <tr><td>Szükséges</td><td>Mindig aktív</td><td>Bejelentkezés, biztonság, munkamenet, fizetési folyamat, cookie-választás megjegyzése</td><td>Hozzájárulási kivétel a szigorúan szükséges körben; kapcsolódó személyes adatnál a megfelelő GDPR-jogalap</td></tr>
              <tr><td>Analitikai</td><td>Alapból kikapcsolt, jelenleg nem használt</td><td>Forgalom, oldalhasználat, hibák és konverziók összesített mérése</td><td>Előzetes aktív hozzájárulás</td></tr>
              <tr><td>Marketing</td><td>Alapból kikapcsolt, jelenleg nem használt</td><td>Hirdetésmérés, remarketing, közönségképzés, kampányoptimalizálás</td><td>Előzetes aktív hozzájárulás</td></tr>
              <tr><td>Funkcionális</td><td>Nincs külön kategória, jelenleg nem alkalmazott</td><td>Opcionális chat, videó, térkép vagy kényelmi funkció</td><td>A konkrét funkciótól függ; rendszerint hozzájárulás</td></tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-slate-800">5. Feltétlenül szükséges technológiák</h2>
          <p>5.1. A szükséges technológiák kizárólag olyan célra használhatók, amely nélkül a felhasználó által kért alapfunkció nem, vagy nem biztonságosan működne, ide értve különösen:</p>
          <ul>
            <li>munkamenet és bejelentkezési állapot fenntartása;</li>
            <li>CSRF-, bot-, visszaélés- és biztonsági védelem;</li>
            <li>terheléselosztás, rendelkezésre állás és alapvető infrastruktúra;</li>
            <li>checkout- és fizetési folyamat technikai állapota;</li>
            <li>a cookie-választás megjegyzése, hogy a banner ne jelenjen meg indokolatlanul újra;</li>
            <li>űrlapfolyamat rövid idejű technikai állapota, ha a felhasználó kifejezetten kéri az adott funkciót.</li>
          </ul>
          <p>5.2. A szükséges kategóriába nem sorolható pusztán üzleti kényelmi okból analitika, teljesítménymérés, marketingattribúció vagy hirdetésoptimalizálás.</p>
          <p>5.3. A Workzy a szükséges technológiákat is adatminimalizálással, ésszerű lejárati idővel és megfelelő biztonsággal működteti.</p>

          <h2 className="text-2xl font-bold text-slate-800">6. Analitikai és marketing-technológiák</h2>
          <p>
            6.1. A Workzy jelenleg nem használ analitikai (pl. weboldalforgalom-mérő) vagy marketing/hirdetési (pl. konverziómérő, remarketing)
            cookie-t vagy hasonló technológiát.
          </p>
          <p>
            6.2. Ha a jövőben ilyen technológia bevezetésre kerül, az kizárólag a látogató aktív, kategóriánkénti hozzájárulása után
            indulhat el; elutasítás esetén az adott technológia nem tölthető be és nem küldhet mérési jelet. A jelentkezési űrlap tartalma,
            CV, szűrési válasz, elérhetőség és más jelöltadat soha nem továbbítható analitikai vagy hirdetési platformnak.
          </p>
          <p>6.3. A Workzy nem alkalmaz munkamenet-visszajátszást, billentyűleütés-rögzítést, képernyőfelvételt vagy szükségtelen részletes viselkedési profilozást.</p>

          <h2 className="text-2xl font-bold text-slate-800">7. A hozzájárulás megadása és módosítása</h2>
          <p>7.1. Az első látogatáskor a Workzy a nem szükséges technológiákat alapból kikapcsolt állapotban tartja, és a látogatónak könnyen használható lehetőséget biztosít a választásra és annak későbbi módosítására.</p>
          <p>7.2. Az elfogadás nem lehet vizuálisan vagy működésében lényegesen könnyebb az elutasításnál. A vezérlőknek jól láthatónak, érthetőnek és mobilon is használhatónak kell lenniük.</p>
          <p>7.3. Az oldal használata, görgetés, bezárás vagy más inaktív magatartás nem értelmezhető hozzájárulásként.</p>
          <p>7.4. A választás módosítására vagy visszavonására szolgáló vezérlő minden oldalon elérhető a lábléc &bdquo;Cookie-beállítások&rdquo; linkjén keresztül. A visszavonás legalább olyan egyszerű, mint a megadás.</p>
          <p>7.5. A Workzy a választást &ndash; az elfogadást és az elutasítást egyaránt &ndash; normál esetben legfeljebb 12 hónapig jegyzi meg, ezután új választást kér. Ha a kezelt kategóriák, célok vagy szolgáltatók érdemben megváltoznak, a Workzy ezt megelőzően is új hozzájárulást kérhet.</p>
          <p>7.6. A visszavonás nem teszi jogellenessé a visszavonás előtti adatkezelést, de a további opcionális adatkezelést leállítja.</p>

          <h2 className="text-2xl font-bold text-slate-800">8. Harmadik felek és nemzetközi adattovábbítás</h2>
          <p>8.1. Amennyiben a Workzy a jövőben analitikai vagy marketing célú harmadik fél szolgáltatást (például Google vagy Meta mérőeszközt) vezet be, az éles cookie-nyilvántartás megjelöli a szolgáltató pontos jogi nevét, célját, a kezelt adatokat, a technológia nevét, az időtartamot, az adatvédelmi szerepkört és az esetleges EU/EGT-n kívüli adattovábbítást.</p>
          <p>8.2. EU/EGT-n kívüli adattovábbítás csak a GDPR V. fejezete szerinti megfelelő garanciával történhet, például megfelelőségi határozat, standard szerződési feltételek és szükség esetén kiegészítő intézkedések alapján.</p>
          <p>8.3. Harmadik fél saját adatkezelése esetén az érintett a szolgáltató tájékoztatójában talál további információt és joggyakorlási lehetőségeket.</p>

          <h2 className="text-2xl font-bold text-slate-800">9. Megőrzési idők és hozzájárulási napló</h2>
          <p>9.1. A szükséges technológiák megőrzési ideje a funkció technikai céljához igazodik (jellemzően a munkamenet vagy legfeljebb 12 hónap a cookie-választás esetén).</p>
          <p>9.2. A hozzájárulás bizonyítására a Workzy minimális naplót vezethet, amely tartalmazhatja a technikai azonosítót, az időpontot, a választás állapotát és a tájékoztató verzióját. A napló nem használható viselkedési profilozásra, és a hozzájárulás fennállása alatt, majd annak visszavonásától vagy lejártától számított legfeljebb 5 évig őrizhető, kizárólag jogi bizonyítási célból.</p>

          <h2 className="text-2xl font-bold text-slate-800">10. Böngészőbeállítások és technikai korlátozások</h2>
          <p>10.1. A látogató a böngészőjében is törölheti vagy blokkolhatja a cookie-kat. A böngészőbeállítás azonban nem helyettesíti a Workzy hozzájárulási felületét.</p>
          <p>10.2. A szükséges cookie-k teljes tiltása miatt egyes funkciók, például a bejelentkezés, a fiókbiztonság, az űrlapfolyamat vagy a fizetés nem működhet megfelelően.</p>

          <h2 className="text-2xl font-bold text-slate-800">11. Érintetti jogok és jogorvoslat</h2>
          <p>11.1. Amennyiben a cookie-hoz kapcsolódó adat személyes adatnak minősül, az érintettet a GDPR szerinti hozzáférési, helyesbítési, törlési, korlátozási, adathordozhatósági, tiltakozási és hozzájárulás-visszavonási jogok illethetik meg az alkalmazott jogalaptól függően.</p>
          <p>11.2. Kérelem küldhető az info@workzy.hu címre. A Workzy az érintett személyazonosságát arányosan ellenőrizheti, és a kérelmet főszabály szerint egy hónapon belül megválaszolja.</p>
          <p>
            11.3. Az érintett panaszt tehet a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (<a href="https://www.naih.hu">https://www.naih.hu</a>),
            illetve bírósághoz fordulhat.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">12. Hatály, módosítás és verziókezelés</h2>
          <p>
            12.1. A Workzy a korábbi változatokat és azok hatályossági idejét a <a href="/jogi">Jogi Dokumentumközpontban</a> megőrzi. A
            cookie-bannerben és a hozzájárulási naplóban az elfogadáskor érvényes verziót rögzítjük.
          </p>
          <p>12.2. Lényeges változáskor &ndash; így különösen új cookie-kategória vagy szolgáltató bevezetésekor &ndash; a Workzy új választást kér. Pusztán nyelvi vagy formai pontosítás esetén, amely a célokat és adatkezelést nem változtatja meg, nem szükséges automatikusan új hozzájárulás, de a verziót akkor is dokumentáljuk.</p>

          <p>
            Kapcsolódó dokumentumok: <a href="/adatkezelesi-tajekoztato">Adatkezelési Tájékoztató</a>, <a href="/aszf">Általános Szerződési Feltételek</a>.
            A teljes jogi dokumentumlista a <a href="/jogi">Jogi Dokumentumközpontban</a> érhető el.
          </p>
        </div>
      </div>
    </main>
  );
}
