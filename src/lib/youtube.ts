export type YtVideo = {
  id: string; // videoId
  title: string;
};

// Uses YouTube's oEmbed search via no-cors JSONP fallback not available here, so we will use
// a very lightweight search endpoint powered by DuckDuckGo's HTML as a pragmatic approach.
// Note: This is heuristic and best-effort to avoid requiring API keys.
export async function searchYouTubeIds(query: string, limit = 6): Promise<YtVideo[]> {
  try {
    const url = `https://duckduckgo.com/?q=${encodeURIComponent(query + " site:youtube.com/watch")}`;
    const res = await fetch(url, { headers: { "User-Agent": "universal-website-utilities/1.0" }, next: { revalidate: 3600 } });
    const html = await res.text();
    const regex = /https?:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,})/g;
    const matches = Array.from(html.matchAll(regex)) as RegExpMatchArray[];
    const seen = new Set<string>();
    const ids: string[] = [];
    for (const m of matches) {
      const vid = m[1];
      if (!vid) continue;
      if (seen.has(vid)) continue;
      seen.add(vid);
      ids.push(vid);
      if (ids.length >= limit) break;
    }
    return ids.map((id) => ({ id, title: `YouTube Video ${id}` }));
  } catch {
    return [];
  }
}

export type YtPlaylist = { id: string; title: string };

export async function searchYouTubePlaylists(query: string, limit = 5): Promise<YtPlaylist[]> {
  try {
    const url = `https://duckduckgo.com/?q=${encodeURIComponent(query + " site:youtube.com/playlist")}`;
    const res = await fetch(url, { headers: { "User-Agent": "universal-website-utilities/1.0" }, next: { revalidate: 3600 } });
    const html = await res.text();
    const regex = /https?:\/\/www\.youtube\.com\/playlist\?list=([A-Za-z0-9_-]{10,})/g;
    const matches = Array.from(html.matchAll(regex)) as RegExpMatchArray[];
    const seen = new Set<string>();
    const ids: string[] = [];
    for (const m of matches) {
      const pid = m[1];
      if (!pid) continue;
      if (seen.has(pid)) continue;
      seen.add(pid);
      ids.push(pid);
      if (ids.length >= limit) break;
    }
    return ids.map((id) => ({ id, title: `Playlist: ${query}` }));
  } catch {
    return [];
  }
}
