import { FullBleedContainer, Page, SafeContent } from '@/components/ui';
import { useState } from 'react';

import {
  ReferralHeader,
  ReferralTabContentAbout,
  ReferralTabContentCalculator,
  ReferralTabContentRewardsSchedule,
  ReferralTabContentCampaigns,
  ReferralTabContentCommissions,
  ReferralTabContentRewards,
  ReferralTabContentBurnt,
  ReferralTabContentFAQ,
  ReferralTabContentPartnerships,
} from '@/sections/referral';
import { TabBtn } from '@/components/ui/TabBtn';
import { useTranslation } from 'react-i18next';
import { ReferralTabContentMyReferrals } from '@/sections/referral/ReferralTabContentMyReferrals';



export default function ReferralProgramPage() {
  const { t } = useTranslation();
  const tabs = [
    { id: 'About', label: t('referral:about') }, 
    { id: 'Rewards Schedule', label: t('referral:rewardsSchedule') },
    { id: 'Calculator', label: t('referral:calculator') },
    { id: 'Campaigns', label: t('referral:campaigns') },
    { id: 'My Referrals', label: t('referral:myReferrals') },
    { id: 'My Commissions', label: t('referral:myCommissions') },
    { id: 'Referral Rewards', label: t('referral:referralRewards') },
    // { id: 'Burnt', label: t('referral:burnt') },
    { id: 'FAQ', label: t('referral:faq') },
    { id: 'Partnerships', label: t('referral:partnerships') },
  ];

  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  return (
    <FullBleedContainer>
      <img
        src="/images/banner/2.png"
        className="absolute top-[51px] right-[17px] -z-10 h-[170px] w-[170px] object-cover drop-shadow-[0_35px_35px_rgba(145,224,255,0.5)]"
      />
      <SafeContent>
        <Page className="flex flex-col gap-3 p-3">
          <ReferralHeader />

          <TabBtn tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === 'About' && <ReferralTabContentAbout />}
          {activeTab === 'Rewards Schedule' && <ReferralTabContentRewardsSchedule />}
          {activeTab === 'Calculator' && <ReferralTabContentCalculator />}
          {activeTab === 'Campaigns' && <ReferralTabContentCampaigns />}
          {activeTab === 'My Commissions' && <ReferralTabContentCommissions />}
          {activeTab === 'My Referrals' && <ReferralTabContentMyReferrals />}
          {activeTab === 'Referral Rewards' && <ReferralTabContentRewards />}
          {activeTab === 'Burnt' && <ReferralTabContentBurnt />}
          {activeTab === 'FAQ' && <ReferralTabContentFAQ />}
          {activeTab === 'Partnerships' && <ReferralTabContentPartnerships />}
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
}
