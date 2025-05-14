import { Page, SafeArea } from '@/components/ui';
import {
  CasinoBanner,
  CasinoGameProviders,
  CasinoHotGames,
  CasinoPayment,
  CasinoRecentGames,
  CasinoTabs,
} from '@/sections/casino';
import { useNavigate } from 'react-router-dom';
import { useSystem } from '@/hooks';
import { Menu } from '@/components/menu';

import { useThemeStore } from '@/store/theme';

import { CurrencySelectDrawer } from '@/sections/casino/CurrencySelectDrawer';
import { useEffect, useState } from 'react';

import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { paths } from '@/routes/paths';
import { CasinoGamesRowList } from '@/sections/casino/CasinoGamesRowList';
import { CasinoBottom } from '@/sections/casino/CasinoBottom';
import { useTranslation } from 'react-i18next';

// const mockHotGames: IGame[] = [...mockGameGames.slice(0, 6)];

// const mockCrashGames: IGame[] = [...mockGameGames.slice(6, 12)];

// const mockRecentGames: IGame[] = [...mockGameGames.slice(2, 12)];

// const mockSlotsGames: IGame[] = [...mockGameGames.slice(1, 8)];

// const mockGameProviders: IGameProvider[] = [
//   {
//     id: '1',
//     name: 'Game Provider 1',
//     image: '/images/game-provider/1.png',
//   },
//   {
//     id: '2',
//     name: 'Game Provider 2',
//     image: '/images/game-provider/2.png',
//   },
//   {
//     id: '3',
//     name: 'Game Provider 3',
//     image: '/images/game-provider/3.png',
//   },
//   {
//     id: '4',
//     name: 'Game Provider 4',
//     image: '/images/game-provider/4.png',
//   },
//   {
//     id: '5',
//     name: 'Game Provider 5',
//     image: '/images/game-provider/5.png',
//   },
//   {
//     id: '6',
//     name: 'Game Provider 6',
//     image: '/images/game-provider/6.png',
//   },
// ];

const BannerOne = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isMobile } = useSystem();

  return (
    <div
      className={`relative flex h-[234px] w-full ${!isMobile && 'overflow-hidden rounded-2xl'}`}
      style={{
        // background: 'radial-gradient(100% 2006px at 0% 0%, color(display-p3 0.247 0.318 0.196) 0%, color(display-p3 0.082 0.098 0.118) 100%), color(display-p3 0.082 0.098 0.118)',
        background: `radial-gradient(100% 2006px at ${!isMobile ? 100 : 0}% 0%, color(display-p3 0.247 0.318 0.196) 0%, color(display-p3 0.082 0.098 0.118) 100%), color(display-p3 0.082 0.098 0.118)`,
      }}
    >
      <div
        className="font-montserrat text-[18px] leading-5 font-bold text-white"
        style={{
          position: 'absolute',
          width: '185px',
          height: '60px',
          left: '42px',
          top: '100px',
        }}
      >
        {t('casino:welcome')} <br /> {t('casino:packageUpTo')} <br />{' '}
        <span className="text-primary/80">1200% {t('casino:depositBonus')}</span>
      </div>

      <img
        src="/images/banner/1.png"
        alt="bonus"
        className="absolute top-[40px] left-[141px] h-[204px] w-[272px] object-cover"
      />

      <button
        className="btn font-montserrat flex items-center justify-start gap-2 bg-transparent p-0 px-0 text-[12px]"
        style={{
          position: 'absolute',
          width: '108px',
          height: '20px',
          left: '42px',
          top: '196px',
        }}
        onClick={() => navigate(paths.main.finance.deposit)}
      >
        <p className="font-montserrat text-[12px] font-semibold text-white/50">{t('casino:depositNow')}</p>
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.14017 4.73484C5.28661 4.88128 5.28661 5.11872 5.14017 5.26517L1.39017 9.01517C1.24372 9.16161 1.00628 9.16161 0.859835 9.01517C0.713388 8.86872 0.713388 8.63128 0.859835 8.48483L4.34467 5L0.859835 1.51517C0.713389 1.36872 0.713389 1.13128 0.859835 0.984835C1.00628 0.838388 1.24372 0.838388 1.39017 0.984835L5.14017 4.73484Z"
            fill="#A6ADBB"
          />
        </svg>
      </button>
    </div>
  );
}; /* 7 (2) 1 */

