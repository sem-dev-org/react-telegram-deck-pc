import { ModalDialog } from '@/components/ui/ModalDialog';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const RedeemPromoCode = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [code, setCode] = useState('');
  const { t } = useTranslation();

  return (
    <ModalDialog open={open} onClose={onClose} className="bg-base-100 p-0">
      <div className="flex flex-col gap-4 p-6">
        <h3 className="text-lg leading-7 font-bold">{t('popup:redeemPromoCode.title')}</h3>
        <p className="text-sm leading-5">
          {t('popup:redeemPromoCode.description')}
        </p>
        <input
          className="input input-ghost bg-base-200 flex h-12 w-full items-center rounded-lg"
          placeholder={t('popup:redeemPromoCode.placeholder')}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          className="btn btn-primary h-12 text-sm font-semibold"
          disabled={code.length === 0}
          onClick={() => {
            toast.error(t('toast:invalidPromoCode'), {
              icon: (
                <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.48428 1.16932C9.77353 0.895384 10.2265 0.895384 10.5157 1.16932C12.5325 3.07928 15.2538 4.24962 18.25 4.24962C18.2977 4.24962 18.3453 4.24932 18.3928 4.24873C18.7202 4.24467 19.0123 4.45341 19.1146 4.76442C19.5271 6.01919 19.75 7.35914 19.75 8.74966C19.75 14.6917 15.6859 19.6826 10.1869 21.0979C10.0643 21.1295 9.93569 21.1295 9.81306 21.0979C4.31406 19.6826 0.25 14.6917 0.25 8.74966C0.25 7.35914 0.472873 6.01919 0.885415 4.76442C0.987669 4.45341 1.27984 4.24467 1.60721 4.24873C1.65473 4.24932 1.70233 4.24962 1.75 4.24962C4.74624 4.24962 7.46752 3.07928 9.48428 1.16932ZM2.15599 5.74327C1.8915 6.69952 1.75 7.70753 1.75 8.74966C1.75 13.9231 5.2428 18.2827 10 19.5954C14.7572 18.2827 18.25 13.9231 18.25 8.74966C18.25 7.70753 18.1085 6.69952 17.844 5.74327C14.8566 5.64976 12.1272 4.52792 10 2.72104C7.87276 4.52792 5.14341 5.64976 2.15599 5.74327ZM10 7.2496C10.4142 7.2496 10.75 7.58539 10.75 7.9996V11.7496C10.75 12.1638 10.4142 12.4996 10 12.4996C9.58579 12.4996 9.25 12.1638 9.25 11.7496V7.9996C9.25 7.58539 9.58579 7.2496 10 7.2496ZM9.25 14.7496C9.25 14.3354 9.58579 13.9996 10 13.9996H10.0075C10.4217 13.9996 10.7575 14.3354 10.7575 14.7496V14.7571C10.7575 15.1713 10.4217 15.5071 10.0075 15.5071H10C9.58579 15.5071 9.25 15.1713 9.25 14.7571V14.7496Z"
                    fill="#A6ADBB"
                  />
                </svg>
              ),
              style: {
                background: 'color(display-p3 0.961 0.373 0.443)',
                border: '1px solid color(display-p3 0.961 0.373 0.443)',
                color: '#ffffff',
                gap: '16px',
                fontWeight: 'bold',
              },
            });
          }}
        >
          {t('popup:redeemPromoCode.redeem')}
        </button>
      </div>
    </ModalDialog>
  );
};
