import { FullBleedContainer, Page, SafeContent } from '@/components/ui';
import { TransactionBetHistory, TransactionHistory, TransactionRollover } from '@/sections/transaction';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function TransactionPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('transaction-history');
  const [searchParams] = useSearchParams();

  // 监听URL参数变化，设置当前活动的tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['bet', 'transaction', 'rollover'].includes(tabParam as any)) {
      setTab(tabParam as 'bet' | 'transaction' | 'rollover');
    }
  }, [searchParams]);

  // 处理tab切换
  const handleTabChange = (newTab: 'bet' | 'transaction' | 'rollover') => {
    setTab(newTab);
  };

  return (
    <FullBleedContainer className="flex h-full flex-1 flex-col">
      <SafeContent className="flex h-full flex-1 flex-col">
        <Page className="bg-base-300 flex flex-1 flex-col gap-3 p-3">
          <div className="tabs tabs-box tabs-sm bg-transparent p-0 font-bold">
            <a
              onClick={() => handleTabChange('transaction')}
              className={clsx(
                'tab text-secondary-content px-4 text-sm [--tab-bg:var(--color-secondary)]',
                tab === 'transaction' && 'tab-active',
              )}
            >
              {t('transaction:tabs.transactionHistory')}
            </a>

            <a
              onClick={() => handleTabChange('bet')}
              className={clsx(
                'tab text-secondary-content px-4 text-sm [--tab-bg:var(--color-secondary)]',
                tab === 'bet' && 'tab-active',
              )}
            >
              {t('transaction:tabs.betHistory')}
            </a>

            <a
              onClick={() => handleTabChange('rollover')}
              className={clsx(
                'tab text-secondary-content px-4 text-sm [--tab-bg:var(--color-secondary)]',
                tab === 'rollover' && 'tab-active',
              )}
            >
              {t('transaction:tabs.rollover')}
            </a>
          </div>

          {tab === 'transaction' && <TransactionHistory />}
          {tab === 'bet' && <TransactionBetHistory />}
          {tab === 'rollover' && <TransactionRollover />}
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
}
