"use client";
import Image, { ImageProps } from "next/image";
import { useMemo, useState } from "react";

type Props = Omit<ImageProps, "src" | "onError"> & {
  src: string;
  fallbackSrc: string;
};

export default function SafeImage({ src, fallbackSrc, alt, className, ...rest }: Props) {
  const [srcUrl, setSrcUrl] = useState(src);
  const unoptimized = useMemo(() => !srcUrl.includes("images.unsplash.com"), [srcUrl]);

  return (
    <Image
      {...rest}
      src={srcUrl}
      alt={alt}
      className={className}
      unoptimized={unoptimized}
      onError={() => {
        if (srcUrl !== fallbackSrc) setSrcUrl(fallbackSrc);
      }}
    />
  );
}
