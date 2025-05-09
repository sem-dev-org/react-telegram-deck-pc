import { FullBleedContainer, Page, SafeContent } from '@/components/ui';
import { useAuth } from '@/contexts/auth';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useDepositBonusConfig, useUserClaims } from '@/query/bonus';
import { QueryExchangeRate } from '@/query/rateForUSD';
import { paths } from '@/routes/paths';
import {
  TabContentAchievements,
  TabContentBonusDetails,
  TabContentConquests,
  TabContentGeneralBonus,
  TabContentVIPBonus,
} from '@/sections/bonus';
import { DepositInfoPopup } from '@/sections/bonus/popup/DepositInfoPopup';
import { RedeemPromoCode } from '@/sections/bonus/popup/RedeemPromoCode';
import { useSettingStore } from '@/store/setting';
import { useThemeStore } from '@/store/theme';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function BonusPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, status } = useAuth();
  const { setBackground } = useThemeStore();
  const { formatCurrency } = useCurrencyFormatter();

  // query
  const allRate = QueryExchangeRate();

  const { data: depositBonusConfig } = useDepositBonusConfig();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [activeTab, setActiveTab] = useState('general');

  const getSumMaxBonusClaim = () => {
    // sum depositBonusConfig max
    return depositBonusConfig?.reduce((acc: number, item) => acc + (Number(item?.max_bonus_amount) ?? 0), 0);
  };

  useEffect(() => {
    setBackground(
      'radial-gradient(100% 27.9% at 0% 0%, color(display-p3 0.247 0.318 0.196) 0%, color(display-p3 0.082 0.098 0.118) 100%) , color(display-p3 0.082 0.098 0.118)',
    );

    return () => setBackground('var(--color-base-300)');
  }, []);

  const { data: userClaims } = useUserClaims();

  const totalBonusClaimed = useMemo(() => {
    const usdBonusClaimed = Array.isArray(userClaims?.data)
      ? userClaims?.data?.reduce((acc: number, claim: any) => acc + (Number(claim?.sum) ?? 0), 0)
      : (Number(userClaims?.data?.sum) ?? 0);
    return usdBonusClaimed;
  }, [userClaims?.data, user?.currency_fiat, allRate]);

  // 使用 status.deposit_bonus_expire 处理倒计时
  useEffect(() => {
    // 使用类型断言访问可能不存在的属性
    const expireTime = (status as any)?.deposit_bonus_expire;
    if (!expireTime) return;

    let frameId: number;

    // 计算并更新剩余时间的函数
    const updateRemainingTime = () => {
      const now = new Date().getTime() / 1000; // 转换为秒
      const difference = expireTime - now;

      if (difference <= 0) {
        // 倒计时结束
        cancelAnimationFrame(frameId);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // 计算剩余时间
      const days = Math.floor(difference / (60 * 60 * 24));
      const hours = Math.floor((difference % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((difference % (60 * 60)) / 60);
      const seconds = Math.floor(difference % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // 立即执行一次，确保初始值是准确的
    updateRemainingTime();

    // 使用 requestAnimationFrame 来优化更新频率
    let lastUpdateTime = Date.now();

    const animationFrame = () => {
      const now = Date.now();
      // 每秒更新一次，但使用 requestAnimationFrame 来同步浏览器渲染
      if (now - lastUpdateTime >= 1000) {
        updateRemainingTime();
        lastUpdateTime = now;
      }
      frameId = requestAnimationFrame(animationFrame);
    };

    frameId = requestAnimationFrame(animationFrame);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [(status as any)?.deposit_bonus_expire]);

  const [isOpenDepositInfoPopup, setIsOpenDepositInfoPopup] = useState(false);
  const [isOpenRedeemPromoCode, setIsOpenRedeemPromoCode] = useState(false);

  // 当前用户的存款阶段
  const currentDepositStage = status?.deposit_bonus_times ?? 0;

  // 判断某个阶段是否已完成
  const isStageCompleted = (stageIndex: number): boolean => {
    return currentDepositStage > stageIndex;
  };

  // 判断某个阶段是否当前激活的
  const isStageActive = (stageIndex: number): boolean => {
    return currentDepositStage === stageIndex;
  };

  const { displayInFiat } = useSettingStore();

  return (
    <FullBleedContainer>
      <img
        src="/images/illustrations/Default_4K_BRAZILIAN_STYLE_CASINO_CHARACTER_on_white_backgro_0 (1)-depositphotos-bgremover 1.png"
        alt="bonus"
        className="absolute top-[19px] right-0 h-[189px] w-[252px] object-cover opacity-40"
      />
      <SafeContent>
        <Page className="flex flex-col gap-2 px-3 py-4 pb-24">
          <div className="flex items-start justify-between px-2">
            <div className="flex flex-col gap-1">
              <p className="text-neutral-content text-xs">
                {t('bonus:total_bonus_claimed')} ({displayInFiat ? user?.currency_fiat : 'USDT'})
              </p>
              <p className="text-primary/80 text-lg font-bold">
                {formatCurrency(totalBonusClaimed, { includeSymbol: true })}
              </p>

              <div className="flex items-center gap-2" onClick={() => setActiveTab('details')}>
                <p className="text-neutral-content text-xs">{t('bonus:details')}</p>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.78347 4.77903C6.90551 4.90107 6.90551 5.09893 6.78347 5.22097L3.65847 8.34597C3.53643 8.46801 3.33857 8.46801 3.21653 8.34597C3.09449 8.22393 3.09449 8.02607 3.21653 7.90403L6.12056 5L3.21653 2.09597C3.09449 1.97393 3.09449 1.77607 3.21653 1.65403C3.33857 1.53199 3.53643 1.53199 3.65847 1.65403L6.78347 4.77903Z"
                    fill="#A6ADBB"
                  />
                </svg>
              </div>
            </div>

            <button
              className="btn btn-xs isolate flex h-[32px] items-center gap-2 bg-[#2A323C]/90 opacity-90"
              onClick={() => setIsOpenRedeemPromoCode(true)}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.875 3.71875C0.875 3.11469 1.36469 2.625 1.96875 2.625H12.0312C12.6353 2.625 13.125 3.11469 13.125 3.71875V5.48412C13.125 5.64029 13.0418 5.78462 12.9066 5.86282C12.5131 6.09042 12.25 6.51474 12.25 7C12.25 7.48526 12.5131 7.90958 12.9066 8.13718C13.0418 8.21538 13.125 8.35971 13.125 8.51588V10.2812C13.125 10.8853 12.6353 11.375 12.0312 11.375H1.96875C1.36469 11.375 0.875 10.8853 0.875 10.2812V8.51588C0.875 8.35971 0.958248 8.21538 1.09343 8.13718C1.48688 7.90958 1.75 7.48526 1.75 7C1.75 6.51474 1.48688 6.09042 1.09343 5.86282C0.958248 5.78462 0.875 5.64029 0.875 5.48412V3.71875ZM1.96875 3.5C1.84794 3.5 1.75 3.59794 1.75 3.71875V5.2499C2.28068 5.64851 2.625 6.28385 2.625 7C2.625 7.71615 2.28068 8.35149 1.75 8.7501V10.2812C1.75 10.4021 1.84794 10.5 1.96875 10.5H9.1875V10.0625C9.1875 9.82088 9.38338 9.625 9.625 9.625C9.86662 9.625 10.0625 9.82088 10.0625 10.0625V10.5H12.0312C12.1521 10.5 12.25 10.4021 12.25 10.2812V8.7501C11.7193 8.35149 11.375 7.71616 11.375 7C11.375 6.28384 11.7193 5.64851 12.25 5.2499V3.71875C12.25 3.59794 12.1521 3.5 12.0312 3.5H10.0625V3.9375C10.0625 4.17912 9.86662 4.375 9.625 4.375C9.38338 4.375 9.1875 4.17912 9.1875 3.9375V3.5H1.96875ZM9.625 5.25C9.86662 5.25 10.0625 5.44588 10.0625 5.6875V6.125C10.0625 6.36662 9.86662 6.5625 9.625 6.5625C9.38338 6.5625 9.1875 6.36662 9.1875 6.125V5.6875C9.1875 5.44588 9.38338 5.25 9.625 5.25ZM3.9375 7.4375C3.9375 7.19588 4.13338 7 4.375 7H7.4375C7.67912 7 7.875 7.19588 7.875 7.4375C7.875 7.67912 7.67912 7.875 7.4375 7.875H4.375C4.13338 7.875 3.9375 7.67912 3.9375 7.4375ZM9.625 7.4375C9.86662 7.4375 10.0625 7.63338 10.0625 7.875V8.3125C10.0625 8.55412 9.86662 8.75 9.625 8.75C9.38338 8.75 9.1875 8.55412 9.1875 8.3125V7.875C9.1875 7.63338 9.38338 7.4375 9.625 7.4375ZM3.9375 8.75C3.9375 8.50838 4.13338 8.3125 4.375 8.3125H6.125C6.36662 8.3125 6.5625 8.50838 6.5625 8.75C6.5625 8.99162 6.36662 9.1875 6.125 9.1875H4.375C4.13338 9.1875 3.9375 8.99162 3.9375 8.75Z"
                  fill="#A6ADBB"
                />
              </svg>

              <p className="text-xs">{t('bonus:redeem')}</p>
            </button>
          </div>

          <div
            className="relative isolate flex flex-col gap-2 rounded-xl p-4"
            style={{
              background:
                'linear-gradient(112.39deg, rgba(0, 232, 195, 0.2) 0%, rgba(20, 25, 31, 0.2) 66.71%), #1B232B',
            }}
          >
            <div className="absolute top-4 right-4" onClick={() => setIsOpenDepositInfoPopup(true)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.875 1.75C3.59683 1.75 1.75 3.59683 1.75 5.875C1.75 8.15317 3.59683 10 5.875 10C8.15317 10 10 8.15317 10 5.875C10 3.59683 8.15317 1.75 5.875 1.75ZM1 5.875C1 3.18261 3.18261 1 5.875 1C8.56739 1 10.75 3.18261 10.75 5.875C10.75 8.56739 8.56739 10.75 5.875 10.75C3.18261 10.75 1 8.56739 1 5.875ZM5.5 4C5.5 3.79289 5.66789 3.625 5.875 3.625H5.87875C6.08586 3.625 6.25375 3.79289 6.25375 4V4.00375C6.25375 4.21086 6.08586 4.37875 5.87875 4.37875H5.875C5.66789 4.37875 5.5 4.21086 5.5 4.00375V4ZM5.35304 5.15422C5.92616 4.86766 6.57146 5.38531 6.41606 6.00694L6.06155 7.42496L6.08229 7.41459C6.26753 7.32197 6.49278 7.39705 6.58541 7.58229C6.67803 7.76753 6.60295 7.99278 6.41771 8.08541L6.39697 8.09578C5.82385 8.38234 5.17854 7.86469 5.33394 7.24306L5.68845 5.82504L5.66771 5.83541C5.48246 5.92803 5.25721 5.85295 5.16459 5.66771C5.07197 5.48246 5.14705 5.25721 5.33229 5.16459L5.35304 5.15422Z"
                  fill="#A6ADBB"
                  style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
                />
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <img src="/icons/isometric/1.svg" className="h-12 w-12" />
              <div className="flex flex-col gap-2">
                <p className="text-neutral-content text-base font-bold">{t('bonus:deposit_bonus')}</p>
                <p className="text-primary/80 text-sm font-bold">
                  {t('bonus:get_up_to')}: {formatCurrency(getSumMaxBonusClaim())}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between px-3">
              {/* Stage 1 */}
              <div className="relative flex flex-col items-center">
                <div
                  className={clsx(
                    'absolute top-2/5 left-1/2 z-0 h-0.5 w-full flex-1',
                    isStageCompleted(0) ? 'bg-primary/80' : 'bg-primary/10',
                  )}
                />
                <div className="relative">
                  <img src="/icons/bonus/1.png" className="relative z-10 h-15 w-15" />
                  <input
                    type="checkbox"
                    disabled
                    checked={isStageCompleted(0)}
                    className="checkbox border-primary checkbox-sm checkbox-primary absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 !opacity-80"
                  />
                </div>
                <p
                  className={clsx('text-sm font-bold', {
                    'text-primary': isStageActive(0),
                  })}
                >
                  + {Number(depositBonusConfig?.[0]?.bonus_percent ?? 0) * 100}%
                </p>
              </div>

              {/* Stage 2 */}
              <div className="relative flex flex-col items-center">
                <div
                  className={clsx(
                    'absolute top-2/5 left-1/2 z-0 h-0.5 w-full flex-1',
                    isStageCompleted(1) ? 'bg-primary/80' : 'bg-primary/10',
                  )}
                />
                <div className="relative">
                  <img
                    src={isStageCompleted(1) ? '/icons/bonus/2.png' : '/icons/bonus/2-close.webp'}
                    className={clsx('relative z-10 h-15 w-15', {
                      grayscale: !isStageCompleted(0) && !isStageActive(1),
                    })}
                  />
                  <input
                    type="checkbox"
                    checked={isStageCompleted(1)}
                    disabled
                    className="checkbox border-primary checkbox-sm checkbox-primary absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 !opacity-80"
                  />
                </div>
                <p
                  className={clsx('text-sm font-bold', {
                    'text-primary': isStageActive(1),
                  })}
                >
                  + {Number(depositBonusConfig?.[1]?.bonus_percent ?? 0) * 100}%
                </p>
              </div>

              {/* Stage 3 */}
              <div className="relative flex flex-col items-center">
                <div
                  className={clsx(
                    'absolute top-2/5 left-1/2 z-0 h-0.5 w-full flex-1',
                    isStageCompleted(2) ? 'bg-primary/80' : 'bg-primary/10',
                  )}
                />
                <div className="relative">
                  <img
                    src={isStageCompleted(2) ? '/icons/bonus/3.png' : '/icons/bonus/3-close.webp'}
                    className={clsx('relative z-10 h-15 w-15', {
                      grayscale: !isStageCompleted(1) && !isStageActive(2),
                    })}
                  />
                  <input
                    type="checkbox"
                    checked={isStageCompleted(2)}
                    disabled
                    className="checkbox border-primary checkbox-sm checkbox-primary absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 !opacity-80"
                  />
                </div>
                <p
                  className={clsx('text-sm font-bold', {
                    'text-primary': isStageActive(2),
                  })}
                >
                  + {Number(depositBonusConfig?.[2]?.bonus_percent ?? 0) * 100}%
                </p>
              </div>

              {/* Stage 4 */}
              <div className="relative flex flex-col items-center">
                <div className="relative">
                  <img
                    src="/icons/bonus/4.png"
                    className={clsx('relative z-10 h-15 w-15', {
                      grayscale: !isStageCompleted(2) && !isStageActive(3),
                    })}
                  />
                  <input
                    type="checkbox"
                    checked={isStageCompleted(3)}
                    disabled
                    className="checkbox border-primary checkbox-sm checkbox-primary absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 !opacity-80"
                  />
                </div>
                <p
                  className={clsx('text-sm font-bold', {
                    'text-primary': isStageActive(3),
                  })}
                >
                  + {Number(depositBonusConfig?.[3]?.bonus_percent ?? 0) * 100}%
                </p>
              </div>
            </div>

            <button
              className="btn btn-sm btn-primary h-[48px] w-full border-none text-sm"
              onClick={() => navigate(paths.main.finance.deposit)}
            >
              {t('bonus:deposit_now')}
            </button>
            <div className="text-neutral-content flex items-center justify-center gap-1 text-center text-xs font-bold">
              <p>{t('bonus:bonus_ends_in')}:</p>
              <div className="flex items-center justify-center gap-1">
                <div>
                  <span className="countdown font-mono">
                    <span style={{ '--value': timeLeft.days } as React.CSSProperties} aria-live="polite">
                      {timeLeft.days}
                    </span>
                  </span>
                  d
                </div>
                <div>
                  <span className="countdown font-mono">
                    <span style={{ '--value': timeLeft.hours } as React.CSSProperties} aria-live="polite">
                      {timeLeft.hours}
                    </span>
                  </span>
                  h
                </div>
                <div>
                  <span className="countdown font-mono">
                    <span style={{ '--value': timeLeft.minutes } as React.CSSProperties} aria-live="polite">
                      {timeLeft.minutes}
                    </span>
                  </span>
                  m
                </div>
                <div>
                  <span className="countdown font-mono">
                    <span style={{ '--value': timeLeft.seconds } as React.CSSProperties} aria-live="polite">
                      {timeLeft.seconds}
                    </span>
                  </span>
                  s
                </div>
              </div>
            </div>
          </div>

          <div className="tabs tabs-sm tabs-box hide-scrollbar isolate z-50 -my-1 flex flex-nowrap items-center overflow-x-auto rounded-none bg-transparent px-0 py-2">
            <input
              type="radio"
              name="my-tabs"
              className="tab text-secondary-content text-sm font-semibold"
              aria-label={t('bonus:general_bonus')}
              style={{ '--tab-bg': 'var(--color-secondary)' } as React.CSSProperties}
              checked={activeTab === 'general'}
              onChange={() => setActiveTab('general')}
            />

            <input
              type="radio"
              name="my-tabs"
              className="tab text-secondary-content text-sm font-semibold"
              aria-label={t('bonus:vip_bonus')}
              style={{ '--tab-bg': 'var(--color-secondary)' } as React.CSSProperties}
              checked={activeTab === 'vip'}
              onChange={() => setActiveTab('vip')}
            />

            <input
              type="radio"
              name="my-tabs"
              className="tab text-secondary-content text-sm font-semibold"
              aria-label={t('bonus:conquests')}
              style={{ '--tab-bg': 'var(--color-secondary)' } as React.CSSProperties}
              checked={activeTab === 'conquests'}
              onChange={() => setActiveTab('conquests')}
            />

            <input
              type="radio"
              name="my-tabs"
              className="tab text-secondary-content text-sm font-semibold"
              aria-label={t('bonus:achievements')}
              style={{ '--tab-bg': 'var(--color-secondary)' } as React.CSSProperties}
              checked={activeTab === 'achievements'}
              onChange={() => setActiveTab('achievements')}
            />

            <input
              type="radio"
              name="my-tabs"
              className="tab text-secondary-content text-sm font-semibold"
              aria-label={t('bonus:bonus_details')}
              style={{ '--tab-bg': 'var(--color-secondary)' } as React.CSSProperties}
              checked={activeTab === 'details'}
              onChange={() => setActiveTab('details')}
            />
          </div>

          {activeTab === 'general' && <TabContentGeneralBonus />}
          {activeTab === 'vip' && <TabContentVIPBonus />}
          {activeTab === 'conquests' && <TabContentConquests />}
          {activeTab === 'achievements' && <TabContentAchievements />}
          {activeTab === 'details' && <TabContentBonusDetails />}

          <DepositInfoPopup open={isOpenDepositInfoPopup} onClose={() => setIsOpenDepositInfoPopup(false)} />
          <RedeemPromoCode open={isOpenRedeemPromoCode} onClose={() => setIsOpenRedeemPromoCode(false)} />
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
}
