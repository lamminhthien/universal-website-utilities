import Card from "../components/Card";

const PLAYLISTS = [
  { title: "90s Eurodance Classics", id: "PL2qWn8yaf9I2GfpFh2o5sO3V5OAiC9Z04" },
  { title: "90s Rock Anthems", id: "PLHdKL16-bG1mHpUMwKExnrGHF7H8x7V7q" },
  { title: "90s Pop Hits", id: "PLZxZlGl8rG3B0B2C5wUQxR0x2oQv1oVbq" },
];

export default function RetroMusicPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold drop-shadow-[0_0_8px_#8a2be2]">Retro 90s Music</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {PLAYLISTS.map((p) => (
          <Card key={p.id}>
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
