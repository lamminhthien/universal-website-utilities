import Card from "../components/Card";
import { searchYouTubeIds } from "@/lib/youtube";

export default async function CartoonsPage() {
  const queries = [
    "classic cartoons compilation",
    "Tom and Jerry classic full",
    "Looney Tunes classic compilation",
  ];
  const results = await Promise.all(queries.map((q) => searchYouTubeIds(q, 4)));
  const flat = results.flat();
  const seen = new Set<string>();
  const videos = flat.filter((v) => (seen.has(v.id) ? false : (seen.add(v.id), true))).slice(0, 8);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold drop-shadow-[0_0_8px_#00ffa3]">Retro/Nostalgic Cartoons</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {videos.length === 0 && <div className="text-white/70">No videos found right now.</div>}
        {videos.map((v) => (
          <Card key={v.id}>
            <div className="aspect-video w-full rounded-md overflow-hidden">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="font-semibold mt-2">{v.title}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