const BannerTwo = () => {
  const { formatCurrency } = useCurrencyFormatter();
  const { t } = useTranslation();
  const { isMobile } = useSystem();
  return (
    <div
      className={`relative flex h-[234px] w-full ${!isMobile && 'overflow-hidden rounded-2xl'}`}
      style={{
        background:
          'linear-gradient(180deg, color(display-p3 0.008 0.082 0.157 / 0.2) 0%, color(display-p3 0.082 0.098 0.118 / 0.2) 100%), color(display-p3 0.082 0.098 0.118)',
      }}
    >
      <div
        className="font-montserrat text-[18px] leading-5 font-bold text-white"
        style={{
          position: 'absolute',
          width: '185px',
          height: '60px',
          left: '42px',
          top: '100px',
        }}
      >
        {t('casino:referral')} <br /> {t('casino:bonus')} <br />
        <span className="text-primary/80">
          {formatCurrency(1200, {
            includeSymbol: true,
          })}
          <br /> & {t('casino:upTo')} 50% <br />
          {t('casino:commission')}
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          width: '170px',
          height: '170px',
          left: '186px',
          top: '51px',
        }}
      >
        <img
          src="/images/banner/2.png"
          alt="bonus"
          className="absolute h-[183px] w-[183px] object-cover drop-shadow-[0_35px_35px_rgba(145,224,255,0.5)]"
        />
      </div>
    </div>
  );
};

const BannerThree = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isMobile } = useSystem();
  return (
    <div
      className={`relative flex h-[234px] w-full ${!isMobile && 'overflow-hidden rounded-2xl'}`}
      style={{
        background:
          'radial-gradient(115.22% calc(630px * 0.2137) at 100% 0%, color(display-p3 0.192 0.380 0.239 / 0.5) 0%, color(display-p3 0.082 0.098 0.118 / 0.5) 100%), color(display-p3 0.082 0.098 0.118)',
      }}
    >
      <div
        className="font-montserrat text-[18px] leading-5 font-bold text-white"
        style={{
          position: 'absolute',
          width: '185px',
          height: '60px',
          left: '42px',
          top: '100px',
        }}
      >
        {t('casino:superSlot')} <br />
        <span className="text-primary/80">
          {t('casino:tournaments')} <br /> {t('casino:daily')}
        </span>
      </div>

      <button
        className="btn flex items-center justify-start gap-2 bg-transparent p-0 text-[12px]"
        style={{
          position: 'absolute',
          width: '108px',
          height: '20px',
          left: '42px',
          top: '196px',
        }}
        onClick={() => navigate(paths.main.tournament.root)}
      >
        <p className="font-montserrat text-[12px] font-semibold text-white/50">{t('casino:playNow')}</p>
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.14017 4.73484C5.28661 4.88128 5.28661 5.11872 5.14017 5.26517L1.39017 9.01517C1.24372 9.16161 1.00628 9.16161 0.859835 9.01517C0.713388 8.86872 0.713388 8.63128 0.859835 8.48483L4.34467 5L0.859835 1.51517C0.713389 1.36872 0.713389 1.13128 0.859835 0.984835C1.00628 0.838388 1.24372 0.838388 1.39017 0.984835L5.14017 4.73484Z"
            fill="#A6ADBB"
          />
        </svg>
      </button>

      <div
        style={{
          position: 'absolute',
          width: '201px',
          height: '201.39px',
          left: '170px',
          top: '53px',
        }}
      >
        <img
          src="/images/banner/3.png"
          alt="bonus"
          className="absolute h-[201px] w-[201px] object-cover drop-shadow-[0px_-2px_10px_rgba(254,221,1,0.5)]"
        />
      </div>
    </div>
  );
};

const BannerFour = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isMobile } = useSystem();

  return (
    <div
      className={`relative flex h-[234px] w-full ${!isMobile && 'overflow-hidden rounded-2xl'}`}
      style={{
        background:
          'radial-gradient(115.22% calc(630px * 0.2137) at 100% 0%, color(display-p3 0.804 0.627 0.584 / 0.5) 0%, color(display-p3 0.082 0.098 0.118 / 0.5) 100%) , color(display-p3 0.082 0.098 0.118)',
      }}
    >
      <div
        className="font-montserrat text-[18px] leading-5 font-bold text-white"
        style={{
          position: 'absolute',
          width: '185px',
          height: '60px',
          left: '42px',
          top: '100px',
        }}
      >
        {t('casino:exclusive')}
        <br />
        <span className="text-primary/80">
          {t('casino:vipRewards')} <br />& {t('casino:concierge')}
        </span>
      </div>

      <button
        className="btn flex items-center justify-start gap-2 bg-transparent p-0 text-[12px]"
        style={{
          position: 'absolute',
          width: '108px',
          height: '20px',
          left: '42px',
          top: '196px',
        }}
        onClick={() => navigate(paths.main.vip.root)}
      >
        <p className="font-montserrat text-[12px] font-semibold text-white/50">{t('casino:moreInfo')}</p>
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.14017 4.73484C5.28661 4.88128 5.28661 5.11872 5.14017 5.26517L1.39017 9.01517C1.24372 9.16161 1.00628 9.16161 0.859835 9.01517C0.713388 8.86872 0.713388 8.63128 0.859835 8.48483L4.34467 5L0.859835 1.51517C0.713389 1.36872 0.713389 1.13128 0.859835 0.984835C1.00628 0.838388 1.24372 0.838388 1.39017 0.984835L5.14017 4.73484Z"
            fill="#A6ADBB"
          />
        </svg>
      </button>
      <div
        style={{
          position: 'absolute',
          width: '304px',
          height: '224px',
          left: '42px',
          top: '30px',
        }}
      >
        <img
          src="/images/banner/4.png"
          alt="bonus"
          className="absolute h-[220px] w-[360px] object-cover drop-shadow-[0px_-2px_10px_rgba(44,37,47,0.5)]"
        />
      </div>
    </div>
  );
};

