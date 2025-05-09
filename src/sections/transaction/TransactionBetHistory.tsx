import { BetHistoryQueryParams } from '@/api/transaction';
import { SelectDropdown } from '@/components/ui';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useSupportedCurrencies } from '@/query/finance';
import { useUserBetHistory } from '@/query/game';
import { IBetHistory } from '@/types/transaction';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { TableVirtuoso } from 'react-virtuoso';
import { useTranslation } from 'react-i18next';
import { CopyBtn } from '@/components/ui/CopyBtn';
import { useSettingStore } from '@/store/setting';
import { useAuth } from '@/contexts/auth';

export const TransactionBetHistory = () => {
  const { t } = useTranslation();
  // State for filters
  const [selectedGameType, setSelectedGameType] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState(60);
  const [selectedPage, setSelectedPage] = useState(1);

  // 获取支持的货币
  const { data: currencies } = useSupportedCurrencies();

  // Options for filters
  const gameTypeOptions = [
    { id: 'all', value: 'all', label: t('transaction:filters.all') },
    { id: 'slots', value: 'slots', label: t('transaction:gameTypes.slots') },
    { id: 'crash', value: 'crash', label: t('transaction:gameTypes.crash') },
    { id: 'roulette', value: 'roulette', label: t('transaction:gameTypes.roulette') },
    { id: 'fishing', value: 'fishing', label: t('transaction:gameTypes.fishing') },
    { id: 'poker', value: 'poker', label: t('transaction:gameTypes.poker') },
    { id: 'blockchain', value: 'blockchain', label: t('transaction:gameTypes.blockchain') },
    { id: 'keno', value: 'keno', label: t('transaction:gameTypes.keno') },
    { id: 'table', value: 'table', label: t('transaction:gameTypes.table') },
    { id: 'show', value: 'show', label: t('transaction:gameTypes.show') },
    { id: 'arcade', value: 'arcade', label: t('transaction:gameTypes.arcade') },
    { id: 'live', value: 'live', label: t('transaction:gameTypes.live') },
  ];

  // 动态生成资产选项列表
  const assetOptions = useMemo(() => {
    const allOption = {
      id: 'all',
      value: 'all',
      label: t('transaction:filters.all') + ' ' + t('transaction:filters.asset'),
      icon: null,
    };

    const options =
      currencies?.map((item) => ({
        id: item.currency,
        value: item.currency,
        label: item.currency,
        icon: <img src={item.icon ?? ''} className="h-4 w-4" alt={item.currency} />,
      })) || [];

    return [allOption, ...options];
  }, [currencies, t]);

  const periodOptions = [
    { id: '1', value: 1, label: t('transaction:filters.past24Hours') },
    { id: '7', value: 7, label: t('transaction:filters.past7Days') },
    { id: '30', value: 30, label: t('transaction:filters.past30Days') },
    { id: '60', value: 60, label: t('transaction:filters.past60Days') },
    { id: '90', value: 90, label: t('transaction:filters.past90Days') },
  ];

  // Build query params
  const queryParams: BetHistoryQueryParams = useMemo(() => {
    const params: BetHistoryQueryParams = {
      time_range: selectedPeriod,
      page: selectedPage,
      page_size: 20,
    };

    if (selectedGameType !== 'all') {
      params.game_type = selectedGameType;
    }

    if (selectedAsset !== 'all') {
      params.asset = selectedAsset;
    }

    return params;
  }, [selectedGameType, selectedAsset, selectedPeriod, selectedPage]);

  // Fetch bet history
  const { data: betHistoryResponse, isLoading } = useUserBetHistory(queryParams);
  const betHistory = betHistoryResponse?.data || [];
  const pagination = betHistoryResponse?.pagination;

  // 添加调试信息
  console.log('bet history data:', betHistory);
  console.log('pagination:', pagination);

  // Handle loading more data
  const handleLoadMore = () => {
    if (pagination?.has_more) {
      setSelectedPage((prev) => prev + 1);
    }
  };

  // Table components
  const TableComponents = {
    Table: (props: any) => (
      <table
        className="table w-full table-fixed"
        style={{
          borderTop: '1px solid color(display-p3 0.082 0.098 0.118)',
        }}
        {...props}
      />
    ),
    TableRow: (props: any) => (
      <tr
        className="border-base-300 border-b"
        style={{
          borderTop: '1px solid color(display-p3 0.082 0.098 0.118)',
        }}
        {...props}
      />
    ),
  };

  return (
    <div className="flex h-full flex-1 flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <SelectDropdown
            options={gameTypeOptions}
            value={selectedGameType}
            onChange={(value) => setSelectedGameType(value as string)}
            className="w-full text-sm font-semibold"
            dropdownContainerClassName="inline-flex w-full"
          />
        </div>
        <div className="col-span-1">
          <SelectDropdown
            options={assetOptions}
            value={selectedAsset}
            onChange={(value) => setSelectedAsset(value as string)}
            className="text-sm font-semibold"
            dropdownContainerClassName="inline-flex"
          />
        </div>
        <div className="col-span-1">
          <SelectDropdown
            options={periodOptions}
            value={selectedPeriod}
            onChange={(value) => setSelectedPeriod(Number(value))}
            className="text-sm font-semibold"
            dropdownContainerClassName="inline-flex"
          />
        </div>
      </div>

      <div className={`relative flex h-full w-full flex-1 flex-col overflow-hidden rounded-xl`}>
        {Array.isArray(betHistory) && betHistory.length > 0 ? (
          <TableVirtuoso
            className="bg-base-200 flex h-full flex-1 flex-col"
            components={TableComponents}
            endReached={handleLoadMore}
            data={betHistory}
            fixedHeaderContent={() => (
              <tr className="bg-base-100 text-base-content h-10 text-center text-xs font-bold">
                <th className="text-left">
                  {t('transaction:tableHeaders.game')} | {t('transaction:tableHeaders.time')}
                </th>
                <th className="text-right">
                  {t('transaction:betHistory.profit')} | {t('transaction:betHistory.wager')} |{' '}
                  {t('transaction:betHistory.bet')} ID
                </th>
              </tr>
            )}
            itemContent={(_, item) => <BetHistoryItem bet={item} />}
          />
        ) : (
          <div className="flex h-full w-full flex-1 flex-col">
            <div className="bg-base-100 flex h-10 items-center justify-between px-4 text-xs font-bold">
              <div className="text-left">
                {t('transaction:tableHeaders.game')} | {t('transaction:tableHeaders.time')}
              </div>
              <div className="text-right">
                {t('transaction:betHistory.profit')} | {t('transaction:betHistory.wager')} |{' '}
                {t('transaction:betHistory.bet')} ID
              </div>
            </div>
            <div className="bg-base-200 flex h-full w-full flex-1 items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="loading loading-spinner text-primary"></div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <img src="/images/empty.png" className="h-22 w-22" alt="empty" />
                  <p className="text-base-content/70 mt-4 text-center text-base font-semibold">
                    {t('transaction:common.noRecords')}
                  </p>
                  <p className="text-base-content/50 mt-1 text-center text-sm">{t('transaction:filters.type')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

type BetHistoryItemProps = {
  bet: IBetHistory;
};

const BetHistoryItem = ({ bet }: BetHistoryItemProps) => {
  const { t } = useTranslation();
  const { user} = useAuth();
  const { convertCurrency } = useCurrencyFormatter();
  const formattedDate = dayjs.unix(bet.created_at).format('DD/MM/YYYY HH:mm:ss');
  const {displayInFiat} = useSettingStore();
  // 添加调试信息
  console.log('Rendering bet item:', bet);

  // Calculate profit (win_amount - bet_amount)
  const profit = parseFloat(bet.win_amount) - parseFloat(bet.bet_amount);
  const isProfitable = profit >= 0;

  return (
    <>
      <td>
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">{bet.game_name || t('transaction:gameTypes.unknown')}</p>
            <p className="text-base-content/50 text-sm">
              {bet.game_provider.toUpperCase() || t('transaction:tableHeaders.gameProvider')}
            </p>
            <p className="text-base-content/50 text-sm">{formattedDate}</p>
          </div>
        </div>
      </td>
      <td>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            <p className={`text-sm font-semibold ${isProfitable ? 'text-success' : 'text-error'}`}>
              {convertCurrency(profit.toString(), {
                sourceCurrency: bet.currency,
                targetCurrency: displayInFiat ? user?.currency_fiat ?? 'USD' : bet.currency,
                showPlus: isProfitable,
                includeSymbol: true,
              })}
            </p>
            <img
              src={`/icons/tokens/${bet.real_currency?.toLowerCase() || 'default'}.svg`}
              className="h-4 w-4"
              alt={bet.real_currency || 'Currency'}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icons/tokens/default.svg';
              }}
            />
          </div>
          <div className="mr-0.5 flex items-center gap-1">
            <p className="text-base-content/50 text-sm">
              {convertCurrency(bet.bet_amount, {
                sourceCurrency: bet.currency,
                targetCurrency: displayInFiat ? user?.currency_fiat ?? 'USD' : bet.currency,
                showPlus: false,
                includeSymbol: true,
              })}
            </p>
          </div>
          <div className="mr-0.5 flex items-center justify-end gap-1">
            <div className="text-base-content/50 w-22.5 truncate text-sm">{bet.bet_id}</div>
            <CopyBtn className="h-3 w-3" text={bet.bet_id} showText={false} iconClassName="!fill-base-content" />
          </div>
        </div>
      </td>
    </>
  );
};
