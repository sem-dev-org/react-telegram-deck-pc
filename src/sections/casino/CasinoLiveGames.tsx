import { GameCarousel } from '@/components/carousel/GameCarousel';
import { GameImage } from '@/components/ui/GameImage';
import { useLiveGames } from '@/query/game';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';

export const CasinoLiveGames = () => {
  const navigate = useNavigate();

  const { data: liveGameList = [] } = useLiveGames();

  return (
    <GameCarousel title="Live Casino" allButtonLink={`${paths.main.explore.root}?category=live`}> 
      <div className="-mr-3 flex">
        {liveGameList &&
          liveGameList?.map((slide, index) => (
            <div
              key={index}
              className="m-h-[150px] relative mr-2 flex min-w-0 flex-[0_0_30%] flex-col items-center justify-center gap-0.5"
              onClick={() => navigate(`${paths.main.game.details}${slide.game_id}/${slide.game_provider}`)} 
            >
              <GameImage game={slide} className="rounded-2xl object-cover" />
              <div className="bg-base-100 absolute top-2 right-2 z-10 flex items-center gap-1 rounded-lg px-2 py-1 opacity-80">
                <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_2116_2535)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.12502 2.82617C3.12502 1.79064 3.96448 0.951172 5.00002 0.951172C6.03555 0.951172 6.87502 1.79064 6.87502 2.82617C6.87502 3.86171 6.03555 4.70117 5.00002 4.70117C3.96448 4.70117 3.12502 3.86171 3.12502 2.82617Z"
                      fill="#A6ADBB"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.56303 8.70339C1.59526 6.83266 3.12168 5.32617 5.00002 5.32617C6.8784 5.32617 8.40484 6.83273 8.437 8.70353C8.43913 8.82759 8.36765 8.94117 8.25487 8.99292C7.26365 9.44775 6.16107 9.70117 5.00015 9.70117C3.83912 9.70117 2.73645 9.44771 1.74515 8.9928C1.63237 8.94104 1.5609 8.82746 1.56303 8.70339Z"
                      fill="#A6ADBB"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2116_2535">
                      <rect width="10" height="10" fill="white" transform="translate(0 0.326172)" />
                    </clipPath>
                  </defs>
                </svg>

                <p className="text-xs font-bold">{slide.user_count}</p>
              </div>
            </div>
          ))}
      </div>
    </GameCarousel>
  );
};
