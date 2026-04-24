"use client";

import { useState } from "react";

export default function EmployerAccessRow({ employer }: { employer: any }) {
  const [plan, setPlan] = useState(employer.fields.Plan || "Free");
  const [limit, setLimit] = useState(employer.fields["Applicant Limit"] || 5);
  const [status, setStatus] = useState(
    employer.fields["Access Status"] || "Active"
  );
  const [saving, setSaving] = useState(false);

  async function updateAccess(next: {
    plan?: string;
    applicantLimit?: number;
    accessStatus?: string;
  }) {
    setSaving(true);

    try {
      await fetch("/api/admin/update-employer-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerId: employer.id,
          ...next,
        }),
      });
    } catch (error) {
      console.error("Failed to update access", error);
    }

    setSaving(false);
  }

  return (
    <tr className="border-t hover:bg-slate-50 transition-colors">
      <td className="p-4 font-medium text-slate-800">
        {employer.fields.Name || employer.fields.Email || "Unknown"}
      </td>

      <td className="p-4 text-slate-600">
        {employer.fields.Email || "N/A"}
      </td>

      <td className="p-4">
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          value={plan}
          onChange={(e) => {
            setPlan(e.target.value);
            updateAccess({ plan: e.target.value });
          }}
        >
          <option value="Free">Free</option>
          <option value="Premium">Premium</option>
          <option value="Partner">Partner</option>
        </select>
      </td>

      <td className="p-4">
        <input
          className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          value={limit}
          min={0}
          onChange={(e) => setLimit(Number(e.target.value))}
          onBlur={() => updateAccess({ applicantLimit: Number(limit) })}
        />
      </td>

      <td className="p-4">
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            updateAccess({ accessStatus: e.target.value });
          }}
        >
          <option value="Active">Active</option>
          <option value="Locked">Locked</option>
        </select>
      </td>

      <td className="p-4 text-sm font-medium text-slate-400">
        {saving ? (
          <span className="text-orange-500 animate-pulse">Mentés...</span>
        ) : (
          <span className="text-emerald-500">Mentve</span>
        )}
      </td>
    </tr>
  );
}
