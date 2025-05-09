import { ModalDialog } from '@/components/ui/ModalDialog';
import { IGreatestGameOrder } from '@/types/game';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { paths } from '@/routes/paths';
import { useAuth } from '@/contexts/auth';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useTranslation } from 'react-i18next';
import { useSettingStore } from '@/store/setting';
import { GameImage } from '@/components/ui/GameImage';
import { INewestGameOrder } from '@/types/game';

type GameDetailModalProps = {
  open: boolean;
  onClose: () => void;
  game: IGreatestGameOrder | INewestGameOrder;
};

export const GameDetailModal = ({ open, onClose, game }: GameDetailModalProps) => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const { user } = useAuth();
  const { convertCurrency } = useCurrencyFormatter();
  const { displayInFiat } = useSettingStore();

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      style={{
        background:
          'linear-gradient(180deg, color(display-p3 0.329 0.502 0.596 / 0.2) 0%, color(display-p3 0.114 0.137 0.165 / 0.2) 42.86%), color(display-p3 0.114 0.137 0.165)',
      }}
    >
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold">{t('casino:betSlip')}</p>
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-sm font-bold">{t('casino:profit')}</p>
          <div className="flex items-center gap-2">
            <img src={`/icons/currency/${game.real_currency.toLowerCase()}.svg`} className="h-6 w-6" />
            <p className="text-primary text-2xl font-bold">
              {convertCurrency(game.real_win_amount, {
                sourceCurrency: game.real_currency,
                targetCurrency: game.real_currency,
                includeSymbol: true,
              })}
            </p>
          </div>
          <p className="text-base font-bold">
            {convertCurrency(game.real_win_amount, {
              sourceCurrency: game.real_currency,
              targetCurrency: displayInFiat ? user?.currency_fiat || '' : 'USDT',
            })}
          </p>
        </div>

        <div className="bg-base-200 shadow-base-300 grid h-16 grid-cols-2 rounded-xl shadow-sm">
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-base-content/50 text-sm">{t('casino:betAmount')}</p>
            <p className="text-sm font-bold">
              {convertCurrency(game.real_bet_amount, {
                sourceCurrency: game.real_currency,
                targetCurrency: game.real_currency,
                includeSymbol: true,
              })}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-base-content/50 text-sm">X</p>
            <p className="text-sm font-bold">{(Number(game.real_win_amount) / Number(game.real_bet_amount)).toLocaleString()}x</p>
          </div>
        </div>

        <div className="divider my-0 h-1" />

        <div className="flex items-center gap-4 px-4 py-3">
          {'avatar' in game && game.avatar ? (
            <div className="avatar">
              <div className="w-8 rounded-full">
                <img src={game.avatar} />
              </div>
            </div>
          ) : (
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="text-2xl">{game.nickname.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold">{game.nickname.charAt(0).toUpperCase() + game.nickname.slice(1)}</p>
            <div className="flex items-center gap-2">
              <p className="text-base-content/50 text-xs font-semibold">
                {dayjs(game.order_time * 1000).format('DD/MM/YYYY HH:mm')}
              </p>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.83054 1.11816C4.92855 1.03678 5.07145 1.03678 5.16946 1.11816C6.13884 1.92309 7.36575 2.42862 8.70831 2.49288C8.82898 2.49866 8.93203 2.58582 8.94787 2.70559C8.98225 2.96552 9 3.2307 9 3.50002C9 6.08123 7.37006 8.28175 5.08327 9.12848C5.02966 9.14833 4.97051 9.14833 4.91689 9.12848C2.63002 8.2818 1 6.08124 1 3.49996C1 3.23066 1.01774 2.9655 1.05212 2.7056C1.06796 2.58582 1.17101 2.49866 1.29169 2.49288C2.63425 2.42862 3.86115 1.92309 4.83054 1.11816ZM6.92828 4.09544C7.05009 3.92795 7.01306 3.69342 6.84556 3.5716C6.67807 3.44979 6.44354 3.48682 6.32172 3.65431L4.57985 6.04939L3.64017 5.10971C3.49372 4.96327 3.25628 4.96327 3.10983 5.10971C2.96339 5.25616 2.96339 5.4936 3.10983 5.64004L4.35984 6.89004C4.43738 6.96759 4.545 7.00731 4.65433 6.99873C4.76367 6.99015 4.86377 6.93414 4.92828 6.84544L6.92828 4.09544Z"
                  fill="#00A96E"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-base-200 shadow-base-300 flex h-16 items-center justify-between rounded-xl p-4 shadow-sm">
          <div className="flex flex-1 items-center gap-2">
            <GameImage
              className="!h-10 max-w-8 rounded-md"
              game={{
                id: typeof game.id === 'string' ? parseInt(game.id) : game.id,
                game_name: game.game_name,
                game_type_2: game.game_type_2,
                game_provider: game.game_provider,
                game_code: game.game_code,
                game_id: game.game_id,
              }}
            />
            <div className="flex flex-col">
              <p className="text-sm font-semibold">{game.game_name}</p>
              <p className="text-base-content/50 text-xs font-semibold">
                {t(`casino:${game.game_type_2.toLowerCase()}Games`)}
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-2"
            onClick={() => {
              // if ('game_primary_id' in game) {
              //   navigate(`${paths.main.game.details}${game.game_primary_id}`);
              // } else {
                navigate(`${paths.main.game.details}${game.game_id}/${game.game_provider}`);
              // }
            }}
          >
            <p className="text-primary text-xs font-semibold">{t('casino:playNow')}</p>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.32582 8.8619C4.15356 8.68275 4.15915 8.39788 4.3383 8.22562L6.70095 6L4.3383 3.77437C4.15915 3.60212 4.15356 3.31725 4.32582 3.1381C4.49808 2.95895 4.78295 2.95337 4.96209 3.12562L7.66209 5.67562C7.75033 5.76047 7.8002 5.87759 7.8002 6C7.8002 6.12241 7.75033 6.23953 7.66209 6.32437L4.96209 8.87437C4.78295 9.04663 4.49808 9.04105 4.32582 8.8619Z"
                fill="#E7FB78"
                fillOpacity="0.8"
              />
            </svg>
          </div>
        </div>
      </div>
    </ModalDialog>
  );
};
