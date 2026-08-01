export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdatkezelesiTajekoztatoPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm sm:p-16">
        <div className="prose prose-slate max-w-none">
          <h1 className="mb-2 text-4xl font-extrabold text-slate-900">Adatkezelési Tájékoztató</h1>
          <p className="text-slate-500">weboldallátogatók, üzleti ügyfelek, felhasználók és jelentkezők részére</p>
          <p>
            Aktuális változat &middot; v1.0
            <br />
            Hatályos: 2026. augusztus 1-től
            <br />
            Közzétéve: 2026. augusztus 1.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">1. Az Adatkezelő adatai és elérhetősége</h2>
          <ul className="list-none pl-0">
            <li><strong>Adatkezelő:</strong> Prigl Tamás egyéni vállalkozó</li>
            <li><strong>Platform / szolgáltatás neve:</strong> Workzy</li>
            <li><strong>Székhely és levelezési cím:</strong> 2484 Gárdony, Géza utca 28.</li>
            <li><strong>Adószám:</strong> 92233913-1-27</li>
            <li><strong>Egyéni vállalkozói nyilvántartási szám:</strong> 62599289</li>
            <li><strong>Kamarai nyilvántartási szám:</strong> FE92233913</li>
            <li><strong>Statisztikai számjel:</strong> 92233913-7311-231-07</li>
            <li><strong>Weboldal:</strong> <a href="https://workzy.hu">https://workzy.hu</a></li>
            <li><strong>Adatvédelmi és ügyfélszolgálati email:</strong> <a href="mailto:info@workzy.hu">info@workzy.hu</a></li>
            <li><strong>Telefon:</strong> +36 70 432 7579</li>
            <li><strong>Adatvédelmi tisztviselő:</strong> A jelenlegi működési modell alapján hivatalos adatvédelmi tisztviselő kijelölése nem kötelező.</li>
            <li><strong>Belső adatvédelmi és incidenskezelési felelős:</strong> Prigl Tamás; ez a minőség nem azonos a GDPR szerinti adatvédelmi tisztviselővel.</li>
          </ul>
          <p>
            Az Adatkezelő a Workzy megnevezést kereskedelmi/platformnévként használja. A jogi kötelezettségek alanya Prigl Tamás egyéni
            vállalkozó.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">2. A tájékoztató hatálya és jogi kerete</h2>
          <p>2.1. A tájékoztató a workzy.hu weboldal és kapcsolódó aloldalak látogatóira, az üzleti ügyfelek természetes személy kapcsolattartóira és felhasználóira, a jelentkezőkre, az ügyfélszolgálatot igénybe vevő személyekre, valamint a Workzy marketingkommunikációjára feliratkozókra terjed ki.</p>
          <p>2.2. A Workzy magyar nyelvű, magyar adószámmal rendelkező üzleti és szervezeti ügyfeleknek nyújt szolgáltatást. A fizetős csomagok nem fogyasztói vásárlásra szolgálnak, ugyanakkor az üzleti ügyfelek nevében eljáró kapcsolattartók személyes adatai a GDPR védelme alatt állnak.</p>
          <p>2.3. A fő jogi keretet az Európai Parlament és a Tanács (EU) 2016/679 rendelete (GDPR), a 2011. évi CXII. törvény (Infotv.), az elektronikus hírközlésről szóló 2003. évi C. törvény cookie-szabályai, a gazdasági reklámtevékenységről szóló 2008. évi XLVIII. törvény elektronikus direktmarketing-szabályai, továbbá a számviteli, polgári jogi és munkaügyi rendelkezések alkotják.</p>
          <p>2.4. Egy konkrét állásra jelentkezéskor a hirdető munkáltató vagy a hirdetésben feltüntetett, saját nevében eljáró HR-szolgáltató külön adatkezelő is lehet. Saját adatkezeléséről külön tájékoztatást köteles adni. A Workzy tájékoztatója nem helyettesíti a munkáltató tájékoztatóját.</p>

          <h2 className="text-2xl font-bold text-slate-800">3. Fogalmak</h2>
          <ul>
            <li><strong>Adatfeldolgozó:</strong> aki az Adatkezelő vagy más adatkezelő nevében, annak dokumentált utasításai alapján személyes adatot kezel.</li>
            <li><strong>Állás:</strong> egy meghatározott munkakörhöz és lényegében egységes foglalkoztatási feltételekhez tartozó hirdetési egység.</li>
            <li><strong>Érvényes jelentkező:</strong> a Workzy ÁSZF-ben meghatározott kötelező adatokat és használható kapcsolattartási adatot tartalmazó, nem spam-, nem teszt- és nem nyilvánvalóan duplikált jelentkezés.</li>
            <li><strong>Felhasználó:</strong> az üzleti ügyfél nevében meghívott természetes személy, például tulajdonos, adminisztrátor vagy recruiter.</li>
            <li><strong>Jelentkező:</strong> a Workzy felületén vagy Workzy által kezelt jelentkezési folyamatban egy állásra jelentkező, 18. életévét betöltött természetes személy.</li>
            <li><strong>Megrendelő / Munkáltató:</strong> a Workzy üzleti szolgáltatását használó, magyar adószámmal rendelkező szervezet.</li>
            <li><strong>Profilozás:</strong> személyes adatok automatizált értékelése bizonyos jellemzők elemzése vagy előrejelzése céljából.</li>
            <li><strong>Tehetségadatbázis:</strong> külön, önkéntes hozzájárulással működő Workzy-adatállomány, amelyben a jelentkező későbbi álláslehetőségekhez 12 hónapig megkereshető.</li>
            <li><strong>Zárolt jelentkező:</strong> a próba első öt érvényes jelentkezését követően beérkezett olyan jelentkező, akinek személyes adatai a Megrendelő számára a megfelelő fizetős csomag aktiválásáig nem láthatók.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800">4. Adatkezelési alapelvek</h2>
          <p>A Workzy a személyes adatokat jogszerűen, tisztességesen és átláthatóan; meghatározott célból; a szükséges adatkörre korlátozva; pontosan; korlátozott ideig; megfelelő biztonság mellett és elszámoltatható módon kezeli.</p>
          <ul>
            <li>A Workzy nem kér be olyan adatot, amely a konkrét szolgáltatáshoz vagy álláspályázathoz nem szükséges.</li>
            <li>A jelentkezőket nem érheti hátrány azért, mert a tehetségadatbázishoz, állásajánló emailekhez, analitikához vagy marketinghez nem adnak hozzájárulást.</li>
            <li>A hozzájárulás bármikor, a megadásával azonos nehézségű módon visszavonható; a visszavonás nem érinti a korábbi adatkezelés jogszerűségét.</li>
            <li>A Workzy külön kezeli a szolgáltatási értesítéseket, a marketingüzeneteket és a fizetős szolgáltatás teljesítéséhez tartozó emaileket.</li>
            <li>Ahol lehetséges, statisztikai és fejlesztési célra kizárólag megfelelően anonimizált vagy összesített adatot használ.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800">5. A Workzy adatvédelmi szerepei</h2>
          <table>
            <tbody>
              <tr><td><strong>Workzy mint önálló adatkezelő</strong></td><td>Ide tartozik különösen a weboldal és fiókok működtetése, regisztráció, hozzáférés-kezelés, cégellenőrzés, szerződés és fizetés adminisztrációja, számlázás előkészítése, biztonság és visszaélés-megelőzés, ügyfélszolgálat, marketing-hozzájárulások, jelentkezői fiók, jelentkezés fogadása és továbbítása, saját tehetségadatbázis és állásajánló rendszer, incidenskezelés, valamint anonimizált statisztika.</td></tr>
              <tr><td><strong>Munkáltató / HR-szolgáltató mint önálló adatkezelő</strong></td><td>A konkrét állásra megnyitott vagy átadott jelentkezők kiválasztása, kapcsolattartása, interjúztatása, döntése, saját rendszerbe történő átvétele és saját megőrzése tekintetében a hirdető szervezet önálló adatkezelő, és saját tájékoztatóval, jogalappal, határidőkkel és érintetti folyamattal tartozik.</td></tr>
              <tr><td><strong>Workzy mint adatfeldolgozó</strong></td><td>Azokban a technikai műveletekben, amelyeket a Workzy kizárólag a Megrendelő dokumentált utasítása alapján, a Megrendelő adatkezelési céljára végez, a Workzy adatfeldolgozóként járhat el. Ezt az <a href="/adatfeldolgozasi-melleklet">Adatfeldolgozási Melléklet</a> szabályozza.</td></tr>
              <tr><td><strong>Külső szolgáltató saját vagy közös adatkezelőként</strong></td><td>A SimplePay, Google, Meta vagy más szolgáltató a saját feltételei és a konkrét adatfolyam szerint önálló vagy közös adatkezelő lehet, a hatályos szerződések szerinti szerepmegosztásban.</td></tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-slate-800">6. Az adatok forrásai</h2>
          <ul>
            <li>az érintett közvetlenül: regisztráció, profil, jelentkezési űrlap, CV és engedélyezett dokumentum, email, ügyfélszolgálati vagy panaszbeadvány, hozzájárulási választás;</li>
            <li>az üzleti ügyfél vagy meghatalmazott felhasználó: cég-, hirdetési, kapcsolattartási, szerepkör- és számlázási adatok;</li>
            <li>nyilvános vagy hivatalos vállalkozói és adózási nyilvántartások: a vállalkozás azonosítása, státusza és a visszaélések megelőzése céljából;</li>
            <li>a SimplePay és a Billingo: fizetési vagy számlázási státusz, tranzakció- és bizonylatazonosítók, technikai visszaigazolások;</li>
            <li>a Workzy technikai rendszerei és szolgáltatói: bejelentkezési, hozzáférési, hibakeresési, biztonsági és kézbesítési naplók;</li>
            <li>a hozzájárulás után működő Google- és Meta-eszközök: látogatási és kampánymérési események a tényleges beállítások szerint;</li>
            <li>amennyiben a jelentkező Workzy által kezelt külső hirdetési űrlapon adja meg adatait, az adott űrlap szolgáltatója és a jelentkező közvetlen adatközlése.</li>
          </ul>
          <p>A Workzy nem vásárol és nem épít fel jelentkezői adatbázist ismeretlen forrásból származó, hozzájárulás nélküli listákból. Más munkáltatóhoz jelentkező személy adata nem válik automatikusan egy új munkáltató számára hozzáférhetővé.</p>

          <h2 className="text-2xl font-bold text-slate-800">7. Weboldal, technikai működés és biztonsági naplók</h2>
          <h3 className="text-xl font-semibold text-slate-700">7.1. Weboldal kiszolgálása és technikai naplók</h3>
          <table>
            <tbody>
              <tr><td>Cél</td><td>Az oldal biztonságos megjelenítése, hálózati kommunikáció, hibakeresés, rendelkezésre állás és visszaélések megelőzése.</td></tr>
              <tr><td>Érintettek</td><td>Weboldallátogatók, regisztrált felhasználók és jelentkezők.</td></tr>
              <tr><td>Kezelt adatok</td><td>IP-cím, időpont, kért oldal vagy végpont, böngésző- és eszközjellemzők, válaszkód, hibainformáció, technikai azonosítók; szükség szerint hozzáférési események.</td></tr>
              <tr><td>Jogalap</td><td>GDPR 6. cikk (1) f): a Workzy jogos érdeke a biztonságos és bizonyítható szolgáltatásműködés; bejelentkezett használatnál részben GDPR 6. cikk (1) b).</td></tr>
              <tr><td>Címzettek</td><td>Vercel, Supabase és a technikai infrastruktúra-szolgáltatók; korlátozott Workzy-adminisztrátorok.</td></tr>
              <tr><td>Megőrzés</td><td>A biztonsági és hozzáférési naplók főszabály szerint 12 hónapig; konkrét incidens vagy jogi igény esetén a szükséges ideig.</td></tr>
            </tbody>
          </table>
          <h3 className="text-xl font-semibold text-slate-700">7.2. Hitelesítés, munkamenet és fiókbiztonság</h3>
          <table>
            <tbody>
              <tr><td>Cél</td><td>Fiók létrehozása, bejelentkezés, munkamenet fenntartása, jogosultság-ellenőrzés, jelszó-visszaállítás, többfaktoros azonosítás és biztonsági riasztás.</td></tr>
              <tr><td>Kezelt adatok</td><td>Email-cím, belső felhasználói azonosító, hitelesítési állapot, munkamenet- és eszközadatok, bejelentkezési időpontok, szerepkörök, 2FA-állapot; olvasható jelszót a Workzy nem tárol.</td></tr>
              <tr><td>Jogalap</td><td>GDPR 6. cikk (1) b) és f).</td></tr>
              <tr><td>Címzettek</td><td>Supabase; jogosult Workzy-adminisztrátorok.</td></tr>
              <tr><td>Megőrzés</td><td>A fiók fennállásáig, majd a megszüntetési és naplómegőrzési szabályok szerint.</td></tr>
              <tr><td>Megjegyzés</td><td>Adminisztrátoroknál kötelező 2FA; ügyféloldalon opcionális, de ajánlott. Érzékeny műveleteknél újrahitelesítés kérhető.</td></tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-slate-800">8. Üzleti ügyfelek, kapcsolattartók és munkáltatói fiókok</h2>
          <h3 className="text-xl font-semibold text-slate-700">8.1. Regisztráció és szervezeti fiók</h3>
          <table>
            <tbody>
              <tr><td>Cél</td><td>A vállalkozás és a nevében eljáró személy azonosítása, a szolgáltatás biztosítása, szerepkörök és meghívások kezelése.</td></tr>
              <tr><td>Kezelt adatok</td><td>Név, munkahelyi email, telefonszám, szervezet, beosztás vagy szerepkör, meghívási és elfogadási adatok, felhasználói azonosító, jogosultságok, aktivitási és auditadatok.</td></tr>
              <tr><td>Jogalap</td><td>GDPR 6. cikk (1) b) a szolgáltatási kapcsolat és GDPR 6. cikk (1) f) a szervezeti hozzáférések biztonságos kezelése érdekében.</td></tr>
              <tr><td>Címzettek</td><td>Supabase, automatikus emailküldő szolgáltató, jogosult szervezeti adminisztrátorok és Workzy-adminisztrátorok.</td></tr>
              <tr><td>Megőrzés</td><td>A fiók fennállásáig; megszüntetés után a nem szükséges profil- és beállításadatok 90 napon belül törlendők vagy anonimizálandók, a külön megőrzendő adatok kivételével.</td></tr>
              <tr><td>Megjegyzés</td><td>Csak tulajdonos vagy admin rendelhet, fogadhat el jogi feltételeket és hagyhatja jóvá az első kampányindítást. A szervezet felel a meghívott felhasználók jogosultságáért.</td></tr>
            </tbody>
          </table>
          <h3 className="text-xl font-semibold text-slate-700">8.2. Felhasználói és jogosultsági auditnapló</h3>
          <table>
            <tbody>
              <tr><td>Cél</td><td>A szervezeti felelősség, jogosultságváltozások, kritikus műveletek és visszaélések bizonyíthatósága.</td></tr>
              <tr><td>Kezelt adatok</td><td>Felhasználói azonosító, szervezet, szerepkör, időpont, művelet, érintett rekord, előző és új állapot, technikai azonosítók.</td></tr>
              <tr><td>Jogalap</td><td>GDPR 6. cikk (1) f).</td></tr>
              <tr><td>Címzettek</td><td>Korlátozott Workzy-adminisztrátorok; szükség esetén hatóság vagy jogi képviselő.</td></tr>
              <tr><td>Megőrzés</td><td>Főszabály szerint 12 hónap, kritikus szerződéses vagy jogi bizonyíték esetén legfeljebb az igényérvényesítési időszak végéig.</td></tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-slate-800">9. Cégellenőrzés, díjmentes próba és kampányműködés</h2>
          <h3 className="text-xl font-semibold text-slate-700">9.1. Cég- és adószámellenőrzés</h3>
          <table>
            <tbody>
              <tr><td>Cél</td><td>Annak ellenőrzése, hogy a szolgáltatást magyar adószámmal rendelkező, működő szervezet igényli; számlázási pontosság és próba-visszaélés megelőzése.</td></tr>
              <tr><td>Kezelt adatok</td><td>Cégnév, adószám és adószámtörzs, székhely, státusz, számlázási adatok, kapcsolattartó, ellenőrzés eredménye és időpontja.</td></tr>
              <tr><td>Jogalap</td><td>GDPR 6. cikk (1) b), f), számlázási adatoknál 6. cikk (1) c).</td></tr>
              <tr><td>Megőrzés</td><td>A fiók és szerződés fennállásáig; rendelési és számlázási bizonyítékoknál legalább 8 év.</td></tr>
              <tr><td>Megjegyzés</td><td>A díjmentes próba adóalanyonként egyszer vehető igénybe, az adószámtörzs alapján. Valótlan vagy eltérő adat kézi ellenőrzést eredményezhet.</td></tr>
            </tbody>
          </table>
          <h3 className="text-xl font-semibold text-slate-700">9.2. Próba- és kampányállapotok</h3>
          <table>
            <tbody>
              <tr><td>Cél</td><td>A 72 órás próba, az első öt érvényes jelentkező, a zárolt jelentkezők száma, kampányidőszak, szünet és hozzáférési határidők kezelése.</td></tr>
              <tr><td>Kezelt adatok</td><td>Állás- és kampányazonosító, publikálási és aktiválási időpontok, jelentkezésszám, érvényességi státusz, zárolási állapot, hozzáférés, panasz és korrekció adatai.</td></tr>
              <tr><td>Jogalap</td><td>GDPR 6. cikk (1) b) és f).</td></tr>
              <tr><td>Megjegyzés</td><td>A zárolt jelentkezőkről a Megrendelő kizárólag darabszámot láthat; név, kezdőbetű, fénykép, elérhetőség, CV, lakóhely vagy azonosítható válasz nem jelenhet meg.</td></tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-slate-800">10. Megrendelés, SimplePay-fizetés és Billingo-számlázás</h2>
          <h3 className="text-xl font-semibold text-slate-700">10.1. Megrendelés és elektronikus szerződés bizonyítása</h3>
          <table>
            <tbody>
              <tr><td>Cél</td><td>A csomag, ár, állás, szervezet, jogosult megrendelő és elfogadott jogi feltételek rögzítése, szerződés létrehozása és teljesítése.</td></tr>
              <tr><td>Kezelt adatok</td><td>Cég- és kapcsolattartási adatok, csomag, ár, állásazonosító, rendelésazonosító, elfogadott dokumentumverziók, nyilatkozatok, időpont, felhasználói és technikai azonosítók.</td></tr>
              <tr><td>Jogalap</td><td>GDPR 6. cikk (1) b), c) és f).</td></tr>
              <tr><td>Címzettek</td><td>SimplePay a fizetéshez; Billingo a számlázáshoz; automatikus emailküldő; jogosult Workzy-adminisztrátorok.</td></tr>
              <tr><td>Megőrzés</td><td>Megrendelési és szerződéses adatok legalább 8 évig, jogvita esetén a szükséges további ideig.</td></tr>
            </tbody>
          </table>
          <h3 className="text-xl font-semibold text-slate-700">10.2. SimplePay-fizetés</h3>
          <table>
            <tbody>
              <tr><td>Cél</td><td>Bankkártyás vagy qvik fizetés kezdeményezése, státuszellenőrzése, kettős terhelés megelőzése, aktiválás és visszatérítés kezelése.</td></tr>
              <tr><td>Kezelt adatok</td><td>Rendelésazonosító, összeg, pénznem, csomag, számlázási és kapcsolattartási alapadatok, SimplePay-tranzakcióazonosító, státusz, időpontok és technikai válaszok. A bankkártya teljes adatait a Workzy nem kapja meg és nem tárolja.</td></tr>
              <tr><td>Jogalap</td><td>GDPR 6. cikk (1) b), c), valamint biztonsági és visszaélés-megelőzési célra 6. cikk (1) f).</td></tr>
              <tr><td>Címzettek</td><td>SimplePay; pénzügyi szolgáltatók; szükség esetén könyvelő, hatóság vagy jogi képviselő.</td></tr>
              <tr><td>Megőrzés</td><td>A rendelési és számviteli megőrzéshez igazodóan legalább 8 év; a SimplePay saját megőrzési ideje saját tájékoztatójában szerepel.</td></tr>
              <tr><td>Megjegyzés</td><td>A Workzy csak hiteles szerver&ndash;szerver visszaigazolás alapján aktivál.</td></tr>
            </tbody>
          </table>
          <h3 className="text-xl font-semibold text-slate-700">10.3. Billingo-számlázás</h3>
          <table>
            <tbody>
              <tr><td>Cél</td><td>Számla, módosító vagy érvénytelenítő bizonylat jogszerű kiállítása és kézbesítése.</td></tr>
              <tr><td>Kezelt adatok</td><td>Cégnév vagy név, cím, adószám, email, rendelés- és bizonylatadatok, szolgáltatás megnevezése, összeg, pénznem, teljesítési és fizetési adatok, Billingo-azonosítók.</td></tr>
              <tr><td>Jogalap</td><td>GDPR 6. cikk (1) c) és a szerződés teljesítéséhez 6. cikk (1) b).</td></tr>
              <tr><td>Címzettek</td><td>Billingo Technologies Zrt.; NAV és más jogszabály szerinti címzettek; könyvelő.</td></tr>
              <tr><td>Megőrzés</td><td>A számviteli bizonylatokra irányadó legalább 8 éves megőrzés.</td></tr>
              <tr><td>Megjegyzés</td><td>Jelöltprofil, CV és szűrési válasz nem továbbítható a Billingo részére.</td></tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-slate-800">11. Ügyfélszolgálat, panaszok és jogi igények</h2>
          <h3 className="text-xl font-semibold text-slate-700">11.1. Ügyfélszolgálati megkeresések</h3>
          <table>
            <tbody>
              <tr><td>Cél</td><td>Kérdések, technikai hibák, fizetési vagy hozzáférési problémák megválaszolása és dokumentálása.</td></tr>
              <tr><td>Kezelt adatok</td><td>Név, email, telefonszám, szervezet, fiók/rendelés/kampány/jelentkezés azonosítója, üzenet és melléklet, kommunikáció és intézkedés adatai.</td></tr>
              <tr><td>Jogalap</td><td>GDPR 6. cikk (1) b), f), szükség esetén c).</td></tr>
              <tr><td>Címzettek</td><td>Hostinger email, automatikus emailküldő, jogosult Workzy-adminisztrátor, technikai szolgáltató vagy jogi szakértő.</td></tr>
              <tr><td>Megőrzés</td><td>Az ügy lezárásától főszabály szerint 5 év, ha a tartalom szerződéses vagy jogi igény bizonyításához szükséges; egyszerű technikai kérdés rövidebb ideig is törölhető.</td></tr>
            </tbody>
          </table>
          <h3 className="text-xl font-semibold text-slate-700">11.2. Hivatalos panaszok</h3>
          <table>
            <tbody>
              <tr><td>Cél</td><td>Írásbeli panasz kivizsgálása, megválaszolása és bizonyítása.</td></tr>
              <tr><td>Kezelt adatok</td><td>Cég vagy érintett neve, adószám, kapcsolattartás, azonosítók, panasz részletei, kért intézkedés, bizonyítékok, válasz és intézkedések.</td></tr>
              <tr><td>Jogalap</td><td>GDPR 6. cikk (1) b), c) és f).</td></tr>
              <tr><td>Megőrzés</td><td>A panasz lezárásától 5 év, számviteli vagy jogi kötelezettség esetén tovább.</td></tr>
              <tr><td>Megjegyzés</td><td>A Workzy belső célja 5 munkanapos válasz; a hivatalos panaszra a válaszadási határidő legfeljebb 30 nap.</td></tr>
            </tbody>
          </table>
          <h3 className="text-xl font-semibold text-slate-700">11.3. Jogi igények és hatósági megkeresések</h3>
          <table>
            <tbody>
              <tr><td>Cél</td><td>Jogos követelés előterjesztése, védelme, bizonyítása; jogszabályon alapuló adatszolgáltatás.</td></tr>
              <tr><td>Jogalap</td><td>GDPR 6. cikk (1) c) és f).</td></tr>
              <tr><td>Címzettek</td><td>Bíróság, hatóság, jogi képviselő, biztosító vagy szakértő a jogszerű és szükséges körben.</td></tr>
              <tr><td>Megőrzés</td><td>Az eljárás és az igényérvényesítési határidő végéig, jogerős lezárás esetén a szükséges ideig.</td></tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-slate-800">12. Ügyfélmarketing és marketingtiltó lista</h2>
          <h3 className="text-xl font-semibold text-slate-700">12.1. Üzleti kapcsolattartók emailmarketingje</h3>
          <table>
            <tbody>
              <tr><td>Cél</td><td>Workzy-újdonságok, ajánlatok, akciók és toborzási szolgáltatások bemutatása.</td></tr>
              <tr><td>Érintettek</td><td>Azok a természetes személy céges kapcsolattartók, akik regisztrációkor vagy checkoutkor külön feliratkoznak.</td></tr>
              <tr><td>Kezelt adatok</td><td>Név, email, szervezet, feliratkozás forrása, időpontja, szövegverziója, kampány- és kézbesítési adatok, leiratkozás.</td></tr>
              <tr><td>Jogalap</td><td>GDPR 6. cikk (1) a) &ndash; önkéntes hozzájárulás; a gazdasági reklámtevékenység szabályai.</td></tr>
              <tr><td>Megőrzés</td><td>A hozzájárulás fennállása alatt; a hozzájárulás és leiratkozás bizonyítéka a visszavonástól 5 évig.</td></tr>
              <tr><td>Megjegyzés</td><td>A checkbox alapértelmezetten üres. Nincs double opt-in. A vásárlás és szolgáltatás nem függ a feliratkozástól. Minden marketingemailben egykattintásos leiratkozás szükséges.</td></tr>
            </tbody>
          </table>
          <h3 className="text-xl font-semibold text-slate-700">12.2. Marketingtiltó lista</h3>
          <table>
            <tbody>
              <tr><td>Cél</td><td>Annak biztosítása, hogy a leiratkozott cím ne kerüljön véletlenül vissza marketinglistára.</td></tr>
              <tr><td>Kezelt adatok</td><td>Email-cím, leiratkozás vagy tiltás időpontja, szükséges technikai bizonyíték.</td></tr>
              <tr><td>Jogalap</td><td>GDPR 6. cikk (1) f): jogos érdek a leiratkozás tartós érvényesítése és bizonyítása.</td></tr>
              <tr><td>Megőrzés</td><td>Főszabály szerint a leiratkozástól 5 évig, kizárólag tiltási célra.</td></tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-slate-800">13. Jelentkezés egy konkrét állásra</h2>
          <h3 className="text-xl font-semibold text-slate-700">13.1. Jelentkezési űrlap és továbbítás</h3>
          <table>
            <tbody>
              <tr><td>Cél</td><td>A jelentkező által kiválasztott állásra történő jelentkezés fogadása, rögzítése, érvényességének technikai ellenőrzése, a megfelelő hirdetőhöz történő továbbítása és a folyamat követhetősége.</td></tr>
              <tr><td>Érintettek</td><td>18. életévüket betöltött jelentkezők.</td></tr>
              <tr><td>Kezelt adatok</td><td>Név, email, telefonszám, jelentkezés időpontja és azonosítója, állás és hirdető, lakóhely vagy vállalt munkavégzési hely a szükséges pontossággal, munkakezdés, tapasztalat, képesítés, engedély, műszakvállalás, szűrési válaszok, CV és engedélyezett dokumentumok, jelentkezési nyilatkozatok, technikai és állapotadatok.</td></tr>
              <tr><td>Jogalap</td><td>A Workzy saját jelentkezés-fogadási és továbbítási szolgáltatásához GDPR 6. cikk (1) b); biztonságra, duplikáció- és spamellenőrzésre 6. cikk (1) f). A munkáltató saját kiválasztási jogalapját külön határozza meg.</td></tr>
              <tr><td>Címzettek</td><td>A hirdetésben egyértelműen megnevezett munkáltató vagy saját nevében eljáró HR-szolgáltató; Supabase; automatikus emailküldő; jogosult Workzy-adminisztrátorok.</td></tr>
              <tr><td>Megőrzés</td><td>A Megrendelő hozzáférése: a díjmentesen látható első öt jelentkezőnél a próba lezárásától 30 nap; fizetős kampány jelentkezőinél a kampány végétől 90 nap. Lejárat után Workzy-oldalon azonnali hozzáférésmegszüntetés, majd 30 napon belüli törlés vagy anonimizálás, kivéve külön jogalapot.</td></tr>
              <tr><td>Megjegyzés</td><td>A jelentkezőnek a beküldés előtt látnia kell a hirdető kilétét és a lényegi adatkezelési tájékoztatást. Anonim munkáltatói hirdetés nem használható.</td></tr>
            </tbody>
          </table>
          <h3 className="text-xl font-semibold text-slate-700">13.2. A hirdetés és jelentkezés verziókapcsolata</h3>
          <p>
            A Workzy rögzíti, hogy a jelentkező milyen tartalmú álláshirdetés alapján nyújtotta be jelentkezését (hirdetésverzió, jóváhagyási és
            publikálási időpont, kapcsolódó jelentkezésazonosító, lényeges módosítások), GDPR 6. cikk (1) b) és f) jogalapon, a kapcsolódó
            jelentkezési, szerződéses és igényérvényesítési időtartam szerinti megőrzéssel. A Workzy nem változtathatja meg jóváhagyás nélkül a
            munkakör lényegét, bért, munkahelyet vagy más anyagi foglalkoztatási feltételt.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">14. CV-k, dokumentumok és automatikus adatkinyerés</h2>
          <h3 className="text-xl font-semibold text-slate-700">14.1. CV és engedélyezett dokumentumok tárolása</h3>
          <table>
            <tbody>
              <tr><td>Cél</td><td>A jelentkezéshez szükséges vagy opcionális dokumentum fogadása és a hirdető számára hozzáférhetővé tétele.</td></tr>
              <tr><td>Kezelt adatok</td><td>CV; végzettség- vagy képesítésigazolás; vezetői vagy gépkezelői jogosultság fennállását igazoló dokumentum; szakmai tanúsítvány; előzetesen jóváhagyott, munkakör-specifikus dokumentum. Fájlnév, típus, méret, feltöltési idő, biztonsági vizsgálat eredménye.</td></tr>
              <tr><td>Jogalap</td><td>GDPR 6. cikk (1) b); biztonsági ellenőrzésnél 6. cikk (1) f).</td></tr>
              <tr><td>Címzettek</td><td>Hirdető a hozzáférési időben; Supabase Storage.</td></tr>
              <tr><td>Megőrzés</td><td>A kapcsolódó jelentkezésre irányadó időtartam, majd 30 napon belüli törlés; mentésből legfeljebb további 30 nap alatt kifut.</td></tr>
              <tr><td>Megjegyzés</td><td>A Workzy nem hitelesíti a dokumentum valódiságát. Jelszóval védett, sérült vagy veszélyes fájl elutasítható. Külön profilfotó nincs; a CV-ben előforduló fénykép nem kötelező, nem ösztönzött és nem használható rangsorolásra.</td></tr>
            </tbody>
          </table>
          <p>
            <strong>Tiltott dokumentumok és adatok:</strong> a Workzy nem kér és nem fogad személyazonosító igazolványt, lakcímkártyát,
            adókártyát, TAJ-kártyát, bankszámla-igazolást, erkölcsi bizonyítványt, egészségügyi dokumentumot, diagnózist, gyógyszerelési adatot,
            terhességre vagy családtervezésre vonatkozó adatot, alkalmassági igazolást vagy más szükségtelen különleges adatot.
          </p>
          <h3 className="text-xl font-semibold text-slate-700">14.2. Automatikus CV-adatkinyerés és összefoglalás</h3>
          <table>
            <tbody>
              <tr><td>Cél</td><td>A CV-ből a jelentkezési folyamatot segítő strukturált adatok &ndash; például tapasztalat, képesítés és engedély &ndash; kinyerése, összefoglalása és a jelentkező általi ellenőrzése.</td></tr>
              <tr><td>Kezelt adatok</td><td>A CV szövege, kinyert szakmai adatok, rendszerbizonytalanság vagy hibajelzés, jelentkezői javítás, eredeti dokumentum.</td></tr>
              <tr><td>Jogalap</td><td>GDPR 6. cikk (1) b).</td></tr>
              <tr><td>Megőrzés</td><td>A kapcsolódó jelentkezés vagy tehetségadatbázis időtartama szerint.</td></tr>
              <tr><td>Megjegyzés</td><td>A kinyert adat automatizált és nem hitelesített. A jelentkező beküldés előtt megtekintheti és javíthatja. Eltérés esetén az eredeti dokumentum irányadó. Jelöltadat nem küldhető külső AI-szolgáltatóhoz a szolgáltató, régió, adatfeldolgozási szerződés, adattovábbítás és tanítási felhasználás előzetes ellenőrzése nélkül.</td></tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-slate-800">15. Szűrőkérdések, rangsorolás és emberi döntés</h2>
          <h3 className="text-xl font-semibold text-slate-700">15.1. Objektív szűrőkérdések</h3>
          <p>
            A Workzy a munkakörhöz ténylegesen szükséges feltételeket (képesítés, jogosultság, műszakvállalás, munkakezdés, helyszín, releváns
            tapasztalat) méri fel objektív kérdésekkel, GDPR 6. cikk (1) b) jogalapon, a munkáltató saját kiválasztási jogalapja mellett.
            Egészségre, fogyatékosság részleteire, terhességre, családtervezésre, vallásra, politikára, etnikumra, szexuális irányultságra,
            szakszervezeti tagságra vagy más védett tulajdonságra irányuló kérdés tiltott.
          </p>
          <h3 className="text-xl font-semibold text-slate-700">15.2. Rangsorolás, jelölés és döntéstámogatás</h3>
          <p>
            A jelentkezésben megadott objektív adatokból a Workzy pontot, címkét, megfelelési jelzést, sorrendet vagy összefoglalást
            számíthat a munkáltató emberi döntésének támogatására (GDPR 6. cikk (1) b) és f)). Nincs kizárólag automatizált elutasítás,
            továbbjuttatás vagy felvétel. A rendszer nem hoz a GDPR 22. cikke szerinti, joghatással vagy hasonlóan jelentős hatással járó önálló
            döntést. A végső döntés emberé, a jelölt kérhet magyarázatot és javíthatja a hibás adatot.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">16. Munkáltatói hozzáférés, zárolás, export és naplózás</h2>
          <h3 className="text-xl font-semibold text-slate-700">16.1. Első öt és zárolt jelentkezők</h3>
          <p>
            A próba szolgáltatási szabályai szerint a jelentkezés sorrendje, érvényességi státusza, hozzáférési jogosultsága, megnyitási és
            feloldási állapota kerül rögzítésre (GDPR 6. cikk (1) b) és f)). Zárolt állapotban az ügyfél számára csak darabszám látható. A
            fizetős csomag aktiválása után a korábban zárolt jelentkezők hozzáférhetővé válhatnak, és teljes új 14 napos kampány indul.
          </p>
          <h3 className="text-xl font-semibold text-slate-700">16.2. Megnyitás, letöltés és export naplózása</h3>
          <p>
            A Workzy naplózza, hogy ki, mikor, melyik jelöltet vagy CV-t nyitotta meg, töltötte le vagy exportálta (szervezet, felhasználó,
            eszköz és művelet azonosítója), GDPR 6. cikk (1) f) jogalapon, főszabály szerint 12 hónapig, incidens vagy jogi igény esetén tovább.
            A hozzáférési idő lejárta után Workzy-oldali megnyitás és export megszűnik. A korábban letöltött vagy más rendszerbe átvett
            másolatot a Workzy technikailag nem tudja távolról törölni; annak kezeléséért a munkáltató felel.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">17. Jelentkezés visszavonása és státuszértesítések</h2>
          <p>
            17.1. A jelentkező visszavonhatja jelentkezését; ennek időpontja és a végrehajtási napló rögzítésre kerül (GDPR 6. cikk (1) b), f),
            hozzájárulásos feldolgozásnál 6. cikk (1) a) visszavonása). A Workzy megszünteti a munkáltató további platformhozzáférését, ahol ez
            technikailag lehetséges, és felszólítja saját megőrzési jogalapjának felülvizsgálatára &ndash; a korábban letöltött másolatot azonban
            távolról nem tudja törölni.
          </p>
          <p>
            17.2. A jelentkező szolgáltatási értesítést kap a jelentkezés beküldéséről, visszavonásáról, igazolható státuszváltozásáról,
            adatmegőrzési lejáratáról, biztonsági vagy adatvédelmi eseményéről (GDPR 6. cikk (1) b), c) vagy f)). Az üzenet nem ígér választ,
            interjút vagy felvételt, és nem állítja, hogy a munkáltató megnyitotta a jelentkezést, ha ezt a rendszer nem tudja hitelesen
            igazolni.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">18. Tehetségadatbázis és állásajánló emailek</h2>
          <h3 className="text-xl font-semibold text-slate-700">18.1. Tehetségadatbázis</h3>
          <p>
            Aki külön, önkéntes választással hozzájárul, annak profilja, preferenciái, szakmai tapasztalata, képesítése, engedélye,
            munkavégzési preferenciái és CV-je 12 hónapig kereshető a Workzy tehetségadatbázisában, hogy releváns későbbi álláslehetőséggel
            megkereshessük (GDPR 6. cikk (1) a) &ndash; hozzájárulás). 12 hónap után új aktív megerősítés hiányában törlés vagy anonimizálás
            történik. A Workzy először a jelöltet keresi meg az új állással; új munkáltató csak külön jelölti megerősítés vagy tényleges új
            jelentkezés után kaphat azonosítható adatot. A hozzájárulás bármikor visszavonható.
          </p>
          <h3 className="text-xl font-semibold text-slate-700">18.2. Állásajánló emailek</h3>
          <p>
            Aki külön hozzájárul, emailben kaphat hasonló vagy beállított feltételeknek megfelelő állásajánlatokat (GDPR 6. cikk (1) a)),
            hozzájárulástól számított 12 hónapig vagy korábbi visszavonásig; a bizonyíték a visszavonástól 5 évig marad meg. Főszabály szerint
            legfeljebb heti két állásajánló email küldhető. Minden emailben egykattintásos leiratkozás, beállításmódosítás és szüneteltetés
            szükséges.
          </p>
          <p>
            A jelentkezési űrlap végén két egyenrangú, előre nem kiválasztott lehetőség jelenhet meg: &bdquo;Jelentkezem és kérek hasonló
            állásajánlatokat&rdquo; és &bdquo;Csak erre az állásra jelentkezem&rdquo;. A jelentkező külön kapcsolhatja ki az állásajánló
            emaileket és a tehetségadatbázisban való szereplést, vagy egy kattintással visszavonhatja mindkét hozzájárulást. Az email
            leiratkozása önmagában nem törli a tehetségadatbázis-profilt, ha arra külön érvényes hozzájárulás marad fenn.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">19. Jelentkezői fiók és önkiszolgáló adatvédelmi felület</h2>
          <p>
            19.1. A jelentkező fiókjában megtekintheti és javíthatja adatait, exportálhatja azokat, kezelheti jelentkezéseit, visszavonhatja
            hozzájárulásait és törlési kérelmet indíthat (GDPR 6. cikk (1) b), a tehetségadatbázisnál és állásajánlónál 6. cikk (1) a),
            biztonságnál 6. cikk (1) f)). Ha a fiók 24 hónapig inaktív, nincs érvényes tehetségadatbázis-hozzájárulás és nincs folyamatban lévő
            jelentkezés, a fiók 30 napos előzetes figyelmeztetés után törölhető. Az önkiszolgáló felület nem írhatja felül a számviteli, jogi
            vagy biztonsági okból szükséges korlátozott megőrzést.
          </p>
          <p>
            19.2. Az érintetti kérelmet a Workzy fiókazonosítással vagy egyszer használatos emailes linkkel azonosítja, hogy illetéktelen
            személy ne férhessen hozzá más adataihoz. A Workzy nem kér automatikusan személyazonosító okmány másolatot; ilyen csak kivételesen,
            arányos és dokumentált esetben kérhető.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">20. Cookie-k, analitika és hirdetésmérés</h2>
          <p>
            20.1. A feltétlenül szükséges cookie-k (bejelentkezés, biztonság, munkamenet, fizetési folyamat, cookie-választás megjegyzése) a
            szükségességi jogalapon (GDPR 6. cikk (1) b) vagy f), illetve az elektronikus hírközlési szabályok szükségességi kivétele) működnek,
            és nem használhatók analitikai vagy marketingcélra.
          </p>
          <p>
            20.2. Az analitikai és marketingtechnológiák (látogatottság, konverzió és kampányhatékonyság mérése, hozzájárulás esetén
            hirdetésoptimalizálás) kizárólag hozzájárulással aktiválódnak (GDPR 6. cikk (1) a)). A hozzájárulási választást 12 havonta újra kell
            kérni, lényeges változáskor azonnal. A nem szükséges Google- és Meta-címkék hozzájárulásig nem töltődnek be, és elutasításkor nem
            indulhatnak el (Basic Consent Mode v2). A banner első rétegén egyenrangú &bdquo;Összes elfogadása&rdquo;, &bdquo;Összes
            elutasítása&rdquo; és &bdquo;Beállítások&rdquo; szükséges; opcionális kategóriák alapból kikapcsolva.
          </p>
          <p>
            A Workzy nem használ munkamenet-visszajátszást, billentyűleütés-rögzítést vagy szükségtelen részletes viselkedési profilozást. A
            láblécben mindig elérhető &bdquo;Cookie-beállítások&rdquo; link. A pontos cookie-lista és élettartamok a{" "}
            <a href="/cookie-tajekoztato">Cookie-tájékoztatóban</a> találhatók.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">21. Címzettek, adatfeldolgozók és külső szolgáltatók</h2>
          <p>
            A Workzy csak a feladathoz szükséges minimális adatot adja át. Jelöltprofil, CV és szűrési válasz nem kerülhet a Billingohoz,
            SimplePayhez, Google Analyticshez, Meta hirdetési eszközhöz vagy más, az adott célhoz nem szükséges szolgáltatóhoz.
          </p>
          <table>
            <thead>
              <tr><th>Szolgáltató</th><th>Feladat</th></tr>
            </thead>
            <tbody>
              <tr><td>Vercel</td><td>A webalkalmazás üzemeltetése, hálózati kiszolgálása és technikai naplók.</td></tr>
              <tr><td>Supabase</td><td>Adatbázis, hitelesítés, fájltárolás és kapcsolódó naplók.</td></tr>
              <tr><td>Hostinger</td><td>Céges email-postafiókok és ügyfélszolgálati levelezés.</td></tr>
              <tr><td>SimplePay</td><td>Bankkártyás és qvik fizetés lebonyolítása.</td></tr>
              <tr><td>Billingo</td><td>Automatikus számlázás; kizárólag számlázáshoz szükséges adat.</td></tr>
              <tr><td>Google</td><td>Hozzájárulásos analitika és hirdetésmérés, a tényleges konfiguráció szerint.</td></tr>
              <tr><td>Meta</td><td>Hozzájárulásos Pixel/Conversions API és kampánymérés, a tényleges konfiguráció szerint.</td></tr>
              <tr><td>Rackhost</td><td>Domain- és DNS-szolgáltatás.</td></tr>
              <tr><td>Tranzakciós és marketingemail-küldő szolgáltató</td><td>Tranzakciós és marketingemailek kézbesítése, leiratkozás-, bounce- és tiltólistakezelés. A konkrét szolgáltató kiválasztása folyamatban van.</td></tr>
              <tr><td>Süti-hozzájárulás kezelő (CMP)</td><td>Cookie-hozzájárulás gyűjtése, naplózása és a Consent Mode v2 vezérlés. A konkrét szolgáltató kiválasztása folyamatban van.</td></tr>
              <tr><td>Könyvelő, ügyvéd, auditor</td><td>Szakmai szolgáltatás a titoktartási és adatvédelmi kötelezettségek mellett, csak a szükséges adatokkal.</td></tr>
              <tr><td>Hatóságok és bíróságok</td><td>Kizárólag jogszabály, kötelező határozat vagy jogi igény alapján.</td></tr>
            </tbody>
          </table>
          <p>A szolgáltatói lista bővebb, technikai bontása a <a href="/adatfeldolgozasi-melleklet">Adatfeldolgozási Mellékletben</a> érhető el.</p>

          <h2 className="text-2xl font-bold text-slate-800">22. Nemzetközi adattovábbítás</h2>
          <p>22.1. A Workzy alapértelmezett célja az EU/EGT területén történő tárhely- és adatfeldolgozás. A szolgáltatók globális működése és al-adatfeldolgozói miatt azonban előfordulhat EU/EGT-n kívüli adatkezelés vagy távoli hozzáférés.</p>
          <p>22.2. EU/EGT-n kívüli továbbítás csak dokumentált jogalappal és megfelelő garanciával történhet, például megfelelőségi határozat, az Európai Bizottság általános szerződési feltételei, szükséges kiegészítő technikai és szervezési intézkedések, vagy más, a GDPR V. fejezete szerinti eszköz alapján.</p>
          <p>22.3. A Workzy a szolgáltató kiválasztásakor és rendszeresen ellenőrzi a feldolgozási régiót, al-adatfeldolgozókat, távoli hozzáférést, titkosítást, hatósági hozzáférés kockázatát és a szerződéses garanciákat.</p>

          <h2 className="text-2xl font-bold text-slate-800">23. Adatmegőrzés, törlés, anonimizálás és biztonsági mentések</h2>
          <table>
            <tbody>
              <tr><td>Megszüntetett ügyfélfiók</td><td>A működéshez már nem szükséges profil- és beállításadatok 90 napon belül törlendők vagy anonimizálandók. Szerződéses, számlázási, panasz-, visszaélési és tiltólistaadatok a saját idejükig megmaradnak.</td></tr>
              <tr><td>Megrendelés, szerződés, fizetés, számla</td><td>Legalább 8 év; jogvita vagy hatósági eljárás esetén a szükséges további ideig.</td></tr>
              <tr><td>Ingyenes próba első öt látható jelentkezője</td><td>Munkáltatói hozzáférés a próba lezárásától 30 napig.</td></tr>
              <tr><td>Fizetős kampány jelentkezői</td><td>Munkáltatói hozzáférés a kampány végétől 90 napig.</td></tr>
              <tr><td>Jelentkezői adat a hozzáférési idő után</td><td>Hozzáférés azonnal megszűnik, törlés vagy anonimizálás legfeljebb 30 napon belül, kivéve külön jogalap.</td></tr>
              <tr><td>Tehetségadatbázis és állásajánló hozzájárulás</td><td>12 hónap; utána új aktív megerősítés szükséges.</td></tr>
              <tr><td>Inaktív jelentkezői fiók</td><td>24 hónap inaktivitás után törölhető, ha nincs érvényes tehetségadatbázis-hozzájárulás vagy folyamatban lévő jelentkezés; 30 nappal korábbi figyelmeztetéssel.</td></tr>
              <tr><td>Marketing-hozzájárulás és leiratkozási bizonyíték</td><td>A hozzájárulás alatt, majd visszavonástól vagy leiratkozástól 5 évig.</td></tr>
              <tr><td>Biztonsági és hozzáférési naplók</td><td>Főszabály szerint 12 hónap; incidens vagy jogi igény esetén tovább.</td></tr>
              <tr><td>Panaszok</td><td>Lezárástól 5 év, vagy hosszabb jogszabályi/számviteli szükség esetén.</td></tr>
              <tr><td>Biztonsági mentések</td><td>Titkosított, gördülő mentések legfeljebb 30 napig; törölt adat a mentésekből ezen idő alatt kifut.</td></tr>
            </tbody>
          </table>
          <p>A törlési kérelmek belső feldolgozási célhatárideje 10 munkanap. A GDPR szerinti válaszadási határidő egy hónap, amely a jogszabály feltételei mellett meghosszabbítható. A törlés nem terjed ki azokra az adatokra, amelyeket jogi kötelezettség, jogi igény, biztonság vagy más érvényes jogalap miatt tovább kell őrizni; erről az érintettet tájékoztatni kell.</p>
          <p>A mentésben szereplő törölt adat normál működésben nem állítható vissza. Katasztrófa utáni teljes rendszer-visszaállítás esetén a korábban törölt adatokat ismételten törölni vagy anonimizálni kell a törlési napló alapján.</p>

          <h2 className="text-2xl font-bold text-slate-800">24. Adatbiztonság, incidenskezelés és hatásvizsgálat</h2>
          <p>24.1. A Workzy kockázatarányos technikai és szervezési intézkedéseket alkalmaz, különösen: szerepköralapú legkisebb jogosultság; adminisztrátori 2FA; titkosított adatátvitel és megfelelő nyugalmi titkosítás; titkok és API-kulcsok elkülönített kezelése; éles személyes adatok tiltása tesztkörnyezetben; biztonságos fájlfeltöltés; naplózás; gördülő mentés; helyreállítási teszt és rendszeres hozzáférés-felülvizsgálat.</p>
          <p>24.2. A személyes adatokhoz való jogosultságokat legalább negyedévente felül kell vizsgálni. Megszűnt munkaviszony vagy megbízás esetén a hozzáférést azonnal vissza kell vonni. Kritikus biztonsági javítás soron kívül telepítendő.</p>
          <p>24.3. Minden feltételezett adatvédelmi incidenst azonnal nyilvántartásba kell venni és kivizsgálni. A nyilvántartás tartalmazza az esemény jellegét, érintett adatokat és személyeket, következményeket, intézkedéseket, kockázatértékelést és a hatósági/érintetti bejelentésről hozott döntést. Kockázatos incidensnél a NAIH értesítése indokolatlan késedelem nélkül, lehetőség szerint 72 órán belül történik; magas kockázat esetén az érintetteket is tájékoztatni kell.</p>
          <p>24.4. A jelentkezői adatfolyamról adatvédelmi hatásvizsgálat (DPIA) készül, amely külön kitér a CV-adatkinyerésre, pontozásra/rangsorolásra, tehetségadatbázisra, exportra, munkáltatói hozzáférésre, hirdetési mérőeszközökre és nemzetközi adattovábbításra. Új AI-funkció, automatikus párosítás, új adattípus vagy jelentős szolgáltatóváltás előtt a DPIA-t frissíteni kell.</p>

          <h2 className="text-2xl font-bold text-slate-800">25. Érintetti jogok és azok gyakorlása</h2>
          <p>Az érintett a GDPR feltételei szerint az alábbi jogokat gyakorolhatja:</p>
          <ul>
            <li>átlátható tájékoztatáshoz és a személyes adataihoz való hozzáférés;</li>
            <li>pontatlan adatok helyesbítése és hiányos adatok kiegészítése;</li>
            <li>adatok törlése, ha annak jogszabályi feltételei fennállnak;</li>
            <li>adatkezelés korlátozása;</li>
            <li>adathordozhatóság a hozzájáruláson vagy szerződésen alapuló, automatizált adatkezelésnél;</li>
            <li>jogos érdeken alapuló adatkezelés elleni tiltakozás; közvetlen üzletszerzés esetén a tiltakozás feltétlenül érvényesítendő;</li>
            <li>hozzájárulás bármikori visszavonása;</li>
            <li>automatizált döntéshozatallal kapcsolatos jogok; a Workzy rendszerében nincs kizárólag automatizált, jelentős hatású kiválasztási döntés;</li>
            <li>panasz benyújtása a NAIH-hoz és bírósági jogorvoslat.</li>
          </ul>
          <p>A kérelmet az info@workzy.hu címre, postai úton a 2484 Gárdony, Géza utca 28. címre, vagy az erre szolgáló fiókfunkcióval lehet benyújtani. A Workzy a kérelem beérkezésétől számított egy hónapon belül tájékoztatást ad az intézkedésről; összetett vagy nagyszámú kérelem esetén a GDPR szerint legfeljebb további két hónappal hosszabbíthat, erről az első hónapon belül indokolt tájékoztatást ad.</p>
          <p>A Workzy a kérelmeket főszabály szerint díjmentesen teljesíti. Nyilvánvalóan megalapozatlan vagy ismétlődő, túlzó kérelem esetén a GDPR feltételei szerint észszerű díjat számíthat fel vagy megtagadhatja az intézkedést. A kérelem elutasítását indokolni kell, és tájékoztatást kell adni a jogorvoslatról.</p>
          <p>A jelentkező az önkiszolgáló felületen megtekintheti és javíthatja profilját, visszavonhatja jelentkezését, exportot és törlést kérhet, valamint külön-külön vagy együttesen visszavonhatja állásajánló- és tehetségadatbázis-hozzájárulását.</p>

          <h2 className="text-2xl font-bold text-slate-800">26. Jogorvoslat</h2>
          <p>Kérjük, hogy elsőként az info@workzy.hu címen jelezze kifogását, hogy azt gyorsan kivizsgálhassuk. Ez nem korlátozza a hatósági vagy bírósági jogorvoslatot.</p>
          <ul className="list-none pl-0">
            <li><strong>Hatóság:</strong> Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH)</li>
            <li><strong>Cím:</strong> 1055 Budapest, Falk Miksa utca 9&ndash;11.</li>
            <li><strong>Levelezési cím:</strong> 1363 Budapest, Pf. 9.</li>
            <li><strong>Email:</strong> <a href="mailto:ugyfelszolgalat@naih.hu">ugyfelszolgalat@naih.hu</a></li>
            <li><strong>Telefon:</strong> +36 (1) 391-1400</li>
            <li><strong>Web:</strong> <a href="https://www.naih.hu">https://www.naih.hu</a></li>
          </ul>
          <p>Az érintett a lakóhelye vagy tartózkodási helye szerint illetékes törvényszékhez, illetve a jogszabály szerint más illetékes bírósághoz is fordulhat.</p>

          <h2 className="text-2xl font-bold text-slate-800">27. Kiskorúak és tiltott adatkategóriák</h2>
          <p>27.1. A Workzy csak 18. életévüket betöltött jelentkezők önálló használatát támogatja. A rendszer lehetőleg életkori nyilatkozatot kér, nem teljes születési dátumot, kivéve ha egy konkrét, jogszerű és szükséges álláspályázati cél ezt indokolja.</p>
          <p>27.2. A Workzy nem kér és nem kíván kezelni egészségügyi, genetikai, biometrikus, etnikai, vallási, politikai, szakszervezeti, szexuális életre vagy irányultságra, terhességre, családtervezésre vonatkozó adatot, valamint bűnügyi személyes adatot vagy erkölcsi bizonyítványt.</p>
          <p>27.3. Ha a jelentkező a tiltás ellenére szükségtelen különleges vagy azonosító adatot tölt fel, a Workzy korlátozhatja a hozzáférést, kérheti új dokumentum feltöltését, és a jogszerűen lehetséges legrövidebb időn belül törölheti vagy kitakarhatja az adatot.</p>

          <h2 className="text-2xl font-bold text-slate-800">28. A tájékoztató módosítása és verziókezelés</h2>
          <p>28.1. A hatályos adatkezelési tájékoztató nyilvánosan, bejelentkezés nélkül elérhető a Workzy <a href="/jogi">Jogi Dokumentumközpontjában</a>. A korábbi változatokat verziószámmal, hatálybalépési és archiválási dátummal megőrizzük.</p>
          <p>28.2. Lényeges változás &ndash; például új adatkezelési cél, AI-funkció, adatfeldolgozó, nemzetközi adattovábbítás, marketingcél vagy jelentkezői hozzáférési modell &ndash; előtt a tájékoztatót frissítjük. Ahol a változás hozzájáruláson alapuló cél lényegét érinti, új hozzájárulás szükséges.</p>
          <p>28.3. A regisztrált felhasználókat a lényeges változásról lehetőség szerint legalább 15 nappal korábban emailben és a portálon tájékoztatjuk. Jogi, biztonsági vagy szolgáltatói kényszerhelyzetben azonnali változás is lehetséges, megfelelő értesítéssel.</p>

          <h2 className="text-2xl font-bold text-slate-800">1. melléklet &ndash; Összefoglaló adatkezelési mátrix</h2>
          <table>
            <thead>
              <tr><th>Cél</th><th>Fő adatkör</th><th>Jogalap</th><th>Megőrzés</th></tr>
            </thead>
            <tbody>
              <tr><td>Weboldal és naplók</td><td>IP, technikai és hibadat</td><td>Jogos érdek / szerződés</td><td>12 hónap</td></tr>
              <tr><td>Hitelesítés és fiók</td><td>Email, azonosító, szerepkör, munkamenet</td><td>Szerződés / jogos érdek</td><td>Fiók + lezárási idők</td></tr>
              <tr><td>Ügyfélregisztráció</td><td>Név, céges elérhetőség, szervezet, jog</td><td>Szerződés / jogos érdek</td><td>Fiók; törlés 90 napon belül</td></tr>
              <tr><td>Cégellenőrzés</td><td>Cégnév, adószám, státusz</td><td>Szerződés / jogos érdek / jogi kötelezettség</td><td>Fiók és szerződés; bizonylat 8 év</td></tr>
              <tr><td>Rendelés és szerződés</td><td>Cég, kapcsolattartó, csomag, elfogadások</td><td>Szerződés / jogi kötelezettség</td><td>Legalább 8 év</td></tr>
              <tr><td>SimplePay</td><td>Rendelés, összeg, tranzakció, státusz</td><td>Szerződés / jogi kötelezettség</td><td>Legalább 8 év</td></tr>
              <tr><td>Billingo</td><td>Számlázási és bizonylatadat</td><td>Jogi kötelezettség</td><td>Legalább 8 év</td></tr>
              <tr><td>Ügyfélszolgálat és panasz</td><td>Kapcsolat, ügy, kommunikáció</td><td>Szerződés / jogos érdek / jogi kötelezettség</td><td>Főszabály szerint 5 év</td></tr>
              <tr><td>Ügyfélmarketing</td><td>Email, hozzájárulás, küldés</td><td>Hozzájárulás</td><td>Visszavonásig; bizonyíték +5 év</td></tr>
              <tr><td>Marketingtiltó lista</td><td>Email, leiratkozás</td><td>Jogos érdek</td><td>Főszabály szerint 5 év</td></tr>
              <tr><td>Konkrét állásjelentkezés</td><td>Kapcsolat, szakmai adatok, válaszok, CV</td><td>Szerződés / jogos érdek; munkáltató saját jogalapja</td><td>30/90 nap hozzáférés; utána törlés 30 napon belül</td></tr>
              <tr><td>CV-adatkinyerés</td><td>CV és kinyert szakmai adatok</td><td>Szerződés; DPIA</td><td>Jelentkezés vagy tehetségprofil ideje</td></tr>
              <tr><td>Rangsorolás</td><td>Objektív pont/címke/összefoglalás</td><td>Szerződés / jogos érdek; DPIA</td><td>Jelentkezés ideje</td></tr>
              <tr><td>Tehetségadatbázis</td><td>Profil, preferenciák, CV</td><td>Hozzájárulás</td><td>12 hónap</td></tr>
              <tr><td>Állásajánló email</td><td>Email, preferenciák, küldési adatok</td><td>Hozzájárulás</td><td>12 hónap vagy visszavonás; bizonyíték +5 év</td></tr>
              <tr><td>Analitika és marketingmérés</td><td>Online azonosító és esemény</td><td>Hozzájárulás</td><td>Cookie/szolgáltató szerint</td></tr>
              <tr><td>Hozzáférési/export napló</td><td>Felhasználó, idő, művelet, jelölt</td><td>Jogos érdek</td><td>12 hónap</td></tr>
              <tr><td>Incidens és jogi igény</td><td>Szükséges bizonyíték</td><td>Jogi kötelezettség / jogos érdek</td><td>Ügy lezárásáig / igényérvényesítésig</td></tr>
            </tbody>
          </table>

          <p>
            Kapcsolódó dokumentumok: <a href="/aszf">Általános Szerződési Feltételek</a>,{" "}
            <a href="/adatfeldolgozasi-melleklet">Adatfeldolgozási Melléklet</a>,{" "}
            <a href="/cookie-tajekoztato">Cookie-tájékoztató</a>, <a href="/panaszkezeles">Panaszkezelési Tájékoztató</a>,{" "}
            <a href="/simplepay-tajekoztato">SimplePay fizetési tájékoztató</a>. A teljes jogi dokumentumlista a{" "}
            <a href="/jogi">Jogi Dokumentumközpontban</a> érhető el.
          </p>
        </div>
      </div>
    </main>
  );
}
