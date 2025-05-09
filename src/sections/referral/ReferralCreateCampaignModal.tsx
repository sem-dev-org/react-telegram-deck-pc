import { createAdTag } from '@/api/referral';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { useState } from 'react';
import { toast } from 'sonner';
import { QueryAdTagList, QueryBaseUrl, QueryDefaultAdTag } from '@/query/adTag';
import { useTranslation } from 'react-i18next';
import { CopyBtn } from '@/components/ui/CopyBtn';
import { SelectDropdown } from '@/components/ui/SelectDropdown';
import { mirrorOptions } from '@/_mock/transaction';
import { getReferralLink } from '@/utils/auth';

interface CreateCampaignModalProps {
  open: boolean;
  onClose: () => void;
}

export const ReferralCreateCampaignModal = ({ open, onClose }: CreateCampaignModalProps) => {
  const [selectedCommission, setSelectedCommission] = useState<number>(10);
  const { t } = useTranslation();
  const commissionOptions = [0, 10, 25, 50];

  const [isDefaultCampaign, setIsDefaultCampaign] = useState(false);
  const [codeHasError, setCodeHasError] = useState(false);

  // Function to toggle the default campaign checkbox
  const toggleDefaultCampaign = () => {
    setIsDefaultCampaign(!isDefaultCampaign);
  };

  const [campaignName, setCampaignName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  // const { mutate } = useGetAdTagList();
  const { refetch } = QueryAdTagList();
  const { refetch: refetchDefaultAdTag } = QueryDefaultAdTag();
  const { baseUrlArr } = QueryBaseUrl();

  const createAdTagFun = () => {
    if (campaignName === '') {
      setCampaignNameHasError(true);
      return;
    }
    if (loading) return;
    setLoading(true);
    createAdTag({
      code,
      share: selectedCommission + '',
      isDefaultCampaign,
      campaign: campaignName,
    })
      .then((res) => {
        if (res.code === 0 && res.msg === 'success') {
          refetch();
          refetchDefaultAdTag();
          handleClose();
          toast.success(t('toast:addSuccess'));
        } else if (res.code === 3) {
          setCodeHasError(true);
        } else {
          toast.error(t('toast:addFailed'));
        }
      })
      .catch(() => {
        toast.error(t('toast:addFailed'));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClose = () => {
    setCampaignName('');
    setCode('');
    setSelectedCommission(10);
    setIsDefaultCampaign(false);
    onClose();
  };

  const [showCommissionModal, setShowCommissionModal] = useState(false);

  const [mirror, setMirror] = useState(mirrorOptions(t)[0].value);

  const [campaignNameHasError, setCampaignNameHasError] = useState(false);

  return (
    <>
      <ModalDialog open={open} onClose={handleClose} position="modal-bottom" className="p-0">
        <div className="modal-box flex flex-col gap-4">
          <h4 className="text-base leading-6 font-bold">{t('referral:campaignInformation')}</h4>
          <div className="flex h-15 items-center gap-2">
            <div className="flex flex-1 flex-col items-center">
              <div className="text-primary text-xl font-bold">{100 - Number(selectedCommission)}%</div>
              <div className="text-base-content/60 h-4 text-xs">{t('referral:youReceive')}</div>
            </div>
            <div className="flex flex-1 flex-col items-center">
              <div className="text-primary text-xl font-bold">{selectedCommission}%</div>
              <div className="text-base-content/60 h-4 text-xs">{t('referral:directReferralReceives')}</div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 pl-1 text-sm leading-5">
              {t('referral:campaignSplit')}
              <div className="cursor-pointer" onClick={() => setShowCommissionModal(true)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7 2.1875C4.34213 2.1875 2.1875 4.34213 2.1875 7C2.1875 9.65787 4.34213 11.8125 7 11.8125C9.65787 11.8125 11.8125 9.65787 11.8125 7C11.8125 4.34213 9.65787 2.1875 7 2.1875ZM1.3125 7C1.3125 3.85888 3.85888 1.3125 7 1.3125C10.1411 1.3125 12.6875 3.85888 12.6875 7C12.6875 10.1411 10.1411 12.6875 7 12.6875C3.85888 12.6875 1.3125 10.1411 1.3125 7ZM6.5625 4.8125C6.5625 4.57088 6.75838 4.375 7 4.375H7.00437C7.246 4.375 7.44187 4.57088 7.44187 4.8125V4.81687C7.44187 5.0585 7.246 5.25437 7.00437 5.25437H7C6.75838 5.25437 6.5625 5.0585 6.5625 4.81687V4.8125ZM6.39105 6.15909C7.05968 5.82477 7.81254 6.42869 7.63123 7.15393L7.21764 8.80829L7.24184 8.79619C7.45795 8.68813 7.72075 8.77572 7.82881 8.99184C7.93687 9.20795 7.84928 9.47075 7.63316 9.57881L7.60896 9.59091C6.94032 9.92523 6.18746 9.32131 6.36877 8.59607L6.78236 6.94171L6.75816 6.95381C6.54204 7.06187 6.27925 6.97427 6.17119 6.75816C6.06313 6.54204 6.15073 6.27925 6.36684 6.17119L6.39105 6.15909Z"
                    fill="#A6ADBB"
                    style={{ fill: '#A6ADBB', fillOpacity: 1 }}
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {commissionOptions.map((commission) => (
                <button
                  key={commission}
                  className={`btn ${
                    selectedCommission === commission ? 'bg-secondary text-primary' : 'bg-base-200'
                  } flex h-8 w-16.5 items-center justify-center`}
                  onClick={() => setSelectedCommission(commission)}
                >
                  <div className="text-sm font-semibold">{commission}%</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="pl-1 text-sm leading-5"></div>

            <fieldset className="fieldset">
              <legend className="fieldset-legend pl-1 text-sm leading-5">{t('referral:campaignName')}</legend>
              <div className="relative">
                <input
                  type="text"
                  value={campaignName}
                  className={`input bg-base-200 text-base-content/60 h-12 w-full ${
                    campaignNameHasError ? 'input-error border-error border' : ''
                  }`}
                  onChange={(e) => {
                    setCampaignName(e.target.value);
                    setCampaignNameHasError(false);
                  }}
                />
                {campaignNameHasError && (
                  <p className="validator-hint text-error absolute -bottom-5 text-xs leading-4">
                    {t('referral:campaignNameIsRequired')}
                  </p>
                )}
              </div>
            </fieldset>
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
            <fieldset className="fieldset">
              <legend className="fieldset-legend pl-1 text-sm leading-5">{t('referral:referralCode')}</legend>
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  className={`input bg-base-200 text-base-content/60 h-12 w-full ${
                    codeHasError ? 'input-error border-error border' : ''
                  }`}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setCodeHasError(false);
                  }}
                />
                {codeHasError && (
                  <p className="validator-hint text-error absolute -bottom-5 w-full text-right text-xs leading-4">
                    {t('referral:referralCodeAlreadyInUse')}
                  </p>
                )}
              </div>
            </fieldset>
          </div>
          <div>
            <div className="pl-1 text-sm leading-5">{t('referral:referralLink')}</div>
            <div className="bg-base-200 flex h-12 items-center justify-between gap-2 rounded-lg px-3">
              <div className="text-base-content/60 text-base-content flex-1 overflow-auto whitespace-nowrap">
                {getReferralLink(baseUrlArr[mirror as keyof typeof baseUrlArr], code)}
              </div>
              <CopyBtn text={getReferralLink(baseUrlArr[mirror as keyof typeof baseUrlArr], code)}>
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
              onChange={toggleDefaultCampaign}
            />
            <div className="cursor-pointer text-sm" onClick={toggleDefaultCampaign}>
              {t('referral:setAsDefaultCampaign')}
            </div>
          </div>
          <button
            className="btn bg-primary flex h-12 items-center justify-center"
            onClick={() => {
              createAdTagFun();
            }}
          >
            <div className="text-neutral text-sm font-semibold">
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                </>
              ) : (
                t('referral:createNewCampaign')
              )}
            </div>
          </button>
        </div>
      </ModalDialog>
      <ModalDialog
        open={showCommissionModal}
        onClose={() => setShowCommissionModal(false)}
        className="bg-base-100 z-11000 p-4"
        closeBtn={false}
      >
        <p className="text-sm">{t('referral:commissionIsSharedOnlyWithYourDirectReferrals')}</p>
      </ModalDialog>
    </>
  );
};
