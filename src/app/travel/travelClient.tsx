/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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

  // Infinite scroll observer
  useEffect(() => {
    if (!hasNext) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNext, page, loading, loadMore]);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((it, idx) => (
          <Card key={it.url + idx}>
            <a href={it.url} target="_blank" rel="noopener noreferrer" className="block">
              <div className="aspect-video w-full rounded-md overflow-hidden bg-black/5">
                <Image
                  src={it.thumbnail || fallback(it.title)}
                  alt={it.title}
                  width={800}
                  height={450}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="font-semibold line-clamp-2">{it.title}</div>
              <div className="text-xs text-black/60 mt-1">{it.source}</div>
              {it.description && (
                <p
                  className="text-sm text-black/70 mt-1 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: it.description }}
                />
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
        ))}
      </div>

      {/* Sentinel + status */}
      <div ref={sentinelRef} className="h-6" />
      <div className="flex justify-center">
        {loading && <div className="text-black/60 text-sm">Đang tải…</div>}
        {!hasNext && <div className="text-black/50 text-sm">Hết kết quả.</div>}
      </div>
    </div>
  );
}
