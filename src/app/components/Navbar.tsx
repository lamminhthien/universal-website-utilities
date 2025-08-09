"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHoverAudio } from "./ClientProviders";

const links = [
  { href: "/news", label: "News" },
  { href: "/weather", label: "Weather" },
  { href: "/travel", label: "Travel" },
  { href: "/anime", label: "Anime" },
  { href: "/retro-music", label: "Retro Music" },
  { href: "/cartoons", label: "Cartoons" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { playHover } = useHoverAudio();

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/30 border-b border-white/10">
      <div className="container mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="font-semibold tracking-wide text-black drop-shadow-md">
          Universal Website Utilities
        </Link>
        <nav className="ml-auto flex items-center gap-3 overflow-x-auto">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={playHover}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${active ? "active" : ""}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
