import { NextRequest, NextResponse } from "next/server";
import { fetchTravelArticles } from "@/lib/travel";

export const revalidate = 1800;

export async function GET(req: NextRequest) {
  const pageParam = new URL(req.url).searchParams.get("page");
  const page = Math.max(1, Number(pageParam || 1));
  const pageSize = 18;
  try {
    const all = await fetchTravelArticles();
    // Vietnamese-first: Prefer Vietnamese titles if available by simple heuristics
    const vi = all.filter((x) => /[ăâđêôơưà-ỹ]/i.test(x.title));
    const list = vi.length >= pageSize ? vi : all;
    const start = (page - 1) * pageSize;
    const slice = list.slice(start, start + pageSize);
    const hasNextPage = start + pageSize < list.length;
    return NextResponse.json({ items: slice, page, hasNextPage });
  } catch {
    return NextResponse.json({ items: [], page, hasNextPage: false }, { status: 200 });
  }
}
