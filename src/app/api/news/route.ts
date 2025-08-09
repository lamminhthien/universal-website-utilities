import { NextResponse } from "next/server";
import { fetchVietnamNews } from "@/lib/news";

export const revalidate = 300;

export async function GET() {
  try {
    const articles = await fetchVietnamNews();
    return NextResponse.json({ articles });
  } catch {
    return NextResponse.json({ articles: [] }, { status: 200 });
  }
}
