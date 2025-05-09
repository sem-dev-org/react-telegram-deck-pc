import { FullBleedContainer, Page, SafeContent } from '@/components/ui';
import { DepositTabContentCrypto, DepositTabContentFiat } from '@/sections/finance';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
type Props = {
  isChildren?: boolean;
};

export default function DepositPage({ isChildren = false }: Props) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'crypto' | 'fiat' | 'swap'>('crypto');

  if (isChildren) {
    return (
      <div className="bg-base-100 flex flex-col rounded-tr-xl rounded-b-xl p-3 pb-24">
        <div className="relative">
          <div className="tabs grid grid-cols-2 px-1">
            <a
              className={`tab relative text-sm ${tab === 'crypto' ? 'tab-active border-base-content border-b-2' : 'border-base-content/20 border-b-2'}`}
              onClick={() => setTab('crypto')}
            >
              {t('finance:crypto')}
            </a>
            <a
              className={`tab relative text-sm ${tab === 'fiat' ? 'tab-active border-base-content border-b-2' : 'border-base-content/20 border-b-2'}`}
              onClick={() => setTab('fiat')}
            >
              {t('finance:fiat')}
            </a>
          </div>

          {tab === 'crypto' && <DepositTabContentCrypto />}
          {tab === 'fiat' && <DepositTabContentFiat />}
        </div>
      </div>
    );
  }

  return (
    <FullBleedContainer className="px-3">
      <SafeContent>
        <Page className="bg-base-100 mt-3 flex flex-col rounded-xl p-3 pb-24">
          <div className="relative">
            <div className="tabs grid grid-cols-2">
              <a
                className={`tab relative ${tab === 'crypto' ? 'tab-active border-base-content border-b-2' : 'border-base-content/20 border-b-2'}`}
                onClick={() => setTab('crypto')}
              >
                {t('finance:crypto')}
              </a>
              <a
                className={`tab relative ${tab === 'fiat' ? 'tab-active border-base-content border-b-2' : 'border-base-content/20 border-b-2'}`}
                onClick={() => setTab('fiat')}
              >
                {t('finance:fiat')}
              </a>
              {/* <a
                className={`tab relative ${tab === 'buy-crypto' ? 'tab-active border-base-content border-b-2' : 'border-base-content/20 border-b-2'}`}
                onClick={() => setTab('buy-crypto')}
              >
                Buy Crypto
              </a> */}
            </div>

            {tab === 'crypto' && <DepositTabContentCrypto />}
            {tab === 'fiat' && <DepositTabContentFiat />}
            {/* {tab === 'buy-crypto' && <DepositTabContentBuyCrypto />} */}
          </div>
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
}
