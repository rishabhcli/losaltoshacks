/**
 * Mapping between kebab-case API values (as stored in seed data)
 * and human-friendly display labels used in the UI.
 */
export const INDUSTRY_DISPLAY_LABELS: Record<string, string> = {
  "fashion-retail": "Fashion & Retail",
  "travel-hospitality": "Travel & Hospitality",
  "consumer-products": "Consumer Products",
  All: "All Industries",
};

/** Returns the display label for an industry API value */
export function getIndustryLabel(apiValue: string): string {
  return INDUSTRY_DISPLAY_LABELS[apiValue] ?? apiValue;
}

/** All industry options for selection UIs */
export const INDUSTRY_OPTIONS = [
  { value: "fashion-retail", label: "Fashion & Retail", description: "Apparel, accessories, e-commerce" },
  { value: "travel-hospitality", label: "Travel & Hospitality", description: "Hotels, tourism, experiences" },
  { value: "consumer-products", label: "Consumer Products", description: "FMCG, electronics, home goods" },
  { value: "All", label: "All Industries", description: "See trends across every sector" },
] as const;
