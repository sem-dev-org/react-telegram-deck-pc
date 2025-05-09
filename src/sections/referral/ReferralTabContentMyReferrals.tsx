import { useAuth } from '@/contexts/auth';
import { useInfiniteQuery } from '@tanstack/react-query';
import { TableVirtuoso } from 'react-virtuoso';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';
import { IReferralList } from '@/types/referral';
import { getReferralList } from '@/api/referral';


export const ReferralTabContentMyReferrals = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-base-300 flex flex-col overflow-hidden rounded-2xl">
        <div className="bg-base-100 flex h-14 items-center justify-between px-5">
          <h4 className="text-base font-bold">{t('referral:myReferrals')}</h4>
          <div
            className="bg-base-200 flex h-8 items-center gap-2 rounded-lg px-3"
            onClick={() => navigate(paths.main.referral.list)}
          >
            <div className="text-sm font-semibold">{t('referral:more')}</div>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.209376 9.76983C-0.0777189 9.47125 -0.0684094 8.99647 0.230169 8.70937L4.16792 5L0.230169 1.29062C-0.0684099 1.00353 -0.0777193 0.528747 0.209376 0.230167C0.496471 -0.0684109 0.971253 -0.0777207 1.26983 0.209374L5.76983 4.45937C5.91689 4.60078 6 4.79599 6 5C6 5.20401 5.91689 5.39922 5.76983 5.54062L1.26983 9.79062C0.971254 10.0777 0.496471 10.0684 0.209376 9.76983Z"
                fill="#A6ADBB"
                style={{
                  fill: "#A6ADBB",
                  fillOpacity: 1
                }}
              />
            </svg>

          </div>
        </div>
        <Table />
      </div>
    </>
  );
};


const Table = ({

}: {

  }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery<{ data: IReferralList[] }>({
    queryKey: ['ReferralRewardList'],
    queryFn: ({ pageParam }) =>
      getReferralList({
        limit: 20,
        last_id: pageParam,
        period: 'All',
        type: 'All',
        keyword: '',
      }),
    initialPageParam: '',
    getNextPageParam: (lastPage) =>
      lastPage.data?.length > 0 ? lastPage.data[lastPage.data.length - 1].id : undefined,
    enabled: !!user,
  });



  const allItems = data?.pages.flatMap((page) => page.data || []) || [];

  const { formatCurrency } = useCurrencyFormatter();

  const TableComponents = {
    Table: (props: any) => (
      <table
        className="table-md border-base-300 table border-t border-b"
        style={
          {
            // borderTop: '1px solid color(display-p3 0.082 0.098 0.118)',
          }
        }
        {...props}
      />
    ),
    TableRow: (props: any) => <tr className="border-base-300 h-16 border-t border-b" {...props} />,
  };

  // Flatten the data from infinite query pages

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
          <tr className="bg-base-100 h-10 rounded text-xs">
            <th className="text-base-content/60 text-xs font-bold">{t('referral:user')} | {t('referral:type')} | {t('referral:vip')}</th>
            <th className="text-base-content/60 text-right text-xs font-bold">{t('referral:rewards')} | {t('referral:code')} | {t('referral:registration')}</th>
          </tr>
        )}
        itemContent={(_, item) => (
          <>
            <td onClick={() => navigate(`${paths.main.referral.details}${item.id}/${item.down_line}/${item.refer_type}`)}> 
              <div className="flex flex-col">
                <div className="text-sm font-semibold">{item.type === 'direct' ? 'directfriend' : 'indirectfriend'}</div>
                <div className="text-base-content/50 text-sm">{item.type}</div>
                <div className="text-base-content/50 text-sm">VIP {item.down_line_level_after}</div>
              </div>
            </td>
            <td onClick={() => navigate(`${paths.main.referral.details}${item.id}/${item.down_line}/${item.refer_type}`)} className="pr-3">
              <div className="flex items-center justify-end gap-1">
                <div>
                  <div className="text-primary text-right text-sm font-semibold">
                    {/* {convertCurrency(item.reward ?? 0, {
                      sourceCurrency: 'USDT',
                      targetCurrency: user?.currency_fiat ?? '',
                      decimalPoint: 8,
                    })} */}
                    {formatCurrency(item.reward)}

                  </div>
                  <div className="text-base-content/50 text-right text-sm">{item.down_line_username}</div>
                  <div className="text-base-content/50 text-right text-sm">{item.created_at}</div>
                </div>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.5">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.20938 14.7698C6.92228 14.4713 6.93159 13.9965 7.23017 13.7094L11.1679 10L7.23017 6.29062C6.93159 6.00353 6.92228 5.52875 7.20938 5.23017C7.49647 4.93159 7.97125 4.92228 8.26983 5.20937L12.7698 9.45937C12.9169 9.60078 13 9.79599 13 10C13 10.204 12.9169 10.3992 12.7698 10.5406L8.26983 14.7906C7.97125 15.0777 7.49647 15.0684 7.20938 14.7698Z"
                      fill="#A6ADBB"
                      style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
                    />
                  </g>
                </svg>
              </div>
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
