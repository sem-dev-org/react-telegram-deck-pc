import { FullBleedContainer, Page, SafeContent } from '@/components/ui';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useSettingStore } from '@/store/setting';
import { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useAuth } from '@/contexts/auth';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Decimal } from 'decimal.js';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { paths } from '@/routes/paths';

const maskMiddleDigits = (text: string) => {
  if (text.length <= 12) return text;
  return `${text.slice(0, 6)}...${text.slice(-6)}`;
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

export default function TransactionDetails() {
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { convertCurrency } = useCurrencyFormatter();
  const { displayInFiat } = useSettingStore();
  const [copyType, setCopyType] = useState('');
  const { user } = useAuth();

  // 如果刷新页面导致state丢失，直接重定向回交易列表页面
  useEffect(() => {
    if (!state) {
      navigate(`${paths.main.transaction.root}?tab=transaction`);
    }
  }, [state, navigate]);

  // 如果没有state，返回null等待重定向
  if (!state) {
    return null;
  }

  const statusText = state.isDeposit ? getWithdrawStatusText(state.status, t) : getDepositStatusText(state.status, t);

  const createdAt = dayjs.unix(state.created_at).format('DD/MM/YYYY HH:mm:ss');
  const getTypeTitle = state.isDeposit
    ? t('transaction:details.depositOrderCreated')
    : t('transaction:details.withdrawOrderCreated');

  // 数字货币总是Success
  const isCompleted = state.status === 1;
  // 法币process状态
  const isProcess = [0, 1, 5, 6].includes(state.status);
  // 失败状态、包括取消
  const isFailed = [2, 3, 4, 7, 8].includes(state.status);

  // rollover状态
  const getStatusText = () => {
    if (Number(state.wager) == 0) {
      return t('transaction:transactionStatus.done');
    }
    if (Number(state.wager) == Number(state.max_wager)) {
      return t('transaction:transactionStatus.notStarted');
    }
    if (Number(state.wager) < Number(state.max_wager) && Number(state.wager) > 0) {
      return t('transaction:transactionStatus.ongoing');
    }
  };

  console.log('state', state);

  return (
    <FullBleedContainer>
      <SafeContent>
        <Page className="flex flex-col gap-3 p-3">
          <div className="flex items-center justify-center gap-1">
            <img src={`/icons/tokens/${state.currency.toLowerCase()}.svg`} className="h-8 w-8" alt={state.currency} />
            <div className="text-2xl font-bold">
              {convertCurrency(state.network === 'bonus' ? state.max_wager : state.amount, {
                sourceCurrency: state.currency,
                targetCurrency: state.currency,
                showPlus: state.isDeposit ? true : false,
                includeSymbol: true,
              })}{' '}
            </div>
          </div>
          <div className="bg-base-100 flex flex-col justify-between gap-2.5 rounded-lg px-7 py-6.5">
            <div className="flex items-center justify-between gap-1">
              <div className="text-base-content text-sm">{t('transaction:tableHeaders.status')}</div>
              <div className="text-base-content text-sm font-bold">
                {state.fromTab == 'rollover' ? getStatusText() : statusText}
              </div>
            </div>
            {state.fromTab == 'rollover' && (
              <div className="flex items-center justify-between gap-1">
                <div className="text-base-content text-sm">{t('transaction:filters.type')}</div>
                <div className="text-base-content text-sm font-bold">
                  {state.network === 'bonus'
                    ? `transaction:transactionTypes.bonus`
                    : t(`transaction:transactionTypes.deposit`)}
                </div>
              </div>
            )}
            {state.fromTab == 'history' && (
              <div className="flex items-center justify-between gap-1">
                <div className="text-base-content text-sm">{t('transaction:details.paymentMethod')}</div>
                <div className="bg-base-content/10 flex h-5 items-center gap-2 rounded-full px-2">
                  <div className="text-base-content text-sm">{state?.payment_method}</div>
                </div>
              </div>
            )}
            {state.fromTab == 'history' && (
              <div className="flex items-center justify-between gap-1">
                <div className="text-base-content text-sm">{t('transaction:details.orderId')}</div>
                <div className="bg-base-content/10 flex h-5 items-center gap-2 rounded-full px-2">
                  <div className="text-base-content text-sm">{state?.number}</div>
                  <CopyToClipboard
                    text={state?.number}
                    onCopy={() => {
                      setCopyType('number');
                      setTimeout(() => {
                        setCopyType('');
                      }, 1000);
                    }}
                  >
                    <div className="">
                      {copyType === 'number' ? (
                        <div className="h-3 w-3">
                          <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M1 4L4.5 7.5L11 1"
                              stroke="#E7FB78"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="h-3 w-3">
                          <svg
                            width="10"
                            height="11"
                            viewBox="0 0 10 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M8.59256 1.80705C9.27113 1.87827 9.8 2.45218 9.8 3.14961V7.04961C9.8 7.79519 9.19558 8.39961 8.45 8.39961H7.1V6.3724C7.1 5.89501 6.91036 5.43718 6.57279 5.09961L4.7 3.22682C4.46631 2.99313 4.17498 2.83033 3.85942 2.75227C4.01562 2.24435 4.46342 1.86415 5.00744 1.80705C5.07866 1.12848 5.65257 0.599609 6.35 0.599609H7.25C7.94743 0.599609 8.52134 1.12848 8.59256 1.80705ZM5.9 1.94961C5.9 1.70108 6.10147 1.49961 6.35 1.49961H7.25C7.49853 1.49961 7.7 1.70108 7.7 1.94961V2.09961H5.9V1.94961Z"
                              fill="#A6ADBB"
                              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
                            />
                            <path
                              d="M1.09995 3.59961C0.602895 3.59961 0.199951 4.00255 0.199951 4.49961V9.89961C0.199951 10.3967 0.602895 10.7996 1.09995 10.7996H5.29995C5.79701 10.7996 6.19995 10.3967 6.19995 9.89961V6.3724C6.19995 6.13371 6.10513 5.90479 5.93635 5.73601L4.06355 3.86321C3.89477 3.69443 3.66585 3.59961 3.42716 3.59961H1.09995Z"
                              fill="#A6ADBB"
                              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </CopyToClipboard>
                </div>
              </div>
            )}
            {state.txid && state.fromTab == 'history' && (
              <div className="flex items-center justify-between gap-1">
                <div className="text-base-content text-sm">{t('transaction:details.transactionHash')}</div>
                <div className="bg-base-content/10 flex h-5 items-center gap-2 rounded-full px-2">
                  <div className="text-base-content text-sm">{maskMiddleDigits(state?.txid)}</div>
                  <CopyToClipboard
                    text={state?.txid}
                    onCopy={() => {
                      setCopyType('txid');
                      setTimeout(() => {
                        setCopyType('');
                      }, 1000);
                    }}
                  >
                    <div className="">
                      {copyType === 'txid' ? (
                        <div className="h-3 w-3">
                          <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M1 4L4.5 7.5L11 1"
                              stroke="#E7FB78"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="h-3 w-3">
                          <svg
                            width="10"
                            height="11"
                            viewBox="0 0 10 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M8.59256 1.80705C9.27113 1.87827 9.8 2.45218 9.8 3.14961V7.04961C9.8 7.79519 9.19558 8.39961 8.45 8.39961H7.1V6.3724C7.1 5.89501 6.91036 5.43718 6.57279 5.09961L4.7 3.22682C4.46631 2.99313 4.17498 2.83033 3.85942 2.75227C4.01562 2.24435 4.46342 1.86415 5.00744 1.80705C5.07866 1.12848 5.65257 0.599609 6.35 0.599609H7.25C7.94743 0.599609 8.52134 1.12848 8.59256 1.80705ZM5.9 1.94961C5.9 1.70108 6.10147 1.49961 6.35 1.49961H7.25C7.49853 1.49961 7.7 1.70108 7.7 1.94961V2.09961H5.9V1.94961Z"
                              fill="#A6ADBB"
                              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
                            />
                            <path
                              d="M1.09995 3.59961C0.602895 3.59961 0.199951 4.00255 0.199951 4.49961V9.89961C0.199951 10.3967 0.602895 10.7996 1.09995 10.7996H5.29995C5.79701 10.7996 6.19995 10.3967 6.19995 9.89961V6.3724C6.19995 6.13371 6.10513 5.90479 5.93635 5.73601L4.06355 3.86321C3.89477 3.69443 3.66585 3.59961 3.42716 3.59961H1.09995Z"
                              fill="#A6ADBB"
                              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </CopyToClipboard>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between gap-1">
              <div className="text-base-content text-sm">{t('transaction:details.created')}</div>
              <div className="text-base-content text-sm font-bold">{createdAt}</div>
            </div>
            {state.fromTab == 'rollover' && (
              <div className="flex items-center justify-between gap-1">
                <div className="text-base-content text-sm">{t('transaction:rollover.rolloverTimes')}</div>
                <div className="text-base-content text-sm font-bold">x1</div>
              </div>
            )}
            {state.fromTab == 'rollover' && (
              <div className="flex items-center justify-between gap-1">
                <div className="text-base-content text-sm">{t('transaction:rollover.totalWagerRequired')}</div>
                <div className="text-base-content text-sm font-bold">
                  {convertCurrency(state.max_wager, {
                    sourceCurrency: state.currency,
                    targetCurrency: displayInFiat ? user?.currency_fiat : state.currency,
                    includeSymbol: true,
                  })}
                </div>
              </div>
            )}
            {state.fromTab == 'rollover' && (
              <div className="flex items-center justify-between gap-1">
                <div className="text-base-content text-sm">{t('transaction:rollover.wagerCompleted')}</div>
                <div className="text-base-content text-sm font-bold">
                  {convertCurrency(Decimal(state.max_wager).minus(state.wager).toString(), {
                    sourceCurrency: state.currency,
                    targetCurrency: displayInFiat ? user?.currency_fiat : state.currency,
                    includeSymbol: true,
                  })}
                </div>
              </div>
            )}
            {state.fromTab == 'rollover' && (
              <div className="flex items-center justify-between gap-1">
                <div className="text-base-content text-sm">{t('transaction:rollover.pendingWagerRequired')}</div>
                <div className="text-base-content text-sm font-bold">
                  {convertCurrency(state.wager, {
                    sourceCurrency: state.currency,
                    targetCurrency: displayInFiat ? user?.currency_fiat : state.currency,
                    includeSymbol: true,
                  })}
                </div>
              </div>
            )}
            {state.fromTab == 'rollover' && (
              <div className="flex items-center justify-between gap-1">
                <div className="text-base-content text-sm">{t('transaction:rollover.unlockedFunds')}</div>
                <div className="text-base-content text-sm font-bold">
                  {convertCurrency(state.wager === 0 ? state.max_wager : 0, {
                    sourceCurrency: state.currency,
                    targetCurrency: displayInFiat ? user?.currency_fiat : state.currency,
                    includeSymbol: true,
                  })}
                </div>
              </div>
            )}
          </div>

          {state.fromTab == 'history' && (
            <div className="flex flex-col px-3">
              <div className="flex h-6 items-center text-base font-bold">
                <div>{t('transaction:details.transactionProgress')}</div>
              </div>
              <div>
                <ul className="steps steps-vertical [&_.step:not(.step-primary):not(:has(.step-icon))]:after:!bg-neutral [&_.step:not(.step-primary)]:before:!bg-neutral [&_.step:before]:ms-[50%] [&_.step:before]:h-[75%] [&_.step:before]:w-2 [&_.step:before]:-translate-x-[50%] [&_.step:before]:-translate-y-[65%] [&_.step:not(.step-primary):not(:has(.step-icon))]:after:!content-[counter(step)]">
                  <li
                    className="step step-primary before:!w-1 after:!h-[18px] after:!w-[18px] after:text-[8px]"
                    data-content="✓"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="text-left text-sm font-bold">{getTypeTitle}</div>
                      <div className="text-left text-xs">
                        {t('transaction:details.lastUpdate')}: {createdAt}
                      </div>
                    </div>
                  </li>
                  {isFailed && (
                    <li
                      className="step step-primary before:!w-1 after:!h-[18px] after:!w-[18px] after:text-[8px]"
                      data-content={isFailed ? '✓' : ''}
                    >
                      <div>
                        <div className="text-left text-sm font-bold">
                          {state.isDeposit
                            ? t('transaction:details.depositOrderFailed')
                            : t('transaction:details.withdrawOrderFailed')}
                        </div>
                      </div>
                    </li>
                  )}
                  {isProcess && (
                    <>
                      <li
                        className="step step-primary before:!w-1 after:!h-[18px] after:!w-[18px] after:text-[8px]"
                        data-content={isProcess ? '✓' : ''}
                      >
                        <div>
                          <div className="text-left text-sm font-bold">
                            {state.isDeposit
                              ? t('transaction:details.depositProcessing')
                              : t('transaction:details.withdrawProcessing')}
                          </div>
                        </div>
                      </li>
                      <li
                        className={clsx(
                          'step before:!w-1 after:!h-[18px] after:!w-[18px] after:text-[8px]',
                          isCompleted && 'step-primary',
                        )}
                        data-content={isCompleted ? '✓' : ''}
                      >
                        <div>
                          <div className="text-left text-sm font-bold">
                            {t('transaction:details.transactionCompleted')}
                          </div>
                        </div>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
}
