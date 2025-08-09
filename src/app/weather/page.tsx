import Card from "../components/Card";
import WeatherNews from "./weatherNews";

type Forecast = { time: string[]; temperature_2m: number[] };

async function geocode(city: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
  const res = await fetch(url, { next: { revalidate: 86400 }, headers: { "User-Agent": "universal-website-utilities/1.0" } });
  const data = await res.json();
  const top = data?.[0];
  return top ? { lat: parseFloat(top.lat), lon: parseFloat(top.lon) } : { lat: 21.0278, lon: 105.8342 };
}

async function getWeather(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&current=temperature_2m&timezone=auto`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}

export default async function WeatherPage({ searchParams }: { searchParams?: Promise<{ city?: string }> }) {
  const sp = searchParams ? await searchParams : undefined;
  const city = sp?.city || "Hanoi";
  const { lat, lon } = await geocode(city);
  const data = await getWeather(lat, lon);
  const current = data.current?.temperature_2m;
  const hourly: Forecast = data.hourly || { time: [], temperature_2m: [] };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Weather Forecast</h1>
      <form className="flex gap-2" action="/weather" method="get">
        <input name="city" defaultValue={city} placeholder="Enter city (e.g., Ho Chi Minh City)" className="px-3 py-2 rounded-md bg-white/10 border border-black/50 w-64" />
        <button className="neon-chip px-4 py-2 rounded-md" type="submit">Search</button>
      </form>

      <Card>
        <div className="text-sm text-black/70">City</div>
        <div className="text-xl font-semibold mb-2">{city}</div>
        <div className="text-sm text-black/70">Current temperature</div>
        <div className="text-3xl font-bold drop-shadow-md">{current ?? "-"}°C</div>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hourly.time.slice(0, 12).map((t, i) => (
          <Card key={t}>
            <div className="text-sm text-black/60">{new Date(t).toLocaleString()}</div>
            <div className="text-2xl font-semibold">{hourly.temperature_2m[i]}°C</div>
          </Card>
        ))}
      </div>

  <WeatherNews />
    </div>
  );
}
