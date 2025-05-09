import { useTranslation } from 'react-i18next';
import { useSystem } from '@/hooks';

const TokensView = () => {
  const tokens = ['ton', 'btc', 'eth', 'bnb', 'solana', 'usdt', 'trx', 'doge'];
  return (
    <div className="flex items-center justify-center gap-[6px] rounded-t-lg p-2">
      {tokens.map((token) => (
        <img key={token} src={`/icons/tokens/${token}.svg`} className="h-5 w-5" alt={token} />
      ))}
    </div>
  );
};

const PayTypeViews = () => {
  const payTypeIcons = [
    '/images/payment-provider/apple-pay.png',
    '/images/payment-provider/google-pay.png',
    '/images/payment-provider/visa-pay.png',
  ];

  return (
    <div className="flex items-center gap-3">
      {payTypeIcons.map((icon, idx) => (
        <img key={idx} src={icon} alt={icon} className="h-5" />
      ))}
    </div>
  );
};

const DescriptionView = () => {
  const { t } = useTranslation();
  return (
    <span className="text-sm font-bold text-white">
      {t('casino:upToLabel')} <span className="text-primary">300% </span>
      {t('casino:depositBonus')}
    </span>
  );
};

export const CasinoPayment = () => {
  const { isMobile } = useSystem();

  if (isMobile) {
    return (
      <div className="flex flex-col rounded-lg">
        <div className="glass-card flex w-full items-center justify-center gap-[6px] rounded-t-lg p-2">
          <TokensView />
        </div>

        <div className="bg-base-100 flex flex-col items-center justify-center gap-2 rounded-b-lg p-2">
          <PayTypeViews />
          <DescriptionView />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card flex w-full items-center justify-between gap-[6px] rounded-lg rounded-t-lg p-2 px-8">
      <DescriptionView />
      <PayTypeViews />
      <TokensView />
    </div>
  );
};
