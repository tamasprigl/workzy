import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAuthToken, getCurrentUser } from "@/lib/auth";
import Airtable from "airtable";
import JobRow from "@/components/admin/JobRow";
import EmployerAccessRow from "@/components/admin/EmployerAccessRow";

export const dynamic = "force-dynamic";

async function getData() {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN })
    .base(process.env.AIRTABLE_BASE_ID!);

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

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) redirect("/admin/login");

  const authUser = await verifyAuthToken(token);
  if (!authUser?.email) redirect("/admin/login");

  const user = await getCurrentUser(authUser.email);
  
  console.log("AUTH USER:", authUser);
  console.log("AIRTABLE USER:", user);
  console.log("ROLE:", user?.role);

  if (!user || user.role?.trim() !== "Superadmin") {
    redirect("/admin");
  }

  const { jobs, employers, companies } = await getData();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Superadmin</h1>
        <form action="/api/admin/check-free-campaigns" method="post">
          <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-slate-800 transition-colors">
            Check Free Campaign Stops
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[1200px]">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
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

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-slate-800">Employer hozzáférések</h2>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="p-4 w-1/6">Employer</th>
                <th className="p-4 w-1/6">Email</th>
                <th className="p-4 w-1/6">Plan</th>
                <th className="p-4 w-1/6">Applicant Limit</th>
                <th className="p-4 w-1/6">Access Status</th>
                <th className="p-4 w-1/6">State</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {employers.map((employer) => (
                <EmployerAccessRow key={employer.id} employer={employer} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
