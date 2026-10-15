import * as React from 'react';

import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';

import { Button } from '@/components/ui/button';
import { ArrowBackIcon, ArrowForwardIcon } from '@/icons';
import { cn } from '@/lib/utils';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  selectedIndex: number;
  scrollSnaps: number[];
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }
  return context;
}

type CarouselSnapshot = {
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  scrollSnaps: number[];
};

const emptySnapshot: CarouselSnapshot = {
  canScrollPrev: false,
  canScrollNext: false,
  selectedIndex: 0,
  scrollSnaps: [],
};

function useCarouselSnapshot(api: CarouselApi) {
  const snapshotRef = React.useRef(emptySnapshot);

  const subscribe = React.useCallback(
    (callback: () => void) => {
      if (!api) return () => {};
      api.on('select', callback);
      api.on('reInit', callback);
      return () => {
        api.off('select', callback);
        api.off('reInit', callback);
      };
    },
    [api]
  );

  const getSnapshot = React.useCallback(() => {
    if (!api) return snapshotRef.current;
    const prev = snapshotRef.current;
    const nextScrollSnaps = api.scrollSnapList();
    const next: CarouselSnapshot = {
      canScrollPrev: api.canScrollPrev(),
      canScrollNext: api.canScrollNext(),
      selectedIndex: api.selectedScrollSnap(),
      scrollSnaps: nextScrollSnaps,
    };
    const sameSnaps =
      prev.scrollSnaps.length === next.scrollSnaps.length &&
      prev.scrollSnaps.every((value, index) => value === next.scrollSnaps[index]);
    if (
      prev.canScrollPrev === next.canScrollPrev &&
      prev.canScrollNext === next.canScrollNext &&
      prev.selectedIndex === next.selectedIndex &&
      sameSnaps
    ) {
      return prev;
    }
    snapshotRef.current = next;
    return next;
  }, [api]);

  return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

function Carousel({
  opts,
  plugins,
  setApi,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(opts, plugins);
  const { canScrollPrev, canScrollNext, selectedIndex, scrollSnaps } = useCarouselSnapshot(api);

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);
  const scrollTo = React.useCallback((index: number) => api?.scrollTo(index), [api]);

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        scrollPrev,
        scrollNext,
        scrollTo,
        selectedIndex,
        scrollSnaps,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        className={cn('relative', className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { carouselRef } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div className={cn('flex', className)} {...props} />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn('min-w-0 shrink-0 grow-0 basis-full', className)}
      {...props}
    />
  );
}

function CarouselPrevious({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      variant="neutral"
      size="icon-pill"
      className={className}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Précédent"
      {...props}
    >
      <ArrowBackIcon className="size-4" />
    </Button>
  );
}

function CarouselNext({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      variant="neutral"
      size="icon-pill"
      className={className}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Suivant"
      {...props}
    >
      <ArrowForwardIcon className="size-4" />
    </Button>
  );
}

function CarouselDots({ className }: React.ComponentProps<'div'>) {
  const { scrollSnaps, selectedIndex, scrollTo } = useCarousel();
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Aller à la diapositive ${index + 1}`}
          onClick={() => scrollTo(index)}
          className={cn(
            'h-2 rounded-full transition-all',
            index === selectedIndex ? 'bg-pagination-activated w-10' : 'bg-pagination-enabled w-2'
          )}
        />
      ))}
    </div>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  useCarousel,
  type CarouselApi,
};
