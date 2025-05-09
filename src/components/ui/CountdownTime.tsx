import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
interface CountdownTimeProps {
  details: {
    name?: string;
    timeLabel?: string;
    time: {
      days?: number;
      hours?: number;
      minutes?: number;
      seconds: number;
    };
    prize?: number;
  };
}

const isGreaterThanOneDay = (time: CountdownTimeProps['details']['time']) => {
  if (time.days && time.days > 0) return true;
  if (time.hours && time.hours >= 24) return true;
  return false;
};

const isGreaterThanOneHour = (time: CountdownTimeProps['details']['time']) => {
  if (time.days && time.days > 0) return true;
  if (time.hours && time.hours > 0) return true;
  return false;
};

const isGreaterThanOneMinute = (time: CountdownTimeProps['details']['time']) => {
  if (time.days && time.days > 0) return true;
  if (time.hours && time.hours > 0) return true;
  if (time.minutes && time.minutes > 0) return true;
  return false;
};

const isGreaterThanOneSecond = (time: CountdownTimeProps['details']['time']) => {
  if (time.days && time.days > 0) return true;
  if (time.hours && time.hours > 0) return true;
  if (time.minutes && time.minutes > 0) return true;
  if (time.seconds && time.seconds > 0) return true;
  return false;
};

export const CountdownTime = ({ details }: CountdownTimeProps) => {
  const { t } = useTranslation();

  const isBonusExpired =
    details?.time?.days === 0 &&
    details?.time?.hours === 0 &&
    details?.time?.minutes === 0 &&
    details?.time?.seconds === 0;

  return (
    <>
      <div
        className="font-montserrat mb-3 flex flex-col items-start justify-between text-xl font-bold text-white"
        style={{
          whiteSpace: 'pre-line',
        }}
      >
        <div className="text-xl">{details.name}</div>
      </div>

      {!isBonusExpired && (
        <div
          className="relative flex w-47 flex-col items-start gap-1 rounded-lg p-2"
          style={{
            background:
              'linear-gradient(136.93deg, rgba(255, 255, 255, 0.3) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(100.68deg, rgba(255, 255, 255, 0.1) 25%, rgba(0, 0, 0, 0) 25%)',
          }}
        >
          <div className="bg-warning absolute -top-1.5 left-0 flex h-3 items-center justify-center rounded-[4px] rounded-bl-none px-2">
            <span className="font-montserrat text-xs font-semibold text-black">{details.timeLabel}</span>
          </div>
          <div className="flex w-full flex-col gap-1">
            <div className="flex w-full items-center gap-1">
              {isGreaterThanOneDay(details.time) && (
                <div
                  className="flex h-12 flex-1 flex-col items-center justify-center rounded-md"
                  style={{ background: 'color(display-p3 0.082 0.098 0.118 / 0.8)' }}
                >
                  <div className="font-montserrat countdown text-center text-2xl font-bold text-white">
                    <span style={{ '--value': details.time.days } as React.CSSProperties}>{details.time.days}</span>
                  </div>
                  <div className="font-montserrat text-neutral-content text-[8px]">{t('common.days')}</div>
                </div>
              )}
              {isGreaterThanOneHour(details.time) && (
                <div
                  className="flex h-12 flex-1 flex-col items-center justify-center rounded-md"
                  style={{ background: 'color(display-p3 0.082 0.098 0.118 / 0.8)' }}
                >
                  <div className="font-montserrat countdown text-center text-2xl font-bold text-white">
                    <span style={{ '--value': details.time.hours } as React.CSSProperties}>{details.time.hours}</span>
                  </div>
                  <div className="font-montserrat text-neutral-content text-[8px]">{t('common.hours')}</div>
                </div>
              )}
              {isGreaterThanOneMinute(details.time) && (
                <div
                  className="flex h-12 flex-1 flex-col items-center justify-center rounded-md"
                  style={{ background: 'color(display-p3 0.082 0.098 0.118 / 0.8)' }}
                >
                  <div className="font-montserrat countdown text-center text-2xl font-bold text-white">
                    <span style={{ '--value': details.time.minutes } as React.CSSProperties}>
                      {details.time.minutes}
                    </span>
                  </div>
                  <div className="font-montserrat text-neutral-content text-[8px]">{t('common.minutes')}</div>
                </div>
              )}
              {isGreaterThanOneSecond(details.time) && (
                <div
                  className="flex h-12 flex-1 flex-col items-center justify-center rounded-md"
                  style={{ background: 'color(display-p3 0.082 0.098 0.118 / 0.8)' }}
                >
                  <div className="font-montserrat countdown text-center text-2xl font-bold text-white">
                    <span style={{ '--value': details.time.seconds } as React.CSSProperties}>
                      {details.time.seconds}
                    </span>
                  </div>
                  <div className="font-montserrat text-neutral-content text-[8px]">{t('common.seconds')}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

type CountdownTimeTwoProps = {
  time: {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds: number;
  };
};

export const CountdownTimeTwo = ({ time }: CountdownTimeTwoProps) => {
  const [countdown, setCountdown] = useState(time);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes && prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours && prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days && prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center">
      {isGreaterThanOneDay(countdown) && (
        <span className="countdown">
          <span style={{ '--value': countdown.days } as React.CSSProperties}>{countdown.days}</span>:
        </span>
      )}
      {isGreaterThanOneHour(countdown) && (
        <span className="countdown">
          <span style={{ '--value': countdown.hours } as React.CSSProperties}>{countdown.hours}</span>:
        </span>
      )}
      {isGreaterThanOneMinute(countdown) && (
        <span className="countdown">
          <span style={{ '--value': countdown.minutes } as React.CSSProperties}>{countdown.minutes}</span>:
        </span>
      )}
      {isGreaterThanOneSecond(countdown) && (
        <span className="countdown">
          <span style={{ '--value': countdown.seconds } as React.CSSProperties}>{countdown.seconds}</span>
        </span>
      )}
    </div>
  );
};
