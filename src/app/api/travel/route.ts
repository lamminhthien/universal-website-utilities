import { NextResponse } from "next/server";
import { fetchTravelArticles } from "@/lib/travel";

export const revalidate = 3600;

export async function GET() {
  try {
    const items = await fetchTravelArticles();
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
