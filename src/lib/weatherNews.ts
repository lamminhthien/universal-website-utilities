export type WeatherNewsItem = {
  title: string;
  url: string;
  source: string;
  publishedAt?: number;
};

const SOURCES = [
  { url: "https://www.nchmf.gov.vn/RSS.aspx?cat=thoi_tiet", source: "NCHMF" },
  { url: "https://vnexpress.net/rss/thoi-su.rss", source: "VnExpress" },
  { url: "https://tuoitre.vn/rss/thoi-su.rss", source: "Tuổi Trẻ" }
];

function extract(tag: string, item: string): string | undefined {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = item.match(re);
  if (!m) return undefined;
  return m[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function parseRss(xml: string, source: string): WeatherNewsItem[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  return items.map((raw) => {
    const title = extract("title", raw) || "(Không tiêu đề)";
    const url = extract("link", raw) || "#";
    const pub = extract("pubDate", raw) || extract("published", raw);
    const ts = pub ? Date.parse(pub) : undefined;
    return { title, url, source, publishedAt: ts };
  });
}

export async function fetchWeatherNews(): Promise<WeatherNewsItem[]> {
  const results = await Promise.all(
    SOURCES.map(async (s) => {
      try {
        const res = await fetch(s.url, { next: { revalidate: 900 }, headers: { "User-Agent": "universal-website-utilities/1.0" } });
        const xml = await res.text();
        return parseRss(xml, s.source);
      } catch {
        return [] as WeatherNewsItem[];
      }
    })
  );
  const flat = results.flat();
  // naive filter for weather keywords
  const textFilter = /thời tiết|mưa|bão|áp thấp|nắng nóng|gió mùa|lũ|mưa đá|sạt lở|bão nhiệt đới|mưa lớn/i;
  const filtered = flat.filter((i) => textFilter.test(i.title));
  filtered.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
  return filtered.slice(0, 36);
}
