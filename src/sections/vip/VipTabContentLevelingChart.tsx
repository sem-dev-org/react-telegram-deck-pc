import { useEffect, useState } from 'react';
import { QueryAllVipLevelConfig } from '@/query/vip';
import { IVipLevelConfig } from '@/types/vip';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export const VipTabContentLevelingChart = () => {
  const { allVipLevelConfig } = QueryAllVipLevelConfig();
  const [vipLevels, setVipLevels] = useState<IVipLevelConfig[]>([]);
  const { t } = useTranslation('vip');

  useEffect(() => {
    if (allVipLevelConfig && allVipLevelConfig.length > 0) {
      // 按照VIP等级排序
      const sortedConfig = [...allVipLevelConfig].sort((a, b) => a.vip - b.vip);
      setVipLevels(sortedConfig);
    }
  }, [allVipLevelConfig]);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSilver, setIsOpenSilver] = useState(false);
  const [isOpenGold, setIsOpenGold] = useState(false);
  const [isOpenRuby, setIsOpenRuby] = useState(false);
  const [isOpenSapphire, setIsOpenSapphire] = useState(false);
  const [isOpenPlatinum, setIsOpenPlatinum] = useState(false);

  return (
    <div className="bg-base-100 flex flex-col gap-3 rounded-xl p-2">
      <div className="bg-base-200 collapse rounded-xl">
        <input type="checkbox" onChange={(e) => setIsOpen(e.target.checked)} />
        <div className="collapse-title flex items-center justify-between p-4 font-semibold">
          <div className="flex items-center gap-2">
            <img src="/icons/vip-badge/bronze.png" className="h-5 w-5" />
            <div className="mb-1 text-sm">{t('bronze_vip')}</div>
          </div>
          <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 6.61719L19.0711 13.6883L17.1724 15.5869L12 10.4145L6.82761 15.5869L4.92893 13.6883L12 6.61719Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB' }}
              />
            </svg>
          </div>
        </div>
        <div className="collapse-content border-base-200 border text-sm" style={{ padding: 0 }}>
          <div className="bg-base-100 flex items-center">
            <div className="text-base-content/50 flex-1 p-4 text-xs font-bold">{t('level')}</div>
            <div className="text-base-content/50 flex-1 p-4 text-end text-xs font-bold">{t('required_exp')}</div>
          </div>
          {vipLevels
            .filter((level) => level.medal === 'bronze')
            .map((item, idx) => (
              <div className={clsx('bg-base-200 flex items-center', idx % 2 === 0 && 'bg-base-300')}>
                <div className="text-base-content flex-1 p-4 text-sm font-bold">
                  {t(`vip:${item.medal}`)} {item.vip}
                </div>
                <div className="text-base-content/50 flex-1 p-4 text-end text-sm">{Number(item.xp)}</div>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-base-200 collapse rounded-xl">
        <input type="checkbox" onChange={(e) => setIsOpenSilver(e.target.checked)} />
        <div className="collapse-title flex items-center justify-between p-4 font-semibold">
          <div className="flex items-center gap-2">
            <img src="/icons/vip-badge/silver.png" className="h-5 w-5" />
            <div className="mb-1 text-sm">{t('silver_vip')}</div>
          </div>
          <div className={`transition-transform duration-200 ${isOpenSilver ? 'rotate-180' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 6.61719L19.0711 13.6883L17.1724 15.5869L12 10.4145L6.82761 15.5869L4.92893 13.6883L12 6.61719Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB' }}
              />
            </svg>
          </div>
        </div>
        <div className="collapse-content border-base-200 border text-sm" style={{ padding: 0 }}>
          <div className="bg-base-100 flex items-center">
            <div className="text-base-content/50 flex-1 p-4 text-xs font-bold">{t('level')}</div>
            <div className="text-base-content/50 flex-1 p-4 text-end text-xs font-bold">{t('required_exp')}</div>
          </div>
          {vipLevels
            .filter((level) => level.medal === 'silver')
            .map((item, idx) => (
              <div className={clsx('bg-base-200 flex items-center', idx % 2 === 0 && 'bg-base-300')}>
                <div className="text-base-content flex-1 p-4 text-sm font-bold">
                  {t(`vip:${item.medal}`)} {item.vip}
                </div>
                <div className="text-base-content/50 flex-1 p-4 text-end text-sm">
                  {Number(item.xp)}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-base-200 collapse rounded-xl">
        <input type="checkbox" onChange={(e) => setIsOpenGold(e.target.checked)} />
        <div className="collapse-title flex items-center justify-between p-4 font-semibold">
          <div className="flex items-center gap-2">
            <img src="/icons/vip-badge/gold.png" className="h-5 w-5" />
            <div className="mb-1 text-sm">{t('gold_vip')}</div>
          </div>
          <div className={`transition-transform duration-200 ${isOpenGold ? 'rotate-180' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 6.61719L19.0711 13.6883L17.1724 15.5869L12 10.4145L6.82761 15.5869L4.92893 13.6883L12 6.61719Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB' }}
              />
            </svg>
          </div>
        </div>
        <div className="collapse-content border-base-200 border text-sm" style={{ padding: 0 }}>
          <div className="bg-base-100 flex items-center">
            <div className="text-base-content/50 flex-1 p-4 text-xs font-bold">{t('level')}</div>
            <div className="text-base-content/50 flex-1 p-4 text-end text-xs font-bold">{t('required_exp')}</div>
          </div>
          {vipLevels
            .filter((level) => level.medal === 'gold')
            .map((item, idx) => (
              <div className={clsx('bg-base-200 flex items-center', idx % 2 === 0 && 'bg-base-300')}>
                <div className="text-base-content flex-1 p-4 text-sm font-bold">
                  {t(`vip:${item.medal}`)}  {item.vip}
                </div>
                <div className="text-base-content/50 flex-1 p-4 text-end text-sm">
                  {Number(item.xp)}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-base-200 collapse rounded-xl">
        <input type="checkbox" onChange={(e) => setIsOpenRuby(e.target.checked)} />
        <div className="collapse-title flex items-center justify-between p-4 font-semibold">
          <div className="flex items-center gap-2">
            <img src="/icons/vip-badge/ruby.png" className="h-5 w-5" />
            <div className="mb-1 text-sm">{t('ruby_vip')}</div>
          </div>
          <div className={`transition-transform duration-200 ${isOpenRuby ? 'rotate-180' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 6.61719L19.0711 13.6883L17.1724 15.5869L12 10.4145L6.82761 15.5869L4.92893 13.6883L12 6.61719Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB' }}
              />
            </svg>
          </div>
        </div>
        <div className="collapse-content border-base-200 border text-sm" style={{ padding: 0 }}>
          <div className="bg-base-100 flex items-center">
            <div className="text-base-content/50 flex-1 p-4 text-xs font-bold">{t('level')}</div>
            <div className="text-base-content/50 flex-1 p-4 text-end text-xs font-bold">{t('required_exp')}</div>
          </div>
          {vipLevels
            .filter((level) => level.medal === 'ruby')
            .map((item, idx) => (
              <div className={clsx('bg-base-200 flex items-center', idx % 2 === 0 && 'bg-base-300')}>
                <div className="text-base-content flex-1 p-4 text-sm font-bold">
                  {t(`vip:${item.medal}`)} {item.vip}
                </div>
                <div className="text-base-content/50 flex-1 p-4 text-end text-sm">
                  {Number(item.xp)}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-base-200 collapse rounded-xl">
        <input type="checkbox" onChange={(e) => setIsOpenSapphire(e.target.checked)} />
        <div className="collapse-title flex items-center justify-between p-4 font-semibold">
          <div className="flex items-center gap-2">
            <img src="/icons/vip-badge/sapphire.png" className="h-5 w-5" />
            <div className="mb-1 text-sm">{t('sapphire_vip')}</div>
          </div>
          <div className={`transition-transform duration-200 ${isOpenSapphire ? 'rotate-180' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 6.61719L19.0711 13.6883L17.1724 15.5869L12 10.4145L6.82761 15.5869L4.92893 13.6883L12 6.61719Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB' }}
              />
            </svg>
          </div>
        </div>
        <div className="collapse-content border-base-200 border text-sm" style={{ padding: 0 }}>
          <div className="bg-base-100 flex items-center">
            <div className="text-base-content/50 flex-1 p-4 text-xs font-bold">{t('level')}</div>
            <div className="text-base-content/50 flex-1 p-4 text-end text-xs font-bold">{t('required_exp')}</div>
          </div>
          {vipLevels
            .filter((level) => level.medal === 'sapphire')
            .map((item, idx) => (
              <div className={clsx('bg-base-200 flex items-center', idx % 2 === 0 && 'bg-base-300')}>
                <div className="text-base-content flex-1 p-4 text-sm font-bold">
                  {t(`vip:${item.medal}`)} {item.vip}
                </div>
                <div className="text-base-content/50 flex-1 p-4 text-end text-sm">
                  {Number(item.xp)}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-base-200 collapse rounded-xl">
        <input type="checkbox" onChange={(e) => setIsOpenPlatinum(e.target.checked)} />
        <div className="collapse-title flex items-center justify-between p-4 font-semibold">
          <div className="flex items-center gap-2">
            <img src="/icons/vip-badge/platinum.png" className="h-5 w-5" />
            <div className="mb-1 text-sm">{t('platinum_vip')}</div>
          </div>
          <div className={`transition-transform duration-200 ${isOpenPlatinum ? 'rotate-180' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 6.61719L19.0711 13.6883L17.1724 15.5869L12 10.4145L6.82761 15.5869L4.92893 13.6883L12 6.61719Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB' }}
              />
            </svg>
          </div>
        </div>
        <div className="collapse-content border-base-200 border text-sm" style={{ padding: 0 }}>
          <div className="bg-base-100 flex items-center">
            <div className="text-base-content/50 flex-1 p-4 text-xs font-bold">{t('level')}</div>
            <div className="text-base-content/50 flex-1 p-4 text-end text-xs font-bold">{t('required_exp')}</div>
          </div>
          {vipLevels
            .filter((level) => level.medal === 'platinum')
            .map((item, idx) => (
              <div className={clsx('bg-base-200 flex items-center', idx % 2 === 0 && 'bg-base-300')}>
                <div className="text-base-content flex-1 p-4 text-sm font-bold">
                  {t(`vip:${item.medal}`)} {item.vip}
                </div>
                <div className="text-base-content/50 flex-1 p-4 text-end text-sm">
                  {Number(item.xp)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