export default function CasinoPage() {
  const [openCurrencySelectDrawer, setOpenCurrencySelectDrawer] = useState(false);
  const { isMobile } = useSystem();

  const { setBackground } = useThemeStore();
  const { t } = useTranslation();

  useEffect(() => {
    return () => setBackground('var(--color-base-300)');
  }, []);

  // style={{ '--value': details.time.days } as React.CSSProperties}
  return (
    <div className="flex gap-1">
      {/* PC端用于给左侧目录站位空间 */}
      {!isMobile && (
        <div className="bg-base-200 h-auto">
          <Menu fromIndex={true} />
        </div>
      )}
      <Page className={`flex flex-1 flex-col ${isMobile && 'pb-24'} `}>
        <CasinoBanner banners={[<BannerOne />, <BannerTwo />, <BannerThree />, <BannerFour />]} />
        {/* <FloatingButton
        icon={
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20.04 7.32018L14.28 3.29018C12.71 2.19018 10.3 2.25018 8.78999 3.42018L3.77999 7.33018C2.77999 8.11018 1.98999 9.71018 1.98999 10.9702V17.8702C1.98999 20.4202 4.05999 22.5002 6.60999 22.5002H17.39C19.94 22.5002 22.01 20.4302 22.01 17.8802V11.1002C22.01 9.75018 21.14 8.09018 20.04 7.32018ZM12.75 18.5002C12.75 18.9102 12.41 19.2502 12 19.2502C11.59 19.2502 11.25 18.9102 11.25 18.5002V15.5002C11.25 15.0902 11.59 14.7502 12 14.7502C12.41 14.7502 12.75 15.0902 12.75 15.5002V18.5002Z"
              fill="white"
              fillOpacity="0.8"
            />
          </svg>
        }
        size="md"
        initialPosition={{ x: 20, y: 20 }}
        positionReference="topLeft"
        debug={true}
      >
        <FloatingMenu title="Floating Button" items={[]} />
      </FloatingButton> */}
        {isMobile && (
          <svg
            width="100%"
            height="auto"
            viewBox="0 0 375 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            style={{ maxWidth: '100%' }}
            className="text-base-300 z-10 -translate-y-[calc(100%-1px)]"
          >
            <path
              d="M0 0C147.333 21.3791 229.235 19.7551 375 0V17H0V0Z"
              fill="currentColor"
              style={{ fillOpacity: 1 }}
            />
          </svg>
        )}

        <SafeArea top={false} className="flex w-full flex-col gap-3 px-3">
          <CasinoHotGames onCurrencySelect={() => setOpenCurrencySelectDrawer(true)} />
          <CasinoRecentGames />
          {/* <CasinoCrashGames /> */}
          {[{ type: 'slots', title: t('casino:slotsGames') }].map((type) => (
            <CasinoGamesRowList key={type.type} type={type.type} title={type.title} />
          ))}
          <CasinoGameProviders />
          <CasinoPayment />
          <CasinoTabs />
          {/* <CasinoLiveGames />
        <CasinoSlotsGames /> */}
          {[
            { type: 'crash', title: t('casino:crashGames') },
            { type: 'sport', title: t('casino:sportGames') },
            { type: 'esport', title: t('casino:esportGames') },
            { type: 'keno', title: t('casino:kenoGames') },
            { type: 'non-keno', title: t('casino:nonKenoGames') },
            { type: 'casual', title: t('casino:casualGames') },
            { type: 'blockchain', title: t('casino:blockchainGames') },
            { type: 'live', title: t('casino:liveGames') },
            { type: 'fishing', title: t('casino:fishingGames') },
            { type: 'roulette', title: t('casino:rouletteGames') },
            { type: 'poker', title: t('casino:pokerGames') },
            { type: 'table', title: t('casino:tableGames') },
            { type: 'arcade', title: t('casino:arcadeGames') },
            { type: 'show', title: t('casino:showGames') },
          ].map((type) => (
            <CasinoGamesRowList key={type.type} type={type.type} title={type.title} />
          ))}
          <CurrencySelectDrawer open={openCurrencySelectDrawer} onClose={() => setOpenCurrencySelectDrawer(false)} />
          {!isMobile && <CasinoBottom />}
        </SafeArea>
      </Page>
    </div>
  );
}
