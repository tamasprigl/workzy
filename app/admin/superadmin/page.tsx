import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifyAuthToken, getCurrentUser } from "@/lib/auth";
import Airtable from "airtable";
import JobRow from "@/components/admin/JobRow";
import EmployerAccessRow from "@/components/admin/EmployerAccessRow";

export const dynamic = "force-dynamic";

type AirtableItem = {
  id: string;
  fields: Record<string, any>;
};

function getBase() {
  return new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(
    process.env.AIRTABLE_BASE_ID!
  );
}

async function getData() {
  const base = getBase();

  const [jobs, employers, companies] = await Promise.all([
    base(process.env.AIRTABLE_JOBS_TABLE_NAME!).select().all(),
    base(process.env.AIRTABLE_EMPLOYERS_TABLE_NAME!).select().all(),
    base(process.env.AIRTABLE_COMPANIES_TABLE_NAME!).select().all(),
  ]);

  return {
    jobs: jobs.map((j) => ({ id: j.id, fields: j.fields })),
    employers: employers.map((e) => ({ id: e.id, fields: e.fields })),
    companies: companies.map((c) => ({ id: c.id, fields: c.fields })),
  };
}

async function createEmployerUser(formData: FormData) {
  "use server";

  const base = getBase();

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const name = String(formData.get("name") || "").trim();
  const companyId = String(formData.get("companyId") || "").trim();
  const newCompanyName = String(formData.get("newCompanyName") || "").trim();
  const plan = String(formData.get("plan") || "Paid").trim();

  if (!email) {
    throw new Error("Email megadása kötelező.");
  }

  let finalCompanyId = companyId;

  if (!finalCompanyId && newCompanyName) {
    const company = await base(process.env.AIRTABLE_COMPANIES_TABLE_NAME!).create({
      Name: newCompanyName,
    });

    finalCompanyId = company.id;
  }

  const employerFields: Record<string, any> = {
    Email: email,
    Role: "Employer",
    Status: "active",
    Plan: plan,
    "Access Status": "active",
  };

  if (name) employerFields.Name = name;
  if (finalCompanyId) employerFields.Company = [finalCompanyId];

  await base(process.env.AIRTABLE_EMPLOYERS_TABLE_NAME!).create(employerFields);

  revalidatePath("/admin/super");
}

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) redirect("/admin/login");

  const authUser = await verifyAuthToken(token);
  if (!authUser?.email) redirect("/admin/login");

  const user = await getCurrentUser(authUser.email);

  if (!user || user.role?.trim() !== "Superadmin") {
    redirect("/admin");
  }

  const { jobs, employers, companies } = await getData();

  const activeJobs = jobs.filter((job) => {
    const status = String(job.fields.Status || "").toLowerCase();
    return ["active", "aktív", "aktiv"].includes(status);
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e0f2fe_0,#f8fafc_34%,#ffffff_72%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 overflow-hidden rounded-[32px] border border-white/80 bg-white/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-black uppercase tracking-[0.24em] text-sky-700">
                Workzy Superadmin
              </div>

              <h1 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Ügyfelek, állások és kampányhozzáférések egy helyen.
              </h1>

              <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600">
                Itt tudsz ügyfél usert létrehozni, céget rendelni hozzá, majd az
                állásokat és kampányjogosultságokat kezelni.
              </p>
            </div>

            <form action="/api/admin/check-free-campaigns" method="post">
              <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-[0_16px_40px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 hover:bg-slate-800">
                Check Free Campaign Stops
              </button>
            </form>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Összes állás
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {jobs.length}
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
                Aktív állás
              </p>
              <p className="mt-2 text-3xl font-black text-emerald-700">
                {activeJobs.length}
              </p>
            </div>

            <div className="rounded-3xl border border-violet-200 bg-violet-50/80 p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
                Ügyfél user
              </p>
              <p className="mt-2 text-3xl font-black text-violet-700">
                {employers.length}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-[30px] border border-white/80 bg-white/80 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-600">
              Új ügyfél hozzáférés
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              Employer user létrehozása
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Ezzel létrejön az ügyfél felhasználó az Employers táblában. Utána
              az állásokat hozzá tudod rendelni ehhez az ügyfélhez.
            </p>
          </div>

          <form action={createEmployerUser} className="grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-1">
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Név
              </label>
              <input
                name="name"
                placeholder="pl. Kovács Péter"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div className="lg:col-span-1">
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Email
              </label>
              <input
                required
                type="email"
                name="email"
                placeholder="ugyfel@ceg.hu"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div className="lg:col-span-1">
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Meglévő cég
              </label>
              <select
                name="companyId"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              >
                <option value="">Nincs kiválasztva</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {String(company.fields.Name || "Névtelen cég")}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-1">
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Új cég
              </label>
              <input
                name="newCompanyName"
                placeholder="ha nincs még cég"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div className="lg:col-span-1">
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Plan
              </label>
              <select
                name="plan"
                defaultValue="Paid"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              >
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
                <option value="Pro">Pro</option>
              </select>
            </div>

            <div className="lg:col-span-5">
              <button className="mt-2 rounded-2xl bg-gradient-to-r from-slate-950 via-sky-950 to-violet-950 px-6 py-3 text-sm font-black text-white shadow-[0_18px_45px_rgba(14,165,233,0.22)] transition hover:-translate-y-0.5">
                Ügyfél user létrehozása
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-[30px] border border-white/80 bg-white/80 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-600">
                Állások kezelése
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                Állások, tulajdonosok és kampányok
              </h2>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="p-4 whitespace-nowrap">Job</th>
                    <th className="p-4 whitespace-nowrap">Owner</th>
                    <th className="p-4 whitespace-nowrap">Company</th>
                    <th className="p-4 whitespace-nowrap">Campaign</th>
                    <th className="p-4 whitespace-nowrap">Payment</th>
                    <th className="p-4 whitespace-nowrap">Unlock</th>
                    <th className="p-4 whitespace-nowrap">Category</th>
                    <th className="p-4 whitespace-nowrap">Q-Score</th>
                    <th className="p-4 whitespace-nowrap">Q-Status</th>
                    <th className="p-4 whitespace-nowrap">Free Elig.</th>
                    <th className="p-4 whitespace-nowrap">Free Camp.</th>
                    <th className="p-4 whitespace-nowrap">Ad Spend</th>
                    <th className="p-4 whitespace-nowrap">Max Spend</th>
                    <th className="p-4 whitespace-nowrap">Status</th>
                    <th className="p-4 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <JobRow
                      key={job.id}
                      job={job}
                      employers={employers}
                      companies={companies}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[30px] border border-white/80 bg-white/80 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-600">
              Hozzáférések
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              Employer hozzáférések
            </h2>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="p-4">Employer</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Plan</th>
                    <th className="p-4">Applicant Limit</th>
                    <th className="p-4">Access Status</th>
                    <th className="p-4">State</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {employers.map((employer) => (
                    <EmployerAccessRow key={employer.id} employer={employer} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}