export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AszfPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm sm:p-16">
        <div className="prose prose-slate max-w-none">
          <h1 className="mb-2 text-4xl font-extrabold text-slate-900">Általános Szerződési Feltételek</h1>
          <p className="text-slate-500">munkáltatói és üzleti ügyfelek részére</p>
          <p>
            Aktuális változat &middot; v1.0
            <br />
            Hatályos: 2026. augusztus 1-től
            <br />
            Közzétéve: 2026. augusztus 1.
          </p>

          <p>
            A jelen Általános Szerződési Feltételek (ÁSZF) a Workzy fizetős és ingyenes munkáltatói szolgáltatásait szabályozza. A Jelentkezők
            platformhasználatára az Adatkezelési Tájékoztató vonatkozik; a jelen ÁSZF Jelentkezőkre vonatkozó rendelkezései elsődlegesen a
            Megrendelő jogait és kötelezettségeit határozzák meg.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">1. A Szolgáltató adatai és elérhetősége</h2>
          <ul className="list-none pl-0">
            <li><strong>Szolgáltató:</strong> Prigl Tamás egyéni vállalkozó</li>
            <li><strong>Platform / szolgáltatás neve:</strong> Workzy</li>
            <li><strong>Székhely:</strong> 2484 Gárdony, Géza utca 28.</li>
            <li><strong>Egyéni vállalkozói nyilvántartási szám:</strong> 62599289</li>
            <li><strong>Nyilvántartást vezető szerv:</strong> Nemzeti Adó- és Vámhivatal (NAV) &ndash; Egyéni Vállalkozók Nyilvántartása</li>
            <li><strong>Adószám:</strong> 92233913-1-27</li>
            <li><strong>Statisztikai számjel:</strong> 92233913-7311-231-07</li>
            <li><strong>Kamarai nyilvántartási szám:</strong> FE92233913</li>
            <li><strong>Egyéni vállalkozói tevékenység kezdete:</strong> 2026. július 23.</li>
            <li><strong>Áfa-jogállás:</strong> Alanyi adómentes</li>
            <li><strong>Weboldal:</strong> <a href="https://workzy.hu">https://workzy.hu</a></li>
            <li><strong>Általános és jogi kapcsolattartás:</strong> <a href="mailto:info@workzy.hu">info@workzy.hu</a></li>
            <li><strong>Ügyfélszolgálati telefonszám:</strong> +36 70 432 7579</li>
            <li><strong>Postai kapcsolattartás:</strong> 2484 Gárdony, Géza utca 28.</li>
          </ul>
          <p>
            1.1. A Szolgáltató a Workzy platformot és az ahhoz kapcsolódó szolgáltatásokat saját neve alatt nyújtja. A &bdquo;Workzy&rdquo; a
            platform és a szolgáltatás megjelölése; a szerződő szolgáltató Prigl Tamás egyéni vállalkozó.
          </p>
          <p>
            1.2. A Szolgáltató nyilvántartott főbb tevékenységei: reklámtervezés, -készítés és -elhelyezés; internetes keresőportállal kapcsolatos
            tevékenység; online hirdetési felület értékesítése.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">2. Az ÁSZF hatálya és elfogadása</h2>
          <p>
            2.1. A jelen ÁSZF a Szolgáltató és a Workzy szolgáltatásait igénybe vevő, magyar adószámmal rendelkező vállalkozás, egyéni vállalkozó,
            jogi személy vagy más szervezet közötti jogviszonyra terjed ki.
          </p>
          <p>
            2.2. Fizetős csomagot kizárólag üzleti vagy szakmai célból eljáró szervezet vásárolhat. Magánszemély fogyasztóként nem rendelhet
            szolgáltatást. A Megrendelő a regisztráció és a checkout során kifejezetten nyilatkozik arról, hogy nem fogyasztóként jár el.
          </p>
          <p>
            2.3. A jelen ÁSZF elfogadása kötelező a díjmentes próba aktiválásához és minden fizetős megrendeléshez. A Szolgáltató rögzíti az
            elfogadás időpontját, a felhasználót, a dokumentum verzióját és a megrendelési összesítő állapotát.
          </p>
          <p>
            2.4. A Megrendelő a szolgáltatás használatával egyidejűleg köteles betartani az Adatkezelési Tájékoztatót, az Adatfeldolgozási
            Mellékletet, a Fizetési, Lemondási és Visszatérítési Szabályzatot, a Panaszkezelési Tájékoztatót, valamint a felületen közzétett, a
            jelen ÁSZF-fel összhangban álló működési szabályokat.
          </p>
          <p>2.5. Egyedi írásbeli megállapodás a jelen ÁSZF-től eltérhet. Eltérés esetén az egyedi megállapodás elsőbbséget élvez az abban szabályozott kérdésekben.</p>

          <h2 className="text-2xl font-bold text-slate-800">3. Fogalommeghatározások</h2>
          <ul>
            <li><strong>Aktiválás:</strong> a Szolgáltató elektronikus visszaigazolásában megjelölt időpont, amikor a megrendelt szolgáltatás vagy kampány ténylegesen elindul.</li>
            <li><strong>Állás:</strong> egy meghatározott munkakörre és lényegében egységes foglalkoztatási feltételekre vonatkozó hirdetési egység.</li>
            <li><strong>Álláshirdetés:</strong> a Megrendelő adatai, nyilatkozatai és jóváhagyása alapján a Workzy által elkészített vagy közzétett állástartalom.</li>
            <li><strong>Érvényes jelentkező:</strong> olyan jelentkezés, amely tartalmazza a kötelező adatokat és használható kapcsolattartási adatot, nem spam, nem teszt, és ugyanazon állásra nem nyilvánvaló ismételt jelentkezés.</li>
            <li><strong>Felhasználó:</strong> a Megrendelő nevében a Workzy fiókot használó, meghívott természetes személy.</li>
            <li><strong>Jelentkező:</strong> a Workzy felületén vagy a Workzy által működtetett jelentkezési folyamatban egy állásra jelentkező, 18. életévét betöltött természetes személy.</li>
            <li><strong>Kampány:</strong> a Workzy által szakmailag összeállított, egy vagy több online csatornát, kreatívot, organikus vagy fizetett megjelenést és jelentkezőgyűjtést magában foglaló toborzási marketingtevékenység.</li>
            <li><strong>Kampányidőszak:</strong> a fizetős kampány Aktiválásától számított tizennégy naptári nap, a szabályosan engedélyezett szünet és a Workzy igazolt technikai kiesése nélkül.</li>
            <li><strong>Megrendelő:</strong> a Workzy szolgáltatást üzleti célból igénybe vevő, magyar adószámmal rendelkező szervezet.</li>
            <li><strong>Megrendelési összesítő:</strong> a fizetés előtt szerkeszthető, majd véglegesített elektronikus összefoglaló a Megrendelő, a csomag, az állás, az ár és az elfogadott feltételek adataival.</li>
            <li><strong>Portál:</strong> a workzy.hu weboldal, a kapcsolódó ügyfél- és jelentkezői felületek, valamint a Szolgáltató által működtetett technikai rendszer.</li>
            <li><strong>Próba:</strong> a jelen ÁSZF 7. pontja szerinti, egyszeri, 72 órás, díjmentes üzleti kipróbálási lehetőség.</li>
            <li><strong>Zárolt jelentkező:</strong> a Próba során az első öt Érvényes jelentkezést követően beérkezett, a Megrendelő számára személyes adat nélkül, kizárólag darabszámként jelzett jelentkezés.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800">4. A Workzy szolgáltatásának jellege és jogi elhatárolása</h2>
          <p>
            4.1. A Workzy online álláshirdetési, toborzási marketing- és technológiai platform. A szolgáltatás különösen álláshirdetés-szerkesztést,
            kreatívkészítést, online megjelenést, kampánymenedzsmentet, jelentkezési felületet, jelentkezőgyűjtést, objektív előszűrési és
            döntéstámogató eszközöket foglalhat magában.
          </p>
          <p>
            4.2. A Szolgáltató nem munkaerő-kölcsönző és nem vállal magán-munkaközvetítői tevékenységet. Nem létesít munkaviszonyt a
            Jelentkezőkkel, nem biztosít munkavállalót a Megrendelő részére, és nem hozza meg a foglalkoztatási döntést.
          </p>
          <p>
            4.3. A Jelentkező alkalmasságáról, interjúra hívásáról, kiválasztásáról, elutasításáról és foglalkoztatásáról minden esetben a
            Megrendelő vagy az általa jogszerűen megbízott személy dönt. A Workzy által megjelenített pontszám, rangsor, címke, összefoglaló vagy
            figyelmeztetés kizárólag döntéstámogató jellegű, és nem helyettesíti az emberi értékelést.
          </p>
          <p>
            4.4. A Szolgáltató nem garantálja, hogy a szolgáltatás igénybevétele meghatározott számú jelentkezőt, interjút, megfelelő jelöltet,
            munkaviszonyt vagy üzleti eredményt eredményez.
          </p>
          <p>
            4.5. A később bevezetendő aktív jelöltajánlás, automatikus párosítás, közvetlen jelöltátadás vagy havidíjas jelöltértesítő szolgáltatás
            csak külön jogi felülvizsgálat és szükség esetén új feltételek elfogadása után aktiválható.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">5. Jogosultság, cégellenőrzés és felhasználói szerepkörök</h2>
          <p>5.1. A regisztrációhoz és a Próba igénybevételéhez a Megrendelő köteles valós és teljes cég-, adó-, kapcsolattartási és számlázási adatokat megadni.</p>
          <p>5.2. A Szolgáltató a regisztrációkor, a Próba előtt és fizetős megrendelés előtt automatikusan vagy manuálisan ellenőrizheti különösen az adószám formátumát, ellenőrző számát, az adózó nevét, működési státuszát, meglévő fiókját és korábbi Próba-használatát.</p>
          <p>5.3. Megszűnt, felfüggesztett, nem azonosítható vagy valótlan adatot használó szervezet számára a Szolgáltató megtagadhatja a regisztrációt, a Próbát, a megrendelést vagy az Aktiválást.</p>
          <p>5.4. A Megrendelő kijelenti, hogy a nevében eljáró Felhasználók megfelelő meghatalmazással vagy szervezeti jogosultsággal rendelkeznek. A Megrendelő felel a fiókjában létrehozott jogosultságokért és az ott tett nyilatkozatokért.</p>
          <p>5.5. Csomagot rendelni, jogi feltételeket elfogadni és a kampány első indítását jóváhagyni csak tulajdonos vagy adminisztrátori szerepkörrel rendelkező Felhasználó jogosult. Toborzó vagy megtekintő szerepkörű Felhasználó a számára engedélyezett állás- és jelentkezőkezelési műveleteket végezheti, de nem fizethet és nem fogadhat el jogi feltételeket a Megrendelő nevében.</p>
          <p>5.6. Toborzó, HR-szolgáltató vagy közvetítő cég kizárólag a saját ellenőrzött szervezeti neve és profilja alatt használhatja a Workzyt. Nem hozhat létre megtévesztő módon a megbízó munkáltató nevében önálló profilt, és nem keltheti azt a látszatot, hogy maga a munkáltató. A hirdetésben a &bdquo;megbízónk részére&rdquo; megjelölés használható, ha a Jelentkező számára egyértelmű, mely szolgáltató gyűjti az adatait és lép vele kapcsolatba.</p>
          <p>5.7. Teljesen anonim vagy &bdquo;bizalmas munkáltatói&rdquo; álláshirdetés nem tehető közzé.</p>

          <h2 className="text-2xl font-bold text-slate-800">6. Szolgáltatási csomagok és árak</h2>
          <table>
            <thead>
              <tr>
                <th>Csomag</th>
                <th>Fizetendő végösszeg</th>
                <th>Időtartam / állások</th>
                <th>Lényegi tartalom</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Workzy Portál</td>
                <td>25 990 Ft</td>
                <td>1 állás, 30 nap</td>
                <td>Portálon történő megjelenés. Nem tartalmaz fizetett kampányt, 72 órás próbaidőt vagy zárolt jelentkezők feloldását.</td>
              </tr>
              <tr>
                <td>Workzy Kampány</td>
                <td>59 990 Ft</td>
                <td>1 pozíció, 14 naptári nap</td>
                <td>Kreatívkészítés és kampánymenedzsment, jelentkezőgyűjtés; a próbaidő alatt zárolt jelentkezők feloldására is alkalmas.</td>
              </tr>
              <tr>
                <td>Workzy Kampány Pro</td>
                <td>99 990 Ft</td>
                <td>legfeljebb 2 állás, 1 közös 14 napos időszak</td>
                <td>Összehangolt kampányidőszak legfeljebb két állásra. Nem jelent két különálló kampányt vagy állásonként elkülönített hirdetési keretet.</td>
              </tr>
            </tbody>
          </table>
          <p>6.1. A fenti árak a Megrendelő által fizetendő végösszegek. A Szolgáltató alanyi adómentes, ezért a díjban felszámított általános forgalmi adó nem szerepel.</p>
          <p>6.2. Minden csomag egyszeri vásárlás. Nincs automatikus megújulás, előfizetés vagy ismétlődő bankkártya-terhelés.</p>
          <p>6.3. A Kampány és Kampány Pro rögzített díjú, egységes szolgáltatás. A Megrendelő nem kap elkülönített hirdetési pénztárcát vagy saját médiakeretet, és nem jogosult a Szolgáltató tényleges hirdetési költésének tételes elszámolására vagy a fel nem használt költés visszatérítésére.</p>
          <p>6.4. A Szolgáltató szakmai mérlegelése alapján határozza meg a csatornákat, a fizetett és organikus megjelenések arányát, a kreatívvariációkat, a célzást, az optimalizálást és a tényleges médiafelhasználást.</p>
          <p>6.5. A checkoutban megjelenő végleges Megrendelési összesítő a megrendelt csomag pontos tartalmát is tartalmazza. A Szolgáltató az ÁSZF-nél kedvezőbb vagy részletesebb egyedi tartalmat biztosíthat, de a már visszaigazolt megrendelés lényeges feltételeit a Megrendelő hátrányára nem ronthatja.</p>

          <h2 className="text-2xl font-bold text-slate-800">7. A 72 órás díjmentes próba</h2>
          <p>7.1. A Workzy a jogosult Megrendelő számára egy alkalommal 72 órás díjmentes Próbát biztosíthat egy álláshirdetéshez. A Próba nem előfizetés, bankkártya megadása nélkül igénybe vehető, és annak lejárata nem eredményez automatikus fizetést.</p>
          <p>7.2. Egy adózó a magyar adószám első nyolc számjegye alapján összesen egy Próbára jogosult, függetlenül a létrehozott fiókok, email-címek, felhasználók vagy kapcsolattartók számától.</p>
          <p>7.3. A Próba akkor kezdődik, amikor az állás a Szolgáltató rendszerében rögzített időpontban első alkalommal sikeresen, jelentkezésre alkalmas módon nyilvánosan megjelenik a Workzy portálon vagy a Workzy által automatikusan kezelt nyilvános csatornán. A piszkozat elküldése önmagában nem indítja el a 72 órát.</p>
          <p>7.4. A Próba keretében a Szolgáltató saját döntése alapján organikus vagy fizetett megjelenést is alkalmazhat. A Szolgáltató belső célként törekedhet ötnél több jelentkezésre, és saját költségén tipikusan 5 000&ndash;10 000 Ft közötti összeget is felhasználhat, ez azonban nem ügyfélnek járó hirdetési keret, nem garantált összeg és nem eredményvállalás.</p>
          <p>7.5. A fizetett vagy külső csatornák aktiválására nincs egy-két órás vagy más rövid szerződéses szolgáltatási szint. A Szolgáltató a Próba alatt szakmailag indokolt időben aktiválja és optimalizálja a csatornákat.</p>
          <p>7.6. A Workzy igazolt technikai kiesésének időtartama nem számít bele a 72 órába; a Szolgáltató a Próbát a kiesés időtartamával meghosszabbítja vagy annak megfelelő jóváírást biztosít.</p>
          <p>7.7. A Szolgáltató megtagadhatja vagy megszüntetheti a Próbát visszaélés, többszörös regisztráció, hamis cégadat, tiltott tartalom, adatvédelmi kockázat vagy biztonsági esemény esetén.</p>

          <h2 className="text-2xl font-bold text-slate-800">8. A jelentkezők érvényessége, láthatósága és zárolása</h2>
          <p>8.1. A Próba alatt az első öt Érvényes jelentkező teljes, a jelentkezéshez szükséges adatköre a Megrendelő számára díjmentesen megtekinthető.</p>
          <p>8.2. A hatodik és minden további, a Próba alatt beérkező Érvényes jelentkező Zárolt jelentkezőnek minősül. A Megrendelő kizárólag a zárolt jelentkezők számát láthatja; név, monogram, fénykép, elérhetőség, lakóhely, önéletrajz, kérdésválasz vagy más azonosítható részlet nem jeleníthető meg.</p>
          <p>8.3. A Megrendelő az első öt díjmentesen látható jelentkezőhöz a Próba lezárásától számított 30 napig fér hozzá.</p>
          <p>8.4. A zárolt jelentkezők a Próba lezárásától számított 14 napig oldhatók fel Workzy Kampány csomag megvásárlásával. A Workzy Portál csomag nem oldja fel a zárolt jelentkezőket.</p>
          <p>8.5. A Workzy Kampány sikeres fizetése és Workzy-visszaigazolása után valamennyi, az adott Próba során zárolt jelentkező haladéktalanul hozzáférhetővé válik, és a Megrendelő teljes, új 14 napos Kampányidőszakot kap. A Próba 72 órája nem csökkenti a fizetős Kampányidőszakot.</p>
          <p>8.6. Ha a Megrendelő a 14 napos feloldási időn belül nem vásárol megfelelő csomagot, a munkáltatóspecifikus feloldási lehetőség megszűnik. Ez nem érinti a Jelentkező esetleges, külön hozzájáruláson alapuló tehetségadatbázis-státuszát.</p>
          <p>8.7. Érvényes marad a jelentkezés akkor is, ha a Jelentkező később nem elérhető, visszavonja a jelentkezését, nem jelenik meg interjún, vagy a Megrendelő szakmailag nem tartja megfelelőnek.</p>
          <p>8.8. A Megrendelő az adat láthatóvá válásától számított 48 órán belül vitathatja a jelentkezés érvényességét, kizárólag objektív okból. Ilyen ok lehet különösen a hiányzó kötelező adat, használhatatlan kapcsolattartási adat, spam, teszt vagy nyilvánvaló duplikáció ugyanarra az állásra.</p>
          <p>8.9. A Szolgáltató a kifogást egy belső felülvizsgálati körben vizsgálja meg. Megalapozott kifogás esetén a jelentkező kikerül az érvényes számlálásból és a számláló korrigálható. Egyedi jelentkező vitatása önmagában nem keletkeztet automatikus pénz-visszatérítési jogot; a Szolgáltató méltányosságból idő- vagy szolgáltatási jóváírást adhat. A belső döntés nem zárja ki a jogszabály szerinti igényérvényesítést.</p>

          <h2 className="text-2xl font-bold text-slate-800">9. Álláshirdetés elkészítése, jóváhagyása és módosítása</h2>
          <p>9.1. A Megrendelő köteles a munkakör, munkavégzési hely, bérezés, juttatások, munkaidő, követelmények, foglalkoztatási forma és egyéb lényeges feltételek tekintetében pontos, valós és naprakész adatot adni.</p>
          <p>9.2. A Szolgáltató jogosult az álláshirdetés címét, szövegét, szerkezetét, vizuális megjelenését és kreatívját szakmai, teljesítmény-, nyelvi, jogi és márkaegységességi szempontból szerkeszteni. A munkakör lényegét, a bért, a munkavégzés helyét vagy más lényeges foglalkoztatási feltételt a Megrendelő jóváhagyása nélkül nem változtathatja meg.</p>
          <p>9.3. Az első nyilvános megjelenés vagy fizetős kampányindítás előtt a Megrendelő arra jogosult Felhasználója a &bdquo;Jóváhagyom és elindítom a kampányt&rdquo; vagy azzal egyenértékű egyértelmű gombbal digitálisan jóváhagyja a végleges tartalmat.</p>
          <p>9.4. Kisebb stilisztikai, tördelési, kreatív- vagy teljesítményoptimalizáló módosításhoz nem szükséges újabb jóváhagyás, ha az nem érinti a hirdetés lényeges tartalmát. Lényeges tartalmi módosításhoz új jóváhagyás szükséges.</p>
          <p>9.5. A Kampányidőszak alatt a munkakör nem cserélhető le más munkakörre. Új munkakör új állásnak és főszabály szerint új megrendelésnek minősül.</p>
          <p>9.6. A bér, juttatás, műszakrend, követelmény, kapcsolattartás, szövegezés és kisebb helyszínpontosítás módosítható a Szolgáltató ellenőrzése mellett. Alapvetően más célcsoport, munkavégzési hely, munkáltató vagy munkakör új kampánynak minősülhet.</p>
          <p>9.7. A Szolgáltató megőrzi az álláshirdetés lényeges verzióit és a rendszerben lehetőség szerint rögzíti, hogy a Jelentkező melyik verzió megtekintése után jelentkezett.</p>

          <h2 className="text-2xl font-bold text-slate-800">10. Tartalmi követelmények, moderálás és jogellenes tartalom</h2>
          <p>10.1. Tilos jogellenes, megtévesztő, valótlan, nem létező, hátrányosan megkülönböztető, sértő, veszélyes, jogsértő vagy a Workzy és a Jelentkezők biztonságát, jogait vagy jó hírnevét veszélyeztető álláshirdetés vagy tartalom közzététele.</p>
          <p>10.2. A Megrendelő nem kérhet a Jelentkezőtől jelentkezési, regisztrációs, közvetítési vagy más díjat a Workzy jelentkezési folyamatában.</p>
          <p>10.3. A Megrendelő nem tehet fel egészségi állapotra, diagnózisra, gyógyszerszedésre, várandósságra, családtervezésre, vallásra, politikai véleményre, etnikai származásra, szexuális irányultságra, szakszervezeti tagságra vagy más különleges személyes adatra irányuló kérdést, kivéve ha azt külön jogszabály kifejezetten lehetővé teszi és a Szolgáltató előzetesen jóváhagyta.</p>
          <p>10.4. A Workzyban nem kérhető és nem tölthető fel személyazonosító igazolvány, lakcímkártya, adókártya, társadalombiztosítási kártya, bankszámladokumentum, erkölcsi bizonyítvány, egészségügyi dokumentum vagy alkalmassági igazolás. A hirdetés jelezheti, ha a foglalkoztatás későbbi szakaszában jogszerűen szükséges valamely igazolás, de annak kezelése a Megrendelő külön felelőssége.</p>
          <p>10.5. A feltöltési folyamatban kizárólag önéletrajz, végzettségi vagy képesítési igazolás, vezetői vagy gépkezelői jogosultság fennállását igazoló dokumentum, szakmai tanúsítvány, illetve a Szolgáltató által előzetesen jóváhagyott állásspecifikus dokumentum kérhető.</p>
          <p>10.6. A Szolgáltató először lehetőség szerint javítást kér. Ha a tartalom nem javítható, a Megrendelő nem működik együtt, vagy a jogsértés súlyos, a Szolgáltató megtagadhatja a megjelenést, eltávolíthatja vagy korlátozhatja a tartalmat, felfüggesztheti a kampányt vagy megszüntetheti a jogviszonyt.</p>
          <p>10.7. Ha a szolgáltatás a Megrendelő tiltott vagy jogsértő tartalma miatt nem teljesíthető, nincs automatikus teljes visszatérítés. A Szolgáltató levonhatja az addig elvégzett, igazolható munka és felmerült költség arányos értékét, és részleges visszatérítést vagy jóváírást alkalmazhat.</p>
          <p>10.8. Jogellenes vagy más jogát sértő tartalom az info@workzy.hu címen vagy a Portál erre szolgáló űrlapján jelenthető. A bejelentés lehetőség szerint tartalmazza a kifogásolt tartalom azonosítóját vagy elérési helyét, a jogsértés indokát, a bejelentő elérhetőségét és a jóhiszeműségre vonatkozó nyilatkozatot.</p>
          <p>10.9. A Szolgáltató a bejelentést indokolatlan késedelem nélkül megvizsgálja, szükség esetén korlátozza vagy eltávolítja a tartalmat, és ahol jogszabály, hatósági döntés vagy biztonsági ok nem tiltja, a tartalmat biztosító Megrendelőt az intézkedés okáról tájékoztatja. A Megrendelő egy alkalommal belső felülvizsgálatot kérhet.</p>

          <h2 className="text-2xl font-bold text-slate-800">11. Elektronikus szerződéskötés és visszaigazolás</h2>
          <p>11.1. A szerződéskötés nyelve magyar. A Szolgáltató az ÁSZF-et letölthető és később előhívható formában teszi hozzáférhetővé.</p>
          <p>11.2. A Megrendelő a szerződéses nyilatkozat elküldése előtt megtekintheti és kijavíthatja a cég-, kapcsolattartási, számlázási, állás-, csomag- és fizetési adatokat a Megrendelési összesítőben.</p>
          <p>11.3. A díjmentes Próba jogviszonya akkor jön létre, amikor a Megrendelő elfogadja az ÁSZF-et, jóváhagyja az álláshirdetés végleges változatát, és a Szolgáltató elektronikus Aktiválási visszaigazolást küld.</p>
          <p>11.4. Fizetős megrendelésnél a Megrendelő által elküldött rendelés és a sikeres SimplePay fizetés önmagában még nem jelenti a Workzy visszaigazolását. A szerződés a sikeres fizetés és a Szolgáltató külön elektronikus rendelés-visszaigazolása együttesével jön létre.</p>
          <p>11.5. A SimplePay böngészőben megjelenő visszatérési vagy sikeroldala nem minősül a Workzy visszaigazolásának. A Szolgáltató a fizetés eredményét szerveroldali értesítés alapján dolgozza fel.</p>
          <p>11.6. A Szolgáltató a szerződést, a végleges Megrendelési összesítőt, az elfogadott dokumentumverziókat és az elfogadás időpontját elektronikus nyilvántartásban rögzíti. A dokumentumok a fiók fennállása alatt a Portálon hozzáférhetők, és emailben vagy letöltési lehetőséggel is rendelkezésre bocsáthatók.</p>
          <p>11.7. Ha a Szolgáltató nyilvánvaló árhiba, technikai hiba, jogosulatlan rendelés, hamis adat vagy jogellenes tartalom miatt a megrendelést a visszaigazolás előtt elutasítja, a teljes befizetett összeget visszatéríti.</p>

          <h2 className="text-2xl font-bold text-slate-800">12. Fizetés a SimplePay rendszerében</h2>
          <p>12.1. Az induláskor elérhető fizetési módok: SimplePay bankkártyás fizetés és SimplePay qvik fizetés. Kézi banki átutalás a standard online rendelési folyamatban nem érhető el.</p>
          <p>12.2. A Megrendelő a SimplePay oldalára történő átirányítás előtt végleges Megrendelési összesítőt kap, amely tartalmazza legalább a Megrendelő és kapcsolattartó adatait, adószámát, számlázási adatait, az állást, a csomagot, a csomag tartalmát, a fizetendő végösszeget, a fizetési módot és a jogi nyilatkozatokat.</p>
          <p>12.3. A checkout során külön kötelező nyilatkozat vonatkozik a B2B státuszra, az ÁSZF és a fizetési, teljesítési, lemondási és visszatérítési feltételek elfogadására, valamint a SimplePay által előírt aktuális adattovábbítási nyilatkozatra. A marketing-hozzájárulás külön, opcionális és alapértelmezetten üres választás.</p>
          <p>12.4. A fizetési gomb megnevezése a fizetési mód és összeg egyértelmű feltüntetésével történik, például: &bdquo;Fizetés SimplePay-jel &ndash; 59 990 Ft&rdquo;. A gomb közelében szerepel: &bdquo;Egyszeri fizetés, nincs automatikus megújulás.&rdquo;</p>
          <p>12.5. A bankkártyaadatokat a Workzy nem kezeli és nem tárolja; azokat a SimplePay saját fizetési felületén kezeli a saját szerződéses és adatvédelmi feltételei szerint.</p>
          <p>12.6. Sikertelen, megszakított, elutasított vagy lejárt fizetés esetén a zárolt jelentkezők nem oldódnak fel, a fizetős kampány nem indul el és számla nem készül. A Megrendelő lehetőség szerint ugyanazon rendelés alapján újra megkísérelheti a fizetést.</p>
          <p>12.7. Ha a SimplePay fizetett állapotot jelez, de a Workzy feldolgozása nem fejeződik be, a rendelés &bdquo;feldolgozás alatt&rdquo; állapotba kerül. A Megrendelő nem köteles és nem kérhető második fizetésre. A Szolgáltató kivizsgálja az esetet, és vagy manuálisan aktiválja a szolgáltatást, vagy teljes visszatérítést teljesít, ha az Aktiválás nem lehetséges.</p>
          <p>12.8. Dupla terhelés esetén a Szolgáltató a második teljes befizetést visszatéríti, és nem indít második kampányt vagy második számlázási folyamatot ugyanarra a rendelésre.</p>
          <p>12.9. A sikeres fizetést követően a Szolgáltató azonnali elektronikus visszaigazolásban közli legalább a rendelési azonosítót, a SimplePay tranzakcióazonosítót, a csomagot, az összeget, a feloldás állapotát, a kampány tervezett kezdetét és végét, valamint a számla állapotát.</p>

          <h2 className="text-2xl font-bold text-slate-800">13. Számlázás a Billingo rendszerében</h2>
          <p>13.1. A Szolgáltató a Workzy-visszaigazolást követően a Billingo rendszerén keresztül automatikusan állítja ki a hatályos adó- és számviteli szabályok szerinti bizonylatot.</p>
          <p>13.2. A számla vagy más megfelelő bizonylat a Megrendelő által megadott és a fizetés előtt ellenőrzött számlázási adatok alapján készül. A Billingo a bizonylatot a megadott email-címre továbbíthatja, és a Workzy a Portálon is hozzáférést biztosíthat.</p>
          <p>13.3. A számlázási adatok a fizetés elküldéséig szabadon javíthatók. A bizonylat kiállítása után a változtatás külön helyesbítési, módosítási vagy érvénytelenítési kérelemként kezelendő, és csak jogszerű számlamódosító dokumentummal hajtható végre.</p>
          <p>13.4. A fiókban később módosított számlázási adatok a már kiállított bizonylatot nem változtatják meg; főszabály szerint a jövőbeli rendelésekre alkalmazandók.</p>

          <h2 className="text-2xl font-bold text-slate-800">14. A teljesítés megkezdése és a kampányidőszak</h2>
          <p>14.1. A fizetős szolgáltatás teljesítése a sikeres fizetés és a Workzy visszaigazolása után megkezdődhet. A zárolt jelentkezők hozzáférhetővé tétele a szolgáltatás lényeges részének teljesítését jelenti.</p>
          <p>14.2. A fizetős Kampányidőszak az Aktiválási visszaigazolásban megjelölt napon kezdődik és 14 naptári napig tart. Az Aktiválás feltétele a szükséges adatok rendelkezésre állása, a tartalom jogszerűsége és a Megrendelő végleges jóváhagyása.</p>
          <p>14.3. Ha a Megrendelő a fizetés után nem adja meg a szükséges adatot, nem javítja a kifogásolt tartalmat vagy nem hagyja jóvá a kampányt, a kampány kezdete elhalasztható, de a Szolgáltató addig végzett előkészítő munkája teljesítésnek minősülhet.</p>
          <p>14.4. A Kampány Pro csomagban a legfeljebb két állás ugyanazon összehangolt 14 napos időszakban fut. Az egyik állás késedelme nem eredményez automatikusan külön 14 napos időszakot a másik állás számára, kivéve ha a Szolgáltató ezt külön visszaigazolja.</p>
          <p>14.5. A fizetős kampány jelentkezőihez a Megrendelő a Kampányidőszak végétől számított 90 napig fér hozzá. A Szolgáltató a hozzáférés lejárata előtt lehetőség szerint 14 és 3 nappal értesítést küld.</p>

          <h2 className="text-2xl font-bold text-slate-800">15. Szüneteltetés, változtatás és aktiválási határidő</h2>
          <p>15.1. A Megrendelő egy fizetős kampány során egy alkalommal, legfeljebb 7 naptári napra kérhet szüneteltetést. A szünet alatt a 14 napos Kampányidőszak nem fogy; az a hátralévő idővel folytatódik.</p>
          <p>15.2. A szüneteltetés a Szolgáltató visszaigazolásával lép hatályba. A külső hirdetési rendszerek technikai sajátosságai miatt a leállítás és újraindítás rövid feldolgozási időt igényelhet.</p>
          <p>15.3. A Workzy igazolt technikai kiesése nem számít a Megrendelő egyetlen szüneteltetésének, és a Szolgáltató a Kampányidőszakot a kieséssel arányosan meghosszabbítja vagy egyenértékű jóváírást ad.</p>
          <p>15.4. A Megrendelő által kért végleges leállítás esetén a hátralévő kampánynapokra nem jár automatikus pénz-visszatérítés.</p>
          <p>15.5. A kifizetett, de el nem indított kampánycsomag a fizetéstől számított 90 napig aktiválható. Ha a Megrendelő ezen időn belül nem biztosítja az adatokat, nem hagyja jóvá a tartalmat vagy nem kéri az indulást, a csomag felhasználási joga lejár, és nincs automatikus visszatérítés.</p>
          <p>15.6. Ha az Aktiválás a Szolgáltató érdekkörében felmerülő okból akadályozott, a 90 napos időszak az akadály időtartamával meghosszabbodik. Tartós Workzy-oldali teljesítési lehetetlenség esetén a Megrendelő teljes visszatérítést vagy későbbi szolgáltatási jóváírást választhat.</p>
          <p>15.7. A csomag más vállalkozásra nem ruházható át. Másik állásra csak akkor vihető át, ha a kampány még nem indult el, zárolt jelentkezőt nem nyitottak meg vagy töltöttek le, és a Szolgáltató az áthelyezést előzetesen jóváhagyja.</p>

          <h2 className="text-2xl font-bold text-slate-800">16. Lemondás, visszatérítés és jóváírás</h2>
          <p>16.1. A Megrendelő vállalkozásként jár el, ezért a fogyasztókat megillető indokolás nélküli 14 napos elállási vagy felmondási jog nem alkalmazandó.</p>
          <p>16.2. A Szolgáltató a Megrendelőnek szerződéses méltányossági lehetőségként a fizetéstől számított 24 órán belül teljes visszatérítést biztosíthat, ha együttesen teljesül, hogy:</p>
          <ul>
            <li>egyetlen zárolt jelentkezőt sem nyitottak meg és nem töltöttek le;</li>
            <li>a Szolgáltató nem kezdte meg a fizetős kampány szakmai vagy technikai előkészítését;</li>
            <li>a fizetős kampány nem indult el;</li>
            <li>a Megrendelő írásban, egyértelműen kéri a lemondást.</li>
          </ul>
          <p>16.3. Zárolt jelentkező megnyitása vagy letöltése után a meggondolásra alapított teljes visszatérítés nem jár.</p>
          <p>16.4. Teljes visszatérítés jár különösen téves vagy dupla terhelés, a Szolgáltató által véglegesen elutasított és nem javítható rendelés, a Szolgáltató oldalán fennálló tartós technikai teljesítési képtelenség, illetve olyan Workzy-oldali hiba esetén, amely miatt a szolgáltatás lényegi része nem teljesíthető.</p>
          <p>16.5. A Megrendelő jogsértő tartalma, együttműködésének hiánya, adat- vagy jóváhagyáshiánya, saját döntésű kampányleállítása, jelentkezői eredménnyel kapcsolatos elégedetlensége vagy külső piaci körülmény nem keletkeztet automatikus visszatérítési jogot.</p>
          <p>16.6. A Szolgáltató saját mérlegelése alapján részleges visszatérítést, kampányidő-hosszabbítást vagy szolgáltatási jóváírást adhat. A méltányossági döntés nem teremt kötelező gyakorlatot más megrendelésekre.</p>
          <p>16.7. A visszatérítés főszabály szerint az eredeti fizetési módon történik, a SimplePay és a pénzforgalmi szolgáltatók technikai határidejével.</p>
          <p>
            A fizetés, lemondás és visszatérítés részletes szabályait a{" "}
            <a href="/fizetes-lemondas-visszaterites">Fizetési, Lemondási és Visszatérítési Szabályzat</a> tartalmazza.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">17. Jelentkezői adatok és a Megrendelő adatkezelési kötelezettségei</h2>
          <p>17.1. A Jelentkező személyes adatai kizárólag akkor válnak a Megrendelő számára hozzáférhetővé, ha az adott jelentkezés a csomag és a hozzáférési szabályok alapján látható vagy jogszerűen feloldott.</p>
          <p>17.2. A Megrendelő a hozzáférhető jelentkezői adatokat főszabály szerint kizárólag ahhoz az álláshoz kapcsolódó kiválasztási célra használhatja, amelyre a Jelentkező jelentkezett. Másik állás, saját jelöltadatbázis, kapcsolt vállalkozás vagy harmadik fél részére történő felhasználás csak külön megfelelő jogalap, tájékoztatás és szükség esetén hozzájárulás mellett megengedett.</p>
          <p>17.3. A Megrendelő a saját kiválasztási tevékenysége tekintetében önálló adatkezelő. A Szolgáltató egyes, dokumentált utasításra végzett technikai műveletek tekintetében adatfeldolgozó lehet. A szerepkörök részletes elhatárolását az Adatkezelési Tájékoztató és az Adatfeldolgozási Melléklet tartalmazza.</p>
          <p>17.4. Külső HR-szolgáltató, csoportvállalat vagy más személy kizárólag akkor férhet hozzá a Jelentkező adataihoz, ha ténylegesen részt vesz a kiválasztásban, megfelelő jogalap és szerződéses keret áll fenn, és a Jelentkezőt a szükséges mértékben tájékoztatták. A Workzy fiókhoz csak névre szóló, meghívott Felhasználók kaphatnak hozzáférést.</p>
          <p>17.5. A látható vagy feloldott profil és önéletrajz a hozzáférési időn belül megnyitható, letölthető vagy a rendelkezésre álló funkcióval exportálható. A Szolgáltató naplózza a megnyitást, letöltést, exportot és jogosultságváltozást; érzékeny műveletnél újbóli hitelesítést kérhet.</p>
          <p>17.6. Zárolt jelentkező személyes vagy részleges azonosító adata nem exportálható és nem következtethető ki a felületből.</p>
          <p>17.7. Ha a Jelentkező visszavonja jelentkezését, a Workzy a további hozzáférést technikailag megszünteti, ahol ez lehetséges, és a Megrendelőt értesíti. A Szolgáltató a Megrendelő által korábban jogszerűen letöltött vagy saját rendszerbe átvitt adatot távolról nem tudja törölni; a Megrendelő köteles saját jogalapját és megőrzését felülvizsgálni.</p>
          <p>17.8. A Jelentkező által feltöltött dokumentum technikai ellenőrzése kiterjedhet fájltípusra, méretre, kártevőre, sérültségre és jelszavas védelemre. A Szolgáltató nem igazolja a dokumentum hitelességét, a képesítés vagy jogosultság fennállását; ennek ellenőrzése a Megrendelő feladata.</p>
          <p>17.9. A Workzy automatikusan kinyerhet vagy összefoglalhat tapasztalati, képesítési és jogosultsági adatokat az önéletrajzból. Az eredeti dokumentum marad az elsődleges forrás, az automatizált kivonat nem minősül hitelesített eredménynek, és nem használható kizárólagos döntési alapként.</p>
          <p>17.10. A Megrendelő köteles megakadályozni a jogosulatlan hozzáférést, a jelöltadatok tömeges vagy céltól eltérő letöltését, a diszkriminatív döntéshozatalt és a szükségtelen adatmegőrzést.</p>

          <h2 className="text-2xl font-bold text-slate-800">18. Szellemi tulajdon és referenciaként történő felhasználás</h2>
          <p>18.1. A Megrendelő kijelenti és szavatolja, hogy jogosult a Workzy számára átadott név, logó, kép, szöveg, védjegy, grafika és más tartalom használatára, és azok nem sértik harmadik személy jogát.</p>
          <p>18.2. A Megrendelő a szolgáltatás teljesítéséhez szükséges, területileg és időben megfelelő, nem kizárólagos felhasználási engedélyt ad a Szolgáltatónak az átadott tartalmak szerkesztésére, átméretezésére, online közzétételére és kampánycélú továbbítására.</p>
          <p>18.3. A Megrendelő a számára elkészített végleges álláshirdetési szöveget és kreatívot saját toborzási céljára széles körben, nem kizárólagosan használhatja, kivéve azokat az elemeket, amelyekhez harmadik fél licence eltérő feltételt ír elő.</p>
          <p>18.4. A Szolgáltatónál maradnak a sablonokhoz, szerkesztési rendszerhez, módszertanhoz, automatizmusokhoz, forrásfájlokhoz, szoftverhez, know-how-hoz és általánosan újrahasznosítható elemekhez fűződő jogok. Szerkeszthető forrásfájl csak külön megállapodással jár.</p>
          <p>18.5. A Szolgáltató a Megrendelő nevét, logóját, kampányát, teljesítményadatait vagy eredményét referenciaként kizárólag külön, előzetes és bizonyítható engedéllyel használhatja. Az ÁSZF elfogadása önmagában nem referenciaengedély. Az engedély visszavonása a jövőbeni felhasználást szünteti meg.</p>

          <h2 className="text-2xl font-bold text-slate-800">19. Ügyfélfiók, hozzáférések és biztonság</h2>
          <p>19.1. A Felhasználó köteles a bejelentkezési adatait bizalmasan kezelni, más személynek nem átadni, és jogosulatlan hozzáférés gyanúját haladéktalanul bejelenteni.</p>
          <p>19.2. A Szolgáltató szerepköralapú hozzáférést alkalmaz. Az adminisztrátori fiókoknál kétlépcsős azonosítás kötelező; más felhasználók számára a Szolgáltató kétlépcsős azonosítást biztosíthat és ajánlhat.</p>
          <p>19.3. A Megrendelő köteles a Felhasználók jogosultságait rendszeresen felülvizsgálni, és a munkaviszony, megbízás vagy feladat megszűnésekor azonnal visszavonni.</p>
          <p>19.4. A Szolgáltató a biztonság érdekében újbóli hitelesítést kérhet jelöltexport, számlázási adatmódosítás, jogosultságváltoztatás és más érzékeny művelet előtt.</p>
          <p>19.5. A Szolgáltató naplózhatja a bejelentkezéseket, biztonsági eseményeket, jogosultságmódosításokat, jelöltmegnyitásokat, letöltéseket és exportokat. A részletes megőrzési időket az Adatkezelési Tájékoztató tartalmazza.</p>
          <p>19.6. A Megrendelő nem kísérelheti meg a rendszer műszaki korlátozásainak megkerülését, zárolt adatok feltárását, automatizált tömeges lekérést, jogosulatlan hozzáférést, kód vagy biztonsági mechanizmus visszafejtését, illetve a szolgáltatás túlterhelését.</p>

          <h2 className="text-2xl font-bold text-slate-800">20. Külső szolgáltatók és technikai hibák</h2>
          <p>20.1. A Workzy működéséhez a Szolgáltató különösen tárhely-, adatbázis-, email-, fizetési, számlázási, analitikai és hirdetési szolgáltatókat vehet igénybe. A tervezett szolgáltatók között lehet a Vercel, Supabase, Hostinger, SimplePay, Billingo, Google, Meta és Rackhost; a pontos jogi személyeket az aktuális nyilvános szolgáltatói lista tartalmazza.</p>
          <p>20.2. A Szolgáltató a külső szolgáltatók adatvédelmi szerepét, adatfeldolgozási szerződéseit, al-adatfeldolgozóit és nemzetközi adattovábbításait az Adatkezelési Tájékoztatóban és az Adatfeldolgozási Mellékletben részletezi.</p>
          <p>20.3. A Jelentkező profilja, önéletrajza és szűrési válasza nem továbbítható a Billingo, SimplePay, analitikai vagy marketingrendszer részére, kivéve ha az adott szolgáltatás teljesítéséhez jogszerűen és feltétlenül szükséges, és erről az érintett megfelelő tájékoztatást kapott.</p>
          <p>20.4. A Meta, Google, SimplePay, Billingo vagy más külső szolgáltató saját rendszerhibája, felfüggesztése, szabályváltozása, késedelme vagy elérhetetlensége a Szolgáltató közvetlen ellenőrzési körén kívül eshet. A Szolgáltató ilyen esetben tájékoztat, ésszerűen mérsékli a következményeket, más csatornára válthat, a kampányt meghosszabbíthatja, vagy teljes ellehetetlenülés esetén arányos jóváírást vagy visszatérítést adhat.</p>
          <p>20.5. A Workzy tervezett karbantartása vagy rövid üzemszünete önmagában nem szerződésszegés, ha a Szolgáltató az elvárható gondossággal jár el és a lényeges kiesést lehetőség szerint előre jelzi.</p>

          <h2 className="text-2xl font-bold text-slate-800">21. Szavatosság, eredménygarancia és felelősség</h2>
          <p>21.1. A Szolgáltató a szolgáltatást szakmailag elvárható gondossággal nyújtja, de nem garantál meghatározott jelentkezőszámot, elérést, kattintást, interjút, megfelelő jelentkezőt, felvételt, munkaviszonyt, megtérülést vagy üzleti eredményt.</p>
          <p>21.2. A Jelentkező által megadott adatok, nyilatkozatok, önéletrajzok, képesítések és egyéb dokumentumok valóságtartalmáért elsődlegesen a Jelentkező felel. A Szolgáltató nem végez általános személyazonosság-, referencia-, képesítés-, erkölcsi vagy egészségügyi ellenőrzést.</p>
          <p>21.3. A Megrendelő felel a munkáltatói, munkajogi, egyenlő bánásmódi, adatvédelmi, adó-, bevándorlási, munkavédelmi és más foglalkoztatási kötelezettségek teljesítéséért, valamint a foglalkoztatási döntés jogszerűségéért.</p>
          <p>21.4. A Szolgáltató &ndash; a jogszabály által megengedett körben &ndash; kizárólag a bizonyított, közvetlen, előrelátható vagyoni kárért felel. Elmaradt haszon, üzleti lehetőség, termeléskiesés, jóhírnév-csökkenés, sikertelen felvétel, közvetett vagy következményi kár megtérítése kizárt.</p>
          <p>21.5. A Szolgáltató összesített felelőssége egy káresemény vagy összefüggő káresemények kapcsán legfeljebb az érintett megrendelésért ténylegesen megfizetett összegig terjed.</p>
          <p>21.6. A felelősségkizárás és -korlátozás nem alkalmazható olyan esetben, amelyben azt kötelező jogszabály tiltja, különösen szándékos szerződésszegés, illetve emberi élet, testi épség vagy egészség sérelme esetén.</p>
          <p>21.7. A Megrendelő köteles megtéríteni a Szolgáltatónak azt a bizonyított kárt és indokolt költséget, amely a Megrendelő valótlan adata, jogsértő tartalma, jogosulatlan logó- vagy képhasználata, diszkriminatív követelménye, jelöltadat-visszaélése vagy más szerződésszegése miatt merül fel, feltéve hogy a Szolgáltató a kármegelőzési és kárenyhítési kötelezettségének eleget tett.</p>

          <h2 className="text-2xl font-bold text-slate-800">22. Vis maior</h2>
          <p>22.1. Egyik Fél sem felel olyan, az ellenőrzési körén kívül eső, a szerződéskötéskor észszerűen előre nem látható és el nem hárítható esemény okozta késedelemért vagy teljesítési akadályért, mint különösen természeti katasztrófa, háború, hatósági korlátozás, országos infrastruktúra- vagy távközlési kiesés, széles körű kibertámadás vagy külső platform tartós működésképtelensége.</p>
          <p>22.2. Az érintett Fél a másik Felet indokolatlan késedelem nélkül tájékoztatja, és minden észszerű intézkedést megtesz a következmények csökkentésére. A határidők az akadály időtartamával meghosszabbodhatnak.</p>
          <p>22.3. Ha a vis maior a szolgáltatás lényegi teljesítését tartósan lehetetlenné teszi, a Felek elszámolnak a már teljesített szolgáltatással és a fel nem használt díj arányos részével.</p>

          <h2 className="text-2xl font-bold text-slate-800">23. Felfüggesztés, megszüntetés és fióktörlés</h2>
          <p>23.1. A Szolgáltató figyelmeztetés és észszerű javítási határidő után korlátozhatja vagy felfüggesztheti a fiókot valótlan adat, Próba-visszaélés, ismételt jogellenes hirdetés, jelöltadatokkal való visszaélés, fizetési visszaélés, technikai támadás vagy szerződésszegés esetén.</p>
          <p>23.2. Súlyos jogsértés, közvetlen adatvédelmi vagy biztonsági kockázat, csalásgyanú, hatósági megkeresés vagy Jelentkezők jogait közvetlenül veszélyeztető magatartás esetén a Szolgáltató előzetes figyelmeztetés nélkül azonnali felfüggesztést alkalmazhat.</p>
          <p>23.3. A Megrendelő súlyos szerződésszegése miatti felfüggesztés vagy megszüntetés nem keletkeztet automatikus visszatérítési jogot.</p>
          <p>23.4. A Megrendelő kérheti a fiók megszüntetését. A törlés előtt le kell zárni az aktív kampányokat, nyitott fizetési, számlázási, panasz- és jogvitás ügyeket, és lehetőséget kell biztosítani a szükséges adatok letöltésére, ha az jogszerű és technikailag elérhető.</p>
          <p>23.5. A fiók megszüntetése nem eredményezi azon adatok törlését, amelyeket a Szolgáltató jogszabály, szerződéses bizonyítás, panasz, visszaélés-megelőzés, biztonság vagy jogi igény miatt köteles vagy jogosult megőrizni. A felhasználói hozzáférés ettől függetlenül megszüntethető.</p>
          <p>23.6. A működéshez már nem szükséges profil- és beállításadatokat a Szolgáltató a fiók lezárását követő 90 napon belül törli vagy anonimizálja, a külön adatkezelési tájékoztatóban részletezett kivételekkel.</p>

          <h2 className="text-2xl font-bold text-slate-800">24. Értesítések, ügyfélszolgálat és panaszkezelés</h2>
          <p>24.1. A Felek hivatalos elektronikus kapcsolattartási csatornája a regisztrált email-cím és a Portál. Lényeges értesítésnél a Szolgáltató lehetőség szerint mindkét csatornát használja.</p>
          <p>24.2. A Megrendelő köteles a regisztrált email-címet naprakészen tartani és a Portál értesítéseit ellenőrizni. A visszapattant email önmagában nem tekinthető automatikusan kézbesítettnek; a Szolgáltató ismételt vagy más jogszerű csatornán történő értesítést alkalmazhat.</p>
          <p>24.3. A Szolgáltató általános ügyfélszolgálati válaszcélja két munkanap, fizetési vagy hozzáférési hiba esetén lehetőség szerint egy munkanap. Ezek belső célidők, nem garantált szolgáltatási szintek.</p>
          <p>24.4. Írásbeli panasz benyújtható:</p>
          <ul>
            <li>emailben az info@workzy.hu címen;</li>
            <li>postai úton a 2484 Gárdony, Géza utca 28. címre;</li>
            <li>a Portál panaszbejelentő űrlapján.</li>
          </ul>
          <p>24.5. Telefonon segítség kérhető a +36 70 432 7579 számon, de hivatalos panaszt írásban kell benyújtani.</p>
          <p>24.6. A panasz lehetőség szerint tartalmazza a Megrendelő nevét és adószámát, a kapcsolattartó nevét és email-címét, a rendelési vagy kampányazonosítót, a panasz részletes leírását, a kért megoldást és a szükséges mellékleteket.</p>
          <p>24.7. A Szolgáltató a hivatalos írásbeli panaszt legfeljebb 30 napon belül megválaszolja; belső célja öt munkanap. A panasz és a válasz bizonyításához szükséges adatokat főszabály szerint az ügy lezárásától számított öt évig őrzi, illetve tovább, ha jogszabály vagy jogvita indokolja.</p>
          <p>
            A panaszkezelés részletes szabályait a <a href="/panaszkezeles">Panaszkezelési Tájékoztató</a> tartalmazza.
          </p>

          <h2 className="text-2xl font-bold text-slate-800">25. Az ÁSZF módosítása és verziókezelés</h2>
          <p>25.1. A Megrendelésre a visszaigazoláskor hatályos ÁSZF-verzió alkalmazandó. A későbbi módosítás a már visszaigazolt vagy kifizetett megrendelés feltételeit a Megrendelő hátrányára nem ronthatja.</p>
          <p>25.2. A Szolgáltató az ÁSZF-et jövőbeli megrendelésekre módosíthatja különösen jogszabályváltozás, új szolgáltatás, biztonsági követelmény, külső szolgáltató változása vagy üzleti folyamat módosítása miatt.</p>
          <p>25.3. Lényeges, nem sürgős változásról a Szolgáltató a regisztrált ügyfeleket főszabály szerint legalább 15 nappal korábban értesíti. Sürgős jogi, biztonsági vagy külső szolgáltatói változás azonnal hatályba léphet megfelelő tájékoztatással.</p>
          <p>25.4. A Szolgáltató a mindenkor hatályos és korábbi ÁSZF-verziókat verziószámmal, közzétételi és hatálybalépési dátummal archiválja.</p>
          <p>25.5. Az árak és csomagtartalmak jövőre nézve módosíthatók. A már visszaigazolt megrendelés ára és lényegi tartalma egyoldalúan nem módosítható a Megrendelő hátrányára.</p>

          <h2 className="text-2xl font-bold text-slate-800">26. Irányadó jog és jogviták</h2>
          <p>26.1. A jelen ÁSZF-re és a Felek jogviszonyára a magyar jog alkalmazandó, különösen a Polgári Törvénykönyv és az elektronikus kereskedelmi szolgáltatásokra vonatkozó szabályok.</p>
          <p>26.2. A Felek jogvita esetén először legalább 15 napos írásbeli egyeztetést folytatnak a békés rendezés érdekében.</p>
          <p>26.3. Ha az egyeztetés nem vezet eredményre, a jogvita eldöntésére a hatáskörrel és illetékességgel rendelkező magyar bíróság jogosult.</p>
          <p>26.4. Fogyasztói békéltető testületi és fogyasztóvédelmi rendelkezések a jelen B2B ÁSZF alapján nem alkalmazandók, mert fizetős szolgáltatást kizárólag nem fogyasztó Megrendelő vásárolhat.</p>

          <h2 className="text-2xl font-bold text-slate-800">27. Záró rendelkezések</h2>
          <p>27.1. Ha a jelen ÁSZF valamely rendelkezése érvénytelen vagy végrehajthatatlan, az nem érinti a többi rendelkezés érvényességét. A Felek az érintett rendelkezést olyan jogszerű szabállyal helyettesítik, amely annak gazdasági céljához a legközelebb áll.</p>
          <p>27.2. A Szolgáltató valamely jogának egyszeri vagy késedelmes gyakorlása nem jelenti a jogról való lemondást.</p>
          <p>27.3. A címek és alcímek a könnyebb áttekintést szolgálják, és önmagukban nem módosítják a rendelkezések tartalmát.</p>

          <h2 className="text-2xl font-bold text-slate-800">1. melléklet &ndash; Tiltott és korlátozott hirdetési tartalmak</h2>
          <p>A lista nem teljes. A Szolgáltató minden esetben jogosult az egyedi jogi, adatvédelmi, biztonsági és reputációs kockázat alapján további tartalom ellenőrzésére vagy korlátozására.</p>
          <ul>
            <li>valótlan, nem létező vagy megtévesztő állás és munkáltató;</li>
            <li>jogellenes hátrányos megkülönböztetés vagy védett tulajdonságra épülő kizárás;</li>
            <li>jelentkezési, regisztrációs, közvetítési vagy munkába állási díj kérése a Jelentkezőtől;</li>
            <li>jogosulatlan cégnév-, logó-, fénykép-, védjegy- vagy szöveghasználat;</li>
            <li>azonosíthatatlan vagy teljesen anonim munkáltató;</li>
            <li>egészségügyi, várandóssági, családtervezési, vallási, politikai, etnikai, szexuális irányultsági vagy szakszervezeti adat kérése;</li>
            <li>erkölcsi bizonyítvány, személyazonosító okmány, lakcímkártya, adókártya, társadalombiztosítási kártya, bankszámladokumentum vagy egészségügyi dokumentum feltöltésének kérése;</li>
            <li>jogellenes munkafeltétel, megtévesztő bér- vagy juttatásközlés;</li>
            <li>veszélyes, erőszakos, zaklató, gyűlöletkeltő vagy jóerkölcsbe ütköző tartalom;</li>
            <li>spam, rosszindulatú kód, adathalász vagy technikai visszaélést szolgáló tartalom;</li>
            <li>jogszabályban tiltott termékhez, szolgáltatáshoz vagy tevékenységhez kapcsolódó állás;</li>
            <li>18 év alatti személy önálló jelentkezését célzó vagy arra épülő folyamat.</li>
          </ul>

          <p>
            Kapcsolódó dokumentumok:{" "}
            <a href="/adatkezelesi-tajekoztato">Adatkezelési Tájékoztató</a>,{" "}
            <a href="/adatfeldolgozasi-melleklet">Adatfeldolgozási Melléklet</a>,{" "}
            <a href="/fizetes-lemondas-visszaterites">Fizetési, Lemondási és Visszatérítési Szabályzat</a>,{" "}
            <a href="/panaszkezeles">Panaszkezelési Tájékoztató</a>,{" "}
            <a href="/simplepay-tajekoztato">SimplePay fizetési tájékoztató</a>. A teljes jogi dokumentumlista a{" "}
            <a href="/jogi">Jogi Dokumentumközpontban</a> érhető el.
          </p>
        </div>
      </div>
    </main>
  );
}
