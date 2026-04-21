import { getActiveJobs } from "@/lib/airtable";
import JobsClient from "./JobsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function JobsPage() {
  const jobs = await getActiveJobs();

  const jobsList = jobs.map((job) => ({
    slug: job.slug,
    title: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary,
    shortDescription: job.shortDescription,
    benefits: [],
    generatedImageUrl: job.generatedImageUrl,
  }));

  return <JobsClient jobsList={jobsList} />;
}