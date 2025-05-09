import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useClaimBonus, useUserClaims } from '@/query/bonus';
import { IClaim } from '@/types/referral';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { PopupTournament } from '../popup/PopupTournament';

export const GeneralBonusTournament = () => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrencyFormatter();
  const [isOpenTournamentRewardPopup, setIsOpenTournamentRewardPopup] = useState(false);

  // Fetch tournament claim data
  const { data: tournamentClaim } = useUserClaims({ item: 'tournament' });

  // Claim bonus mutation
  const claimBonusMutation = useClaimBonus();

  // Type guard to check if claim is an array
  const isClaimArray = (claim: IClaim | IClaim[] | undefined): claim is IClaim[] => {
    return Array.isArray(claim);
  };

  // Helper function to get claim value
  const getClaimValue = (claim: IClaim | IClaim[] | undefined): string | number => {
    if (!claim) return 0;

    if (isClaimArray(claim)) {
      return claim.length > 0 ? claim[0]?.value || 0 : 0;
    }

    return claim.value || 0;
  };

  // Handle claim bonus
  const handleClaimBonus = () => {
    claimBonusMutation.mutate(
      { item: 'tournament' },
      {
        onSuccess: () => {
          toast.success(t('toast:tournamentRewardClaimedSuccessfully'));
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('toast:tournamentRewardClaimFailed'));
        },
      },
    );
  };

  return (
    <>
      <div
        className="flex flex-col gap-3 rounded-lg p-4"
        style={{
          background: `radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 0.941 0.757 0.239 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)`,
        }}
      >
        <div className="relative flex items-center gap-4">
          <div className="absolute top-0 right-0" onClick={() => setIsOpenTournamentRewardPopup(true)}>
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
          <img src="/icons/isometric/39.svg" className="h-15 w-15" />
          <div className="flex w-full flex-col">
            <p className="text-neutral-content text-base font-bold">{t('bonus:tournament_reward')}</p>
            <p className="mt-2 text-sm leading-relaxed">
              {t('bonus:your_tournament_reward_is_ready_tap_to_claim_now')}
            </p>
          </div>
        </div>

        <div className="flex w-full items-center gap-1">
          <label className="input flex-1 bg-[#1D232A]/70">
            <img src="/icons/isometric/5.svg" className="h-4 w-4" />
            <input
              type="search"
              className="flex-1 grow text-base font-bold"
              placeholder=""
              readOnly
              value={formatCurrency(getClaimValue(tournamentClaim?.data), { includeSymbol: true })}
            />
          </label>
          <button
            className="btn btn-secondary px-3 text-sm font-semibold"
            onClick={handleClaimBonus}
            disabled={
              claimBonusMutation.isPending || !tournamentClaim?.data?.value || tournamentClaim?.data?.value <= 0
            }
          >
            {claimBonusMutation.isPending && claimBonusMutation.variables?.item === 'tournament' ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              t('bonus:claim')
            )}
          </button>
        </div>
      </div>

      {isOpenTournamentRewardPopup && (
        <PopupTournament
          open={isOpenTournamentRewardPopup}
          onClose={() => setIsOpenTournamentRewardPopup(false)}
        />
      )}
    </>
  );
};
