import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="mb-6 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-600">
          <Link href="/aszf" className="transition hover:text-sky-600 hover:underline">
            ÁSZF
          </Link>
          <Link href="/adatkezelesi-tajekoztato" className="transition hover:text-sky-600 hover:underline">
            Adatkezelés
          </Link>
          <Link href="/cookie-tajekoztato" className="transition hover:text-sky-600 hover:underline">
            Cookie-k
          </Link>
          <Link href="/fizetes-lemondas-visszaterites" className="transition hover:text-sky-600 hover:underline">
            Fizetés és visszatérítés
          </Link>
          <Link href="/panaszkezeles" className="transition hover:text-sky-600 hover:underline">
            Panaszkezelés
          </Link>
          <Link href="/jogi" className="transition hover:text-sky-600 hover:underline">
            Jogi dokumentumközpont
          </Link>
          <Link href="/impresszum" className="transition hover:text-sky-600 hover:underline">
            Cégadatok
          </Link>
        </div>
        <p className="text-sm text-slate-400">
          &copy; {new Date().getFullYear()} Workzy &ndash; Prigl Tamás egyéni vállalkozó. Minden jog fenntartva.
        </p>
      </div>
    </footer>
  );
}
