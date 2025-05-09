import { CountdownTime } from '@/components/ui/CountdownTime';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { useLocation, useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';
import { useTranslation } from 'react-i18next';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useAuth } from '@/contexts/auth';
import { useEffect, useMemo, useState, useRef } from 'react';

export const DepositInfoPopup = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { status } = useAuth();
  const { formatCurrency } = useCurrencyFormatter();
  const isInDeposit = pathname.includes('finance');
  const intervalIdRef = useRef<number | null>(null);
  
  // State to store calculated time left
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 23,
    minutes: 59,
    seconds: 59,
  });
  
  // Update countdown timer based on status.deposit_bonus_expire
  useEffect(() => {
    // Get deposit_bonus_expire from status (using type assertion as it might not be in the type definition)
    const expireTime = (status as any)?.deposit_bonus_expire;
    if (!expireTime) return;
    
    // Function to calculate remaining time
    const updateRemainingTime = () => {
      const now = new Date().getTime() / 1000; // Convert to seconds
      const difference = expireTime - now;
      
      if (difference <= 0) {
        // Countdown is over
        if (intervalIdRef.current !== null) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      // Calculate time components
      const days = Math.floor(difference / (60 * 60 * 24));
      const hours = Math.floor((difference % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((difference % (60 * 60)) / 60);
      const seconds = Math.floor(difference % 60);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };
    
    // Initial calculation
    updateRemainingTime();
    
    // Update every second
    intervalIdRef.current = window.setInterval(updateRemainingTime, 1000);
    
    return () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [(status as any)?.deposit_bonus_expire]);

  const details = useMemo(() => {
    return {
      name: t('popup:deposit.title'),
      timeLabel: t('popup:deposit.expiresIn'),
      time: timeLeft,
      prize: 50000,
      data: {
        position: '19th',
        wagered: '57,371.42',
        prize: '317.42',
        prizePercentage: '0.5',
      },
    };
  }, [timeLeft, t]);

  return (
    <ModalDialog open={open} onClose={onClose} className="h-[80%] bg-transparent p-0">
      <div
        className="relative flex h-50 w-full overflow-hidden rounded-t-2xl p-4"
        style={{
          background: `
            radial-gradient(100% 308% at 100% 0%, rgba(74, 166, 56, 0.5) 0%, rgba(20, 25, 31, 0.5) 100%), #14191F`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '154px',
            height: '154px',
            right: '27px',
            bottom: '23px',
          }}
        >
          <img
            src="/images/bouns/deposit-info.png"
            className="absolute h-[154px] w-[154px] object-cover drop-shadow-[0px_-2px_10px_rgba(44,37,47,0.5)]"
          />
        </div>
        <div className="flex flex-col justify-center pl-4">
          <CountdownTime key={`${timeLeft.days}-${timeLeft.hours}-${timeLeft.minutes}-${timeLeft.seconds}`} details={details} />
        </div>
      </div>
      <div
        className="flex flex-col gap-3 p-6"
        style={{
          background: 'linear-gradient(180deg, rgba(69, 129, 155, 0.2) 0%, rgba(27, 35, 43, 0.2) 59.96%), #1B232B',
        }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h4 className="text-base leading-6 font-bold">{t('popup:deposit.depositBonus')}</h4>
            <button className="btn btn-secondary h-6 px-2 text-xs font-semibold">{t('popup:deposit.general')}</button>
          </div>
          <p className="text-sm leading-5">{t('popup:deposit.description')}</p>
        </div>

        <div
          className="flex items-center justify-between rounded-lg px-4"
          style={{
            background:
              'radial-gradient(100% 324.99% at 100% 50%, rgba(246, 177, 72, 0.2) 0%, rgba(24, 30, 37, 0.2) 100%), #181E25',
          }}
        >
          <div>
            <h4 className="text-sm leading-5 font-bold">{t('popup:deposit.firstDepositBonus')}</h4>
            <div className="text-primary leading-6 font-bold">{t('popup:deposit.firstDepositBonusValue')}</div>
            <p className="text-xs leading-4">{t('popup:deposit.firstDepositMinimum', { value: formatCurrency(1) })}</p>
          </div>
          <img src="/images/bouns/box-black.png" className="h-21 w-21" />
        </div>

        <div
          className="flex items-center justify-between rounded-lg px-4"
          style={{
            background:
              'radial-gradient(100% 324.99% at 100% 50%, rgba(246, 177, 72, 0.2) 0%, rgba(24, 30, 37, 0.2) 100%), #181E25',
          }}
        >
          <div>
            <h4 className="text-sm leading-5 font-bold">{t('popup:deposit.secondDepositBonus')}</h4>
            <div className="text-primary leading-6 font-bold">{t('popup:deposit.secondDepositBonusValue')}</div>
            <p className="text-xs leading-4">
              {t('popup:deposit.secondDepositMinimum', { value: formatCurrency(10) })}
            </p>
          </div>
          <img src="/images/bouns/box-red.png" className="h-21 w-21" />
        </div>

        <div
          className="flex items-center justify-between rounded-lg px-4"
          style={{
            background:
              'radial-gradient(100% 324.99% at 100% 50%, rgba(246, 177, 72, 0.2) 0%, rgba(24, 30, 37, 0.2) 100%), #181E25',
          }}
        >
          <div>
            <h4 className="text-sm leading-5 font-bold">{t('popup:deposit.thirdDepositBonus')}</h4>
            <div className="text-primary leading-6 font-bold">{t('popup:deposit.thirdDepositBonusValue')}</div>
            <p className="text-xs leading-4">{t('popup:deposit.thirdDepositMinimum', { value: formatCurrency(20) })}</p>
          </div>
          <img src="/images/bouns/box-purple.png" className="h-21 w-21" />
        </div>

        <div
          className="flex items-center justify-between rounded-lg px-4"
          style={{
            background:
              'radial-gradient(100% 324.99% at 100% 50%, rgba(246, 177, 72, 0.2) 0%, rgba(24, 30, 37, 0.2) 100%), #181E25',
          }}
        >
          <div>
            <h4 className="text-sm leading-5 font-bold">{t('popup:deposit.fourthDepositBonus')}</h4>
            <div className="text-primary leading-6 font-bold">{t('popup:deposit.fourthDepositBonusValue')}</div>
            <p className="text-xs leading-4">
              {t('popup:deposit.fourthDepositMinimum', { value: formatCurrency(100) })}
            </p>
          </div>
          <img src="/images/bouns/box-blue.png" className="h-21 w-21" />
        </div>

        <p className="text-sm leading-5">{t('popup:deposit.depositInvitation')}</p>

        <button
          className="btn btn-secondary h-12 text-xs font-semibold"
          onClick={() => {
            if (isInDeposit) {
              onClose();
            } else {
              navigate(paths.main.finance.deposit);
            }
          }}
        >
          {t('popup:deposit.depositNow')}
        </button>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-base leading-6 font-bold">{t('popup:deposit.howIsBonusCalculated')}</h4>
          <p className="text-sm leading-5">
            {t('popup:deposit.bonusCalculationDesc1', { value: formatCurrency(20000) })}
            <br />
            <br />
            {t('popup:deposit.bonusCalculationDesc2', { value: formatCurrency(40000) })}
            <br />
            <br />
            {t('popup:deposit.bonusCalculationDesc3', { value: formatCurrency(60000) })}
            <br />
            <br />
            {t('popup:deposit.bonusCalculationDesc4', { value: formatCurrency(100000) })}
          </p>
        </div>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-base leading-6 font-bold">{t('popup:deposit.expiration')}</h4>
          <p className="text-sm leading-5">{t('popup:deposit.expirationDesc')}</p>
        </div>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-base leading-6 font-bold">{t('popup:deposit.generalTerms')}</h4>
          <p className="text-sm leading-5">
            <span>
              {t('popup:deposit.generalTermsDesc1')} <br /> <br />
            </span>
            <span>{t('popup:deposit.generalTermsDesc2')}</span>
          </p>
        </div>
      </div>
    </ModalDialog>
  );
};
