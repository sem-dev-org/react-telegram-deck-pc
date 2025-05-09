import { ModalDialog } from '@/components/ui/ModalDialog';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PopupCashback = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formatCurrency } = useCurrencyFormatter();

  // 使用状态保存到明天0点的倒计时
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 计算到明天0点的时间
  useEffect(() => {
    const calculateTimeToMidnight = () => {
      // 获取当前时间
      const now = new Date();

      // 创建明天UTC 0点的时间
      const tomorrow = new Date();
      tomorrow.setUTCDate(now.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);

      const diffMs = tomorrow.getTime() - now.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);

      // 如果时间差已经是负数，说明已经过了明天的UTC 0点，计算到后天的UTC 0点
      if (diffSeconds <= 0) {
        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setUTCDate(now.getUTCDate() + 2);
        dayAfterTomorrow.setUTCHours(0, 0, 0, 0);

        const newDiffMs = dayAfterTomorrow.getTime() - now.getTime();
        const newDiffSeconds = Math.floor(newDiffMs / 1000);

        const days = Math.floor(newDiffSeconds / (24 * 60 * 60));
        const hours = Math.floor((newDiffSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((newDiffSeconds % (60 * 60)) / 60);
        const seconds = newDiffSeconds % 60;

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        const days = Math.floor(diffSeconds / (24 * 60 * 60));
        const hours = Math.floor((diffSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((diffSeconds % (60 * 60)) / 60);
        const seconds = diffSeconds % 60;

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    // 首次计算
    calculateTimeToMidnight();

    // 每秒更新倒计时
    const intervalId = setInterval(calculateTimeToMidnight, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <ModalDialog open={open} onClose={onClose} className="h-[70%] bg-transparent p-0">
      <div
        className="relative flex h-50 w-full overflow-hidden rounded-t-2xl p-4"
        style={{
          background: `
            radial-gradient(100% 308% at 100% 0%, rgba(170, 101, 29, 0.5) 0%, rgba(20, 25, 31, 0.5) 100%), #14191F`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '206px',
            height: '206px',
            right: '4px',
            bottom: '0',
          }}
        >
          <img
            src="/images/bouns/daily-info.png"
            className="absolute h-[206px] w-[206px] object-cover drop-shadow-[0px_-2px_10px_rgba(44,37,47,0.5)]"
          />
        </div>
        <div className="flex flex-col justify-center pl-4">
          <div>
            <p className="font-montserrat text-xl font-bold text-white">{t('popup:daily.title')}</p>
            <p className="text-primary font-montserrat text-xl font-bold whitespace-pre-line">
              {t('popup:daily.cashbackBonus')}
            </p>
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
            <h4 className="text-base leading-6 font-bold">{t('popup:daily.dailyCashback')}</h4>
            <button className="btn btn-secondary h-6 px-2 text-xs font-semibold">{t('popup:daily.general')}</button>
          </div>
          <p className="text-sm leading-5">{t('popup:daily.description')}</p>
        </div>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>
        <div>
          <div className="text-sm leading-4">{t('popup:daily.accrualFrequency')}</div>
          <div className="text-primary text-2xl leading-8 font-bold">{t('popup:daily.accrualFrequencyValue')}</div>
        </div>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>
        <div>
          <div className="text-sm leading-4">{t('popup:daily.accrualIn')}</div>
          <div className="text-primary flex items-center gap-2 text-2xl leading-8 font-bold">
            {timeLeft.days > 0 && (
              <div className="flex items-center">
                <span className="countdown font-mono">
                  <span style={{ '--value': timeLeft.days } as React.CSSProperties} aria-live="polite">
                    {timeLeft.days}
                  </span>
                </span>
                d
              </div>
            )}
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
          <div className="text-sm leading-4 font-bold">{t('popup:daily.claimDistribution')}</div>
          <p className="text-sm leading-5">{t('popup:daily.claimDistributionDesc1')}</p>
          <p className="text-sm leading-5">{t('popup:daily.claimDistributionDesc2', { value: formatCurrency(0.1) })}</p>
        </div>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm leading-4 font-bold">{t('popup:daily.howIsBonusCalculated')}</div>
          <p className="text-sm leading-5">{t('popup:daily.bonusCalculationDesc')}</p>
        </div>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm leading-4 font-bold">{t('popup:daily.expiration')}</div>
          <p className="text-sm leading-5">{t('popup:daily.expirationDesc')}</p>
        </div>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm leading-4 font-bold">{t('popup:daily.generalTerms')}</div>
          <p className="text-sm leading-5">
            {t('popup:daily.generalTermsDesc1')}
            <br />
            <br />
            {t('popup:daily.generalTermsDesc2')}
          </p>
        </div>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>

        <button className="btn btn-secondary h-12 text-xs font-semibold" onClick={() => navigate('/main/vip')}>
          {t('popup:rakeback.loyaltyProgramBenefits')}
        </button>
      </div>
    </ModalDialog>
  );
};
