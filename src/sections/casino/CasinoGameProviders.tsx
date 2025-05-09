import { GameCarousel } from '@/components/carousel/GameCarousel';
import { useNavigate } from 'react-router-dom';
import { QueryProvider } from '@/query/provider';
import { paths } from '@/routes/paths';
import { useTranslation } from 'react-i18next';
import { useSystem } from '@/hooks';

export const CasinoGameProviders = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { gameProviderList } = QueryProvider();
  const { isMobile, checkPageNavToApp } = useSystem();

  return (
    <GameCarousel title={t('casino:provider')} allButtonLink={`${paths.main.explore.root}`}>
      <div className="-mr-3 flex">
        {gameProviderList.map((provider, index) => (
          <div
            key={index}
            className={`bg-base-200 relative mr-2 flex h-[48px] min-w-0 ${isMobile ? 'flex-[0_0_30%]' : 'max-w-36.5'} flex-col items-center justify-center gap-0.5 rounded-lg px-4`}
            onClick={() => {
              if (checkPageNavToApp()) return;
              navigate(`${paths.main.explore.root}?provider=${provider?.name_en}`);
            }}
          >
            <img id={`banner-${index}`} src={provider?.logo} alt={`Slide ${index + 1}`} className="object-cover" />
          </div>
        ))}
      </div>
    </GameCarousel>
  );
};
