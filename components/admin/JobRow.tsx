"use client";

import { useState } from "react";

export default function JobRow({ job, employers, companies }: any) {
  const [owner, setOwner] = useState(job.fields.Owner?.[0]);
  const [company, setCompany] = useState(job.fields["Company Record"]?.[0]);

  const [campaignStatus, setCampaignStatus] = useState(
    job.fields["Campaign Status"] || "Draft"
  );
  
  const [paymentStatus, setPaymentStatus] = useState(
    job.fields["Payment Status"] || "Unpaid"
  );
  
  const [manualUnlock, setManualUnlock] = useState(
    Boolean(job.fields["Manual Unlock"])
  );

  const [jobCategory, setJobCategory] = useState(
    job.fields["Job Category"] || "Other"
  );

  const [freeEligible, setFreeEligible] = useState(
    Boolean(job.fields["Free Eligible"])
  );

  const [freeCampaign, setFreeCampaign] = useState(
    Boolean(job.fields["Free Campaign"])
  );

  const [adSpend, setAdSpend] = useState(job.fields["Ad Spend"] || 0);
  const [maxFreeSpend, setMaxFreeSpend] = useState(
    job.fields["Max Free Spend"] || 7000
  );

  const isUnlocked =
    manualUnlock ||
    paymentStatus === "Paid" ||
    paymentStatus === "Manual" ||
    campaignStatus === "Active";

  const update = async (field: string, value: string | boolean) => {
    try {
      await fetch("/api/admin/update-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: job.id,
          field,
          value,
        }),
      });
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="p-4 font-medium text-slate-800">{job.fields.Title}</td>

      <td className="p-4">
        <select
          className="w-full bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={owner || ""}
          onChange={(e) => {
            setOwner(e.target.value);
            update("Owner", e.target.value);
          }}
        >
          <option value="">Select Owner</option>
          {employers.map((e: any) => (
            <option key={e.id} value={e.id}>
              {e.fields.Name || e.fields.Email || "Unknown Employer"}
            </option>
          ))}
        </select>
      </td>

      <td className="p-4">
        <select
          className="w-full bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={company || ""}
          onChange={(e) => {
            setCompany(e.target.value);
            update("Company Record", e.target.value);
          }}
        >
          <option value="">Select Company</option>
          {companies.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.fields.Name || c.fields.Company || "Unknown Company"}
            </option>
          ))}
        </select>
      </td>

      <td className="p-4">
        <select
          className="w-full bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={campaignStatus}
          onChange={(e) => {
            setCampaignStatus(e.target.value);
            update("Campaign Status", e.target.value);
          }}
        >
          <option value="Draft">Draft</option>
          <option value="Active">Active</option>
          <option value="Paused">Paused</option>
          <option value="Completed">Completed</option>
        </select>
      </td>

      <td className="p-4">
        <select
          className="w-full bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={paymentStatus}
          onChange={(e) => {
            setPaymentStatus(e.target.value);
            update("Payment Status", e.target.value);
          }}
        >
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
          <option value="Manual">Manual</option>
        </select>
      </td>

      <td className="p-4 text-center">
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          checked={manualUnlock}
          onChange={(e) => {
            setManualUnlock(e.target.checked);
            update("Manual Unlock", e.target.checked);
          }}
        />
      </td>

      <td className="p-4">
        <select
          className="w-full bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={jobCategory}
          onChange={(e) => {
            setJobCategory(e.target.value);
            update("Job Category", e.target.value);
          }}
        >
          <option value="Physical">Physical</option>
          <option value="Office">Office</option>
          <option value="Other">Other</option>
        </select>
      </td>

      <td className="p-4">
        <span className="font-semibold text-slate-800">
          {job.fields["Quality Score"] || 0}
        </span>
      </td>

      <td className="p-4">
        <span
          className={
            job.fields["Quality Status"] === "Approved"
              ? "text-green-600 font-semibold"
              : "text-red-500 font-semibold"
          }
        >
          {job.fields["Quality Status"] || "Pending"}
        </span>
      </td>

      <td className="p-4 text-center">
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          checked={freeEligible}
          onChange={(e) => {
            setFreeEligible(e.target.checked);
            update("Free Eligible", e.target.checked);
          }}
        />
      </td>

      <td className="p-4 text-center">
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          checked={freeCampaign}
          onChange={(e) => {
            setFreeCampaign(e.target.checked);
            update("Free Campaign", e.target.checked);
          }}
        />
      </td>

      <td className="p-4">
        <input
          type="number"
          value={adSpend}
          onChange={(e) => setAdSpend(Number(e.target.value))}
          onBlur={() => update("Ad Spend", Number(adSpend))}
          className="w-20 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </td>

      <td className="p-4">
        <input
          type="number"
          value={maxFreeSpend}
          onChange={(e) => setMaxFreeSpend(Number(e.target.value))}
          onBlur={() => update("Max Free Spend", Number(maxFreeSpend))}
          className="w-20 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </td>

      <td className="p-4">
        {isUnlocked ? (
          <span className="text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-lg text-xs tracking-wider uppercase">Unlocked</span>
        ) : (
          <span className="text-red-500 font-semibold bg-red-50 px-2.5 py-1 rounded-lg text-xs tracking-wider uppercase">Locked</span>
        )}
      </td>

      <td className="p-4">
        <button
          onClick={async () => {
            await fetch("/api/admin/recalculate-job-quality", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ jobId: job.id }),
            });
            window.location.reload();
          }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50 transition-colors shadow-sm font-semibold text-slate-700 whitespace-nowrap"
        >
          Recalculate
        </button>
      </td>
    </tr>
  );
}
