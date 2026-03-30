import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gray-950 border-r border-gray-800 hidden md:block relative z-10 isolate h-screen sticky top-0">
        <div className="p-6">
          <Link href="/admin">
            <span className="text-2xl font-bold tracking-tighter text-white">Workzy <span className="text-blue-500">Admin</span></span>
          </Link>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800/50 text-gray-300 hover:text-white transition-all group">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 group-hover:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Vezérlőpult
          </Link>
          
          <Link href="/admin/jobs" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800/50 text-gray-300 hover:text-white transition-all group">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 group-hover:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13v-6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6"/><path d="M2 13 4 20h16l2-7"/></svg>
            Állások
          </Link>

          <Link href="/admin/jobs/new" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800/50 text-gray-300 hover:text-white transition-all group">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 group-hover:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Új Állás
          </Link>

          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800/50 text-gray-300 hover:text-white transition-all group mt-8 border border-gray-800/60">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Vissza az oldalra
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-black relative isolate min-h-screen">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-900/10 to-transparent -z-10 pointer-events-none" />
        
        <div className="p-8 lg:p-12 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
