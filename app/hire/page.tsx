import Link from "next/link";
import Image from "next/image";
import PublicJobForm from "./PublicJobForm";

export const metadata = {
  title: "Állás feladása gyorsan | Workzy",
  description: "Add fel álláshirdetésedet másodpercek alatt a Workzy-n.",
};

export default function HirePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100/50 relative overflow-hidden flex flex-col">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-sky-200/40 blur-[140px]" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/30 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 pt-6 px-6 sm:px-8 max-w-6xl mx-auto w-full flex justify-between items-center">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/logo.png"
            alt="Workzy"
            width={120}
            height={36}
            className="h-auto w-auto"
            priority
          />
        </Link>
        <Link 
          href="/admin/login" 
          className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          Belépés
        </Link>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 py-8 px-4 sm:px-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Állásfeladás másodpercek alatt
            </h1>
            <p className="text-slate-600 text-lg sm:text-xl">
              Add meg a 3 alap adatot – a rendszer elindítja a toborzást.
            </p>
          </div>

          <PublicJobForm />
        </div>
      </div>
    </main>
  );
}
