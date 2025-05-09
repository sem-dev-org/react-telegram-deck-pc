import { activateBooster } from '@/api/bonus';
import { CurrencyDisplay } from '@/components/CurrencyDisplay';
import { useAuth } from '@/contexts/auth';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useClaimBonus, useUserClaims } from '@/query/bonus';
import { IClaim } from '@/types/referral';
import NumberFlow from '@number-flow/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { PopupRakeback } from '../popup/PopupRakeback';

export const GeneralBonusRakeback = () => {
  const { t } = useTranslation();
  const { status } = useAuth();
  const { formatCurrency } = useCurrencyFormatter();
  const [isOpenRakebackInfoPopup, setIsOpenRakebackInfoPopup] = useState(false);

  // Booster states
  const [boosterExpireTimestamp, setBoosterExpireTimestamp] = useState<number | null>(null);
  const [boosterIsActive, setBoosterIsActive] = useState(false);
  const [batteryCount, setBatteryCount] = useState<number>(0);
  const [activateBoosterLoading, setActivateBoosterLoading] = useState<boolean>(false);
  const localBatteryExpireRef = useRef<number | null>(null);

  // Fetch rakeback claim data
  const { data: rakebackClaim } = useUserClaims({ item: 'rakeback' });

  // Claim bonus mutation
  const claimBonusMutation = useClaimBonus();

  // Initialize local battery state and expiration time
  useEffect(() => {
    if (status?.battery !== undefined) {
      setBatteryCount(status.battery);
    }

    // Only update ref when there's no value, or the status value is later (expires later)
    if (
      status?.battery_expire &&
      (!localBatteryExpireRef.current || status.battery_expire > localBatteryExpireRef.current)
    ) {
      localBatteryExpireRef.current = status.battery_expire;
    }
  }, [status?.battery, status?.battery_expire]);

  // Handle booster expiration time
  useEffect(() => {
    // Use timestamp from ref, or fall back to status value
    const currentExpireTimestamp = localBatteryExpireRef.current || status?.battery_expire;

    if (!currentExpireTimestamp) {
      setBoosterIsActive(false);
      setBoosterExpireTimestamp(null);
      return;
    }

    const now = new Date();
    const expireDate = new Date(currentExpireTimestamp * 1000);
    const boosterDifference = expireDate.getTime() - now.getTime();

    if (boosterDifference <= 0) {
      setBoosterIsActive(false);
      setBoosterExpireTimestamp(null);
      // Clear local ref if expired
      localBatteryExpireRef.current = null;
    } else {
      setBoosterIsActive(true);
      setBoosterExpireTimestamp(currentExpireTimestamp);
    }

    // Check expiration every second
    const timerId = setInterval(() => {
      const now = new Date();
      const expireDate = new Date(currentExpireTimestamp * 1000);
      const boosterDifference = expireDate.getTime() - now.getTime();

      if (boosterDifference <= 0) {
        setBoosterIsActive(false);
        setBoosterExpireTimestamp(null);
        // Clear local ref if expired
        localBatteryExpireRef.current = null;
        clearInterval(timerId);
      }
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [localBatteryExpireRef.current]); // Depend on local ref instead of status

  // Calculate remaining time in seconds from timestamp
  const getRemainingSeconds = () => {
    if (!boosterExpireTimestamp) return 0;

    const now = new Date();
    const expireDate = new Date(boosterExpireTimestamp * 1000);
    const difference = Math.max(0, Math.floor((expireDate.getTime() - now.getTime()) / 1000));

    return difference;
  };

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

  // Handle activate booster
  const handleActivateBooster = async () => {
    // Check if battery count is sufficient
    if (batteryCount <= 0) {
      toast.error(t('toast:noBoostersAvailable'));
      return;
    }

    try {
      setActivateBoosterLoading(true);
      const result = await activateBooster();

      // Update state after successful activation
      if (result && result.battery_expire) {
        // Update battery count
        if (result.battery !== undefined) {
          setBatteryCount(result.battery);
        } else {
          // If API response doesn't include new battery count, reduce local count
          setBatteryCount((prev) => Math.max(0, prev - 1));
        }

        // Update local ref with expiration time
        localBatteryExpireRef.current = result.battery_expire;

        // Update booster expiration time state
        setBoosterExpireTimestamp(result.battery_expire);
        setBoosterIsActive(true);
      }

      toast.success(t('toast:boosterActivatedSuccessfully'));
    } catch (error) {
      console.error(error);
      toast.error(t('toast:boosterActivatedFailed'));
    } finally {
      setActivateBoosterLoading(false);
    }
  };

  // Handle claim bonus
  const handleClaimBonus = () => {
    claimBonusMutation.mutate(
      { item: 'rakeback' },
      {
        onSuccess: () => {
          toast.success(t('toast:rakebackClaimedSuccessfully'));
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('toast:rakebackClaimFailed'));
        },
      },
    );
  };

  return (
    <>
      <div
        className="flex flex-col gap-3 rounded-lg p-4"
        style={{
          background: `radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 0.200 0.302 0.671 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)`,
        }}
      >
        <div className="relative flex items-center gap-4">
          <div className="absolute top-0 right-0" onClick={() => setIsOpenRakebackInfoPopup(true)}>
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
          <img src="/icons/isometric/25.png" className="h-15 w-15" />
          <div className="flex w-full flex-col gap-2">
            <p className="text-neutral-content text-base font-bold">{t('bonus:super_rakeback')}</p>
            <div className="flex items-center gap-3 self-end">
              <button
                className="btn btn-sm btn-secondary"
                onClick={handleActivateBooster}
                disabled={batteryCount <= 0 || activateBoosterLoading}
              >
                {activateBoosterLoading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <img src="/icons/isometric/26.png" className="h-4 w-4" />
                )}
                <p>
                  {boosterIsActive ? (
                    <span>
                      {t('bonus:active')} -
                      <span className="countdown font-mono">
                        <span
                          style={{ '--value': Math.floor(getRemainingSeconds() / 3600) } as React.CSSProperties}
                        ></span>
                        h
                        <span
                          style={{ '--value': Math.floor((getRemainingSeconds() % 3600) / 60) } as React.CSSProperties}
                        ></span>
                        m<span style={{ '--value': getRemainingSeconds() % 60 } as React.CSSProperties}></span>s
                      </span>
                    </span>
                  ) : (
                    t('bonus:activate_booster')
                  )}
                </p>
              </button>
              <button className="btn btn-sm bg-[#1D232A]/70 px-3" disabled={batteryCount <= 0}>
                x <NumberFlow value={batteryCount} />
              </button>
            </div>
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
              value={formatCurrency(getClaimValue(rakebackClaim?.data), { includeSymbol: true })}
            />
          </label>
          <button
            className="btn btn-secondary px-3 text-sm font-semibold"
            onClick={handleClaimBonus}
            disabled={claimBonusMutation.isPending || !rakebackClaim?.data?.value || rakebackClaim?.data?.value <= 0}
          >
            {claimBonusMutation.isPending && claimBonusMutation.variables?.item === 'rakeback' ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              t('bonus:claim')
            )}
          </button>
        </div>

        <div className="flex items-center justify-between px-1">
          <p className="text-neutral-content text-sm">{t('bonus:locked')}</p>
          <p className="text-sm font-bold">
            <CurrencyDisplay amountInUSD={rakebackClaim?.data?.locked} />
          </p>
        </div>
      </div>

      {isOpenRakebackInfoPopup && (
        <PopupRakeback open={isOpenRakebackInfoPopup} onClose={() => setIsOpenRakebackInfoPopup(false)} />
      )}
    </>
  );
};
