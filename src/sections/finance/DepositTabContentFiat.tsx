import { currencySymbol as currencySymbolData } from '@/_mock/currency';
import { createFiatDepositOrder } from '@/api/finance';
import { MoneyInput, SelectDropdown } from '@/components/ui';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { useAuth } from '@/contexts/auth';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useDepositBonusConfig } from '@/query/bonus';
import { useFiatDepositGatewayParams, useSupportedCurrencies, useSupportedFiatDepositGateways } from '@/query/finance';
import { QueryExchangeRate } from '@/query/rateForUSD';
import { IFiatGateway } from '@/types/finance';
import { openLink } from '@telegram-apps/sdk-react';
import clsx from 'clsx';
import Decimal from 'decimal.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { DepositInfoPopup } from '../bonus/popup/DepositInfoPopup';
import { QueryBaseUrl } from '@/query/adTag';
import useIsTma from '@/hooks/isTma';

// 定义必填项字段接口
interface RequiredField {
  name: string;
  type: string;
  required: boolean;
  default: any;
  label: string;
  bind: string | null;
  hide?: boolean;
  iskey?: boolean;
}

// 默认预设金额，当没有推荐金额时使用
const defaultPresetAmounts = [200, 500, 1000, 5000, 10000, 50000];

// 添加新的工具函数来处理字段值的初始化
const initializeFieldValue = (field: RequiredField, selectedGateway: IFiatGateway | null): any => {
  // 如果字段有绑定且网关存在对应值，使用网关的值
  if (field.bind && selectedGateway && selectedGateway[field.bind] !== undefined) {
    return selectedGateway[field.bind];
  }
  // 否则使用默认值
  return field.default;
};

