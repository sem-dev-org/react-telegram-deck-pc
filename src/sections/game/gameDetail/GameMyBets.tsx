import { useUserBetHistory } from '@/query/game';
import { CurrencyImage } from '@/components/ui/CurrencyImage';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { IBetHistory } from '@/types/transaction';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TableVirtuoso } from 'react-virtuoso';

import { useAuth } from '@/contexts/auth';
import { useSettingStore } from '@/store/setting';
import Decimal from 'decimal.js';

export const GameMyBets = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { convertCurrency } = useCurrencyFormatter();
  const { displayInFiat } = useSettingStore();
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  
  const { data: betHistoryResponse, isLoading } = useUserBetHistory({
    page,
    page_size: 20,
    time_range: 90
  });

  const data = useMemo(() => {
    return betHistoryResponse?.data || [];
  }, [betHistoryResponse]);

  useEffect(() => {
    if (betHistoryResponse?.pagination) {
      setHasNextPage(betHistoryResponse.pagination.has_more);
    }
  }, [betHistoryResponse]);

  const loadMoreData = useCallback(() => {
    if (!hasNextPage || isLoading) return;
    setPage(prevPage => prevPage + 1);
  }, [hasNextPage, isLoading]);

  const TableComponents = {
    Table: (props: React.HTMLProps<HTMLTableElement>) => (
      <table
        className="bg-base-100 table w-full table-fixed rounded"
        // style={{
        //   borderTop: '1px solid color(display-p3 0.082 0.098 0.118)',
        // }}
        {...props}
      />
    ),
    TableRow: (props: React.HTMLProps<HTMLTableRowElement>) => (
      <tr
        className="border-base-300 h-11 border-t text-center"
        // style={{
        //   borderTop: '1px solid #191E24',
        //   background: '#1D232A',
        // }}
        {...props}
      />
    ),
  };

  const parseX = (item: IBetHistory) => {
    // 根据item.bet_amount > 0 那么这一条就是下注记录
    // 如果是下注记录, 那么需要根据item.parent_bet_id 找到另外一parent_bet_id 一样的记录
    // 然后根据中奖记录的win_amount 和下注记录的bet_amount 计算出x
    if (parseFloat(item.bet_amount) === 0) {
      // 要过滤出parent_bet_id 一样的排除item本身
      const parentBet = data.filter((bet) => bet.parent_bet_id === item.parent_bet_id && bet.id !== item.id);

      if (parentBet.length > 0) {
        const winAmount = new Decimal(item.win_amount || 0);
        const betAmount = new Decimal(parentBet[0].bet_amount || 0);
        
        // Return '--' if bet amount is 0 to avoid division by zero
        if (betAmount.isZero()) {
          return '--';
        }
        
        const result = winAmount.div(betAmount);
        // Return '--' if result is invalid (NaN or Infinity)
        if (!result.isFinite()) {
          return '--';
        }
        
        return result.toFixed(2);
      }
    }
    return '--';
  };

  return (
    <div className={`relative h-121 w-full`}>
      <TableVirtuoso
        style={{
          height: '100%',
        }}
        components={TableComponents}
        endReached={loadMoreData}
        data={data}
        fixedHeaderContent={() => (
          <tr className="bg-base-200 text-base-content h-11 text-sm font-semibold">
            <th className="px-2">{t('gameDetail:betId')}</th>
            <th className="px-2">{t('gameDetail:bet')}</th>
            <th className="px-2 text-center">{t('gameDetail:x')}</th>
            <th className="px-2">{t('gameDetail:profit')}</th>
          </tr>
        )}
        itemContent={(_, item) => (
          <>
            <td className="truncate px-2 text-sm font-semibold">{item.bet_id}</td>
            <td className="flex items-center gap-2 px-2 text-sm font-semibold">
              <CurrencyImage className="h-4 w-4" currency={item.real_currency} />
              <div className="truncate">
                {convertCurrency(item.real_bet_amount, {
                  sourceCurrency: item.real_currency,
                  targetCurrency: displayInFiat ? user?.currency_fiat || '' : item.real_currency || '',
                  useThousandsSeparator: true,
                  useCompactFormat: true,
                })}
              </div>
            </td>
            <td className="w-18 px-2">
              <div className="truncate text-center text-sm font-semibold">{parseX(item)}</div>
            </td>
            <td className="flex items-center gap-2 px-2 text-sm font-semibold">
              <CurrencyImage className="h-4 w-4" currency={item.real_currency} />
              <div className="truncate">
                {convertCurrency(item.real_win_amount, {
                  sourceCurrency: item.real_currency,
                  targetCurrency: displayInFiat ? user?.currency_fiat || '' : item.real_currency || '',
                  useThousandsSeparator: true,
                  useCompactFormat: true,
                })}
              </div>
            </td>
          </>
        )}
      />
      {data.length === 0 && !hasNextPage && (
        <div className="absolute top-4 flex h-full w-full flex-col items-center justify-center">
          <img src="/images/mybets.png" alt="mybets" className="h-23.5 w-23.5" />
          <div className="text-xs font-bold">{t('gameDetail:noRecordsFound')}</div>
        </div>
      )}
    </div>
  );
};
