export function calculateJobQualityScore(fields: Record<string, any>) {
  let score = 0;

  const title = String(fields.Title || "").trim();
  const salary = String(fields.Salary || fields["Salary Range"] || "").trim();
  const location = String(fields.Location || "").trim();
  const description = String(
    fields.Description || fields["Short Description"] || ""
  ).trim();

  if (title.length >= 5) score += 15;
  if (location.length >= 2) score += 15;
  if (salary.length >= 3 && /\d/.test(salary)) score += 35;
  if (description.length >= 100) score += 25;

  const hasImage =
    Array.isArray(fields.Image) ||
    Array.isArray(fields.Banner) ||
    Array.isArray(fields["Position Banner"]) ||
    Array.isArray(fields["position_banner_file"]);

  if (hasImage) score += 10;

  return Math.min(score, 100);
}

export function getQualityStatus(score: number) {
  return score >= 70 ? "Approved" : "Rejected";
}

export function isPhysicalJob(fields: Record<string, any>) {
  return fields["Job Category"] === "Physical";
}
