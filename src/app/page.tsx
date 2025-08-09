import LinkCard from "./components/LinkCard";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold drop-shadow-[0_0_12px_#00f0ff]">Universal Website Utilities</h1>
      <p className="text-white/70">A colorful hub of mini tools. Dark by default with neon glow and playful interactions.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <LinkCard href="/news" title="Vietnamese News" desc="Latest news aggregated from public sources." />
        <LinkCard href="/weather" title="Weather Forecast" desc="Search a city and view the forecast." />
        <LinkCard href="/travel" title="Travel Scenery" desc="Gorgeous wallpapers of top destinations." />
        <LinkCard href="/anime" title="Anime (Ad-Lite)" desc="Watch trailers and curated embeds without clutter." />
        <LinkCard href="/retro-music" title="Retro 90s Music" desc="Listen to nostalgic hits via safe embeds." />
        <LinkCard href="/cartoons" title="Classic Cartoons" desc="Enjoy old-school cartoons and compilations." />
      </div>
    </div>
  );
}
