import Card from "../components/Card";

type Article = {
  title: string;
  url: string;
  description?: string;
  source: string;
  thumbnail?: string;
};

const SOURCES = [
  { url: "https://vnexpress.net/rss/tin-moi-nhat.rss", name: "VnExpress" },
  { url: "https://tuoitre.vn/rss/tin-moi-nhat.rss", name: "Tuổi Trẻ" },
  { url: "https://dantri.com.vn/rss/home.rss", name: "Dân Trí" },
];

function extract(tag: string, item: string): string | undefined {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = item.match(re);
  if (!m) return undefined;
  // Remove CDATA if present
  return m[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function extractThumb(item: string, description?: string): string | undefined {
  // enclosure url
  const enc = item.match(/<enclosure[^>]*url=\"([^\"]+)\"/i);
  if (enc?.[1]) return enc[1];
  // media:content url
  const media = item.match(/<media:content[^>]*url=\"([^\"]+)\"/i);
  if (media?.[1]) return media[1];
  // First <img src> inside description
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
    return { title, url, description, source: sourceName, thumbnail } satisfies Article;
  });
}

async function fetchVietnamNews(): Promise<Article[]> {
  const results = await Promise.all(
    SOURCES.map(async (s) => {
      try {
        const res = await fetch(s.url, { next: { revalidate: 300 }, headers: { "User-Agent": "universal-website-utilities/1.0" } });
        const xml = await res.text();
        return parseRss(xml, s.name);
      } catch {
        return [] as Article[];
      }
    })
  );
  // Flatten, de-dup by title
  const flat = results.flat();
  const seen = new Set<string>();
  const unique = flat.filter((a) => {
    const key = a.title + a.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return unique.slice(0, 24);
}

export default async function NewsPage() {
  const articles = await fetchVietnamNews();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold drop-shadow-[0_0_8px_#8a2be2]">Tin tức Việt Nam</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.length === 0 && (
          <Card className="sm:col-span-2 lg:col-span-3">
            <div className="h-24 skeleton rounded-md" />
          </Card>
        )}
        {articles.map((a, idx) => (
          <a key={idx} href={a.url} target="_blank" rel="noreferrer" className="block">
            <Card>
        {a.thumbnail && (
                <div className="relative w-full h-40 mb-3 overflow-hidden rounded-md">
          {/* Use a plain img to avoid configuring remote image domains */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.thumbnail} alt={a.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="text-sm text-white/60 mb-1">{a.source}</div>
              <div className="font-semibold mb-1">{a.title}</div>
              {a.description && <p className="text-white/70 text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: a.description }} />}
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
