# Workzy Admin Interface Implementation

## Goal
Hozzáadjuk a Workzy adminisztrációs felületének első verzióját, mely egy prémium, sötét, SaaS stílusú megközelítést alkalmaz. A felület magyar nyelvű lesz, beépített oldalsávval, és kizárólag mock (statikus) adatokat használ külső csomagok bevonása nélkül. Különálló layout-ként valósítjuk meg, ami azt jelenti, hogy a publikus oldalak teljesen érintetlenek maradnak.

## User Review Required

> [!IMPORTANT]
> A nyilvános oldalakat (melyeknek a kódját legutóbb vizsgáltuk) **egyáltalán nem** érintjük ezzel a módosítással, minden változtatás az `app/admin` mappán belül fog történni.
> Az ikonokhoz beágyazott (inline) SVG kódokat fogok használni, hogy maximálisan betartsam a "ne használj külső csomagot, ha nem muszáj" kérést (tehát nem telepítem a `lucide-react` csomagot sem). Erősítse meg, hogy ez az irány megfelel-e, vagy ragaszkodik valamilyen ikonkönyvtárhoz.

## Proposed Changes

Minden változtatás az `app/admin` névtér alatt jön létre.

### Admin Dashboard Foundation

#### [NEW] [app/admin/layout.tsx](file:///c:/Users/user/workzy/app/admin/layout.tsx)
Az adminisztrációs terület saját layout fájlja, amely tartalmazni fog egy reszponzív, fix oldalsávot (sidebar) a navigációhoz, és egy fő tartalmi területet. Ez biztosítja az egyedi "premium dark" SaaS kinézetet az admin minden aloldalán (üveg hatás, diszkrét árnyékok, mélyszürke és fekete színek).

#### [NEW] [app/admin/page.tsx](file:///c:/Users/user/workzy/app/admin/page.tsx)
A `/admin` útvonal főoldala. Egy letisztult műszerfal (dashboard) áttekintő információkhoz. Jelenleg pár statikus mutatót és üdvözlő kártyát fog tartalmazni.

### Admin Jobs Management

#### [NEW] [app/admin/jobs/page.tsx](file:///c:/Users/user/workzy/app/admin/jobs/page.tsx)
A `/admin/jobs` útvonal. Kilistázza a meglévő munkákat egy ízléses "premium SaaS" táblázatos vagy kártyás formában, felhasználva az `app/jobs/data.ts` ből származó adatokat, plusz mock adatokat (pl. jelentkezők száma). Rendelkezni fog egy "Új állás" gombbal.

#### [NEW] [app/admin/jobs/new/page.tsx](file:///c:/Users/user/workzy/app/admin/jobs/new/page.tsx)
A `/admin/jobs/new` útvonal, amely az űrlap betöltéséért felelős.

#### [NEW] [app/admin/jobs/new/NewJobForm.tsx](file:///c:/Users/user/workzy/app/admin/jobs/new/NewJobForm.tsx)
Egy `"use client"` direktívával ellátott komponens a form kezelésére. Bár adatbázis nincs, megvalósítunk benne egy hitelesnek tűnő betöltés/mentés interakciót (sikeres feedback megjelenítésével megcsinálva a submit interakciót).

## Open Questions

> [!WARNING]
> Mivel az `app/jobs/data.ts` fájlaban vannak a MOCK állások tárolva, és ezek `const`ként exportálódnak, az új állások hozzáadása valódi mentés (adatbázis) nélkül nem lesz globálisan perzisztens a szerver újraindulásai vagy a Next.js App Router navigációs ciklusai között. Az admin felületen mutatjuk be a sikeres beküldést, de ténylegesen nem folyamatosan módosítjuk a `data.ts` fájlt futásidőben. Jó lesz ez a megközelítés első lépésnek? Ezeket az adatokat később adatbázisba lehet migrálva menteni.

## Verification Plan

### Manual Verification
- A felhasználó képes lesz elnavigálni az `/admin`, `/admin/jobs` és `/admin/jobs/new` oldalakra a böngészőjében.
- Sikeresen beküldhet egy fiktív új állást és láthatja, hogy az UI (Premium Dark) megfelel elvárásainak.
