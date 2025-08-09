import Image from "next/image";
import Card from "../components/Card";

// We'll use the Unsplash Source endpoint that doesn't require API keys for demo purposes.
// Note: For production use, consider applying for an API key and proper attribution.
const DESTS = [
  { q: "bali+rice+terraces", name: "Bali, Indonesia" },
  { q: "santorini+greece+sunset", name: "Santorini, Greece" },
  { q: "banff+national+park+lake", name: "Banff, Canada" },
  { q: "kyoto+bamboo+forest", name: "Kyoto, Japan" },
  { q: "ha+long+bay+vietnam", name: "Ha Long Bay, Vietnam" },
  { q: "sahara+desert+dunes", name: "Sahara Desert" },
  { q: "iceland+waterfall", name: "Iceland Waterfalls" },
  { q: "patagonia+mountains+lake", name: "Patagonia" },
  { q: "new+zealand+milford+sound", name: "Milford Sound, NZ" },
];

export default async function TravelPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold drop-shadow-[0_0_8px_#ff00d4]">World Travel Scenery</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DESTS.map((d, i) => (
          <Card key={i}>
            <div className="relative w-full h-56 mb-3 overflow-hidden rounded-md">
              <Image
                src={`https://source.unsplash.com/800x600/?${d.q}`}
                alt={d.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
                priority={i < 3}
              />
            </div>
            <div className="font-semibold">{d.name}</div>
            <p className="text-sm text-white/70 mt-1">
              A breathtaking scene from {d.name}. Expect vibrant colors, dramatic landscapes, and
              a perfect wallpaper for your travel inspirations.
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
