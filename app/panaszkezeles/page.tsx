export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function PanaszkezelesPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm sm:p-16">
        <div className="prose prose-slate max-w-none">
          <h1 className="mb-2 text-4xl font-extrabold text-slate-900">Panaszkezelési Tájékoztató</h1>
          <p className="text-slate-500">üzleti ügyfelek, felhasználók és jelentkezők részére</p>
          <p>
            Aktuális változat &middot; v1.0
            <br />
            Hatályos: 2026. augusztus 1-től
            <br />
            Közzétéve: 2026. augusztus 1.
          </p>

          <ul className="list-none pl-0">
            <li><strong>Szolgáltató:</strong> Prigl Tamás egyéni vállalkozó</li>
            <li><strong>Platform:</strong> Workzy &ndash; <a href="https://workzy.hu">https://workzy.hu</a></li>
            <li><strong>Székhely / postai panaszbejelentés:</strong> 2484 Gárdony, Géza utca 28.</li>
            <li><strong>Adószám:</strong> 92233913-1-27</li>
            <li><strong>Hivatalos panaszkezelési email:</strong> <a href="mailto:info@workzy.hu">info@workzy.hu</a></li>
            <li><strong>Telefonos segítség:</strong> +36 70 432 7579</li>
            <li><strong>Ügyintézés nyelve:</strong> magyar</li>
          </ul>
          <p>
            A telefonos kapcsolatfelvétel segítségkérésre és sürgős hiba jelzésére használható, de hivatalos panasz megindításához a panaszt
            írásban &ndash; emailben vagy postai úton &ndash; is rögzíteni kell. Sürgős fizetési, hozzáférési vagy biztonsági hiba kezelése a
            formális írásbeli megerősítés előtt is megkezdhető.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">1. A Tájékoztató célja és hatálya</h2>
          <p>1.1. A Tájékoztató célja, hogy átlátható, könnyen hozzáférhető és következetes eljárást biztosítson a Workzy szolgáltatásával kapcsolatos kifogások kivizsgálására és &ndash; megalapozottság esetén &ndash; orvoslására.</p>
          <p>1.2. A Tájékoztató személyi hatálya kiterjed a Megrendelőkre, azok meghatalmazott felhasználóira, a Jelentkezőkre, továbbá arra a személyre vagy szervezetre, akit a Workzy döntése, szolgáltatása vagy adatkezelése közvetlenül érint.</p>
          <p>1.3. A Tájékoztató tárgyi hatálya kiterjed különösen a regisztrációra, cégellenőrzésre, díjmentes Próbára, fizetős csomagokra, fizetésre, számlázásra, kampánykezelésre, jelentkezői hozzáférésre, tartalommoderálásra, fiókkorlátozásra, technikai hibákra, adatkezelésre és kommunikációra.</p>
          <p>1.4. A Tájékoztató nem módosítja a Workzy <a href="/aszf">ÁSZF</a>-jét, <a href="/adatkezelesi-tajekoztato">Adatkezelési Tájékoztatóját</a>, <a href="/adatfeldolgozasi-melleklet">Adatfeldolgozási Mellékletét</a> vagy <a href="/fizetes-lemondas-visszaterites">Fizetési, Lemondási és Visszatérítési Szabályzatát</a>. Eltérés esetén a kötelező jogszabály, majd az adott kérdésre irányadó külön dokumentum alkalmazandó.</p>

          <h2 className="text-2xl font-bold text-slate-800">2. Fogalommeghatározások</h2>
          <ul>
            <li><strong>Panasz:</strong> olyan írásbeli kifogás, amely szerint a Workzy szolgáltatása, döntése, mulasztása, elszámolása vagy adatkezelése a panaszos jogát, szerződéses érdekét vagy a vállalt szolgáltatási szintet sérti.</li>
            <li><strong>Ügyfélszolgálati kérés:</strong> tájékoztatás, beállításmódosítás, segítségkérés vagy egyszerű hibaelhárítás, amely még nem tartalmaz jog- vagy szerződéssérelemre vonatkozó kifogást.</li>
            <li><strong>Panaszos:</strong> a panaszt benyújtó Megrendelő, felhasználó, Jelentkező vagy más közvetlenül érintett személy.</li>
            <li><strong>Sürgős hiba:</strong> fizetett, de nem aktivált rendelés; zárolt hozzáférés; feltételezett dupla terhelés; biztonsági esemény; személyes adatok jogosulatlan hozzáférésének gyanúja vagy más azonnali kárenyhítést igénylő esemény.</li>
            <li><strong>Belső felülvizsgálat:</strong> a panaszra adott első érdemi döntés egy alkalommal kérhető ismételt felülvizsgálata.</li>
            <li><strong>Munkanap:</strong> Magyarországon munkanapnak minősülő nap, a hétvégék és munkaszüneti napok kivételével.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800">3. A panaszkezelés alapelvei</h2>
          <ul>
            <li>jóhiszemű, tisztességes, pártatlan és diszkriminációmentes eljárás;</li>
            <li>a panaszos számára könnyen elérhető, magyar nyelvű írásbeli csatornák;</li>
            <li>a panasz lényegéhez és kockázatához igazodó, arányos vizsgálat;</li>
            <li>a rendelkezésre álló rendszeradatok, naplók, jóváhagyások, fizetési és kommunikációs bizonyítékok ellenőrzése;</li>
            <li>a panaszos személyes adatainak és üzleti titkainak bizalmas kezelése;</li>
            <li>a jóhiszemű panasz benyújtása miatt hátrányos intézkedés tilalma;</li>
            <li>az érdemi döntések emberi felülvizsgálata; kizárólag automatizált rendszer nem utasíthat el véglegesen panaszt;</li>
            <li>a jogsértés vagy szolgáltatási hiba mielőbbi megszüntetése, a további kár megelőzése és a folyamat javítása.</li>
          </ul>
          <p>A Workzy a panasz kivizsgálását díjmentesen végzi. A panaszos saját jogi, szakértői vagy postázási költségeit maga viseli, kivéve, ha kötelező jogszabály vagy külön megállapodás másként rendelkezik.</p>

          <h2 className="text-2xl font-bold text-slate-800">4. Ügyfélszolgálati megkeresés, panasz és adatvédelmi kérelem elhatárolása</h2>
          <table>
            <thead>
              <tr><th>Beadvány típusa</th><th>Példa</th><th>Alapeljárás</th></tr>
            </thead>
            <tbody>
              <tr><td>Ügyfélszolgálati kérés</td><td>&bdquo;Hol találom a számlát?&rdquo;; &bdquo;Hogyan állíthatom meg a kampányt?&rdquo;</td><td>Általános célidő: 2 munkanap.</td></tr>
              <tr><td>Sürgős fizetési vagy hozzáférési hiba</td><td>Sikeres terhelés után nincs aktiválás; dupla terhelés gyanúja</td><td>Első vizsgálati célidő: 1 munkanap, szükség esetén azonnali kárenyhítés.</td></tr>
              <tr><td>Hivatalos panasz</td><td>Visszatérítés elutasítása, kampánykezelési kifogás, fiókfelfüggesztés</td><td>Belső cél: 5 munkanap; legkésőbb 30 napon belül érdemi válasz.</td></tr>
              <tr><td>Adatvédelmi joggyakorlási kérelem</td><td>Hozzáférés, törlés, helyesbítés, tiltakozás</td><td>GDPR szerinti külön eljárás; belső cél 10 munkanap, jogszabályi határidő főszabály szerint 1 hónap.</td></tr>
              <tr><td>Biztonsági / adatvédelmi incidensjelzés</td><td>Jogosulatlan hozzáférés, adatvesztés, téves címzett</td><td>Azonnali incidenskezelés; a hatósági és érintetti értesítést kockázat alapján kell eldönteni.</td></tr>
            </tbody>
          </table>
          <p>Ha ugyanazon beadvány több eljárástípust érint, a Workzy azt részekre bonthatja, és minden részre a megfelelő határidőt és felelőst alkalmazza. Erről a panaszost tájékoztatja.</p>

          <h2 className="text-2xl font-bold text-slate-800">5. A panasz benyújtásának módjai</h2>
          <p>5.1. Hivatalos panasz az alábbi írásbeli csatornákon nyújtható be:</p>
          <ul>
            <li>emailben az info@workzy.hu címre;</li>
            <li>postai levélben a 2484 Gárdony, Géza utca 28. címre.</li>
          </ul>
          <p>5.2. A telefonon jelzett ügyet a Workzy ügyfélszolgálati kérésként vagy sürgős hibajelzésként azonnal kezelheti. Hivatalos panaszként való nyilvántartásba vételéhez a Workzy írásbeli összefoglalást kérhet, vagy a telefonbeszélgetés alapján készített írásbeli összefoglalást megküldheti jóváhagyásra.</p>
          <p>5.3. A panaszos meghatalmazott útján is eljárhat. A Workzy a képviseleti jogosultság észszerű igazolását kérheti, különösen fizetési, számlázási, fiókjogosultsági vagy személyesadat-ügyben.</p>

          <h2 className="text-2xl font-bold text-slate-800">6. A panasz szükséges tartalma</h2>
          <p>6.1. A gyors és érdemi kivizsgálás érdekében a panasz lehetőség szerint tartalmazza:</p>
          <ul>
            <li>a panaszos nevét, vállalkozás esetén cégnevét és adószámát;</li>
            <li>a kapcsolattartó nevét és válaszcímét;</li>
            <li>a rendelés-, kampány-, állás-, jelentkezés-, számla- vagy tranzakcióazonosítót;</li>
            <li>a kifogásolt esemény pontos leírását és időpontját;</li>
            <li>a kért intézkedést vagy jóvátételt;</li>
            <li>a rendelkezésre álló bizonyítékokat, képernyőképet vagy dokumentumot;</li>
            <li>annak jelzését, ha sürgős hozzáférési, fizetési, biztonsági vagy adatvédelmi kockázat áll fenn.</li>
          </ul>
          <p>6.2. A Workzy nem kérheti a panasz elbírálásához szükségtelen személyes adat, egészségügyi adat, hatósági erkölcsi bizonyítvány, személyazonosító okmány teljes másolata vagy bankkártyaadat megküldését.</p>
          <p>
            <strong>Biztonsági figyelmeztetés:</strong> panaszban soha ne küldjön teljes bankkártyaszámot, CVC/CVV-kódot, jelszót, API-kulcsot
            vagy más hitelesítési titkot. A Workzy ilyen adatot nem kér.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">7. Beérkezés, visszaigazolás és nyilvántartásba vétel</h2>
          <p>7.1. A Workzy az írásbeli panaszt egyedi ügyazonosítóval nyilvántartásba veszi. Az azonosítót a későbbi kommunikációban fel kell tüntetni.</p>
          <p>7.2. Elektronikus panasz esetén a Workzy lehetőség szerint 1 munkanapon belül visszaigazolja a beérkezést. A visszaigazolás nem jelenti a panasz megalapozottságának elismerését.</p>
          <p>7.3. A panasz sürgősségét és kategóriáját a Workzy előzetesen osztályozza. A biztonsági, adatvédelmi, fizetési vagy teljes hozzáférés-kiesési ügyeket elsőbbséggel kezeli.</p>
          <p>7.4. A Workzy a nyilvánvalóan téves címre érkezett, de panaszjellegű beadványt belsőleg a megfelelő felelősnek továbbítja, amennyiben ez észszerűen lehetséges.</p>

          <h2 className="text-2xl font-bold text-slate-800">8. Kivizsgálási folyamat és határidők</h2>
          <p>8.1. A kivizsgálás tipikus lépései: beérkezés és kategorizálás; sürgős kárenyhítés; jogosultság-ellenőrzés; rendszer- és dokumentumbizonyítékok vizsgálata; szükség esetén hiánypótlás; döntés; intézkedés; válasz; utókövetés és folyamatjavítás.</p>
          <p>8.2. A Workzy általános belső célja, hogy a hivatalos panaszra 5 munkanapon belül érdemi választ adjon. Minden hivatalos panaszt legkésőbb a beérkezéstől számított 30 napon belül érdemben megválaszol, kivéve, ha kötelező jogszabály más határidőt állapít meg.</p>
          <p>8.3. Az általános ügyfélszolgálati kérdések célideje 2 munkanap. Fizetési és hozzáférési hibáknál az első érdemi vizsgálati vagy állapotközlési célidő 1 munkanap.</p>
          <p>8.4. A célidő nem automatikus teljesítési vagy megoldási garancia. Összetett, külső szolgáltatót, bankot, számlázót, hirdetési platformot vagy több érintettet bevonó ügyben a teljes megoldás hosszabb időt igényelhet, de a Workzy a 30 napos válaszhatáridőn belül köteles érdemi döntést vagy világos intézkedési tervet közölni.</p>
          <p>8.5. A hiánypótlásra történő felhívás nem használható a kivizsgálás indokolatlan késleltetésére. A Workzy a rendelkezésére álló adatok alapján akkor is megteszi az azonnal szükséges kárenyhítő intézkedéseket, ha a beadvány később pontosításra szorul.</p>

          <h2 className="text-2xl font-bold text-slate-800">9. Szolgáltatási és kampánypanaszok</h2>
          <p>9.1. Szolgáltatási vagy kampánypanasz lehet különösen a kampány késedelmes indulása, téves állapot, nem jóváhagyott lényeges módosítás, hibás szüneteltetés, hozzáférési idő téves számítása vagy a vállalt szolgáltatáselem elmaradása.</p>
          <p>9.2. A kivizsgálás során ellenőrizni kell különösen a megrendelési összesítőt, jóváhagyási naplót, kampányindítási és szüneteltetési időpontokat, rendszerkimaradást, ügyfélutasításokat, külső hirdetési szolgáltató eseményeit és a Workzy által ténylegesen elvégzett munkát.</p>
          <p>9.3. Önmagában a jelentkezők alacsony száma, a jelentkező későbbi elérhetetlensége, visszalépése, szubjektív alkalmatlansága vagy a felvétel elmaradása nem bizonyít szolgáltatási hibát, mert a Workzy nem vállal eredmény-, interjú- vagy felvételi garanciát.</p>
          <p>9.4. Megalapozott panasz esetén lehetséges intézkedés lehet a hiba javítása, kampányidő-hosszabbítás, pótteljesítés, arányos szolgáltatási jóváírás, részleges vagy teljes visszatérítés, illetve indokolt esetben a szerződés megszüntetése.</p>

          <h2 className="text-2xl font-bold text-slate-800">10. Fizetési, számlázási és visszatérítési panaszok</h2>
          <p>10.1. Fizetési panasz esetén a Workzy a saját rendelési és webhooknaplóit, a SimplePay által rendelkezésre bocsátott kereskedői adatokat, valamint a Workzy visszaigazolását vizsgálja. A bankkártya- vagy bankszámlaadatok teljes körét a Workzy nem kezeli.</p>
          <p>10.2. Sikeres terhelés, de elmaradt aktiválás esetén a rendszer az ügyet &bdquo;feldolgozás alatt&rdquo; állapotban kezelheti; a Megrendelőt nem kell második fizetésre kényszeríteni. A Workzy az aktiválást helyreállítja, vagy ha ez nem lehetséges, teljes visszatérítést indít.</p>
          <p>10.3. Igazolt dupla terhelés esetén a második teljes összeget vissza kell téríteni; nem indulhat második kampány és nem készülhet indokolatlan második végleges számla.</p>
          <p>10.4. Számlázási kifogásnál ellenőrizni kell a megrendeléskori számlázási adatokat és a Billingo által kiállított bizonylatot. Kiállítás után az adat nem írható át informálisan; szükség esetén jogszerű módosító vagy érvénytelenítő bizonylat készül.</p>
          <p>
            10.5. A visszatérítési igényt a Workzy <a href="/fizetes-lemondas-visszaterites">Fizetési, Lemondási és Visszatérítési Szabályzata</a>{" "}
            alapján kell elbírálni. A panaszos által kért összeg önmagában nem köti a Workzyt, de az elutasítást vagy részleges teljesítést meg
            kell indokolni.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">11. Jelentkezői hozzáféréssel és érvényességgel kapcsolatos panaszok</h2>
          <p>11.1. A Megrendelő az adott jelentkező adatainak láthatóvá válásától számított 48 órán belül kifogásolhatja, hogy a jelentkező nem felel meg az objektív érvényességi feltételeknek.</p>
          <p>11.2. Objektív érvénytelenségi ok lehet különösen a kötelező adat vagy használható kapcsolat hiánya, spam- vagy tesztjelentkezés, illetve ugyanazon állásra benyújtott nyilvánvaló duplikáció.</p>
          <p>11.3. Nem érvénytelenségi ok önmagában, ha a jelentkező később nem elérhető, visszalép, nem jelenik meg, vagy a Megrendelő szubjektíven nem tartja megfelelőnek.</p>
          <p>11.4. Megalapozott kifogás esetén a Workzy az érintett jelentkezőt kiveheti az érvényes számlálásból és korrigálhatja a számlálót. Egyedi jelentkezőre automatikus pénzvisszatérítés nem jár; indokolt esetben idő- vagy szolgáltatási jóváírás adható.</p>
          <p>11.5. A Workzy egy kör belső felülvizsgálatot biztosít. A döntés nem korlátozza a Megrendelő törvényes jogérvényesítési lehetőségeit.</p>

          <h2 className="text-2xl font-bold text-slate-800">12. Tartalommoderálási és fiókkorlátozási panaszok</h2>
          <p>12.1. A Workzy megtagadhatja, korlátozhatja, felfüggesztheti vagy eltávolíthatja a jogellenes, megtévesztő, diszkriminatív, hamis, harmadik személy jogát sértő, veszélyes vagy a platform biztonságát veszélyeztető tartalmat, valamint visszaélés vagy súlyos szerződésszegés esetén korlátozhatja a fiókot.</p>
          <p>12.2. A korlátozó döntésről &ndash; amennyiben jogszabály, biztonsági érdek vagy hatósági megkeresés nem zárja ki &ndash; közérthető indokolást ad, amely megjelöli a döntés lényegét, alapját, időtartamát és a felülvizsgálati lehetőséget.</p>
          <p>12.3. A felhasználó a döntés közlésétől számított 15 napon belül kérhet belső felülvizsgálatot, és bemutathatja a javított tartalmat vagy a döntést cáfoló adatokat. Súlyos biztonsági vagy adatvédelmi kockázat esetén a korlátozás a felülvizsgálat alatt is fennmaradhat.</p>
          <p>12.4. A jelen eljárás önkéntesen magas átláthatósági szintet követ; nem állítja, hogy a Workzyra valamely uniós online platform minősítés adott formában alkalmazandó.</p>

          <h2 className="text-2xl font-bold text-slate-800">13. Adatvédelmi és biztonsági panaszok</h2>
          <p>13.1. Az adatvédelmi tárgyú beadványt az info@workzy.hu címen lehet megtenni. A Workzy a beadvány tartalma alapján eldönti, hogy az általános panasz, érintetti joggyakorlási kérelem, adatvédelmi incidensjelzés vagy ezek kombinációja.</p>
          <p>13.2. Az érintetti joggyakorlási kérelmekre a GDPR szerinti határidő vonatkozik: a Workzy főszabály szerint a kérelem beérkezésétől számított egy hónapon belül intézkedik vagy tájékoztat. A Workzy belső célja 10 munkanap, de összetett vagy nagyszámú kérelemnél a GDPR szerinti, indokolt hosszabbítás alkalmazható.</p>
          <p>13.3. Feltételezett adatvédelmi vagy biztonsági incidensnél a Workzy haladéktalanul rögzíti az eseményt, megkezdi a kockázatértékelést és a kárenyhítést. Kockázatos személyesadat-incidensnél a NAIH értesítése indokolatlan késedelem nélkül, lehetőség szerint 72 órán belül történik; magas kockázat esetén az érintettek tájékoztatása is szükséges lehet.</p>
          <p>
            13.4. A panaszos a Workzy belső eljárásától függetlenül jogosult a Nemzeti Adatvédelmi és Információszabadság Hatósághoz fordulni,
            illetve bírósági jogorvoslatot igénybe venni. A NAIH aktuális elérhetőségei a{" "}
            <a href="https://www.naih.hu">https://www.naih.hu</a> oldalon találhatók.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">14. Hiánypótlás és együttműködés</h2>
          <p>14.1. Ha a panasz a rendelkezésre álló adatok alapján nem bírálható el, a Workzy egyértelműen megjelöli, milyen kiegészítésre van szükség és miért.</p>
          <p>14.2. A panaszos köteles jóhiszeműen együttműködni, a lényeges adatokat pontosan megadni és a rendelkezésére álló bizonyítékokat megőrizni. A Workzy nem felel a valótlan, hiányos vagy késedelmes adatszolgáltatásból eredő késedelemért, de a rendelkezésre álló adatok alapján továbbra is köteles a szükséges kárenyhítést elvégezni.</p>
          <p>14.3. Ha a panaszos észszerű határidőn belül nem pótolja a döntéshez nélkülözhetetlen adatot, a Workzy a panaszt a rendelkezésre álló információk alapján bírálhatja el, vagy indokolt esetben az eljárást lezárhatja. Ez nem zárja ki új, megfelelően alátámasztott panasz benyújtását.</p>

          <h2 className="text-2xl font-bold text-slate-800">15. Döntés, indokolás és lehetséges intézkedések</h2>
          <p>15.1. Az érdemi válasz tartalmazza: a panasz és az azonosított tényállás rövid összefoglalását; az elfogadott és elutasított elemeket; a döntés indokát; az elrendelt vagy felajánlott intézkedést; a teljesítés várható idejét; a belső felülvizsgálat és külső jogérvényesítés lehetőségét.</p>
          <p>15.2. A Workzy teljesen vagy részben helyt adhat a panasznak, elutasíthatja, egyezségi javaslatot tehet, vagy további technikai/szakértői intézkedést rendelhet el.</p>
          <p>15.3. Lehetséges intézkedések különösen: adat vagy állapot helyesbítése; hozzáférés visszaállítása; tartalom javítása; kampány hosszabbítása vagy pótteljesítése; számlakorrekció; visszatérítés; szolgáltatási jóváírás; fiókkorlátozás megszüntetése vagy fenntartása; adat törlése vagy korlátozása; biztonsági kontroll bevezetése.</p>
          <p>15.4. A jóvátétel mértékének arányban kell állnia a tényleges hibával, a már teljesített szolgáltatással, a közvetlenül igazolt kárral és az ÁSZF felelősségi szabályaival. A Workzy nem vállal automatikus kártérítést elmaradt haszonért, üzleti lehetőségért, sikertelen felvételért vagy közvetett kárért, a jogszabály szerint ki nem zárható esetek kivételével.</p>

          <h2 className="text-2xl font-bold text-slate-800">16. Belső felülvizsgálat</h2>
          <p>16.1. A panaszos az első érdemi döntés kézhezvételétől számított 15 napon belül egy alkalommal kérhet belső felülvizsgálatot, ha megjelöli a vitatott pontot és az új tényt, bizonyítékot vagy értelmezési okot.</p>
          <p>16.2. A felülvizsgálatot lehetőség szerint olyan jogosult személy végzi, aki az első döntés meghozatalában nem vett részt; ha ez a Workzy egyéni vállalkozói működéséből adódóan nem biztosítható, a döntést elkülönített, dokumentált második vizsgálatban kell felülvizsgálni, szükség szerint külső szakértő bevonásával.</p>
          <p>16.3. A belső felülvizsgálat nem kötelező előfeltétele a hatósági vagy bírósági jogérvényesítésnek, és nem hosszabbítja meg automatikusan a jogszabályi elévülési, jogvesztő vagy jogorvoslati határidőket.</p>

          <h2 className="text-2xl font-bold text-slate-800">17. Panasznyilvántartás és megőrzés</h2>
          <p>17.1. A Workzy a panaszt, a kapcsolódó bizonyítékokat, belső vizsgálati adatokat, döntést és választ a panasz lezárásától számított 5 évig őrzi meg, illetve tovább, ha számviteli kötelezettség, folyamatban lévő jogvita, hatósági eljárás vagy jogi igény ezt indokolja.</p>
          <p>17.2. A nyilvántartás tartalmazhatja az ügyazonosítót, panaszos és érintett szervezet azonosító adatait, beérkezési és lezárási időpontot, kategóriát, súlyosságot, vizsgálati lépéseket, döntést, intézkedést, kommunikációt és felülvizsgálatot.</p>
          <p>17.3. A panaszadatokhoz csak az ügy kivizsgálásához, jogi megfelelőséghez, pénzügyi rendezéshez, biztonsághoz vagy jogvédelemhez szükséges jogosult személyek férhetnek hozzá. A naplókat jogosulatlan módosítás ellen védeni kell.</p>

          <h2 className="text-2xl font-bold text-slate-800">18. Bizalmasság és személyes adatok kezelése</h2>
          <p>18.1. A panaszkezelés során kezelt személyes adatok célja a beadvány azonosítása, kivizsgálása, kapcsolattartás, döntés, intézkedés, jogi kötelezettségek teljesítése és jogi igények kezelése.</p>
          <p>18.2. A Workzy csak a szükséges adatokat továbbítja külső szolgáltatónak &ndash; például SimplePaynek, Billingónak, tárhely- vagy hirdetési szolgáltatónak &ndash;, ha a panasz kivizsgálásához ez elengedhetetlen, és az adattovábbítás jogalapja, címzettje és célja megfelelően dokumentált.</p>
          <p>18.3. A panasz más jelentkező vagy felhasználó adatait is érintheti. A Workzy a döntés indokolásakor védi harmadik személy személyes adatait, magánszféráját, üzleti titkát és biztonsági információit; ezért bizonyos részletek kitakarhatók vagy összefoglalhatók.</p>
          <p>
            18.4. A részletes adatkezelési szabályokat a Workzy mindenkor hatályos <a href="/adatkezelesi-tajekoztato">Adatkezelési Tájékoztatója</a>{" "}
            tartalmazza.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">19. Külső jogérvényesítés és jogvita</h2>
          <p>19.1. A felek törekednek arra, hogy a végleges belső panaszválaszt követően legalább 15 naptári napos írásbeli egyeztetéssel rendezzék a vitát. Ez az egyeztetés nem akadályozza sürgős ideiglenes intézkedés, hatósági bejelentés vagy más azonnali jogvédelem igénybevételét, és nem hosszabbít meg automatikusan törvényi határidőt.</p>
          <p>19.2. Sikertelen egyeztetés esetén a magyar jog alkalmazandó, és a jogvita elbírálására a hatáskörrel és illetékességgel rendelkező magyar bíróság jogosult.</p>
          <p>19.3. Adatvédelmi ügyben a panaszos a NAIH-hoz vagy bírósághoz fordulhat.</p>
          <p>19.4. A Workzy szolgáltatása B2B szolgáltatás; fogyasztó nem vásárolhat. Ha egy jogviszony kötelező jogszabály alapján mégis fogyasztói jogviszonynak minősülne, a jelen Tájékoztató nem korlátozza a fogyasztót megillető kógens jogokat, panaszkezelési határidőket vagy békéltető testületi lehetőségeket.</p>

          <h2 className="text-2xl font-bold text-slate-800">20. Hatály, verziókezelés és módosítás</h2>
          <p>
            20.1. A Tájékoztató aktuális változata a Workzy <a href="/jogi">Jogi Dokumentumközpontjában</a> nyilvánosan, bejelentkezés nélkül
            elérhető. A korábbi változatokat verziószámmal és hatályossági idővel archiváljuk.
          </p>
          <p>20.2. A folyamatot érintő lényeges módosítás előtt a Workzy frissíti a Tájékoztatót és az érintett felületi szövegeket. A már benyújtott panaszt főszabály szerint a beérkezéskor hatályos eljárási szabályok alapján kezeli, kivéve, ha az új szabály kedvezőbb vagy kötelező jogszabály azonnali alkalmazást kíván.</p>

          <h2 className="text-2xl font-bold text-slate-800">1. melléklet &ndash; Panaszbejelentő adatlap</h2>
          <p>Emailes panasz esetén az alábbi adatok megadása javasolt. A csillaggal jelölt mezők az adott ügy típusától függően kötelezők lehetnek.</p>
          <table>
            <tbody>
              <tr><td>Panaszos típusa*</td><td>Megrendelő / céges felhasználó / Jelentkező / más érintett</td></tr>
              <tr><td>Cégnév és adószám</td><td>Üzleti panasz esetén</td></tr>
              <tr><td>Kapcsolattartó neve*</td><td>Az ügyben eljáró személy</td></tr>
              <tr><td>Kapcsolattartó email*</td><td>A válasz kézbesítési címe</td></tr>
              <tr><td>Telefonszám</td><td>Opcionális; sürgős egyeztetéshez</td></tr>
              <tr><td>Ügyazonosító</td><td>Rendelés-, kampány-, állás-, jelentkezés-, számla- vagy tranzakcióazonosító</td></tr>
              <tr><td>Panasz kategóriája*</td><td>Szolgáltatás / kampány / fizetés / számla / visszatérítés / jelentkező / moderáció / fiók / adatvédelem / biztonság / egyéb</td></tr>
              <tr><td>Esemény időpontja*</td><td>Mikor történt vagy mikor észlelte</td></tr>
              <tr><td>Részletes leírás*</td><td>Tények időrendben, lehetőleg konkrétan</td></tr>
              <tr><td>Kért intézkedés</td><td>Javítás, aktiválás, visszatérítés, hozzáférés, felülvizsgálat stb.</td></tr>
              <tr><td>Sürgősség</td><td>Van-e folyamatban pénzügyi, hozzáférési vagy adatbiztonsági kockázat</td></tr>
              <tr><td>Melléklet</td><td>Képernyőkép, email, számla vagy más releváns bizonyíték &ndash; titkok és teljes bankkártyaadatok nélkül</td></tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-slate-800">2. melléklet &ndash; Panaszkategória- és célidőmátrix</h2>
          <table>
            <thead>
              <tr><th>Kategória</th><th>Első reakció célideje</th><th>Érdemi válasz / intézkedés</th><th>Prioritás</th></tr>
            </thead>
            <tbody>
              <tr><td>Általános ügyfélszolgálat</td><td>2 munkanap</td><td>Az ügy jellegétől függően</td><td>Normál</td></tr>
              <tr><td>Hivatalos szolgáltatási panasz</td><td>1 munkanapos visszaigazolás</td><td>Belső cél 5 munkanap; maximum 30 nap</td><td>Normál / emelt</td></tr>
              <tr><td>Fizetett, de nem aktivált rendelés</td><td>1 munkanap, lehetőleg hamarabb</td><td>Aktiválás vagy visszatérítési döntés soron kívül</td><td>Magas</td></tr>
              <tr><td>Dupla terhelés gyanúja</td><td>1 munkanap</td><td>Igazolás után a második összeg teljes visszatérítése</td><td>Magas</td></tr>
              <tr><td>Teljes fiók- vagy jelentkezői hozzáférés-kiesés</td><td>1 munkanap</td><td>Helyreállítás vagy kerülő megoldás soron kívül</td><td>Magas</td></tr>
              <tr><td>Adatvédelmi joggyakorlás</td><td>Visszaigazolás lehetőség szerint 1 munkanap</td><td>Belső cél 10 munkanap; GDPR szerint főszabály szerint 1 hónap</td><td>Emelt</td></tr>
              <tr><td>Biztonsági / adatvédelmi incidens</td><td>Azonnali belső riasztás</td><td>Kockázatalapú incidensfolyamat; NAIH adott esetben 72 órán belül</td><td>Kritikus</td></tr>
              <tr><td>Moderáció / fiókkorlátozás</td><td>1 munkanapos visszaigazolás</td><td>Belső cél 5 munkanap; maximum 30 nap</td><td>Emelt</td></tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-slate-800">3. melléklet &ndash; Intézkedési és jóvátételi mátrix</h2>
          <table>
            <thead>
              <tr><th>Megállapítás</th><th>Lehetséges intézkedés</th><th>Korlát / megjegyzés</th></tr>
            </thead>
            <tbody>
              <tr><td>Technikai állapothiba</td><td>Adat- vagy állapotjavítás, hozzáférés helyreállítása</td><td>Az eseményt és a javítást naplózni kell.</td></tr>
              <tr><td>Workzy miatti kampánykiesés</td><td>Időhosszabbítás, pótteljesítés, arányos jóváírás vagy visszatérítés</td><td>Az okot és a ténylegesen kiesett időt igazolni kell.</td></tr>
              <tr><td>Külső szolgáltató hibája</td><td>Kárenyhítés, csatornaváltás, időhosszabbítás, teljes lehetetlenségnél arányos jóváírás/visszatérítés</td><td>A Workzy nem vállal automatikus felelősséget a kontrollján kívüli eseményért.</td></tr>
              <tr><td>Dupla fizetés</td><td>A második teljes összeg visszatérítése</td><td>Nincs második kampány vagy indokolatlan számla.</td></tr>
              <tr><td>Hibás számlaadat a Workzy oldalán</td><td>Jogszerű számlakorrekció</td><td>Nem informális adatátírás.</td></tr>
              <tr><td>Objektíven érvénytelen jelentkező</td><td>Számlálókorrekció, esetleges idő-/szolgáltatási jóváírás</td><td>Nincs automatikus jelentkezőnkénti pénzvisszatérítés.</td></tr>
              <tr><td>Szubjektív alkalmatlanság / későbbi visszalépés</td><td>Panasz elutasítása</td><td>Nincs eredménygarancia.</td></tr>
              <tr><td>Téves moderáció vagy fiókkorlátozás</td><td>Tartalom/fiók visszaállítása, indokolás és szükség esetén szolgáltatási kompenzáció</td><td>Harmadik személy jogait és biztonsági információkat védeni kell.</td></tr>
              <tr><td>Adatvédelmi hiba</td><td>Helyesbítés, törlés, korlátozás, hozzáférés, biztonsági intézkedés, incidensértesítés</td><td>A GDPR és az Adatkezelési Tájékoztató szerint.</td></tr>
              <tr><td>Nem megalapozott panasz</td><td>Indokolt elutasítás</td><td>Felülvizsgálat és külső jogérvényesítés lehetőségét közölni kell.</td></tr>
            </tbody>
          </table>

          <p>
            Kapcsolódó dokumentumok: <a href="/aszf">Általános Szerződési Feltételek</a>, <a href="/adatkezelesi-tajekoztato">Adatkezelési Tájékoztató</a>,{" "}
            <a href="/fizetes-lemondas-visszaterites">Fizetési, Lemondási és Visszatérítési Szabályzat</a>. A teljes jogi dokumentumlista a{" "}
            <a href="/jogi">Jogi Dokumentumközpontban</a> érhető el.
          </p>
        </div>
      </div>
    </main>
  );
}
