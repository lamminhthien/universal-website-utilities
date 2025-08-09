"use client";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";

type AudioCtx = {
  playHover: () => void;
};

const HoverAudioContext = createContext<AudioCtx>({ playHover: () => {} });

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload a subtle hover sound (data URI to avoid extra asset for now)
    const audio = new Audio(
      "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQAAASW4AAD/////////////////////////////////////////////8AAAAA"
    );
    audio.volume = 0.15;
    audioRef.current = audio;
    // Enable dark theme variables on first client paint
    document.documentElement.classList.add("dark");
  }, []);

  const ctx = useMemo<AudioCtx>(() => ({
    playHover: () => {
      const a = audioRef.current;
      if (!a) return;
      try {
        a.currentTime = 0;
        a.play().catch(() => {});
      } catch {}
    },
  }), []);

  return <HoverAudioContext.Provider value={ctx}>{children}</HoverAudioContext.Provider>;
}

export const useHoverAudio = () => useContext(HoverAudioContext);
