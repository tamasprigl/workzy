import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <>
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white mt-4">Vezérlőpult</h1>
        <p className="text-gray-400 mt-2 text-lg">Üdvözöljük a Workzy adminisztrációs felületén.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all text-blue-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Összes Jelentkező</p>
          <p className="text-4xl font-semibold text-white">1,248</p>
          <div className="mt-4 text-xs text-green-400 flex items-center gap-1 font-medium bg-green-400/10 w-fit px-2 py-1 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
            +12% a héten
          </div>
        </div>

        <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13v-6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6"/><path d="M2 13 4 20h16l2-7"/></svg>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Aktív Állások</p>
          <p className="text-4xl font-semibold text-white">24</p>
          <div className="mt-4 text-xs text-gray-500 flex items-center gap-1 font-medium bg-gray-800/50 w-fit px-2 py-1 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>
            Változatlan
          </div>
        </div>

        <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Havi Bevétel</p>
          <p className="text-4xl font-semibold text-white">2.4M Ft</p>
          <div className="mt-4 text-xs text-green-400 flex items-center gap-1 font-medium bg-green-400/10 w-fit px-2 py-1 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
            +18% az előző hónaphoz
          </div>
        </div>

        <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 p-6 rounded-2xl relative overflow-hidden group hover:border-pink-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all text-pink-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Sikeres Közvetítés</p>
          <p className="text-4xl font-semibold text-white">156</p>
          <div className="mt-4 text-xs text-green-400 flex items-center gap-1 font-medium bg-green-400/10 w-fit px-2 py-1 rounded-md">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
            +5 ezen a héten
          </div>
        </div>
      </div>

      {/* Quick Actions / Recent Activity */}
      <h2 className="text-2xl font-semibold mt-12 mb-6 text-white tracking-tight">Gyorselérés & Újdonságok</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Add new job banner */}
         <Link href="/admin/jobs/new">
           <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-800/50 rounded-2xl p-8 hover:brightness-110 transition-all h-full flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 opacity-30 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Új állás meghirdetése</h3>
              <p className="text-blue-200/80 mb-6 max-w-sm relative z-10">Töltsd ki az űrlapot és indítsd el a kampányt másodpercek alatt az AI asszisztens segítségével.</p>
              
              <div className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-lg w-fit flex items-center gap-2 relative z-10 transition-colors">
                 <span>Állás rögzítése</span>
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </div>
           </div>
         </Link>

         {/* Activity Feed Placeholder */}
         <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 rounded-2xl p-6 relative">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              Légutóbbi Jelentkezések
            </h3>
            
            <div className="space-y-4">
              {[
                { name: "Kovács Péter", job: "Teherautó szerelő", time: "2 órája", status: "Új" },
                { name: "Nagy Anna", job: "Gépkezelő", time: "5 órája", status: "Új" },
                { name: "Szabó Tamás", job: "Raktáros", time: "1 napja", status: "Feldolgozás alatt" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-900/50 transition-colors border border-transparent hover:border-gray-800">
                  <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center font-semibold text-sm">
                      {item.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                       <p className="font-medium text-gray-200">{item.name}</p>
                       <p className="text-xs text-gray-500">{item.job} • {item.time}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${item.status === 'Új' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-800 text-gray-400'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/admin/jobs" className="block text-center text-sm mt-6 text-gray-400 hover:text-white transition-colors">
              Minden jelentkezés megtekintése &rarr;
            </Link>
         </div>
      </div>
    </>
  );
}
