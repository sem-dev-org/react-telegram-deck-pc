import { IGame } from '@/types/game';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function GameIntroduction({ game }: { game: IGame }) {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation();
  return (
    <div className="bg-base-100 collapse rounded-lg">
      <input type="checkbox" checked={isOpen} onChange={(e) => setIsOpen(e.target.checked)} />
      <div className="collapse-title flex items-center justify-between p-3 font-semibold">
        <div>
          <div className="text-sl mb-1">{game?.game_name}</div>
          <div className="text-neutral-content text-xs break-words">{game?.game_provider}</div>
        </div>
        <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.184136 0.767599C0.422999 0.537923 0.802824 0.54537 1.0325 0.784233L4 3.93443L6.9675 0.784233C7.19718 0.54537 7.577 0.537923 7.81587 0.767599C8.05473 0.997275 8.06218 1.3771 7.8325 1.61596L4.4325 5.21596C4.31938 5.33361 4.16321 5.4001 4 5.4001C3.83679 5.4001 3.68062 5.33361 3.5675 5.21596L0.167501 1.61596C-0.0621751 1.3771 -0.0547276 0.997275 0.184136 0.767599Z"
              fill="#A6ADBB"
              style={{ fill: '#A6ADBB' }}
            />
          </svg>
        </div>
      </div>

      <div className="collapse-content flex flex-col gap-3 px-3 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          {game?.tags &&
            game?.tags.split(',').map((tag) => (
              <div
                key={tag}
                className="bg-secondary text-primary flex h-6 items-center justify-center rounded-lg px-2 text-xs font-semibold whitespace-nowrap"
              >
                {tag}
              </div>
            ))}
        </div>

        <div className="mt-1 flex items-center justify-around px-2">
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs">{t('gameDetail:stakes')}</div>
            <div className="text-primary text-xs font-bold">{game?.stakes}</div>
          </div>
          <div className="bg-secondary h-8 w-[1px]" />
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs">{t('gameDetail:rtp')}</div>
            <div className="text-primary text-xs font-bold">{game?.rtp}</div>
          </div>
          <div className="bg-secondary h-8 w-[1px]" />
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs">{t('gameDetail:maxWin')}</div>
            <div className="text-primary text-xs font-bold">{game?.max_win}</div>
          </div>
        </div>

        <div className="mt-1">
          <div className="text-neutral-content mb-2 text-sm font-bold">
            {t('gameDetail:gameInformation')}
          </div>
          <div className="text-sm leading-5 text-[#A6ADBB]">{game?.game_info}</div>
        </div>
      </div>
    </div>
  );
}
