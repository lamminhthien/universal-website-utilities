import { searchYouTubePlaylists, type YtPlaylist } from "./youtube";

export type MusicPlaylist = YtPlaylist;

export async function fetchRetroPlaylists(): Promise<MusicPlaylist[]> {
  const queries = [
    "90s eurodance playlist",
    "90s rock anthems playlist",
    "90s pop hits playlist",
  ];
  const results = await Promise.all(queries.map((q) => searchYouTubePlaylists(q, 2)));
  const flat = results.flat();
  const seen = new Set<string>();
  const unique = flat.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
  return unique.slice(0, 6);
}
