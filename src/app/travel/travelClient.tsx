"use client";
import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import Image from "next/image";

export type TravelItem = {
  title: string;
  url: string;
  description?: string;
  source: string;
  thumbnail?: string;
  publishedAt?: number;
};

async function fetchPage(page: number) {
  const res = await fetch(`/api/travel?page=${page}`);
  const data = await res.json();
  return data as { items: TravelItem[]; page: number; hasNextPage: boolean };
}

export default function TravelClient() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<TravelItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  useEffect(() => {
    if (loadedOnce) return;
    (async () => {
      setLoading(true);
      const d = await fetchPage(1);
      setItems(d.items);
      setHasNext(d.hasNextPage ?? d.items.length > 0);
      setPage(1);
      setLoading(false);
      setLoadedOnce(true);
    })();
  }, [loadedOnce]);

  const fallback = (q: string) => `https://source.unsplash.com/800x600/?${encodeURIComponent(q)}`;
  // Sort newest-first if we can infer timestamps (approx: from URLs or leave as is)
  const sorted = useMemo(() => items, [items]);

  async function loadMore() {
    if (loading || !hasNext) return;
    setLoading(true);
    const d = await fetchPage(page + 1);
    setItems((prev) => [...prev, ...d.items]);
    setPage(d.page);
    setHasNext(d.hasNextPage ?? d.items.length > 0);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.length === 0 && (
          <Card>
            <div className="text-white/80">Đang tải...</div>
          </Card>
        )}
        {sorted.map((it, i) => {
          const img = it.thumbnail || fallback(it.title || "điểm đến du lịch");
          return (
            <Card key={it.url + i}>
              <a href={it.url} target="_blank" rel="noopener noreferrer">
                <div className="relative w-full h-56 mb-3 overflow-hidden rounded-md">
                  <Image
                    src={img}
                    alt={it.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    priority={i < 6}
                    unoptimized={!img.includes("images.unsplash.com")}
                  />
                </div>
                <div className="font-semibold line-clamp-2">{it.title}</div>
                <div className="text-xs text-white/60 mt-1">{it.source}</div>
                {it.description && (
                  <p className="text-sm text-white/70 mt-1 line-clamp-3" dangerouslySetInnerHTML={{ __html: it.description }} />
                )}
              </a>
              <div className="mt-3 flex gap-2">
                <a
                  className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20 border border-white/10"
                  href={`https://www.google.com/search?q=${encodeURIComponent(it.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google
                </a>
                <a
                  className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20 border border-white/10"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(it.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Maps
                </a>
              </div>
            </Card>
          );
        })}
      </div>
      {hasNext && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/10 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Tải thêm"}
          </button>
        </div>
      )}
    </div>
  );
}
