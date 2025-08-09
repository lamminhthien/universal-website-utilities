import Card from "../components/Card";
import { fetchAnimeTrending } from "@/lib/anime";
import SafeImage from "@/app/components/SafeImage";

export default async function AnimePage() {
  const items = await fetchAnimeTrending();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold drop-shadow-[0_0_8px_#00f0ff]">Anime (Trending)</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.length === 0 && <div className="text-white/70">No anime data right now.</div>}
        {items.map((m, i) => (
          <Card key={m.url + i}>
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
            <div className="font-semibold mt-2 line-clamp-2">
              <a href={m.url} target="_blank" rel="noopener noreferrer">{m.title}</a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
