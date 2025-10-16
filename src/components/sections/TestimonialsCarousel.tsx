'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { cn } from '@utils/cn';

interface Testimonial {
  content: string;
  name: string;
  role: string;
  image: string;
}

interface TestimonialsCarouselProps {
  items: readonly Testimonial[];
  autoplayDelay?: number;
}

type CarouselConfig = {
  width: number;
  visible: number;
  gap: number;
};

const easingClass =
  'transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]';

const getResponsiveConfig = (width: number): Omit<CarouselConfig, 'width'> => {
  if (width < 640) {
    return { visible: 1, gap: 16 };
  }

  if (width < 1024) {
    return { visible: 2, gap: 20 };
  }

  return { visible: 3, gap: 24 };
};

export const TestimonialsCarousel = ({
  items,
  autoplayDelay = 5000
}: TestimonialsCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<CarouselConfig>({
    width: 0,
    ...getResponsiveConfig(1280)
  });
  const [current, setCurrent] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const updateConfig = useCallback((width: number) => {
    setConfig((prev) => {
      const next = getResponsiveConfig(width);
      if (
        prev.width === width &&
        prev.visible === next.visible &&
        prev.gap === next.gap
      ) {
        return prev;
      }

      return {
        width,
        ...next
      };
    });
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') {
      return;
    }

    const element = containerRef.current;
    updateConfig(element.getBoundingClientRect().width);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        updateConfig(entry.contentRect.width);
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateConfig]);

  const duplicatesCount = useMemo(() => {
    if (items.length <= config.visible) {
      return 0;
    }
    return Math.min(config.visible, items.length);
  }, [config.visible, items.length]);

  const slides = useMemo(() => {
    if (!items.length) {
      return [];
    }

    if (duplicatesCount === 0) {
      return [...items];
    }

    return [...items, ...items.slice(0, duplicatesCount)];
  }, [items, duplicatesCount]);

  const slideWidth =
    config.width && config.visible
      ? (config.width - config.gap * (config.visible - 1)) / config.visible
      : 0;

  const shouldAnimate = duplicatesCount > 0 && slideWidth > 0;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    setCurrent(0);
  }, [config.visible]);

  useEffect(() => {
    if (!shouldAnimate || isHovered || prefersReducedMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, autoplayDelay);

    return () => window.clearInterval(interval);
  }, [shouldAnimate, autoplayDelay, isHovered, prefersReducedMotion]);

  const handleTransitionEnd = () => {
    if (!shouldAnimate) {
      return;
    }

    if (current >= items.length) {
      setTransitionEnabled(false);
      setCurrent(0);
    }
  };

  useEffect(() => {
    if (!transitionEnabled) {
      const id = window.requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
      return () => window.cancelAnimationFrame(id);
    }
    return undefined;
  }, [transitionEnabled]);

  const offset = -(slideWidth + config.gap) * current;

  return (
    <div
      ref={containerRef}
      className="group/carousel relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          'flex select-none',
          transitionEnabled && shouldAnimate && easingClass
        )}
        style={{
          transform: `translate3d(${offset}px, 0, 0)`,
          gap: `${config.gap}px`
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((item, index) => (
          <article
            key={`${item.name}-${index}`}
            className="relative flex h-full flex-col gap-6 rounded-[32px] border border-white/70 bg-white/95 p-8 text-left shadow-[0_28px_70px_-42px_rgba(102,42,231,0.55)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_36px_90px_-40px_rgba(102,42,231,0.45)]"
            style={{
              width: `${slideWidth}px`,
              minWidth: `${slideWidth}px`
            }}
          >
            <span
              className="pointer-events-none absolute -left-10 top-1/2 hidden h-40 w-40 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl md:block"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={`Foto de ${item.name}`}
                  width={64}
                  height={64}
                  loading="lazy"
                  className="h-16 w-16 rounded-full border-2 border-white/80 object-cover shadow-[0_12px_24px_-12px_rgba(102,42,231,0.5)]"
                />
                <svg
                  className="h-7 w-7 text-primary"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12.5 14.5C12.5 19.7 8.70005 23.5 3.50005 23.5H3.00005C2.20005 23.5 1.50005 22.8 1.50005 22V21C1.50005 20.2 2.20005 19.5 3.00005 19.5H3.50005C5.70005 19.5 7.50005 17.7 7.50005 15.5V7C7.50005 6.2 8.20005 5.5 9.00005 5.5H11.0001C11.8001 5.5 12.5001 6.2 12.5001 7V14.5H12.5ZM30.5 14.5C30.5 19.7 26.7 23.5 21.5 23.5H21C20.2 23.5 19.5 22.8 19.5 22V21C19.5 20.2 20.2 19.5 21 19.5H21.5C23.7 19.5 25.5 17.7 25.5 15.5V7C25.5 6.2 26.2 5.5 27 5.5H29C29.8 5.5 30.5 6.2 30.5 7V14.5Z" />
                </svg>
              </div>
              <p className="text-neutral-600">
                “{item.content}”
              </p>
            </div>
            <div className="mt-auto border-t border-neutral-100/60 pt-4">
              <p className="font-semibold text-neutral-900">{item.name}</p>
              <p className="text-sm text-neutral-500">{item.role}</p>
            </div>
            <span
              className="pointer-events-none absolute inset-x-6 bottom-0 h-16 rounded-[32px] bg-gradient-to-t from-primary/10 via-transparent to-transparent blur-2xl"
              aria-hidden="true"
            />
          </article>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-6 left-0 w-16 bg-gradient-to-r from-white via-white/70 to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-y-6 right-0 w-16 bg-gradient-to-l from-white via-white/70 to-transparent" aria-hidden="true" />
    </div>
  );
};

export default TestimonialsCarousel;
