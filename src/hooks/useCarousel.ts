import { useCallback, useRef, useState } from 'react';
import { EffectCardsHandle } from '@/components/carousel/EffectCards';
import { BaseCarouselHandle } from '@/components/carousel/types';

/**
 * 自定义 hook，用于更方便地控制轮播组件
 *
 * @returns 轮播控制对象
 *
 * @example
 * ```tsx
 * const { carouselRef, next, prev } = useCarousel();
 *
 * return (
 *   <>
 *     <Carousel ref={carouselRef}>
 *       {slides.map(slide => <div key={slide.id}>{slide.content}</div>)}
 *     </Carousel>
 *     <button onClick={prev}>上一页</button>
 *     <button onClick={next}>下一页</button>
 *   </>
 * );
 * ```
 */
export function useCarousel<T extends BaseCarouselHandle = BaseCarouselHandle>() {
  const carouselRef = useRef<T | EffectCardsHandle>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    carouselRef.current?.scrollNext();
  }, []);

  const prev = useCallback(() => {
    carouselRef.current?.scrollPrev();
  }, []);

  const goTo = useCallback((index: number) => {
    if (
      carouselRef.current &&
      'scrollTo' in carouselRef.current &&
      typeof (carouselRef.current as any).scrollTo === 'function'
    ) {
      (carouselRef.current as any).scrollTo(index);
    }
  }, []);

  const handleSelect = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return {
    carouselRef,
    next,
    prev,
    goTo,
    currentIndex,
    onSelect: handleSelect,
  };
}
