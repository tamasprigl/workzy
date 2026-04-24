export function canUseFreeCampaign(fields: Record<string, any>) {
  return (
    fields["Job Category"] === "Physical" &&
    fields["Quality Status"] === "Approved" &&
    fields["Free Eligible"] === true
  );
}

export function shouldStopFreeCampaign(fields: Record<string, any>) {
  const applicantsCount = Number(fields["Applicants Count"] || 0);
  const adSpend = Number(fields["Ad Spend"] || 0);
  const maxFreeSpend = Number(fields["Max Free Spend"] || 7000);

  const paymentStatus = fields["Payment Status"];
  const manualUnlock = fields["Manual Unlock"];

  if (paymentStatus === "Paid" || manualUnlock === true) {
    return {
      shouldStop: false,
      reason: null,
    };
  }

  if (applicantsCount >= 5) {
    return {
      shouldStop: true,
      reason: "Reached 5 applicants",
    };
  }

  if (adSpend >= maxFreeSpend) {
    return {
      shouldStop: true,
      reason: "Budget limit",
    };
  }

  return {
    shouldStop: false,
    reason: null,
  };
}
