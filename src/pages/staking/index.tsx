import { Header } from '../../sections/staking/Header';
import { useState } from 'react';
import { Bg } from '../../sections/staking/Bg';
import { TabBtn } from '../../components/tab-btn';
import { TableCard } from '../../sections/staking/Table-Card';
import { MakeTransfer } from '../../sections/staking/Make-Transfer';
import { FrequentlyAskedQuestions } from '../../sections/staking/Frequently-Asked-Questions'; 

let tabs = [
  { id: 'Tab1', label: 'Tab1' },
  { id: 'Tab2', label: 'Tab2' },
  {
    id: 'Staking',
    label: 'Staking',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.56195 1.33417C7.49092 1.23891 7.3842 1.17665 7.26632 1.16169C7.14844 1.14673 7.02954 1.18036 6.93696 1.25485C5.84602 2.13266 5.08515 3.40615 4.87271 4.85784C4.48971 4.5802 4.15333 4.24193 3.87776 3.8571C3.80196 3.75123 3.68293 3.68464 3.55305 3.67541C3.42317 3.66619 3.29593 3.71529 3.20592 3.80938C2.30444 4.7517 1.75 6.03061 1.75 7.43809C1.75 10.3376 4.1005 12.6881 7 12.6881C9.89949 12.6881 12.25 10.3376 12.25 7.43809C12.25 5.30257 10.975 3.46579 9.14654 2.64566C8.49951 2.32979 7.96522 1.87495 7.56195 1.33417ZM9.1875 8.31332C9.1875 9.52144 8.20812 10.5008 7 10.5008C5.79188 10.5008 4.8125 9.52144 4.8125 8.31332C4.8125 8.07454 4.85076 7.8447 4.92148 7.62958C5.28809 7.9006 5.70949 8.10175 6.16601 8.21335C6.29195 7.39622 6.7005 6.67235 7.28869 6.1447C8.36036 6.28599 9.1875 7.20306 9.1875 8.31332Z"
          fill="#E7FB78"
          fill-opacity="0.8"
          style={{ fill: '#E7FB78', fillOpacity: 0.8 }}   
        />
      </svg>
    ),
  },
];

export function StakingPage() {
  const [activeTab, setActiveTab] = useState(tabs[2].id);

  return (
    <div className="flex flex-col gap-2">
      <Bg />
      <div className="z-100">
        <div className="pt-3 main-style flex flex-col gap-3">
          <TabBtn tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          <Header />
          <TableCard />
          <MakeTransfer />
          <FrequentlyAskedQuestions />
        </div>
      </div>
    </div>
  );
}
