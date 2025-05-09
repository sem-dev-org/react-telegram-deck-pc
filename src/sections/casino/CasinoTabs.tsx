import { getNewestGameOrder } from '@/api/casino';
import { IGreatestGameOrder, INewestGameOrder } from '@/types/game';
import clsx from 'clsx';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import React from 'react';

import { CurrencyImage } from '@/components/ui/CurrencyImage';
import { useAuth } from '@/contexts/auth';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { QueryGreatestGameOrder } from '@/query/casino';
import { useTournamentList } from '@/query/tournament';
import { useQuery } from '@tanstack/react-query';
import { JiliContent, PgContent, TreasureContent } from '../tournament/TournamentTabs';
import { useSettingStore } from '@/store/setting';
import { getTabOne, getTabThree, getTabTwo } from '@/_mock/explore';
import { useTranslation } from 'react-i18next';
import { GameDetailModal } from './GameDetailModal';
import { useSystem } from '@/hooks';

// Define the tab type
interface TabType {
  label: string;
  value: string;
  icon: ReactNode;
  component?: ReactNode;
}

// Preload and cache currency images to prevent flickering
const CurrencyCachedImage = React.memo(({ currency, className }: { currency: string; className?: string }) => {
  return <CurrencyImage className={className} currency={currency} />;
});

// Memoized table row component for LatestContent
const LatestTableRow = React.memo(
  ({
    item,
    index,
    convertCurrency,
    displayInFiat,
    user,
    iconFun,
    onClick,
  }: {
    item: INewestGameOrder;
    index: number;
    convertCurrency: any;
    displayInFiat: boolean;
    user: any;
    iconFun: (game_type_2: string) => string;
    onClick?: () => void;
  }) => {
    // Only first row is animated
    const isFirstRow = index === 0;

    return (
      <motion.tr
        key={`${item.id || ''}-${item.nickname}`}
        className="border-base-300 h-11 border-b"
        initial={isFirstRow ? { opacity: 0.5 } : false}
        animate={isFirstRow ? { opacity: 1 } : false}
        transition={isFirstRow ? { duration: 0.2 } : undefined}
        onClick={onClick}
      >
        <th>
          <span className="flex items-center gap-2 truncate text-sm">
            <div className="text-base" dangerouslySetInnerHTML={{ __html: iconFun(item.game_type_2) }} />
            <span className="flex-1 truncate text-sm font-semibold">{item.game_name ?? '--'}</span>
          </span>
        </th>
        <td className="px-0">
          <span className="flex items-center justify-center truncate overflow-hidden text-sm font-semibold">
            {item.nickname.charAt(0).toUpperCase() + item.nickname.slice(1)}
          </span>
        </td>
        <td className="pl-0">
          <span className="flex items-center justify-end gap-1 text-sm font-semibold">
            <p
              className={clsx(
                'text-right text-sm break-all',
                Number(item.real_win_amount) > 0 ? 'text-primary' : 'text-base-content',
              )}
            >
              {convertCurrency(item.real_win_amount, {
                sourceCurrency: item.real_currency,
                targetCurrency: displayInFiat ? user?.currency_fiat || '' : item.real_currency || '',
                showPlus: Number(item.real_win_amount) > 0,
                useThousandsSeparator: true,
                useCompactFormat: true,
              })}
            </p>
            <CurrencyCachedImage className="h-4 w-4" currency={item.real_currency} />
          </span>
        </td>
      </motion.tr>
    );
  },
  // Custom comparison function to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    // Only re-render if the item id changes or if first row status changes
    return prevProps.item.id === nextProps.item.id && prevProps.index === nextProps.index;
  },
);

