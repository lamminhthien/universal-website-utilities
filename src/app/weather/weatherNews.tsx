"use client";
import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import { fetchWeatherNews, type WeatherNewsItem } from "@/lib/weatherNews";

async function loadFirst(): Promise<WeatherNewsItem[]> {
  try {
    const items = await fetchWeatherNews();
    return items;
  } catch {
    return [];
  }
}

export default function WeatherNews() {
  const [items, setItems] = useState<WeatherNewsItem[] | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // Load on first render
  useEffect(() => {
    if (items !== null) return;
    (async () => {
      const data = await loadFirst();
      setItems(data);
    })();
  }, [items]);

  const sorted = useMemo(() => (items ? [...items].sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0)) : []), [items]);
  const visible = sorted.slice(0, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((n, i) => (
          <a key={n.url + i} href={n.url} target="_blank" rel="noopener noreferrer" className="block">
            <Card>
              <div className="text-sm text-black/60 mb-1">{n.source}</div>
              <div className="font-semibold">{n.title}</div>
            </Card>
          </a>
        ))}
      </div>
      {items && items.length > visible.length && (
        <div className="flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/10"
          >
            Tải thêm
          </button>
        </div>
      )}
    </div>
  );
}
