import Card from "../components/Card";
import { fetchRetroPlaylists } from "@/lib/music";

export default async function RetroMusicPage() {
  const lists = await fetchRetroPlaylists();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold drop-shadow-[0_0_8px_#8a2be2]">Retro 90s Music</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {lists.length === 0 && <div className="text-white/70">No playlists found right now.</div>}
        {lists.map((p, i) => (
          <Card key={p.id + i}>
            <div className="aspect-video w-full rounded-md overflow-hidden">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/videoseries?list=${p.id}`}
                title={p.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="font-semibold mt-2">{p.title}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
