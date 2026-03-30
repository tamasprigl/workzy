import Link from "next/link";
import { jobs } from "./data";

export default function JobsPage() {
  const jobsList = Object.entries(jobs).map(([slug, job]) => ({
    slug,
    ...job,
  }));

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <h1 className="text-4xl font-bold mb-10 text-center">Állásajánlatok</h1>

      <div className="max-w-3xl mx-auto space-y-4">
        {jobsList.map((job) => (
          <div
            key={job.slug}
            className="bg-gray-900 p-6 rounded-xl flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-400">{job.location}</p>
            </div>

            <Link href={`/jobs/${job.slug}`}>
              <span className="bg-white text-black px-4 py-2 rounded-lg inline-block">
                Megnézem
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}