/**
 * Maps each industry preference to a targeted browser-use research prompt.
 * These prompts drive the background market research agents automatically.
 */
export const INDUSTRY_AUTO_PROMPTS: Record<string, string> = {
  "fashion-retail":
    "Research what clothing styles, fashion trends, streetwear brands, footwear, and accessories are trending right now across social media, fashion communities, and retail. Identify top-selling items, emerging aesthetics, and what consumers are buying.",

  "beauty-skincare":
    "Research trending makeup products, skincare routines, beauty ingredients, viral cosmetic brands, and emerging beauty tech right now. Find what products people are buying, what ingredients are popular, and what beauty content is going viral.",

  "food-beverage":
    "Research trending food products, functional beverages, restaurant concepts, viral recipes, and food innovations gaining traction right now. Find what drinks and snacks are popular, emerging cuisines, and food brands people are excited about.",

  "travel-hospitality":
    "Research trending travel destinations, hotel and resort experiences, travel styles, and hospitality innovations people are talking about right now. Find what trips are being planned, popular experiences, and emerging travel concepts.",

  "wellness-fitness":
    "Research trending wellness products, fitness apps, recovery tools, mental health practices, health supplements, and workout trends gaining popularity right now. Find what wellness routines, wearables, and health products consumers are adopting.",

  "tech-saas":
    "Research trending software tools, AI applications, developer platforms, and SaaS products gaining traction right now. Find what tools are going viral, emerging AI use cases, and what technology products are seeing rapid adoption.",

  "healthcare":
    "Research trending digital health tools, telehealth services, medical device innovations, mental health apps, and health technology products gaining adoption right now. Find what healthcare solutions are being discussed and adopted.",

  "finance-fintech":
    "Research trending fintech apps, payment innovations, investment platforms, personal finance tools, and financial products gaining users right now. Find what financial technology is being adopted and what money trends are emerging.",

  "real-estate":
    "Research trending proptech tools, real estate investment opportunities, housing market shifts, and property innovations getting attention right now. Find what real estate concepts, platforms, and markets are emerging.",

  "education":
    "Research trending edtech platforms, online learning tools, upskilling courses, AI tutoring tools, and educational innovations gaining momentum right now. Find what learning products, skills, and educational formats are in demand.",

  "entertainment-media":
    "Research trending streaming content, viral gaming titles, creator economy trends, social media formats, and media consumption patterns right now. Find what shows, games, creators, and media platforms are dominating attention.",
};

/**
 * How long to wait before re-triggering an auto-mission for the same industry (ms).
 * Default: 12 hours.
 */
export const AUTO_MISSION_COOLDOWN_MS = 12 * 60 * 60 * 1000;
