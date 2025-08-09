import Card from "../components/Card";

type Article = {
  title: string;
  url: string;
  description?: string;
  source?: string;
};

type GNewsArticle = { title: string; url: string; description?: string; source?: { name?: string } };
type GNewsResponse = { articles?: GNewsArticle[] };
type HNHit = { title: string; url?: string; objectID: string; story_text?: string };
type HNResponse = { hits?: HNHit[] };

async function fetchNews(): Promise<Article[]> {
  // Use GNews public endpoint (offers limited free access). As a fallback, use HN API.
  const gnews = fetch("https://gnews.io/api/v4/top-headlines?category=general&lang=vi&country=vn&max=10&apikey=demo", { next: { revalidate: 300 } })
    .then((r) => (r.ok ? (r.json() as Promise<GNewsResponse>) : Promise.reject(r)))
    .then((d) => (d.articles || []).map((a) => ({ title: a.title, url: a.url, description: a.description, source: a.source?.name })) as Article[])
    .catch(() => [] as Article[]);

  const hn = fetch("https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=10", { next: { revalidate: 300 } })
    .then((r) => r.json() as Promise<HNResponse>)
    .then((d) => (d.hits || []).map((h) => ({ title: h.title, url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`, description: h.story_text, source: "Hacker News" })) as Article[])
    .catch(() => [] as Article[]);

  const [a, b] = await Promise.all([gnews, hn]);
  const combined = [...a, ...b].filter((x) => x.title && x.url);
  return combined.slice(0, 20);
}

export default async function NewsPage() {
  const articles = await fetchNews();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold drop-shadow-[0_0_8px_#8a2be2]">Vietnamese News</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.length === 0 && (
          <Card className="sm:col-span-2 lg:col-span-3">
            <div className="h-24 skeleton rounded-md" />
          </Card>
        )}
        {articles.map((a, idx) => (
          <a key={idx} href={a.url} target="_blank" rel="noreferrer" className="block">
            <Card>
              <div className="text-sm text-white/60 mb-1">{a.source}</div>
              <div className="font-semibold mb-1">{a.title}</div>
              {a.description && <p className="text-white/70 text-sm line-clamp-3">{a.description}</p>}
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
