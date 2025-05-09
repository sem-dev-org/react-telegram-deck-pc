import { ModalDialog } from '@/components/ui/ModalDialog';
import { useTranslation } from 'react-i18next';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useNavigate } from 'react-router-dom';

export const PopupRakeback = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formatCurrency } = useCurrencyFormatter();

  return (
    <ModalDialog open={open} onClose={onClose} className="h-[70%] bg-transparent p-0">
      <div
        className="relative flex h-50 w-full overflow-hidden rounded-t-2xl p-4"
        style={{
          background: `
            radial-gradient(100% 308% at 100% 0%, rgba(92, 120, 240, 0.5) 0%, rgba(20, 25, 31, 0.5) 100%), #14191F`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '192px',
            height: '192px',
            right: '9px',
            bottom: '0',
          }}
        >
          <img
            src="/images/bouns/rakeback-info.png"
            className="absolute h-[192px] w-[192px] object-cover drop-shadow-[0px_-2px_10px_rgba(44,37,47,0.5)]"
          />
        </div>
        <div className="flex flex-col justify-center pl-4">
          <div>
            <p className="font-montserrat text-xl font-bold text-white">{t('popup:rakeback.super')}</p>
            <p className="text-primary font-montserrat text-xl font-bold whitespace-pre-line">
              {t('popup:rakeback.title')}
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
            <h4 className="text-base leading-6 font-bold">{t('popup:rakeback.superRakeback')}</h4>
            <button className="btn btn-secondary h-6 px-2 text-xs font-semibold">{t('popup:rakeback.general')}</button>
          </div>
          <p className="text-sm leading-5">{t('popup:rakeback.description')}</p>
        </div>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>
        <div>
          <div className="text-sm leading-4">{t('popup:rakeback.accrualFrequency')}</div>
          <div className="text-primary text-2xl leading-8 font-bold">{t('popup:rakeback.instantaneous')}</div>
        </div>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-base leading-6 font-bold">{t('popup:rakeback.claimDistribution')}</h4>

          <div className="text-sm leading-5">
            <p>{t('popup:rakeback.yourBalance')}</p>
            <p>{t('popup:rakeback.yourCalendar')}</p>
          </div>

          <div className="bg-base-200 flex w-full items-center justify-start gap-4 rounded-lg p-4">
            <img src="/images/bouns/crown.png" className="h-10 w-10" />
            <div>
              <p className="text-sm leading-5 font-bold">{t('popup:rakeback.goldMembersAndAbove')}</p>
              <p className="text-sm leading-5">{t('popup:rakeback.yourBalance2')}</p>
              <p className="text-sm leading-5">{t('popup:rakeback.yourCalendar2')}</p>
            </div>
          </div>

          <p className="text-sm leading-5">{t('popup:rakeback.minimumClaimAmount', { value: formatCurrency(0.1) })}</p>
        </div>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-base leading-6 font-bold">{t('popup:rakeback.howIsBonusCalculated')}</h4>
          <p className="text-sm leading-5">{t('popup:rakeback.howIsBonusCalculatedDesc')}</p>
        </div>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-base leading-6 font-bold">{t('popup:rakeback.whatIsBooster')}</h4>
          <p className="text-sm leading-5">
            {t('popup:rakeback.rakebackDesc1')}
            <br />
            <br />
            {t('popup:rakeback.rakebackDesc2')}
          </p>
        </div>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-base leading-6 font-bold">{t('popup:rakeback.expiration')}</h4>
          <p className="text-sm leading-5">{t('popup:rakeback.expirationDesc')}</p>
        </div>

        <div className="flex h-3 flex-col justify-center">
          <div className="bg-base-content/10 h-[2px] w-full"></div>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-base leading-6 font-bold">{t('popup:rakeback.generalTerms')}</h4>
          <p className="text-sm leading-5">
            {t('popup:rakeback.generalTermsDesc1')}

            <br />
            <br />
            {t('popup:rakeback.generalTermsDesc2')}
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
