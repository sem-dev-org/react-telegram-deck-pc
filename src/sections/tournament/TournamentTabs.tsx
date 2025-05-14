import { useNavigate } from 'react-router-dom';
import { TournamentTimeOut } from './TournamentTimeOut';
import { TournamentLogo } from './TournamentLogo';
import { TournamentMyProgress } from './TournamentMyProgress';
import { ITournament, ITournamentInfo } from '@/types/tournament';
import { useEffect, useState } from 'react';
import { paths } from '@/routes/paths';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/language';
import { useSystem } from '@/hooks';

export const JiliContent = ({ obj, islocal }: { obj?: ITournament; islocal?: boolean }) => {
  const { t } = useTranslation();
  const { checkPageNavToApp } = useSystem();
  const [details, setDetails] = useState({
    prize: 50000,
    name: t('tournament:jiliSlotsMegaBonanza'),
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
  const [tournamentInfo, setTournamentInfo] = useState<ITournamentInfo>({} as ITournamentInfo);

  useEffect(() => {
    if (obj) {
      // getUserTournamentInfo({
      //   tournament_id: obj.id,
      // }).then((res) => {
      //   if (res.code === 200) {
      const data = obj.user_info;

      setTournamentInfo(data);

      const timestamp = data.date;
      const date = new Date(timestamp * 1000);

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
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

  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  return (
    <div>
      <div
        className="relative flex h-50 w-full overflow-hidden rounded-t-2xl p-4"
        style={{
          background: `
            radial-gradient(100% 308% at 100% 0%, rgba(213, 158, 147, 0.5) 0%, rgba(20, 25, 31, 0.5) 100%)`,
        }}
        onClick={() => {
          if (checkPageNavToApp()) return;
          navigate(paths.main.tournament.root + '?provider=' + obj?.provider_id);
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '304px',
            height: '225px',
            [isRTL ? 'left' : 'right']: '12px',
            bottom: '-19px',
          }}
        >
          <img
            src="/images/tournament/jili.png"
            alt="bonus"
            className="absolute h-[225px] w-[304px] object-cover drop-shadow-[0px_-2px_10px_rgba(44,37,47,0.5)]"
            style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}
          />
        </div>
        <div className=" ">
          <TournamentTimeOut details={details} data={tournamentInfo} islocal={islocal} />
        </div>
        <TournamentLogo img="/images/tournament/jili-logo.png" className="!bottom-6.5" />
      </div>

      {!islocal && <TournamentMyProgress data={tournamentInfo} className="rounded-t-none rounded-b-2xl" />}
    </div>
  );
};

export const PgContent = ({ obj, islocal }: { obj?: any; islocal: boolean }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [tournamentInfo, setTournamentInfo] = useState<ITournamentInfo>({} as ITournamentInfo);
  const { checkPageNavToApp } = useSystem();
  const [details, setDetails] = useState({
    prize: 50000,
    name: t('tournament:pgSoftRaces'),
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
      // getUserTournamentInfo({
      //   tournament_id: obj.id,
      // }).then((res) => {
      //   if (res.code === 200) {
      const data = obj.user_info;

      setTournamentInfo(data);

      const timestamp = data.date;
      const date = new Date(timestamp * 1000);

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
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

      //   }
      // });
    }
  }, [obj]);

  const navigate = useNavigate();

  return (
    <div>
      <div
        className="relative flex h-50 w-full overflow-hidden rounded-t-2xl p-4"
        style={{
          background: `
            radial-gradient(100% 308% at 100% 0%, rgba(17, 42, 95, 0.5) 0%, rgba(20, 25, 31, 0.5) 100%)`,
        }}
        onClick={() => {
          if (checkPageNavToApp()) return;

          navigate(paths.main.tournament.root + '?provider=' + obj?.provider_id);
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '245px',
            height: '234px',
            [isRTL ? 'left' : 'right']: '-21px',
            bottom: '-31px',
          }}
        >
          <img
            src="/images/tournament/pg.png"
            alt="bonus"
            className="absolute h-[234px] w-[245px] object-cover drop-shadow-[0px_-2px_10px_rgba(44,37,47,0.5)]"
            style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}
          />
        </div>
        <div className=" ">
          <TournamentTimeOut details={details} data={tournamentInfo} islocal={islocal} />
        </div>
        <TournamentLogo img="/images/tournament/pg-logo.png" className="!bottom-6.5" />
      </div>
      {!islocal && <TournamentMyProgress data={tournamentInfo} className="rounded-t-none rounded-b-2xl" />}
    </div>
  );
};

export const TreasureContent = ({ obj, disableProgress }: { obj?: any; disableProgress?: boolean }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [tournamentInfo, setTournamentInfo] = useState<ITournamentInfo>({} as ITournamentInfo);
  const [details, setDetails] = useState({
    name: t('tournament:treasureGoblin'),
    time: {
      days: 0,
      hours: 1,
      minutes: 0,
      seconds: 10,
    },
    prize: 50000,
    data: {
      title: '',
      position: '',
      wagered: '',
      prize: '',
      prizePercentage: '',
    },
  });

  useEffect(() => {
    if (obj) {
      // getUserTournamentInfo({
      //   tournament_id: obj.id,
      // }).then((res) => {
      //   if (res.code === 200) {
      const data = obj.user_info;

      setTournamentInfo(data);

      const timestamp = data.date;
      const date = new Date(timestamp * 1000);

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
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

      //     getPoolPrize({
      //       tournament_id: data.tournament_id,
      //       tournament_level:  data.tournament_level,
      //     }).then((res) => {
      //       if (res.code === 200) {
      //         console.log(res.data);
      //       }
      //     });
      //   }
      // });
    }
  }, [obj]);

  const navigate = useNavigate();

  return (
    <div>
      <div
        className="relative flex h-50 w-full overflow-hidden rounded-t-2xl p-4"
        style={{
          background: `
            radial-gradient(100% 308% at 100% 0%, rgba(71, 116, 67, 0.5) 0%, rgba(20, 25, 31, 0.5) 100%)`,
        }}
        onClick={() => navigate(paths.main.tournament.root + '?provider=' + obj?.provider_id)}
      >
        <div
          style={{
            position: 'absolute',
            width: '221px',
            height: '211px',
            [isRTL ? 'left' : 'right']: '-25px',
            bottom: '-4px',
          }}
        >
          <img
            src="/images/tournament/man2.png"
            alt="bonus"
            className="absolute h-[211px] w-[221px] object-cover drop-shadow-[0px_-2px_10px_rgba(44,37,47,0.5)]"
            style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}
          />
        </div>
        <div className=" ">
          <TournamentTimeOut details={details} data={tournamentInfo} />
        </div>
        {/* <TournamentLogo img="/images/tournament/pg-logo.png" className="!bottom-6.5" /> */}
      </div>
      {!disableProgress && <TournamentMyProgress data={tournamentInfo} className="rounded-t-none rounded-b-2xl" />}
    </div>
  );
};
