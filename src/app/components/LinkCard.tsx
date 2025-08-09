"use client";
import Link from "next/link";
import Card from "./Card";
import { useHoverAudio } from "./ClientProviders";

export default function LinkCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  const { playHover } = useHoverAudio();
  return (
    <Link href={href} onMouseEnter={playHover} className="block focus:outline-none">
      <Card className="h-full wiggle">
        <h3 className="text-lg font-semibold mb-1 drop-shadow-[0_0_6px_#00f0ff]">{title}</h3>
        <p className="text-sm text-black/70">{desc}</p>
      </Card>
    </Link>
  );
}
