"use client";
import { useMemo, useState } from "react";
import Card from "../components/Card";
import SafeImage from "@/app/components/SafeImage";

export type AnimeItem = {
  title: string;
  url: string;
  trailerId?: string;
  trailerSite?: string;
  coverImage?: string;
  updatedAt?: number;
};

type ApiResp = { items: AnimeItem[]; hasNextPage: boolean; page: number; perPage: number };

export default function AnimeClient({ initial }: { initial: ApiResp }) {
  const [items, setItems] = useState<AnimeItem[]>(() => initial.items);
  const [page, setPage] = useState(initial.page);
  const [hasNext, setHasNext] = useState(initial.hasNextPage);
  const [loading, setLoading] = useState(false);

  // Always show latest first
  const sorted = useMemo(
    () => [...items].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)),
    [items]
  );

  async function loadMore() {
    if (loading || !hasNext) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/anime?page=${page + 1}&perPage=${initial.perPage}`);
      const json: ApiResp = await res.json();
      setItems((prev) => [...prev, ...json.items]);
      setPage(json.page);
      setHasNext(json.hasNextPage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        {sorted.map((m, i) => (
          <Card key={(m.url || i.toString()) + i}>
            {m.trailerId && (m.trailerSite || "").toLowerCase() === "youtube" ? (
              <div className="aspect-video w-full rounded-md overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${m.trailerId}`}
                  title={`${m.title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : m.coverImage ? (
              <a href={m.url} target="_blank" rel="noopener noreferrer">
                <div className="relative w-full h-56 mb-2 overflow-hidden rounded-md">
                  <SafeImage
                    src={m.coverImage}
                    fallbackSrc={m.coverImage}
                    alt={m.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority={i < 4}
                  />
                </div>
              </a>
            ) : null}
            <div className="font-semibold mt-2 line-clamp-2 flex items-center justify-between gap-2">
              <a href={m.url} target="_blank" rel="noopener noreferrer" className="truncate">{m.title}</a>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(m.title + " anime")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20 border border-white/10"
                title="Search on Google"
              >
                Google
              </a>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        {hasNext ? (
          <button
            onClick={loadMore}
            className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/10 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        ) : (
          <div className="text-white/50 text-sm">No more results.</div>
        )}
      </div>
    </div>
  );
}
