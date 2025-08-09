import Card from "../components/Card";
import type { Article } from "@/lib/news";
import { headers } from "next/headers";

async function fetchVietnamNews(): Promise<Article[]> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const proto = h.get("x-forwarded-proto") || "http";
  const base = process.env.NEXT_PUBLIC_BASE_URL || (host ? `${proto}://${host}` : "");
  const res = await fetch(`${base}/api/news`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = (await res.json()) as { articles?: Article[] };
  return data.articles || [];
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
