import {
  searchDeezerPlaylists,
  type DzPlaylist,
} from "./deezer";

export type MusicPlaylist = DzPlaylist;

export async function fetchRetroPlaylists(): Promise<MusicPlaylist[]> {
  const queries = [
    "wedding music",
    "90s pop hits",
  ];
  const results = await Promise.all(
    queries.map((q) => searchDeezerPlaylists(q, 6))
  );
  const flat = results.flat();
  const seen = new Set<string>();
  const unique = flat.filter((p) =>
    seen.has(p.id) ? false : (seen.add(p.id), true)
  );
  return unique.slice(0, 6);
}
