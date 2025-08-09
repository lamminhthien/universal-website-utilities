import Card from "../components/Card";

const VIDEOS = [
  { title: "Tom and Jerry Classic", id: "I2Z8n3QxImQ" },
  { title: "Looney Tunes Compilation", id: "YVZPyb2o8Vw" },
  { title: "Donald Duck Classic", id: "lHP2x6gFrXo" },
];

export default function CartoonsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold drop-shadow-[0_0_8px_#00ffa3]">Retro/Nostalgic Cartoons</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {VIDEOS.map((v) => (
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
