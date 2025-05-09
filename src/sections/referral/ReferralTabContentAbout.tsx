import { configGetByGroup } from '@/api/auth';
import { useState, useEffect, useMemo } from 'react';
import { CopyBtn } from '@/components/ui/CopyBtn';
import { getRewardGroupLog, getVipConfig } from '@/api/referral';
import { useAuth } from '@/contexts/auth';
import Decimal from 'decimal.js';
import { QueryBaseUrl, QueryDefaultAdTag } from '@/query/adTag';
import { useInfiniteQuery } from '@tanstack/react-query';
import { TableVirtuoso } from 'react-virtuoso';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useTranslation } from 'react-i18next';

export const ReferralTabContentAbout = () => {
  const [referralConfig, setReferralConfig] = useState<any>(null);
  const [commissionRewards, setCommissionRewards] = useState<string>('0');
  const { t } = useTranslation();
  const { status } = useAuth();

  useEffect(() => {
    if (status) {
      configGetByGroup({ group: 'referral' }).then((res) => {
        if (res.code === 0) {
          setReferralConfig(res.data);
        }
      });

      getVipConfig({ vip: '125' }).then((res) => {
        if (res.code === 0) {
          if (res.data && res.data?.group) {
            setCommissionRewards(Decimal(res.data?.group).mul(100).toString());
          }
        }
      });
    }
  }, [status]);

  const { baseUrl } = QueryBaseUrl();
  const { defaultAdTag } = QueryDefaultAdTag();
  const { user } = useAuth();
  const { formatCurrency } = useCurrencyFormatter();

  const referralRewards = useMemo(
    () =>
      // convertCurrency(referralConfig?.referral_reward ?? 0, {
      //   sourceCurrency: 'USDT',
      //   targetCurrency: user?.currency_fiat ?? '',
      // }),
      formatCurrency(referralConfig?.referral_reward),
    [referralConfig?.referral_reward, user?.currency_fiat],
  );

  return (
    <div>
      <div
        className="bg-base-100 flex flex-col gap-3 rounded-t-2xl p-4"
        style={{
          background: `linear-gradient(180deg, color(display-p3 0.329 0.502 0.596 / 0.2) 0%, color(display-p3 0.114 0.137 0.165 / 0.2) 59.96%), color(display-p3 0.114 0.137 0.165)`,
        }}
      >
        <div className="flex flex-col">
          <p className="text-base leading-6 font-bold">{t('referral:assembleYourCrewCashIn')}</p>
          <div className="grid grid-cols-12 py-2">
            <div className="col-span-5 flex flex-col">
              <p className="text-primary text-lg leading-7 font-black">{referralRewards}</p>
              <p className="text-sm font-bold">{t('referral:referralRewards')}</p>
            </div>

            <div className="col-span-7 flex flex-col">
              <p className="text-primary text-lg leading-7 font-black">{commissionRewards}%</p>
              <p className="text-sm font-bold">{t('referral:commissionRewards')}</p>
            </div>
          </div>
        </div>

        <p className="text-sm leading-5 whitespace-pre-line">
          {t('referral:aboutDescription', {
            amount: formatCurrency(57371.42),
            commission: 2,
          })}
        </p>

        <div className="flex flex-col gap-1">
          <p className="text-neutral-content px-1 text-xs leading-4 font-bold">{t('referral:referralLink')}</p>
          <div className="bg-base-300 flex h-10 items-center gap-2 rounded-lg px-4">
            <p className="flex-1 overflow-auto text-sm whitespace-nowrap opacity-30">
              {baseUrl}
            </p>
            <CopyBtn
              text={baseUrl}
              className="btn btn-sm h-5 min-w-13 rounded-full px-2"
            >
              <div className="flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6.5 2.25C6.5 1.55964 7.05964 1 7.75 1C8.44036 1 9 1.55964 9 2.25C9 2.94036 8.44036 3.5 7.75 3.5C7.39716 3.5 7.07846 3.35381 6.85118 3.11869L3.48442 4.80207C3.49467 4.86654 3.5 4.93265 3.5 5C3.5 5.06737 3.49467 5.13349 3.48441 5.19796L6.85115 6.88134C7.07844 6.6462 7.39715 6.5 7.75 6.5C8.44036 6.5 9 7.05964 9 7.75C9 8.44036 8.44036 9 7.75 9C7.05964 9 6.5 8.44036 6.5 7.75C6.5 7.68265 6.50533 7.61654 6.51558 7.55207L3.14882 5.86869C2.92154 6.10381 2.60284 6.25 2.25 6.25C1.55964 6.25 1 5.69036 1 5C1 4.30964 1.55964 3.75 2.25 3.75C2.60285 3.75 2.92156 3.8962 3.14885 4.13134L6.51559 2.44796C6.50533 2.38349 6.5 2.31737 6.5 2.25Z"
                    fill="#E7FB78"
                    fillOpacity="0.8"
                    style={{ fill: '#E7FB78', fillOpacity: 0.8 }}
                  />
                </svg>
                <span className="text-sm">{t('common.share')}</span>
              </div>
            </CopyBtn>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-neutral-content px-1 text-xs leading-4 font-bold">{t('referral:referralCode')}</p>
          <div className="bg-base-300 flex h-10 items-center rounded-lg px-4">
            <p className="flex-1 text-sm opacity-30">{defaultAdTag?.code}</p>
            <CopyBtn text={defaultAdTag?.code} className="btn btn-sm h-5 min-w-13 rounded-full px-2">
              <div className="flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.5 1.75C3.5 1.33579 3.83579 1 4.25 1H6.18934C6.38825 1 6.57902 1.07902 6.71967 1.21967L8.28033 2.78033C8.42098 2.92098 8.5 3.11175 8.5 3.31066V6.25C8.5 6.66421 8.16421 7 7.75 7H7.25V5.31066C7.25 4.91284 7.09197 4.53131 6.81066 4.25L5.25 2.68934C4.9687 2.40804 4.58716 2.25 4.18934 2.25H3.5V1.75Z"
                    fill="#E7FB78"
                    fillOpacity="0.8"
                    style={{ fill: '#E7FB78', fillOpacity: 0.8 }}
                  />
                  <path
                    d="M2.25 3C1.83579 3 1.5 3.33579 1.5 3.75V8.25C1.5 8.66421 1.83579 9 2.25 9H5.75C6.16421 9 6.5 8.66421 6.5 8.25V5.31066C6.5 5.11175 6.42098 4.92098 6.28033 4.78033L4.71967 3.21967C4.57902 3.07902 4.38825 3 4.18934 3H2.25Z"
                    fill="#E7FB78"
                    fillOpacity="0.8"
                    style={{ fill: '#E7FB78', fillOpacity: 0.8 }}
                  />
                </svg>
                <span className="text-sm">{t('common.copy')}</span>
              </div>
            </CopyBtn>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="text-sm font-bold">{t('referral:shareViaSocials')}</p>
          <div className="mt-2 flex items-center gap-1">
            <img src="/icons/socials/1.svg" alt="social" />
            <img src="/icons/socials/2.svg" alt="social" />
            <img src="/icons/socials/3.svg" alt="social" />
            <img src="/icons/socials/4.svg" alt="social" />
            <img src="/icons/socials/5.svg" alt="social" />
            <img src="/icons/socials/6.svg" alt="social" />
            <img src="/icons/socials/7.svg" alt="social" />
            <img src="/icons/socials/8.svg" alt="social" />
          </div>
          <p className="text-primary mt-4 text-sm font-bold">{t('referral:referralTermsConditions')}</p>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <div className="inline-grid *:[grid-area:1/1]">
            <div className="status status-primary status-lg animate-ping"></div>
            <div className="status status-primary status-lg"></div>
          </div>
          <p className="text-base font-bold">{t('referral:globalCommissionRewards')}</p>
        </div>
      </div>
      <Table />
    </div>
  );
};

