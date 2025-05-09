import { mockReferralFaq } from '@/_mock/legal/referralFaq';
import { Legal } from '@/components/ui/legal';
import { useTranslation } from 'react-i18next';

export const ReferralTabContentFAQ = () => {

  const { t } = useTranslation();

  return (
    <div className="bg-base-100 flex flex-col gap-3 rounded-xl p-2">
      <div className="bg-base-100 flex h-10 items-center justify-between px-5">
        <h4 className="text-base font-bold"> {t('referral:commissionRewards')} </h4>
      </div>
      {mockReferralFaq(t).map((item) => (
        <Legal key={item.id} text={item.text} />
      ))}
      {/* <div className="bg-base-200 collapse rounded-xl">
        <input type="checkbox" onChange={(e) => setIsOpenQuestion1(e.target.checked)} />
        <div className="collapse-title flex items-center justify-between p-4 font-semibold">
          <div className="mb-1 text-sm font-bold"> {t('referral:thisIsAQuestion')} </div>
          <div className={`transition-transform duration-200 ${isOpenQuestion1 ? 'rotate-180' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 6.61719L19.0711 13.6883L17.1724 15.5869L12 10.4145L6.82761 15.5869L4.92893 13.6883L12 6.61719Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB' }}
              />
            </svg>
          </div>
        </div>
        <div className="collapse-content text-sm"> {t('referral:thisIsAnAnswer')} </div>
      </div> */}
    </div>
  );
};
