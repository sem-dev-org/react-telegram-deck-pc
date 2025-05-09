import { useNavigate } from 'react-router-dom';
import { getClaim, setClaim } from '@/api/referral';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { IClaim } from '@/types/referral';
import { useAuth } from '@/contexts/auth';
import Decimal from 'decimal.js';
import { paths } from '@/routes/paths';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useSettingStore } from '@/store/setting';
import { useTranslation } from 'react-i18next';

export const ReferralHeader = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [groupValue, setGroupValue] = useState<IClaim | null>(null);
  const [referralValue, setReferralValue] = useState<IClaim | null>(null);

  const { user, status } = useAuth();

  const getReferralClaim = useCallback(() => {
    getClaim({ item: 'referral' }).then((res) => {
      if (res.code === 0) {
        setReferralValue(res.data.data);
      }
    });
  }, []);

  const getGroupClaim = useCallback(() => {
    getClaim({ item: 'group' }).then((res) => {
      if (res.code === 0) {
        setGroupValue(res.data.data);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      getReferralClaim();
      getGroupClaim();
    }
  }, [user]);

  const { displayInFiat } = useSettingStore();

  const { convertCurrency } = useCurrencyFormatter();

  const commission = useMemo(
    () =>
      convertCurrency(groupValue?.value ?? 0, {
        sourceCurrency: groupValue?.currency ?? '',
        targetCurrency: user?.currency_fiat ?? '',
      }),
    [groupValue?.value, user?.currency_fiat, displayInFiat],
  );

  const commissionSum = useMemo(
    () =>
      convertCurrency(groupValue?.sum ?? 0, {
        sourceCurrency: groupValue?.currency ?? '',
        targetCurrency: user?.currency_fiat ?? '',
      }),
    [groupValue?.value, user?.currency_fiat, displayInFiat],
  );

  const referralValueSum = useMemo(
    () =>
      convertCurrency(referralValue?.value ?? 0, {
        sourceCurrency: referralValue?.currency ?? '',
        targetCurrency: user?.currency_fiat ?? '',
      }),
    [referralValue?.value, user?.currency_fiat, displayInFiat],
  );

  const referralSum = useMemo(
    () =>
      convertCurrency(referralValue?.sum ?? 0, {
        sourceCurrency: referralValue?.currency ?? '',
        targetCurrency: user?.currency_fiat ?? '',
      }),
    [referralValue?.sum, user?.currency_fiat, displayInFiat],
  );

  const referralLocked = useMemo(
    () =>
      convertCurrency(referralValue?.locked ?? 0, {
        sourceCurrency: referralValue?.currency ?? '',
        targetCurrency: user?.currency_fiat ?? '',
      }),
    [referralValue?.locked, user?.currency_fiat, displayInFiat],
  );

  const total = useMemo(() => {
    const value = Decimal(groupValue?.sum ?? 0)
      .add(referralValue?.sum ?? 0)
      .toNumber();
    return convertCurrency(value, {
      sourceCurrency: groupValue?.currency ?? '',
      targetCurrency: user?.currency_fiat ?? '',
    });
  }, [groupValue?.sum, referralValue?.sum, groupValue?.currency, user?.currency_fiat, displayInFiat]);

  const [referralLoading, setReferralLoading] = useState(false);
  const [groupLoading, setGroupLoading] = useState(false);

  const handleReferralClaim = () => {
    setReferralLoading(true);
    setClaim({ item: 'referral' })
      .then((res) => {
        if (res.code === 0) {
          getReferralClaim();
        }
      })
      .finally(() => {
        setReferralLoading(false);
      });
  };

  const handleGroupClaim = () => {
    setGroupLoading(true);
    setClaim({ item: 'group' })
      .then((res) => {
        if (res.code === 0) {
          getGroupClaim();
        }
      })
      .finally(() => {
        setGroupLoading(false);
      });
  };

  return (
    <>
      <div className="flex flex-col px-1">
        <p className="text-base-content/60 text-sm leading-5">{t('referral:lifetimeReferralRewards')}</p>
        <p className="text-primary text-3xl leading-9 font-bold">
          {/* ₱ {Decimal(groupValue?.value ?? 0)
            .add(groupValue?.sum ?? 0)
            .add(referralValue?.value ?? 0)
            .add(referralValue?.sum ?? 0)
            .toDecimalPlaces(displayDecimal, Decimal.ROUND_DOWN)
            .toFixed(displayDecimal)
        } */}
          {total}
        </p>
        <p
          className="flex items-center gap-3 text-sm leading-5"
          onClick={() => {
            navigate(paths.main.referral.list);
          }}
        >
          <span className="text-sm leading-5">
            <span className="text-base-content/60">{t('referral:referrals')}: </span>
            <span className="text-primary/60">{status?.direct_invitations}</span>
          </span>
          <svg width="4" height="8" viewBox="0 0 4 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.78347 3.77903C3.90551 3.90107 3.90551 4.09893 3.78347 4.22097L0.658471 7.34597C0.536432 7.46801 0.338568 7.46801 0.216529 7.34597C0.0944902 7.22393 0.0944902 7.02607 0.216529 6.90403L3.12056 4L0.216529 1.09597C0.0944904 0.973932 0.0944904 0.776068 0.216529 0.654029C0.338568 0.53199 0.536432 0.53199 0.658471 0.654029L3.78347 3.77903Z"
              fill="#A6ADBB"
              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
            />
          </svg>
        </p>
      </div>

      <div
        className="mt-1 flex flex-col rounded-xl p-4"
        style={{
          background: `linear-gradient(180deg, color(display-p3 0.329 0.502 0.596 / 0.2) 0%, color(display-p3 0.114 0.137 0.165 / 0.2) 59.96%), color(display-p3 0.114 0.137 0.165)`,

        }}
      >
        <div className="flex items-center">
          <div className="flex flex-1 flex-col">
            <p className="text-sm leading-5">{t('referral:availableCommissionRewards')}</p>
            <div className="flex items-center justify-between">
              <p className="text-primary text-3xl leading-9 font-bold">{commission}</p>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleGroupClaim()}
                disabled={Number(groupValue?.value) === 0 || groupLoading}
              >
                {groupLoading ? <span className="loading loading-spinner loading-sm text-primary"></span> : 'Claim'}
              </button>
            </div>
            <p className="text-sm leading-5">
              {t('referral:totalReceived')}: <span className="font-bold">{commissionSum}</span>
            </p>
          </div>
        </div>

        <div className="divider my-3" />

        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="flex flex-1 flex-col px-1">
              <p className="text-sm leading-5">{t('referral:availableReferralRewards')}</p>
              <div className="flex items-center justify-between">
                <p className="text-primary text-3xl leading-9 font-bold">{referralValueSum}</p>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleReferralClaim()}
                  disabled={Number(referralValue?.value) === 0 || referralLoading}
                >
                  {referralLoading ? (
                    <span className="loading loading-spinner loading-sm text-primary"></span>
                  ) : (
                    'Claim'
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm leading-5">
                  {t('referral:totalReceived')}: <span className="font-bold">{referralSum}</span>
                </p>
                <p className="text-sm leading-5">
                  {t('referral:lockedRewards')}: <span className="font-bold">{referralLocked}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