const Table = () => {
  const { user } = useAuth();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['RewardGroupLog'],
    queryFn: ({ pageParam }) =>
      getRewardGroupLog({
        limit: 20,
        created_at: pageParam,
      }),
    initialPageParam: '',
    getNextPageParam: (lastPage) =>
      lastPage.data?.length > 0 ? lastPage.data[lastPage.data.length - 1].created_at : undefined,
    enabled: !!user,
  });

  const allItems = data?.pages.flatMap((page) => page.data || []) || [];

  // const TableComponents = {
  //   Table: (props: any) => <table className="table-md border-base-300 table border-t border-b" {...props} />,
  //   TableBody: (props: any) => <tbody className="bg-base-200 text-sm">{props.children}</tbody>,
  //   TableRow: (props: any) => <tr className="border-base-300 h-11 border-t border-b">{...props}</tr>,
  // };
  // const { rateForUSD } = QueryRateForUSD();
  // const { displayDecimal } = QueryCurrency(user?.currency_fiat ?? undefined);

  const { formatCurrency } = useCurrencyFormatter();

  const TableComponents = {
    Table: (props: any) => (
      <table
        className="table-md border-base-300 table w-full border-t border-b"
        style={
          {
            // borderTop: '1px solid color(display-p3 0.082 0.098 0.118)',
          }
        }
        {...props}
      />
    ),
    TableRow: (props: any) => <tr className="border-base-300 h-11 border-t border-b" {...props} />,
  };

  // Flatten the data from infinite query pages
  const { t } = useTranslation();

  return (
    <div className="bg-base-200 relative h-121 w-full overflow-hidden rounded-b-2xl">
      <TableVirtuoso
        style={{
          height: '100%',
        }}
        components={TableComponents}
        endReached={() => (isFetching || !hasNextPage ? undefined : fetchNextPage())}
        data={allItems}
        fixedHeaderContent={() => (
          <tr className="bg-base-100 h-10 rounded text-xs text-base-content/60">
            <th>{t('referral:username')}</th>
            <th className="text-right">{t('referral:availableCommissionRewards')}</th>
          </tr>
        )}
        itemContent={(_, item) => (
          <>
            <td className="text-sm">
              <p>{item?.down_line_username}</p>
            </td>
            <td className="flex items-center justify-end gap-2 pr-3">
              <p className="text-primary text-sm font-semibold">
                +{' '}
                {/* {convertCurrency(item?.reward ?? 0, {
                  sourceCurrency: 'USDT',
                  targetCurrency: user?.currency_fiat ?? '',
                  decimalPoint: 8,
                  numberAmount: true,
                })} */}
                {formatCurrency(item?.reward, { decimalPoint: 8 })}
              </p>
              <img src={`/icons/flag/${ user?.currency_fiat ? user?.currency_fiat?.toLowerCase() : 'usd'}.svg`} className="h-4 w-4" />
            </td>
          </>
        )}
      />
      {isFetching && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="loading loading-spinner loading-xl text-primary"></span>
        </div>
      )}
    </div>
  );
};
