import {
  getUserDepositOrders,
  getUserWithdrawOrders,
  OrderQueryParams,
  getUserSwapOrders,
  getUserBonusOrders,
} from '@/api/transaction';
import { SelectDropdown } from '@/components/ui';
import { useAuth } from '@/contexts/auth';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useSupportedCurrencies } from '@/query/finance';
import { ICurrency } from '@/types/coin';
import { IDepositOrder, ISwapOrder, IWithdrawOrder } from '@/types/transaction';
import { useInfiniteQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { TableVirtuoso } from 'react-virtuoso';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';
import { useSettingStore } from '@/store/setting';
import clsx from 'clsx';

// 将时间段转换为时间戳
const getPeriodTimestamp = (period: string): number => {
  const now = dayjs();

  switch (period) {
    case 'Past 90 Days':
      return now.subtract(90, 'day').unix();
    case 'Past 60 Days':
      return now.subtract(60, 'day').unix();
    case 'Past 30 Days':
      return now.subtract(30, 'day').unix();
    case 'Past 7 Days':
      return now.subtract(7, 'day').unix();
    case 'Past 24 Hours':
      return now.subtract(24, 'hour').unix();
    default:
      return now.subtract(90, 'day').unix();
  }
};

// 将状态码转换为显示文本
const getDepositStatusText = (status: number, t: any): string => {
  switch (status) {
    case 0:
      return t('transaction:transactionStatus.pending');
    case 1:
      return t('transaction:transactionStatus.success');
    case 2:
    case 8:
      return t('transaction:transactionStatus.failed');
    case 4:
      return t('transaction:transactionStatus.cancelled');
    default:
      return t('transaction:transactionStatus.unknown');
  }
};

const getPeriodOptions = (t: any): { id: string; label: string; value: string }[] => {
  return [
    { id: '1', label: t('transaction:filters.past90Days'), value: 'Past 90 Days' },
    { id: '2', label: t('transaction:filters.past60Days'), value: 'Past 60 Days' },
    { id: '3', label: t('transaction:filters.past30Days'), value: 'Past 30 Days' },
    { id: '4', label: t('transaction:filters.past7Days'), value: 'Past 7 Days' },
    { id: '5', label: t('transaction:filters.past24Hours'), value: 'Past 24 Hours' },
  ];
};
const getDepositTypeOptions = (t: any): { id: string; label: string; value: string }[] => {
  return [
    { id: '1', label: t('transaction:transactionTypes.deposit'), value: 'Deposit' },
    { id: '2', label: t('transaction:transactionTypes.withdrawal'), value: 'Withdraw' },
    { id: '3', label: t('transaction:transactionTypes.bonus'), value: 'Bonus' },
    { id: '4', label: t('finance:swap'), value: 'Swap' },
  ];
};

const getStatusOptions = (t: any): { id: string; label: string; value: number }[] => {
  return [
    { id: '-1', label: t('transaction:filters.allStatuses'), value: -1 },
    { id: '1', label: t('transaction:transactionStatus.success'), value: 1 },
    { id: '0', label: t('transaction:transactionStatus.pending'), value: 0 },
    { id: '2', label: t('transaction:transactionStatus.failed'), value: 2 },
    { id: '4', label: t('transaction:transactionStatus.cancelled'), value: 4 },
  ];
};

const getWithdrawStatusText = (status: number, t: any): string => {
  switch (status) {
    case 0:
    case 5:
    case 6:
      return t('transaction:transactionStatus.pending');
    case 1:
      return t('transaction:transactionStatus.success');
    case 2:
    case 3:
    case 4:
    case 7:
    case 8:
      return t('transaction:transactionStatus.failed');
    default:
      return t('transaction:transactionStatus.unknown');
  }
};

const getStatusColor = (status: number): string => {
  switch (status) {
    case 0:
      return 'text-warning';
    case 1:
      return 'text-base-content';
    case 2:
      return 'text-error';
    case 4:
      return 'text-info';
    default:
      return 'text-base-content/70';
  }
};

export const TransactionHistory = () => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState(getDepositTypeOptions(t)[0].value);
  const [selectedPeriod, setSelectedPeriod] = useState(getPeriodOptions(t)[0].value);
  const [selectedStatus, setSelectedStatus] = useState<number>(getStatusOptions(t)[0].value);
  const [selectedCurrency, setSelectedCurrency] = useState<ICurrency | null>(null);

  const { data: currencies } = useSupportedCurrencies();

  const currencyOptions = useMemo(() => {
    const allOption = {
      id: 'all',
      value: '',
      label: t('transaction:filters.allAssets'),
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

  const handleCurrencyChange = (value: string | number) => {
    if (value === '') {
      setSelectedCurrency(null);
      return;
    }

    const group = currencies?.find((c) => c.currency === value);
    if (group) {
      setSelectedCurrency(group);
    }
  };

  // 计算查询参数
  const queryParams = useMemo<OrderQueryParams>(() => {
    const params: OrderQueryParams = {
      limit: 10,
    };

    // 只有在选择了特定状态时才添加状态筛选
    if (selectedStatus !== -1) {
      params.status = selectedStatus;
    }

    // 添加货币筛选
    if (selectedCurrency?.currency) {
      params.currency = selectedCurrency.currency;
    }

    // 添加时间段筛选
    params.end_timestamp = getPeriodTimestamp(selectedPeriod);

    return params;
  }, [selectedStatus, selectedCurrency, selectedPeriod]);

  return (
    <div className="flex h-full flex-1 flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <SelectDropdown
          options={getDepositTypeOptions(t)}
          value={selectedType}
          onChange={(value) => setSelectedType(`${value}`)}
          className="text-sm font-semibold"
          dropdownContainerClassName="inline-flex"
        />
        <SelectDropdown
          options={getStatusOptions(t)}
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(Number(value))}
          className="text-sm font-semibold"
          dropdownContainerClassName="inline-flex"
        />
        <SelectDropdown
          options={getPeriodOptions(t)}
          value={selectedPeriod}
          onChange={(value) => setSelectedPeriod(`${value}`)}
          className="text-sm font-semibold"
          dropdownContainerClassName="inline-flex"
        />
        <SelectDropdown
          options={currencyOptions ?? []}
          value={selectedCurrency?.currency || ''}
          onChange={handleCurrencyChange}
          placeholder={t('transaction:filters.asset')}
          className="text-sm font-semibold"
          dropdownContainerClassName="inline-flex"
        />
      </div>

      <Table type={selectedType} queryParams={queryParams} />

      <div className="text-base-content flex items-center gap-4 text-sm">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7 2.1875C4.34213 2.1875 2.1875 4.34213 2.1875 7C2.1875 9.65787 4.34213 11.8125 7 11.8125C9.65787 11.8125 11.8125 9.65787 11.8125 7C11.8125 4.34213 9.65787 2.1875 7 2.1875ZM1.3125 7C1.3125 3.85888 3.85888 1.3125 7 1.3125C10.1411 1.3125 12.6875 3.85888 12.6875 7C12.6875 10.1411 10.1411 12.6875 7 12.6875C3.85888 12.6875 1.3125 10.1411 1.3125 7ZM6.5625 4.8125C6.5625 4.57088 6.75838 4.375 7 4.375H7.00437C7.246 4.375 7.44187 4.57088 7.44187 4.8125V4.81687C7.44187 5.0585 7.246 5.25437 7.00437 5.25437H7C6.75838 5.25437 6.5625 5.0585 6.5625 4.81687V4.8125ZM6.39105 6.15909C7.05968 5.82477 7.81254 6.42869 7.63123 7.15393L7.21764 8.80829L7.24184 8.79619C7.45795 8.68813 7.72075 8.77572 7.82881 8.99184C7.93687 9.20795 7.84928 9.47075 7.63316 9.57881L7.60896 9.59091C6.94032 9.92523 6.18746 9.32131 6.36877 8.59607L6.78236 6.94171L6.75816 6.95381C6.54204 7.06187 6.27925 6.97427 6.17119 6.75816C6.06313 6.54204 6.15073 6.27925 6.36684 6.17119L6.39105 6.15909Z"
            fill="#A6ADBB"
            style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
          />
        </svg>
        {t('transaction:transactionTypes.deposit')} {t('transaction:transactionStatus.pending')}
      </div>
    </div>
  );
};

type TransactionItemProps = {
  transaction: (IDepositOrder & { type: string }) | (IWithdrawOrder & { type: string });
};

const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { convertCurrency } = useCurrencyFormatter();
  const { displayInFiat } = useSettingStore();

  const statusText =
    transaction.type === 'Withdraw'
      ? getWithdrawStatusText(transaction.status, t)
      : getDepositStatusText(transaction.status, t);
  const formattedDate = dayjs.unix(transaction.created_at).format('DD/MM/YYYY HH:mm:ss');
  const getTitle = () => {
    if (transaction.type === 'Deposit') {
      return transaction.network === 'FIAT'
        ? t('transaction:transactionTypes.fiatDeposit')
        : t('transaction:transactionTypes.cryptoDeposit');
    }
    if (transaction.type === 'Withdraw') {
      return transaction.network === 'FIAT'
        ? t('transaction:transactionTypes.fiatWithdraw')
        : t('transaction:transactionTypes.cryptoWithdraw');
    }
    if (transaction.type === 'Bonus') {
      return t(`transaction:transactionTypes.${transaction.note}`);
    }
  };

  const renderBonusCell = () => (
    <td>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1">
          <p className="text-success text-sm font-semibold">
            {convertCurrency(transaction.bonus, {
              sourceCurrency: transaction.currency,
              targetCurrency: displayInFiat ? (user?.currency_fiat ?? 'USD') : transaction.currency,
              showPlus: true,
              includeSymbol: true,
            })}
          </p>
          <img
            src={`/icons/tokens/${transaction.currency.toLowerCase()}.svg`}
            className="h-4 w-4"
            alt={transaction.currency}
          />
        </div>
      </div>
    </td>
  );

  const renderTransactionCell = () => (
    <td>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1">
          <p
            className={clsx('text-sm font-semibold', {
              'text-success': transaction.type === 'Deposit',
              'text-error': transaction.type === 'Withdraw',
            })}
          >
            {convertCurrency(transaction.type === 'Deposit' ? transaction.amount : -transaction.amount, {
              sourceCurrency: transaction.currency,
              targetCurrency: displayInFiat ? (user?.currency_fiat ?? 'USD') : transaction.currency,
              showPlus: true,
              includeSymbol: true,
            })}
          </p>
          <img
            src={`/icons/tokens/${transaction.currency.toLowerCase()}.svg`}
            className="h-4 w-4"
            alt={transaction.currency}
          />
        </div>
        <div className="mr-0.5 flex items-center gap-1">
          <p className={`text-sm font-semibold ${getStatusColor(transaction.status)}`}>{statusText}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            className="fill-base-content"
            viewBox="0 0 256 256"
          >
            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
          </svg>
        </div>
      </div>
    </td>
  );

  const renderCell = useMemo(() => {
    if (transaction.type === 'Bonus') {
      return renderBonusCell();
    }

    return renderTransactionCell();
  }, [transaction.type]);

  const renderIcon = useMemo(() => {
    if (transaction.type === 'Bonus') {
      return <img src="/icons/deposit.svg" className="h-4 w-4" alt="bonus" />;
    }

    if (transaction.type === 'Withdraw') {
      return <img src="/icons/withdraw.svg" className="h-4 w-4" alt="withdraw" />;
    }

    return <img src="/icons/deposit.svg" className="h-4 w-4" alt="deposit" />;
  }, [transaction.type]);

  return (
    <>
      <td className="h-16">
        <div className="flex items-center gap-4">
          {renderIcon}
          <div className="flex flex-col gap-1">
            <p className="text-base-content text-sm font-semibold">{getTitle()}</p>
            <p className="text-base-content/50 truncate text-sm">{formattedDate}</p>
          </div>
        </div>
      </td>
      {renderCell}
    </>
  );
};

type SwapTransactionItemProps = {
  transaction: ISwapOrder & { type: string };
};

export const SwapTransactionItem = ({ transaction }: SwapTransactionItemProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { convertCurrency } = useCurrencyFormatter();
  const { displayInFiat } = useSettingStore();

  const formattedDate = dayjs.unix(transaction.created_at).format('DD/MM/YYYY HH:mm:ss');

  return (
    <>
      <td className="h-16">
        <div className="flex items-center gap-4">
          <img src="/icons/swap.svg" className="h-4 w-4" alt="swap" />
          <div className="flex flex-col gap-1">
            <p className="text-base-content text-sm font-semibold">{t('transaction:common.swap')}</p>
            <p className="text-base-content/50 truncate text-sm">{formattedDate}</p>
          </div>
        </div>
      </td>
      <td>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            <p className="text-error text-sm font-semibold">
              {convertCurrency(-transaction.from_amount, {
                sourceCurrency: transaction.from_currency,
                targetCurrency: transaction.from_currency,
                showPlus: true,
                includeSymbol: true,
              })}
            </p>
            <img
              src={`/icons/tokens/${transaction.from_currency.toLowerCase()}.svg`}
              className="h-4 w-4"
              alt={transaction.from_currency}
            />
          </div>

          <div className="flex items-center gap-1">
            <p className="text-success text-sm font-semibold">
              {convertCurrency(transaction.to_amount, {
                sourceCurrency: transaction.to_currency,
                targetCurrency: displayInFiat ? (user?.currency_fiat ?? 'USD') : transaction.to_currency,
                showPlus: true,
                includeSymbol: true,
              })}
            </p>
            <img
              src={`/icons/tokens/${transaction.to_currency.toLowerCase()}.svg`}
              className="h-4 w-4"
              alt={transaction.to_currency}
            />
          </div>
        </div>
      </td>
    </>
  );
};

const Table = ({ type, queryParams }: { type: string; queryParams: OrderQueryParams }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDeposit = type === 'Deposit';

  // 根据交易类型选择不同的API调用
  const { data, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['transactions', type, queryParams],
    queryFn: async ({ pageParam }) => {
      const params = {
        ...queryParams,
        last_id: pageParam || 0,
      };

      // 根据交易类型调用相应的API
      switch (type) {
        case 'Withdraw':
          return getUserWithdrawOrders(params);
        case 'Bonus':
          return getUserBonusOrders(params);
        case 'Swap':
          return getUserSwapOrders(params);
        default:
          return getUserDepositOrders(params);
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const items = lastPage.data || [];
      if (items.length === 0) return undefined;
      return items[items.length - 1].id;
    },
    enabled: !!user,
  });
  // 提取所有交易数据
  const allTransactions = data?.pages.flatMap((page) => page || []) || [];
  const hasData = allTransactions.length > 0;
  console.log(allTransactions);

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
        onClick={() => {
          if (type !== 'Bonus') {
            navigate(`${paths.main.transaction.details}${props.item.id}`, {
              state: { ...props.item, fromTab: 'history', isDeposit },
            });
          }
        }}
        {...props}
      />
    ),
  };

  return (
    <div className={`relative flex h-full w-full flex-1 flex-col overflow-hidden rounded-xl`}>
      {hasData ? (
        <TableVirtuoso
          className="bg-base-200 flex h-full flex-1 flex-col"
          components={TableComponents}
          endReached={() => fetchNextPage()}
          data={allTransactions}
          fixedHeaderContent={() => (
            <tr className="bg-base-100 text-base-content border-base-300 h-10 border-b text-center text-xs font-bold">
              <th className="truncate text-left">{t('transaction:transactionTypes.transaction')}</th>
              {type === 'Swap' && <th className="w-1/2 text-right">{t('transaction:common.swapFromTo')}</th>}
              {(type === 'Deposit' || type === 'Withdraw' || type === 'Bonus') && (
                <th className="text-right">{t('transaction:tableHeaders.amount')}</th>
              )}
            </tr>
          )}
          itemContent={(_, item) => {
            if (type === 'Swap') {
              return <SwapTransactionItem transaction={item} />;
            }
            return (
              <TransactionItem
                transaction={{
                  ...item,
                  type,
                }}
              />
            );
          }}
        />
      ) : (
        <div className="flex h-full w-full flex-1 flex-col">
          <div className="bg-base-100 flex h-10 items-center justify-between px-4 text-xs font-bold">
            <div className="text-left">{t('transaction:transactionTypes.transaction')}</div>
            <div className="text-right">{t('transaction:tableHeaders.amount')}</div>
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
                  {t('transaction:common.noTransactionRecords')}
                </p>
                <p className="text-base-content/50 mt-1 text-center text-sm">
                  {t('transaction:common.tryChangingFilter')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
