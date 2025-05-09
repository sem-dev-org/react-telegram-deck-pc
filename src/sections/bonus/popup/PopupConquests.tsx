import { ModalDialog } from '@/components/ui/ModalDialog';
import { CountdownTime } from '@/components/ui/CountdownTime';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const PopupConquests = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const [timeUntilUTCMidnight, setTimeUntilUTCMidnight] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate time remaining until UTC midnight (00:00)
  useEffect(() => {
    const calculateTimeUntilUTCMidnight = () => {
      const now = new Date();

      // Create a Date object for the next UTC midnight
      const tomorrow = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() + 1, // next day
          0,
          0,
          0,
          0, // 00:00:00.000 UTC
        ),
      );

      // Calculate the difference in milliseconds
      const diffMs = tomorrow.getTime() - now.getTime();

      // Convert to hours, minutes, seconds
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeUntilUTCMidnight({ hours, minutes, seconds });
    };

    // Calculate immediately and then set up interval
    calculateTimeUntilUTCMidnight();
    const intervalId = setInterval(calculateTimeUntilUTCMidnight, 1000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const details = {
    name: t('popup:missions.title'),
    timeLabel: t('popup:missions.nextReset'),
    time: timeUntilUTCMidnight,
    prize: 50000,
    data: {
      position: '19th',
      wagered: '57,371.42',
      prize: '317.42',
      prizePercentage: '0.5',
    },
  };

  return (
    <ModalDialog open={open} onClose={onClose} className="h-[70%] bg-transparent p-0">
      <div
        className="relative flex h-50 w-full overflow-hidden rounded-t-2xl p-4"
        style={{
          background: `
            radial-gradient(100% 308% at 100% 0%, rgba(247, 127, 92, 0.5) 0%, rgba(20, 25, 31, 0.5) 100%), #14191F`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '189px',
            height: '189px',
            right: '1px',
            bottom: '4px',
          }}
        >
          <img
            src="/images/bouns/missions-info.png"
            className="absolute h-[189px] w-[189px] object-cover drop-shadow-[0px_-2px_10px_rgba(44,37,47,0.5)]"
          />
        </div>
        <div className="flex flex-col justify-center pl-4">
          <CountdownTime details={details} />
        </div>
      </div>
      <div
        className="flex flex-col gap-3 p-6"
        style={{
          background: 'linear-gradient(180deg, rgba(69, 129, 155, 0.2) 0%, rgba(27, 35, 43, 0.2) 59.96%), #1B232B',
        }}
      >
        <div className="flex flex-col gap-1">
          <div className="text-sm leading-4">{t('popup:missions.eventExpires')}</div>
          <div className="text-primary text-2xl leading-8 font-bold">
            <div className="flex items-center font-mono">
              {timeUntilUTCMidnight.hours > 0 && (
                <span className="countdown">
                  <span style={{ '--value': timeUntilUTCMidnight.hours } as React.CSSProperties}></span>:
                </span>
              )}
              <span className="countdown">
                <span style={{ '--value': timeUntilUTCMidnight.minutes } as React.CSSProperties}></span>:
              </span>
              <span className="countdown">
                <span style={{ '--value': timeUntilUTCMidnight.seconds } as React.CSSProperties}></span>
              </span>
            </div>
          </div>
        </div>

        <div className="divider my-0" />
        <div className="flex flex-col gap-2">
          <h4 className="text-base leading-6 font-bold">{t('popup:missions.claimDistribution')}</h4>

          <div className="text-sm leading-5">
            <p>{t('popup:missions.balanceDistribution')}</p>
            <p>{t('popup:missions.calendarDistribution')}</p>
          </div>

          <div className="bg-base-200 flex w-full items-center justify-start gap-4 rounded-lg p-4">
            <img src="/images/bouns/crown.png" className="h-10 w-10" />
            <div>
              <p className="text-sm leading-5 font-bold">{t('popup:missions.goldMembersAndAbove')}</p>
              <p className="text-sm leading-5">{t('popup:missions.goldBalanceDistribution')}</p>
              <p className="text-sm leading-5">{t('popup:missions.goldCalendarDistribution')}</p>
            </div>
          </div>

          <p className="text-sm leading-5">{t('popup:missions.minimumClaimAmount')}</p>
        </div>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-base leading-6 font-bold">{t('popup:missions.howIsBonusCalculated')}</h4>
          <p className="text-sm leading-5">{t('popup:missions.bonusCalculationDesc')}</p>
        </div>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-base leading-6 font-bold">{t('popup:missions.expiration')}</h4>
          <p className="text-sm leading-5">{t('popup:missions.expirationDesc')}</p>
        </div>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-base leading-6 font-bold">{t('popup:missions.generalTerms')}</h4>
          <p className="text-sm leading-5">
            <span>{t('popup:missions.generalTermsDesc1')}</span>
            <br />
            <br />
            <span>{t('popup:missions.generalTermsDesc2')}</span>
          </p>
        </div>
      </div>
    </ModalDialog>
  );
};
