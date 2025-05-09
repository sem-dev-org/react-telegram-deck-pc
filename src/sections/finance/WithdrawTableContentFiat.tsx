import { createWithdrawOrder } from '@/api/payment';
import { SelectDropdown } from '@/components/ui';
import { useAuth } from '@/contexts/auth';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { QueryUserBalance } from '@/query/balance';
import { PaymentGateway, QueryWithdrawGatewayRequiredFields } from '@/query/fiatWithdraw';
import { useSupportedCurrencies, useSupportedFiatWithdrawGateways } from '@/query/finance';
import { useUserBalanceExtension } from '@/query/finance';
import { IUserBalance } from '@/types/auth';
import { ICurrency } from '@/types/finance';
import clsx from 'clsx';
import { Decimal } from 'decimal.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

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
  select?: Array<{
    [key: string]: string;
  }>;
}

// 定义必填项参数接口
interface RequiredFields {
  [key: string]: RequiredField;
}

export function WithdrawTableContentFiat() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { getCurrencyInfo } = useCurrencyFormatter();

  // 引入余额查询hook
  const { userBalance = [] } = QueryUserBalance();

  // 引入余额扩展hook
  const { data: userBalanceExtension = [] } = useUserBalanceExtension();

  // 状态管理
  const [selectedCurrency, setSelectedCurrency] = useState<ICurrency | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
  const [selectedGatewayIndex, setSelectedGatewayIndex] = useState<number>(-1);

  // 使用React Query hook获取所有支持的货币
  const { data: allCurrencies, isLoading: isLoadingCurrencies } = useSupportedCurrencies();

  // 过滤出支持提款的货币，考虑 can_withdraw 字段
  const supportedCurrencies = useMemo(() => {
    return allCurrencies?.filter((currency) => currency.currency_type === 'FIAT' && currency.can_withdraw === 1) || [];
  }, [allCurrencies]);

  // 使用React Query hook获取选定法币支持的取款网关
  const {
    data: gateways,
    isLoading: isLoadingGateways,
    error: gatewaysError,
    refetch: refetchGateways,
  } = useSupportedFiatWithdrawGateways(selectedCurrency?.currency ?? '');

  useEffect(() => {
    if (supportedCurrencies.length > 0 && !selectedCurrency) {
      setSelectedCurrency(supportedCurrencies[0]);
    }
  }, [supportedCurrencies, selectedCurrency]);

  useEffect(() => {
    if (gateways && gateways.length > 0) {
      setSelectedGateway(gateways[0]);
      setSelectedGatewayIndex(0);
    }
  }, [gateways]);

  // 通用表单字段状态
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 获取取款网关的必填项
  const { requiredFields = {} as RequiredFields } = QueryWithdrawGatewayRequiredFields(
    selectedGateway?.gateway_id.toString() ?? '',
  );

  // 当点击页面任意区域时关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // 如果下拉菜单是打开的，并且点击发生在下拉菜单外部
      if (dropdownRef.current && dropdownRef.current.open && !dropdownRef.current.contains(event.target as Node)) {
        dropdownRef.current.open = false;
      }
    }

    // 添加全局点击事件监听器
    document.addEventListener('mousedown', handleClickOutside);

    // 清理函数
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 添加工具函数来初始化字段值，与充值页面类似
  const initializeFieldValue = (field: RequiredField, selectedGateway: PaymentGateway | null): any => {
    // 如果字段有绑定且网关存在对应值，使用网关的值
    if (field.bind && selectedGateway && selectedGateway[field.bind] !== undefined) {
      return selectedGateway[field.bind];
    }
    // 否则使用默认值
    return field.default;
  };

  // 当选择新的网关或requiredFields变化时，重置表单值
  useEffect(() => {
    if (Object.keys(requiredFields).length > 0 && selectedGateway) {
      // 设置默认值和绑定值
      const initialValues: Record<string, string> = {};

      Object.entries(requiredFields as RequiredFields).forEach(([key, field]) => {
        // 处理所有字段，包括隐藏和非必填字段
        const value = initializeFieldValue(field, selectedGateway);
        initialValues[key] = String(value !== undefined ? value : '');

        // 记录处理过程，用于调试
        if (field.bind && selectedGateway[field.bind] !== undefined) {
          console.debug(`字段 ${key} 绑定到 ${field.bind}=${selectedGateway[field.bind]}`);
        }
      });

      setFormValues(initialValues);
    }
  }, [requiredFields, selectedGateway]);

  // 格式化金额，按照当前货币的小数位显示
  const formatAmount = (value: number | string): string => {
    if (!selectedCurrency?.currency) return value.toString();

    const currencyInfo = getCurrencyInfo(selectedCurrency.currency);
    return new Decimal(value).toDecimalPlaces(currencyInfo.decimalPlaces, Decimal.ROUND_DOWN).toString();
  };

  // 获取当前选择币种的余额信息
  const getCurrentBalance = () => {
    if (!selectedCurrency) return { available: '0.00', locked: '0.00' };

    const balance = userBalance.find((b: IUserBalance) => b.currency === selectedCurrency?.currency);
    if (!balance) return { available: '0.00', locked: '0.00' };

    // 获取userBalanceExtension中的withdraw_able
    const extensionBalance = userBalanceExtension.find((b: { currency: string; withdraw_able: string }) => b.currency === selectedCurrency?.currency);
    const withdrawAble = extensionBalance ? new Decimal(extensionBalance.withdraw_able) : new Decimal(-1);
    const totalBalance = new Decimal(balance.balance);

    // 如果withdraw_able小于0或不存在扩展数据，使用总余额作为可用余额
    const availableAmount = withdrawAble.isNegative() ? totalBalance : withdrawAble;
    const locked = totalBalance.minus(availableAmount);

    // 获取货币配置的小数位数
    const currencyInfo = getCurrencyInfo(selectedCurrency.currency);
    const decimalPlaces = currencyInfo.decimalPlaces;

    return {
      available: availableAmount.toDecimalPlaces(decimalPlaces, Decimal.ROUND_DOWN).toString(),
      locked: locked.toDecimalPlaces(decimalPlaces, Decimal.ROUND_DOWN).toString(),
    };
  };

  // 处理法币选择变化
  const handleCurrencyChange = (value: string | number) => {
    const newCurrency = value as string;
    // 只有当选择了不同的货币时才更新
    if (newCurrency !== selectedCurrency?.currency) {
      setSelectedCurrency(supportedCurrencies?.find((c) => c.currency === newCurrency) ?? null);
      setSelectedGateway(null); // 重置已选择的网关
      setSelectedGatewayIndex(-1); // 重置方法索引为-1
      setFormValues({}); // 重置表单值

      // 主动刷新网关列表（虽然 React Query 会自动刷新，但为确保立即刷新）
      if (newCurrency) {
        setTimeout(() => {
          refetchGateways();
        }, 0);
      }
    }
  };

  // 选择支付方式
  const handleSelectGateway = (gateway: PaymentGateway, index: number) => {
    setSelectedGateway(gateway);
    setSelectedGatewayIndex(index);
  };

  // 关闭下拉菜单
  const handleSelectMethod = () => {
    if (dropdownRef.current) {
      dropdownRef.current.open = false;
    }
  };

  // 处理表单字段变化
  const handleFormValueChange = (fieldName: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // 设置快捷金额
  const handleQuickAmount = (type: 'min' | '25%' | '50%' | 'max') => {
    if (!selectedGateway || !selectedCurrency) return;

    const { available } = getCurrentBalance();
    // 解析余额字符串为数字，不限制小数位数
    const availableAmount = parseFloat(available);
    const min = selectedGateway.min ? parseFloat(String(selectedGateway.min)) : 0;
    const max = selectedGateway.max ? parseFloat(String(selectedGateway.max)) : availableAmount;

    let amount = 0;
    let actualType = type; // 追踪实际应用的类型

    switch (type) {
      case 'min':
        amount = min;
        break;
      case '25%':
        // 精确计算25%
        amount = availableAmount * 0.25;
        // 检查是否超过最大值
        if (amount > max) {
          amount = max;
          actualType = 'max'; // 如果应用了最大值，更改类型
        }
        break;
      case '50%':
        // 精确计算50%
        amount = availableAmount * 0.5;
        // 检查是否超过最大值
        if (amount > max) {
          amount = max;
          actualType = 'max'; // 如果应用了最大值，更改类型
        }
        break;
      case 'max':
        // 直接使用可用金额和最大限额中的较小值
        amount = Math.min(availableAmount, max);
        break;
    }

    // 确保金额不小于最小限额
    if (amount < min) {
      amount = min;
      actualType = 'min'; // 如果应用了最小值，更改类型
    }

    // 格式化金额，根据货币配置的小数位格式化
    const formattedAmount = formatAmount(amount);

    // 更新amount字段，并记录当前选择的类型（使用actualType而不是type）
    if ((requiredFields as RequiredFields).amount) {
      setFormValues((prev) => ({
        ...prev,
        amount: formattedAmount,
        _amountSelectType: actualType, // 使用实际应用的类型，而不是用户点击的类型
      }));
    }
  };

  // 处理表单提交
  const handleContinue = async () => {
    // 检查是否选择了支付方式
    if (!selectedGateway) {
      toast.error(t('toast:pleaseSelectWithdrawalMethod'));
      return;
    }

    // 准备所有参数，包括隐藏字段
    const requestParams: Record<string, any> = {
      gateway_id: selectedGateway.gateway_id,
      currency: selectedCurrency?.currency,
    };

    // 处理所有字段，包括隐藏字段
    Object.entries(requiredFields as RequiredFields).forEach(([key, field]) => {
      // 如果字段是必需的或有值，添加到请求参数
      if (field.required || formValues[key] !== undefined) {
        requestParams[key] = formValues[key];
      }
    });

    // 验证必填字段（仅非隐藏的必填字段需要前端验证）
    const missingFields: string[] = [];

    // 检查所有必填字段（UI显示的）
    Object.entries(requiredFields as RequiredFields).forEach(([key, field]) => {
      if (field.required && !field.hide) {
        const value = formValues[key] || '';

        if (field.type === 'number') {
          if (!value || isNaN(parseFloat(value))) {
            missingFields.push(field.label);
          }
        } else if (!value.trim()) {
          missingFields.push(field.label);
        }
      }
    });

    // 如果有缺失字段，显示错误提示
    if (missingFields.length > 0) {
      toast.error(`${t('toast:pleaseFillInRequiredFields')} ${missingFields.join(', ')}`);
      return;
    }

    try {
      // 调试日志，显示最终请求参数
      console.debug('Creating withdrawal order with params:', requestParams);

      // 调用API创建提款订单
      const result = await createWithdrawOrder(requestParams);
      if (result.code === 0) {
        // 处理成功响应
        toast.success(t('toast:withdrawalRequestSubmittedSuccessfully'));
      } else {
        toast.error(result.msg);
      }
    } catch (error) {
      // 处理错误
      // const errorMessage = error instanceof Error ? error.message : t('toast:failedToSubmitWithdrawalRequest');
      toast.error(t('toast:failedToSubmitWithdrawalRequest'));
      console.error('Withdrawal error:', error);
    }
  };

  // 渲染表单字段
  const renderFormFields = () => {
    if (!selectedGateway || Object.keys(requiredFields).length === 0) {
      return null;
    }

    // 收集表单字段，分别处理amount和其他字段
    const formFields: React.ReactNode[] = [];
    let amountField: React.ReactNode | null = null;

    Object.entries(requiredFields as RequiredFields).forEach(([key, field]) => {
      // 跳过隐藏字段或非必填字段
      if (field.hide || !field.required) {
        return;
      }

      // 处理amount字段，单独存储等待最后渲染
      if (key === 'amount') {
        amountField = (
          <div key={key} className="flex flex-col gap-1">
            <div className="flex items-center justify-between px-1">
              <p className="text-sm">{t(`finance:${field.name}`)}</p>
              <p className="text-xs">
                {formatAmount(selectedGateway?.min)} ~ {formatAmount(selectedGateway?.max)} {selectedCurrency?.currency}
              </p>
            </div>
            <input
              type="text"
              className="input bg-base-200 h-12 w-full border"
              value={formValues[key] || ''}
              onChange={(e) => handleFormValueChange(key, e.target.value)}
            />

            <div className="grid grid-cols-4 gap-2">
              <button
                className={`btn btn-sm ${formValues._amountSelectType === 'min' ? 'border-primary text-primary/80 border' : ''}`}
                onClick={() => handleQuickAmount('min')}
              >
                {t('finance:min')}
              </button>
              <button
                className={`btn btn-sm ${formValues._amountSelectType === '25%' ? 'border-primary text-primary/80 border' : ''}`}
                onClick={() => handleQuickAmount('25%')}
              >
                25%
              </button>
              <button
                className={`btn btn-sm ${formValues._amountSelectType === '50%' ? 'border-primary text-primary/80 border' : ''}`}
                onClick={() => handleQuickAmount('50%')}
              >
                50%
              </button>
              <button
                className={`btn btn-sm ${formValues._amountSelectType === 'max' ? 'border-primary text-primary/80 border' : ''}`}
                onClick={() => handleQuickAmount('max')}
              >
                {t('finance:max')}
              </button>
            </div>
          </div>
        );
        return;
      }

      // 处理bank_name字段，渲染为下拉选择框
      if (field.select && field.select.length > 0) {
        const options = field.select.map((item) => ({
          id: item.value,
          value: item.value,
          label: item.key,
        }));

        formFields.push(
          <div key={key} className="flex flex-col gap-1">
            <p className="px-1 text-sm">{t(`finance:${field.name}`)}</p>
            <SelectDropdown
              className="bg-base-200"
              variant="outlined"
              options={options}
              value={formValues[key] || ''}
              onChange={(value) => handleFormValueChange(key, value as string)}
              placeholder={`${t('finance:select')} ${t(`finance:${field.name}`)}`}
            />
          </div>,
        );
        return;
      }

      // 处理name字段
      if (key === 'name') {
        formFields.push(
          <div key={key} className="flex flex-col gap-1">
            <p className="px-1 text-sm">{t(`finance:${field.name}`)}</p>
            <input
              type="text"
              className="input bg-base-200 h-12 w-full border"
              value={formValues[key] || ''}
              onChange={(e) => handleFormValueChange(key, e.target.value)}
              placeholder={`${t('finance:enter')} ${t(`finance:${field.name}`)}`}
            />
          </div>,
        );
        return;
      }

      // 处理account_number字段
      if (key === 'account_number') {
        formFields.push(
          <div key={key} className="flex flex-col gap-1">
            <p className="px-1 text-sm">{t(`finance:${field.name}`)}</p>
            <input
              type="text"
              className="input bg-base-200 h-12 w-full border"
              value={formValues[key] || ''}
              onChange={(e) => handleFormValueChange(key, e.target.value)}
              placeholder={`${t('finance:enter')} ${t(`finance:${field.name}`)}`}
            />
          </div>,
        );
        return;
      }

      // 对于其他类型的字段，渲染默认的文本输入框
      formFields.push(
        <div key={key} className="flex flex-col gap-1">
          <p className="px-1 text-sm">{t(`finance:${field.name}`)}</p>
          <input
            type={field.type === 'number' ? 'number' : 'text'}
            className="input bg-base-200 h-12 w-full border"
            value={formValues[key] || ''}
            onChange={(e) => handleFormValueChange(key, e.target.value)}
            placeholder={`${t('finance:enter')} ${t(`finance:${field.name}`)}`}
          />
        </div>,
      );
    });

    // 将所有表单字段合并，把amount放在最后
    return (
      <>
        {formFields}
        {amountField}
      </>
    );
  };

  return (
    <div ref={containerRef} className="bg-base-100 flex flex-col gap-3 pb-3">
      {/* <Toaster position="top-center" richColors /> */}

      <div className="grid grid-cols-2 items-center gap-2">
        <div className="flex flex-col">
          <p className="px-1 py-2 text-sm">{t('finance:withdrawalCurrency')}</p>
          <SelectDropdown
            options={
              supportedCurrencies?.map((currency) => ({
                id: `${currency.id}`,
                icon: (
                  <img
                    src={`/icons/flag/${currency.currency.toLowerCase()}.svg`}
                    className="h-4 w-4"
                    alt={currency.currency}
                  />
                ),
                value: currency.currency,
                label: currency.display_name,
              })) ?? []
            }
            value={selectedCurrency?.currency ?? ''}
            onChange={handleCurrencyChange}
            placeholder="Select Currency"
            disabled={isLoadingCurrencies || !supportedCurrencies || supportedCurrencies.length === 0}
          />
        </div>

        <div className="flex flex-col">
          <p className="px-1 py-2 text-sm">{t('finance:withdrawalMethod')}</p>
          <details className="dropdown dropdown-end" ref={dropdownRef}>
            <summary className="btn btn-md flex h-12 w-full items-center justify-between">
              <div />
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
            <div className="dropdown-content bg-base-200 z-10 mt-3 flex w-[calc(100vw-3rem)] flex-col gap-3 rounded-lg p-3 shadow-sm">
              <p className="text-sm font-bold">{t('finance:withdrawalProviders')}</p>
              {isLoadingGateways ? (
                <div className="flex justify-center p-4">
                  <div className="loading loading-spinner loading-md"></div>
                </div>
              ) : gatewaysError ? (
                <div className="flex justify-center p-4">
                  <p className="text-error text-sm">{t('finance:failedToLoadWithdrawalMethods')}</p>
                </div>
              ) : gateways?.length === 0 ? (
                <div className="flex justify-center p-4">
                  <p className="text-warning text-sm">
                    {t('finance:noWithdrawalMethodsAvailableFor', { currency: selectedCurrency?.currency })}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {gateways?.map((gateway, index) => (
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
                        <img src={gateway.icon} className="object-cover p-2" alt={gateway.display_name} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{gateway.display_name}</p>
                        <p className="text-xs">
                          {formatAmount(gateway.min)} ~ {formatAmount(gateway.max)}
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
                disabled={isLoadingGateways || !gateways || gateways.length === 0 || !selectedGateway}
              >
                {t('finance:select')}
              </button>
            </div>
          </details>
        </div>
      </div>

      {/* 动态渲染表单字段 */}
      {renderFormFields()}

      {/* 添加余额显示 */}
      {selectedCurrency && (
        <div className="flex items-center justify-between px-1 py-2 text-sm">
          <p>
            {t('finance:available')}:{' '}
            <span className="font-semibold">
              {getCurrentBalance().available} {selectedCurrency?.currency}
            </span>
          </p>
          <p>
            <u>{t('finance:locked')}</u>:{' '}
            <span className="font-semibold">
              {Math.max(Number(getCurrentBalance().locked), 0)} {selectedCurrency?.currency}
            </span>
          </p>
        </div>
      )}

      <button className="btn btn-primary mt-2 h-12" onClick={handleContinue} disabled={!selectedGateway || !user}>
        {t('finance:continue')}
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
          {t('finance:forSecurityPurposesLargeOrSuspiciousWithdrawalsMayTakeUpTo24HoursToProcess')}
        </p>
      </div>
    </div>
  );
}
