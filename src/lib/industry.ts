/**
 * Mapping between kebab-case API values (as stored in seed data)
 * and human-friendly display labels used in the UI.
 */
export const INDUSTRY_DISPLAY_LABELS: Record<string, string> = {
  "beauty-skincare": "Beauty & Skincare",
  "fashion-retail": "Fashion & Retail",
  "food-beverage": "Food & Beverage",
  "travel-hospitality": "Travel & Hospitality",
  "wellness-fitness": "Wellness & Fitness",
  All: "All Industries",
};

/** Returns the display label for an industry API value */
export function getIndustryLabel(apiValue: string): string {
  return INDUSTRY_DISPLAY_LABELS[apiValue] ?? apiValue;
}

/** All industry options for selection UIs */
export const INDUSTRY_OPTIONS = [
  { value: "beauty-skincare", label: "Beauty & Skincare", description: "Skincare, cosmetics, beauty tech" },
  { value: "fashion-retail", label: "Fashion & Retail", description: "Apparel, accessories, e-commerce" },
  { value: "food-beverage", label: "Food & Beverage", description: "Functional drinks, snacks, hospitality F&B" },
  { value: "travel-hospitality", label: "Travel & Hospitality", description: "Hotels, tourism, experiences" },
  { value: "wellness-fitness", label: "Wellness & Fitness", description: "Recovery, memberships, wellness services" },
  { value: "All", label: "All Industries", description: "See trends across every sector" },
] as const;
