import type { Article } from "@/lib/news";
import { headers } from "next/headers";
import NewsClient from "./NewsClient";

async function fetchFirstPage(): Promise<Article[]> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const proto = h.get("x-forwarded-proto") || "http";
  const base = process.env.NEXT_PUBLIC_BASE_URL || (host ? `${proto}://${host}` : "");
  const res = await fetch(`${base}/api/news?page=1`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = (await res.json()) as { articles?: Article[] };
  return data.articles || [];
}

export default async function NewsPage() {
  const articles = await fetchFirstPage();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold drop-shadow-md">Tin tức Việt Nam</h1>
      <NewsClient initial={articles} />
    </div>
  );
}
