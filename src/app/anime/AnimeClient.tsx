"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Card from "../components/Card";
import Image from "next/image";
import type { AnimeItem } from "@/lib/anime";

type ApiResp = {
  items: AnimeItem[];
  hasNextPage: boolean;
  page: number;
  perPage: number;
};

export default function AnimeClient({ initial }: { initial: ApiResp }) {
  const [items, setItems] = useState<AnimeItem[]>(() => initial.items);
  const [page, setPage] = useState(initial.page);
  const [hasNext, setHasNext] = useState(initial.hasNextPage);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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
  }, [hasNext, page, loading, loadMore]); // guards inside loadMore prevent duplicates

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sorted.map((m, i) => (
          <Card key={(m.url || i.toString()) + i}>
            {(m.thumbnail || m.coverImage) ? (
              <div className="aspect-video w-full rounded-md overflow-hidden bg-black/5">
                {/* image or embed logic as before */}
                <a href={m.url} target="_blank" rel="noopener noreferrer">
                  <div className="relative w-full aspect-video mb-2 overflow-hidden rounded-md">
                    <Image
                      src={m.thumbnail || m.coverImage!}
                      alt={m.title}
                      fill
                      sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover"
                      priority={i < 4}
                    />
                  </div>
                </a>
              </div>
            ) : null}
            <div className="mt-2">
              <div className="font-semibold line-clamp-2">{m.title}</div>
              {m.description ? (
                <p
                  className="text-sm text-black/80 mt-1 line-clamp-4"
                  dangerouslySetInnerHTML={{ __html: m.description }}
                />
              ) : null}
            </div>
          </Card>
        ))}
      </div>

      {/* Sentinel + status */}
      <div ref={sentinelRef} className="h-6" />
      <div className="flex justify-center">
        {loading && <div className="text-black/60 text-sm">Loading…</div>}
        {!hasNext && <div className="text-black/50 text-sm">No more results.</div>}
      </div>
    </div>
  );
}
