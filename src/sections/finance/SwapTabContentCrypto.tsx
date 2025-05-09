import { configGetByGroup } from '@/api/auth';
import { createSwapOrder } from '@/api/finance';
import { MoneyInput, SelectDropdown, SelectOption } from '@/components/ui';
import { useAuth } from '@/contexts/auth';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { QueryUserBalance } from '@/query/balance';
import { useSupportedCurrencies, useUserBalanceExtension } from '@/query/finance';
import { Decimal } from 'decimal.js';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const SwapTabContentCrypto = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { getCurrencyInfo } = useCurrencyFormatter();
  const [fromCurrency, setFromCurrency] = useState<string>('');
  const [toCurrency, setToCurrency] = useState<string>('');
  const [fromAmount, setFromAmount] = useState<string>('');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [exceedBalance, setExceedBalance] = useState(false);

  const { data: supportedCurrencies = [] } = useSupportedCurrencies();

  // Get all supported currencies for swap
  const swapFromCurrencies = supportedCurrencies.filter((item) => item.can_swap_from === 1);
  const swapToCurrencies = supportedCurrencies.filter((item) => item.can_swap_to === 1);

  const { userBalance } = QueryUserBalance();
  // 引入余额扩展hook
  const { data: userBalanceExtension = [] } = useUserBalanceExtension();

  // 获取汇率数据
  useEffect(() => {
    setIsLoadingRates(true);
    configGetByGroup({ group: 'exchange_rate' })
      .then((res) => {
        if (res.code === 0) {
          setExchangeRates(res.data);
        }
      })
      .catch((error) => {
        console.error('获取汇率数据失败:', error);
      })
      .finally(() => {
        setIsLoadingRates(false);
      });
  }, []);

  const handleFromCurrencyChange = (value: string | number, _: SelectOption) => {
    setFromCurrency(value as string);
    setFromAmount(''); // 清空金额，避免切换币种后余额检查错误
    setExceedBalance(false);
  };

  const handleToCurrencyChange = (value: string | number, _: SelectOption) => {
    setToCurrency(value as string);
  };

  // 获取当前选择货币的可用余额 (withdraw_able)
  const currentBalance = useMemo(() => {
    if (!fromCurrency || !userBalance.length) return '0';

    const balanceItem = userBalance.find((item) => item.currency === fromCurrency);
    if (!balanceItem) return '0';

    // 获取userBalanceExtension中的withdraw_able
    const extensionBalance = userBalanceExtension.find(
      (b: { currency: string; withdraw_able: string }) => b.currency === fromCurrency
    );
    const withdrawAble = extensionBalance ? new Decimal(extensionBalance.withdraw_able) : new Decimal(-1);
    
    // if withdraw_able < 0 use balance
    if (withdrawAble.lessThan(0)) {
      return balanceItem.balance;
    }

    return withdrawAble.toString();
  }, [fromCurrency, userBalance, userBalanceExtension]);

  // 格式化后的当前选择货币余额（用于显示）
  const formattedCurrentBalance = useMemo(() => {
    if (!fromCurrency) return '0.00';
    
    // 获取货币配置的小数位数
    const currencyInfo = getCurrencyInfo(fromCurrency);
    
    // 使用Decimal处理并保留适当的小数位数
    return new Decimal(currentBalance)
      .toDecimalPlaces(currencyInfo.decimalPlaces, Decimal.ROUND_DOWN)
      .toString();
  }, [currentBalance, fromCurrency, getCurrencyInfo]);

  const handleFromAmountChange = (value: string) => {
    if (!value) {
      setFromAmount('');
      setExceedBalance(false);
      return;
    }

    try {
      // 比较输入金额与余额
      const inputDecimal = new Decimal(value);
      const balanceDecimal = new Decimal(currentBalance);

      if (inputDecimal.greaterThan(balanceDecimal)) {
        setExceedBalance(true);
        // 可选：允许输入但显示错误，或者限制为最大余额
        setFromAmount(value);
      } else {
        setExceedBalance(false);
        setFromAmount(value);
      }
    } catch (error) {
      console.error('金额转换错误:', error);
      setFromAmount(value);
    }
  };

  // 处理MAX按钮点击
  const handleMaxClick = () => {
    if (!fromCurrency) return;
    
    // 获取货币配置的小数位数
    const currencyInfo = getCurrencyInfo(fromCurrency);
    
    // 使用Decimal处理并保留适当的小数位数
    const formattedAmount = new Decimal(currentBalance)
      .toDecimalPlaces(currencyInfo.decimalPlaces, Decimal.ROUND_DOWN)
      .toString();
    
    setFromAmount(formattedAmount);
    setExceedBalance(false);
  };

  // From options - show all currencies user has a balance for (that can be swapped from)
  const fromOptions = useMemo(() => {
    // Filter user balances to show only currencies they have that can be swapped from
    return userBalance
      .filter((item) => {
        const currency = swapFromCurrencies.find((curr) => curr.currency === item.currency);
        // 获取对应的扩展余额
        const extensionBalance = userBalanceExtension.find(
          (b: { currency: string; withdraw_able: string }) => b.currency === item.currency
        );
        const withdrawAble = extensionBalance 
          ? new Decimal(extensionBalance.withdraw_able) 
          : new Decimal(item.withdraw_able);
        
        return currency && (withdrawAble.greaterThan(0) || new Decimal(item.balance).greaterThan(0));
      })
      .map((item) => ({
        id: item.currency,
        value: item.currency,
        label: item.currency,
        disabled: item.currency.toLowerCase() === toCurrency?.toLowerCase(),
        icon: (
          <img
            src={supportedCurrencies.find((curr) => curr.currency === item.currency)?.icon ?? ''}
            className="h-4 w-4"
            alt={item.currency}
          />
        ),
      }));
  }, [userBalance, userBalanceExtension, swapFromCurrencies, toCurrency, supportedCurrencies]);

  // To options - show all supported currencies that can be swapped to
  const toOptions = useMemo(() => {
    return swapToCurrencies.map((item) => ({
      id: item.currency,
      value: item.currency,
      label: item.currency,
      disabled: item.currency.toLowerCase() === fromCurrency?.toLowerCase(),
      icon: <img src={item.icon ?? ''} className="h-4 w-4" alt={item.currency} />,
    }));
  }, [swapToCurrencies, fromCurrency]);

  // 获取交换费率 - 取fromCurrency和toCurrency中较高的费率
  const swapFeeRate = useMemo(() => {
    if (!fromCurrency || !toCurrency) return 0;

    const fromCurrencyData = supportedCurrencies.find(curr => curr.currency === fromCurrency);
    const toCurrencyData = supportedCurrencies.find(curr => curr.currency === toCurrency);

    if (!fromCurrencyData || !toCurrencyData) return 0;

    const fromFeeRate = fromCurrencyData.swap_fee_rate ? parseFloat(fromCurrencyData.swap_fee_rate) : 0;
    const toFeeRate = toCurrencyData.swap_fee_rate ? parseFloat(toCurrencyData.swap_fee_rate) : 0;

    // 取两个费率中较高的一个
    return Math.max(fromFeeRate, toFeeRate);
  }, [fromCurrency, toCurrency, supportedCurrencies]);

  // 计算法币价值
  const fiatValue = useMemo(() => {
    if (!fromAmount || !fromCurrency || !user?.currency_fiat || Object.keys(exchangeRates).length === 0) {
      return '0';
    }

    try {
      // 获取选中加密货币对USD的汇率
      const cryptoRate = exchangeRates[fromCurrency] || 0;

      // 获取用户法币对USD的汇率
      const fiatRate = exchangeRates[user.currency_fiat] || 0;

      if (!cryptoRate || !fiatRate) {
        return '0';
      }

      // 计算: 加密货币金额 * 加密货币汇率 / 法币汇率
      const result = new Decimal(fromAmount || '0')
        .mul(cryptoRate)
        .div(fiatRate)
        .toDecimalPlaces(2, Decimal.ROUND_DOWN);

      return result.toString();
    } catch (error) {
      console.error('计算法币价值时出错:', error);
      return '0';
    }
  }, [fromAmount, fromCurrency, exchangeRates, user?.currency_fiat]);

  // 计算汇率比率
  const exchangeRate = useMemo(() => {
    if (!fromCurrency || !toCurrency || Object.keys(exchangeRates).length === 0) {
      return '0';
    }

    const fromRate = exchangeRates[fromCurrency] || 0;
    const toRate = exchangeRates[toCurrency] || 0;

    if (!fromRate || !toRate) {
      return '0';
    }

    // 计算: 1个from货币等于多少to货币
    const rate = new Decimal(fromRate).div(toRate).toDecimalPlaces(6, Decimal.ROUND_DOWN);
    return rate.toString();
  }, [fromCurrency, toCurrency, exchangeRates]);

  // 格式化后的汇率
  const formattedExchangeRate = useMemo(() => {
    if (!toCurrency || exchangeRate === '0') return '0';
    
    // 获取目标货币配置的小数位数
    const currencyInfo = getCurrencyInfo(toCurrency);
    
    // 使用Decimal处理并保留适当的小数位数
    return new Decimal(exchangeRate)
      .toDecimalPlaces(currencyInfo.decimalPlaces, Decimal.ROUND_DOWN)
      .toString();
  }, [exchangeRate, toCurrency, getCurrencyInfo]);

  // 计算转换后的目标货币金额 (包含费率)
  const toAmount = useMemo(() => {
    if (!fromAmount || !toCurrency || exchangeRate === '0') return '';
    
    // 获取目标货币配置的小数位数
    const currencyInfo = getCurrencyInfo(toCurrency);
    
    try {
      // 1. 计算原始转换金额
      const convertedAmount = new Decimal(fromAmount).mul(exchangeRate);
      
      // 2. 计算手续费金额
      const feeAmount = convertedAmount.mul(swapFeeRate);
      
      // 3. 减去手续费得到最终金额
      const finalAmount = convertedAmount.minus(feeAmount);
      
      // 确保金额不小于0并且保留适当的小数位数
      return finalAmount.isNegative() 
        ? '0' 
        : finalAmount.toDecimalPlaces(currencyInfo.decimalPlaces, Decimal.ROUND_DOWN).toString();
    } catch (error) {
      console.error('计算转换金额时出错:', error);
      return '0';
    }
  }, [fromAmount, exchangeRate, toCurrency, getCurrencyInfo, swapFeeRate]);

  // 计算手续费金额 (用于显示)
  // const feeAmount = useMemo(() => {
  //   if (!fromAmount || !toCurrency || exchangeRate === '0' || swapFeeRate === 0) return '0';
    
  //   try {
  //     // 计算原始转换金额
  //     const convertedAmount = new Decimal(fromAmount).mul(exchangeRate);
      
  //     // 计算手续费金额
  //     const feeAmount = convertedAmount.mul(swapFeeRate);
      
  //     // 获取目标货币配置的小数位数
  //     const currencyInfo = getCurrencyInfo(toCurrency);
      
  //     // 格式化手续费金额
  //     return feeAmount.toDecimalPlaces(currencyInfo.decimalPlaces, Decimal.ROUND_DOWN).toString();
  //   } catch (error) {
  //     console.error('计算手续费时出错:', error);
  //     return '0';
  //   }
  // }, [fromAmount, exchangeRate, toCurrency, getCurrencyInfo, swapFeeRate]);

  // 格式化显示的费率百分比
  // const formattedFeeRate = useMemo(() => {
  //   return (swapFeeRate * 100).toFixed(2);
  // }, [swapFeeRate]);

  useEffect(() => {
    if (!fromOptions.length || fromCurrency) {
      return;
    }

    // Set initial from currency
    if (fromOptions.length > 0) {
      setFromCurrency(fromOptions[0].value);
    }

    // Set initial to currency
    if (toOptions.length > 0 && !toCurrency) {
      const firstValidOption = toOptions.find((option) => !option.disabled);
      if (firstValidOption) {
        setToCurrency(firstValidOption.value);
      } else if (toOptions.length > 1) {
        setToCurrency(toOptions[1].value);
      }
    }
  }, [fromOptions, toOptions, fromCurrency, toCurrency]);

  const handleCreateSwapOrder = async () => {
    if (exceedBalance) {
      toast.error(`${t('toast:insufficientBalance')} ${formattedCurrentBalance} ${fromCurrency}`);
      return;
    }

    try {
      await createSwapOrder({
        from_currency: fromCurrency,
        to_currency: toCurrency,
        from_amount: fromAmount,
      });

      toast.success(t('toast:swapOrderCreatedSuccessfully'));
      setFromAmount(''); // 成功提交后清空输入
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-base-100 flex flex-col gap-3 py-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-end justify-between px-1 py-2">
          <p className="text-sm">{t('finance:from')}</p>
          <div className="flex flex-col items-end">
            {fromAmount ? (
              <p className="text-xs">
                ≈ {fiatValue} {user?.currency_fiat}
                {isLoadingRates && <span className="ml-1 animate-pulse">...</span>}
              </p>
            ) : (
              <p className="text-xs">
                ≈ 0 {user?.currency_fiat}
                {isLoadingRates && <span className="ml-1 animate-pulse">...</span>}
              </p>
            )}
            <p className="text-base-content/60 text-xs">
              {t('finance:available')}: {formattedCurrentBalance} {fromCurrency}
            </p>
          </div>
        </div>

        <MoneyInput
          className={`bg-base-300 h-18 ${exceedBalance ? 'input-error' : ''}`}
          value={fromAmount}
          onChange={handleFromAmountChange}
          suffix={
            <div className="mr-2 flex items-center gap-2">
              <button
                className="btn btn-ghost btn-xs text-base-content text-sm"
                onClick={handleMaxClick}
                disabled={!fromCurrency || currentBalance === '0'}
              >
                <p>{t('finance:max').toUpperCase()}</p>
              </button>
              <SelectDropdown
                className="min-w-[120px]"
                height="h10"
                options={fromOptions}
                value={fromCurrency}
                onChange={handleFromCurrencyChange}
                buttonClassName="bg-neutral text-neutral-content"
              />
            </div>
          }
          placeholder="0.00"
        />

        {exceedBalance && (
          <p className="text-error mt-1 px-2 text-xs">
            {t('toast:insufficientBalance')} {formattedCurrentBalance} {fromCurrency} 
          </p>
        )}

        <div className="relative flex w-full items-center justify-between gap-6 px-1 py-2">
          <p className="text-sm">{t('finance:to')}</p>
          <div className="flex w-full flex-col px-1">
            <div className="divider absolute left-1/2 my-0 w-60 -translate-x-1/2 -translate-y-1/2 py-0">
              <svg
                className="min-w-8"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5 8L8.5 5L5.5 8"
                  stroke="#2A323C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 19L8.5 5"
                  stroke="#2A323C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.5 16L16.5 19L19.5 16"
                  stroke="#2A323C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.5 5L16.5 19"
                  stroke="#2A323C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <p className="block" />
        </div>

        <MoneyInput
          className="bg-base-300 h-18"
          value={toAmount}
          suffix={
            <div className="mr-2">
              <SelectDropdown
                className="min-w-[120px]"
                height="h10"
                options={toOptions}
                value={toCurrency}
                onChange={handleToCurrencyChange}
                buttonClassName="bg-neutral text-neutral-content"
              />
            </div>
          }
          placeholder="0.00"
          // disabled
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex h-5 items-center justify-between px-2">
          <p className="text-sm">{t('finance:rate')}</p>
          <p className="text-sm font-bold">
            1 {fromCurrency} ≈ {formattedExchangeRate} {toCurrency}
            {isLoadingRates && <span className="ml-1 animate-pulse">...</span>}
          </p>
        </div>
        
        {/* {swapFeeRate > 0 && (
          <div className="flex h-5 items-center justify-between px-2">
            <p className="text-sm">Fee ({formattedFeeRate}%)</p>
            <p className="text-sm">
              {feeAmount} {toCurrency}
            </p>
          </div>
        )} */}
      </div>

      <button
        className="btn btn-primary h-12"
        disabled={
          !fromAmount || parseFloat(fromAmount) <= 0 || !fromCurrency || !toCurrency || isLoadingRates || exceedBalance
        }
        onClick={handleCreateSwapOrder}
      >
        {t('finance:swap')}
      </button>
    </div>
  );
};