// Memoized table row component for GreatestContent
const GreatestTableRow = React.memo(
  ({
    item,
    index,
    renderProfitText,
    onClick,
  }: {
    item: IGreatestGameOrder;
    index: number;
    renderProfitText: (item: IGreatestGameOrder) => string | number;
    onClick?: () => void;
  }) => {
    // Only first row is animated
    const isFirstRow = index === 0;

    return (
      <motion.tr
        key={`${item.id || ''}-${item.nickname}`}
        className="border-base-300 h-11 border-b"
        initial={isFirstRow ? { opacity: 0.5 } : false}
        animate={isFirstRow ? { opacity: 1 } : false}
        transition={isFirstRow ? { duration: 0.2 } : undefined}
        onClick={onClick}
      >
        <th className="truncate text-sm font-semibold">{item.game_name ?? '--'}</th>
        <td className="w-20 px-0 text-center text-sm font-semibold">
          {item.nickname.charAt(0).toUpperCase() + item.nickname.slice(1)}
        </td>
        <td className="text-right">
          <span className="flex items-center justify-end gap-1 text-sm font-semibold">
            <p
              className={clsx(
                'text-right text-sm break-all',
                Number(item.real_win_amount) > 0 ? 'text-primary' : 'text-base-content',
              )}
            >
              {renderProfitText(item)}
            </p>
            <CurrencyCachedImage className="h-4 w-4" currency={item.real_currency} />
          </span>
        </td>
      </motion.tr>
    );
  },
  // Custom comparison function to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    // Only re-render if the item id changes or if first row status changes
    return prevProps.item.id === nextProps.item.id && prevProps.index === nextProps.index;
  },
);

