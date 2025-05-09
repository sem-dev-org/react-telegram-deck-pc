import { SelectDropdown } from '@/components/ui';
import { CurrencyImage } from '@/components/ui/CurrencyImage';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useUserRollover } from '@/query/finance';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';
import { useSettingStore } from '@/store/setting';
import { useAuth } from '@/contexts/auth';

// Define interface for the actual API response format
interface RolloverItem {
  id: number;
  team_id: number;
  user_id: number;
  currency: string;
  payment_gateway: string;
  payment_gateway_id: number;
  deposit_id: string;
  amount: string;
  status: string;
  txid: string;
  created_at: number;
  updated_at: number;
  number: string;
  expire_at: number;
  network: string;
  bonus: string;
  wager: string;
  max_wager: string;
  promotion_id: number;
  gas_fix_fee: string;
  gas_fee: string | null;
  amount_real: string | null;
  gas_fee_rate: string | null;
  amount_usdt_rate: string | null;
}

export const TransactionRollover = () => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  const typeOptions = [
    { id: 'all', value: 'All Types', label: t('transaction:filters.all') + ' ' + t('transaction:filters.type') },
    { id: 'deposit', value: 'Deposit', label: t('transaction:transactionTypes.deposit') },
    { id: 'bonus', value: 'Bonus', label: t('transaction:transactionTypes.bonus') },
  ];

  const statusOptions = [
    {
      id: 'all',
      value: 'All Statuses',
      label: t('transaction:filters.all') + ' ' + t('transaction:tableHeaders.status'),
    },
    { id: 'not_started', value: 'Not Started', label: t('transaction:transactionStatus.notStarted') },
    { id: 'ongoing', value: 'Ongoing', label: t('transaction:transactionStatus.ongoing') },
    { id: 'done', value: 'Done', label: t('transaction:transactionStatus.done') },
  ];

  // Calculate query parameters for the API call
  const queryParams = useMemo(() => {
    let params = {
      limit: 20,
      last_id: 0,
      type: selectedType === 'All Types' ? undefined : selectedType,
      statuses: selectedStatus === 'All Statuses' ? undefined : selectedStatus,
      end_timestamp: dayjs().subtract(90, 'day').unix().toString(),
    };
    if (selectedType === 'All Types') {
      delete params.type;
    }
    if (selectedStatus === 'All Statuses') {
      delete params.statuses;
    }
    return params;
  }, [selectedType, selectedStatus]);

  // Fetch rollover transactions using the query
  const { data: rolloverData, isLoading } = useUserRollover(queryParams);

  // Get status text based on the status code
  const getStatusText = (transaction: RolloverItem): string => {
    if (Number(transaction.wager) == 0) {
      return t('transaction:transactionStatus.done');
    }
    if (Number(transaction.wager) == Number(transaction.max_wager)) {
      return t('transaction:transactionStatus.notStarted');
    }
    if (Number(transaction.wager) < Number(transaction.max_wager) && Number(transaction.wager) > 0) {
      return t('transaction:transactionStatus.ongoing');
    }
    return '';
  };

  return (
    <div className="flex h-full flex-1 flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center">
          <SelectDropdown
            options={typeOptions}
            value={selectedType}
            onChange={(value) => setSelectedType(value as string)}
            className="w-full text-sm font-semibold"
            dropdownContainerClassName="inline-flex w-full"
          />
        </div>

        <div className="flex items-center">
          <SelectDropdown
            options={statusOptions}
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value as string)}
            className="w-full text-sm font-semibold"
            dropdownContainerClassName="inline-flex w-full"
          />
        </div>
      </div>

      <div className="flex h-full flex-1 flex-col overflow-hidden rounded-xl">
        <div className="bg-base-100 flex h-10 items-center justify-between px-4">
          <div className="text-base-content/60 text-xs font-bold">
            {t('transaction:tabs.rollover')} {t('transaction:filters.type')}
          </div>
        </div>

        <div className="bg-base-300 flex flex-1 flex-col gap-[1px]">
          {isLoading ? (
            <div className="bg-base-200 flex h-full flex-1 items-center justify-center">
              <div className="loading loading-spinner text-primary"></div>
            </div>
          ) : rolloverData && rolloverData.length > 0 ? (
            rolloverData.map((transaction: RolloverItem) => (
              <TransactionItem key={transaction.id} transaction={transaction} getStatusText={getStatusText} />
            ))
          ) : (
            <div className="bg-base-200 flex h-full flex-1 items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <img src="/images/empty.png" className="h-22 w-22" alt="empty" />
                <p className="text-base-content/70 mt-4 text-center text-base font-semibold">
                  {t('transaction:common.noRecords')}
                </p>
                <p className="text-base-content/50 mt-1 text-center text-sm">{t('transaction:filters.type')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type TransactionItemProps = {
  transaction: RolloverItem;
  getStatusText: (transaction: RolloverItem) => string;
};

const TransactionItem = ({ transaction, getStatusText }: TransactionItemProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  // Format the date using dayjs
  const formattedDate = dayjs.unix(transaction.created_at).format('DD/MM/YYYY HH:mm:ss');

  // Determine transaction type based on payment gateway or other fields
  // For now, we'll just use "Deposit" as that's what's shown in the example
  const transactionType =
    transaction.network === 'bonus'
      ? t('transaction:transactionTypes.bonus')
      : t('transaction:transactionTypes.deposit');

  const { convertCurrency } = useCurrencyFormatter();

  const { displayInFiat } = useSettingStore();

  return (
    <div
      className="bg-base-200 flex h-16 items-center justify-between px-4"
      onClick={() =>
        navigate(`${paths.main.transaction.details}${transaction.id}`, {
          state: { ...transaction, fromTab: 'rollover', isDeposit: true },
        })
      }
    >
      <div className="flex items-center gap-3">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_2120_3509)">
            <path
              d="M11.74 8.90039H11.99C12.265 8.90039 12.49 8.67539 12.49 8.40039C12.49 8.12539 12.265 7.90039 11.99 7.90039H11.74C11.465 7.90039 11.24 8.12539 11.24 8.40039C11.24 8.67539 11.465 8.90039 11.74 8.90039Z"
              fill="#A6ADBB"
              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
            />
            <path
              d="M7.73499 7.90039H7.48499C7.20999 7.90039 6.98499 8.12539 6.98499 8.40039C6.98499 8.67539 7.20999 8.90039 7.48499 8.90039H7.73499C8.00999 8.90039 8.23498 8.67539 8.23498 8.40039C8.23498 8.12539 8.00999 7.90039 7.73499 7.90039Z"
              fill="#A6ADBB"
              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
            />
            <path
              d="M9.85999 7.90039H9.60999C9.33499 7.90039 9.10999 8.12539 9.10999 8.40039C9.10999 8.67539 9.33499 8.90039 9.60999 8.90039H9.85999C10.135 8.90039 10.36 8.67539 10.36 8.40039C10.36 8.12539 10.135 7.90039 9.85999 7.90039Z"
              fill="#A6ADBB"
              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
            />
            <path
              d="M5.60498 7.90039H5.35498C5.07998 7.90039 4.85498 8.12539 4.85498 8.40039C4.85498 8.67539 5.07998 8.90039 5.35498 8.90039H5.60498C5.87998 8.90039 6.10498 8.67539 6.10498 8.40039C6.10498 8.12539 5.87998 7.90039 5.60498 7.90039Z"
              fill="#A6ADBB"
              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
            />
            <path
              d="M11.99 12.7451H11.74C11.465 12.7451 11.24 12.9701 11.24 13.2451C11.24 13.5201 11.465 13.7451 11.74 13.7451H11.99C12.265 13.7451 12.49 13.5201 12.49 13.2451C12.49 12.9701 12.265 12.7451 11.99 12.7451Z"
              fill="#A6ADBB"
              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
            />
            <path
              d="M7.73499 12.7451H7.48499C7.20999 12.7451 6.98499 12.9701 6.98499 13.2451C6.98499 13.5201 7.20999 13.7451 7.48499 13.7451H7.73499C8.00999 13.7451 8.23498 13.5201 8.23498 13.2451C8.23498 12.9701 8.00999 12.7451 7.73499 12.7451Z"
              fill="#A6ADBB"
              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
            />
            <path
              d="M9.85999 12.7451H9.60999C9.33499 12.7451 9.10999 12.9701 9.10999 13.2451C9.10999 13.5201 9.33499 13.7451 9.60999 13.7451H9.85999C10.135 13.7451 10.36 13.5201 10.36 13.2451C10.36 12.9701 10.135 12.7451 9.85999 12.7451Z"
              fill="#A6ADBB"
              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
            />
            <path
              d="M5.60498 12.7451H5.35498C5.07998 12.7451 4.85498 12.9701 4.85498 13.2451C4.85498 13.5201 5.07998 13.7451 5.35498 13.7451H5.60498C5.87998 13.7451 6.10498 13.5201 6.10498 13.2451C6.10498 12.9701 5.87998 12.7451 5.60498 12.7451Z"
              fill="#A6ADBB"
              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
            />
            <path
              d="M15 9.28039H14.46V7.42539C14.46 6.72039 13.885 6.14539 13.175 6.14539H2.07C1.755 6.14539 1.5 5.89039 1.5 5.57539V5.22039C1.5 4.90539 1.755 4.65039 2.07 4.65039H3.97C4.245 4.65039 4.47 4.42539 4.47 4.15039C4.47 3.87539 4.245 3.65039 3.97 3.65039H2.07C1.205 3.65039 0.5 4.35539 0.5 5.22039V13.4454C0.5 14.5804 1.425 15.5054 2.56 15.5054H13.175C13.885 15.5054 14.46 14.9304 14.46 14.2254V12.3704H15C15.275 12.3704 15.5 12.1454 15.5 11.8704V9.78539C15.5 9.51039 15.275 9.28539 15 9.28539V9.28039ZM1.5 13.4404V7.03539C1.68 7.10539 1.87 7.14539 2.07 7.14539H2.875V14.5004H2.56C1.975 14.5004 1.5 14.0254 1.5 13.4404ZM13.46 14.2204C13.46 14.3754 13.33 14.5004 13.175 14.5004H3.875V7.14539H13.175C13.33 7.14539 13.46 7.27039 13.46 7.42539V9.28039H13.065C12.215 9.28039 11.525 9.97039 11.525 10.8204C11.525 11.6704 12.215 12.3604 13.065 12.3604H13.46V14.2154V14.2204ZM14.5 11.3654H13.065C12.765 11.3654 12.525 11.1204 12.525 10.8254C12.525 10.5304 12.77 10.2854 13.065 10.2854H14.5V11.3704V11.3654Z"
              fill="#A6ADBB"
              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
            />
            <path
              d="M5.46997 1.5V5.145H7.11497V0.5H6.46997C5.91997 0.5 5.46997 0.95 5.46997 1.5Z"
              fill="#E7FB78"
              style={{ fill: 'color(display-p3 0.9059 0.9843 0.4706)', fillOpacity: 0.8 }}
            />
            <path
              d="M11.47 0.5H8.11499V5.145H12.47V1.5C12.47 0.95 12.02 0.5 11.47 0.5ZM11.59 3.895C11.59 4.17 11.365 4.395 11.09 4.395C10.815 4.395 10.59 4.17 10.59 3.895V3.59C10.59 3.315 10.815 3.09 11.09 3.09C11.365 3.09 11.59 3.315 11.59 3.59V3.895ZM11.59 2.06C11.59 2.335 11.365 2.56 11.09 2.56C10.815 2.56 10.59 2.335 10.59 2.06V1.755C10.59 1.48 10.815 1.255 11.09 1.255C11.365 1.255 11.59 1.48 11.59 1.755V2.06Z"
              fill="#E7FB78"
              style={{ fill: 'color(display-p3 0.9059 0.9843 0.4706)', fillOpacity: 0.8 }}
            />
          </g>
          <defs>
            <clipPath id="clip0_2120_3509">
              <rect width="16" height="16" fill="white" style={{ fill: 'white', fillOpacity: 1 }} />
            </clipPath>
          </defs>
        </svg>

        <div>
          <div className="text-sm font-semibold">{transactionType}</div>
          <div className="text-base-content/50 text-sm">{formattedDate}</div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-end gap-1">
          <div className="text-success text-sm font-semibold">
            {convertCurrency(transaction.max_wager, {
              sourceCurrency: transaction.currency,
              targetCurrency: displayInFiat ? (user?.currency_fiat ?? 'USD') : transaction.currency,
              showPlus: true,
              includeSymbol: true,
            })}
          </div>
          <CurrencyImage currency={transaction.currency} className="h-4 w-4" />
        </div>
        <div className="flex items-center justify-end gap-1">
          <span className="text-sm font-semibold">{getStatusText(transaction)}</span>
          <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.767476 7.81586C0.5378 7.577 0.545248 7.19718 0.784111 6.9675L3.93431 4L0.784111 1.0325C0.545248 0.802823 0.5378 0.422997 0.767476 0.184134C0.997152 -0.0547288 1.37698 -0.0621767 1.61584 0.167499L5.21584 3.5675C5.33349 3.68062 5.39998 3.83679 5.39998 4C5.39998 4.16321 5.33349 4.31938 5.21584 4.4325L1.61584 7.8325C1.37698 8.06218 0.997153 8.05473 0.767476 7.81586Z"
              fill="#A6ADBB"
              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
