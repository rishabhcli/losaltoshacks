export interface EvidenceSource {
  id?: string;
  url: string;
  thumbnail?: string | null;
  platform?: string;
  title?: string;
  keywords?: string;
  summary?: string;
  likes?: number;
  views?: number;
  comments?: number;
}

export function normalizeEvidenceSources(value: unknown): EvidenceSource[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const source = item as Record<string, unknown>;
      const url = String(source.url ?? source.source_url ?? "").trim();
      if (!url) return null;

      return {
        id: String(source.id ?? url),
        url,
        thumbnail: typeof source.thumbnail === "string"
          ? source.thumbnail
          : typeof source.thumbnail_url === "string"
            ? source.thumbnail_url
            : null,
        platform: String(source.platform ?? "source").trim(),
        title: String(source.title ?? "").trim(),
        keywords: String(source.keywords ?? "").trim(),
        summary: String(source.summary ?? "").trim(),
        likes: toOptionalNumber(source.likes),
        views: toOptionalNumber(source.views),
        comments: toOptionalNumber(source.comments),
      };
    })
    .filter((source): source is EvidenceSource => Boolean(source));
}

export function getEvidenceTitle(source: EvidenceSource, fallback = "Source evidence") {
  return source.title || source.keywords || fallback;
}

export function formatEvidencePlatform(platform: string | undefined) {
  if (!platform) return "Source";
  return platform.replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatEvidenceMetric(value: number | undefined) {
  if (value == null || Number.isNaN(value)) return null;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

function toOptionalNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}
