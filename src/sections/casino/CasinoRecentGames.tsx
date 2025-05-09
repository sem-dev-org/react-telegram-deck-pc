import { GameImage } from '@/components/ui/GameImage';
import { useAuth } from '@/contexts/auth';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { QueryGreatestGameOrder } from '@/query/casino';
import { useSettingStore } from '@/store/setting';
import { IGreatestGameOrder } from '@/types/game';
import AutoScroll from 'embla-carousel-auto-scroll';
import useEmblaCarousel from 'embla-carousel-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GameDetailModal } from './GameDetailModal';
import { useSystem } from '@/hooks';

export const CasinoRecentGames = () => {
  const { user } = useAuth();
  const { greatestGameOrder } = QueryGreatestGameOrder();
  const { isMobile } = useSystem();

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: true,
    },
    [AutoScroll({ speed: 1, playOnInit: true, stopOnInteraction: false })],
  );

  const { convertCurrency } = useCurrencyFormatter();
  const { displayInFiat } = useSettingStore();
  const { t } = useTranslation();
  const [detailModal, setDetailModal] = useState<IGreatestGameOrder | null>(null);

  return (
    <div className="flex flex-col gap-2">
     <div className="flex items-center gap-2 leading-8">
        <div className="inline-grid *:[grid-area:1/1]">
          <div className="status status-primary animate-ping"></div>
          <div className="status status-primary"></div>
        </div>
        <span className="text-base font-bold">{t('casino:recentBigWins')}</span>
      </div>

      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {greatestGameOrder?.length > 0 &&
            greatestGameOrder?.map((slide, index) => (
              <div
                key={index}
                className={`relative mr-2 flex min-w-0 flex-col items-center justify-center gap-0.5  ${isMobile?'m-h-[150px] flex-[0_0_47px]':'m-h-[121px] flex-[0_0_70px]'}`}
                onClick={() => setDetailModal(slide)}
              >
                <GameImage game={slide} className="rounded-lg object-cover" />

                <p className="text-[7px] font-extralight">{slide?.nickname}</p>
                <p className="text-primary text-[8px] font-extralight">
                  {convertCurrency(slide?.win_amount, {
                    sourceCurrency: slide.real_currency,
                    targetCurrency: displayInFiat ? user?.currency_fiat || '' : slide.real_currency || '',
                    includeSymbol: true,
                    showPlus: false,
                    useThousandsSeparator: true,
                    useCompactFormat: true,
                  })}
                </p>
              </div>
            ))}
        </div>
      </div>

      {detailModal && <GameDetailModal open={!!detailModal} onClose={() => setDetailModal(null)} game={detailModal} />}
    </div>
  );
};
