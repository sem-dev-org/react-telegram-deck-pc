import { claimConquest } from '@/api/bonus';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useGetConquestsCompleted, useGetConquestsReward } from '@/query/bonus';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { PopupConquests } from '../popup/PopupConquests';

interface GeneralBonusConquestsProps {}

export const GeneralBonusConquests = ({}: GeneralBonusConquestsProps) => {
  const { t } = useTranslation();
  const [isOpenMissionsInfoPopup, setIsOpenMissionsInfoPopup] = useState(false);

  const { data: conquestsCompleted } = useGetConquestsCompleted();
  const { data: conquestsReward } = useGetConquestsReward();

  const [isClaiming, setIsClaiming] = useState(false);

  const { formatCurrency } = useCurrencyFormatter();

  const handleClaimBonus = async () => {
    try {
      setIsClaiming(true);
      await claimConquest();
      toast.success(t('common.success'));
    } catch (error) {
      console.error(error);
      toast.error(t('common.failed'));
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div
      className="flex flex-col gap-2 rounded-lg p-4"
      style={{
        background: `radial-gradient(100% 157.05% at 0% 46.47%, rgba(210, 29, 59, 0.4) 0%, rgba(51, 51, 51, 0.08) 100%), #1B232B`,
      }}
    >
      <div className="relative flex items-center gap-4 pr-4">
        <div className="absolute top-0 right-0" onClick={() => setIsOpenMissionsInfoPopup(true)}>
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
        <img src="/icons/isometric/2.svg" className="h-15 w-15" />
        <div className="flex flex-col">
          <p className="text-neutral-content text-base font-bold">{t('bonus:conquests')}</p>
          <p className="mt-2 text-sm leading-relaxed">
            {t('bonus:complete_three_conquests_to_release')}
            <span className="text-primary">
              {formatCurrency(conquestsReward?.conquest_reward ?? 0, { includeSymbol: true })}
            </span>{' '}
            {t('bonus:from_your_bonus_pool_today')}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="flex w-full flex-col gap-2">
          <p className="text-xs font-semibold">
            {conquestsCompleted?.completed_conquest ?? 0}/{conquestsCompleted?.total_conquest ?? 0}{' '}
            {t('bonus:completed')}
          </p>
          <progress
            className="progress progress-primary"
            value={conquestsCompleted?.completed_conquest ?? 0}
            max={conquestsCompleted?.total_conquest ?? 0}
          />
        </div>
        <button
          className="btn btn-secondary px-3 text-sm font-semibold"
          onClick={handleClaimBonus}
          disabled={isClaiming || conquestsCompleted?.completed_conquest < (conquestsCompleted?.total_conquest ?? 0)}
        >
          {isClaiming ? <span className="loading loading-spinner loading-xs"></span> : t('bonus:claim')}
        </button>
      </div>
      {isOpenMissionsInfoPopup && (
        <PopupConquests open={isOpenMissionsInfoPopup} onClose={() => setIsOpenMissionsInfoPopup(false)} />
      )}
    </div>
  );
};
