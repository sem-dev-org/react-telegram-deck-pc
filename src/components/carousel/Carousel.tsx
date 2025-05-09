import clsx from 'clsx';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { ExtendedCarouselHandle } from './types';

export interface CarouselHandle extends ExtendedCarouselHandle {
  // 可以在这里添加 Carousel 特有的方法
}

export interface CarouselProps {
  /** 轮播内容 */
  children: ReactNode;
  /** 是否自动播放 */
  autoplay?: boolean;
  /** 自动播放间隔（毫秒） */
  autoplayInterval?: number;
  /** 是否显示导航按钮 */
  showNavigation?: boolean;
  /** 是否显示指示器 */
  showDots?: boolean;
  /** 轮播配置项 */
  options?: any;
  /** 自定义类名 */
  className?: string;
  onChange?: (index: number) => void;
}

export const Carousel = forwardRef<CarouselHandle, CarouselProps>(
  (
    {
      children,
      autoplay = true,
      autoplayInterval = 5000,
      showNavigation = false,
      showDots = false,
      options,
      className,
      onChange,
    },
    ref,
  ) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
      {
        loop: true,
        ...options,
        align: 'start',
      },
      autoplay
        ? [Autoplay({ delay: autoplayInterval, stopOnInteraction: false })]
        : [],
    );

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => {
      if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
      (index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
      },
      [emblaApi],
    );

    const onSelect = useCallback(() => {
      if (!emblaApi) return;
      setSelectedIndex(emblaApi.selectedScrollSnap());
      onChange?.(emblaApi.selectedScrollSnap());
    }, [emblaApi, onChange]);

    useEffect(() => {
      if (!emblaApi) return;

      onSelect();
      setScrollSnaps(emblaApi.scrollSnapList());
      emblaApi.on('select', onSelect);

      return () => {
        emblaApi.off('select', onSelect);
      };
    }, [emblaApi, onSelect]);

    useImperativeHandle(ref, () => ({
      scrollNext,
      scrollPrev,
      scrollTo,
      getCurrentIndex: () => selectedIndex,
      emblaApi,
    }));

    return (
      <div className={clsx('relative', className)}>
        <div className="overflow-hidden" ref={emblaRef}>
          {children}
        </div>

        {showNavigation && (
          <>
            <button
              className="btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100 absolute top-1/2 left-2 -translate-y-1/2"
              onClick={scrollPrev}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              className="btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100 absolute top-1/2 right-2 -translate-y-1/2"
              onClick={scrollNext}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </>
        )}

        {showDots && scrollSnaps.length > 0 && (
          <div className="mt-3 flex justify-center gap-1">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={clsx(
                  'h-2 w-2 rounded-full transition-all duration-300',
                  index === selectedIndex
                    ? 'bg-primary w-4'
                    : 'bg-base-content/20 hover:bg-base-content/40',
                )}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);
