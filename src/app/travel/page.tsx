import Image from "next/image";
import Card from "../components/Card";
import { fetchTravelArticles } from "@/lib/travel";
import type { TravelItem } from "@/lib/travel";

async function getTravel(): Promise<TravelItem[]> {
  try {
    // Call the crawler directly on the server for best performance
    return await fetchTravelArticles();
  } catch {
    return [];
  }
}

export default async function TravelPage() {
  const items = await getTravel();
  const fallback = (q: string) => `https://source.unsplash.com/800x600/?${encodeURIComponent(q)}`;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold drop-shadow-[0_0_8px_#ff00d4]">Travel Highlights</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && (
          <Card>
            <div className="text-white/80">No travel articles available right now. Please try again later.</div>
          </Card>
        )}
        {items.map((it, i) => {
          const img = it.thumbnail || fallback(it.title || "travel destination");
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
    </div>
  );
}
