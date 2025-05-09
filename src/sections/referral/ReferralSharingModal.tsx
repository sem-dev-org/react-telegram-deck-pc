import { CopyBtn } from '@/components/ui/CopyBtn';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { QueryBaseUrl, QueryDefaultAdTag } from '@/query/adTag';
import { getReferralLink } from '@/utils/auth';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type SharingModalProps = {
  open: boolean;
  onClose: () => void;
};

export const ReferralSharingModal = ({ open, onClose }: SharingModalProps) => {
  const { defaultAdTag } = QueryDefaultAdTag();
  const { baseUrl } = QueryBaseUrl();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if this is a mobile device
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    setIsMobile(checkMobile());
  }, []);

  const shareToWhatsapp = () => {
    const referralLink = getReferralLink(baseUrl, defaultAdTag?.code);
    const message = `Check out this app: ${referralLink}`;
    const whatsappWebLink = `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    const whatsappMobileLink = `whatsapp://send?text=${encodeURIComponent(message)}`;

    if (isMobile) {
      const link = document.createElement('a');
      link.href = whatsappMobileLink;
      link.setAttribute('data-action', 'share/whatsapp/share');
      link.setAttribute('target', '_blank');
      link.click();

      setTimeout(() => {
        window.location.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      }, 300);
    } else {
      window.open(whatsappWebLink, '_blank');
    }
  };

  const { t } = useTranslation();

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      className="p-6"
      style={{
        background: `linear-gradient(180deg, color(display-p3 0.329 0.502 0.596 / 0.2) 0%, color(display-p3 0.114 0.137 0.165 / 0.2) 59.96%), color(display-p3 0.114 0.137 0.165)`,
      }}
    >
      <div className="flex flex-col gap-3">
        <h4 className="flex h-6 items-center gap-1">
          <div className="text-base font-bold">{t('referral:spreadThe')} </div>
          <div className="text-primary text-base font-bold">{t('referral:love')}</div>
        </h4>
        <div className="flex h-14 flex-col items-center justify-between">
          <div className="text-bold text-sm">{t('referral:tellAFriend')}</div>
          <div className="flex gap-1">
            <img src="/icons/socials/1.svg" className="h-8 w-8" />
            <img src="/icons/socials/2.svg" className="h-8 w-8" />
            <img src="/icons/socials/3.svg" className="h-8 w-8" />
            <img src="/icons/socials/4.svg" className="h-8 w-8" />
            <img src="/icons/socials/5.svg" className="h-8 w-8" />
            <img src="/icons/socials/6.svg" className="h-8 w-8" />
          </div>
        </div>
        <div className="">
          <div className="text-bold text-xs leading-4">{t('referral:referralLink')}</div>
          <div className="bg-base-200 flex h-10 items-center justify-between gap-2 rounded-lg px-3">
            <div className="text-base-content/50 hide-scrollbar flex-1 overflow-auto text-sm whitespace-nowrap">
              {baseUrl}
            </div>
            <CopyBtn text={baseUrl} className="btn btn-sm h-4.5 rounded-full">
              <svg width="14" height="14" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.99384 1.5062C8.55932 1.56555 9.00004 2.04381 9.00004 2.625V5.875C9.00004 6.49632 8.49636 7 7.87504 7H6.75004V5.31066C6.75004 4.91284 6.59201 4.53131 6.3107 4.25L4.75004 2.68934C4.5553 2.4946 4.31252 2.35893 4.04956 2.29388C4.17972 1.87061 4.55289 1.55378 5.00624 1.5062C5.06559 0.940724 5.54385 0.5 6.12504 0.5H6.87504C7.45624 0.5 7.93449 0.940724 7.99384 1.5062ZM5.75004 1.625C5.75004 1.41789 5.91793 1.25 6.12504 1.25H6.87504C7.08215 1.25 7.25004 1.41789 7.25004 1.625V1.75H5.75004V1.625Z"
                  fill="#E7FB78"
                  fillOpacity="0.8"
                />
                <path
                  d="M1.75 3C1.33579 3 1 3.33579 1 3.75V8.25C1 8.66421 1.33579 9 1.75 9H5.25C5.66421 9 6 8.66421 6 8.25V5.31066C6 5.11175 5.92098 4.92098 5.78033 4.78033L4.21967 3.21967C4.07902 3.07902 3.88825 3 3.68934 3H1.75Z"
                  fill="#E7FB78"
                  fillOpacity="0.8"
                />
              </svg>
            </CopyBtn>
          </div>
        </div>
        <p className="text-sm">{t('referral:shareDescription')}</p>
        <button className="btn bg-secondary flex h-12 items-center justify-center gap-2" onClick={shareToWhatsapp}>
          <img src="/icons/socials/2.svg" className="h-4 w-4" />
          <div className="text-primary text-sm font-semibold">{t('referral:sendOnWhatsapp')}</div>
        </button>
      </div>
    </ModalDialog>
  );
};
