import { useSupportedCryptoDepositGateways, useSupportedCurrencies } from '@/query/finance';
import { useEffect, useMemo, useState } from 'react';

import { SelectDropdown, SelectOption } from '@/components/ui';
import { CopyBtn } from '@/components/ui/CopyBtn';
import { QueryCryptoDepositAddress } from '@/query/cryptoDeposit';
import { ICryptoGateway } from '@/types/finance';
import clsx from 'clsx';
import { QRCodeSVG } from 'qrcode.react';

import { ModalDialog } from '@/components/ui/ModalDialog';
import { useAuth } from '@/contexts/auth';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useDepositBonusConfig } from '@/query/bonus';
import { paths } from '@/routes/paths';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DepositInfoPopup } from '../bonus/popup/DepositInfoPopup';
export const DepositTabContentCrypto = () => {
  const { t } = useTranslation();

  // 使用认证上下文检查用户登录状态
  const { user, status } = useAuth();
  const navigate = useNavigate();

  const [openDepositBonusTooltip, setOpenDepositBonusTooltip] = useState(false);
  const [openMinAmountTooltip, setOpenMinAmountTooltip] = useState(false);
  const [currency, setCurrency] = useState<string>('');
  const [gateway, setGateway] = useState<ICryptoGateway | null>(null);

  const { data: supportedCurrencies = [] } = useSupportedCurrencies();
  const { data: supportedCryptoDepositGateways = [] } = useSupportedCryptoDepositGateways(currency);
  const { data: depositBonusConfig = [] } = useDepositBonusConfig();
  const { convertCurrency } = useCurrencyFormatter();

  const userCurrentDepositBonusConfig: {
    bonusMinAmount: number | string;
    bonusPercent: number;
  } | null = useMemo(() => {
    const usdBonusConfig = depositBonusConfig.find((item) => item.level - 1 === status?.deposit_bonus_times);
    if (!usdBonusConfig) return null;

    // 修正汇率计算：rate 是 1 单位当前币种等于多少 USD
    // 所以要将 USD 金额转换为当前币种金额，需要除以 rate（或乘以 rate 的倒数）
    // const bonusMinAmount =
    //   rate > 0 ? new Decimal(usdBonusConfig.min_deposit_amount).div(rate).toDecimalPlaces(8).toNumber() : 0;
    const bonusMinAmount = convertCurrency(usdBonusConfig.min_deposit_amount, {
      sourceCurrency: 'USDT',
      targetCurrency: currency,
      includeSymbol: false,
    });

    const bonusPercent = Number(usdBonusConfig.bonus_percent);

    return {
      bonusMinAmount,
      bonusPercent,
    };
  }, [depositBonusConfig, status, currency]);

  // 筛选加密货币 - 只显示类型为CRYPTO且可存款的货币(can_deposit为1)
  const cryptoCurrencies = useMemo(() => {
    return supportedCurrencies.filter((item) => item.currency_type === 'CRYPTO' && item.can_deposit === 1);
  }, [supportedCurrencies]);

  const handleCurrencyChange = (value: string | number, _: SelectOption) => {
    setCurrency(value as string);
    setGateway(null);
  };

  useEffect(() => {
    if (currency === '' && cryptoCurrencies.length > 0) {
      setCurrency(cryptoCurrencies[0].currency);
    }
  }, [cryptoCurrencies]);

  useEffect(() => {
    if (currency !== '' && supportedCryptoDepositGateways.length > 0) {
      setGateway(supportedCryptoDepositGateways[0]);
    }
  }, [supportedCryptoDepositGateways]);

  const handleNetworkChange = (value: string | number, _: SelectOption) => {
    setGateway(supportedCryptoDepositGateways.find((item) => item.network === value) || null);
  };

  const handleDeposit = () => {
    navigate(paths.main.casino.root);
  };

  // 使用React Query hook获取存款地址
  const {
    depositAddress,
    isLoading: isLoadingAddress,
    error: addressError,
    refetch: refetchAddress,
  } = QueryCryptoDepositAddress(gateway?.network || '');

  // 构建加密货币选项
  const cryptoOptions = cryptoCurrencies.map((item) => ({
    id: item.currency,
    value: item.currency,
    label: item.display_name,
    icon: <img src={`/icons/tokens/${item.currency.toLowerCase()}.svg`} className="h-4 w-4" alt={item.currency} />,
  }));

  // 构建网络选项
  const networkOptions = supportedCryptoDepositGateways.map((item) => ({
    id: item.network,
    value: item.network,
    label: item.display_name,
    icon: <img src={`/icons/tokens/${item.network.toLowerCase()}.svg`} className="h-4 w-4" alt={item.network} />,
  }));

  // 渲染存款地址和二维码
  const renderDepositAddressSection = () => {
    // 如果用户未登录，显示登录提示
    if (!user) {
      return (
        <div className="bg-base-200 flex h-[152px] flex-col items-center justify-center rounded-xl p-4">
          <p className="text-neutral-content">{t('finance:pleaseLoginToViewDepositAddress')}</p>
        </div>
      );
    }

    // 如果正在加载存款地址，显示加载状态
    if (isLoadingAddress) {
      return (
        <div className="bg-base-200 flex h-[152px] items-center justify-center rounded-xl p-4">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      );
    }

    // 如果加载存款地址出错，显示错误信息和重试按钮
    if (addressError) {
      return (
        <div className="bg-base-200 flex h-[152px] flex-col items-center justify-center rounded-xl p-4">
          <p className="text-error">{t('finance:failedToGetDepositAddress')}</p>
          <button className="btn btn-sm btn-outline mt-2" onClick={() => refetchAddress()}>
            {t('finance:retry')}
          </button>
        </div>
      );
    }

    // 如果没有可用的存款地址
    if (!depositAddress) {
      return (
        <div className="bg-base-200 flex h-[152px] items-center justify-center rounded-xl p-4">
          <p className="text-neutral-content text-sm">{t('finance:noDepositAddressAvailable')}</p>
        </div>
      );
    }

    // 渲染存款地址和二维码
    return (
      <div className="bg-base-200 flex flex-col gap-4 rounded-xl p-4">
        <p className="text-sm font-semibold">{t('finance:scan_qr_code_or_copy_address')}</p>
        <div className="flex items-center gap-4">
          <div className="flex h-[104px] w-[104px] items-center justify-center rounded-lg">
            {depositAddress.qrcode ? (
              <img src={depositAddress.qrcode} className="h-full w-full" alt="QR Code" />
            ) : (
              <QRCodeSVG value={depositAddress.address} size={104} bgColor="#1D232A" fgColor="#fff" />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="border-base-content flex h-[76px] items-center gap-4 overflow-hidden break-all whitespace-normal">
              <div className="flex h-full w-full items-start justify-start text-sm leading-loose">
                {depositAddress.address}
              </div>
              <CopyBtn text={depositAddress.address} className="btn btn-xs btn-square btn-ghost" showText={false} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDepositCountText = () => {
    let text = '';
    if (status?.deposit_bonus_times === 0) {
      text = t('finance:first');
    } else if (status?.deposit_bonus_times === 1) {
      text = t('finance:second');
    } else if (status?.deposit_bonus_times === 2) {
      text = t('finance:third');
    } else if (status?.deposit_bonus_times === 3) {
      text = t('finance:fourth');
    }

    return text;
  };

  const renderDepositUpTo = () => {
    let value = 0;
    if (status?.deposit_bonus_times === 0) {
      value = 20000;
    } else if (status?.deposit_bonus_times === 1) {
      value = 40000;
    } else if (status?.deposit_bonus_times === 2) {
      value = 60000;
    } else if (status?.deposit_bonus_times === 3) {
      value = 100000;
    }

    return value;
  };

  return (
    <div className="bg-base-100 flex flex-col gap-3 py-3">
      <div
        className="hide-scrollbar flex flex-nowrap items-center gap-2 overflow-x-scroll px-1"
        style={{ overscrollBehaviorY: 'none', touchAction: 'pan-x' }}
      >
        {cryptoCurrencies.map((item) => (
          <button
            key={item.currency}
            className={clsx('btn btn-sm rounded-full', currency === item.currency && 'btn-primary')}
            onClick={() => setCurrency(item.currency)}
          >
            <img src={`/icons/tokens/${item.currency.toLowerCase()}.svg`} className="h-4 w-4" />
            <p>{item.currency}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 items-center gap-2">
        <div className="flex flex-col">
          <p className="px-1 py-2 text-sm">{t('finance:depositCurrency')}</p>
          <SelectDropdown
            options={cryptoOptions}
            value={currency}
            onChange={handleCurrencyChange}
            placeholder="Select Currency"
          />
        </div>

        <div className="flex flex-col">
          <p className="px-1 py-2 text-sm">{t('finance:depositNetwork')}</p>
          <SelectDropdown
            options={networkOptions}
            value={gateway?.network || ''}
            onChange={handleNetworkChange}
            placeholder="Select Network"
            disabled={!currency || networkOptions.length === 0}
          />
        </div>
      </div>

      <div
        className="relative flex min-h-[148px] w-full items-center justify-between gap-2 rounded-lg p-4"
        style={{
          background:
            'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 0.200 0.882 0.741 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <div className="absolute top-4 right-4" onClick={() => setOpenDepositBonusTooltip(true)}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6 1.875C3.72183 1.875 1.875 3.72183 1.875 6C1.875 8.27817 3.72183 10.125 6 10.125C8.27817 10.125 10.125 8.27817 10.125 6C10.125 3.72183 8.27817 1.875 6 1.875ZM1.125 6C1.125 3.30761 3.30761 1.125 6 1.125C8.69239 1.125 10.875 3.30761 10.875 6C10.875 8.69239 8.69239 10.875 6 10.875C3.30761 10.875 1.125 8.69239 1.125 6ZM5.625 4.125C5.625 3.91789 5.79289 3.75 6 3.75H6.00375C6.21086 3.75 6.37875 3.91789 6.37875 4.125V4.12875C6.37875 4.33586 6.21086 4.50375 6.00375 4.50375H6C5.79289 4.50375 5.625 4.33586 5.625 4.12875V4.125ZM5.47804 5.27922C6.05116 4.99266 6.69646 5.51031 6.54106 6.13194L6.18655 7.54996L6.20729 7.53959C6.39253 7.44697 6.61778 7.52205 6.71041 7.70729C6.80303 7.89253 6.72795 8.11778 6.54271 8.21041L6.52197 8.22078C5.94885 8.50734 5.30354 7.98969 5.45894 7.36806L5.81345 5.95004L5.79271 5.96041C5.60746 6.05303 5.38221 5.97795 5.28959 5.79271C5.19697 5.60746 5.27205 5.38221 5.45729 5.28959L5.47804 5.27922Z"
              fill="#A6ADBB"
            />
          </svg>
        </div>
        <DepositInfoPopup open={openDepositBonusTooltip} onClose={() => setOpenDepositBonusTooltip(false)} />
        <div className="flex flex-col gap-2 self-start">
          <div className="flex items-start gap-4">
            <img src="/icons/isometric/1.svg" className="h-12 w-12" />
            <div className="flex flex-col gap-1">
              <p className="text-neutral-content text-base font-semibold">
                {renderDepositCountText()} {t('finance:deposit_bonus')}
              </p>
              <p className="text-primary/80 text-sm">
                {(userCurrentDepositBonusConfig?.bonusPercent ?? 1) * 100}% {t('finance:up_to')}{' '}
                {convertCurrency(renderDepositUpTo(), { sourceCurrency: 'USDT', targetCurrency: currency })}
              </p>
            </div>
          </div>
          <p className="text-sm leading-5">
            {t('finance:getExtraBonus', {
              bonusPercent: (userCurrentDepositBonusConfig?.bonusPercent ?? 1) * 100,
              bonusMinAmount: userCurrentDepositBonusConfig?.bonusMinAmount,
              currency: currency,
            })}
          </p>
        </div>
        <input
          type="checkbox"
          defaultChecked
          className="checkbox checkbox-primary checkbox-sm border-secondary border"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between px-2">
          <div className="text-sm">
            {gateway?.network || 'TON'} {t('finance:deposit_address')}
          </div>
          {gateway && (
            <>
              <div className="flex items-center gap-1 py-2 text-xs" onClick={() => setOpenMinAmountTooltip(true)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6 1.875C3.72183 1.875 1.875 3.72183 1.875 6C1.875 8.27817 3.72183 10.125 6 10.125C8.27817 10.125 10.125 8.27817 10.125 6C10.125 3.72183 8.27817 1.875 6 1.875ZM1.125 6C1.125 3.30761 3.30761 1.125 6 1.125C8.69239 1.125 10.875 3.30761 10.875 6C10.875 8.69239 8.69239 10.875 6 10.875C3.30761 10.875 1.125 8.69239 1.125 6ZM5.625 4.125C5.625 3.91789 5.79289 3.75 6 3.75H6.00375C6.21086 3.75 6.37875 3.91789 6.37875 4.125V4.12875C6.37875 4.33586 6.21086 4.50375 6.00375 4.50375H6C5.79289 4.50375 5.625 4.33586 5.625 4.12875V4.125ZM5.47804 5.27922C6.05116 4.99266 6.69646 5.51031 6.54106 6.13194L6.18655 7.54996L6.20729 7.53959C6.39253 7.44697 6.61778 7.52205 6.71041 7.70729C6.80303 7.89253 6.72795 8.11778 6.54271 8.21041L6.52197 8.22078C5.94885 8.50734 5.30354 7.98969 5.45894 7.36806L5.81345 5.95004L5.79271 5.96041C5.60746 6.05303 5.38221 5.97795 5.28959 5.79271C5.19697 5.60746 5.27205 5.38221 5.45729 5.28959L5.47804 5.27922Z"
                    fill="#A6ADBB"
                  />
                </svg>

                <span>
                  {t('finance:min')}: {gateway?.min} {currency}
                </span>
              </div>
              <ModalDialog className="w-xs" open={openMinAmountTooltip} onClose={() => setOpenMinAmountTooltip(false)}>
                <p className="text-sm leading-5">{t('finance:minDepositAmountDescription')}</p>
              </ModalDialog>
            </>
          )}
        </div>

        {renderDepositAddressSection()}
      </div>

      <button className="btn btn-primary btn-md flex h-[48px] items-center justify-center" onClick={handleDeposit}>
        <p className="text-sm">{t('finance:deposit_now')}</p>
      </button>

      <div
        className="flex items-center gap-4 rounded-lg p-4"
        style={{
          background:
            'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 1.000 0.745 0.000 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <img src="/icons/isometric/23.svg" className="h-12 w-12" />
        <p className="text-sm leading-5">
          <Trans
            i18nKey="finance:deposit_warning"
            values={{
              currency: currency || 'USDT',
              network: gateway?.network || 'TON',
              minAmount: gateway?.min,
            }}
            components={[<u />, <u />]}
          />
        </p>
      </div>
    </div>
  );
};