export const DepositTabContentFiat = () => {
  const { status } = useAuth();
  const { t } = useTranslation();

  const [openDepositBonusTooltip, setOpenDepositBonusTooltip] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<IFiatGateway | null>(null);
  const [selectedGatewayIndex, setSelectedGatewayIndex] = useState<number | null>(null);

  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: supportedCurrencies } = useSupportedCurrencies();

  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [isValidAmount, setIsValidAmount] = useState<boolean>(true);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: supportedGateways } = useSupportedFiatDepositGateways(currency);
  const { data: depositBonusConfig = [] } = useDepositBonusConfig();
  const allRate = QueryExchangeRate();

  // 只在有选择支付方式时调用参数接口
  const { data: requiredFields = {} } = useFiatDepositGatewayParams(selectedGateway?.gateway_id.toString() || '');

  const { convertCurrency } = useCurrencyFormatter();

  const userCurrentDepositBonusConfig: {
    bonusMinAmount: number;
    bonusPercent: number;
  } | null = useMemo(() => {
    const usdBonusConfig = depositBonusConfig.find((item) => item.level - 1 === status?.deposit_bonus_times);
    if (!usdBonusConfig) return null;

    const rate = allRate.allRate[currency] || 0;

    // 修正汇率计算：rate 是 1 单位当前币种等于多少 USD
    // 所以要将 USD 金额转换为当前币种金额，需要除以 rate（或乘以 rate 的倒数）
    const bonusMinAmount =
      rate > 0 ? new Decimal(usdBonusConfig.min_deposit_amount).div(rate).toDecimalPlaces(2).toNumber() : 0;
    const bonusPercent = Number(usdBonusConfig.bonus_percent);

    return {
      bonusMinAmount,
      bonusPercent,
    };
  }, [depositBonusConfig, status, currency, allRate]);

  // 筛选可存款的法币
  const fiatCurrencies = useMemo(() => {
    return supportedCurrencies
      ? supportedCurrencies.filter((item) => item.currency_type === 'FIAT' && item.can_deposit === 1)
      : [];
  }, [supportedCurrencies]);

  // 当点击页面任意区域时关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && dropdownRef.current.open && !dropdownRef.current.contains(event.target as Node)) {
        dropdownRef.current.open = false;
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 自动选择第一个支持的网关
  useEffect(() => {
    if (supportedGateways && supportedGateways.length > 0) {
      setSelectedGateway(supportedGateways[0]);
      setSelectedGatewayIndex(0);
    } else {
      setSelectedGateway(null);
      setSelectedGatewayIndex(null);
    }
  }, [supportedGateways]);

  // 当选择新的网关或requiredFields变化时，重置表单值
  useEffect(() => {
    if (Object.keys(requiredFields).length > 0 && selectedGateway) {
      // 设置默认值和绑定值，但保留用户已输入的值
      setFormValues((prevValues) => {
        const newValues = { ...prevValues };

        Object.entries(requiredFields).forEach(([key, field]) => {
          const typedField = field as RequiredField;

          // 处理绑定字段和隐藏字段，这些应该始终从网关获取或使用默认值
          if (typedField.bind || typedField.hide) {
            const value = initializeFieldValue(typedField, selectedGateway);
            newValues[key] = value !== undefined ? value : '';
          }
          // 如果是amount且有当前输入值，使用当前输入值
          else if (key === 'amount' && amount) {
            newValues[key] = parseInt(amount, 10);
          }
          // 如果字段不存在于当前表单值中，使用默认值初始化
          else if (newValues[key] === undefined) {
            newValues[key] = typedField.default !== undefined ? typedField.default : '';
          }
          // 其他情况保留用户输入的值
        });

        return newValues;
      });
    }
  }, [requiredFields, selectedGateway, amount]);

  // 设置默认货币
  useEffect(() => {
    if (fiatCurrencies.length > 0 && !currency) {
      setCurrency(fiatCurrencies[0]?.currency || '');
    }
  }, [fiatCurrencies, currency]);

  // 使用选中支付方式的最小和最大金额限制
  const minAmount = selectedGateway?.min || 100;
  const maxAmount = selectedGateway?.max || 50000;

  // 获取当前选中支付方式的推荐金额，如果没有则使用默认值
  const recommendedAmounts = selectedGateway?.recommended || defaultPresetAmounts;

  // 获取当前货币符号
  const currencySymbol = useMemo(() => {
    if (!currency) return '';
    const foundCurrency = currencySymbolData.find((item) => item.code === currency);
    return foundCurrency?.symbol || '';
  }, [currency]);

  // 处理金额变化
  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmount(numericValue);

    const numAmount = parseInt(numericValue || '0', 10);
    setIsValidAmount(numAmount >= minAmount && numAmount <= maxAmount);

    // 更新字段值中的amount，同时保留其他表单字段的值
    setFormValues((prev) => ({
      ...prev,
      amount: numAmount,
    }));
  };

  // 处理预设金额点击
  const handlePresetAmountClick = (presetAmount: number) => {
    setAmount(presetAmount.toString());
    setIsValidAmount(presetAmount >= minAmount && presetAmount <= maxAmount);

    // 更新字段值中的amount，同时保留其他表单字段的值
    setFormValues((prev) => ({
      ...prev,
      amount: presetAmount,
    }));
  };

  // 检查金额是否被选中
  const isAmountSelected = (presetAmount: number) => {
    return amount === presetAmount.toString();
  };

  // 计算额外奖励金额
  const extraAmount = useMemo(() => {
    const numAmount = parseInt(amount || '0', 10);
    const bonusPercent = userCurrentDepositBonusConfig?.bonusPercent ?? 0;
    const extraAmount = numAmount * bonusPercent;

    // 根据货币特性决定保留的小数位数
    let decimalPlaces = 2; // 默认保留2位小数
    if (currency === 'VND') {
      decimalPlaces = 0;
    }

    return extraAmount.toFixed(decimalPlaces);
  }, [amount, userCurrentDepositBonusConfig, currency]);

  // 关闭下拉菜单
  const handleSelectMethod = () => {
    if (dropdownRef.current) {
      dropdownRef.current.open = false;
    }
  };

  // 更新选择支付方式的逻辑
  const handleSelectGateway = (gateway: IFiatGateway, index: number) => {
    setSelectedGateway(gateway);
    setSelectedGatewayIndex(index);

    // 重置金额，确保在支付方式限额范围内
    setAmount('');
    setIsValidAmount(true);
  };

  // 处理货币变更
  const handleCurrencyChange = (value: string | number) => {
    const newCurrency = value as string;
    if (newCurrency !== currency) {
      setCurrency(newCurrency);
      setSelectedGateway(null);
      setSelectedGatewayIndex(null);
      setAmount('');
      setFormValues({});
    }
  };
  const { baseUrlArr } = QueryBaseUrl();
  const isTmaApp = useIsTma();
  // 创建充值订单
  const handleCreateOrder = async () => {
    if (!selectedGateway) {
      toast.error(t('toast:pleaseSelectDepositMethod'));
      return;
    }

    if (!isValidAmount || !amount) {
      toast.error(
        `${t('toast:pleaseEnterValidAmount')} ${currencySymbol}${minAmount} ${t('toast:and')} ${currencySymbol}${maxAmount}`,
      );
      return;
    }

    setIsLoading(true);
    try {
      // 准备订单参数
      const params: {
        gateway_id: number;
        [key: string]: any;
      } = {
        gateway_id: selectedGateway.gateway_id,
        return_url: isTmaApp ? baseUrlArr.telegram : baseUrlArr.h5,
      };

      // 处理所有字段，包括隐藏字段
      Object.entries(requiredFields).forEach(([key, fieldData]) => {
        // 转换为正确的类型
        const field = fieldData as RequiredField;

        // 如果字段是必需的或有值，就包含在参数中
        if (field.required || formValues[key] !== undefined) {
          params[key] = formValues[key];
        }
      });

      // 验证必填字段
      const missingRequiredFields = Object.entries(requiredFields)
        .filter(([key, fieldData]) => {
          const field = fieldData as RequiredField;
          return field.required && (params[key] === undefined || params[key] === '');
        })
        .map(([_, fieldData]) => (fieldData as RequiredField).label);

      if (missingRequiredFields.length > 0) {
        toast.error(`${t('toast:missingRequiredFields')} ${missingRequiredFields.join(', ')}`);
        setIsLoading(false);
        return;
      }

      // 调试日志
      console.debug('Creating order with params:', params);

      // 调用创建订单API
      createFiatDepositOrder(params).then((res) => {
        if (res.code === 0) {
          if (res.data.payment_url) {
            openLink(res.data.payment_url);
            setOpenConfirmDialog(true);
          } else {
            toast.error(t('toast:paymentUrlNotFound'));
          }

        }
      })

    } catch (error) {
      // const errorMessage = error instanceof Error ? error.message : t('toast:failedToCreateDepositOrder');
      toast.error(t('toast:failedToCreateDepositOrder'));
      console.error('Failed to create deposit order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 渲染存款阶段文本
  const renderDepositCountText = () => {
    const stages = ['First', 'Second', 'Third', 'Fourth'];
    return stages[status?.deposit_bonus_times || 0] || 'Bonus';
  };

  // 构建币种选项
  const fiatCurrencyOptions = fiatCurrencies.map((item, idx) => ({
    id: `${idx}`,
    icon: item.currency ? (
      <img src={`/icons/flag/${item.currency.toLowerCase()}.svg`} className="h-4 w-4" alt={item.currency} />
    ) : (
      <div className="h-4 w-4" />
    ),
    value: item.currency,
    label: item.display_name,
  }));

  // 渲染表单字段
  const renderFormFields = () => {
    if (!selectedGateway || Object.keys(requiredFields).length === 0) {
      return null;
    }

    const formFields: React.ReactNode[] = [];
    let amountField: React.ReactNode | null = null;

    Object.entries(requiredFields).forEach(([key, fieldData]) => {
      // 转换为正确的类型
      const field = fieldData as RequiredField;

      // 跳过隐藏字段
      if (field.hide) {
        return;
      }

      // 处理amount字段单独渲染
      if (key === 'amount') {
        amountField = (
          <div key={key} className="flex flex-col">
            <div className="flex items-center justify-between px-1 py-2">
              <p className="text-sm">{t(`finance:${field.name}`)}</p>
              <p className="text-xs">
                {minAmount} ~ {maxAmount} {currency ?? ''}
              </p>
            </div>

            <MoneyInput
              placeholder="0.00"
              className={`bg-base-200 h-12 border ${isValidAmount ? 'border-base-content/20' : 'border-error'}`}
              suffix={
                <p className="text-primary mr-4 text-base font-bold">
                  {t('finance:extra')} + {currencySymbol}
                  {extraAmount || '0.00'}
                </p>
              }
              onChange={handleAmountChange}
              value={amount}
            />

            {!isValidAmount && (
              <p className="text-error text-xs">
                {t('finance:pleaseEnterAnAmountBetween')} {currencySymbol}
                {minAmount} {t('finance:and')} {currencySymbol}
                {maxAmount}
              </p>
            )}

            <div className="mt-3 grid grid-cols-3 gap-2">
              {recommendedAmounts.map((presetAmount, idx) => (
                <button
                  key={idx}
                  className={`btn btn-sm border font-semibold ${isAmountSelected(presetAmount)
                    ? 'border-primary text-primary'
                    : 'border-base-100 active:border-primary active:text-primary'
                    }`}
                  onClick={() => handlePresetAmountClick(presetAmount)}
                  disabled={presetAmount < minAmount || presetAmount > maxAmount}
                >
                  {currencySymbol}
                  {presetAmount.toLocaleString()}.00
                </button>
              ))}
            </div>
          </div>
        );
      }
      // 处理email字段
      else if (key === 'email') {
        formFields.push(
          <div key={key} className="flex flex-col gap-1">
            <p className="px-1 text-sm">{t(`finance:${field.name}`)}</p>
            <input
              type="email"
              className="input bg-base-200 h-12 w-full border"
              value={formValues[key] || ''}
              onChange={(e) => setFormValues((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder={`${t('finance:enter')} ${t(`finance:${field.name}`)}`}
            />
          </div>,
        );
      }
      // 处理phone字段
      else if (key === 'phone') {
        formFields.push(
          <div key={key} className="flex flex-col gap-1">
            <p className="px-1 text-sm">{t(`finance:${field.name}`)}</p>
            <input
              type="tel"
              className="input bg-base-200 h-12 w-full border"
              value={formValues[key] || ''}
              onChange={(e) => setFormValues((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder={`${t('finance:enter')} ${t(`finance:${field.name}`)}`}
            />
          </div>,
        );
      }
      // 处理name字段
      else if (key === 'name') {
        formFields.push(
          <div key={key} className="flex flex-col gap-1">
            <p className="px-1 text-sm">{t(`finance:${field.name}`)}</p>
            <input
              type="text"
              className="input bg-base-200 h-12 w-full border"
              value={formValues[key] || ''}
              onChange={(e) => setFormValues((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder={`${t('finance:enter')} ${t(`finance:${field.name}`)}`}
            />
          </div>,
        );
      }
      // 对于其他类型的字段，渲染默认的文本输入框
      else {
        formFields.push(
          <div key={key} className="flex flex-col gap-1">
            <p className="px-1 text-sm">{t(`finance:${field.name}`)}</p>
            <input
              type={field.type === 'number' ? 'number' : 'text'}
              className="input bg-base-200 h-12 w-full border"
              value={formValues[key] || ''}
              onChange={(e) => setFormValues((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder={`${t('finance:enter')} ${t(`finance:${field.name}`)}`}
            />
          </div>,
        );
      }
    });

    // 返回所有表单字段，把金额字段放在最后
    return (
      <>
        {formFields}
        {amountField}
      </>
    );
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
    <div ref={containerRef} className="bg-base-100 flex flex-col gap-3 py-3">
      {/* <Toaster position="top-center" richColors /> */}

      <div className="grid grid-cols-2 items-center gap-2">
        <div className="flex flex-col">
          <p className="px-1 py-2 text-sm">{t('finance:depositCurrency')}</p>
          <SelectDropdown
            options={fiatCurrencyOptions ?? []}
            value={currency}
            onChange={handleCurrencyChange}
            placeholder="Select Currency"
          />
        </div>

        <div className="flex flex-col">
          <p className="px-1 py-2 text-sm">{t('finance:depositMethod')}</p>
          <details className="dropdown dropdown-end" ref={dropdownRef}>
            <summary className="btn btn-md flex h-12 w-full items-center justify-between">
              {selectedGateway?.thumbnail ? (
                <img src={selectedGateway.thumbnail} className="h-4 w-4" alt={selectedGateway.display_name} />
              ) : (
                <div className="h-4 w-4" />
              )}
              <p className="text-sm">{selectedGateway?.display_name || 'Select Method'}</p>
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.68414 5.7676C4.923 5.53792 5.30282 5.54537 5.5325 5.78423L8.5 8.93443L11.4675 5.78423C11.6972 5.54537 12.077 5.53792 12.3159 5.7676C12.5547 5.99727 12.5622 6.3771 12.3325 6.61596L8.9325 10.216C8.81938 10.3336 8.66321 10.4001 8.5 10.4001C8.33679 10.4001 8.18062 10.3336 8.0675 10.216L4.6675 6.61596C4.43782 6.3771 4.44527 5.99727 4.68414 5.7676Z"
                  fill="#A6ADBB"
                />
              </svg>
            </summary>

            <div className="dropdown-content bg-base-200 z-1 mt-3 flex w-[calc(100vw-3rem)] flex-col gap-3 rounded-lg p-3 shadow-sm">
              <p className="h-5 text-sm">{t('finance:paymentProviders')}</p>
              {!supportedGateways || supportedGateways.length === 0 ? (
                <div className="flex min-h-[100px] flex-col items-center justify-center p-4">
                  <img src="/images/empty.png" className="h-24 w-24" />
                  <p className="text-sm">{t('explore:oopsThereIsNoDataYet')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {supportedGateways.map((gateway, index) => (
                    <div
                      key={index}
                      className={clsx(
                        'bg-base-100 border-base-100 flex flex-col gap-2 rounded-lg border p-2',
                        { 'border-primary border': selectedGatewayIndex === index },
                        { 'opacity-50': !gateway.active },
                      )}
                      onClick={() => {
                        if (gateway.active) {
                          handleSelectGateway(gateway, index);
                        }
                      }}
                    >
                      <div className="bg-neutral flex h-10 w-20 items-center justify-center rounded-lg">
                        {gateway.icon ? (
                          <img src={gateway.icon} className="object-cover p-2" alt={gateway.display_name} />
                        ) : (
                          <div className="h-8 w-16" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{gateway.display_name}</p>
                        <p className="text-xs">
                          {gateway.min} ~ {gateway.max}
                        </p>
                        <p className="text-xs">ETA: {Math.ceil(gateway.timeout / 60)} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="btn btn-sm btn-primary w-15 self-end"
                onClick={handleSelectMethod}
                disabled={!supportedGateways || supportedGateways.length === 0}
              >
                {t('finance:select')}
              </button>
            </div>
          </details>
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

      {/* 动态渲染表单字段 */}
      {renderFormFields()}

      <button
        className={`btn btn-primary btn-md mt-3 flex h-[48px] items-center justify-center`}
        disabled={!isValidAmount || amount === '' || parseInt(amount, 10) === 0 || isLoading || !selectedGateway}
        onClick={handleCreateOrder}
      >
        <p className="text-sm font-semibold">{t('finance:continue')}</p>
        {isLoading && <span className="loading loading-ring loading-xs"></span>}
      </button>

      <div
        className="flex items-center gap-4 rounded-lg p-4"
        style={{
          background:
            'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 0.200 0.514 0.545 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <img src="/icons/isometric/24.svg" className="h-12 w-12" alt="Secure" />
        <p className="text-sm leading-relaxed">
          {t(
            'finance:youWillBeRedirectedToAThirdPartySiteVerifiedByOurPlatformForASecureAndTrustworthyBrowsingExperience',
          )}
        </p>
      </div>

      <div
        className="flex items-center gap-4 rounded-lg p-4"
        style={{
          background:
            'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 1.000 0.745 0.000 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <img src="/icons/isometric/23.svg" className="h-12 w-12" alt="Warning" />
        <ul className="list-decimal text-sm leading-relaxed">
          <li>{t('finance:ensureThatTheTransferAmountMatchesTheSubmissionAmount')}</li>
          <li>{t('finance:eachOrderIDCanONLYBeUsedOnceToAvoidDuplicates')}</li>
          <li>{t('finance:pleaseFollowTheDepositGuidelinesToPreventTheLossOfFunds')}</li>
        </ul>
      </div>

      <ModalDialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <div className="flex flex-col gap-3">
          <p className="text-base font-bold">{t('finance:newFiatDeposit')}</p>
          <div
            className="flex items-center gap-4 rounded-lg p-4"
            style={{
              background:
                'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 0.000 0.663 0.431 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
            }}
          >
            <img src="/icons/isometric/1.svg" className="h-15 w-15" alt="Bonus" />
            <p className="flex flex-col gap-3 text-sm leading-relaxed">
              <span className="text-sm leading-5">
                {t(
                  'finance:pleaseCompleteYourPaymentUsingThePopUpWindowDoNotCloseItUntilYouSeeTheConfirmationScreenIndicatingYourPaymentWasSuccessful',
                )}
              </span>

              <span className="text-sm leading-5">
                {t('finance:noteThatOnceTheTimeLimitExpiresYourTransactionCannotBeResumedAndYourOrderWillBeCanceled')}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <p className="text-sm">{t('finance:depositAmount')}</p>
              <div className="bg-neutral flex h-12 w-full items-center justify-center rounded-lg text-sm font-semibold">
                {currencySymbol}
                {amount} {currency}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm">{t('finance:depositMethod')}</p>
              <div className="bg-neutral flex h-12 w-full items-center justify-center rounded-lg text-sm font-semibold">
                {selectedGateway?.display_name}
              </div>
            </div>
          </div>

          <button className="btn btn-primary h-12 text-sm font-semibold" onClick={() => setOpenConfirmDialog(false)}>
            {t('finance:iUnderstand')}
          </button>
        </div>
      </ModalDialog>
    </div>
  );
};
