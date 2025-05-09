import { Page, SafeArea } from '@/components/ui';

import {
  TournamentLogo,
  TournamentParticipatingGames,
  TournamentTimeOut,
  TournamentMyProgress,
  TournamentRulesTerms,
  TournamentBanner,
} from '@/sections/tournament';
import { mockTournament } from '@/_mock/tournament';
import { useEffect, useMemo, useState } from 'react';
import { useTournamentList } from '@/query/tournament';
import { ITournament, ITournamentInfo } from '@/types/tournament';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/language';

const JiliBanner = ({ obj }: { obj: ITournament }) => {
  const { isRTL } = useLanguage();
  const [tournamentInfo, setTournamentInfo] = useState<ITournamentInfo>({} as ITournamentInfo);
  const [details, setDetails] = useState({
    prize: 50000,
    name: 'JILI Slots\nMega Bonanza',
    data: {
      title: '',
      position: '',
      wagered: '',
      prize: '',
      prizePercentage: '',
    },
    time: {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
  });

  useEffect(() => {
    if (obj) {
      const data = obj.user_info;

      setTournamentInfo(data);

      const timestamp = data.date;
      const endTime = timestamp * 1000;
      const now = new Date().getTime();

      const diffMs = now - endTime;
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setDetails({
        ...details,
        time: {
          days,
          hours,
          minutes,
          seconds,
        },
      });
    }
  }, [obj]);

  return (
    <div
      className="relative flex h-71.5 w-full"
      style={{
        background: `
          linear-gradient(
            227deg,
            color(display-p3 0.804 0.627 0.584 / 0.5) 0%,
            color(display-p3 0.082 0.098 0.118 / 0.7) 100%
          )`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '346.03px',
          height: '255.46px',
          [isRTL ? 'left' : 'right']: '3.96px',
          bottom: 0,
        }}
      >
        <img
          src="/images/tournament/jili.png"
          alt="bonus"
          className="absolute h-[255px] w-[346px] object-cover drop-shadow-[0px_-2px_10px_rgba(44,37,47,0.5)]"
          style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}
        />
      </div>
      <div className={`flex flex-col justify-center ${isRTL ? 'pr-8' : 'pl-8'}`}>
        <TournamentTimeOut details={details} data={tournamentInfo} />
      </div>
      <TournamentLogo img="/images/tournament/jili-logo.png" />
    </div>
  );
};

const PgBanner = ({ obj }: { obj: ITournament }) => {
  const { isRTL } = useLanguage();
  const [tournamentInfo, setTournamentInfo] = useState<ITournamentInfo>({} as ITournamentInfo);
  const [details, setDetails] = useState({
    prize: 50000,
    name: 'PG Soft\nRaces',
    data: {
      title: '',
      position: '',
      wagered: '',
      prize: '',
      prizePercentage: '',
    },
    time: {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
  });

  useEffect(() => {
    if (obj) {
      const data = obj.user_info;

      setTournamentInfo(data);

      const timestamp = data.date;
      const endTime = timestamp * 1000;
      const now = new Date().getTime();

      const diffMs = now - endTime;
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setDetails({
        ...details,
        time: {
          days,
          hours,
          minutes,
          seconds,
        },
      });
    }
  }, [obj]);

  return (
    <div
      className="relative flex h-71.5 w-full"
      style={{
        background: `
          linear-gradient(
            227deg,
            color(display-p3 0.090 0.161 0.361 / 0.5) 0%,
            color(display-p3 0.082 0.098 0.118 / 0.5) 100%
          )`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '268px',
          height: '256px',
          [isRTL ? 'left' : 'right']: '0',
          bottom: '-19px',
        }}
      >
        <img
          src="/images/tournament/pg.png"
          alt="bonus"
          className="absolute h-[256px] w-[268px] object-cover drop-shadow-[0px_-2px_10px_rgba(44,37,47,0.5)]"
          style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}
        />
      </div>
      <div className={`flex flex-col justify-center ${isRTL ? 'pr-8' : 'pl-8'}`}>
        <TournamentTimeOut details={details} data={tournamentInfo} />
      </div>
      <TournamentLogo img="/images/tournament/pg-logo.png" /> 
    </div>
  );
};

// const LuckyNumberSevenBanner = ({ obj }: { obj: ITournament }) => {
//   const details = {
//     name: 'Lucky Number\nSeven',
//     time: {
//       days: 6,
//       hours: 23,
//       minutes: 37,
//       seconds: 10,
//     },
//     prize: 100000,
//   };
//   return (
//     <div
//       className="relative flex h-71.5 w-full"
//       style={{
//         background: `
//           linear-gradient(
//             227deg,
//             color(display-p3 0.341 0.659 0.847 / 0.5) 0%,
//             color(display-p3 0.082 0.098 0.118 / 0.5) 100%
//           )`,
//       }}
//     >
//       <div
//         style={{
//           position: 'absolute',
//           width: '261px',
//           height: '257px',
//           right: '0',
//           bottom: '-4px',
//         }}
//       >
//         <img
//           src="/images/tournament/man.png"
//           alt="bonus"
//           className="absolute h-[257px] w-[261px] object-cover drop-shadow-[0px_-2px_10px_rgba(44,37,47,0.5)]"
//         />
//       </div>
//       <div className="absolute bottom-[22px] left-[36px]">
//         <TournamentTimeOut details={details} data={obj.user_info} />
//       </div>
//       <TournamentLogo img="" />
//     </div>
//   );
// };

