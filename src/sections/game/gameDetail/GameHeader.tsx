import { ModalDialog } from '@/components/ui/ModalDialog';
import { CurrencySelectDrawer } from '@/sections/casino/CurrencySelectDrawer';
import { IGame } from '@/types/game';
import clsx from 'clsx';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QueryUserBalance } from '@/query/balance';
import { GameImage } from '@/components/ui/GameImage';
import { GameLiveStats } from './GameLiveStats';
import { useAuth } from '@/contexts/auth';
import { getUserGameList, likeGame } from '@/api/casino';
import { paths } from '@/routes/paths';
import { isFavorite } from '@/api/detail';
import { useTranslation } from 'react-i18next';
import { CurrencyImage } from '@/components/ui/CurrencyImage';
import { hapticFeedback } from '@telegram-apps/sdk-react';

// Add keyframes for heart animation
const heartPulseAnimation = `
  @keyframes heartPulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.8);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const PlayTipsDialog = ({
  open,
  onClose,
  title,
  description,
  status,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  status: string;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [timeoutId, setTimeoutId] = useState(3);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!open) {
      setTimeoutId(3);
      return;
    }

    const interval = setInterval(() => {
      setTimeoutId(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          if (status === 'pleaseLogin') {
            navigate(paths.login);
          }
          if (status === 'notEnoughBalance') {
            navigate(paths.main.finance.deposit);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    intervalRef.current = interval;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [open, status, navigate]);

  const handleClose = () => {
    onClose();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimeoutId(3);
  };

  return (
    <ModalDialog
      open={open}
      onClose={handleClose}
      className="bg-base-100 max-w-[327px] p-6"
    >
      <div className="flex flex-col gap-3 overflow-hidden">
        <h1 className="text-base font-bold">{title}</h1>
        <div
          className="P-4 flex items-center gap-3 rounded-lg p-4"
          style={{
            background:
              'radial-gradient(100% 157.05% at 0% 46.47%, rgba(0, 172, 105, 0.4) 0%, rgba(51, 51, 51, 0.08) 100%), #1B232B',
          }}
        >
          {/* <img src="/icons/isometric/38.svg" /> */}
          <p className="text-sm leading-6 whitespace-pre-line">{description}</p>
        </div>
        {status === 'pleaseLogin' && (
          <button
            className="btn btn-primary h-12 w-full"
            onClick={() => {
              navigate(paths.login);
            }}
          >
            {t('login:signIn')} ({timeoutId}s)
          </button>
        )}
        {status === 'notEnoughBalance' && (
          <button
            className="btn btn-primary h-12 w-full"
            onClick={() => {
              navigate(paths.main.finance.deposit);
            }}
          >
            {t('common.deposit')} ({timeoutId}s)
          </button>
        )}
      </div>
    </ModalDialog>
  );
};

export const GameDetailHeader = ({ game }: { game: IGame }) => {
  const [open, setOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const { t } = useTranslation();
  const { userBalance } = QueryUserBalance();

  const [openLiveStats, setOpenLiveStats] = useState(false);

  const navigate = useNavigate();

  const { user, status, updateStatus } = useAuth();

  const [openTotalTips, setOpenTotalTips] = useState('');
  const [tipsOpen, setTipsOpen] = useState(false);

  const canPlay = () => {
    if (!userBalance) return false;
    const balance = userBalance.find((item) => item.currency === user?.currency)?.balance;
    if (balance && Number(balance) > 0) {
      return true;
    }
    return false;
  };

  const playFun = () => {
    if (hapticFeedback.isSupported()) {
      hapticFeedback.impactOccurred('heavy');
    }

    if (user) {
      if (canPlay()) {
        navigate(`${paths.main.game.iframe}${game?.game_provider}/${game?.game_id}/${game?.is_support_demo_game}`);
      } else {
        setOpenTotalTips('notEnoughBalance');
        setTipsOpen(true);
      }
    } else {
      setOpenTotalTips('pleaseLogin');
      setTipsOpen(true);
    }
  };

  const showPlayWithBalanceIn = () => {
    return (game?.currency?.indexOf(user?.currency || '') ?? -2) > -1 ? user?.currency : game?.default_currency;
  };

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(user?.is_favorite ?? false);
  }, [user]);

  const handleLikeGame = () => {
    likeGame({
      game_primary_id: game?.id,
    }).then((res) => {
      if (res.code === 0) {
        setIsLiked(!isLiked);
        getUserGameList({ type: 'favorites' }).then((res) => {
          if (res.code === 0) {
            const favoriteGameIds = res.data.map((game: any) => game.id).join(',');
            if (status) {
              updateStatus({
                ...status,
                favorites_game: favoriteGameIds,
              });
            }
          }
        });
      }
    });
  };

  useEffect(() => {
    if (user && game?.id) {
      isFavorite({ game_primary_id: game?.id }).then((res) => {
        if (res.code === 0) {
          setIsLiked(res.data.isFavorite);
        }
      });
    }
  }, [user, game]);

  return (
    <>
      <CurrencySelectDrawer open={currencyOpen} onClose={() => setCurrencyOpen(false)} />
      <GameLiveStats open={openLiveStats} onClose={() => setOpenLiveStats(false)} />

      <div className="flex min-h-55 flex-col justify-between">
        <div className="flex items-stretch gap-4">
          <div>
            <div className="h-47 w-35 overflow-hidden rounded-xl">
              <GameImage game={game} className="h-full w-full" />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <p className="mb-1 truncate px-1 text-sm leading-5 font-bold">{t('gameDetail:playWithBalanceIn')}</p>
              <div
                onClick={() => setCurrencyOpen(true)}
                className="bg-base-200 flex h-10 items-center justify-between rounded-md px-3 text-center text-sm font-semibold"
              >
                <CurrencyImage currency={user?.currency ?? 'USDT'} className="h-4 w-4" />
                <div>{user?.currency}</div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.18414 5.7676C4.423 5.53792 4.80282 5.54537 5.0325 5.78423L8 8.93443L10.9675 5.78423C11.1972 5.54537 11.577 5.53792 11.8159 5.7676C12.0547 5.99727 12.0622 6.3771 11.8325 6.61596L8.4325 10.216C8.31938 10.3336 8.16321 10.4001 8 10.4001C7.83679 10.4001 7.68062 10.3336 7.5675 10.216L4.1675 6.61596C3.93782 6.3771 3.94527 5.99727 4.18414 5.7676Z"
                    fill="#A6ADBB"
                    style={{ fill: '#A6ADBB', fillOpacity: 1 }}
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 px-1">
              <p className="text-xs leading-3">
                {t('gameDetail:theSelectedCurrencyWillBeDisplayedIn')}{' '}
                <span className="text-primary">{showPlayWithBalanceIn()}</span>{' '}
                {t('gameDetail:ifYouChangeCurrencyWhilePlaying')}
              </p>
            </div>
            <button className="btn btn-l btn-primary flex w-full items-center gap-2" onClick={() => playFun()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z"
                />
              </svg>
              <span className="text-sm font-semibold">{t('gameDetail:play').toUpperCase()}</span>
            </button>
          </div>
        </div>
        <div className="flex h-8 items-center gap-4">
          <div className="flex w-35 items-center justify-center gap-2">
            <button className="btn btn-ghost btn-square btn-sm" onClick={handleLikeGame}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-all duration-300"
                style={{
                  // transform: `scale(${isLiked ? 1.3 : 1})`,
                  animation: isLiked ? 'heartPulse 0.4s ease-out' : 'none',
                }}
              >
                <style>{heartPulseAnimation}</style>
                <path
                  d="M5.7929 11.0065L5.78909 11.0044L5.77588 10.9973C5.76462 10.9912 5.74853 10.9823 5.72792 10.9708C5.6867 10.9478 5.62739 10.9142 5.55256 10.8701C5.40296 10.7821 5.19102 10.6525 4.93749 10.484C4.43127 10.1475 3.75488 9.65282 3.07668 9.02061C1.73456 7.76949 0.3125 5.91074 0.3125 3.62109C0.3125 1.91306 1.7496 0.558594 3.48437 0.558594C4.50456 0.558594 5.41802 1.02473 6 1.75536C6.58198 1.02473 7.49544 0.558594 8.51562 0.558594C10.2504 0.558594 11.6875 1.91306 11.6875 3.62109C11.6875 5.91074 10.2654 7.76949 8.92332 9.02061C8.24512 9.65282 7.56873 10.1475 7.06251 10.484C6.80898 10.6525 6.59704 10.7821 6.44744 10.8701C6.37261 10.9142 6.3133 10.9478 6.27208 10.9708C6.25147 10.9823 6.23538 10.9912 6.22412 10.9973L6.21091 11.0044L6.2071 11.0065L6.20549 11.0073C6.07718 11.0755 5.92282 11.0755 5.79451 11.0073L5.7929 11.0065Z"
                  fill={isLiked ? '#FF506E' : '#A6ADBB'}
                  style={{ fill: isLiked ? '#FF506E' : '#A6ADBB', fillOpacity: 1 }}
                />
              </svg>
            </button>

            <button className="btn btn-ghost btn-square btn-sm" onClick={() => setOpen(true)}>
              <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_5499_14988)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.48743 2.07151C5.55287 1.74431 5.84016 1.50879 6.17383 1.50879H7.82611C8.15978 1.50879 8.44707 1.74431 8.51251 2.07151L8.74385 3.22819C9.23687 3.416 9.69175 3.68111 10.0937 4.00872L11.2125 3.63024C11.5286 3.52332 11.8762 3.65436 12.043 3.94333L12.8691 5.37424C13.036 5.66321 12.9757 6.02977 12.725 6.25005L11.8383 7.02931C11.8789 7.28316 11.9 7.54351 11.9 7.80879C11.9 8.07407 11.8789 8.33442 11.8383 8.58826L12.725 9.36752C12.9757 9.58779 13.036 9.95436 12.8691 10.2433L12.043 11.6742C11.8762 11.9632 11.5286 12.0943 11.2125 11.9873L10.0937 11.6089C9.69175 11.9365 9.23687 12.2016 8.74385 12.3894L8.51251 13.5461C8.44707 13.8733 8.15978 14.1088 7.82611 14.1088H6.17383C5.84016 14.1088 5.55287 13.8733 5.48743 13.5461L5.25609 12.3894C4.76307 12.2016 4.30819 11.9365 3.90627 11.6089L2.78747 11.9873C2.47139 12.0943 2.12377 11.9632 1.95694 11.6743L1.1308 10.2433C0.963961 9.95437 1.02428 9.5878 1.27492 9.36753L2.16163 8.58827C2.12105 8.33442 2.09997 8.07407 2.09997 7.80879C2.09997 7.54351 2.12105 7.28316 2.16163 7.02932L1.27492 6.25006C1.02428 6.02979 0.963961 5.66322 1.1308 5.37425L1.95694 3.94334C2.12377 3.65437 2.47139 3.52333 2.78747 3.63025L3.90626 4.00873C4.30819 3.68112 4.76307 3.416 5.25609 3.22819L5.48743 2.07151ZM6.99997 9.90879C8.15977 9.90879 9.09997 8.96859 9.09997 7.80879C9.09997 6.64899 8.15977 5.70879 6.99997 5.70879C5.84017 5.70879 4.89997 6.64899 4.89997 7.80879C4.89997 8.96859 5.84017 9.90879 6.99997 9.90879Z"
                    fill="#A6ADBB"
                    style={{ fill: '#A6ADBB', fillOpacity: 1 }}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_5499_14988">
                    <rect
                      width="14"
                      height="14"
                      fill="white"
                      style={{ fill: 'white', fillOpacity: 1 }}
                      transform="translate(0 0.808594)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>
            <div className="flex h-8 w-8 items-center justify-center">
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.87801 0.464914C8.9646 0.239338 9.21766 0.126668 9.44323 0.213259L12.909 1.54363C13.0173 1.58521 13.1047 1.66813 13.1519 1.77413C13.1991 1.88013 13.2022 2.00053 13.1606 2.10886L11.8303 5.5746C11.7437 5.80018 11.4906 5.91285 11.265 5.82626C11.0395 5.73967 10.9268 5.4866 11.0134 5.26103L11.9652 2.78135L11.3314 3.06354C9.90039 3.70068 8.81043 4.78615 8.1521 6.08144C8.08861 6.20635 7.96913 6.2933 7.83074 6.31529C7.69235 6.33728 7.55181 6.29165 7.45272 6.19257L5.25 3.98985L1.62186 7.61799C1.451 7.78884 1.174 7.78884 1.00314 7.61799C0.832286 7.44713 0.832286 7.17012 1.00314 6.99927L4.94064 3.06177C5.02269 2.97972 5.13397 2.93363 5.25 2.93363C5.36603 2.93363 5.47731 2.97972 5.55936 3.06177L7.66286 5.16527C8.42155 3.92795 9.54979 2.89897 10.9755 2.26419L11.6093 1.982L9.12966 1.03014C8.90409 0.943551 8.79141 0.69049 8.87801 0.464914Z"
                  fill="#A6ADBB"
                  style={{ fill: '#A6ADBB', fillOpacity: 1 }}
                />
              </svg>
            </div>
          </div>
          <button className="btn btn-sm text-neutral-content w-full min-w-0 flex-1 bg-transparent text-center text-sm font-semibold break-words">
            {!game?.is_support_free_game ? <div /> : <span className="ml-1">{t('gameDetail:freePlay')}</span>}
          </button>
        </div>
      </div>
      <FullScreenDialog open={open} onClose={() => setOpen(false)} />
      <PlayTipsDialog
        open={tipsOpen}
        onClose={() => setTipsOpen(false)}
        title={t('gameDetail:totalTips')}
        description={t(`gameDetail:${openTotalTips}`)}
        status={openTotalTips}
      />
      {/* <WalletSelectDialog
        selectedCurrency={user?.currency_fiat ?? 'USD'}
        openWallet={currencyOpen}
        handleWalletSettingsClose={() => setCurrencyOpen(false)}
      /> */}
    </>
  );
};

const FullScreenDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const isFullScreen = localStorage.getItem('isFullScreen');
    if (isFullScreen) {
      setIsFullScreen(isFullScreen === 'true');
    }
  }, []);

  const setIsFullScreenFun = (checked: boolean) => {
    setIsFullScreen(checked);
    localStorage.setItem('isFullScreen', checked.toString());
  };

  return (
    <ModalDialog open={open} onClose={onClose} className="">
      <h3 className="font-bold">{t('gameDetail:gameLobbySettings')}</h3>
      <div className="mt-3 flex h-18 items-center justify-around gap-4 p-4">
        <input
          type="checkbox"
          checked={isFullScreen}
          className={clsx(
            'toggle toggle-primary rounded-full border',
            isFullScreen ? 'border-primary' : 'border-base-content',
          )}
          onChange={(e) => setIsFullScreenFun(e.target.checked)}
        />
        <div className="flex flex-1 flex-col gap-2" onClick={() => setIsFullScreenFun(!isFullScreen)}>
          <p className="text-sm font-bold">{t('gameDetail:launchInFullScreen')}</p>
          <p className="text-xs">{t('gameDetail:launchInFullScreenDescription')}</p>
        </div>
      </div>
    </ModalDialog>
  );
};
