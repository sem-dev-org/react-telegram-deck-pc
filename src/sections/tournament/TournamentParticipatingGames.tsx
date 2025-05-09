import { getTournamentGameList } from '@/api/tournament';
import { GameImage } from '@/components/ui/GameImage';
import { paths } from '@/routes/paths';
import { IGame } from '@/types/game';
import { ITournament } from '@/types/tournament';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { VirtuosoGrid } from 'react-virtuoso';
import { useAuth } from '@/contexts/auth';

export const TournamentParticipatingGames = ({ obj }: { obj: ITournament }) => {
  const [tournamentGameList, setTournamentGameList] = useState<any[]>([]);
  const { t } = useTranslation();
  useEffect(() => {
    getTournamentGameList({
      game_provider: obj?.provider,
      game_type_2: obj?.game_type_2,
    }).then((res) => {
      if (res.code === 0) {
        setTournamentGameList(res.data);
      }
    });
  }, [obj]);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="font-bold">{t('tournament:participatingGames')}</div>
        <button className="btn btn-sm btn-base-200 w-9">{tournamentGameList.length}</button>
      </div>
      <div className={`${tournamentGameList.length > 0 ? 'h-110' : 'h-1'}`}>
        <TournamentList tournamentGameList={tournamentGameList} />
      </div>
    </>
  );
};

const gridComponents = {
  List: forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties; children?: React.ReactNode }
  >(({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{
        ...style,
      }}
      className="grid grid-cols-3 gap-2"
    >
      {children}
    </div>
  )),
  Item: ({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props} className="aspect-[3/4]">
      {children}
    </div>
  ),
};

const ItemWrapper = ({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className="h-full w-full">
    {children}
  </div>
);

const TournamentList = ({ tournamentGameList }: { tournamentGameList: IGame[] }) => {
  const navigate = useNavigate();
  
  const { status } = useAuth();   

  const isLiked = useMemo(
    () => (id: string) => {
      return status?.favorites_game?.includes(id);
    },
    [status],
  );
  
  return (
    <div className="h-full flex-1 pb-3 relative">
      <VirtuosoGrid
        style={{ height: '100%' }}
        data={tournamentGameList}
        components={gridComponents}
        itemContent={(_, item) => (
          <ItemWrapper>
            <div key={item.id} onClick={() => navigate(`${paths.main.game.details}${item.game_id}/${item.game_provider}`)} className="relative h-full w-full">
            <GameImage game={item} className="rounded-2xl object-fill" />
              {status && (
                <div
                  className="absolute top-0 right-0 z-10 flex h-6 w-10 items-center justify-center rounded-tr-2xl rounded-bl-2xl"
                  style={{
                    background: 'color(display-p3 0.165 0.196 0.235 / 0.8)',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5.7929 11.0065L5.78909 11.0044L5.77588 10.9973C5.76462 10.9912 5.74853 10.9823 5.72792 10.9708C5.6867 10.9478 5.62739 10.9142 5.55256 10.8701C5.40296 10.7821 5.19102 10.6525 4.93749 10.484C4.43127 10.1475 3.75488 9.65282 3.07668 9.02061C1.73456 7.76949 0.3125 5.91074 0.3125 3.62109C0.3125 1.91306 1.7496 0.558594 3.48437 0.558594C4.50456 0.558594 5.41802 1.02473 6 1.75536C6.58198 1.02473 7.49544 0.558594 8.51562 0.558594C10.2504 0.558594 11.6875 1.91306 11.6875 3.62109C11.6875 5.91074 10.2654 7.76949 8.92332 9.02061C8.24512 9.65282 7.56873 10.1475 7.06251 10.484C6.80898 10.6525 6.59704 10.7821 6.44744 10.8701C6.37261 10.9142 6.3133 10.9478 6.27208 10.9708C6.25147 10.9823 6.23538 10.9912 6.22412 10.9973L6.21091 11.0044L6.2071 11.0065L6.20549 11.0073C6.07718 11.0755 5.92282 11.0755 5.79451 11.0073L5.7929 11.0065Z"
                      fill={isLiked(String(item.id)) ? '#FF506E' : '#A6ADBB'}
                      style={{
                        fill: isLiked(String(item.id)) ? '#FF506E' : '#A6ADBB',
                        fillOpacity: 1,
                      }}
                    />
                  </svg>
                </div>
              )}
              {/* <GameImage className="h-full w-full rounded-2xl object-cover" game={item} />
              <div className="bg-base-100 absolute top-2 right-2 z-10 flex items-center gap-1 rounded-lg px-2 py-1 opacity-80">
                <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_2116_2535)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.12502 2.82617C3.12502 1.79064 3.96448 0.951172 5.00002 0.951172C6.03555 0.951172 6.87502 1.79064 6.87502 2.82617C6.87502 3.86171 6.03555 4.70117 5.00002 4.70117C3.96448 4.70117 3.12502 3.86171 3.12502 2.82617Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.56303 8.70339C1.59526 6.83266 3.12168 5.32617 5.00002 5.32617C6.8784 5.32617 8.40484 6.83273 8.437 8.70353C8.43913 8.82759 8.36765 8.94117 8.25487 8.99292C7.26365 9.44775 6.16107 9.70117 5.00015 9.70117C3.83912 9.70117 2.73645 9.44771 1.74515 8.9928C1.63237 8.94104 1.5609 8.82746 1.56303 8.70339Z"
                      fill="currentColor"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2116_2535">
                      <rect width="10" height="10" fill="white" transform="translate(0 0.326172)" />
                    </clipPath>
                  </defs>
                </svg>

                <p className="text-xs font-bold">{item.user_count}</p>
              </div> */}
            </div>
          </ItemWrapper>
        )}
      />
    </div>
  )
}