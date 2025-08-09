import Card from "../components/Card";

const EMBEDS = [
  { title: "Anime Music Mix", src: "https://www.youtube-nocookie.com/embed/2O6fNTdkb8c" },
  { title: "Demon Slayer Trailer", src: "https://www.youtube-nocookie.com/embed/VQGCKyvzIM4" },
  { title: "Jujutsu Kaisen Trailer", src: "https://www.youtube-nocookie.com/embed/fE6zFZzKSVY" },
  { title: "One Piece Clip", src: "https://www.youtube-nocookie.com/embed/6m7HFrFG8Ww" },
];

export default function AnimePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold drop-shadow-[0_0_8px_#00f0ff]">Anime (Ad-Lite)</h1>
      <p className="text-white/70">Curated trailers and mixes. You can paste direct stream or iframe sources as needed.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {EMBEDS.map((v, i) => (
          <Card key={i}>
            <div className="aspect-video w-full rounded-md overflow-hidden">
              <iframe
                className="w-full h-full"
                src={v.src}
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
