export type DzPlaylist = { id: string; title: string };

export async function searchDeezerPlaylists(
  query: string,
  limit = 5
): Promise<DzPlaylist[]> {
  const url = `https://api.deezer.com/search/playlist?q=${encodeURIComponent(
    query
  )}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = (await res.json()) as {
    data: Array<{ id: number; title: string }>;
  };
  return json.data.map((p) => ({
    id: p.id.toString(),
    title: p.title,
  }));
}