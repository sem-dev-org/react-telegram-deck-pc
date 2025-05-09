import {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
} from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { BaseCarouselHandle } from './types';

const TWEEN_FACTOR_BASE = 0.2;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

type Props = {
  options?: EmblaOptionsType;
  children: ReactNode;
  onChange?: (index: number) => void;
};

export interface EffectCardsHandle extends BaseCarouselHandle {
  getCurrentIndex: () => number;
  scrollToRandom: () => void;
}

export const EffectCards = forwardRef<EffectCardsHandle, Props>(
  ({ options, children, onChange }, ref) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
      loop: true,
      ...options,
      align: 'center',
      startIndex: 3,
      dragThreshold: 0.1,
      dragFree: false,
      skipSnaps: true,
      containScroll: 'trimSnaps',
      slidesToScroll: 1
    });
    const tweenFactor = useRef(0);
    const tweenNodes = useRef<HTMLElement[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
      tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
        const element = slideNode.querySelector(
          '.scale-carousel__item',
        ) as HTMLElement | null;
        return element || (slideNode as HTMLElement); // 如果没有找到.scale-carousel__item，使用slideNode
      });
    }, []);

    const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
      tweenFactor.current =
        TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
    }, []);

    const tweenScale = useCallback(
      (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
        const engine = emblaApi.internalEngine();
        const scrollProgress = emblaApi.scrollProgress();
        const slidesInView = emblaApi.slidesInView();
        const isScrollEvent = eventName === 'scroll';
        
        // 获取实时位置，而不仅仅是选中的快照
        // 使用scrollProgress计算当前最接近中心的幻灯片
        const totalSlides = emblaApi.scrollSnapList().length;
        const currentProgressIndex = Math.round(scrollProgress * totalSlides) % totalSlides;
        const centralSlideIndex = currentProgressIndex >= 0 ? currentProgressIndex : totalSlides + currentProgressIndex;

        // 首先将所有幻灯片设为隐藏
        tweenNodes.current.forEach((node) => {
          if (node && node.style) {
            node.style.opacity = '0';
            node.style.pointerEvents = 'none';
            const container = node.parentElement;
            if (container && container.style) {
              container.style.zIndex = '0';
            }
          }
        });

        // 计算应该显示的幻灯片 - 以当前进度为中心的5张
        const visibleSlides: number[] = [];
        // 中心幻灯片
        visibleSlides.push(centralSlideIndex);
        // 左侧两张
        visibleSlides.push((centralSlideIndex - 2 + totalSlides) % totalSlides);
        visibleSlides.push((centralSlideIndex - 1 + totalSlides) % totalSlides);
        // 右侧两张
        visibleSlides.push((centralSlideIndex + 1) % totalSlides);
        visibleSlides.push((centralSlideIndex + 2) % totalSlides);
        
        // 添加额外的可见幻灯片，以确保拖动过程中总有足够的幻灯片可见
        visibleSlides.push((centralSlideIndex - 3 + totalSlides) % totalSlides);
        visibleSlides.push((centralSlideIndex + 3) % totalSlides);

        emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
          // 如果这个幻灯片索引不在我们的可见列表中，跳过处理
          if (!visibleSlides.includes(snapIndex)) return;

          let diffToTarget = scrollSnap - scrollProgress;
          const slidesInSnap = engine.slideRegistry[snapIndex];

          slidesInSnap.forEach((slideIndex) => {
            if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

            if (engine.options.loop) {
              engine.slideLooper.loopPoints.forEach((loopItem) => {
                const target = loopItem.target();

                if (slideIndex === loopItem.index && target !== 0) {
                  const sign = Math.sign(target);

                  if (sign === -1) {
                    diffToTarget = scrollSnap - (1 + scrollProgress);
                  }
                  if (sign === 1) {
                    diffToTarget = scrollSnap + (1 - scrollProgress);
                  }
                }
              });
            }

            const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
            const scale = numberWithinRange(tweenValue, 0.7, 1).toString();
            const tweenNode = tweenNodes.current[slideIndex];
            const tweenContainer = tweenNodes.current[slideIndex].parentElement;
            if (
              tweenNode &&
              tweenNode.style &&
              tweenContainer &&
              tweenContainer.style
            ) {
              // 确保这个幻灯片可见
              tweenNode.style.opacity = '1';
              tweenNode.style.pointerEvents = 'auto';
              
              const rotateAngle = diffToTarget * 40;
              const translateX = -diffToTarget * (1 - tweenValue) * 500;
              const translateY = -tweenValue * 60 + 70;
              
              tweenNode.style.transform = `translateX(${translateX}%) scale(${scale}) rotate(${rotateAngle}deg) translateY(${translateY}px)`;
              
              // 中心卡片Z-index最高
              const zIndex = Math.round(tweenValue * 100);
              tweenNode.style.zIndex = zIndex.toString();
              tweenContainer.style.zIndex = zIndex.toString();

              const image = tweenNode.querySelector(
                '.scale-carousel__image',
              ) as HTMLElement;
              if (tweenValue > 0.95) {
                image.style.filter =
                  'drop-shadow(0px 3px 6px color(display-p3 0.906 0.984 0.471 / 0.24))';
              } else {
                image.style.filter = 'none';
              }
            }
          });
        });
      },
      [],
    );

    const scrollPrev = useCallback(() => {
      if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollToRandom = useCallback(() => {
      if (!emblaApi) return;
      const totalSlides = emblaApi.slideNodes().length;
      if (totalSlides <= 1) return;
      
      // 生成当前索引以外的随机索引
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * totalSlides * 3);
      } while (randomIndex === selectedIndex && totalSlides > 1);
      
      // 使用动画滚动到随机位置
      const distance = randomIndex - selectedIndex;
      
      // 如果距离太远，可以使用多步滚动来创建动画效果
      if (Math.abs(distance) > 1) {
        // 创建一个滚动序列
        const steps = Math.min(Math.abs(distance), 30); // 最多3步
        const direction = distance > 0 ? 1 : -1;
        
        let currentStep = 0;
        const animateScroll = () => {
          if (currentStep < steps) {
            if (direction > 0) {
              emblaApi.scrollNext();
            } else {
              emblaApi.scrollPrev();
            }
            currentStep++;
            setTimeout(animateScroll, 100);
          }
        };
        
        animateScroll();
      } else {
        // 如果只需要滚动一步，直接滚动
        if (distance > 0) {
          emblaApi.scrollNext();
        } else if (distance < 0) {
          emblaApi.scrollPrev();
        }
      }
    }, [emblaApi, selectedIndex]);

    const onSelect = useCallback(() => {
      if (!emblaApi) return;
      const index = emblaApi.selectedScrollSnap();
      setSelectedIndex(index);
      onChange?.(index);
    }, [emblaApi, onChange]);

    useEffect(() => {
      if (!emblaApi) return;

      setTweenNodes(emblaApi);
      setTweenFactor(emblaApi);
      tweenScale(emblaApi);

      emblaApi
        .on('reInit', setTweenNodes)
        .on('reInit', setTweenFactor)
        .on('reInit', tweenScale)
        .on('scroll', tweenScale);

      onSelect();
      emblaApi.on('select', onSelect);

      return () => {
        emblaApi
          .off('reInit', setTweenNodes)
          .off('reInit', setTweenFactor)
          .off('reInit', tweenScale)
          .off('scroll', tweenScale);
        emblaApi.off('select', onSelect);
      };
    }, [emblaApi, setTweenNodes, setTweenFactor, tweenScale, onSelect]);

    useImperativeHandle(ref, () => ({
      scrollNext,
      scrollPrev,
      getCurrentIndex: () => selectedIndex,
      scrollToRandom,
    }));

    return (
      <div className="overflow-hidden -mx-3" ref={emblaRef}>
        <div className="flex touch-pan-y">{children}</div>
      </div>
    );
  },
);

EffectCards.displayName = 'EffectCards';
