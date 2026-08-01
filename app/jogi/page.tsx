import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const documents = [
  {
    href: "/aszf",
    title: "Általános Szerződési Feltételek",
    description: "A Workzy szolgáltatásainak, csomagjainak, próbaidőszakának és ügyfélfiókjának szerződéses feltételei.",
  },
  {
    href: "/adatkezelesi-tajekoztato",
    title: "Adatkezelési Tájékoztató",
    description: "Tájékoztatás a Workzy ügyfél-, jelentkezői, marketing-, fizetési és technikai adatkezeléseiről.",
  },
  {
    href: "/adatfeldolgozasi-melleklet",
    title: "Adatfeldolgozási Melléklet",
    description: "A Workzy és a munkáltatói ügyfél adatfeldolgozási együttműködésének szabályai.",
  },
  {
    href: "/fizetes-lemondas-visszaterites",
    title: "Fizetés, lemondás és visszatérítés",
    description: "A SimplePay fizetés, a számlázás, a lemondás, a sikertelen vagy dupla fizetés és a visszatérítés szabályai.",
  },
  {
    href: "/panaszkezeles",
    title: "Panaszkezelés",
    description: "A panasz benyújtásának módja, a vizsgálat menete és a válaszadási határidők.",
  },
  {
    href: "/cookie-tajekoztato",
    title: "Cookie-tájékoztató",
    description: "A szükséges, analitikai és marketingtechnológiák, valamint a hozzájárulás módosításának szabályai.",
  },
  {
    href: "/simplepay-tajekoztato",
    title: "SimplePay fizetési tájékoztató",
    description: "A fizetési szolgáltatóra és az adattovábbításra vonatkozó tájékoztatás.",
  },
  {
    href: "/impresszum",
    title: "Cégadatok és kapcsolat",
    description: "A Workzyt üzemeltető szolgáltató hivatalos azonosító és kapcsolattartási adatai.",
  },
];

export default function JogiDokumentumkozpontPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm sm:p-16">
        <div className="prose prose-slate max-w-none">
          <h1 className="mb-2 text-4xl font-extrabold text-slate-900">Jogi Dokumentumközpont</h1>
          <p className="text-slate-500">Közzétéve: 2026. augusztus 1.</p>

          <p>
            Itt találja a Workzy működésére, a szolgáltatás igénybevételére, a fizetésre, az adatkezelésre, a cookie-kra és a
            panaszkezelésre vonatkozó aktuális dokumentumokat.
          </p>
          <p>
            A Workzy szolgáltatásait kizárólag vállalkozások és más szervezetek vehetik igénybe. A fizetős szolgáltatások nem fogyasztói
            szerződések és nem előfizetések.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {documents.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="group flex flex-col rounded-2xl border border-slate-200 p-6 transition hover:border-sky-300 hover:bg-sky-50/50"
            >
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-sky-700">{doc.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{doc.description}</p>
              <span className="mt-4 text-sm font-semibold text-sky-600">Megnyitás &rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
