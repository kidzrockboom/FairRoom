export const strikesPageHeader = {
  title: "Student Directory",
  subtitle: "Search students and review strike history.",
} as const;

export const strikePolicyItems = [
  "3 strikes result in automatic account suspension for 14 days.",
  "Strikes can be appealed by students within 48 hours.",
  "Manual overrides must include a valid reason for auditing purposes.",
  "Strikes expire after 180 days of clean booking history.",
] as const;

export const strikeAdjustmentNote =
  "This note will be logged in the system and visible to other administrators.";

export const strikeEmptyState = {
  title: "No strike history yet",
  description: "This student does not have any recorded strikes.",
} as const;
