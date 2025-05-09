import { useCarousel } from '@/hooks';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { Carousel } from './Carousel';
import { useTranslation } from 'react-i18next';

type GameCarouselProps = {
  children: ReactNode;
  title?: ReactNode;
  allButtonLink?: string;
  showAllButton?: boolean;
  showArrows?: boolean;
};

export const GameCarousel = ({
  title,
  allButtonLink,
  children,
  showAllButton = true,
  showArrows = true,
}: GameCarouselProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { carouselRef, next, prev } = useCarousel();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-base font-bold">{title}</div>
        {showAllButton && (
          <div className="flex items-center gap-2">
            <button className="btn btn-sm" onClick={() => navigate(allButtonLink ?? '/')}>
              {t('casino:all')}
            </button>
            {showArrows && (
              <div className="join">
                <button className="btn btn-sm join-item" onClick={prev}>
                  <svg
                    className="fill-base-content"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 256 256"
                  >
                    <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                  </svg>
                </button>
                <button className="btn btn-sm join-item" onClick={next}>
                  <svg
                    className="fill-base-content"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 256 256"
                  >
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Carousel
        className="-mr-3"
        ref={carouselRef}
        options={{
          dragThreshold: 0.1,
          dragFree: false,
          skipSnaps: true,
          containScroll: 'trimSnaps',
          slidesToScroll: 1,
        }}
      >
        {children}
      </Carousel>
    </div>
  );
};
