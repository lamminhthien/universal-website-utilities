export type TravelItem = {
  title: string;
  url: string;
  description?: string;
  source: string;
  thumbnail?: string;
  categories?: string[];
  publishedAt?: number;
};

// A few reputable travel RSS sources.
const SOURCES = [
  { url: "https://www.cntraveler.com/feed/rss", name: "Condé Nast Traveler" },
  { url: "https://www.travelandleisure.com/rss", name: "Travel + Leisure" },
  { url: "https://www.theguardian.com/travel/rss", name: "The Guardian Travel" },
  { url: "https://www.nomadicmatt.com/feed/", name: "Nomadic Matt" },
];

function extract(tag: string, item: string): string | undefined {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = item.match(re);
  if (!m) return undefined;
  return m[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function extractThumb(item: string, description?: string): string | undefined {
  // Common media tags
  const enc = item.match(/<enclosure[^>]*url=\"([^\"]+)\"/i);
  if (enc?.[1]) return enc[1];
  const media = item.match(/<media:(?:content|thumbnail)[^>]*url=\"([^\"]+)\"/i);
  if (media?.[1]) return media[1];
  const og = item.match(/<meta[^>]*property=\"og:image\"[^>]*content=\"([^\"]+)\"/i);
  if (og?.[1]) return og[1];
  // Try parse from description content
  const desc = description || extract("description", item) || "";
  const img = desc.match(/<img[^>]*src=['\"]([^'\"]+)['\"][^>]*>/i);
  if (img?.[1]) return img[1];
  return undefined;
}

function parseRss(xml: string, sourceName: string): TravelItem[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  return items.map((raw) => {
    const title = extract("title", raw) || "(Untitled)";
    const url = extract("link", raw) || "#";
    const description = extract("description", raw) || extract("content:encoded", raw);
    const thumbnail = extractThumb(raw, description);
    const cats = Array.from(raw.matchAll(/<category>([\s\S]*?)<\/category>/gi)).map((m) =>
      (m[1] || "").replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim()
    );
  const pub = extract("pubDate", raw) || extract("published", raw) || extract("dc:date", raw);
  const publishedAt = pub ? Date.parse(pub) : undefined;
  return { title, url, description, source: sourceName, thumbnail, categories: cats, publishedAt } as TravelItem;
  });
}

export async function fetchTravelArticles(): Promise<TravelItem[]> {
  const results = await Promise.all(
    SOURCES.map(async (s) => {
      try {
        const res = await fetch(s.url, {
          next: { revalidate: 3600 },
          headers: { "User-Agent": "universal-website-utilities/1.0" },
        });
        const xml = await res.text();
        return parseRss(xml, s.name);
      } catch {
        return [] as TravelItem[];
      }
    })
  );
  const flat = results.flat();
  
  // Heuristic filters to keep destination/place stories and exclude transport/lodging/booking content
  const EXCLUDE = [
    "hotel", "resort", "hostel", "airline", "airport", "flight", "fare", "lounge",
    "points", "miles", "credit card", "deal", "sale", "booking", "bookings", "rental car",
    "car rental", "cruise", "ship", "train review", "bus", "insurance", "covid", "passport",
  ];
  const INCLUDE = [
    "guide", "itinerary", "things to do", "what to do", "where to", "best", "top",
    "destination", "neighborhood", "city", "town", "village", "island", "beach", "coast",
    "mountain", "alps", "national park", "park", "temple", "museum", "castle", "lake", "river",
    "valley", "desert", "canyon", "forest", "garden", "harbour", "harbor", "old town",
    "district", "quarter", "trail", "hike", "waterfall", "bay", "fjord",
  ];

  function isDestination(it: TravelItem): boolean {
    const text = ((it.title || "") + " " + (it.description || "")).toLowerCase();
    if (EXCLUDE.some((kw) => text.includes(kw))) return false;
    if (it.categories?.some((c) => /destinations?|city|guide|travel|europe|asia|africa|america|australia|islands?/i.test(c))) return true;
    if (INCLUDE.some((kw) => text.includes(kw))) return true;
    // Heuristic: titles with ", Country" or " in City"
    if (/,\s*[A-Z][a-z]+/.test(it.title)) return true;
    if (/\bin\s+[A-Z][A-Za-z\-\s]+/.test(it.title)) return true;
    return false;
  }

  const destinationOnly = flat.filter(isDestination);
  // Deduplicate by title+url
  const seen = new Set<string>();
  const unique = destinationOnly.filter((a) => {
    const key = (a.title || "") + (a.url || "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  // Sort newest first when available
  unique.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
  return unique.slice(0, 24);
}
