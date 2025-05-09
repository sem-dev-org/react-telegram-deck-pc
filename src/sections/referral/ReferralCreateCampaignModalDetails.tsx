import { ModalDialog } from '@/components/ui/ModalDialog';
import { CopyBtn } from '@/components/ui/CopyBtn';
import { IAdTag } from '@/types/referral';
import { useState, useEffect } from 'react';
// import { referralLink } from '@/utils/referralLink';
import { setDefaultAdTag } from '@/api/referral';
import { QueryAdTagList, QueryBaseUrl, QueryDefaultAdTag } from '@/query/adTag';
import Decimal from 'decimal.js';
import { useTranslation } from 'react-i18next';
import { SelectDropdown } from '@/components/ui/SelectDropdown';
import { mirrorOptions } from '@/_mock/transaction';
import { getReferralLink } from '@/utils/auth';

interface CreateCampaignModalDetailsProps {
  open: boolean;
  onClose: () => void;
  details: IAdTag | null;
}

export const ReferralCreateCampaignModalDetails = ({ open, onClose, details }: CreateCampaignModalDetailsProps) => {
  const [isDefaultCampaign, setIsDefaultCampaign] = useState(false);
  const [loading, setLoading] = useState(false);
  const { refetch } = QueryAdTagList();
  const { refetch: refetchDefaultAdTag } = QueryDefaultAdTag();
  const { t } = useTranslation();

  // Update state when details change
  useEffect(() => {
    setIsDefaultCampaign(details?.is_default === 1);
  }, [details]);

  const toggleDefaultCampaign = () => {
    setLoading(true);
    // const isDefaultCampaignValue = !isDefaultCampaign;
    setDefaultAdTag({
      id: details?.id,
      code: details?.code,
      share: details?.share_to_referee,
      isDefaultCampaign: isDefaultCampaign,
      campaign: details?.campaign,
    })
      .then((res) => {
        if (res.code === 0) {
          setIsDefaultCampaign(isDefaultCampaign);
          refetch();
          refetchDefaultAdTag();
          onClose();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // const referral_link = referralLink(details?.code || '');
  const [mirror, setMirror] = useState(mirrorOptions(t)[0].value);
  const { baseUrlArr } = QueryBaseUrl();

  return (
    <ModalDialog open={open} onClose={onClose} position="modal-bottom" className="p-0">
      <div className="modal-box flex flex-col gap-4">
        <h4 className="text-base leading-6 font-bold">{t('referral:campaignInformation')}</h4>
        <div className="flex h-15 items-center gap-2">
          <div className="flex flex-1 flex-col items-center">
            <div className="text-primary text-xl font-bold">
              {Decimal(100)
                .sub(details?.share_to_referee ?? 0)
                .toString()}
              %
            </div>
            <div className="text-base-content/60 h-4 text-sm">{t('referral:youReceive')}</div>
          </div>
          <div className="flex flex-1 flex-col items-center">
            <div className="text-primary text-xl font-bold">{Decimal(details?.share_to_referee ?? 0).toString()}%</div>
            <div className="text-base-content/60 h-4 text-sm">{t('referral:directReferralReceives')}</div>
          </div>
        </div>
        <div>
          <div className="pl-1 text-sm leading-5">{t('referral:campaignName')}</div>
          <div className="bg-base-200 flex h-12 w-full items-center justify-between rounded-lg px-4">
            <div className="text-base-content/60"> {details?.campaign} </div>
          </div>
        </div>
        <div>
          <div className="pl-1 text-sm leading-5">{t('referral:mirror')}</div>
          <SelectDropdown
            className="bg-base-200 text-base-content/60 h-12 rounded-lg"
            variant="outlined"
            options={mirrorOptions(t)}
            value={mirror}
            onChange={(value) => setMirror(value as string)}
            buttonClassName="border-none"
          />
        </div>
        <div>
          <div className="pl-1 text-sm leading-5">{t('referral:referralLink')}</div>
          <div className="bg-base-200 flex h-12 w-full items-center justify-between gap-4 rounded-lg px-4">
            <div className="text-base-content/60 scrollbar-hide flex-1 overflow-auto whitespace-nowrap">
              {getReferralLink(baseUrlArr[mirror as keyof typeof baseUrlArr], details?.code || '')}
            </div>
            <CopyBtn text={getReferralLink(baseUrlArr[mirror as keyof typeof baseUrlArr], details?.code || '')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.7902 2.4107C13.695 2.50566 14.4002 3.27087 14.4002 4.20078V9.40078C14.4002 10.3949 13.5943 11.2008 12.6002 11.2008H10.8002V8.49784C10.8002 7.86132 10.5473 7.25087 10.0972 6.80078L7.60016 4.30372C7.28858 3.99214 6.90013 3.77507 6.47939 3.67099C6.68765 2.99376 7.28472 2.48683 8.01008 2.4107C8.10504 1.50594 8.87025 0.800781 9.80016 0.800781H11.0002C11.9301 0.800781 12.6953 1.50594 12.7902 2.4107ZM9.20016 2.60078C9.20016 2.26941 9.46879 2.00078 9.80016 2.00078H11.0002C11.3315 2.00078 11.6002 2.26941 11.6002 2.60078V2.80078H9.20016V2.60078Z"
                  fill="#A6ADBB"
                  fillOpacity="0.5"
                  style={{ fill: '#A6ADBB', fillOpacity: 0.5 }}
                />
                <path
                  d="M2.8001 4.80078C2.13736 4.80078 1.6001 5.33804 1.6001 6.00078V13.2008C1.6001 13.8635 2.13736 14.4008 2.8001 14.4008H8.4001C9.06284 14.4008 9.6001 13.8635 9.6001 13.2008V8.49784C9.6001 8.17958 9.47367 7.87435 9.24863 7.64931L6.75157 5.15225C6.52653 4.92721 6.2213 4.80078 5.90304 4.80078H2.8001Z"
                  fill="#A6ADBB"
                  fillOpacity="0.5"
                  style={{ fill: '#A6ADBB', fillOpacity: 0.5 }}
                />
              </svg>
            </CopyBtn>
          </div>
        </div>
        <div>
          <div className="pl-1 text-sm leading-5">{t('referral:referralCode')}</div>
          <div className="bg-base-200 flex h-12 w-full items-center justify-between gap-4 rounded-lg px-4">
            <div className="text-base-content/60 scrollbar-hide flex-1 overflow-auto whitespace-nowrap">
              {details?.code}
            </div>
            <CopyBtn text={details?.code || ''}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.7902 2.4107C13.695 2.50566 14.4002 3.27087 14.4002 4.20078V9.40078C14.4002 10.3949 13.5943 11.2008 12.6002 11.2008H10.8002V8.49784C10.8002 7.86132 10.5473 7.25087 10.0972 6.80078L7.60016 4.30372C7.28858 3.99214 6.90013 3.77507 6.47939 3.67099C6.68765 2.99376 7.28472 2.48683 8.01008 2.4107C8.10504 1.50594 8.87025 0.800781 9.80016 0.800781H11.0002C11.9301 0.800781 12.6953 1.50594 12.7902 2.4107ZM9.20016 2.60078C9.20016 2.26941 9.46879 2.00078 9.80016 2.00078H11.0002C11.3315 2.00078 11.6002 2.26941 11.6002 2.60078V2.80078H9.20016V2.60078Z"
                  fill="#A6ADBB"
                  fillOpacity="0.5"
                  style={{ fill: '#A6ADBB', fillOpacity: 0.5 }}
                />
                <path
                  d="M2.8001 4.80078C2.13736 4.80078 1.6001 5.33804 1.6001 6.00078V13.2008C1.6001 13.8635 2.13736 14.4008 2.8001 14.4008H8.4001C9.06284 14.4008 9.6001 13.8635 9.6001 13.2008V8.49784C9.6001 8.17958 9.47367 7.87435 9.24863 7.64931L6.75157 5.15225C6.52653 4.92721 6.2213 4.80078 5.90304 4.80078H2.8001Z"
                  fill="#A6ADBB"
                  fillOpacity="0.5"
                  style={{ fill: '#A6ADBB', fillOpacity: 0.5 }}
                />
              </svg>
            </CopyBtn>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="radio-1"
            className="radio radio-primary h-4 w-4 border-1"
            checked={isDefaultCampaign}
            onChange={() => setIsDefaultCampaign(!isDefaultCampaign)}
          />
          <div className="cursor-pointer text-sm" onClick={() => setIsDefaultCampaign(!isDefaultCampaign)}>
            {t('referral:setAsDefaultCampaign')}
          </div>
        </div>
        <button
          className="btn bg-primary flex h-12 items-center justify-center"
          onClick={() => {
            toggleDefaultCampaign();
          }}
        >
          <div className="text-neutral text-sm font-semibold">
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
              </>
            ) : (
              t('common.save')
            )}
          </div>
        </button>
      </div>
    </ModalDialog>
  );
};
