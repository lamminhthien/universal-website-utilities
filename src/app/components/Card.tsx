import { ReactNode } from "react";

export default function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`neon-card rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur p-4 ${className}`}>
      {children}
    </div>
  );
}
