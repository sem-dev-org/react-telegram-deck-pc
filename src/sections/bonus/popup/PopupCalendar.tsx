import { ModalDialog } from '@/components/ui/ModalDialog';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export const PopupCalendar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  
  // 使用状态保存倒计时
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  // 计算到下一个发布时间的倒计时（UTC 0点、8点、16点）
  useEffect(() => {
    const calculateTimeToNextRelease = () => {
      // 获取当前UTC时间
      const now = new Date();
      const utcHours = now.getUTCHours();
      
      // 计算下一个发布时间点
      let nextReleaseHour;
      if (utcHours < 8) {
        // 下一个时间点是UTC 8点
        nextReleaseHour = 8;
      } else if (utcHours < 16) {
        // 下一个时间点是UTC 16点
        nextReleaseHour = 16;
      } else {
        // 下一个时间点是明天的UTC 0点
        nextReleaseHour = 24;
      }
      
      // 创建下一个发布时间
      const nextRelease = new Date(now);
      if (nextReleaseHour === 24) {
        // 如果是第二天的0点
        nextRelease.setUTCDate(nextRelease.getUTCDate() + 1);
        nextRelease.setUTCHours(0, 0, 0, 0);
      } else {
        // 当天的8点或16点
        nextRelease.setUTCHours(nextReleaseHour, 0, 0, 0);
      }
      
      // 计算时间差
      const diffMs = nextRelease.getTime() - now.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);
      
      // 计算小时、分钟和秒
      const hours = Math.floor(diffSeconds / 3600);
      const minutes = Math.floor((diffSeconds % 3600) / 60);
      const seconds = diffSeconds % 60;
      
      setTimeLeft({ hours, minutes, seconds });
    };
    
    // 首次计算
    calculateTimeToNextRelease();
    
    // 每秒更新倒计时
    const intervalId = setInterval(calculateTimeToNextRelease, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ModalDialog open={open} onClose={onClose} className="h-[70%] bg-transparent p-0">
      <div
        className="relative flex h-50 w-full overflow-hidden rounded-t-2xl p-4"
        style={{
          background: `
            radial-gradient(100% 308% at 100% 0%, rgba(137, 88, 227, 0.5) 0%, rgba(20, 25, 31, 0.5) 100%), #14191F`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '138px',
            height: '138px',
            right: '21px',
            bottom: '31px',
          }}
        >
          <img
            src="/images/bouns/calendar-info.png"
            className="absolute h-[138px] w-[138px] object-cover drop-shadow-[0px_-2px_10px_rgba(44,37,47,0.5)]"
          />
        </div>
        <div className="flex flex-col justify-center pl-4">
          <div
            className="font-montserrat mb-3 flex flex-col items-start justify-between text-xl font-bold text-white"
            style={{
              whiteSpace: 'pre-line',
            }}
          >
            <div className="text-xl">{t('popup:calendarTitle')}</div>
          </div>
          <div
            className="relative flex w-47 flex-col items-start gap-1 rounded-lg p-2"
            style={{
              background:
                'linear-gradient(136.93deg, rgba(255, 255, 255, 0.3) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(100.68deg, rgba(255, 255, 255, 0.1) 25%, rgba(0, 0, 0, 0) 25%)',
            }}
          >
            <div className="bg-warning absolute -top-1.5 left-0 flex h-3 items-center justify-center rounded-[4px] rounded-bl-none px-2">
              <span className="font-montserrat text-xs font-semibold text-black">{t('popup:calendarNextRelease')}</span>
            </div>
            <div className="flex w-full flex-col gap-1">
              <div className="flex w-full items-center gap-1">
                <div
                  className="flex h-12 flex-1 flex-col items-center justify-center rounded-md"
                  style={{ background: 'color(display-p3 0.082 0.098 0.118 / 0.8)' }}
                >
                  <div className="font-montserrat countdown text-center text-2xl font-bold text-white">
                    <span style={{ '--value': timeLeft.hours } as React.CSSProperties} aria-live="polite">
                      {timeLeft.hours}
                    </span>
                  </div>
                  <div className="font-montserrat text-neutral-content text-[8px]">{t('common.hours')}</div>
                </div>
                <div
                  className="flex h-12 flex-1 flex-col items-center justify-center rounded-md"
                  style={{ background: 'color(display-p3 0.082 0.098 0.118 / 0.8)' }}
                >
                  <div className="font-montserrat countdown text-center text-2xl font-bold text-white">
                    <span style={{ '--value': timeLeft.minutes } as React.CSSProperties} aria-live="polite">
                      {timeLeft.minutes}
                    </span>
                  </div>
                  <div className="font-montserrat text-neutral-content text-[8px]">{t('common.minutes')}</div>
                </div>
                <div
                  className="flex h-12 flex-1 flex-col items-center justify-center rounded-md"
                  style={{ background: 'color(display-p3 0.082 0.098 0.118 / 0.8)' }}
                >
                  <div className="font-montserrat countdown text-center text-2xl font-bold text-white">
                    <span style={{ '--value': timeLeft.seconds } as React.CSSProperties} aria-live="polite">
                      {timeLeft.seconds}
                    </span>
                  </div>
                  <div className="font-montserrat text-neutral-content text-[8px]">{t('common.seconds')}</div>
                </div>
              </div>
            </div>
          </div>
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
            <h4 className="text-base leading-6 font-bold">{t('popup:bonusCalendar')}</h4>
            <button className="btn btn-secondary h-6 px-2 text-xs font-semibold">{t('popup:general')}</button>
          </div>
          <p className="text-sm leading-5">
            {t(
              'popup:claimYourCalendarRewardsEvery8HoursUpTo3TimesADayJustAHeadsUpEachRewardExpiresIn24HoursSoGrabItWhileItLasts',
            )}
          </p>
        </div>
        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>
        <div>
          <div className="text-sm leading-4">{t('popup:releaseFrequency')}</div>
          <div className="text-primary text-2xl leading-8 font-bold">{t('popup:every8Hours')}</div>
        </div>
        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>
        <div>
          <div className="text-sm leading-4">{t('popup:nextRelease')}</div>
          <div className="text-primary flex items-center gap-2 text-2xl leading-8 font-bold">
            <div className="flex items-center">
              <span className="countdown font-mono">
                <span style={{ '--value': timeLeft.hours } as React.CSSProperties} aria-live="polite">
                  {timeLeft.hours}
                </span>
              </span>
              h
            </div>
            <div className="flex items-center">
              <span className="countdown font-mono">
                <span style={{ '--value': timeLeft.minutes } as React.CSSProperties} aria-live="polite">
                  {timeLeft.minutes}
                </span>
              </span>
              m
            </div>
            <div className="flex items-center">
              <span className="countdown font-mono">
                <span style={{ '--value': timeLeft.seconds } as React.CSSProperties} aria-live="polite">
                  {timeLeft.seconds}
                </span>
              </span>
              s
            </div>
          </div>
        </div>
        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-base leading-6 font-bold">{t('popup:howIsBonusCalculated')}</h4>
          <p className="text-sm leading-5">{t('popup:howIsBonusCalculatedDesc')}</p>
        </div>
        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-base leading-6 font-bold">{t('popup:expiration')}</h4>
          <p className="text-sm leading-5">{t('popup:expirationDesc')}</p>
        </div>
        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-base leading-6 font-bold">{t('popup:generalTerms')}</h4>
          <p className="text-sm leading-5">
            {t('popup:generalTermsDesc1')}
            <br />
            <br />
            {t('popup:generalTermsDesc2')}
          </p>
        </div>
      </div>
    </ModalDialog>
  );
};
