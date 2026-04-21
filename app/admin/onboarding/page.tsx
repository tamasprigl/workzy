import { submitOnboarding, checkOnboardingStatus } from "@/lib/onboarding";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const status = await checkOnboardingStatus();
  if (status.isComplete) {
    redirect("/admin");
  }
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xl mx-auto py-12 px-6 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-100">
        <h1 className="text-3xl font-black mb-2 text-slate-900 tracking-tight">Cégprofil beállítása</h1>
        <p className="text-slate-500 mb-8 font-medium">Kérjük, adja meg cége adatait a kezdéshez. Ezt később módosíthatja.</p>
        
        <form action={submitOnboarding} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Cégnév <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="pl. TechStart Kft."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Weboldal <span className="font-normal text-slate-400">(opcionális)</span></label>
            <input 
              type="url" 
              name="website" 
              placeholder="https://pelda.hu"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Rövid leírás <span className="font-normal text-slate-400">(opcionális)</span></label>
            <textarea 
              name="description" 
              rows={4}
              placeholder="Pár mondat a cégről, amit a jelentkezők látni fognak..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 resize-none"
            ></textarea>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full rounded-xl bg-sky-600 px-6 py-3.5 text-white font-semibold shadow-[0_10px_30px_rgba(14,165,233,0.3)] transition hover:bg-sky-500 hover:shadow-[0_10px_40px_rgba(14,165,233,0.4)] active:scale-[0.98]"
            >
              Profil mentése és ugrás a vezérlőpultra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
