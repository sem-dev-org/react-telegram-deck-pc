import { getGameTypeConfig } from '@/api/referral';
import { SelectDropdown } from '@/components/ui';
import { useVipConfig } from '@/query/referr';
import { IGameTypeConfig, IVipConfig } from '@/types/referral';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useMemo } from 'react';
import Decimal from 'decimal.js';
import { useAuth } from '@/contexts/auth';
import { getCurrencySymbolFun } from '@/utils/auth';
import { useTranslation } from 'react-i18next';

export const ReferralTabContentCalculator = () => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<string>('Direct');
  const [percentage] = useState<string>('0.01');

  const typeOptions = [
    {
      id: 'Direct',
      value: 'Direct',
      label: t('referral:direct'),
    },
    {
      id: 'Indirect',
      value: 'Indirect',
      label: t('referral:indirect'),
    },
  ];

  const [wager, setWager] = useState<string>('1000');
  const [isOpen, setIsOpen] = useState(false);

  const handleWagerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*$/.test(value)) {
      setWager(value);
    }
  };

  const { data: gameTypeConfig = { data: [] as IGameTypeConfig[], code: 0 } } = useQuery<{
    data: IGameTypeConfig[];
    code: number;
  }>({
    queryKey: ['gameTypeConfig'],
    queryFn: () => getGameTypeConfig(),
  });

  const [selectedGameType, setSelectedGameType] = useState<string>('');
  const [gameTypeOptions, setGameTypeOptions] = useState<Array<{ id: string; value: string; label: string }>>([]);
  const [selectedGameTypeSpare, setSelectedGameTypeSpare] = useState<string>('');

  useEffect(() => {
    if (gameTypeConfig?.code === 0 && gameTypeConfig?.data) {
      const gameTypeConfigData = gameTypeConfig?.data;
      const gameTypeOptions = gameTypeConfigData.map((gameType: IGameTypeConfig) => ({
        id: String(gameType.id),
        value: String(gameType.id),
        label: gameType.game_type_2 + ' (' + Decimal(gameType.group_rate).mul(100).toString() + '%)',
        spare: gameType.group_rate,
      }));
      if (gameTypeOptions.length > 0) {
        setGameTypeOptions(gameTypeOptions);
        setSelectedGameType(gameTypeOptions[0].value);
        setSelectedGameTypeSpare(gameTypeOptions[0].spare);
      }
    }
  }, [gameTypeConfig]);

  const { vipConfig } = useVipConfig();
  const [vipConfigOptions, setVipConfigOptions] = useState<Array<{ id: string; value: string; label: string }>>([]);
  const [selectedVip, setSelectedVip] = useState<string>('');
  const [selectedVipSpare, setSelectedVipSpare] = useState<string>('');

  useEffect(() => {
    if (vipConfig && vipConfig.length > 0) {
      const vipConfigOptions = vipConfig.map((vip: IVipConfig) => ({
        id: String(vip.id),
        value: String(vip.id),
        label: 'Level ' + vip.vip + ' - ' + Decimal(vip.group).mul(100).toString() + '%',
        spare: vip.group,
      }));
      setVipConfigOptions(vipConfigOptions);
      // setSelectedVip(vipConfig.find((vip: IVipConfig) => vip.vip === status?.vip)?.group?.toString() ?? '');
    }
  }, [vipConfig]);

  const [myCommissionRate, setMyCommissionRate] = useState<string>('');
  const [myCommissionRateSpare, setMyCommissionRateSpare] = useState<string>('');
  const [highestLevelInChain, setHighestLevelInChain] = useState<string>('');
  const [highestLevelInChainSpare, setHighestLevelInChainSpare] = useState<string>('');

  const directCommissionRate = useMemo(() => {
    if (selectedVipSpare !== '' && selectedGameType !== '' && wager !== '') {
      return Decimal(wager).mul(percentage).mul(selectedVipSpare).mul(selectedGameTypeSpare).toString();
    }
    return '0.00';
  }, [selectedGameType, wager, selectedGameTypeSpare, selectedVipSpare, percentage]);

  const indirectCommissionRate = useMemo(() => {
    if (
      myCommissionRateSpare !== '' &&
      highestLevelInChainSpare !== '' &&
      wager !== '' &&
      selectedGameType !== '' &&
      selectedGameTypeSpare !== ''
    ) {
      const commissionRate = Decimal(myCommissionRateSpare).sub(highestLevelInChainSpare).toNumber();

      return Decimal(wager).mul(percentage).mul(commissionRate).mul(selectedGameTypeSpare).toString();
    }
    return '0.00';
  }, [wager, selectedGameType, selectedGameTypeSpare, myCommissionRateSpare, highestLevelInChainSpare, percentage]);

  const { user } = useAuth();
  const symbol: string = useMemo(() => {
    return getCurrencySymbolFun(user?.currency_fiat ?? '') ?? '';
  }, [user]);

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl p-4"
      style={{
        background: `linear-gradient(180deg, color(display-p3 0.329 0.502 0.596 / 0.2) 0%, color(display-p3 0.114 0.137 0.165 / 0.2) 59.96%), color(display-p3 0.114 0.137 0.165)`,
      }}
    >
      <h3 className="flex h-6 items-center gap-1">
        <div className="text-base font-bold">{t('referral:commission')}</div>
        <div className="text-primary text-base font-bold">{t('referral:calculator')}</div>
      </h3>
      <div className="flex gap-2">
        <div className="flex-1">
          <h4 className="pl-1 text-xs leading-4 font-bold">{t('referral:referralType')}</h4>
          <div className="flex items-center">
            <SelectDropdown
              options={typeOptions}
              value={selectedType}
              onChange={(value) => setSelectedType(`${value}`)}
              className="text-sm font-semibold"
            />
          </div>
        </div>
        <div className="flex-1">
          <h4 className="pl-1 text-xs leading-4 font-bold">{t('referral:gameType')}</h4>
          <div className="flex items-center">
            <SelectDropdown
              options={gameTypeOptions}
              value={selectedGameType}
              onChange={(value, option) => {
                setSelectedGameType(`${value}`);
                setSelectedGameTypeSpare(option.spare?.toString() ?? '');
              }}
              className="text-sm font-semibold"
            />
          </div>
        </div>
      </div>
      {selectedType === 'Direct' && <p className="text-sm leading-5">{t('referral:calculatorDirectDescription')}</p>}
      {selectedType === 'Indirect' && (
        <>
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="pl-1 text-xs leading-4 font-bold">{t('referral:myCommissionRate')}</div>
              <div className="flex items-center">
                <SelectDropdown
                  options={vipConfigOptions}
                  value={myCommissionRate}
                  onChange={(value, option) => {
                    setMyCommissionRate(`${value}`);
                    setMyCommissionRateSpare(option.spare?.toString() ?? '');
                  }}
                  className="text-sm font-semibold"
                  height="h10"
                  showSearch
                  renderValue={(option) =>
                    option ? (
                      <div className="text-sm font-semibold">
                        {t('referral:level')} {option.value}
                      </div>
                    ) : null
                  }
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="pl-1 text-xs leading-4 font-bold">{t('referral:highestLevelInChain')}</div>
              <div className="flex items-center">
                <SelectDropdown
                  options={vipConfigOptions}
                  value={highestLevelInChain}
                  onChange={(value, option) => {
                    setHighestLevelInChain(`${value}`);
                    setHighestLevelInChainSpare(option.spare?.toString() ?? '');
                  }}
                  className="text-sm font-semibold"
                  height="h10"
                  showSearch
                  renderValue={(option) =>
                    option ? (
                      <div className="text-sm font-semibold">
                        {t('referral:level')} {option.value}
                      </div>
                    ) : null
                  }
                />
              </div>
            </div>
          </div>
          <div className="list-decimal text-sm">
            <p>{t('referral:yourIndirectCommissionIsBasedOnTwoKeyFactors')}</p>
            <ol className="list-decimal pl-4">
              <li>
                <span className="font-medium" />
                <div>{t('referral:yourVIPLevelAndCommissionRate')}</div>
              </li>
              <li>
                <span className="font-medium" />
                <div>{t('referral:theLevelOfReferrersBetweenYouAndThePlayer')}</div>
              </li>
            </ol>
          </div>
        </>
      )}

      <div className="flex items-end gap-1">
        <div className="w-[36%]">
          <div className="pl-1 text-xs leading-4 font-bold">
            {t('referral:wager')} {user?.currency_fiat}
          </div>
          <input
            className="text-primary input input-ghost bg-base-200 flex h-10 w-full items-center rounded-lg pl-4 text-sm font-bold"
            value={wager}
            onChange={handleWagerChange}
          />
        </div>
        <div className="bg-base-200 flex h-10 w-[20%] items-center justify-center rounded-lg">
          <div className="text-sm">x {Decimal(percentage).mul(100).toString()}% x</div>
        </div>
        <div className="w-[44%]">
          <div className="leading-4 pl-1 text-xs font-bold">{t('referral:commissionRate')}</div>
          <div className="bg-base-200 flex h-10 w-full items-center justify-center rounded-lg">
            {selectedType === 'Indirect' && (
              <div className="text-sm font-semibold">
                {myCommissionRateSpare && highestLevelInChainSpare
                  ? `(${Decimal(myCommissionRateSpare).mul(100).toString()}% - ${Decimal(highestLevelInChainSpare).mul(100).toString()}%) = ${Decimal(myCommissionRateSpare).mul(100).sub(Decimal(highestLevelInChainSpare).mul(100)).toString()}%`
                  : '0%'}
              </div>
            )}
            {selectedType === 'Direct' && (
              <SelectDropdown
                options={vipConfigOptions}
                value={selectedVip}
                onChange={(value, option) => {
                  setSelectedVip(`${value}`);
                  setSelectedVipSpare(option.spare?.toString() ?? '');
                }}
                className="text-sm font-semibold"
                height="h10"
                showSearch
                renderValue={(option) =>
                  option ? (
                    <div className="text-sm font-semibold">
                      {t('referral:level')} {option.id}
                    </div>
                  ) : null
                }
              />
            )}
          </div>
        </div>
      </div>
      <div className="text-primary flex items-center pl-3 text-base leading-6 font-bold">
        = {symbol} {selectedType === 'Indirect' ? indirectCommissionRate : directCommissionRate} {user?.currency_fiat}
      </div>
      <p className="p-0 text-sm whitespace-pre-line">{t('referral:calculatorDescription')}</p>

      <div>
        <div className="flex h-8 items-center justify-center gap-2 leading-8" onClick={() => setIsOpen(!isOpen)}>
          <div className="text-sm font-semibold"> {isOpen ? t('referral:hideRates') : t('referral:showRates')}</div>
          <div className={`${isOpen ? 'rotate-180' : ''} transition-transform duration-300`}>
            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.8389 8.95305C10.6299 9.15401 10.2975 9.1475 10.0966 8.93849L7.5 6.18207L4.90344 8.93849C4.70247 9.1475 4.37012 9.15401 4.16112 8.95305C3.95211 8.75208 3.9456 8.41973 4.14656 8.21073L7.12156 5.06073C7.22054 4.95779 7.35719 4.89961 7.5 4.89961C7.64281 4.89961 7.77945 4.95779 7.87844 5.06073L10.8534 8.21073C11.0544 8.41973 11.0479 8.75208 10.8389 8.95305Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB', fillOpacity: 1 }}
              />
            </svg>
          </div>
        </div>
        <div tabIndex={0} className={`collapse rounded-none ${isOpen ? 'collapse-open pt-3' : 'collapse-close'}`}>
          {/* <p className="collapse-content p-0 text-sm whitespace-pre-line">{t('referral:calculatorDescription')}</p> */}
          <div className="collapse-content px-0">
            <h4 className="mb-3 flex h-6 items-center gap-1">
              <div className="text-base font-bold">{t('referral:commission')}</div>
              <div className="text-primary text-base font-bold">{t('referral:rewardRates')}</div>
            </h4>
            <div className="mb-3">
              <div className="h-4 pl-1 text-xs font-bold">{t('referral:cryptoGames')}</div>
              <div className="bg-base-200 flex h-10 w-full items-center justify-center rounded-lg">
                <div className="flex items-center gap-1 text-sm font-bold">
                  <div className="text-base-content/30">{t('referral:wager')} x 1% x</div>
                  <div className="text-primary">{t('referral:commissionRate')}</div>
                  <div className="text-base-content/30">x 28%</div>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <div className="h-4 pl-1 text-xs font-bold">{t('referral:slotsLiveCasinoGames')}</div>
              <div className="bg-base-200 flex h-10 w-full items-center justify-center rounded-lg">
                <div className="flex items-center gap-1 text-sm font-bold">
                  <div className="text-base-content/30">{t('referral:wager')} x 1% x</div>
                  <div className="text-primary">{t('referral:commissionRate')}</div>
                  <div className="text-base-content/30">x 60%</div>
                </div>
              </div>
            </div>
            <div className="">
              <div className="h-4 pl-1 text-xs font-bold">{t('referral:allSports')}</div>
              <div className="bg-base-200 flex h-10 w-full items-center justify-center rounded-lg">
                <div className="flex items-center gap-1 text-sm font-bold">
                  <div className="text-base-content/30">{t('referral:wager')} x 1% x</div>
                  <div className="text-primary">{t('referral:commissionRate')}</div>
                  <div className="text-base-content/30">x 100%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
