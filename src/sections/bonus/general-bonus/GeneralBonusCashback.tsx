import { SelectDropdown, SelectOption } from '@/components/ui/SelectDropdown';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useClaimBonus, useUserClaims } from '@/query/bonus';
import { IClaim } from '@/types/referral';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { PopupCashback } from '../popup/PopupCashback';

// 注册UTC插件
dayjs.extend(utc);

export const GeneralBonusCashback = () => {
  const { t } = useTranslation();
  const { convertCurrency } = useCurrencyFormatter();
  const [isOpenDailyInfoPopup, setIsOpenDailyInfoPopup] = useState(false);

  // Cashback timer state
  const [cashbackTimeLeft, setCashbackTimeLeft] = useState({
    days: 0,
    hours: 7,
    minutes: 27,
    seconds: 32,
  });

  // Fetch cashback claim data
  const { data: cashbackClaim } = useUserClaims({ item: 'cashback' });

  // Claim bonus mutation
  const claimBonusMutation = useClaimBonus();

  // 定义扩展的Claim类型，包含currency字段
  interface ExtendedClaim extends Omit<IClaim, 'currency'> {
    currency?: string;
  }

  // 添加状态存储选中的cashback币种
  const [selectedCashbackCurrency, setSelectedCashbackCurrency] = useState<string>('');

  // 添加当前选中的cashback item
  const [currentCashbackItem, setCurrentCashbackItem] = useState<ExtendedClaim | null>(null);

  // 定义包含amount属性的选项类型
  interface CashbackOption extends SelectOption {
    amount: string;
  }

  // 处理cashback下拉选项
  const cashbackOptions = useMemo<CashbackOption[]>(() => {
    if (!cashbackClaim?.data) return [];

    // 确保data是数组
    const data = Array.isArray(cashbackClaim.data) ? cashbackClaim.data : [cashbackClaim.data];

    return data.map((item: any) => ({
      id: item.id.toString(),
      value: item.currency,
      label: item.currency,
      amount: item.value,
    }));
  }, [cashbackClaim?.data]);

  // 当cashback options变化时，选择第一个作为默认值
  useEffect(() => {
    if (cashbackOptions.length > 0 && !selectedCashbackCurrency) {
      setSelectedCashbackCurrency(cashbackOptions[0].value as string);

      if (cashbackClaim?.data && Array.isArray(cashbackClaim.data)) {
        setCurrentCashbackItem(cashbackClaim.data[0] as ExtendedClaim);
      }
    }
  }, [cashbackOptions, cashbackClaim?.data]);

  // 处理选择cashback币种变化
  const handleCashbackCurrencyChange = (value: string | number) => {
    setSelectedCashbackCurrency(value as string);

    if (cashbackClaim?.data && Array.isArray(cashbackClaim.data)) {
      const selectedItem = cashbackClaim.data.find((item: any) => item.currency === value);
      if (selectedItem) {
        setCurrentCashbackItem(selectedItem as ExtendedClaim);
      }
    }
  };

  // 自定义渲染选项，显示货币金额
  const renderCashbackOption = (option: SelectOption) => {
    const item = cashbackOptions.find((o: CashbackOption) => o.value === option.value);
    if (!item) return null;

    return (
      <div className="flex w-full items-center gap-2">
        <img src={`/icons/tokens/${item.label?.toLocaleLowerCase()}.svg`} className="h-4 w-4" />
        <span className="text-sm">
          {convertCurrency(item.amount, { sourceCurrency: item.label || '', targetCurrency: item.label || '' })}
        </span>
      </div>
    );
  };

  // 自定义渲染选中值
  const renderSelectedCashback = (option: SelectOption | null) => {
    if (!option) return null;

    const item = cashbackOptions.find((o: CashbackOption) => o.value === option.value);
    if (!item) return null;

    return (
      <div className="flex w-full items-center gap-2">
        <img src={`/icons/tokens/${item.label?.toLocaleLowerCase()}.svg`} className="h-4 w-4" />
        <span className="text-base font-semibold">
          {convertCurrency(item.amount, { sourceCurrency: item.label || '', targetCurrency: item.label || '' })}
        </span>
      </div>
    );
  };

  // 处理领取奖励
  const handleClaimBonus = () => {
    // 当item是cashback时，需要传递currency参数
    if (currentCashbackItem?.currency) {
      claimBonusMutation.mutate(
        { item: 'cashback', currency: currentCashbackItem.currency },
        {
          onSuccess: () => {
            toast.success(t('toast:bonusClaimedSuccessfully'));
          },
          onError: (error) => {
            console.error(error);
            toast.error(t('toast:bonusClaimFailed'));
          },
        },
      );
    }
  };

  // Update cashback timer
  useEffect(() => {
    // 设置 Daily Cashback 结束日期，使用UTC 00:00作为截止时间
    const calculateNextUtcMidnight = () => {
      // 获取当前时间
      const now = dayjs();
      // 获取下一个UTC零点
      let nextUtcMidnight = dayjs().utc().endOf('day').add(1, 'second');
      
      // 如果已经过了今天的UTC零点，则使用下一个
      if (nextUtcMidnight.isBefore(now)) {
        nextUtcMidnight = nextUtcMidnight.add(1, 'day');
      }
      
      return nextUtcMidnight;
    };

    const cashbackEndDate = calculateNextUtcMidnight();

    // 计算并更新剩余时间的函数
    const updateRemainingTime = () => {
      const now = dayjs();

      // 只更新 Daily Cashback 倒计时
      if (cashbackEndDate.isBefore(now)) {
        setCashbackTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const diff = cashbackEndDate.diff(now, 'second');
        const days = Math.floor(diff / (24 * 60 * 60));
        const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((diff % (60 * 60)) / 60);
        const seconds = diff % 60;
        setCashbackTimeLeft({ days, hours, minutes, seconds });
      }
    };

    // 立即执行一次，确保初始值是准确的
    updateRemainingTime();

    // 使用 requestAnimationFrame 来优化更新频率
    let frameId: number;
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
  }, []);

  return (
    <>
      <div
        className="flex flex-col gap-3 rounded-lg p-4"
        style={{
          background: `radial-gradient(100% 157.05% at 0% 46.47%, rgba(240, 170, 30, 0.4) 0%, rgba(51, 51, 51, 0.08) 100%), #1B232B`,
        }}
      >
        <div className="relative flex items-center gap-4">
          <div className="absolute top-0 right-0" onClick={() => setIsOpenDailyInfoPopup(true)}>
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
          <img src="/icons/isometric/27.png" className="h-15 w-15" />
          <div className="flex w-full flex-col gap-2">
            <p className="text-neutral-content text-base font-bold">{t('bonus:daily_cashback')}</p>
            <div className="flex items-center gap-3">
              <p>
                <span className="text-primary text-2xl font-bold">
                  {cashbackClaim?.thisMedalVipConfig?.cashback_other
                    ? (cashbackClaim.thisMedalVipConfig.cashback_other * 100).toFixed(0)
                    : '0'}
                  %{' '}
                </span>
                <span className="text-2xl font-bold opacity-30">
                  {'>>'}{' '}
                  {cashbackClaim?.nextMedalVipConfig?.cashback_other
                    ? (cashbackClaim.nextMedalVipConfig.cashback_other * 100).toFixed(0)
                    : '0'}
                  %
                </span>{' '}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {cashbackOptions.length > 0 ? (
            <SelectDropdown
              options={cashbackOptions}
              value={selectedCashbackCurrency}
              onChange={handleCashbackCurrencyChange}
              placeholder="Select currency"
              renderOption={renderCashbackOption}
              renderValue={renderSelectedCashback}
              className="flex-1"
              height="sm"
              variant="filled"
              buttonClassName="bg-[#1D232A]/70 h-10 bg-base-100 opacity-80"
            />
          ) : (
            <label className="input flex-1 bg-[#1D232A]/70">
              <img src="/icons/isometric/5.svg" className="h-4 w-4" />
              <input type="search" className="grow text-base font-bold" placeholder="" readOnly value="0.00" />
            </label>
          )}
          <button
            className="btn btn-secondary px-3 text-sm font-semibold"
            onClick={handleClaimBonus}
            disabled={
              claimBonusMutation.isPending || !currentCashbackItem?.value || parseFloat(currentCashbackItem.value) <= 0
            }
          >
            {claimBonusMutation.isPending && claimBonusMutation.variables?.item === 'cashback' ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              t('bonus:claim')
            )}
          </button>
        </div>

        <div className="text-neutral-content flex items-center justify-center gap-1 text-center text-xs">
          <p>{t('bonus:next_claim_in')}</p>
          <div className="flex items-center justify-center gap-1 font-semibold">
            <div>
              <span className="countdown font-mono">
                <span style={{ '--value': cashbackTimeLeft.hours } as React.CSSProperties}></span>
              </span>
              h
            </div>
            <div>
              <span className="countdown font-mono">
                <span style={{ '--value': cashbackTimeLeft.minutes } as React.CSSProperties}></span>
              </span>
              m
            </div>
            <div>
              <span className="countdown font-mono">
                <span style={{ '--value': cashbackTimeLeft.seconds } as React.CSSProperties}></span>
              </span>
              s
            </div>
          </div>
        </div>
      </div>

      {isOpenDailyInfoPopup && (
        <PopupCashback open={isOpenDailyInfoPopup} onClose={() => setIsOpenDailyInfoPopup(false)} />
      )}
    </>
  );
};
