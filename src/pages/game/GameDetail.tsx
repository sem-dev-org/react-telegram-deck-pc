import { getGameDetail } from '@/api/detail';
import { FullBleedContainer, Page, SafeContent } from '@/components/ui';
import { CasinoGameProviders } from '@/sections/casino';
import { GameDetailHeader, GameIntroduction, GameTab } from '@/sections/game';
import { IGame } from '@/types/game';
import { useEffect, useState } from 'react';
// import { imgUrl } from '@/utils/imgUrl';
import { useParams } from 'react-router-dom';
// import { Image } from '@/components/ui/Image';
import { GameImage } from '@/components/ui/GameImage';
import { CasinoGamesRowList } from '@/sections/casino/CasinoGamesRowList';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import { useSystem } from '@/hooks';

export default function GameDetailPage() {
  const { id, game_id, provider } = useParams();
  const [game, setGame] = useState<IGame>({});
  const { user } = useAuth();
  const { t } = useTranslation();
  const { checkPageNavToApp } = useSystem();

  // const game = mockGameGames.find((game) => game.id === id);
  useEffect(() => {
    if (checkPageNavToApp()) return;

    if (id) {
      getGameDetail({ id: id }).then((res) => {
        if (res.code === 0) {
          setGame(res.data);
        }
      });
    } else if (game_id && provider) {
      getGameDetail({ game_id: game_id, provider: provider }).then((res) => {
        if (res.code === 0) {
          setGame(res.data);
        }
      });
    }
  }, [id, game_id, provider, user]);

  return (
    <FullBleedContainer>
      <div
        className="absolute top-0 left-0 h-[375px] w-full"
        style={{
          background:
            'linear-gradient(180deg, color(display-p3 0.082 0.098 0.118 / 0.3) 0%, color(display-p3 0.082 0.098 0.118 / 0.9) 39.5%, color(display-p3 0.082 0.098 0.118) 90%)',
        }}
      />
      <div className="bg-base-300 absolute top-[374px] right-0 left-0 h-screen" />
      {/* <Image
        src={imgUrl(game?.game_id || '')}
        alt={game?.game_name}
        className="absolute top-0 left-0 -z-10 !h-[420px] w-full object-cover"
      /> */}
      <GameImage game={game} className="absolute top-0 left-0 -z-10 !h-[420px] w-full" />
      <SafeContent>
        <Page className="isolate z-0 min-h-screen p-3">
          <div className="flex flex-col gap-3">
            <GameDetailHeader game={game} />
            <GameIntroduction game={game} />
            <CasinoGameProviders />
            <GameTab game={game} />
            {[{ type: 'slots', title: t('casino:slotsGames') }].map((type) => (
              <CasinoGamesRowList key={type.type} type={type.type} title={type.title} />
            ))}
            {/* <CasinoSlotsGames /> */}
          </div>
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
}
