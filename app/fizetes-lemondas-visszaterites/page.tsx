export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function FizetesLemondasVisszateritesPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm sm:p-16">
        <div className="prose prose-slate max-w-none">
          <h1 className="mb-2 text-4xl font-extrabold text-slate-900">Fizetési, Lemondási és Visszatérítési Szabályzat</h1>
          <p className="text-slate-500">a Workzy Általános Szerződési Feltételeinek kiegészítő dokumentuma, munkáltatói és szervezeti ügyfelek részére</p>
          <p>
            Aktuális változat &middot; v1.0
            <br />
            Hatályos: 2026. augusztus 1-től
            <br />
            Közzétéve: 2026. augusztus 1.
          </p>

          <p>
            A fizetés technikai sikeressége, a Workzy szerződéses visszaigazolása és a kampány tényleges aktiválása három elkülönülő esemény. A
            böngészőben megjelenő SimplePay sikeroldal önmagában nem igazolja a Workzy szolgáltatás aktiválását.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">1. A Szabályzat helye és hatálya</h2>
          <p>1.1. A Szabályzat a Workzy <a href="/aszf">ÁSZF</a>, a végleges Megrendelési összesítő, az <a href="/adatkezelesi-tajekoztato">Adatkezelési Tájékoztató</a> és a <a href="/panaszkezeles">Panaszkezelési Tájékoztató</a> mellett alkalmazandó.</p>
          <p>1.2. Eltérés esetén a konkrét, Workzy által visszaigazolt Megrendelési összesítőnek az adott rendelésre vonatkozó, a Megrendelőre kedvezőbb vagy részletesebb feltételei elsőbbséget élvezhetnek. A már kifizetett és visszaigazolt rendelés lényeges feltételei a Megrendelő hátrányára utólag nem módosíthatók.</p>
          <p>1.3. A jelen változat a Workzy Portál, Workzy Kampány és Workzy Kampány Pro egyszeri csomagokra készült. Jövőbeni havidíjas, automatikusan megújuló vagy ismétlődő fizetéses szolgáltatás csak külön feltételek, külön checkout-tájékoztatás és külön technikai megfelelőség után vezethető be.</p>

          <h2 className="text-2xl font-bold text-slate-800">2. Fogalommeghatározások</h2>
          <ul>
            <li><strong>Aktiválás:</strong> a Workzy visszaigazolásában megjelölt időpont, amikor a megrendelt szolgáltatás vagy kampány ténylegesen elindul.</li>
            <li><strong>Fizetési megerősítés:</strong> a SimplePay vagy más engedélyezett fizetési szolgáltató szerveroldali, a Workzy által hitelesen feldolgozott értesítése a tranzakció eredményéről.</li>
            <li><strong>Megrendelési összesítő:</strong> a fizetés előtt szerkeszthető, majd véglegesített elektronikus összefoglaló a Megrendelő, a csomag, az állás, az ár, a fizetési mód és az elfogadott feltételek adataival.</li>
            <li><strong>Szolgáltatási jóváírás:</strong> pénz-visszatérítés helyett vagy mellett biztosított kampányidő, csomagfelhasználási jog vagy más, Workzy által írásban meghatározott szolgáltatási kompenzáció.</li>
            <li><strong>Teljes visszatérítés:</strong> az érintett rendelés ténylegesen megfizetett teljes összegének visszafizetése, a jogszerű számlakorrekcióval együtt.</li>
            <li><strong>Visszatérítés indítása:</strong> a Workzy által a fizetési szolgáltatónál vagy más jóváhagyott módon dokumentáltan kezdeményezett visszafizetési művelet. Nem azonos a bankszámlán történő tényleges jóváírás időpontjával.</li>
            <li><strong>Zárolt jelentkező:</strong> a Próba első öt érvényes jelentkezőjét követően beérkezett, a Megrendelő számára személyes adat nélkül, kizárólag darabszámként megjelenített jelentkezés.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800">3. B2B státusz és a fogyasztói elállási jog kizárása</h2>
          <p>3.1. Fizetős Workzy szolgáltatást kizárólag üzleti vagy szakmai célból eljáró szervezet vagy vállalkozás rendelhet. A Megrendelő a checkout során kötelező nyilatkozattal megerősíti, hogy nem fogyasztóként jár el.</p>
          <p>3.2. A fogyasztókat megillető, indokolás nélküli tizennégy napos elállási vagy felmondási jog a jelen B2B megrendelésekre nem alkalmazandó.</p>
          <p>3.3. A Workzy a 6. pont szerinti, fizetéstől számított 24 órás lemondási lehetőséget önként vállalt szerződéses méltányosságként biztosítja. Ez nem fogyasztói elállási jog, és kizárólag az ott felsorolt együttes feltételekkel alkalmazható.</p>

          <h2 className="text-2xl font-bold text-slate-800">4. Csomagok, árak és díjstruktúra</h2>
          <table>
            <thead>
              <tr><th>Csomag</th><th>Fizetendő végösszeg</th><th>Fő tartalom</th><th>Kiemelt fizetési szabály</th></tr>
            </thead>
            <tbody>
              <tr><td>Workzy Portál</td><td>25 990 Ft</td><td>1 állás, 30 napos portálmegjelenés</td><td>Nem oldja fel a Próba zárolt jelentkezőit.</td></tr>
              <tr><td>Workzy Kampány</td><td>59 990 Ft</td><td>1 állás, 14 napos toborzási kampány</td><td>Feloldja az adott Próba zárolt jelentkezőit és teljes új 14 napos kampányt indít.</td></tr>
              <tr><td>Workzy Kampány Pro</td><td>99 990 Ft</td><td>Legfeljebb 2 állás, 1 összehangolt 14 napos kampányidőszak</td><td>Nem jelent automatikusan két teljesen független médiakampányt vagy állásonként elkülönített keretet.</td></tr>
            </tbody>
          </table>
          <p>4.1. A feltüntetett árak a Megrendelő által fizetendő végösszegek. A Szolgáltató alanyi adómentes; a bizonylaton a hatályos adójogi státuszt és kötelező jelölést kell alkalmazni.</p>
          <p>4.2. Minden csomag egyszeri vásárlás. Nincs automatikus megújulás, előfizetés, kártyamentésre épülő ismétlődő terhelés vagy rejtett további díj.</p>
          <p>4.3. A Kampány és Kampány Pro rögzített díjú, egységes szolgáltatás. A Megrendelő nem kap elkülönített hirdetési pénztárcát, saját médiakeretet vagy a Workzy tényleges hirdetési költésének tételes visszatérítési jogát.</p>
          <p>4.4. A Workzy szakmai mérlegelése alapján határozza meg a csatornákat, az organikus és fizetett megjelenések arányát, a kreatívvariációkat, a célzást, az optimalizálást és a tényleges médiafelhasználást.</p>
          <p>4.5. A Workzy nem garantál meghatározott számú jelentkezőt, interjút, alkalmas jelöltet, felvételt vagy üzleti eredményt. Az eredményhiány önmagában nem minősül hibás teljesítésnek és nem keletkeztet automatikus visszatérítési jogot.</p>

          <h2 className="text-2xl font-bold text-slate-800">5. A díjmentes Próba fizetési vonatkozásai</h2>
          <p>5.1. A 72 órás Próba bankkártya megadása nélkül vehető igénybe, és annak lejárata nem eredményez automatikus díjfizetést, csomagvásárlást vagy ismétlődő terhelést.</p>
          <p>5.2. A Próba alatt a Workzy saját költségén organikus vagy fizetett megjelenést alkalmazhat. Az esetleges belső hirdetési költés nem a Megrendelő pénztárcája, nem jár vissza és nem számítható be pénzbeli egyenlegként.</p>
          <p>5.3. A Próba első öt érvényes jelentkezője díjmentesen látható. A további zárolt jelentkezők feloldására a Workzy Kampány csomag vásárlása szolgál; a Workzy Portál csomag a zárolt jelentkezőket nem oldja fel.</p>
          <p>5.4. Ha a Megrendelő a Próba lezárását követő 14 napos feloldási időn belül nem vásárol megfelelő csomagot, a munkáltatóspecifikus feloldási lehetőség megszűnik. Ez önmagában nem fizetési esemény és nem keletkeztet visszatérítési kérdést.</p>

          <h2 className="text-2xl font-bold text-slate-800">6. Checkout és megrendelési összesítő</h2>
          <p>6.1. A Megrendelő a SimplePay oldalára történő átirányítás előtt szerkeszthető végső Megrendelési összesítőt kap.</p>
          <p>6.2. Az összesítő legalább a Megrendelő cégnevét, adószámát, kapcsolattartóját, számlázási adatait, az állást vagy állásokat, a csomagot, a csomag tartalmát, a fizetendő végösszeget, a választott fizetési módot és az elfogadandó jogi nyilatkozatokat tartalmazza.</p>
          <p>6.3. A rendszer a fizetés elküldése előtt lehetőséget biztosít az adatbeviteli hibák felismerésére és javítására.</p>
          <p>6.4. A checkout kötelező nyilatkozatai:</p>
          <ul>
            <li>B2B nyilatkozat arról, hogy a Megrendelő üzleti vagy szakmai célból, nem fogyasztóként jár el;</li>
            <li>az ÁSZF, a jelen Szabályzat, a teljesítési és kampányaktiválási feltételek elfogadása;</li>
            <li>a SimplePay mindenkor előírt, aktuális adattovábbítási nyilatkozatának külön elfogadása.</li>
          </ul>
          <p>6.5. A marketing-hozzájárulás külön, opcionális és alapértelmezetten üres választás; annak hiánya nem akadályozhatja a vásárlást.</p>
          <p>6.6. A fizetési gomb a fizetési módot és az összeget egyértelműen jelzi, például: &bdquo;Fizetés SimplePay-jel &ndash; 59 990 Ft&rdquo;. A gomb közelében szerepel: &bdquo;Egyszeri fizetés, nincs automatikus megújulás.&rdquo;</p>

          <h2 className="text-2xl font-bold text-slate-800">7. SimplePay fizetési módok</h2>
          <p>7.1. A támogatott fizetési módok: SimplePay bankkártyás fizetés és SimplePay qvik fizetés. Kézi banki átutalás a standard online rendelési folyamatban nem érhető el.</p>
          <p>7.2. A bankkártyaadatokat a Workzy nem kezeli és nem tárolja; azok megadása és feldolgozása a SimplePay felületén történik.</p>
          <p>7.3. A qvik fizetés a SimplePay által biztosított azonnali fizetési folyamaton keresztül történik. A Workzy nem fér hozzá a Megrendelő internetbanki vagy mobilbanki hitelesítő adataihoz.</p>
          <p>7.4. A SimplePay logóit, adattovábbítási nyilatkozatát, kötelező kereskedői tájékoztatásait és technikai előírásait a mindenkor hatályos hivatalos SimplePay-dokumentáció szerint jelenítjük meg.</p>
          <p>
            A SimplePay szerepéről és a hozzá kapcsolódó adattovábbításról bővebben a{" "}
            <a href="/simplepay-tajekoztato">SimplePay fizetési tájékoztatóban</a> olvashat.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">8. Fizetési állapotok és szerveroldali megerősítés</h2>
          <p>8.1. A Workzy a szolgáltatást kizárólag hiteles szerveroldali fizetési megerősítés alapján aktiválhatja. A böngésző visszatérési URL-je, sikeroldala, felhasználói képernyőképe vagy emailje önmagában nem elégséges.</p>
          <p>8.2. A rendelés fő technikai állapotai: létrehozva, fizetésre vár, fizetés feldolgozás alatt, megerősített fizetés, sikertelen, megszakított, lejárt, bizonytalan kimenet, visszatérítés alatt, visszatérítve és részben visszatérítve.</p>
          <p>8.3. A fizetési webhook és a Workzy feldolgozás idempotens: ugyanazon tranzakció ismételt értesítése nem hozhat létre második aktiválást, második kampányt vagy második számlát.</p>
          <p>8.4. A tranzakcióazonosítókat, rendelési azonosítókat, időbélyegeket és állapotváltozásokat olyan módon naplózzuk, hogy a dupla terhelés, a bizonytalan kimenet és a visszatérítés teljes folyamata utólag bizonyítható legyen.</p>

          <h2 className="text-2xl font-bold text-slate-800">9. A szerződés létrejötte és a Workzy visszaigazolása</h2>
          <p>9.1. A fizetős szerződés a sikeres fizetés és a külön Workzy elektronikus visszaigazolás együttesével jön létre.</p>
          <p>9.2. A SimplePay fizetési válasz vagy sikeroldal önmagában nem Workzy szerződéses visszaigazolás.</p>
          <p>9.3. A Workzy visszaigazolás legalább a rendelési azonosítót, a SimplePay tranzakcióazonosítót, a csomagot, a fizetett összeget, a fizetés állapotát, a zárolt jelentkezők feloldási állapotát, a kampány tervezett kezdetét és végét, valamint a számla állapotát tartalmazza.</p>
          <p>9.4. Nyilvánvaló árhiba, technikai hiba, jogosulatlan rendelés, valótlan adat vagy nem javítható jogellenes tartalom esetén a Workzy a megrendelést a visszaigazolás előtt elutasíthatja. Ha a fizetés már megtörtént, teljes visszatérítés jár.</p>

          <h2 className="text-2xl font-bold text-slate-800">10. Billingo számlázás és számlahelyesbítés</h2>
          <p>10.1. A Workzy a fizetés és a Workzy visszaigazolás megfelelő feldolgozása után a Billingo rendszerén keresztül automatikusan állítja ki a hatályos adó- és számviteli szabályok szerinti bizonylatot.</p>
          <p>10.2. A bizonylat a fizetés előtt ellenőrzött számlázási adatok alapján készül. A számlázási adatok a fizetés elküldéséig szabadon javíthatók.</p>
          <p>10.3. A kiállított számla adatai nem írhatók egyszerűen felül. Hibás számlázási adat, teljes vagy részleges visszatérítés esetén a Billingo és a hatályos adójog szerinti módosító, érvénytelenítő vagy más megfelelő korrekciós bizonylatot kell kiállítani.</p>
          <p>10.4. A fiókban később módosított cég- vagy számlázási adat főszabály szerint csak a jövőbeli rendelésekre alkalmazandó.</p>

          <h2 className="text-2xl font-bold text-slate-800">11. A teljesítés megkezdése és az aktiválási határidő</h2>
          <p>11.1. A fizetős szolgáltatás teljesítése a sikeres fizetés és a Workzy visszaigazolása után megkezdődhet. A zárolt jelentkezők hozzáférhetővé tétele a szolgáltatás lényeges részének teljesítése.</p>
          <p>11.2. A 14 napos kampányidőszak az Aktiválási visszaigazolásban megjelölt napon kezdődik. Feltétele a szükséges adatok rendelkezésre állása, a tartalom jogszerűsége és a Megrendelő digitális jóváhagyása.</p>
          <p>11.3. A kifizetett, de el nem indított kampánycsomag a fizetéstől számított 90 napig aktiválható.</p>
          <p>11.4. Ha a Megrendelő 90 napon belül nem adja meg a szükséges adatokat, nem javítja a kifogásolt tartalmat, nem hagyja jóvá a kampányt vagy nem kéri az indulást, a csomag felhasználási joga lejár, és nem jár automatikus visszatérítés.</p>
          <p>11.5. Ha az Aktiválás Workzy-oldali okból akadályozott, a 90 napos időszak az akadály időtartamával meghosszabbodik. Tartós Workzy-oldali teljesítési lehetetlenség esetén teljes visszatérítés vagy későbbi szolgáltatási jóváírás választható.</p>

          <h2 className="text-2xl font-bold text-slate-800">12. Szüneteltetés, módosítás és végleges leállítás</h2>
          <p>12.1. A Megrendelő egy fizetős kampány során egy alkalommal, legfeljebb 7 naptári napra kérhet szüneteltetést. A szünet alatt a 14 napos kampányidőszak nem fogy.</p>
          <p>12.2. A szüneteltetés a Workzy visszaigazolásával lép hatályba. A külső hirdetési rendszerek leállítása és újraindítása rövid technikai feldolgozási időt igényelhet.</p>
          <p>12.3. A Workzy igazolt technikai kiesése nem számít a Megrendelő egyetlen szünetének; a kampányidő a kieséssel arányosan meghosszabbodik vagy egyenértékű jóváírás adható.</p>
          <p>12.4. A Megrendelő által kért végleges kampányleállítás esetén a hátralévő kampánynapokra nem jár automatikus pénz-visszatérítés.</p>
          <p>12.5. A munkakör más munkakörre cserélése új kampánynak minősül. A csomag más vállalkozásra nem ruházható át. Másik állásra csak a kampány indulása és a zárolt jelentkezők megnyitása előtt, a Workzy előzetes írásbeli jóváhagyásával vihető át.</p>

          <h2 className="text-2xl font-bold text-slate-800">13. Lemondás a teljesítés megkezdése előtt</h2>
          <p>13.1. A Megrendelő lemondási kérelmét írásban, az info@workzy.hu címre vagy a Portál erre szolgáló funkcióján keresztül nyújthatja be, a rendelési azonosító megjelölésével.</p>
          <p>13.2. A lemondási kérelem beérkezése önmagában nem igazolja a visszatérítési feltételek fennállását. A Workzy ellenőrzi a fizetés időpontját, a zárolt jelentkezők hozzáférési naplóját, a kampány-előkészítés és az Aktiválás állapotát.</p>
          <p>13.3. A teljesítés megkezdése előtt is levonható vagy visszatartható lehet a már ténylegesen elvégzett, a megrendeléshez kapcsolódó és a szerződés alapján díjazott előkészítő munka, kivéve ha a 14. pont szerinti teljes visszatérítés valamennyi feltétele fennáll.</p>

          <h2 className="text-2xl font-bold text-slate-800">14. A 24 órás szerződéses visszatérítési lehetőség</h2>
          <p>14.1. A Workzy a fizetéstől számított 24 órán belül teljes visszatérítést biztosít, ha az alábbi feltételek együttesen teljesülnek:</p>
          <ul>
            <li>a Megrendelő a lemondást írásban, egyértelműen kéri;</li>
            <li>egyetlen zárolt jelentkezőt sem nyitottak meg, töltöttek le vagy exportáltak;</li>
            <li>a Workzy nem kezdte meg a fizetős kampány szakmai vagy technikai előkészítését;</li>
            <li>a fizetős kampány nem indult el.</li>
          </ul>
          <p>14.2. A négy feltétel közül bármelyik hiánya esetén a meggondolásra alapított teljes visszatérítés nem jár automatikusan.</p>
          <p>14.3. A zárolt jelentkező megnyitása, letöltése vagy exportja a szolgáltatás lényeges részének igénybevételét jelenti, ezért ezt követően a 24 órás teljes visszatérítési lehetőség megszűnik.</p>
          <p>14.4. A 24 órás határidő a sikeres fizetés Workzy rendszerében rögzített időpontjától számítandó. Technikai bizonytalanság esetén a hiteles fizetési napló és a SimplePay tranzakciós adat az irányadó.</p>

          <h2 className="text-2xl font-bold text-slate-800">15. Kötelező teljes visszatérítési esetek</h2>
          <p>15.1. Teljes visszatérítés jár különösen:</p>
          <ul>
            <li>téves vagy dupla terhelés esetén a tévesen vagy másodszor megfizetett összegre;</li>
            <li>ha a Workzy a rendelést a visszaigazolás előtt véglegesen elutasítja és a hiba nem javítható;</li>
            <li>ha a Workzy oldalán fennálló tartós technikai vagy jogi akadály miatt a szolgáltatás lényegi része nem teljesíthető;</li>
            <li>ha a SimplePay fizetett állapotot jelez, de a Workzy a szolgáltatást nem tudja aktiválni és manuális helyreállítás sem lehetséges;</li>
            <li>ha a Workzy olyan lényeges hibát okoz, amelyet észszerű időn belül nem tud kijavítani, és az érintett szolgáltatás ténylegesen nem használható.</li>
          </ul>
          <p>15.2. A teljes visszatérítéshez a rendeléshez kapcsolódó, már kiállított számlát vagy más bizonylatot jogszerűen korrigálni kell.</p>
          <p>15.3. A teljes visszatérítés nem zárja ki a Megrendelő jogszabályon alapuló egyéb igényét olyan esetben, amelyben a felelősség jogszerűen nem korlátozható.</p>

          <h2 className="text-2xl font-bold text-slate-800">16. Automatikus visszatérítést nem keletkeztető esetek</h2>
          <p>16.1. Nem jár automatikus teljes vagy részleges visszatérítés különösen:</p>
          <ul>
            <li>a Megrendelő jogsértő, megtévesztő, diszkriminatív vagy nem javított hirdetési tartalma miatt;</li>
            <li>a Megrendelő adat-, dokumentum- vagy jóváhagyáshiánya, késedelme vagy együttműködésének elmaradása miatt;</li>
            <li>a Megrendelő által kért végleges kampányleállítás vagy üzleti döntésváltozás miatt;</li>
            <li>azért, mert a kampány kevesebb jelentkezőt, interjút, alkalmas jelöltet vagy felvételt eredményezett a vártnál;</li>
            <li>a jelentkező későbbi elérhetetlensége, visszalépése, interjúmegjelenésének hiánya vagy szubjektív alkalmatlansága miatt;</li>
            <li>a külső piaci környezet, munkaerőhiány, szezonális hatás vagy a Megrendelő ajánlatának versenyképessége miatt;</li>
            <li>a Megrendelő fiókjának súlyos szerződésszegés, fizetési visszaélés, jelöltadat-visszaélés vagy biztonsági kockázat miatti felfüggesztése esetén;</li>
            <li>a 90 napos aktiválási idő Megrendelőnek felróható lejárata esetén;</li>
            <li>a Workzy tényleges hirdetési költése és a csomag ára közötti különbségre hivatkozva.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800">17. Részleges visszatérítés, időhosszabbítás és jóváírás</h2>
          <p>17.1. Ha a szolgáltatás egy része teljesült, de a fennmaradó rész Workzy-oldali okból nem teljesíthető, a Workzy a teljesítés arányát, az átadott hozzáférést, az elvégzett előkészítő munkát és a kiesés hatását figyelembe véve részleges visszatérítést, időhosszabbítást vagy szolgáltatási jóváírást ajánlhat fel.</p>
          <p>17.2. A Workzy technikai kiesés esetén elsődlegesen a kampányidő arányos meghosszabbításával vagy egyenértékű szolgáltatási jóváírással állíthatja helyre a teljesítést, ha ez a Megrendelő jogos érdekét megfelelően szolgálja.</p>
          <p>17.3. Érvényes jelentkező objektív hibájára vonatkozó, 48 órán belül benyújtott és megalapozott kifogás esetén a jelentkező kikerülhet az érvényes számlálásból és a számláló korrigálható. Egyedi jelentkező vitatása önmagában nem keletkeztet automatikus pénz-visszatérítést.</p>
          <p>17.4. A méltányossági jóváírás egyedi döntés, és nem teremt kötelező gyakorlatot más Megrendelők vagy későbbi rendelések számára.</p>

          <h2 className="text-2xl font-bold text-slate-800">18. Sikertelen, bizonytalan és dupla fizetések</h2>
          <p>18.1. Sikertelen, megszakított, elutasított vagy lejárt fizetés esetén a zárolt jelentkezők nem oldódnak fel, a fizetős kampány nem indul el, és számla nem készül.</p>
          <p>18.2. A Megrendelő lehetőség szerint ugyanazon rendelés alapján újra megkísérelheti a fizetést. A rendszer megakadályozza, hogy párhuzamos próbálkozások véletlenül több aktív szolgáltatást hozzanak létre.</p>
          <p>18.3. Ha a SimplePay fizetett állapotot jelez, de a Workzy feldolgozása nem fejeződik be, a rendelés &bdquo;feldolgozás alatt&rdquo; vagy &bdquo;bizonytalan kimenet&rdquo; állapotba kerül. A Megrendelőt nem kérjük második fizetésre.</p>
          <p>18.4. A Workzy kivizsgálja a bizonytalan kimenetet, és vagy manuálisan aktiválja a szolgáltatást, vagy teljes visszatérítést kezdeményez, ha az Aktiválás nem lehetséges.</p>
          <p>18.5. Dupla terhelés esetén a második teljes befizetés visszatérítendő; ugyanarra a rendelésre nem indítható második kampány és nem hozható létre második normál számlázási folyamat.</p>

          <h2 className="text-2xl font-bold text-slate-800">19. A visszatérítés végrehajtása</h2>
          <p>19.1. A jóváhagyott visszatérítést a Workzy főszabály szerint az eredeti fizetési módon és a SimplePay által támogatott technikai eljárással kezdeményezi.</p>
          <p>19.2. A Workzy a visszatérítés indításáról elektronikus értesítést küld, amely tartalmazza a rendelési azonosítót, a visszatérítendő összeget, a visszatérítés okát és a kapcsolódó bizonylat állapotát.</p>
          <p>19.3. A Workzy által kezdeményezett visszatérítés és a Megrendelő bankszámláján történő tényleges jóváírás időpontja eltérhet. A jóváírás feldolgozási idejét a SimplePay, a kártyatársaságok, a bankok és a qvik infrastruktúrája is befolyásolhatja.</p>
          <p>19.4. Ha az eredeti fizetési csatornán történő visszatérítés bizonyíthatóan nem lehetséges, a Workzy külön azonosítás és egyeztetés után más jogszerű visszafizetési módot alkalmazhat.</p>
          <p>19.5. A Megrendelő köteles haladéktalanul jelezni, ha a Workzy visszatérítési értesítése ellenére a pénzügyi jóváírás észszerű időn belül nem jelenik meg, és köteles a kivizsgáláshoz szükséges tranzakciós adatokat rendelkezésre bocsátani.</p>

          <h2 className="text-2xl font-bold text-slate-800">20. Visszaterhelés, fizetési vita és csalásmegelőzés</h2>
          <p>20.1. A Megrendelő a banki visszaterhelés vagy fizetési vita kezdeményezése előtt lehetőség szerint közvetlenül jelezze a problémát a Workzy ügyfélszolgálatának, hogy a dupla terhelés, technikai hiba vagy jogos visszatérítés rendezhető legyen.</p>
          <p>20.2. Jogosulatlan vagy csalárd fizetés gyanúja esetén a Workzy az Aktiválást felfüggesztheti, a hozzáférést korlátozhatja, és együttműködhet a SimplePayjel, pénzforgalmi szolgáltatókkal vagy hatóságokkal.</p>
          <p>20.3. A már teljesített szolgáltatás mellett alaptalanul kezdeményezett visszaterhelés szerződésszegésnek minősülhet. A Workzy jogosult a teljesítés, a hozzáférési naplók, a kampányaktiválás, a számla és a jogi elfogadások bizonyítékait a fizetési vita rendezéséhez felhasználni.</p>
          <p>20.4. A csalásmegelőzés nem vezethet szükségtelen profilozáshoz vagy az érintettek jogainak aránytalan korlátozásához.</p>

          <h2 className="text-2xl font-bold text-slate-800">21. Panasz és igényérvényesítés</h2>
          <p>21.1. Fizetési, számlázási, lemondási vagy visszatérítési panasz írásban nyújtható be az info@workzy.hu címen, postai úton a 2484 Gárdony, Géza utca 28. címen, vagy a Portál panaszfunkcióján keresztül.</p>
          <p>21.2. A panasz lehetőség szerint tartalmazza a Megrendelő nevét és adószámát, a kapcsolattartó nevét és email-címét, a rendelési azonosítót, a SimplePay tranzakcióazonosítót, a kifogás részletes leírását, a kért megoldást és a szükséges mellékleteket.</p>
          <p>21.3. A Workzy fizetési vagy hozzáférési hiba esetén lehetőség szerint egy munkanapon belül megkezdi a kivizsgálást. A hivatalos írásbeli panaszra legfeljebb 30 napon belül válaszol.</p>
          <p>21.4. A felek a jogvita előtt 15 napos írásbeli egyeztetést kísérelnek meg. Eredménytelen egyeztetés esetén a magyar jog és a hatáskörrel, illetékességgel rendelkező magyar bíróság szabályai alkalmazandók.</p>
          <p>21.5. Fogyasztói békéltető testületi és fogyasztóvédelmi rendelkezések a jelen B2B vásárlásokra főszabály szerint nem alkalmazandók.</p>

          <h2 className="text-2xl font-bold text-slate-800">22. Adatkezelés és bizonylatmegőrzés</h2>
          <p>22.1. A Workzy a fizetési folyamatban csak a saját feladatához szükséges rendelési, kapcsolattartási, számlázási és tranzakciós adatokat kezeli. Bankkártyaadatokat nem tárol.</p>
          <p>22.2. A SimplePay részére kizárólag a fizetéshez és a szerződéses adattovábbítási nyilatkozatban meghatározott körben továbbíthatók adatok. Jelöltprofil, CV és szűrési válasz nem továbbítható a SimplePay vagy a Billingo részére.</p>
          <p>22.3. A megrendelési, szerződéses, fizetési és számlázási adatokat a Workzy legalább 8 évig, illetve jogvita, adóellenőrzés vagy más jogi kötelezettség miatt szükség esetén tovább őrzi.</p>
          <p>22.4. A fizetési naplók hozzáférése szerepköralapú és naplózott. A visszatérítési, dupla terhelési és chargeback ügyekhez kapcsolódó bizonyítékokat csak a szükséges ideig és megfelelő biztonsággal őrizzük.</p>

          <h2 className="text-2xl font-bold text-slate-800">23. Hatály, verziókezelés és záró rendelkezések</h2>
          <p>23.1. Az adott rendelésre a Workzy visszaigazolásakor hatályos Szabályzat-verzió alkalmazandó. A verziószámot, hatálybalépési dátumot és elfogadási időpontot a rendszer rögzíti.</p>
          <p>23.2. A későbbi módosítás a már kifizetett és visszaigazolt rendelés lényeges pénzügyi feltételeit a Megrendelő hátrányára nem ronthatja.</p>
          <p>23.3. A korábbi változatokat a Workzy a <a href="/jogi">Jogi Dokumentumközpontban</a> verziószámmal és hatályossági dátummal archiválja.</p>

          <h2 className="text-2xl font-bold text-slate-800">1. melléklet &ndash; Csomag- és fizetési mátrix</h2>
          <table>
            <thead>
              <tr><th>Termék</th><th>Ár</th><th>Fizetés</th><th>Időtartam</th><th>Kiemelt szabály</th></tr>
            </thead>
            <tbody>
              <tr><td>72 órás Próba</td><td>0 Ft</td><td>Nincs</td><td>Nincs</td><td>Első 5 érvényes jelentkező látható; nincs automatikus fizetés.</td></tr>
              <tr><td>Workzy Portál</td><td>25 990 Ft</td><td>Egyszeri</td><td>30 napos portálmegjelenés</td><td>Nem oldja fel a Próba zárolt jelentkezőit.</td></tr>
              <tr><td>Workzy Kampány</td><td>59 990 Ft</td><td>Egyszeri</td><td>14 napos kampány</td><td>Feloldja az adott Próba zárolt jelentkezőit; új teljes 14 nap.</td></tr>
              <tr><td>Workzy Kampány Pro</td><td>99 990 Ft</td><td>Egyszeri</td><td>Legfeljebb 2 állás, 1 közös 14 nap</td><td>Nincs automatikus állásonkénti külön médiakeret.</td></tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-slate-800">2. melléklet &ndash; Visszatérítési döntési mátrix</h2>
          <table>
            <thead>
              <tr><th>Esemény</th><th>Alapértelmezett eredmény</th><th>Feltétel / megjegyzés</th></tr>
            </thead>
            <tbody>
              <tr><td>24 órán belüli meggondolás</td><td>Igen, ha minden feltétel teljesül</td><td>Nincs jelöltmegnyitás/export; nincs előkészítés; kampány nem indult; írásbeli kérelem.</td></tr>
              <tr><td>Dupla terhelés</td><td>Igen, a második teljes összeg</td><td>Nincs második kampány vagy normál számla.</td></tr>
              <tr><td>Workzy végleges elutasítása</td><td>Igen</td><td>Ha a rendelés nem javítható és nem került visszaigazolásra.</td></tr>
              <tr><td>Workzy tartós teljesítési képtelensége</td><td>Igen</td><td>Vagy a Megrendelő választása szerint későbbi szolgáltatási jóváírás.</td></tr>
              <tr><td>Részleges Workzy-kiesés</td><td>Egyedi</td><td>Arányos visszatérítés, időhosszabbítás vagy jóváírás.</td></tr>
              <tr><td>Ügyfél végleges leállítása</td><td>Nem automatikus</td><td>A már teljesített rész és a hátralévő napok nem járnak automatikusan vissza.</td></tr>
              <tr><td>Kevés vagy nem megfelelő jelentkező</td><td>Nem</td><td>Nincs eredménygarancia; objektív érvényességi kifogás külön kezelhető.</td></tr>
              <tr><td>Ügyfél adat-/jóváhagyáshiánya</td><td>Nem automatikus</td><td>90 napos aktiválási idő után a felhasználási jog lejárhat.</td></tr>
              <tr><td>Jogsértő hirdetési tartalom</td><td>Nem automatikus</td><td>Javítási lehetőség után megtagadás/felfüggesztés lehetséges.</td></tr>
              <tr><td>Sikertelen vagy lejárt fizetés</td><td>Nincs mit visszatéríteni</td><td>Nincs aktiválás és nincs számla.</td></tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-slate-800">3. melléklet &ndash; Checkout minimumszövegek</h2>
          <p><strong>Kötelező B2B nyilatkozat:</strong> Kijelentem, hogy a megrendelést magyar adószámmal rendelkező vállalkozás vagy szervezet nevében, üzleti vagy szakmai célból teszem, és nem fogyasztóként járok el.</p>
          <p><strong>Kötelező szerződéses elfogadás:</strong> Elolvastam és elfogadom a Workzy Általános Szerződési Feltételeit, a Fizetési, Lemondási és Visszatérítési Szabályzatot, valamint tudomásul veszem a teljesítés megkezdésének, a kampányaktiválásnak és a visszatérítésnek a feltételeit.</p>
          <p><strong>SimplePay adattovábbítási nyilatkozat:</strong> a checkout felületén a SimplePay mindenkor hatályos, hivatalosan előírt adattovábbítási nyilatkozata jelenik meg és fogadtatjuk el külön.</p>
          <p><strong>Fizetési gomb és kísérőszöveg:</strong> &bdquo;Fizetés SimplePay-jel &ndash; [a választott csomag ára] Ft&rdquo; &ndash; &bdquo;Egyszeri fizetés, nincs automatikus megújulás.&rdquo;</p>
          <p><strong>Opcionális marketing-hozzájárulás (alapértelmezetten üres checkbox):</strong> Szeretnék emailben értesülni a Workzy újdonságairól, ajánlatairól, akcióiról és toborzási szolgáltatásairól. A hozzájárulásomat bármikor visszavonhatom.</p>

          <h2 className="text-2xl font-bold text-slate-800">4. melléklet &ndash; Fizetési állapotgép</h2>
          <table>
            <thead>
              <tr><th>Állapot</th><th>Jelentés</th><th>Kontroll</th></tr>
            </thead>
            <tbody>
              <tr><td>created</td><td>Rendelés létrejött, fizetés még nem indult</td><td>Nincs aktiválás, nincs számla.</td></tr>
              <tr><td>payment_pending</td><td>SimplePay folyamat megkezdődött</td><td>Rendelés zárolása a párhuzamos dupla fizetés ellen.</td></tr>
              <tr><td>confirmed_paid</td><td>Hiteles szerveroldali megerősítés</td><td>Workzy visszaigazolás, számlázás és jogos aktiválás indítható.</td></tr>
              <tr><td>failed / cancelled / expired</td><td>Fizetés nem teljesült</td><td>Nincs feloldás, kampány vagy számla; újrapróbálás engedhető.</td></tr>
              <tr><td>ambiguous_outcome</td><td>A fizetés és a Workzy állapota nem egyezik</td><td>Nincs második fizetés; automatikus és manuális egyeztetés.</td></tr>
              <tr><td>refund_pending</td><td>Visszatérítés jóváhagyva és indítva</td><td>Kapcsolódó számlakorrekció és ügyfélértesítés.</td></tr>
              <tr><td>refunded</td><td>Teljes visszatérítés lezárva</td><td>Rendelés nem aktiválható újra új fizetés nélkül.</td></tr>
              <tr><td>partially_refunded</td><td>Részösszeg visszatérítve</td><td>Megmaradó szolgáltatás és bizonylat egyértelmű dokumentálása.</td></tr>
              <tr><td>chargeback_dispute</td><td>Banki visszaterhelési vita</td><td>Bizonyítékmegőrzés, hozzáférés kockázatalapú felfüggesztése.</td></tr>
            </tbody>
          </table>
          <p>
            Technikai minimum: idempotens webhookfeldolgozás; egyedi rendelési és tranzakciós kulcsok; dupla aktiválás és dupla számlázás
            tiltása; bizonytalan kimenetek automatikus egyeztetése; visszatérítés és számlakorrekció összekapcsolása; részletes, szerepkörvédett
            auditnapló.
          </p>

          <p>
            Kapcsolódó dokumentumok: <a href="/aszf">Általános Szerződési Feltételek</a>, <a href="/simplepay-tajekoztato">SimplePay fizetési tájékoztató</a>,{" "}
            <a href="/panaszkezeles">Panaszkezelési Tájékoztató</a>. A teljes jogi dokumentumlista a <a href="/jogi">Jogi Dokumentumközpontban</a> érhető el.
          </p>
        </div>
      </div>
    </main>
  );
}
