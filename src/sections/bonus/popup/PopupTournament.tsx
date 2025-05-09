import { ModalDialog } from '@/components/ui/ModalDialog';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const PopupTournament = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  return (
    <ModalDialog open={open} onClose={onClose} className="h-[70%] bg-transparent p-0">
      <div>
        <div
          className="relative flex h-50 w-full overflow-hidden rounded-t-2xl p-4"
          style={{
            background: `
              radial-gradient(100% 308% at 100% 0%, rgba(251, 208, 0, 0.5) 0%, rgba(20, 25, 31, 0.5) 100%), #14191F`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '170px',
              height: '170px',
              left: '186px',
              top: '35px',
            }}
          >
            <img
              src="/icons/isometric/39.svg"
              className="absolute h-[130px] w-[130px] object-cover drop-shadow-[0px_-2px_10px_rgba(44,37,47,0.5)]"
            />
          </div>
          <div className="flex flex-col justify-center pl-4">
            <div>
              <p className="font-montserrat text-xl font-bold text-white">{t('popup:tournament.title')}</p>
              <p className="text-primary font-montserrat text-xl font-bold whitespace-pre-line">
                {t('popup:tournament.reward')}
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
              <h4 className="text-base leading-6 font-bold">{t('popup:tournament.tournamentRewards')}</h4>
              <button className="btn btn-secondary h-6 px-2 text-xs font-semibold">
                {t('popup:tournament.general')}
              </button>
            </div>
            <p className="text-sm leading-5">{t('popup:tournament.description')}</p>
          </div>

          <div className="flex h-3 flex-col justify-center">
            <div className="bg-base-content/10 h-[2px] w-full"></div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-base leading-6 font-bold">{t('popup:tournament.claimDistribution')}</h4>
            <p className="text-sm leading-5">{t('popup:tournament.claimDistributionDesc')}</p>
          </div>

          <div className="flex h-3 flex-col justify-center">
            <div className="bg-base-content/10 h-[2px] w-full"></div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-base leading-6 font-bold">{t('popup:tournament.expiration')}</h4>
            <p className="text-sm leading-5">{t('popup:tournament.expirationDesc')}</p>
          </div>

          <div className="flex h-3 flex-col justify-center">
            <div className="bg-base-content/10 h-[2px] w-full"></div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-base leading-6 font-bold">{t('popup:tournament.generalTerms')}</h4>
            <p className="text-sm leading-5">
              {t('popup:tournament.generalTermsDesc1')}
              <br />
              <br />
              {t('popup:tournament.generalTermsDesc2')}
            </p>
          </div>
        </div>
      </div>
    </ModalDialog>
  );
};
