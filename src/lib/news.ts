export type Article = {
  title: string;
  url: string;
  description?: string;
  source: string;
  thumbnail?: string;
  publishedAt?: number;
};

type Source = { url: string; name: string };
export const NEWS_SOURCES: Source[] = [
  { url: "https://tuoitre.vn/rss/tin-moi-nhat.rss", name: "Tuổi Trẻ" },
  { url: "https://vnexpress.net/rss/tin-moi-nhat.rss", name: "VnExpress" },
  { url: "https://thanhnien.vn/rss/home.rss", name: "Thanh Niên" },
  { url: "https://nld.com.vn/rss/home.rss", name: "Người Lao Động" },
  { url: "https://laodong.vn/rss/home.rss", name: "Lao Động" },
  { url: "https://zingnews.vn/rss.html", name: "Zing News" },
  { url: "https://vtv.vn/rss/tin-moi-nhat.rss", name: "VTV" },
  { url: "https://genk.vn/rss/home.rss", name: "GenK" },
  { url: "https://thanhnien.vn/cong-nghe/rss.html", name: "Thanh Niên - Công nghệ" },
  { url: "https://vnexpress.net/rss/so-hoa.rss", name: "VnExpress - Số hóa" },
  { url: "https://cafef.vn/trang-chu.rss", name: "CafeF" },
  { url: "https://vneconomy.vn/rss.htm", name: "VnEconomy" },
];

function extract(tag: string, item: string): string | undefined {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = item.match(re);
  if (!m) return undefined;
  return m[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function extractThumb(item: string, description?: string): string | undefined {
  const enc = item.match(/<enclosure[^>]*url=\"([^\"]+)\"/i);
  if (enc?.[1]) return enc[1];
  const media = item.match(/<media:content[^>]*url=\"([^\"]+)\"/i);
  if (media?.[1]) return media[1];
  const desc = description || extract("description", item) || "";
  const img = desc.match(/<img[^>]*src=[\'\"]([^\'\"]+)[\'\"][^>]*>/i);
  if (img?.[1]) return img[1];
  return undefined;
}

function parseRss(xml: string, sourceName: string): Article[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  return items.map((raw) => {
    const title = extract("title", raw) || "(Không tiêu đề)";
    const url = extract("link", raw) || "#";
    const description = extract("description", raw);
    const thumbnail = extractThumb(raw, description);
  const pub = extract("pubDate", raw) || extract("published", raw);
  const ts = pub ? Date.parse(pub) : undefined;
  return { title, url, description, source: sourceName, thumbnail, publishedAt: ts } as Article;
  });
}

export async function fetchVietnamNews(options?: { sources?: string[] }): Promise<Article[]> {
  const wanted = options?.sources?.filter(Boolean) ?? [];

  // Choose sources: if no input or no match, fall back to all
  const selected = (wanted.length
    ? NEWS_SOURCES.filter((s) => wanted.includes(s.name) || wanted.includes(s.url))
    : NEWS_SOURCES);

  const effective = selected.length > 0 ? selected : NEWS_SOURCES;

  // Helper to enforce a timeout per request
  const fetchWithTimeout = async (input: RequestInfo | URL, init?: RequestInit & { timeoutMs?: number }) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), init?.timeoutMs ?? 10000);
    try {
      const res = await fetch(input, {
        ...init,
        signal: controller.signal,
        headers: {
          "User-Agent": "universal-website-utilities/1.0",
          ...(init?.headers || {}),
        },
        next: { revalidate: 300 },
      } as RequestInit);
      return res;
    } finally {
      clearTimeout(id);
    }
  };

  const settled = await Promise.allSettled(
    effective.map(async (s) => {
      try {
        const res = await fetchWithTimeout(s.url, { timeoutMs: 10000 });
        const xml = await res.text();
        return parseRss(xml, s.name);
      } catch {
        return [] as Article[];
      }
    })
  );

  const results = settled.flatMap((r) => (r.status === "fulfilled" ? r.value : []));

  // De-duplicate by title+url
  const seen = new Set<string>();
  const unique = results.filter((a) => {
    const key = `${a.title}|${a.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by published time desc when available
  unique.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));

  return unique;
}
