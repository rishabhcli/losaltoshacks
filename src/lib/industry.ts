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
  "tech-saas": "Tech & SaaS",
  "healthcare": "Healthcare",
  "finance-fintech": "Finance & Fintech",
  "real-estate": "Real Estate",
  "education": "Education",
  "entertainment-media": "Entertainment & Media",
  All: "All Industries",
};

/** Returns the display label for an industry API value */
export function getIndustryLabel(apiValue: string): string {
  return INDUSTRY_DISPLAY_LABELS[apiValue] ?? apiValue;
}

export interface IndustryOption {
  value: string;
  label: string;
  description: string;
  subcategories: string[];
}

/** All industry options for selection UIs */
export const INDUSTRY_OPTIONS: IndustryOption[] = [
  { value: "beauty-skincare", label: "Beauty & Skincare", description: "Skincare, cosmetics, beauty tech", subcategories: ["Skincare", "Cosmetics", "Haircare", "Fragrance", "Beauty Tech"] },
  { value: "fashion-retail", label: "Fashion & Retail", description: "Apparel, accessories, e-commerce", subcategories: ["Streetwear", "Luxury", "Sustainable Fashion", "DTC Brands", "Resale & Thrift"] },
  { value: "food-beverage", label: "Food & Beverage", description: "Functional drinks, snacks, hospitality F&B", subcategories: ["Functional Beverages", "Plant-Based", "Snacks", "Restaurant Tech", "Ghost Kitchens"] },
  { value: "travel-hospitality", label: "Travel & Hospitality", description: "Hotels, tourism, experiences", subcategories: ["Boutique Hotels", "Adventure Travel", "Digital Nomad", "Travel Tech", "Experiences"] },
  { value: "wellness-fitness", label: "Wellness & Fitness", description: "Recovery, memberships, wellness services", subcategories: ["Recovery Tech", "Mental Wellness", "Fitness Apps", "Supplements", "Wearables"] },
  { value: "tech-saas", label: "Tech & SaaS", description: "Software, AI tools, developer platforms", subcategories: ["AI & ML", "Developer Tools", "Cloud Infrastructure", "Cybersecurity", "No-Code / Low-Code"] },
  { value: "healthcare", label: "Healthcare", description: "Telehealth, medtech, digital health", subcategories: ["Telehealth", "MedTech", "Pharma", "Mental Health", "Health Wearables"] },
  { value: "finance-fintech", label: "Finance & Fintech", description: "Payments, neobanks, crypto, investing", subcategories: ["Payments", "Neobanking", "Crypto & Web3", "InsurTech", "Personal Finance"] },
  { value: "real-estate", label: "Real Estate", description: "PropTech, rentals, commercial real estate", subcategories: ["PropTech", "Residential", "Commercial", "Property Management", "Real Estate Investing"] },
  { value: "education", label: "Education", description: "EdTech, online learning, upskilling", subcategories: ["K-12 EdTech", "Higher Ed", "Corporate Training", "Language Learning", "Skill Platforms"] },
  { value: "entertainment-media", label: "Entertainment & Media", description: "Streaming, gaming, creator economy", subcategories: ["Streaming", "Gaming", "Creator Economy", "Podcasting", "Live Events"] },
  { value: "All", label: "All Industries", description: "See trends across every sector", subcategories: [] },
];