const LatestContent = () => {
  const { user } = useAuth();
  const { convertCurrency } = useCurrencyFormatter();
  const { displayInFiat } = useSettingStore();
  const [displayedData, setDisplayedData] = useState<INewestGameOrder[]>([]);
  const incomingDataRef = useRef<INewestGameOrder[]>([]);
  const isRenderingRef = useRef(false);
  const animationKeyRef = useRef(0); // Add a key reference to force animations to trigger
  const { t } = useTranslation();

  const { data: newestGameOrder = { data: [] as INewestGameOrder[], code: 0 }, refetch } = useQuery<{
    data: INewestGameOrder[];
    code: number;
  }>({
    queryKey: ['newestGameOrder'],
    queryFn: () => getNewestGameOrder(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    // refetchInterval removed as requested
  });

  // Function to fetch new data
  const fetchNewData = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Initialize data and start rendering process
  useEffect(() => {
    if (newestGameOrder?.code === 0 && newestGameOrder?.data?.length > 0) {
      // Store incoming data when available
      incomingDataRef.current = [...newestGameOrder.data];

      // If not currently rendering, start the rendering process
      if (!isRenderingRef.current) {
        renderNextItem();
      }
    }
  }, [newestGameOrder]);

  // Function to render data items one by one in LatestContent
  const renderNextItem = useCallback(() => {
    if (incomingDataRef.current.length === 0) {
      isRenderingRef.current = false;
      // All items rendered, fetch new data
      fetchNewData();
      return;
    }

    isRenderingRef.current = true;

    // Take the first item from the incoming data
    const nextItem = incomingDataRef.current.shift();

    // Increment animation key to force animation to trigger for first item
    animationKeyRef.current += 1;

    // Update displayed data (stack method - newest on top) with max 10 rows
    setDisplayedData((prev) => {
      const newData = [nextItem!, ...prev];
      // Limit to 10 rows
      return newData.slice(0, 10);
    });

    // Random delay between 500ms and 1500ms
    const randomDelay = Math.floor(Math.random() * 1000) + 500;

    // Schedule the next render
    setTimeout(renderNextItem, randomDelay);
  }, [fetchNewData]);

  const tabs = getTabOne(t).concat(getTabTwo(t)).concat(getTabThree(t));

  const iconFun = (game_type_2: string) => {
    const icon = tabs.find((c: { id: string }) => c.id === game_type_2)?.icon;
    return icon || '';
  };
  const [detailModal, setDetailModal] = useState<INewestGameOrder | null>(null);

  return (
    <>
      <div className="scrollbar-hide relative h-[480px] overflow-hidden overflow-y-hidden">
        <table className="table-pin-rows bg-base-100 table-sm table table-fixed">
          <thead>
            <tr className="border-base-300 h-11 border-b text-sm font-semibold">
              <th>{t('casino:game')}</th>
              <th className="px-0 text-center">{t('casino:user')}</th>
              <th className="text-right">{t('casino:profit')}</th>
            </tr>
          </thead>
          <tbody>
            {displayedData.map((item, index) => (
              <LatestTableRow
                key={`${item.id || index}-${item.nickname}`}
                item={item}
                index={index}
                onClick={() => setDetailModal(item)}
                convertCurrency={convertCurrency}
                displayInFiat={displayInFiat}
                user={user}
                iconFun={iconFun}
              />
            ))}
          </tbody>
        </table>
      </div>
      {detailModal && <GameDetailModal open={!!detailModal} onClose={() => setDetailModal(null)} game={detailModal} />}
    </>
  );
};

const GreatestContent = () => {
  const { user } = useAuth();
  const { convertCurrency } = useCurrencyFormatter();
  const { t } = useTranslation();
  const { displayInFiat } = useSettingStore();

  // Get query functionality from custom hook
  const { greatestGameOrder, refetch } = QueryGreatestGameOrder();
  const [detailModal, setDetailModal] = useState<any | null>(null);

  // Function to format profit text
  const renderProfitText = useCallback(
    (item: IGreatestGameOrder) => {
      const profit = convertCurrency(item.real_win_amount, {
        sourceCurrency: item.real_currency,
        targetCurrency: displayInFiat ? user?.currency_fiat || '' : item.real_currency || '',
        showPlus: item.real_win_amount > item.real_bet_amount,
        useThousandsSeparator: true,
        useCompactFormat: true,
      });

      return profit;
    },
    [convertCurrency, user?.currency_fiat, displayInFiat],
  );

  // Auto-refresh data periodically
  useEffect(() => {
    // Initial fetch
    refetch();

    // Set up periodic refresh (every 30 seconds)
    const intervalId = setInterval(() => {
      refetch();
    }, 30000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [refetch]);

  return (
    <>
      <div className="scrollbar-hide relative h-[480px] overflow-y-hidden">
        <table className="table-pin-rows bg-base-100 table-sm table table-fixed">
          <thead>
            <tr className="border-base-300 h-11 border-b text-sm font-semibold">
              <th>{t('casino:game')}</th>
              <th className="w-20 px-0 text-center">{t('casino:user')}</th>
              <th className="text-right">{t('casino:profit')}</th>
            </tr>
          </thead>
          <tbody>
            {greatestGameOrder &&
              greatestGameOrder
                .slice(0, 10)
                .map((item, index) => (
                  <GreatestTableRow
                    key={`${item.id || index}-${item.nickname}`}
                    item={item}
                    index={index}
                    renderProfitText={renderProfitText}
                    onClick={() => setDetailModal(item)}
                  />
                ))}
          </tbody>
        </table>
      </div>
      {detailModal && <GameDetailModal open={!!detailModal} onClose={() => setDetailModal(null)} game={detailModal} />}
    </>
  );
};

const tableTabs = (t: (key: string, values?: Record<string, any>) => string) => [
  {
    label: t('casino:latest'),
    value: 'latest',
    icon: (
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 18.1274C14.4183 18.1274 18 14.5457 18 10.1274C18 5.70916 14.4183 2.12744 10 2.12744C5.58172 2.12744 2 5.70916 2 10.1274C2 14.5457 5.58172 18.1274 10 18.1274ZM10.75 5.12744C10.75 4.71323 10.4142 4.37744 10 4.37744C9.58579 4.37744 9.25 4.71323 9.25 5.12744V10.1274C9.25 10.5417 9.58579 10.8774 10 10.8774H14C14.4142 10.8774 14.75 10.5417 14.75 10.1274C14.75 9.71323 14.4142 9.37744 14 9.37744H10.75V5.12744Z"
          fill="#A6ADBB"
          style={{ fill: '#A6ADBB', fillOpacity: 1 }}
        />
      </svg>
    ),
  },
  {
    label: t('casino:greatest'),
    value: 'greatest',
    icon: (
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18.1985 9.3992L18.0075 11.4286C17.6928 14.7724 17.5354 16.4444 16.5499 17.4524C15.5644 18.4606 14.0874 18.4606 11.1333 18.4606H8.86677C5.91266 18.4606 4.43561 18.4606 3.45009 17.4524C2.46458 16.4444 2.30723 14.7724 1.99252 11.4286L1.80153 9.3992C1.65152 7.80536 1.57652 7.00844 1.84918 6.679C1.99667 6.5008 2.19724 6.39161 2.41168 6.37278C2.80809 6.33796 3.30592 6.90469 4.30158 8.03817C4.81649 8.62436 5.07395 8.91745 5.36116 8.96286C5.5203 8.98795 5.68245 8.96211 5.8294 8.88819C6.09461 8.75469 6.27143 8.39238 6.62508 7.66771L8.4891 3.848C9.15735 2.47863 9.49152 1.79395 10 1.79395C10.5085 1.79395 10.8427 2.47863 11.5109 3.84799L13.3749 7.6677C13.7286 8.39238 13.9054 8.75469 14.1706 8.88819C14.3176 8.96211 14.4798 8.98795 14.6389 8.96286C14.9261 8.91745 15.1835 8.62436 15.6984 8.03817C16.6941 6.90469 17.1919 6.33796 17.5884 6.37278C17.8028 6.39161 18.0034 6.5008 18.1509 6.679C18.4235 7.00844 18.3485 7.80536 18.1985 9.3992Z"
          fill="#A6ADBB"
          style={{ fill: '#A6ADBB', fillOpacity: 1 }}
        />
        <path
          opacity="0.3"
          d="M10.7937 10.71L10.7117 10.563C10.3951 9.99494 10.2367 9.71094 10 9.71094C9.76325 9.71094 9.60491 9.99494 9.28825 10.563L9.20633 10.71C9.11641 10.8714 9.07141 10.9521 9.00125 11.0054C8.93108 11.0586 8.84375 11.0784 8.669 11.1179L8.50991 11.1539C7.89496 11.2931 7.58751 11.3626 7.51436 11.5979C7.44121 11.8331 7.65081 12.0782 8.07002 12.5684L8.17848 12.6953C8.29761 12.8345 8.35716 12.9042 8.384 12.9904C8.41075 13.0765 8.40175 13.1694 8.38375 13.3554L8.36733 13.5245C8.30396 14.1786 8.27228 14.5056 8.46375 14.651C8.65533 14.7964 8.94316 14.6639 9.51891 14.3988L9.66783 14.3302C9.83141 14.2549 9.91325 14.2172 10 14.2172C10.0867 14.2172 10.1685 14.2549 10.3322 14.3302L10.4811 14.3988C11.0568 14.6639 11.3447 14.7964 11.5362 14.651C11.7277 14.5056 11.696 14.1786 11.6327 13.5245L11.6162 13.3554C11.5982 13.1694 11.5892 13.0765 11.616 12.9904C11.6428 12.9042 11.7024 12.8345 11.8215 12.6953L11.93 12.5684C12.3492 12.0782 12.5588 11.8331 12.4857 11.5979C12.4125 11.3626 12.105 11.2931 11.4901 11.1539L11.331 11.1179C11.1562 11.0784 11.0689 11.0586 10.9987 11.0054C10.9286 10.9521 10.8836 10.8714 10.7937 10.71Z"
          fill="#1D232A"
          style={{ fill: '#1D232A', fillOpacity: 1 }}
        />
      </svg>
    ),
  },
];

const TournamentTabs = [
  {
    label: '',
    value: 'jili',
    icon: (
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 1.12744C8.17155 1.12744 6.37729 1.27622 4.62882 1.56248C4.26621 1.62185 4 1.93518 4 2.30263V2.68916C3.17339 2.84599 2.35799 3.03461 1.55514 3.25372C1.23821 3.34021 1.01446 3.6229 1.00306 3.95123C1.00102 4.00975 1 4.06849 1 4.12744C1 6.72229 2.97645 8.85527 5.50636 9.10335C6.27572 9.97228 7.29439 10.6173 8.45156 10.9256C8.35539 11.7119 8.11892 12.4542 7.76796 13.1274H7.5C6.67157 13.1274 6 13.799 6 14.6274V17.1274H5.25C4.55964 17.1274 4 17.6871 4 18.3774C4 18.7917 4.33579 19.1274 4.75 19.1274H15.25C15.6642 19.1274 16 18.7917 16 18.3774C16 17.6871 15.4404 17.1274 14.75 17.1274H14V14.6274C14 13.799 13.3284 13.1274 12.5 13.1274H12.232C11.8811 12.4542 11.6446 11.7119 11.5484 10.9256C12.7056 10.6173 13.7243 9.97229 14.4936 9.10335C17.0235 8.85527 19 6.72229 19 4.12744C19 4.06848 18.999 4.00973 18.9969 3.95123C18.9855 3.6229 18.7618 3.34021 18.4449 3.25372C17.642 3.03461 16.8266 2.84599 16 2.68916V2.30263C16 1.93518 15.7338 1.62185 15.3712 1.56248C13.6227 1.27622 11.8285 1.12744 10 1.12744ZM2.52524 4.54988C3.01226 4.4272 3.50395 4.31622 4 4.21728V5.12744C4 5.86693 4.13404 6.57569 4.37906 7.23032C3.38067 6.70765 2.66567 5.71712 2.52524 4.54988ZM17.4748 4.54988C17.3343 5.71712 16.6193 6.70765 15.6209 7.23033C15.866 6.57569 16 5.86693 16 5.12744V4.21728C16.496 4.31622 16.9877 4.4272 17.4748 4.54988Z"
          fill="#A6ADBB"
          style={{ fill: '#A6ADBB', fillOpacity: 1 }}
        />
      </svg>
    ),
  },
  {
    label: '',
    value: 'pg',
    icon: (
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 1.12744C8.17155 1.12744 6.37729 1.27622 4.62882 1.56248C4.26621 1.62185 4 1.93518 4 2.30263V2.68916C3.17339 2.84599 2.35799 3.03461 1.55514 3.25372C1.23821 3.34021 1.01446 3.6229 1.00306 3.95123C1.00102 4.00975 1 4.06849 1 4.12744C1 6.72229 2.97645 8.85527 5.50636 9.10335C6.27572 9.97228 7.29439 10.6173 8.45156 10.9256C8.35539 11.7119 8.11892 12.4542 7.76796 13.1274H7.5C6.67157 13.1274 6 13.799 6 14.6274V17.1274H5.25C4.55964 17.1274 4 17.6871 4 18.3774C4 18.7917 4.33579 19.1274 4.75 19.1274H15.25C15.6642 19.1274 16 18.7917 16 18.3774C16 17.6871 15.4404 17.1274 14.75 17.1274H14V14.6274C14 13.799 13.3284 13.1274 12.5 13.1274H12.232C11.8811 12.4542 11.6446 11.7119 11.5484 10.9256C12.7056 10.6173 13.7243 9.97229 14.4936 9.10335C17.0235 8.85527 19 6.72229 19 4.12744C19 4.06848 18.999 4.00973 18.9969 3.95123C18.9855 3.6229 18.7618 3.34021 18.4449 3.25372C17.642 3.03461 16.8266 2.84599 16 2.68916V2.30263C16 1.93518 15.7338 1.62185 15.3712 1.56248C13.6227 1.27622 11.8285 1.12744 10 1.12744ZM2.52524 4.54988C3.01226 4.4272 3.50395 4.31622 4 4.21728V5.12744C4 5.86693 4.13404 6.57569 4.37906 7.23032C3.38067 6.70765 2.66567 5.71712 2.52524 4.54988ZM17.4748 4.54988C17.3343 5.71712 16.6193 6.70765 15.6209 7.23033C15.866 6.57569 16 5.86693 16 5.12744V4.21728C16.496 4.31622 16.9877 4.4272 17.4748 4.54988Z"
          fill="#A6ADBB"
          style={{ fill: '#A6ADBB', fillOpacity: 1 }}
        />
      </svg>
    ),
  },
  {
    label: '',
    value: '0',
    icon: (
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 1.12744C8.17155 1.12744 6.37729 1.27622 4.62882 1.56248C4.26621 1.62185 4 1.93518 4 2.30263V2.68916C3.17339 2.84599 2.35799 3.03461 1.55514 3.25372C1.23821 3.34021 1.01446 3.6229 1.00306 3.95123C1.00102 4.00975 1 4.06849 1 4.12744C1 6.72229 2.97645 8.85527 5.50636 9.10335C6.27572 9.97228 7.29439 10.6173 8.45156 10.9256C8.35539 11.7119 8.11892 12.4542 7.76796 13.1274H7.5C6.67157 13.1274 6 13.799 6 14.6274V17.1274H5.25C4.55964 17.1274 4 17.6871 4 18.3774C4 18.7917 4.33579 19.1274 4.75 19.1274H15.25C15.6642 19.1274 16 18.7917 16 18.3774C16 17.6871 15.4404 17.1274 14.75 17.1274H14V14.6274C14 13.799 13.3284 13.1274 12.5 13.1274H12.232C11.8811 12.4542 11.6446 11.7119 11.5484 10.9256C12.7056 10.6173 13.7243 9.97229 14.4936 9.10335C17.0235 8.85527 19 6.72229 19 4.12744C19 4.06848 18.999 4.00973 18.9969 3.95123C18.9855 3.6229 18.7618 3.34021 18.4449 3.25372C17.642 3.03461 16.8266 2.84599 16 2.68916V2.30263C16 1.93518 15.7338 1.62185 15.3712 1.56248C13.6227 1.27622 11.8285 1.12744 10 1.12744ZM2.52524 4.54988C3.01226 4.4272 3.50395 4.31622 4 4.21728V5.12744C4 5.86693 4.13404 6.57569 4.37906 7.23032C3.38067 6.70765 2.66567 5.71712 2.52524 4.54988ZM17.4748 4.54988C17.3343 5.71712 16.6193 6.70765 15.6209 7.23033C15.866 6.57569 16 5.86693 16 5.12744V4.21728C16.496 4.31622 16.9877 4.4272 17.4748 4.54988Z"
          fill="#A6ADBB"
          style={{ fill: '#A6ADBB', fillOpacity: 1 }}
        />
      </svg>
    ),
  },
];

export const CasinoTabs = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>(tableTabs(t)[0].value);
  const { tournamentList } = useTournamentList();
  const { isMobile } = useSystem();
  const { user } = useAuth();

  // Keep track of tab state even when not visible
  const [latestTabMounted, setLatestTabMounted] = useState(true);
  const [greatestTabMounted, setGreatestTabMounted] = useState(false);

  // Handle tab change and manage component mounting
  const handleTabChange = useCallback((tabValue: string) => {
    setActiveTab(tabValue);

    // When switching to a tab, ensure it's mounted
    if (tabValue === 'latest') {
      setLatestTabMounted(true);
    } else if (tabValue === 'greatest') {
      setGreatestTabMounted(true);
    }
  }, []);

  // Filter tabs based on tournament data availability
  const filteredTabs = useMemo(() => {
    if (!tournamentList || tournamentList.length === 0) {
      return tableTabs(t); // Return normal tabs if no tournament data
    }

    // Get active tournament providers from the data
    const activeProviders = new Set(tournamentList.map((t) => t.provider));

    // First add all table tabs
    const allTabs: TabType[] = [...tableTabs(t)];

    // Then add tournament tabs with matching providers
    TournamentTabs.forEach((tab) => {
      if (activeProviders.has(tab.value)) {
        // Find the matching tournament to get its name
        const matchingTournament = tournamentList.find((t) => t.provider === tab.value);
        if (matchingTournament) {
          allTabs.push({
            ...tab,
            label: matchingTournament.name,
          });
        }
      }
    });

    return allTabs;
  }, [tournamentList]);

  // Render tournament content based on the active tab
  const renderTournamentContent = useCallback(
    (tabValue: string, isProgress?: boolean) => {
      if (!tournamentList) return null;

      const tournamentData = tournamentList.find((t) => t.provider === tabValue);
      if (!tournamentData) return null;
      if (!isProgress) isProgress = false;

      switch (tabValue) {
        case 'jili':
          return <JiliContent obj={tournamentData} disableProgress={isProgress} />;
        case 'pg':
          return <PgContent obj={tournamentData} disableProgress={isProgress} />;
        case '0':
          // 错误提示表明 TreasureContent 组件不接受 disableProgress 属性，因此只传递 obj 属性
          return <TreasureContent obj={tournamentData} />;
        default:
          return null;
      }
    },
    [tournamentList],
  );

  // Get the content for the active tab
  const renderTabContent = useMemo(() => {
    // For tournament tabs
    if (['jili', 'pg', '0'].includes(activeTab)) {
      return renderTournamentContent(activeTab);
    }

    // Return structured content
    return (
      <>
        {/* Keep Latest component mounted but hidden when not active */}
        <div className={activeTab === 'latest' ? 'block' : 'hidden'}>{latestTabMounted && <LatestContent />}</div>

        {/* Keep Greatest component mounted but hidden when not active */}
        <div className={activeTab === 'greatest' ? 'block' : 'hidden'}>{greatestTabMounted && <GreatestContent />}</div>
      </>
    );
  }, [activeTab, latestTabMounted, greatestTabMounted, renderTournamentContent]);

  // Determine the CSS classes for the content container
  const contentContainerClasses = useMemo(() => {
    const isFirstTab = activeTab === filteredTabs[0]?.value;
    const isLastTab = activeTab === filteredTabs[filteredTabs.length - 1]?.value;

    return clsx(
      'bg-base-100 border-base-300 overflow-hidden',
      isFirstTab && 'rounded-r-xl rounded-b-xl',
      isLastTab && 'rounded-xl',
      !isFirstTab && !isLastTab && 'rounded-xl',
    );
  }, [activeTab, filteredTabs]);

  const formatTournamentName = (name: string) => {
    // format tournament name
    // Jili tournament -> jiliTournament
    // PG tournament -> pgTournament
    // PP tournament -> ppTournament
    // Beginner's Luck -> beginnersLuck
    // 将字符串格式化成驼峰命名法

    if (!name) return '';

    // 处理特殊缩写，如PG、PP等，保持大写
    const specialAbbreviations = ['PG', 'PP', 'CQ9'];

    // 移除所有非字母数字字符，并将单词分割
    const words = name.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/);

    // 处理第一个单词
    let firstWord = words[0];
    // 检查第一个单词是否是特殊缩写
    const isSpecialAbbr = specialAbbreviations.includes(firstWord.toUpperCase());

    if (isSpecialAbbr) {
      // 如果是特殊缩写，保持小写
      firstWord = firstWord.toLowerCase();
    } else {
      // 否则，首字母小写
      firstWord = firstWord.charAt(0).toLowerCase() + firstWord.slice(1);
    }

    // 处理剩余单词，首字母大写
    const restWords = words.slice(1).map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    // 组合成驼峰命名法
    return firstWord + restWords.join('');
  };

  return (
    <div className="flex flex-1">
      <div className="flex flex-col">
        <div className="tabs tabs-lift hide-scrollbar flex flex-nowrap items-center overflow-x-scroll">
          {filteredTabs.map((tab) => (
            <label key={tab.value} className="tab [--tab-bg:var(--color-base-100)]">
              <input
                type="radio"
                name="casino_tabs"
                checked={activeTab === tab.value}
                onChange={() => handleTabChange(tab.value)}
              />
              <div className="flex items-center gap-2 pr-4">
                {tab.icon}
                <p className="text-sm whitespace-nowrap">{t(`casino:${formatTournamentName(tab.label)}`)}</p>
              </div>
            </label>
          ))}
        </div>
        <div className={contentContainerClasses}>{renderTabContent}</div>
      </div>

      {!isMobile && !!user && (
        <div className="ml-6 flex flex-col">
          <div className="tab w-88 [--tab-bg:var(--color-base-100)]">
            <label className="text-sm">{t('casino:activeTournaments')}</label>
          </div>
          {/* card 1  */}
          <div className="w-88 rounded-2xl">
            <div>{renderTournamentContent('jili', true)}</div>
          </div>
          {/* card 2 */}
          <div className="mt-6 w-88 rounded-2xl">
            <div>{renderTournamentContent('pg', true)}</div>
          </div>
        </div>
      )}
    </div>
  );
};
