import { IGame } from '@/types/game';
import { useState, useEffect } from 'react';

type ImageProps = {
  alt?: string;
  fallbackSrc?: string;
  className?: string;
  game: IGame;
};

const langArr = {
  jili: ['EN', 'PT', 'TH', 'VI', 'ZH'],
  pg: ['EN', 'PT', 'TH', 'VI', 'ZH'],
};

// Type guard for game provider
type GameProvider = keyof typeof langArr;
const imgUrl = import.meta.env.VITE_IMG_URL;

export const GameImage = ({ fallbackSrc = '/images/cyan-blur.png', className = '', alt = '', game }: ImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>(fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);

  // Get language with proper fallback logic
  const getLanguage = () => {
    let lang = localStorage.getItem('B03i18nextLng')?.toUpperCase() || 'EN';
    if (lang === 'zh-CN') {
      lang = 'ZH';
    }

    if (game?.game_provider) {
      const provider = game.game_provider as GameProvider;
      if (!langArr[provider] || !langArr[provider].includes(lang)) {
        return 'EN';
      }
    }
    return lang;
  };

  const getGameImageUrl = (lang: string) => {
    if (game.game_provider === 'jili') {
      return `${imgUrl}/icon-jili/400X540_${lang}_GAMEID_${game.game_id}.png`;
    }
    if (game.game_provider === 'pg') {
      return `${imgUrl}/icon-pg/${lang}_350x472_${game.game_code}.png`;
    }
    if (game.game_provider === 'pp') {
      return `${imgUrl}/icon-pp/${lang}_NB_260x350_${game.game_id}.png`;
    }
    if (game.game_provider === 'spribe') {
      return `${imgUrl}/icon-spribe/${lang}_625x780_${game.game_provider}_${game.game_id}.png`;
    }
    if (game.game_provider === 'evoplay') {
      return `${imgUrl}/icon-evoplay/${lang}_288x375_${game.game_code}.png`;
    }
    if (game.game_provider === 'live88') {
      return `${imgUrl}/icon-live88/${lang}_513x767_${game.game_code}.png`;
    }
    if (game.game_provider === 'fachai') {
      return `${imgUrl}/icon-fachai/${lang}_300x500_${game.game_id}.png`;
    }
    if (game.game_provider === 'relax') {
      return `${imgUrl}/icon-relax/${lang}_320x200_${game.game_code}.png`;
    }
    if (game.game_provider === 'evolution') {
      return `${imgUrl}/icon-evolution/${lang}_288x375_${game.game_code}.png`;
    }
    if (game.game_provider === 'hpg') {
      return `${imgUrl}/icon-pg/${lang}_350x472_${game.game_code}.png`;
    }
    if (game.game_provider === 'hjili') {
      return `${imgUrl}/icon-jili/400X540_${lang}_GAMEID_${game.game_id}.png`;
    }
    if (game.game_provider === 'hpp') {
      return `${imgUrl}/icon-pp/${lang}_NB_260x350_${game.game_id}.png`;
    }
    if (game.game_provider === 'hfc') {
      return `${imgUrl}/icon-fachai/${lang}_300x500_${game.game_id}.png`;
    }
    if (game.game_provider === 'hevoplay') {
      return `${imgUrl}/icon-hevoplay/${lang}_288x375_${game.game_code}.png`;
    }
    if (game.game_provider === 'hspribe') {
      return `${imgUrl}/icon-hspribe/${lang}_625x780_${game.game_provider}_${game.game_id}.png`;
    }
    if (game.game_provider === 'hrelax') {
      return `${imgUrl}/icon-hrelax/${lang}_320x200_${game.game_code}.png`;
    }
    return fallbackSrc;
  };

  useEffect(() => {
    setIsLoading(true);

    if (!game) {
      setImgSrc(fallbackSrc);
      setIsLoading(false);
      return;
    }

    const lang = getLanguage();
    const primaryUrl = getGameImageUrl(lang);

    // Try loading with preferred language
    const img = new Image();
    img.onload = () => {
      setImgSrc(primaryUrl);
      setIsLoading(false);
    };

    img.onerror = () => {
      // Try English if current language failed and it's not already English
      if (lang !== 'EN') {
        const fallbackUrl = getGameImageUrl('EN');
        const fallbackImg = new Image();

        fallbackImg.onload = () => {
          setImgSrc(fallbackUrl);
          setIsLoading(false);
        };

        fallbackImg.onerror = () => {
          setImgSrc(fallbackSrc);
          setIsLoading(false);
        };

        fallbackImg.src = fallbackUrl;
      } else {
        setImgSrc(fallbackSrc);
        setIsLoading(false);
      }
    };

    img.src = primaryUrl;
  }, [fallbackSrc, game]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`bg-base-200 aspect-3/4 h-full w-full object-fill transition-all duration-500 ${className} ${isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      onLoad={() => setIsLoading(false)}
      onError={() => {
        setImgSrc(fallbackSrc);
        setIsLoading(false);
      }}
    />
  );
};
