import Card from "../components/Card";
import { fetchRetroPlaylists } from "@/lib/music";

export default async function RetroMusicPage() {
  const lists = await fetchRetroPlaylists();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold drop-shadow-md">Retro 90s Music</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {lists.length === 0 && (
          <div className="text-black/70">No playlists found right now.</div>
        )}
        {lists.map((p, i) => (
          <Card key={p.id + i}>
            <div className="w-full rounded-md overflow-hidden">
              <iframe
                className="w-full"
                // Deezer widget: dark theme, playlist p.id
                src={`https://widget.deezer.com/widget/dark/playlist/${p.id}`}
                title={p.title}
                width="100%"
                height="300"
                frameBorder="0"
                allowTransparency={true}
                allow="encrypted-media; clipboard-write"
              />
            </div>
            <div className="font-semibold mt-2">{p.title}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
