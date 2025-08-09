import { fetchAnime } from "@/lib/anime";
import AnimeClient from "./AnimeClient";

export default async function AnimePage() {
  const { items, hasNextPage } = await fetchAnime(1, 12);
  const initial = { items, hasNextPage, page: 1, perPage: 12 };
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Anime (Trending)</h1>
      <AnimeClient initial={initial} />
    </div>
  );
}
