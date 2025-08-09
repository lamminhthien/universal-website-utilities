"use client";
import { useMemo, useState } from "react";
import Card from "../components/Card";
import SafeImage from "@/app/components/SafeImage";

export type AnimeItem = {
  title: string;
  url: string;
  coverImage?: string;
  updatedAt?: number;
  description?: string;
  thumbnail?: string;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sorted.map((m, i) => (
          <Card key={(m.url || i.toString()) + i}>
            {(m.thumbnail || m.coverImage) ? (
              <a href={m.url} target="_blank" rel="noopener noreferrer">
                <div className="relative w-full aspect-video mb-2 overflow-hidden rounded-md">
                  <SafeImage
                    src={m.thumbnail || m.coverImage!}
                    fallbackSrc={m.coverImage || m.thumbnail || ""}
                    alt={m.title}
                    fill
                    sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover"
                    priority={i < 4}
                  />
                </div>
              </a>
            ) : null}
            <div className="mt-2">
              <div className="font-semibold line-clamp-2">
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {m.title}
                </a>
              </div>
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
          <div className="text-black/50 text-sm">No more results.</div>
        )}
      </div>
    </div>
  );
}
