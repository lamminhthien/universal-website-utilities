"use client";
import { useMemo, useState } from "react";
import Card from "../components/Card";
import type { Article } from "@/lib/news";

export default function NewsClient({ initial }: { initial: Article[] }) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Article[]>(initial);
  const [loading, setLoading] = useState(false);

  const sorted = useMemo(() => [...items].sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0)), [items]);

  async function loadMore() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/news?page=${page + 1}`);
      const data = (await res.json()) as { articles?: Article[] };
      setItems((prev) => [...prev, ...(data.articles || [])]);
      setPage((p) => p + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((a, idx) => (
          <a key={idx} href={a.url} target="_blank" rel="noreferrer" className="block">
            <Card>
              <div className="text-sm text-black/60 mb-1">{a.source}</div>
              <div className="font-semibold mb-1">{a.title}</div>
              {a.description && (
                <p className="text-black/70 text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: a.description }} />
              )}
            </Card>
          </a>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          onClick={loadMore}
          className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/10 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Tải thêm"}
        </button>
      </div>
    </div>
  );
}
