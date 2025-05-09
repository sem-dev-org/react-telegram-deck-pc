import { CopyBtn } from '@/components/ui/CopyBtn';
import { QueryBaseUrl } from '@/query/adTag';
import { TableVirtuoso } from 'react-virtuoso';
import { useVipConfig } from '@/query/referr';
import { useAuth } from '@/contexts/auth';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useTranslation } from 'react-i18next';

export const ReferralTabContentRewardsSchedule = () => {
  const { t } = useTranslation();
  const { baseUrl } = QueryBaseUrl();

  return (
    <div>
      <div
        className="flex flex-col gap-4 rounded-t-2xl p-4"
        style={{
          background: `linear-gradient(180deg, color(display-p3 0.329 0.502 0.596 / 0.2) 0%, color(display-p3 0.114 0.137 0.165 / 0.2) 59.96%), color(display-p3 0.114 0.137 0.165)`,
        }}
      >
        <h3 className="text-base leading-6 font-bold">{t('referral:referralRewardsAreEasy')}</h3>
        <div className="flex items-center gap-2">
          <img src="/images/referral/trumpet.png" className="h-25 w-25" />
          <div className="flex flex-col gap-1 overflow-hidden">
            <h4 className="flex items-center gap-1 text-base font-bold">
              <span>{t('referral:gatherYour')}</span>
              <span className="text-primary">{t('referral:crew')}</span>
            </h4>
            <p className="text-sm">{t('referral:gatherYourCrewDescription')}</p>
            <div className="bg-base-200 flex h-10 items-center justify-between gap-2 rounded-lg px-3">
              <div className="text-base-content/50 flex-1 overflow-auto text-sm whitespace-nowrap">{baseUrl}</div>
              <CopyBtn text={baseUrl} className="btn btn-sm h-5 min-w-13 rounded-full px-2">
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
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <h4 className="flex items-center gap-1 text-base font-bold">
              <span>{t('referral:crackThe')}</span>
              <span className="text-primary">{t('referral:vault')}</span>
            </h4>
            <p className="text-sm">{t('referral:crackTheVaultDescription')}</p>
          </div>
          <img src="/images/referral/safe.png" className="h-27.5 w-27.5" />
        </div>
      </div>
      <Leaderboard />
    </div>
  );
};

export const Leaderboard = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-base-200 flex flex-col gap-[1px]">
      <div className="bg-base-100 flex h-12 items-center">
        <h3 className="pl-5 text-base font-bold">{t('referral:rewardsReleaseSchedule')}</h3>
      </div>

      <Table />
    </div>
  );
};

const Table = () => {
  const { vipConfig, isFetching } = useVipConfig();

  // Filter vipConfig where referral is not 0
  const filteredVipConfig = vipConfig?.filter(item => Number(item.referral) !== 0) ?? [];

  const TableComponents = {
    Table: (props: any) => (
      <table
        className="bg-base-300 table w-full rounded-[0]"
        style={{
          borderTop: '1px solid color(display-p3 0.082 0.098 0.118)',
        }}
        {...props}
      />
    ),
    TableRow: (props: any) => (
      <tr
        className="bg-base-300 h-11 text-center"
        style={{
          borderTop: '1px solid color(display-p3 0.082 0.098 0.118)',
          background: '#1D232A',
        }}
        {...props}
      />
    ),
  };

  // Flatten the data from infinite query pages
  const { user } = useAuth();
  // const { rateForUSD } = QueryRateForUSD();
  // const { displayDecimal } = QueryCurrency(user?.currency_fiat ?? undefined);
  const { formatCurrency } = useCurrencyFormatter();
  const { t } = useTranslation();
  return (
    <div className="bg-base-300 relative h-121 w-full overflow-hidden rounded-b-2xl">
      <TableVirtuoso
        style={{
          height: '100%',
        }}
        components={TableComponents}
        data={filteredVipConfig}
        fixedHeaderContent={() => (
          <tr className="bg-base-100 text-base-content/60 h-10 text-center text-xs font-semibold">
            <th className="text-left"> {t('referral:friendLevel')} </th>
            <th> {t('referral:totalExp')} </th>
            <th className="text-right"> {t('referral:unlockedAmount')} </th>
          </tr>
        )}
        itemContent={(_, item) => (
          <>
            <td className="h-11 px-0 pl-3">
              <div className="flex items-center gap-2 truncate">
                <img src={`/icons/vip-badge/${item?.medal}.png`} className="h-5 w-5 object-contain" />
                <div className="text-sm font-semibold">
                  {t('referral:vip')} {item?.vip}
                </div>
              </div>
            </td>
            <td className="h-11 px-0 text-sm font-semibold">
              <span>{Math.floor(Number(item?.xp))}</span>
            </td>
            <td className="flex h-11 items-center justify-end gap-1 truncate px-0 pr-3 text-sm font-semibold">
              <span className="text-primary">{formatCurrency(item?.referral)}</span>
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