const BeginnersLuckBanner = ({ obj }: { obj: ITournament }) => {
  const { isRTL } = useLanguage();
  const [tournamentInfo, setTournamentInfo] = useState<ITournamentInfo>({} as ITournamentInfo);
  const [details, setDetails] = useState({
    prize: 50000,
    name: "Beginner's\nLuck",
    data: {
      title: '',
      position: '',
      wagered: '',
      prize: '',
      prizePercentage: '',
    },
    time: {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
  });

  useEffect(() => {
    if (obj) {
      const data = obj.user_info;

      setTournamentInfo(data);

      const timestamp = data.date;
      const endTime = timestamp * 1000;
      const now = new Date().getTime();

      const diffMs = now - endTime;
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setDetails({
        ...details,
        time: {
          days,
          hours,
          minutes,
          seconds,
        },
      });
    }
  }, [obj]);

  return (
    <div
      className="relative flex h-71.5 w-full"
      style={{
        background: `
        linear-gradient(
          227deg,
          color(display-p3 0.318 0.451 0.282 / 0.5) 0%,
          color(display-p3 0.082 0.098 0.118 / 0.5) 100%
        )`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '263px',
          height: '252px',
          [isRTL ? 'left' : 'right']: '0',
          bottom: '-6px',
        }}
      >
        <img
          src="/images/tournament/man2.png"
          alt="bonus"
          className="absolute h-[252px] w-[263px] object-cover drop-shadow-[0px_-2px_10px_rgba(44,37,47,0.5)]"
          style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}
        />
      </div>
      <div className={`flex flex-col justify-center ${isRTL ? 'pr-8' : 'pl-8'}`}>
        <TournamentTimeOut details={details} data={tournamentInfo} />
      </div>
      <TournamentLogo img="" />
    </div>
  );
};

// Banner component mapping - new array to match providers with components
const BANNER_COMPONENTS: Record<string, React.FC<{ obj: ITournament }>> = {
  jili: JiliBanner,
  pg: PgBanner,
  '0': BeginnersLuckBanner,
};

// List of supported tournament providers
const SUPPORTED_PROVIDERS = ['jili', 'pg', '0'];

export default function CasinoPage() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleIndexChange = (index: number) => {
    setCurrentIndex(index);
  };
  // const mockSlotsGames: IGame[] = [...mockGameGames.slice(1, Math.floor(Math.random() * 6) + 5)];
  const { tournamentList } = useTournamentList();

  const banners = useMemo(() => {
    return tournamentList
      .filter((item) => SUPPORTED_PROVIDERS.includes(item.provider))
      .map((item) => {
        const BannerComponent = BANNER_COMPONENTS[item.provider];
        return <BannerComponent obj={item} />;
      });
  }, [tournamentList]);

  const hasTournament = useMemo(() => {
    return tournamentList
      .filter((item) => SUPPORTED_PROVIDERS.includes(item.provider))
      .map((item) => {
        return item;
      });
  }, [tournamentList]);

  const hasTournamentText = useMemo(() => {
    return tournamentList
      .filter((item) => SUPPORTED_PROVIDERS.includes(item.provider))
      .map((item) => {
        return mockTournament(t).find((t) => t.id === item.provider);
      });
  }, [tournamentList, t]);

  return (
    <Page className="flex flex-col">
      <TournamentBanner banners={banners} onIndexChange={handleIndexChange} />

      <svg
        width="100%"
        height="auto"
        viewBox="0 0 375 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={{ maxWidth: '100%', pointerEvents: 'none' }}
        className="text-base-300 z-10 -translate-y-[calc(100%-1px)]"
      >
        <path d="M0 0C147.333 21.3791 229.235 19.7551 375 0V17H0V0Z" fill="currentColor" style={{ fillOpacity: 1 }} />
      </svg>
      <SafeArea top={false} className="z-10 flex flex-col gap-3 px-3">
        {hasTournament && hasTournament[currentIndex] && hasTournament[currentIndex].user_info !== null && (
          <TournamentMyProgress data={hasTournament[currentIndex].user_info} />
        )}
        {hasTournamentText && hasTournamentText[currentIndex] && hasTournamentText[currentIndex].text !== null && (
          <TournamentRulesTerms text={hasTournamentText[currentIndex].text} />
        )}
        <TournamentParticipatingGames obj={hasTournament[currentIndex]} />
      </SafeArea>
    </Page>
  );
}
