export type AnimeItem = {
  title: string;
  url: string; // AniList URL
  trailerId?: string; // YouTube ID
  trailerSite?: string;
  coverImage?: string;
  updatedAt?: number;
};

const ANILIST_URL = "https://graphql.anilist.co";

const query = `
  query ($page: Int = 1, $perPage: Int = 24) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { hasNextPage }
      media(
        type: ANIME
        sort: UPDATED_AT_DESC
        isAdult: false
      ) {
        id
        siteUrl
        updatedAt
        title { romaji english native }
        trailer { id site thumbnail }
        coverImage { large extraLarge }
      }
    }
  }
`;

type AniMedia = {
  siteUrl?: string;
  title?: { romaji?: string; english?: string; native?: string };
  trailer?: { id?: string; site?: string; thumbnail?: string };
  coverImage?: { large?: string; extraLarge?: string };
  updatedAt?: number;
};

export async function fetchAnime(page = 1, perPage = 12): Promise<{ items: AnimeItem[]; hasNextPage: boolean }> {
  try {
    const res = await fetch(ANILIST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ query, variables: { page, perPage } }),
      next: { revalidate: 1800 },
    });
  const json = await res.json();
    const info = json?.data?.Page?.pageInfo as { hasNextPage?: boolean } | undefined;
    const list = (json?.data?.Page?.media ?? []) as AniMedia[];
    const items = list.map((m: AniMedia) => {
      const title = m?.title?.english || m?.title?.romaji || m?.title?.native || "Untitled";
      return {
        title,
        url: m?.siteUrl as string,
        trailerId: m?.trailer?.id as string | undefined,
        trailerSite: m?.trailer?.site as string | undefined,
        coverImage: m?.coverImage?.extraLarge || m?.coverImage?.large,
        updatedAt: m?.updatedAt,
      } as AnimeItem;
    });
    // Ensure latest on top regardless
    items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    return { items, hasNextPage: !!info?.hasNextPage };
  } catch {
    return { items: [], hasNextPage: false };
  }
}
