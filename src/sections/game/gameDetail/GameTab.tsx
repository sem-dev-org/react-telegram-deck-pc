import { useState, useEffect, useCallback } from 'react';
import { useMemo } from 'react';
import clsx from 'clsx';

import { GameMyBets } from './GameMyBets';
import { JiliContent, PgContent, TreasureContent } from '@/sections/tournament/TournamentTabs';
import { getTournamentList } from '@/api/tournament';
import { IGame } from '@/types/game';
import { ITournament } from '@/types/tournament';
import { useAuth } from '@/contexts/auth';

const tabsComponents = [
  {
    label: '',
    value: 'jili',
    icon: (
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 1.81006C8.17155 1.81006 6.37729 1.95884 4.62882 2.2451C4.26621 2.30446 4 2.6178 4 2.98524V3.37178C3.17339 3.52861 2.35799 3.71723 1.55514 3.93634C1.23821 4.02283 1.01446 4.30552 1.00306 4.63384C1.00102 4.69237 1 4.75111 1 4.81006C1 7.40491 2.97645 9.53789 5.50636 9.78597C6.27572 10.6549 7.29439 11.2999 8.45156 11.6082C8.35539 12.3945 8.11892 13.1368 7.76796 13.8101H7.5C6.67157 13.8101 6 14.4816 6 15.3101V17.8101H5.25C4.55964 17.8101 4 18.3697 4 19.0601C4 19.4743 4.33579 19.8101 4.75 19.8101H15.25C15.6642 19.8101 16 19.4743 16 19.0601C16 18.3697 15.4404 17.8101 14.75 17.8101H14V15.3101C14 14.4816 13.3284 13.8101 12.5 13.8101H12.232C11.8811 13.1368 11.6446 12.3945 11.5484 11.6082C12.7056 11.2999 13.7243 10.6549 14.4936 9.78597C17.0235 9.53789 19 7.40491 19 4.81006C19 4.75109 18.999 4.69235 18.9969 4.63384C18.9855 4.30552 18.7618 4.02283 18.4449 3.93634C17.642 3.71723 16.8266 3.52861 16 3.37178V2.98524C16 2.6178 15.7338 2.30446 15.3712 2.2451C13.6227 1.95884 11.8285 1.81006 10 1.81006ZM2.52524 5.2325C3.01226 5.10981 3.50395 4.99884 4 4.8999V5.81006C4 6.54955 4.13404 7.25831 4.37906 7.91294C3.38067 7.39027 2.66567 6.39974 2.52524 5.2325ZM17.4748 5.2325C17.3343 6.39974 16.6193 7.39027 15.6209 7.91294C15.866 7.25831 16 6.54955 16 5.81006V4.8999C16.496 4.99884 16.9877 5.10981 17.4748 5.2325Z"
          fill="#A6ADBB"
          style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: '1' }}
        />
      </svg>
    ),
    component: <JiliContent disableProgress={true} />,
  },
  {
    label: '',
    value: 'pg',
    icon: <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1.81006C8.17155 1.81006 6.37729 1.95884 4.62882 2.2451C4.26621 2.30446 4 2.6178 4 2.98524V3.37178C3.17339 3.52861 2.35799 3.71723 1.55514 3.93634C1.23821 4.02283 1.01446 4.30552 1.00306 4.63384C1.00102 4.69237 1 4.75111 1 4.81006C1 7.40491 2.97645 9.53789 5.50636 9.78597C6.27572 10.6549 7.29439 11.2999 8.45156 11.6082C8.35539 12.3945 8.11892 13.1368 7.76796 13.8101H7.5C6.67157 13.8101 6 14.4816 6 15.3101V17.8101H5.25C4.55964 17.8101 4 18.3697 4 19.0601C4 19.4743 4.33579 19.8101 4.75 19.8101H15.25C15.6642 19.8101 16 19.4743 16 19.0601C16 18.3697 15.4404 17.8101 14.75 17.8101H14V15.3101C14 14.4816 13.3284 13.8101 12.5 13.8101H12.232C11.8811 13.1368 11.6446 12.3945 11.5484 11.6082C12.7056 11.2999 13.7243 10.6549 14.4936 9.78597C17.0235 9.53789 19 7.40491 19 4.81006C19 4.75109 18.999 4.69235 18.9969 4.63384C18.9855 4.30552 18.7618 4.02283 18.4449 3.93634C17.642 3.71723 16.8266 3.52861 16 3.37178V2.98524C16 2.6178 15.7338 2.30446 15.3712 2.2451C13.6227 1.95884 11.8285 1.81006 10 1.81006ZM2.52524 5.2325C3.01226 5.10981 3.50395 4.99884 4 4.8999V5.81006C4 6.54955 4.13404 7.25831 4.37906 7.91294C3.38067 7.39027 2.66567 6.39974 2.52524 5.2325ZM17.4748 5.2325C17.3343 6.39974 16.6193 7.39027 15.6209 7.91294C15.866 7.25831 16 6.54955 16 5.81006V4.8999C16.496 4.99884 16.9877 5.10981 17.4748 5.2325Z"
        fill="#A6ADBB"
        style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: '1' }}
      />
    </svg>,
    component: <PgContent disableProgress={true} />,
  },
  {
    label: '',
    value: '0',
    icon: <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1.81006C8.17155 1.81006 6.37729 1.95884 4.62882 2.2451C4.26621 2.30446 4 2.6178 4 2.98524V3.37178C3.17339 3.52861 2.35799 3.71723 1.55514 3.93634C1.23821 4.02283 1.01446 4.30552 1.00306 4.63384C1.00102 4.69237 1 4.75111 1 4.81006C1 7.40491 2.97645 9.53789 5.50636 9.78597C6.27572 10.6549 7.29439 11.2999 8.45156 11.6082C8.35539 12.3945 8.11892 13.1368 7.76796 13.8101H7.5C6.67157 13.8101 6 14.4816 6 15.3101V17.8101H5.25C4.55964 17.8101 4 18.3697 4 19.0601C4 19.4743 4.33579 19.8101 4.75 19.8101H15.25C15.6642 19.8101 16 19.4743 16 19.0601C16 18.3697 15.4404 17.8101 14.75 17.8101H14V15.3101C14 14.4816 13.3284 13.8101 12.5 13.8101H12.232C11.8811 13.1368 11.6446 12.3945 11.5484 11.6082C12.7056 11.2999 13.7243 10.6549 14.4936 9.78597C17.0235 9.53789 19 7.40491 19 4.81006C19 4.75109 18.999 4.69235 18.9969 4.63384C18.9855 4.30552 18.7618 4.02283 18.4449 3.93634C17.642 3.71723 16.8266 3.52861 16 3.37178V2.98524C16 2.6178 15.7338 2.30446 15.3712 2.2451C13.6227 1.95884 11.8285 1.81006 10 1.81006ZM2.52524 5.2325C3.01226 5.10981 3.50395 4.99884 4 4.8999V5.81006C4 6.54955 4.13404 7.25831 4.37906 7.91294C3.38067 7.39027 2.66567 6.39974 2.52524 5.2325ZM17.4748 5.2325C17.3343 6.39974 16.6193 7.39027 15.6209 7.91294C15.866 7.25831 16 6.54955 16 5.81006V4.8999C16.496 4.99884 16.9877 5.10981 17.4748 5.2325Z"
        fill="#A6ADBB"
        style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: '1' }}
      />
    </svg>,
    component: <TreasureContent disableProgress={true} />,
  },
];

