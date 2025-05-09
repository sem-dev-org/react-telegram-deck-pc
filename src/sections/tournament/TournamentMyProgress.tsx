import { useState, useEffect } from 'react';
import { ITournamentInfo, ITournamentTable } from '@/types/tournament';
import { getTournamentLeaderboard } from '@/api/tournament';
import Decimal from 'decimal.js';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useTranslation } from 'react-i18next';

type TournamentMyProgressProps = {
  data: ITournamentInfo;
  className?: string;
};

export const TournamentMyProgress = ({ data, className }: TournamentMyProgressProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // const { displayDecimal } = QueryCurrency(user?.currency_fiat ?? '');
  // const { rateForUSD } = QueryRateForUSD();

  // const symbolToUse: string = useMemo(() => {
  //   return getCurrencySymbolFun(user?.currency_fiat ?? '') ?? '';
  // }, [user]);

  const { formatCurrency } = useCurrencyFormatter();
  const { t } = useTranslation();
  return (
    <div
      className={`bg-base-100 collapse relative rounded-2xl ${className} overflow-hidden ${isOpen ? 'collapse-open' : 'collapse-close'}`}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="collapse-title flex flex-col gap-2 p-4"
        style={{
          background:
            'linear-gradient(180deg, color(display-p3 0.329 0.502 0.596 / 0.2) 0%, color(display-p3 0.114 0.137 0.165 / 0.2) 59.96%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <div className="text-base leading-6 font-bold">{t('tournament:myProgress')}</div>
        <div className="flex h-18 items-center gap-2">
          <div className="pr-2">
            <div className="text-primary text-lg leading-7 font-black">{data.rank} th</div>
            <div className="text-sm leading-5 font-bold">{t('tournament:myPosition')}</div>
          </div>

          <>
            <div className="bg-neutral h-10 w-[1px]" />
            <div className="p-2">
              <div className="text-primary text-lg leading-7 font-black">
                {/* {convertCurrency(data.wagered ?? 0, {
                  sourceCurrency: 'USDT',
                  targetCurrency: user?.currency_fiat ?? '',
                })}   */}
                {formatCurrency(data.wagered)}
                {/* {symbolToUse} {data.wagered ? Decimal(data.wagered).mul(rateForUSD).toDecimalPlaces(displayDecimal, Decimal.ROUND_DOWN).toFixed(displayDecimal) || '0' : '0'} */}
              </div>
              <div className="text-sm leading-5 font-bold">{t('tournament:wagered')}</div>
            </div>
          </>

          <>
            <div className="bg-neutral h-10 w-[1px]" />
            <div className="p-2">
              <div className="text-primary text-lg leading-7 font-black">
                {/* {convertCurrency(data.prize ?? 0, {
                  sourceCurrency: 'USDT',
                  targetCurrency: user?.currency_fiat ?? '',
                })} */}
                {formatCurrency(data.prize)}
                {/* {symbolToUse} {data.prize ? Decimal(data.prize).mul(rateForUSD).toDecimalPlaces(displayDecimal, Decimal.ROUND_DOWN).toFixed(displayDecimal) || '0' : '0'} */}
              </div>
              <div className="text-sm leading-5 font-bold">
                {t('tournament:prize')} ({data.prize_rate ? Decimal(data.prize_rate).mul(100).toString() : '0'}%)
              </div>
            </div>
          </>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="text-primary bg-primary h-3 w-3 rounded-full" />
            <div className="text-base leading-6 font-bold">
              {data?.tournament_level?.charAt(0)?.toUpperCase() + data?.tournament_level?.slice(1)}{' '}
              {t('tournament:leagueLeaderboard')}
            </div>
          </div>
          <div
            className={`flex items-center justify-center transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.66112 5.04695C3.87012 4.84599 4.20247 4.8525 4.40344 5.06151L7 7.81793L9.59656 5.06151C9.79753 4.8525 10.1299 4.84599 10.3389 5.04695C10.5479 5.24792 10.5544 5.58027 10.3534 5.78927L7.37844 8.93927C7.27946 9.04221 7.14281 9.10039 7 9.10039C6.85719 9.10039 6.72055 9.04221 6.62156 8.93927L3.64656 5.78927C3.4456 5.58027 3.45211 5.24792 3.66112 5.04695Z"
                fill="#A6ADBB"
                style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)' }}
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="collapse-content" style={{ padding: 0 }}>
        <Table data={data} isOpen={isOpen} />
      </div>
    </div>
  );
};

export const Table = ({ data, isOpen }: { data?: ITournamentInfo; isOpen: boolean }) => {
  const [tableData, setTableData] = useState<ITournamentTable[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    if (data && isOpen) {
      setLoading(true);
      getTournamentLeaderboard({
        tournament_id: data.tournament_id,
        tournament_level: data.tournament_level,
        limit: 10,
      })
        .then((res) => {
          setTableData(res.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [data, isOpen]);

  // const { displayDecimal } = QueryCurrency(user?.currency_fiat ?? '');
  // const { rateForUSD } = QueryRateForUSD();

  // const symbolToUse: string = useMemo(() => {
  //   return getCurrencySymbolFun(user?.currency_fiat ?? '') ?? '';
  // }, [user]);

  const { formatCurrency } = useCurrencyFormatter();

  return (
    <div className="relative h-122">
      <table
        className="bg-base-100 table w-full table-fixed rounded-[0]"
        style={{
          borderTop: '1px solid color(display-p3 0.082 0.098 0.118)',
        }}
      >
        <thead>
          <tr className="bg-base-200 text-base-content h-11 text-center text-sm font-semibold">
            <th>{t('tournament:player')}</th>
            <th>{t('tournament:wagered')}</th>
            <th>{t('tournament:prize')}</th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((item, index) => (
            <tr
              key={index}
              className="bg-base-300 h-11 text-center"
              style={{
                borderTop: '1px solid color(display-p3 0.082 0.098 0.118)',
                background: '#1D232A',
              }}
            >
              <th className="flex items-center gap-2 px-4">
                {index < 3 ? (
                  <img src={`/images/tournament/player-${index + 1}.png`} alt="" className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
                <div className="truncate text-sm font-semibold">
                  {item?.first_name && item?.last_name ? (
                    <>
                      {item?.first_name} {item?.last_name}
                    </>
                  ) : item?.username ? (
                    <>{item?.username}</>
                  ) : (
                    <>{item?.user_id}</>
                  )}
                </div>
              </th>
              <td>
                <div className="truncate text-sm font-semibold">
                  {/* {convertCurrency(item?.wagered ?? 0, {
                    sourceCurrency: 'USDT',
                    targetCurrency: user?.currency_fiat ?? '',
                  })} */}
                  {formatCurrency(item?.wagered)}
                  {/* {symbolToUse} {item?.wagered ? Decimal(item?.wagered).mul(rateForUSD).toDecimalPlaces(displayDecimal, Decimal.ROUND_DOWN).toFixed(displayDecimal) || '0' : '0'} */}
                </div>
              </td>
              <td>
                <div className="truncate text-sm font-semibold">
                  <span className="text-primary">
                    {/* {convertCurrency(item?.prize ?? 0, {
                      sourceCurrency: 'USDT',
                      targetCurrency: user?.currency_fiat ?? '',
                    })} */}
                    {formatCurrency(item?.prize)}
                    {/* {symbolToUse} {item?.prize ? Decimal(item?.prize).mul(rateForUSD).toDecimalPlaces(displayDecimal, Decimal.ROUND_DOWN).toFixed(displayDecimal) || '0' : '0'} */}
                  </span>
                  <span className="">
                    {' '}
                    (
                    {Decimal(item?.prize_rate ?? 0)
                      .mul(100)
                      .toString()}
                    %)
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && isOpen && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="loading loading-spinner loading-xl text-primary" />
        </div>
      )}
    </div>
  );
};
