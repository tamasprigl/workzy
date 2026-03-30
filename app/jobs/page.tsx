const jobs = [
  {
    title: "Raktáros",
    location: "Székesfehérvár",
  },
  {
    title: "Teherautó szerelő",
    location: "Hajós",
  },
  {
    title: "Gépkezelő",
    location: "Győr",
  },
];

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Állásajánlatok
      </h1>

      <div className="max-w-3xl mx-auto space-y-4">
        {jobs.map((job, index) => (
          <div
            key={index}
            className="bg-gray-900 p-6 rounded-xl flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-400">{job.location}</p>
            </div>

            <button className="bg-white text-black px-4 py-2 rounded-lg">
              Megnézem
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}