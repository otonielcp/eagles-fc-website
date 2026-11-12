'use client';

import { useCallback, type ImgHTMLAttributes } from 'react';
import { applyImgFallback, CREST_FALLBACK } from './landingUtils';

type SafeImgProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Image to show if `src` fails; `null` hides the image instead. */
  fallbackSrc?: string | null;
};

/**
 * Plain <img> for database-sourced logos/thumbnails that may 404. Falls back
 * once to `fallbackSrc` (the club crest by default) and hides itself if that
 * fails too. Usable from server components.
 */
export default function SafeImg({ fallbackSrc = CREST_FALLBACK, onError, src, alt = '', ...props }: SafeImgProps) {
  // A server-rendered image can fail before hydration attaches onError.
  // naturalWidth === 0 alone is not proof of failure (an SVG without intrinsic
  // size reports 0 too), so re-request it and fall back only on a real error.
  const checkAlreadyFailed = useCallback(
    (img: HTMLImageElement | null) => {
      if (img && img.getAttribute('src') && img.complete && img.naturalWidth === 0) {
        const probe = new Image();
        probe.onerror = () => applyImgFallback(img, fallbackSrc);
        probe.src = img.currentSrc || img.src;
      }
    },
    [fallbackSrc]
  );

  if (!src) {
    if (!fallbackSrc) return null;
    const style = fallbackSrc === CREST_FALLBACK ? { ...props.style, objectFit: 'contain' as const } : props.style;
    return <img {...props} style={style} src={fallbackSrc} alt={alt} />;
  }

  return (
    <img
      // New src → new element, so a previous failure's fallback/hidden state is reset.
      key={String(src)}
      {...props}
      src={src}
      alt={alt}
      ref={checkAlreadyFailed}
      onError={(e) => {
        applyImgFallback(e.currentTarget, fallbackSrc);
        onError?.(e);
      }}
    />
  );
}
