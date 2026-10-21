import { useEffect, useRef } from 'react';

import { useCarousel } from '@/components/ui';
import type { MediaCardProps } from '@/features/patient-auth/types';
import { cn } from '@/lib/utils';

/**
 * Video counterpart to `TestimonialCard`/`GdprCard` for onboarding/GDPR steps whose `media`
 * field is a direct video URL instead of icon/title/paragraphs content. Plays with sound (no
 * `muted`) but only for the slide currently in view: `index` is compared against the parent
 * `Carousel`'s `selectedIndex` (read via `useCarousel`, which resolves through the surrounding
 * `<Carousel>` context regardless of where this component sits lexically) so a slide that
 * scrolls out of focus is paused rather than continuing to play/make sound in the background.
 */
function MediaCard({ src, index, className }: MediaCardProps) {
  const { selectedIndex } = useCarousel();
  const isActive = index === selectedIndex;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      const playPromise = video.play();
      if (playPromise) playPromise.catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive]);

  return (
    <video
      key={src}
      ref={videoRef}
      className={cn('rounded-2xl bg-black object-cover', className)}
      src={src}
      loop
      playsInline
    />
  );
}

export { MediaCard };
