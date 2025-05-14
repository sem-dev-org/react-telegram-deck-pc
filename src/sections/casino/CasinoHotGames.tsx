import { EffectCards, EffectCardsHandle } from '@/components/carousel';
import { GameCarousel } from '@/components/carousel/GameCarousel';
import { GameImage } from '@/components/ui/GameImage';
import { Image } from '@/components/ui/Image';
import { SelectDropdown } from '@/components/ui/SelectDropdown';
import { useAuth } from '@/contexts/auth';
import { useCarousel } from '@/hooks';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { QueryCurrencyWithBalance } from '@/query/currency';
import { useFavoriteGames, useHotGames, useRecentGames } from '@/query/game';
import { paths } from '@/routes/paths';
import { useSettingStore } from '@/store/setting';
import { IGame } from '@/types/game';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSystem } from '@/hooks';

type CasinoHotGamesProps = {
  onCurrencySelect: () => void;
};

export const CasinoHotGames = ({ onCurrencySelect }: CasinoHotGamesProps) => {
  const { checkPageNavToApp } = useSystem();
  const navigate = useNavigate();
  const { carouselRef: effectCardsRef } = useCarousel<EffectCardsHandle>();
  const { t } = useTranslation();
  const { displayInFiat } = useSettingStore();
  const [sortBy, setSortBy] = useState('hot');

  const { user } = useAuth();

  // Use the new query hooks for data fetching
  const { data: hotGameList = [] } = useHotGames();
  const { data: favoritesGameList = [] } = useFavoriteGames();
  const { data: recentGameList = [] } = useRecentGames();

  // Select the appropriate game list based on current sort selection
  const gameList = sortBy === 'recent' ? recentGameList : sortBy === 'favorites' ? favoritesGameList : hotGameList;

  const options = useMemo(() => {
    const options = [
      {
        id: 'hot',
        label: t('casino:hot'),
        icon: (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7 1.3125C3.85888 1.3125 1.3125 3.85888 1.3125 7C1.3125 10.1411 3.85888 12.6875 7 12.6875C10.1411 12.6875 12.6875 10.1411 12.6875 7C12.6875 3.85888 10.1411 1.3125 7 1.3125ZM7.4375 3.5C7.4375 3.25838 7.24162 3.0625 7 3.0625C6.75838 3.0625 6.5625 3.25838 6.5625 3.5V7C6.5625 7.24162 6.75838 7.4375 7 7.4375H9.625C9.86662 7.4375 10.0625 7.24162 10.0625 7C10.0625 6.75838 9.86662 6.5625 9.625 6.5625H7.4375V3.5Z"
              fill="#A6ADBB"
            />
          </svg>
        ),
        value: 'hot',
      },
    ];

    if (favoritesGameList.length > 0) {
      options.push({
        id: 'favorites',
        label: t('casino:favorites'),
        icon: (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.56195 1.33319C7.49092 1.23794 7.3842 1.17567 7.26632 1.16071C7.14844 1.14575 7.02954 1.17938 6.93696 1.25387C5.84602 2.13168 5.08515 3.40518 4.87271 4.85687C4.48971 4.57922 4.15333 4.24095 3.87776 3.85612C3.80196 3.75026 3.68293 3.68366 3.55305 3.67443C3.42317 3.66521 3.29593 3.71432 3.20592 3.8084C2.30444 4.75073 1.75 6.02963 1.75 7.43711C1.75 10.3366 4.1005 12.6871 7 12.6871C9.89949 12.6871 12.25 10.3366 12.25 7.43711C12.25 5.30159 10.975 3.46481 9.14654 2.64468C8.49951 2.32881 7.96522 1.87397 7.56195 1.33319ZM9.1875 8.31234C9.1875 9.52047 8.20812 10.4998 7 10.4998C5.79188 10.4998 4.8125 9.52047 4.8125 8.31234C4.8125 8.07356 4.85076 7.84372 4.92148 7.62861C5.28809 7.89963 5.70949 8.10077 6.16601 8.21237C6.29195 7.39525 6.7005 6.67137 7.28869 6.14372C8.36036 6.28501 9.1875 7.20208 9.1875 8.31234Z"
              fill="#A6ADBB"
            />
          </svg>
        ),
        value: 'favorites',
      });
    }

    if (recentGameList.length > 0) {
      options.push({
        id: 'recent',
        label: t('casino:recent'),
        icon: (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.7929 12.1979L6.78909 12.1958L6.77588 12.1887C6.76462 12.1826 6.74853 12.1737 6.72792 12.1622C6.6867 12.1393 6.62739 12.1056 6.55256 12.0616C6.40296 11.9735 6.19102 11.8439 5.93749 11.6754C5.43127 11.3389 4.75488 10.8442 4.07668 10.212C2.73456 8.9609 1.3125 7.10214 1.3125 4.8125C1.3125 3.10447 2.7496 1.75 4.48438 1.75C5.50456 1.75 6.41802 2.21613 7 2.94676C7.58198 2.21613 8.49544 1.75 9.51562 1.75C11.2504 1.75 12.6875 3.10447 12.6875 4.8125C12.6875 7.10214 11.2654 8.9609 9.92332 10.212C9.24512 10.8442 8.56873 11.3389 8.06251 11.6754C7.80898 11.8439 7.59704 11.9735 7.44744 12.0616C7.37261 12.1056 7.3133 12.1393 7.27208 12.1622C7.25147 12.1737 7.23538 12.1826 7.22412 12.1887L7.21091 12.1958L7.2071 12.1979L7.20549 12.1987C7.07718 12.2669 6.92282 12.2669 6.79451 12.1987L6.7929 12.1979Z"
              fill="#A6ADBB"
            />
          </svg>
        ),
        value: 'recent',
      });
    }

    return options;
  }, [favoritesGameList, recentGameList, t]);

  // Initialize with null and update in useEffect
  const [currentGame, setCurrentGame] = useState<IGame | null>(null);

  // Use useEffect to update currentGame when gameList changes
  useEffect(() => {
    if (gameList && gameList.length > 0) {
      setCurrentGame(gameList.length > 3 ? gameList[3] : gameList[0]);
    }
  }, [gameList]);

  const handleGameChange = (index: number) => {
    if (gameList && gameList.length > 0) {
      setCurrentGame(gameList[index]);
    }
  };

  const handleSortBy = (value: string) => {
    setSortBy(value);
  };

  const { data: cryptoGroups } = QueryCurrencyWithBalance();
  const currencyObj = cryptoGroups?.find((item) => item.currency === user?.currency);
  const { convertCurrency } = useCurrencyFormatter();

  const profit = useMemo(
    () =>
      convertCurrency(currencyObj?.balance ?? 0, {
        sourceCurrency: currencyObj?.currency ?? '',
        targetCurrency: displayInFiat ? user?.currency_fiat || '' : user?.currency || '',
      }),
    [currencyObj, user?.currency_fiat, displayInFiat],
  );

  // 判断是否使用普通轮播
  const useNormalCarousel = sortBy === 'recent' || sortBy === 'favorites';

  // 渲染游戏轮播
  const renderGameCarousel = () => {
    if (useNormalCarousel) {
      // 使用普通轮播展示收藏和最近游戏
      return (
        <GameCarousel showAllButton={false} showArrows={false}>
          <div className="-mr-3 flex">
            {gameList &&
              gameList.length > 0 &&
              gameList.map((game, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (checkPageNavToApp()) return;
                    navigate(`${paths.main.game.details}${game.game_id}/${game.game_provider}`);
                  }}
                  className="relative mr-2 min-h-[150px] min-w-0 flex-[0_0_30%]"
                >
                  <GameImage game={game} className="max-h-[155px] rounded-2xl object-fill" />
                </div>
              ))}
          </div>
        </GameCarousel>
      );
    } else {
      // 使用EffectCards展示热门游戏
      return (
        <>
          <div className="-mx-3 h-[190px]">
            <EffectCards ref={effectCardsRef} onChange={handleGameChange}>
              {gameList &&
                gameList.length > 0 &&
                gameList.map((game, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (checkPageNavToApp()) return;
                      navigate(`${paths.main.game.details}${game.game_id}/${game.game_provider}`);
                    }}
                    className="scale-carousel__container min-h-[190px] min-w-0 flex-[0_0_120px]"
                  >
                    <div className="scale-carousel__item">
                      <GameImage game={game} className="scale-carousel__image w-full rounded-xl object-cover" />
                    </div>
                  </div>
                ))}
            </EffectCards>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              className="btn btn-sm btn-square bg-secondary"
              onClick={() => {
                if (checkPageNavToApp()) return;
                navigate(`${paths.main.game.details}${currentGame?.game_id}/${currentGame?.game_provider}`);
              }}
            >
              <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.125 3.29746C3.125 2.46555 4.01692 1.93818 4.74585 2.3391L11.4779 6.0417C12.2334 6.45724 12.2334 7.54288 11.4779 7.95842L4.74585 11.661C4.01691 12.0619 3.125 11.5346 3.125 10.7027V3.29746Z"
                  fill="#E7FB78"
                  fillOpacity="0.8"
                />
              </svg>
            </button>

            <div className="flex w-[240px] flex-col items-center">
              <p className="w-[240px] truncate text-center text-lg font-bold text-white">{currentGame?.game_name}</p>
              <div className="flex items-center gap-2">
                {currentGame?.tags
                  ?.split(',')
                  .slice(0, 5)
                  .map((tag, index) => (
                    <div key={tag} className="flex items-center gap-1">
                      <span className="text-xs font-light">{tag}</span>
                      {index < (currentGame?.tags?.split(',').length ?? 0) - 2 && (
                        <span className="text-primary bg-primary h-1 w-1 rounded-full text-xs" />
                      )}
                    </div>
                  ))}
              </div>
            </div>
            <button
              className="btn btn-sm btn-square bg-secondary"
              onClick={() => effectCardsRef?.current?.scrollToRandom()}
            >
              <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.3608 10.8439C11.3833 10.8439 11.4037 10.8555 11.4119 10.8769C11.4221 10.8963 11.4161 10.9197 11.3998 10.9352C11.2302 11.0965 10.8908 11.419 10.8908 11.419C10.6579 11.6406 10.6579 12 10.8908 12.2215C11.1238 12.443 11.4998 12.443 11.7328 12.2215C11.7328 12.2215 13.2796 10.7526 13.6903 10.3601C13.7169 10.3348 13.7312 10.2998 13.7312 10.2649C13.7312 10.2299 13.7169 10.1949 13.6903 10.1696C13.2796 9.77714 11.7328 8.30816 11.7328 8.30816C11.4998 8.08665 11.1238 8.08665 10.8908 8.30816C10.6579 8.52967 10.6579 8.88915 10.8908 9.11066C10.8908 9.11066 11.2485 9.45069 11.4242 9.6178C11.4405 9.63334 11.4467 9.65666 11.4365 9.67609C11.4283 9.69746 11.4079 9.70914 11.3854 9.70914C11.0748 9.70914 10.3474 9.70717 10.3474 9.70717C10.0736 9.70717 9.79964 9.58087 9.51152 9.39628C9.14575 9.15923 8.77592 8.82505 8.39993 8.43644C8.39993 8.43644 8.17927 8.20908 8.06484 8.09055C8.04645 8.07112 8.02193 8.05947 7.99332 8.05947C7.96676 8.05753 7.94019 8.06722 7.9218 8.08471C7.75628 8.23044 7.35983 8.57632 7.19431 8.72205C7.17388 8.73954 7.16158 8.76286 7.16158 8.78812C7.15954 8.81338 7.16985 8.83863 7.18824 8.85807C7.30268 8.97659 7.52333 9.20395 7.52333 9.20395C8.4817 10.193 9.45849 10.84 10.3453 10.84C10.3453 10.84 11.0563 10.8419 11.3608 10.8439ZM11.3998 3.45441C11.4161 3.46995 11.4221 3.49133 11.4119 3.5127C11.4037 3.53213 11.3833 3.54572 11.3608 3.54572C11.0563 3.54572 10.3453 3.54765 10.3453 3.54765C9.72209 3.54765 9.05801 3.84885 8.39594 4.37736C7.56427 5.04189 6.70181 6.07755 5.84358 7.11709C5.03847 8.08862 4.23962 9.06596 3.46107 9.68774C3.05034 10.0161 2.66401 10.2532 2.2778 10.2532C2.2778 10.2532 1.64026 10.2532 1.38891 10.2532C1.3317 10.2532 1.28674 10.2959 1.28674 10.3484C1.28674 10.5641 1.28674 11.0751 1.28674 11.2888C1.28674 11.316 1.29709 11.3393 1.31548 11.3588C1.33591 11.3763 1.36031 11.386 1.38891 11.386C1.55852 11.386 1.88349 11.386 1.88349 11.386H2.2778C2.90309 11.386 3.56529 11.0868 4.22736 10.5563C5.05903 9.89178 5.92135 8.85613 6.78163 7.81659C7.5847 6.84506 8.38559 5.86768 9.16414 5.2459C9.57487 4.91752 9.95912 4.68047 10.3453 4.68047H10.3474C10.3474 4.68047 11.0748 4.67854 11.3854 4.67854C11.4079 4.67854 11.4283 4.69213 11.4365 4.71156C11.4467 4.73099 11.4405 4.7543 11.4242 4.76985C11.2485 4.93889 10.8908 5.27895 10.8908 5.27895C10.6579 5.50046 10.6579 5.85797 10.8908 6.07948C11.1238 6.30099 11.4998 6.30099 11.7328 6.07948C11.7328 6.07948 13.2796 4.61051 13.6903 4.21801C13.7169 4.19275 13.7312 4.15975 13.7312 4.12283C13.7312 4.08785 13.7169 4.05287 13.6903 4.02761C13.2796 3.63706 11.7328 2.16614 11.7328 2.16614C11.4998 1.94657 11.1238 1.94657 10.8908 2.16614C10.6579 2.38765 10.6579 2.74713 10.8908 2.96864C10.8908 2.96864 11.2302 3.29119 11.3998 3.45441ZM1.88349 4.13642H2.2778C2.6211 4.13642 2.96449 4.32682 3.32617 4.59691C3.7839 4.93694 4.24779 5.41108 4.71778 5.9396C4.71778 5.9396 4.92608 6.17471 5.03642 6.29906C5.05277 6.31849 5.07946 6.33014 5.10603 6.33208C5.13259 6.33597 5.15903 6.32626 5.17946 6.31071C5.35111 6.17276 5.76184 5.84241 5.93553 5.70445C5.95596 5.68697 5.96829 5.66368 5.97033 5.63842C5.97238 5.61316 5.96417 5.58787 5.94782 5.56844C5.83748 5.44408 5.6271 5.20897 5.6271 5.20897C4.98751 4.4881 4.3499 3.86438 3.73278 3.47771C3.24032 3.16876 2.74983 3.00166 2.2778 3.00166H1.28674V4.13642H1.88349Z"
                  fill="#E7FB78"
                  fillOpacity="0.8"
                  style={{ fill: '#E7FB78', fillOpacity: '0.8' }}
                />
              </svg>
            </button>
          </div>
        </>
      );
    }
  };

  return (
    <div className="flex flex-col lg:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SelectDropdown
            options={options}
            value={sortBy}
            onChange={(value) => handleSortBy(`${value}`)}
            variant="ghost"
            className="text-sm font-bold"
            dropdownClassName="!w-40"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="join">
            <button
              className="btn btn-sm bg-base-300 join-item flex h-9 items-center gap-2 border"
              onClick={onCurrencySelect}
            >
              <div className="h-4 w-4 overflow-hidden rounded-full">
                {currencyObj?.icon && <Image src={currencyObj.icon} className="h-full w-full object-cover" />}
              </div>
              <p className="text-neutral-content text-sm font-semibold">{profit}</p>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.66112 5.04647C3.87012 4.8455 4.20247 4.85202 4.40344 5.06102L7 7.81745L9.59656 5.06102C9.79753 4.85202 10.1299 4.8455 10.3389 5.04647C10.5479 5.24743 10.5544 5.57978 10.3534 5.78879L7.37844 8.93878C7.27946 9.04173 7.14281 9.0999 7 9.0999C6.85719 9.0999 6.72055 9.04173 6.62156 8.93878L3.64656 5.78879C3.4456 5.57978 3.45211 5.24743 3.66112 5.04647Z"
                  fill="#A6ADBB"
                />
              </svg>
            </button>
            <button
              className="btn bg-base-200 btn-sm join-item flex h-9 w-9 items-center gap-2 p-0"
              onClick={() => {
                if (checkPageNavToApp()) return;
                navigate(paths.main.finance.deposit);
              }}
            >
              <img src="/images/wallet.png" className="h-6 w-6 opacity-80" />
            </button>
          </div>
        </div>
      </div>

      {renderGameCarousel()}
    </div>
  );
};
