import { NextRequest, NextResponse } from "next/server";
import { fetchVietnamNews } from "@/lib/news";

export const revalidate = 300;

export async function GET(req: NextRequest) {
  try {
    const pageParam = new URL(req.url).searchParams.get("page");
    const page = Math.max(1, Number(pageParam || 1));
    const pageSize = 18;
    const all = await fetchVietnamNews();
    const start = (page - 1) * pageSize;
    const articles = all.slice(start, start + pageSize);
    return NextResponse.json({ articles });
  } catch {
    return NextResponse.json({ articles: [] }, { status: 200 });
  }
}
