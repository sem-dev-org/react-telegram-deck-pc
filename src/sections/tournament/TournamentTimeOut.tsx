import { useEffect, useMemo, useState } from 'react';
import NumberFlow, { continuous } from '@number-flow/react';
import { useAuth } from '@/contexts/auth';
import { getPoolPrize } from '@/api/tournament';
import { ITournamentInfo } from '@/types/tournament';
import { useQuery } from '@tanstack/react-query';
import { getCurrencySymbolFun } from '@/utils/auth';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useTranslation } from 'react-i18next';

type TournamentTimeOutProps = {
  details: {
    name: string;
    time: {
      days?: number;
      hours?: number;
      minutes?: number;
      seconds: number;
    };
    prize: number;
  };
  data: ITournamentInfo;
  islocal?: boolean;
};

const isGreaterThanOneDay = (time: TournamentTimeOutProps['details']['time']) => {
  if (time.days && time.days > 0) return true;
  if (time.hours && time.hours >= 24) return true;
  return false;
};

const isGreaterThanOneHour = (time: TournamentTimeOutProps['details']['time']) => {
  if (time.days && time.days > 0) return true;
  if (time.hours && time.hours > 0) return true;
  return false;
};

const isGreaterThanOneMinute = (time: TournamentTimeOutProps['details']['time']) => {
  if (time.days && time.days > 0) return true;
  if (time.hours && time.hours > 0) return true;
  if (time.minutes && time.minutes > 0) return true;
  return false;
};

const isGreaterThanOneSecond = (time: TournamentTimeOutProps['details']['time']) => {
  if (time.days && time.days > 0) return true;
  if (time.hours && time.hours > 0) return true;
  if (time.minutes && time.minutes > 0) return true;
  if (time.seconds && time.seconds > 0) return true;
  return false;
};

