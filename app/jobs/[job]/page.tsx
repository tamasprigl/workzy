import ApplyForm from "./ApplyForm";
import { jobs } from "../data";

export default async function JobDetail({
  params,
}: {
  params: Promise<{ job: string }>;
}) {
  const { job } = await params;

  const selectedJob = jobs[job as keyof typeof jobs];

  if (!selectedJob) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <h1>Nincs ilyen állás</h1>
        <p>Kapott slug: {job}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-sm text-gray-500 mb-4">Állás részletei</p>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {selectedJob.title}
        </h1>

        <p className="text-lg text-gray-400 mb-10">{selectedJob.location}</p>

        <div className="bg-gray-900 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Leírás</h2>
          <p className="text-gray-300 leading-7">{selectedJob.description}</p>
        </div>

        <ApplyForm jobSlug={job} jobTitle={selectedJob.title} />
      </section>
    </main>
  );
}