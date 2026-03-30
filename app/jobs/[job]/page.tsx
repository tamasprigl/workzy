const jobs = [
  {
    slug: "raktaros",
    title: "Raktáros",
    location: "Székesfehérvár",
    description: "Raktári feladatok ellátása, áruk kezelése.",
  },
  {
    slug: "szerelo",
    title: "Teherautó szerelő",
    location: "Hajós",
    description: "Teherautók javítása és karbantartása.",
  },
  {
    slug: "gepkezelo",
    title: "Gépkezelő",
    location: "Győr",
    description: "Gyártósori gépek kezelése.",
  },
];

export default async function JobDetail({
  params,
}: {
  params: Promise<{ job: string }>;
}) {
  const { job: jobSlug } = await params;

  const job = jobs.find((j) => j.slug === jobSlug);

  if (!job) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1>Nincs ilyen állás</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{job.title}</h1>
      <p className="text-gray-400 mb-6">{job.location}</p>

      <p className="mb-10">{job.description}</p>

      <button className="bg-white text-black px-6 py-3 rounded-xl">
        Jelentkezem
      </button>
    </div>
  );
}