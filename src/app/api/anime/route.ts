import { NextRequest, NextResponse } from "next/server";
import { fetchAnime } from "@/lib/anime";

export const revalidate = 1800;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const perPage = Math.min(24, Number(searchParams.get("perPage") || 12));
  try {
    const { items, hasNextPage } = await fetchAnime(page, perPage);
    return NextResponse.json({ items, hasNextPage, page, perPage });
  } catch {
    return NextResponse.json({ items: [], hasNextPage: false, page, perPage }, { status: 200 });
  }
}