export const TournamentTimeOut = ({ details, data, islocal }: TournamentTimeOutProps) => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setCountdown({
      days: details.time.days || 0,
      hours: details.time.hours || 0,
      minutes: details.time.minutes || 0,
      seconds: details.time.seconds,
    });

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes && prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours && prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days && prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [details.time]);

  // const [prize, setPrize] = useState(details.prize);
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setPrize((prev) => {
  //       return prev + Math.floor(Math.random() * 100);
  //     });
  //   }, 3000);

  //   return () => clearInterval(timer);
  // }, []);

  // const [poolPrize, setPoolPrize] = useState<number>(0);

  const { data: poolPrizeData = { data: 0, code: 0 } } = islocal
    ? {
        data: {
          code: 0,
          data: 22.7293,
        },
      }
    : useQuery<{ data: number; code: number }>({
        queryKey: ['getPoolPrize', data.tournament_id, data.tournament_level],
        queryFn: () =>
          getPoolPrize({
            tournament_id: data.tournament_id,
            tournament_level: data.tournament_level,
          }),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchInterval: 10 * 1000,
        enabled: !!data.tournament_id && !!data.tournament_level,
      });
  // const getFun = useCallback(async () => {
  //   if (data) {
  //     getPoolPrize({
  //       tournament_id: data.tournament_id,
  //       tournament_level: data.tournament_level,
  //     }).then((res) => {
  //       if (res.code === 200) {
  //         setPoolPrize(res.data);
  //       }
  //     });
  //   }
  // }, [data]);

  // useEffect(() => {
  //   if (data) {
  //     getFun();
  //     const timer = setInterval(() => {
  //       getFun();
  //     }, 5 * 1000);
  //     return () => clearInterval(timer);
  //   }
  // }, [getFun, data]);

  const { user } = useAuth();
  // const { displayDecimal } = QueryCurrency(user?.currency_fiat ?? '');
  // const { rateForUSD } = QueryRateForUSD();

  const symbolToUse: string = useMemo(() => {
    return getCurrencySymbolFun(user?.currency_fiat ?? '') ?? '';
  }, [user]);

  const { formatCurrency } = useCurrencyFormatter();

  return (
    <div className="flex h-full flex-col justify-center">
      <div
        className="font-montserrat mb-3 flex flex-col items-start justify-between text-[18px] leading-[21px] font-bold text-white"
        style={{
          whiteSpace: 'pre-line',
        }}
      >
        <div>{details.name}</div>
      </div>
      <div
        className="relative flex w-47 flex-col items-start gap-1 rounded-lg p-2"
        style={{
          background:
            'linear-gradient(136.93deg, rgba(255, 255, 255, 0.3) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(100.68deg, rgba(255, 255, 255, 0.1) 25%, rgba(0, 0, 0, 0) 25%)',
        }}
      >
        <div className="bg-warning absolute -top-1.5 left-0 flex h-3 items-center justify-center rounded-[4px] rounded-bl-none px-2">
          <span className="font-montserrat text-xs font-semibold text-black">{t('tournament:endingIn')}</span>
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full items-center gap-1">
            {isGreaterThanOneDay(countdown) && (
              <div
                className="flex h-12 flex-1 flex-col items-center justify-center rounded-md"
                style={{ background: 'color(display-p3 0.082 0.098 0.118 / 0.8)' }}
              >
                <div className="font-montserrat countdown text-center text-2xl font-bold text-white">
                  <span style={{ '--value': countdown.days } as React.CSSProperties}>{countdown.days}</span>
                </div>
                <div className="font-montserrat text-neutral-content text-[8px]">{t('tournament:day')}</div>
              </div>
            )}
            {isGreaterThanOneHour(countdown) && (
              <div
                className="flex h-12 flex-1 flex-col items-center justify-center rounded-md"
                style={{ background: 'color(display-p3 0.082 0.098 0.118 / 0.8)' }}
              >
                <div className="font-montserrat countdown text-center text-2xl font-bold text-white">
                  <span style={{ '--value': countdown.hours } as React.CSSProperties}>{countdown.hours}</span>
                </div>
                <div className="font-montserrat text-neutral-content text-[8px]">{t('tournament:hours')}</div>
              </div>
            )}
            {isGreaterThanOneMinute(countdown) && (
              <div
                className="flex h-12 flex-1 flex-col items-center justify-center rounded-md"
                style={{ background: 'color(display-p3 0.082 0.098 0.118 / 0.8)' }}
              >
                <div className="font-montserrat countdown text-center text-2xl font-bold text-white">
                  <span style={{ '--value': countdown.minutes } as React.CSSProperties}>{countdown.minutes}</span>
                </div>
                <div className="font-montserrat text-neutral-content text-[8px]">{t('tournament:minutes')}</div>
              </div>
            )}
            {isGreaterThanOneSecond(countdown) && (
              <div
                className="flex h-12 flex-1 flex-col items-center justify-center rounded-md"
                style={{ background: 'color(display-p3 0.082 0.098 0.118 / 0.8)' }}
              >
                <div className="font-montserrat countdown text-center text-2xl font-bold text-white">
                  <span style={{ '--value': countdown.seconds } as React.CSSProperties}>{countdown.seconds}</span>
                </div>
                <div className="font-montserrat text-neutral-content text-[8px]">{t('tournament:seconds')}</div>
              </div>
            )}
          </div>
          <div
            className="flex h-11.5 w-full flex-col items-center justify-center rounded-lg"
            style={{ background: 'color(display-p3 0.082 0.098 0.118 / 0.8)' }}
          >
            <div className="font-montserrat text-[8px]">{t('tournament:progressivePrizePool')}</div>
            <NumberFlow
              prefix={symbolToUse + ' '}
              plugins={[continuous]}
              value={
                poolPrizeData.code === 0
                  ? Number(
                      formatCurrency(poolPrizeData.data, { includeSymbol: false }),
                      //   convertCurrency(poolPrizeData.data, {
                      //   sourceCurrency: 'USDT',
                      //   targetCurrency: user?.currency_fiat ?? '',
                      //   includeSymbol: false,
                      //   numberAmount: true,
                      // })
                    )
                  : 0
              }
              className="font-montserrat text-primary font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
