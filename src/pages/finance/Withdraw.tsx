import { FullBleedContainer, Page, SafeContent } from '@/components/ui';
import { WithdrawTableContentFiat } from '@/sections/finance';
import { WithdrawTableContentCrypto } from '@/sections/finance/WithdrawTableContentCrypto';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
type Props = {
  isChildren?: boolean;
};

export default function WithdrawPage({ isChildren = false }: Props) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'crypto' | 'fiat'>('crypto');

  if (isChildren) {
    return (
      <div className="bg-base-100 flex flex-col rounded-xl p-3 pb-24">
        <div className="tabs grid grid-cols-2 px-1">
          <a
            className={`tab text-sm relative ${tab === 'crypto' ? 'tab-active border-base-content border-b-2' : 'border-base-content/20 border-b-2'}`}
            onClick={() => setTab('crypto')}
          >
            {t('finance:crypto')}
          </a>
          <a
            className={`tab text-sm relative ${tab === 'fiat' ? 'tab-active border-base-content border-b-2' : 'border-base-content/20 border-b-2'}`}
            onClick={() => setTab('fiat')}
          >
            {t('finance:fiat')}
          </a>
        </div>

        {tab === 'crypto' && <WithdrawTableContentCrypto />}
        {tab === 'fiat' && <WithdrawTableContentFiat />}
      </div>
    );
  }

  return (
    <FullBleedContainer className="px-3">
      <SafeContent>
        <Page className="bg-base-100 flex flex-col rounded-xl mt-3 p-3 pb-24">
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
          </div>

          {tab === 'crypto' && <WithdrawTableContentCrypto />}
          {tab === 'fiat' && <WithdrawTableContentFiat />}
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
}
