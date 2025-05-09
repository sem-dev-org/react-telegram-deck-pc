import { FullBleedContainer, Page, SafeContent } from '@/components/ui';
import { useAuth } from '@/contexts/auth';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { QueryClaim, QueryMyVipLevelConfig, QueryVipNextLevelConfig } from '@/query/vip';
import { VipTabContentFaq, VipTabContentLevelingChart, VipTabContentProgramRewards } from '@/sections/vip';
import { useThemeStore } from '@/store/theme';
import { vipBadgeColors } from '@/utils/color';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function VipPage() {
  const [tab, setTab] = useState('program-rewards');
  const { setBackground } = useThemeStore();
  const { status } = useAuth();
  const { formatCurrency } = useCurrencyFormatter();
  const { t } = useTranslation('vip');

  // query
  const { myClaim } = QueryClaim();
  const { myVipLevelConfig } = QueryMyVipLevelConfig();
  const { vipNextLevelConfig } = QueryVipNextLevelConfig();

  // 获取Claim数据中item = level_up的数据
  const levelUpClaimData = useMemo(() => {
    console.log(myClaim);
    if (myClaim) {
      return myClaim?.find((item: any) => item.item === 'level_up');
    }
    return null;
  }, [myClaim]);

  useEffect(() => {
    setBackground(
      'linear-gradient(180deg, color(display-p3 0.914 0.765 0.647 / 0.3) 0%, color(display-p3 0.082 0.098 0.118 / 0.3) 100%), color(display-p3 0.082 0.098 0.118)',
    );
    return () => setBackground('var(--color-base-300)');
  }, []);

  return (
    <FullBleedContainer>
      <img
        src="/images/illustrations/vip-bg.png"
        alt="bonus"
        className="absolute top-[64px] right-0 -z-10 h-[293px] w-[218px] object-cover opacity-80"
      />

      <SafeContent>
        <Page className="flex flex-col gap-3 p-3">
          <div className="flex flex-col px-1">
            <p className="text-base-content/60 text-sm leading-5">{t('lifetime_vip_rewards')}</p>
            <p className="text-primary h-9 text-3xl font-bold">
              {formatCurrency(levelUpClaimData?.sum ?? 0, { includeSymbol: true })}
            </p>
            {/* <div className="text-base-content/60 flex items-center gap-2 leading-5">
              <p className="text-sm">
                Eligible: <span className="text-primary">3</span>{' '}
              </p>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.78347 4.77903C6.90551 4.90107 6.90551 5.09893 6.78347 5.22097L3.65847 8.34597C3.53643 8.46801 3.33857 8.46801 3.21653 8.34597C3.09449 8.22393 3.09449 8.02607 3.21653 7.90403L6.12056 5L3.21653 2.09597C3.09449 1.97393 3.09449 1.77607 3.21653 1.65403C3.33857 1.53199 3.53643 1.53199 3.65847 1.65403L6.78347 4.77903Z"
                  fill="#A6ADBB"
                />
              </svg>
            </div> */}
          </div>
          <div
            className="relative mt-1 flex flex-col gap-2 rounded-lg p-4"
            style={{
              background:
                'linear-gradient(136.93deg, color(display-p3 1.000 1.000 1.000 / 0.3) 0%, color(display-p3 0.000 0.000 0.000 / 0) 100%), linear-gradient(100.68deg, color(display-p3 1.000 1.000 1.000 / 0.1) 25%, color(display-p3 0.000 0.000 0.000 / 0) 25%)',
            }}
          >
            <div className="isolate flex h-6 items-center gap-2">
              <p className="text-neutral-content font-bold">VIP {myVipLevelConfig?.vip}</p>
              <div
                className="flex h-4 items-center justify-center rounded-md px-2 text-xs font-bold text-white"
                style={{
                  background: vipBadgeColors[myVipLevelConfig?.medal as keyof typeof vipBadgeColors],
                }}
              >
                {myVipLevelConfig?.medal?.toUpperCase()}
              </div>
            </div>

            <p className="text-xs font-semibold">
              {t('your_vip_progress')}: {Number(((status?.xp ?? 0) / (vipNextLevelConfig?.xp ?? 0)) * 100).toFixed(2)}%
            </p>
            <progress
              className="progress progress-primary w-8/12"
              value={status?.xp ?? 0}
              max={vipNextLevelConfig?.xp ?? 0}
            ></progress>

            {myVipLevelConfig ? (
              <img
                src={`/icons/vip-badge/${myVipLevelConfig?.medal}.png`}
                className="absolute -top-4 right-[21px] h-20 w-20 drop-shadow-2xl"
              />
            ) : (
              <div className="h-20 w-20" />
            )}
          </div>
          <div className="tabs tabs-box tabs-sm hide-scrollbar flex flex-nowrap items-center overflow-x-auto rounded-none bg-transparent p-0 font-bold">
            <input
              type="radio"
              className="tab text-secondary-content text-sm font-semibold"
              aria-label={t('abouts')}
              style={{ '--tab-bg': 'var(--color-secondary)' } as React.CSSProperties}
              checked={tab === 'program-rewards'}
              onChange={() => setTab('program-rewards')}
            />

            <input
              type="radio"
              className="tab text-secondary-content text-sm font-semibold"
              aria-label={t('leveling_chart')}
              style={{ '--tab-bg': 'var(--color-secondary)' } as React.CSSProperties}
              checked={tab === 'leveling-chart'}
              onChange={() => setTab('leveling-chart')}
            />

            <input
              type="radio"
              className="tab text-secondary-content text-sm font-semibold"
              aria-label={t('faq')}
              style={{ '--tab-bg': 'var(--color-secondary)' } as React.CSSProperties}
              checked={tab === 'faq'}
              onChange={() => setTab('faq')}
            />
          </div>
          {tab === 'program-rewards' && <VipTabContentProgramRewards />}
          {tab === 'leveling-chart' && <VipTabContentLevelingChart />}
          {tab === 'faq' && <VipTabContentFaq />}
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
}
