export type JobFormData = {
  title: string;
  slug: string;
  company: string;
  location: string;
  jobType: string;
  employmentType: string;
  shift: string;
  salary: string;
  shortDescription: string;
  fullDescription: string;
  requirements: string;
  benefits: string;
  ctaText: string;
  channels: string;
  budget: string;
  // Campaign Extension
  platform: string;
  campaignLocation: string;
  objective: string;
  facebookPostText?: string;
};
