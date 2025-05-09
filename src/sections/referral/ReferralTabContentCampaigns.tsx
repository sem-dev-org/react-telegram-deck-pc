import { useState } from 'react';
import { ReferralCreateCampaignModal } from './ReferralCreateCampaignModal';
import { ReferralCreateCampaignModalDetails } from './ReferralCreateCampaignModalDetails';
// import { useGetAdTagList } from '@/api/referral';
import { IAdTag } from '@/types/referral';
import { useAuth } from '@/contexts/auth';
import { QueryAdTagList } from '@/query/adTag';
import { useTranslation } from 'react-i18next';

export const ReferralTabContentCampaigns = () => {
  const [open, setOpen] = useState(false);
  // const { data: adTagList } = useGetAdTagList();
  const { status } = useAuth();
  const { adTagList } = QueryAdTagList();
  const { t } = useTranslation();

  return (
    <>
      <div
        className="flex flex-col gap-2 rounded-2xl p-4"
        style={{
          background: `linear-gradient(180deg, color(display-p3 0.329 0.502 0.596 / 0.2) 0%, color(display-p3 0.114 0.137 0.165 / 0.2) 59.96%), color(display-p3 0.114 0.137 0.165)`,
        }}
      >
        <div className="flex items-center gap-1 text-base leading-6 font-bold">{t('referral:referralCampaigns')}</div>
        <div className="flex gap-2">
          <div className="bg-base-100 flex h-17 flex-1 flex-col items-center justify-center gap-1 rounded-lg">
            <div className="flex items-center gap-1">
              <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.1875 1.75C10.7043 1.75 10.3125 2.14175 10.3125 2.625C10.3125 2.78 10.3524 2.92435 10.4222 3.04971C10.5723 3.31925 10.8591 3.5 11.1875 3.5C11.6707 3.5 12.0625 3.10825 12.0625 2.625C12.0625 2.14175 11.6707 1.75 11.1875 1.75ZM9.4375 2.625C9.4375 1.6585 10.221 0.875 11.1875 0.875C12.154 0.875 12.9375 1.6585 12.9375 2.625C12.9375 3.5915 12.154 4.375 11.1875 4.375C10.6878 4.375 10.2373 4.16543 9.91882 3.8303L5.00646 6.5594C5.04305 6.70036 5.0625 6.84807 5.0625 7C5.0625 7.15193 5.04305 7.29964 5.00646 7.4406L9.91882 10.1697C10.2373 9.83457 10.6878 9.625 11.1875 9.625C12.154 9.625 12.9375 10.4085 12.9375 11.375C12.9375 12.3415 12.154 13.125 11.1875 13.125C10.221 13.125 9.4375 12.3415 9.4375 11.375C9.4375 11.2231 9.45695 11.0754 9.49354 10.9344L4.58118 8.2053C4.26266 8.54043 3.81223 8.75 3.3125 8.75C2.346 8.75 1.5625 7.9665 1.5625 7C1.5625 6.0335 2.346 5.25 3.3125 5.25C3.81223 5.25 4.26266 5.45957 4.58118 5.7947L9.49354 3.0656C9.45695 2.92464 9.4375 2.77693 9.4375 2.625ZM3.3125 6.125C2.82925 6.125 2.4375 6.51675 2.4375 7C2.4375 7.48325 2.82925 7.875 3.3125 7.875C3.64092 7.875 3.92772 7.69425 4.07779 7.42471C4.14758 7.29935 4.1875 7.155 4.1875 7C4.1875 6.845 4.14758 6.70065 4.07779 6.57529C3.92772 6.30575 3.64092 6.125 3.3125 6.125ZM11.1875 10.5C10.8591 10.5 10.5723 10.6808 10.4222 10.9503C10.3524 11.0756 10.3125 11.22 10.3125 11.375C10.3125 11.8582 10.7043 12.25 11.1875 12.25C11.6707 12.25 12.0625 11.8582 12.0625 11.375C12.0625 10.8918 11.6707 10.5 11.1875 10.5Z"
                  fill="#A6ADBB"
                  style={{ fill: '#A6ADBB', fillOpacity: 1 }}
                />
              </svg>
              <div className="text-base-content/60 text-sm">{t('referral:myCampaigns')}</div>
            </div>
            <div className="text-primary text-xl font-bold">{adTagList?.length}/20</div>
          </div>
          <div className="bg-base-100 flex h-17 flex-1 flex-col items-center justify-center gap-1 rounded-lg">
            <div className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_2159_105886)">
                  <path
                    d="M6.75 6.33398C7.85457 6.33398 8.75 5.43855 8.75 4.33398C8.75 3.22941 7.85457 2.33398 6.75 2.33398C5.64543 2.33398 4.75 3.22941 4.75 4.33398C4.75 5.43855 5.64543 6.33398 6.75 6.33398Z"
                    fill="#A6ADBB"
                    style={{ fill: '#A6ADBB', fillOpacity: 1 }}
                  />
                  <path
                    d="M4.08333 5.66732C4.08333 6.4037 3.48638 7.00065 2.75 7.00065C2.01362 7.00065 1.41667 6.4037 1.41667 5.66732C1.41667 4.93094 2.01362 4.33398 2.75 4.33398C3.48638 4.33398 4.08333 4.93094 4.08333 5.66732Z"
                    fill="#A6ADBB"
                    style={{ fill: '#A6ADBB', fillOpacity: 1 }}
                  />
                  <path
                    d="M1.0771 10.5511C0.964043 10.4854 0.876809 10.3818 0.838312 10.2569C0.780904 10.0705 0.75 9.87252 0.75 9.66732C0.75 8.56275 1.64543 7.66732 2.75 7.66732C3.098 7.66732 3.42524 7.7562 3.71027 7.9125C3.01219 8.59989 2.54609 9.52233 2.43986 10.5518C2.42454 10.7003 2.43093 10.8468 2.45664 10.9879C1.95707 10.9444 1.48908 10.7906 1.0771 10.5511Z"
                    fill="#A6ADBB"
                    style={{ fill: '#A6ADBB', fillOpacity: 1 }}
                  />
                  <path
                    d="M11.0437 10.9879C11.5431 10.9443 12.011 10.7906 12.4229 10.5511C12.536 10.4854 12.6232 10.3818 12.6617 10.2569C12.7191 10.0705 12.75 9.87252 12.75 9.66732C12.75 8.56275 11.8546 7.66732 10.75 7.66732C10.4021 7.66732 10.0749 7.75616 9.78992 7.9124C10.4881 8.5998 10.9542 9.52228 11.0604 10.5518C11.0758 10.7002 11.0694 10.8468 11.0437 10.9879Z"
                    fill="#A6ADBB"
                    style={{ fill: '#A6ADBB', fillOpacity: 1 }}
                  />
                  <path
                    d="M12.0833 5.66732C12.0833 6.4037 11.4864 7.00065 10.75 7.00065C10.0136 7.00065 9.41667 6.4037 9.41667 5.66732C9.41667 4.93094 10.0136 4.33398 10.75 4.33398C11.4864 4.33398 12.0833 4.93094 12.0833 5.66732Z"
                    fill="#A6ADBB"
                    style={{ fill: '#A6ADBB', fillOpacity: 1 }}
                  />
                  <path
                    d="M3.61922 11.1279C3.48649 11.0078 3.41615 10.8325 3.43453 10.6544C3.60771 8.97618 5.02606 7.66732 6.7501 7.66732C8.47414 7.66732 9.89248 8.97618 10.0657 10.6544C10.084 10.8325 10.0137 11.0078 9.88097 11.1279C9.05302 11.8774 7.95488 12.334 6.7501 12.334C5.54532 12.334 4.44717 11.8774 3.61922 11.1279Z"
                    fill="#A6ADBB"
                    style={{ fill: '#A6ADBB', fillOpacity: 1 }}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2159_105886">
                    <rect
                      width="13.3333"
                      height="13.3333"
                      fill="white"
                      style={{ fill: 'white', fillOpacity: 1 }}
                      transform="translate(0.083252 0.333984)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <div className="text-base-content/60 text-sm">{t('referral:referrals')}</div>
            </div>
            <div className="text-primary text-xl font-bold">{status?.direct_invitations}</div>
          </div>
        </div>
        <Table data={adTagList || []} />
        <button
          className="btn bg-secondary flex h-11 items-center justify-center"
          onClick={() => {
            setOpen(true);
          }}
        >
          <div className="text-primary text-sm font-semibold">{t('referral:createNewCampaign')}</div>
        </button>
      </div>
      <ReferralCreateCampaignModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

const Table = ({ data }: { data: IAdTag[] }) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<IAdTag | null>(null);
  const { t } = useTranslation();
  const campaignFun = (item: IAdTag) => {
    setSelectedCampaign(item);
    setOpenDetails(true);
  };

  return (
    <>
      <ReferralCreateCampaignModalDetails
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        details={selectedCampaign}
      />

      <div className="overflow-hidden rounded-2xl">
        <div>
          {/* Fixed Header */}
          <div
            className="bg-base-100 text-base-content/60 grid h-10 grid-cols-3 text-xs font-bold"
            style={{ borderBottom: '1px solid color(display-p3 0.082 0.098 0.118)' }}
          >
            <div className="flex items-center pl-4 text-left">{t('referral:campaignName')}</div>
            <div className="flex items-center justify-center text-center">{t('referral:referralCode')}</div>
            <div className="flex items-center justify-end pr-4 text-right">{t('referral:referrals')}</div>
          </div>

          {/* Scrollable Body */}
          <div className="max-h-44 overflow-y-auto">
            {data?.map((item: IAdTag, index: number) => (
              <div
                key={index}
                className="border-base-300 grid h-11 cursor-pointer grid-cols-3 border-b bg-base-200"
                onClick={() => {
                  campaignFun(item);
                }}
              >
                <div className="flex items-center px-4 text-sm font-semibold">
                  <span className="truncate">{item.campaign}</span>
                </div>
                <div className="flex items-center justify-center text-center text-sm font-semibold underline">
                  <span className="truncate">{item.code}</span>
                </div>
                <div className="flex items-center justify-end gap-1 px-4 text-sm font-semibold">
                  <div>{item.register_count}</div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.7676 11.8159C5.53792 11.577 5.54537 11.1972 5.78423 10.9675L8.93443 8L5.78423 5.0325C5.54537 4.80282 5.53792 4.423 5.7676 4.18413C5.99727 3.94527 6.3771 3.93782 6.61596 4.1675L10.216 7.5675C10.3336 7.68062 10.4001 7.83679 10.4001 8C10.4001 8.16321 10.3336 8.31938 10.216 8.4325L6.61596 11.8325C6.3771 12.0622 5.99727 12.0547 5.7676 11.8159Z"
                      fill="#A6ADBB"
                      style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
