import { useAuth } from '@/contexts/auth';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useClaimBonus, useUserClaims } from '@/query/bonus';
import { QueryMyVipLevelConfig, QueryVipNextLevelConfig } from '@/query/vip';
import { vipBadgeColors } from '@/utils/color';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const TabContentVIPBonus = () => {
  const { status } = useAuth();
  const { myVipLevelConfig } = QueryMyVipLevelConfig();
  const { vipNextLevelConfig } = QueryVipNextLevelConfig();

  const { t } = useTranslation();

  const vipXpProgress = useMemo(() => {
    if (status?.vip && vipNextLevelConfig) {
      return Number(((status?.xp / vipNextLevelConfig?.xp) * 100).toFixed(2));
    }
    return 0;
  }, [status?.xp, vipNextLevelConfig]);

  const { formatCurrency } = useCurrencyFormatter();

  const claimBonusMutation = useClaimBonus();

  const { data: levelUpClaim } = useUserClaims({ item: 'level_up' });

  const handleClaimBonus = () => {
    try {
      claimBonusMutation.mutate({ item: 'level_up' });
      toast.success(t('toast:bonusClaimedSuccessfully'));
    } catch (error) {
      toast.error(t('toast:claimBonusFailed'));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative mt-2 flex flex-col gap-2 rounded-lg p-4"
        style={{
          background:
            'linear-gradient(137deg, color(display-p3 1.000 1.000 1.000 / 0.2) 0%, color(display-p3 0.000 0.000 0.000 / 0) 100%), linear-gradient(101deg, color(display-p3 1.000 1.000 1.000 / 0.1) 25%, color(display-p3 0.000 0.000 0.000 / 0) 25%)',
        }}
      >
        {myVipLevelConfig ? (
          <img
            src={`/icons/vip-badge/${myVipLevelConfig?.medal}.png`}
            className="absolute top-0 right-2 z-10 h-24 w-24 -translate-y-1/5"
          />
        ) : (
          <div className="h-24 w-24" />
        )}
        <div className="flex items-center gap-2">
          <p className="text-neutral-content font-bold">VIP {status?.vip}</p>
          <div
            className="flex h-6 items-center justify-center rounded-lg p-2 text-xs font-semibold text-white"
            style={{
              background: vipBadgeColors[vipNextLevelConfig?.medal as keyof typeof vipBadgeColors],
            }}
          >
            {vipNextLevelConfig?.medal?.toUpperCase()}
          </div>
        </div>

        <p className="text-xs font-semibold">
          {t('bonus:your_vip_progress')}: {vipXpProgress}%
        </p>

        <progress className="progress progress-primary bg-base-content/20 w-9/12" value={vipXpProgress} max="100" />

        <div className="mt-1.5 flex items-center justify-between">
          <p className="text-sm">{t('bonus:total_vip_bonus_claimed')}</p>
          <p className="text-primary/80 text-sm font-bold">{formatCurrency(levelUpClaim?.data?.sum ?? 0)}</p>
        </div>

        {Number(levelUpClaim?.data?.value ?? 0) <= 0 ? (
          <button className="btn border-base-content flex h-[48px] gap-2 border bg-transparent">
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.50002 0.799805C6.5118 0.799805 4.90002 2.41158 4.90002 4.3998V7.1998H4.50002C3.61637 7.1998 2.90002 7.91615 2.90002 8.7998V13.5998C2.90002 14.4835 3.61637 15.1998 4.50002 15.1998H12.5C13.3837 15.1998 14.1 14.4835 14.1 13.5998V8.7998C14.1 7.91615 13.3837 7.1998 12.5 7.1998H12.1V4.3998C12.1 2.41158 10.4882 0.799805 8.50002 0.799805ZM10.9 7.1998V4.3998C10.9 3.07432 9.82551 1.9998 8.50002 1.9998C7.17454 1.9998 6.10002 3.07432 6.10002 4.3998V7.1998H10.9Z"
                fill="#A6ADBB"
              />
            </svg>
            <p className="text-sm font-semibold">{t('bonus:available_at_vip', { vip: vipNextLevelConfig?.vip })}</p>
          </button>
        ) : (
          <button className="btn border-base-content btn-primary flex h-[48px] gap-2" onClick={handleClaimBonus}>
            <p className="text-sm font-semibold">{t('bonus:claim')}</p>
          </button>
        )}
      </div>

      <div
        className="flex flex-col gap-2 rounded-lg p-4"
        style={{
          background:
            'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 0.125 0.655 0.596 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <div className="relative flex items-center gap-4">
          <div className="absolute top-0 right-0">
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
          <img src="/icons/isometric/13.svg" className="h-12 w-12" />
          <div className="flex flex-col">
            <p className="text-neutral-content text-base font-bold">{t('bonus:lucky_spin')}</p>
            <p className="mt-2 text-sm leading-relaxed">
              {t('bonus:hit_vip_4_and_gain_access_to_lucky_spin_your_chance_to_win_extra_rewards_every_single_day')}
            </p>
          </div>
          <button className="btn btn-secondary btn-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.99998 0.700195C5.26028 0.700195 3.84998 2.1105 3.84998 3.8502V6.3002H3.49998C2.72678 6.3002 2.09998 6.927 2.09998 7.7002V11.9002C2.09998 12.6734 2.72678 13.3002 3.49998 13.3002H10.5C11.2732 13.3002 11.9 12.6734 11.9 11.9002V7.7002C11.9 6.927 11.2732 6.3002 10.5 6.3002H10.15V3.8502C10.15 2.1105 8.73967 0.700195 6.99998 0.700195ZM9.09998 6.3002V3.8502C9.09998 2.6904 8.15977 1.7502 6.99998 1.7502C5.84018 1.7502 4.89998 2.6904 4.89998 3.8502V6.3002H9.09998Z"
                fill="#E7FB78"
                fillOpacity="0.8"
              />
            </svg>

            <p className="text-secondary-content text-sm">VIP 4</p>
          </button>
        </div>
      </div>

      <div
        className="flex flex-col gap-2 rounded-lg p-4"
        style={{
          background:
            'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 0.984 0.608 0.290 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <div className="relative flex items-center gap-4">
          <div className="absolute top-0 right-0">
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
          <img src="/icons/isometric/32.svg" className="h-12 w-12" />
          <div className="flex flex-col">
            <p className="text-neutral-content text-base font-bold">{t('bonus:lucky_number_seven')}</p>
            <p className="mt-2 text-sm leading-relaxed">{t('bonus:once_a_month_a_mystery_lands_in_your_account')}</p>
          </div>
          <button className="btn btn-secondary btn-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.99998 0.700195C5.26028 0.700195 3.84998 2.1105 3.84998 3.8502V6.3002H3.49998C2.72678 6.3002 2.09998 6.927 2.09998 7.7002V11.9002C2.09998 12.6734 2.72678 13.3002 3.49998 13.3002H10.5C11.2732 13.3002 11.9 12.6734 11.9 11.9002V7.7002C11.9 6.927 11.2732 6.3002 10.5 6.3002H10.15V3.8502C10.15 2.1105 8.73967 0.700195 6.99998 0.700195ZM9.09998 6.3002V3.8502C9.09998 2.6904 8.15977 1.7502 6.99998 1.7502C5.84018 1.7502 4.89998 2.6904 4.89998 3.8502V6.3002H9.09998Z"
                fill="#E7FB78"
                fillOpacity="0.8"
              />
            </svg>

            <p className="text-secondary-content text-sm">VIP 7</p>
          </button>
        </div>
      </div>

      <div
        className="flex flex-col gap-2 rounded-lg p-4"
        style={{
          background:
            'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 1.000 0.588 0.620 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <div className="relative flex items-center gap-4">
          <div className="absolute top-0 right-0">
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
          <img src="/icons/isometric/14.svg" className="h-12 w-12" />
          <div className="flex flex-col">
            <p className="text-neutral-content text-base font-bold">{t('bonus:weekly_cashback')}</p>
            <p className="mt-2 text-sm leading-relaxed">
              {t('bonus:reach_vip_12_and_unlock_weekly_cashback_your_personal_safety_net_for_high_roller_action')}
            </p>
          </div>
          <button className="btn btn-secondary btn-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.99998 0.700195C5.26028 0.700195 3.84998 2.1105 3.84998 3.8502V6.3002H3.49998C2.72678 6.3002 2.09998 6.927 2.09998 7.7002V11.9002C2.09998 12.6734 2.72678 13.3002 3.49998 13.3002H10.5C11.2732 13.3002 11.9 12.6734 11.9 11.9002V7.7002C11.9 6.927 11.2732 6.3002 10.5 6.3002H10.15V3.8502C10.15 2.1105 8.73967 0.700195 6.99998 0.700195ZM9.09998 6.3002V3.8502C9.09998 2.6904 8.15977 1.7502 6.99998 1.7502C5.84018 1.7502 4.89998 2.6904 4.89998 3.8502V6.3002H9.09998Z"
                fill="#E7FB78"
                fillOpacity="0.8"
              />
            </svg>

            <p className="text-secondary-content text-sm">VIP 12</p>
          </button>
        </div>
      </div>

      <div
        className="flex flex-col gap-2 rounded-lg p-4"
        style={{
          background:
            'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 0.780 0.275 0.318 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <div className="relative flex items-center gap-4">
          <div className="absolute top-0 right-0">
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
          <img src="/icons/isometric/16.svg" className="h-12 w-12" />
          <div className="flex flex-col">
            <p className="text-neutral-content text-base font-bold">{t('bonus:the_jester')}</p>
            <p className="mt-2 text-sm leading-relaxed">
              {t('bonus:every_tap_on_the_jester_drops_a_reward_but_hurry_this_trickster_won_t_stick_around_forever')}
            </p>
          </div>
          <button className="btn btn-secondary btn-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.99998 0.700195C5.26028 0.700195 3.84998 2.1105 3.84998 3.8502V6.3002H3.49998C2.72678 6.3002 2.09998 6.927 2.09998 7.7002V11.9002C2.09998 12.6734 2.72678 13.3002 3.49998 13.3002H10.5C11.2732 13.3002 11.9 12.6734 11.9 11.9002V7.7002C11.9 6.927 11.2732 6.3002 10.5 6.3002H10.15V3.8502C10.15 2.1105 8.73967 0.700195 6.99998 0.700195ZM9.09998 6.3002V3.8502C9.09998 2.6904 8.15977 1.7502 6.99998 1.7502C5.84018 1.7502 4.89998 2.6904 4.89998 3.8502V6.3002H9.09998Z"
                fill="#E7FB78"
                fillOpacity="0.8"
              />
            </svg>

            <p className="text-secondary-content text-sm">VIP 29</p>
          </button>
        </div>
      </div>

      <div
        className="flex flex-col gap-2 rounded-lg p-4"
        style={{
          background:
            'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 0.341 0.282 0.537 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <div className="relative flex items-center gap-4">
          <div className="absolute top-0 right-0">
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
          <img src="/icons/isometric/40.svg" className="h-12 w-12" />
          <div className="flex flex-col">
            <p className="text-neutral-content text-base font-bold">{t('bonus:the_cannon')}</p>
            <p className="mt-2 text-sm leading-relaxed">
              {t('bonus:a_reward_so_powerful_so_exclusive_that_its_true_nature_remains_a_closely_guarded_secret')}
            </p>
          </div>
          <button className="btn btn-secondary btn-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.99998 0.700195C5.26028 0.700195 3.84998 2.1105 3.84998 3.8502V6.3002H3.49998C2.72678 6.3002 2.09998 6.927 2.09998 7.7002V11.9002C2.09998 12.6734 2.72678 13.3002 3.49998 13.3002H10.5C11.2732 13.3002 11.9 12.6734 11.9 11.9002V7.7002C11.9 6.927 11.2732 6.3002 10.5 6.3002H10.15V3.8502C10.15 2.1105 8.73967 0.700195 6.99998 0.700195ZM9.09998 6.3002V3.8502C9.09998 2.6904 8.15977 1.7502 6.99998 1.7502C5.84018 1.7502 4.89998 2.6904 4.89998 3.8502V6.3002H9.09998Z"
                fill="#E7FB78"
                fillOpacity="0.8"
              />
            </svg>

            <p className="text-secondary-content text-sm">VIP 38</p>
          </button>
        </div>
      </div>
    </div>
  );
};
