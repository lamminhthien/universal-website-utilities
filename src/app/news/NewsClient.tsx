/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Card from "../components/Card";
import type { Article } from "@/lib/news";

export default function NewsClient({ initial }: { initial: Article[] }) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Article[]>(initial);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const sorted = useMemo(
    () => [...items].sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0)),
    [items]
  );

  async function loadMore() {
    if (loading || !hasNext) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/news?page=${page + 1}`);
      const data = (await res.json()) as { articles?: Article[] };
      const nextItems = data.articles || [];
      if (nextItems.length === 0) {
        setHasNext(false);
      } else {
        setItems((prev) => [...prev, ...nextItems]);
        setPage((p) => p + 1);
      }
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
  }, [hasNext, page, loading, loadMore]);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((a, idx) => (
          <a key={idx} href={a.url} target="_blank" rel="noreferrer" className="block">
            <Card>
              <div className="text-sm text-black/60 mb-1">{a.source}</div>
              <div className="font-semibold mb-3">{a.title}</div>
               {/* Inject placeholder if description has no <img> */}
              {!a.description?.includes("<img") && (
                <img
                  src="./news-placeholder-457X274.png"
                  alt="placeholder"
                  className="w-full h-full object-cover mb-2 rounded"
                />
              )}
              {a.description && (
                <p
                  className="text-black/70 text-sm line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: a.description }}
                />
              )}
            </Card>
          </a>
        ))}
      </div>

      {/* Sentinel + status */}
      <div ref={sentinelRef} className="h-6" />
      <div className="flex justify-center">
        {loading && <div className="text-black/60 text-sm">Đang tải…</div>}
        {!hasNext && <div className="text-black/50 text-sm">Không còn tin.</div>}
      </div>
    </div>
  );
}
