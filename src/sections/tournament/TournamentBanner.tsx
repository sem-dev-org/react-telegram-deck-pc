import { Carousel } from '@/components/carousel';
import { FullBleedContainer } from '@/components/ui';
import { useCarousel } from '@/hooks';
import clsx from 'clsx';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type TournamentBannerProps = {
  banners: React.ReactNode[];
  onIndexChange?: (index: number) => void;
};

interface BannerWithProvider extends React.ReactElement {
  props: {
    providerId?: string;
    [key: string]: any;
  }
}

export const TournamentBanner = ({ banners, onIndexChange }: TournamentBannerProps) => {
  const { carouselRef, onSelect, currentIndex } = useCarousel();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const provider = searchParams.get('provider');


  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  useEffect(() => {
    if (carouselRef.current && provider) {

      // Find the index with matching provider_id
      let targetIndex = -1;
      banners.forEach((banner, index) => {
        if (banner && typeof banner === 'object' && 'props' in banner) {
          const typedBanner = banner as BannerWithProvider;
          const bannerId = typedBanner.props.obj?.provider_id;
          if (bannerId === provider ||
            bannerId === Number(provider) ||
            String(bannerId) === provider) {
            targetIndex = index;
          }
        }
      });

      // If a matching banner was found, scroll to it
      if (targetIndex >= 0) {
        // Direct call to scrollTo method on the carousel ref
        if (carouselRef.current && 'scrollTo' in carouselRef.current) {
          setTimeout(() => {
            (carouselRef.current as any).scrollTo(targetIndex);
          }, 200);
        }
      }
    }
  }, [provider, banners, carouselRef]);

  return (
    <FullBleedContainer>
      <div className="absolute top-37.5 z-10 flex h-full w-full justify-between px-1">
        <button
          className="btn btn-ghost btn-square btn-sm bg-transparent"
          onClick={() => carouselRef.current?.scrollPrev()}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.95341 3.66112C9.15438 3.87012 9.14786 4.20247 8.93886 4.40344L6.18243 7L8.93886 9.59656C9.14786 9.79753 9.15438 10.1299 8.95341 10.3389C8.75245 10.5479 8.4201 10.5544 8.21109 10.3534L5.06109 7.37844C4.95815 7.27946 4.89997 7.14281 4.89997 7C4.89997 6.85719 4.95815 6.72055 5.06109 6.62156L8.21109 3.64656C8.4201 3.4456 8.75245 3.45211 8.95341 3.66112Z"
              fill="#A6ADBB"
              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
            />
          </svg>
        </button>
        <button
          className="btn btn-ghost btn-square btn-sm bg-transparent"
          onClick={() => carouselRef.current?.scrollNext()}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.04647 10.3389C4.8455 10.1299 4.85202 9.79753 5.06102 9.59656L7.81745 7L5.06102 4.40344C4.85202 4.20247 4.8455 3.87012 5.04647 3.66112C5.24743 3.45211 5.57978 3.4456 5.78878 3.64656L8.93878 6.62156C9.04173 6.72054 9.0999 6.85719 9.0999 7C9.0999 7.14281 9.04173 7.27945 8.93878 7.37844L5.78878 10.3534C5.57978 10.5544 5.24743 10.5479 5.04647 10.3389Z"
              fill="#A6ADBB"
              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
            />
          </svg>
        </button>
      </div>
      <div className="absolute bottom-2 z-10 flex w-full justify-center gap-1">
        {banners.map((_, index) => (
          <button
            key={index}
            className={clsx('h-2 w-2 rounded-full', index === currentIndex ? 'bg-primary' : 'bg-secondary')}
            onClick={() => {
              if (carouselRef.current && 'scrollTo' in carouselRef.current) {
                (carouselRef.current as any).scrollTo(index);
              } else {
                console.error('Failed to scroll to index:', index, carouselRef.current);
              }
            }}
          />
        ))}
      </div>
      <Carousel ref={carouselRef} onChange={onSelect} autoplay={false} >
        <div className="flex">
          {banners.map((banner, index) => (
            <div
              key={index}
              className="relative mr-2 flex min-w-0 flex-[0_0_100%] flex-col items-center justify-center gap-0.5"
            >
              {banner}
            </div>
          ))}
        </div>
      </Carousel>
    </FullBleedContainer>
  );
};