const myBets = {
  label: 'My Bets',
  value: 'my-bets',
  icon: (
    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 10.8099C12.3012 10.8099 14.1667 8.94442 14.1667 6.64323C14.1667 4.34204 12.3012 2.47656 10 2.47656C7.69885 2.47656 5.83337 4.34204 5.83337 6.64323C5.83337 8.94442 7.69885 10.8099 10 10.8099Z"
        fill="#A6ADBB"
        style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: '1' }}
      />
      <path
        d="M10 12.8936C5.82505 12.8936 2.42505 15.6936 2.42505 19.1436C2.42505 19.3769 2.60838 19.5602 2.84172 19.5602H17.1584C17.3917 19.5602 17.575 19.3769 17.575 19.1436C17.575 15.6936 14.175 12.8936 10 12.8936Z"
        fill="#A6ADBB"
        style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: '1' }}
      />
    </svg>
  ),
  component: <GameMyBets />,
}

export const GameTab = ({ game }: { game: IGame }) => {
  const [activeTab, setActiveTab] = useState<string>('');

  const [tabs, setTabs] = useState<typeof tabsComponents>([]);

  const [tournamentList, setTournamentList] = useState<ITournament | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (game.game_provider && user) {
      getTournamentList({
        game_provider: game.game_provider,
      }).then((res) => {
        if (res.code === 0) {
          const firstTournament = res.data[0];
          if (firstTournament) {
            setTournamentList(firstTournament);

            // Find the corresponding tab
            const providerTab = tabsComponents.find(tab => tab.value === firstTournament.provider);
            if (providerTab) {
              providerTab.label = firstTournament.name;
              setTabs([providerTab, myBets]);
              setActiveTab(firstTournament.provider);
            } else {
              setTabs([myBets]);
              setActiveTab('my-bets');
            }
          }
        }
      });
    }
  }, [game, user]);

  const renderTournamentContent = useCallback(() => {
    if (!tournamentList) return null;

    switch (tournamentList.provider) {
      case 'jili':
        return <JiliContent obj={tournamentList} disableProgress={true} />;
      case 'pg':
        return <PgContent obj={tournamentList} disableProgress={true} />;
      case '0':
        return <TreasureContent obj={tournamentList} disableProgress={true} />;
      default:
        return null;
    }
  }, [tournamentList]);

  const renderTabContent = useMemo(() => {
    if (activeTab === 'my-bets') {
      return myBets.component;
    }

    if (tabs.some(tab => tab.value === activeTab)) {
      return renderTournamentContent();
    }

    return null;
  }, [activeTab, renderTournamentContent, tabs]);

  return (
    <div className="flex flex-col">
      <div className="tabs tabs-lift hide-scrollbar flex flex-nowrap items-center overflow-x-scroll">
        {tabs.map((tab) => (
          <label key={tab.value} className="tab [--tab-bg:var(--color-base-200)]">
            <input
              type="radio"
              name="my_tabs_4"
              checked={activeTab === tab.value}
              onChange={() => setActiveTab(tab.value)}
            />
            <div className="flex items-center gap-2 pr-4">
              {tab.icon}
              <p className="text-sm whitespace-nowrap">{tab.label}</p>
            </div>
          </label>
        ))}
      </div>

      <div
        className={clsx(
          'bg-base-100 border-base-300 overflow-hidden',
          activeTab === tabsComponents[0].value && 'rounded-r-xl rounded-b-xl',
          activeTab === tabsComponents[tabsComponents.length - 1].value && 'rounded-xl',
          activeTab !== tabsComponents[0].value &&
          activeTab !== tabsComponents[tabsComponents.length - 1].value &&
          'rounded-xl',
        )}
      >
        {renderTabContent}
      </div>
    </div>
  );
};
