import { useAuth } from '@/contexts/auth';
import { useSupportedCurrencies } from '@/query/finance';
import { QueryExchangeRate } from '@/query/rateForUSD';
import { useSettingStore } from '@/store/setting';
import getSymbolFromCurrency from 'currency-symbol-map';
import { Decimal } from 'decimal.js';
import { useMemo } from 'react';

interface FormatOptions {
  includeSymbol?: boolean;
  fallbackSymbol?: string;
  showPlus?: boolean;
  useThousandsSeparator?: boolean;
  useCompactFormat?: boolean;
  decimalPoint?: number;
}

interface CryptoFormatOptions {
  includeSymbol?: boolean;
  showPlus?: boolean;
  useThousandsSeparator?: boolean;
  useCompactFormat?: boolean;
  decimalPoint?: number;
}

interface ConvertOptions extends FormatOptions {
  sourceCurrency: string;
  targetCurrency: string;
  decimalPoint?: number;
  numberAmount?: boolean;
}

interface CryptoConvertOptions extends CryptoFormatOptions {
  sourceCurrency: string;
  targetCurrency: string;
}

// 常见货币的区域设置映射
const CURRENCY_LOCALE_MAP: Record<string, string> = {
  USD: 'en-US', // 美元
  EUR: 'de-DE', // 欧元
  GBP: 'en-GB', // 英镑
  JPY: 'ja-JP', // 日元
  CNY: 'zh-CN', // 人民币
  AUD: 'en-AU', // 澳元
  CAD: 'en-CA', // 加元
  INR: 'en-IN', // 印度卢比
  RUB: 'ru-RU', // 卢布
  BRL: 'pt-BR', // 巴西雷亚尔
  KRW: 'ko-KR', // 韩元
  PHP: 'fil-PH', // 菲律宾比索
  THB: 'th-TH', // 泰铢
  IDR: 'id-ID', // 印尼卢比
  MYR: 'ms-MY', // 马来西亚林吉特
  VND: 'vi-VN', // 越南盾
  AED: 'ar-AE', // 阿联酋迪拉姆
  ARS: 'es-AR', // 阿根廷比索
  BDT: 'bn-BD', // 孟加拉塔卡
  CHF: 'de-CH', // 瑞士法郎
  EGP: 'ar-EG', // 埃及镑
  HKD: 'zh-HK', // 港币
  MNT: 'mn-MN', // 蒙古图格里克
  MXN: 'es-MX', // 墨西哥比索
  NZD: 'en-NZ', // 新西兰元
  TRY: 'tr-TR', // 土耳其里拉
};

// 获取货币的本地化格式化器
const getNumberFormatter = (
  currencyCode: string,
  decimals: number,
  options: {
    useCompactFormat?: boolean;
    useThousandsSeparator?: boolean;
    trimTrailingZeros?: boolean;
  } = {},
): Intl.NumberFormat => {
  const { 
    useCompactFormat = false, 
    useThousandsSeparator = true,
    trimTrailingZeros = true,
  } = options;
  const localeCode = CURRENCY_LOCALE_MAP[currencyCode] || 'en-US';

  return new Intl.NumberFormat(localeCode, {
    style: 'decimal',
    minimumFractionDigits: useCompactFormat ? 0 : (trimTrailingZeros ? 0 : (decimals > 0 ? decimals : 0)),
    maximumFractionDigits: useCompactFormat ? 1 : decimals,
    useGrouping: useThousandsSeparator,
    notation: useCompactFormat && new Decimal(1000).lte(1000) ? 'compact' : 'standard',
    compactDisplay: 'short',
  });
};

export const useCurrencyFormatter = () => {
  const { user } = useAuth();
  const { allRate } = QueryExchangeRate();
  const { data: currencies } = useSupportedCurrencies();
  const { displayInFiat } = useSettingStore();

  // Get the current user's selected currency
  const currentCurrency = useMemo(() => {
    if (!currencies || !user?.currency_fiat) return null;
    const found = currencies.find((c) => c.currency === user.currency_fiat);
    return found || null;
  }, [currencies, user?.currency_fiat]);

  // Get exchange rate for conversion
  const exchangeRate = useMemo(() => {
    if (!user?.currency_fiat || Object.keys(allRate).length === 0) return 0;
    return allRate[user?.currency_fiat] || 0;
  }, [allRate, user?.currency_fiat]);

  // Get currency symbol
  const currencySymbol = useMemo(() => {
    if (!user?.currency_fiat) return '$';
    return getSymbolFromCurrency(user.currency_fiat) || '$';
  }, [user?.currency_fiat]);

  // Get appropriate decimal places with safety checks
  const decimalPlaces = useMemo(() => {
    if (currentCurrency && typeof currentCurrency.display_decimal === 'number') {
      return currentCurrency.display_decimal;
    }
    return 2;
  }, [currentCurrency]);

  // Function to get currency info by code
  const getCurrencyByCode = (currencyCode: string) => {
    if (!currencies) return null;
    return currencies.find((c) => c.currency === currencyCode) || null;
  };

  const formatCurrency = (amountInUSD: number | string | undefined, options: FormatOptions = {}) => {
    // 如果displayInFiat为false，则使用USDT作为目标货币
    if (!displayInFiat) {
      return formatCryptoCurrency(amountInUSD, 'USDT', {
        includeSymbol: options.includeSymbol,
        showPlus: options.showPlus,
        useThousandsSeparator: options.useThousandsSeparator,
        useCompactFormat: options.useCompactFormat,
        decimalPoint: options.decimalPoint,
      }); 
    }

    const {
      includeSymbol = true,
      fallbackSymbol = '$',
      showPlus = false,
      useThousandsSeparator = true,
      useCompactFormat = false,
    } = options;

    // 处理未定义或空值
    if (amountInUSD === undefined || amountInUSD === '') {
      return includeSymbol ? `${currencySymbol || fallbackSymbol}0` : '0';
    }

    // 解析金额为Decimal对象
    const decAmount = new Decimal(amountInUSD);

    // 如果是零值，直接返回0
    if (decAmount.isZero()) {
      return includeSymbol ? `${currencySymbol || fallbackSymbol}0` : '0';
    }

    // 转换USD金额为用户选择的货币
    const convertedAmount = exchangeRate > 0 ? decAmount.div(new Decimal(exchangeRate)) : decAmount;

    // 获取当前使用的货币代码
    const currencyCode = user?.currency_fiat || 'USD';

    // 获取数字格式化器
    const formatter = getNumberFormatter(currencyCode, decimalPlaces, {
      useCompactFormat,
      useThousandsSeparator,
      trimTrailingZeros: true,
    });
    
    // 格式化金额
    const formattedAmount = options.decimalPoint ? convertedAmount.toFixed(options.decimalPoint) : formatter.format(Math.abs(convertedAmount.toNumber()));

    // 确定前缀 - 负数、需要显示加号的正数，或者无前缀
    let prefix = '';
    if (convertedAmount.isNegative()) {
      prefix = '-';
    } else if (showPlus && convertedAmount.greaterThan(0)) {
      prefix = '+';
    }

    // 返回带或不带符号的格式
    return includeSymbol
      ? `${prefix}${currencySymbol || fallbackSymbol}${formattedAmount}`
      : `${prefix}${formattedAmount}`;
  };

  const formatCryptoCurrency = (
    amount: number | string | undefined,
    currencyCode: string,
    options: CryptoFormatOptions = {},
  ) => {
    const { includeSymbol = true, showPlus = false, useThousandsSeparator = true, useCompactFormat = false, decimalPoint  } = options;

    // 处理未定义或空值
    if (amount === undefined || amount === '') {
      // 特殊处理USDT的显示
      if (currencyCode === 'USDT' && includeSymbol) {
        return '$0';
      }
      return includeSymbol ? `0 ${currencyCode}` : '0';
    }

    // 解析金额为Decimal对象
    const decAmount = new Decimal(amount);

    // 如果是零值，直接返回0
    if (decAmount.isZero()) {
      if (currencyCode === 'USDT' && includeSymbol) {
        return '$0';
      }
      return includeSymbol ? `0 ${currencyCode}` : '0';
    }

    // 获取货币信息，以确定显示的小数位数
    const currencyInfo = getCurrencyByCode(currencyCode);
    const displayDecimals = decimalPoint || currencyInfo?.display_decimal || 8; // 加密货币默认使用8位小数

    // 获取数字格式化器
    const formatter = getNumberFormatter(
      currencyCode === 'USDT' ? 'USD' : 'USD', // 加密货币使用美国区域设置
      displayDecimals,
      { useCompactFormat, useThousandsSeparator },
    );

    // 格式化金额
    const formattedAmount = formatter.format(Math.abs(decAmount.toNumber()));

    // 确定前缀 - 负数、需要显示加号的正数，或者无前缀
    let prefix = '';
    if (decAmount.isNegative()) {
      prefix = '-';
    } else if (showPlus && decAmount.greaterThan(0)) {
      prefix = '+';
    }

    // 特殊处理USDT - 使用$符号在前面，类似于美元格式
    if (currencyCode === 'USDT' && includeSymbol) {
      return `${prefix}$${formattedAmount}`;
    }

    // 返回格式化后的金额，加密货币的格式是 "amount symbol"
    return includeSymbol ? `${prefix}${formattedAmount} ${currencyCode}` : `${prefix}${formattedAmount}`;
  };

  // Function to convert amount to USD
  const convertToUSD = (amount: number | string, fromCurrency: string): number => {
    if (!allRate || !Object.keys(allRate).length) return 0;

    const decAmount = new Decimal(amount);
    const rate = allRate[fromCurrency];

    if (!rate) return decAmount.toNumber();
    return decAmount.mul(new Decimal(rate)).toNumber();
  };

  const convertCurrency = (amount: number | string | undefined, options: ConvertOptions): string | number => {
    const {
      sourceCurrency,
      targetCurrency,
      includeSymbol = true,
      fallbackSymbol = '$',
      showPlus = false,
      useThousandsSeparator = true,
      useCompactFormat = false,
      decimalPoint = 2,
      numberAmount = false,
    } = options;

    // 处理未定义或空值
    if (amount === undefined || amount === '') {
      // 特殊处理USDT
      if (targetCurrency === 'USDT' && includeSymbol) {
        return '$0';
      }

      const symbol = includeSymbol ? getSymbolFromCurrency(targetCurrency) || fallbackSymbol : '';
      return `${symbol}0`;
    }

    // 获取目标货币的信息以确定其类型
    const targetCurrencyInfo = getCurrencyByCode(targetCurrency);

    // 如果目标货币是加密货币，使用加密货币格式化
    if (targetCurrencyInfo?.currency_type === 'CRYPTO') {
      // 解析金额为Decimal对象
      const decAmount = new Decimal(amount);

      // 如果没有汇率信息，直接返回原值
      if (!allRate || !Object.keys(allRate).length) {
        return formatCryptoCurrency(decAmount.toNumber(), targetCurrency, {
          includeSymbol,
          showPlus,
          useThousandsSeparator,
          useCompactFormat,
        });
      }

      // 获取源货币和目标货币的汇率（相对于美元）
      const sourceRate = allRate[sourceCurrency] || 1; // 如果找不到汇率，默认为1
      const targetRate = allRate[targetCurrency] || 1; // 如果找不到汇率，默认为1

      // 先将源货币转为美元，然后转为目标货币
      const amountInUSD = decAmount.mul(new Decimal(sourceRate));
      const convertedAmount = new Decimal(targetRate).gt(0) ? amountInUSD.div(new Decimal(targetRate)) : amountInUSD;

      // 使用加密货币格式化函数
      return formatCryptoCurrency(convertedAmount.toNumber(), targetCurrency, {
        includeSymbol,
        showPlus,
        useThousandsSeparator,
        useCompactFormat,
      });
    }

    // 解析金额为Decimal对象
    const decAmount = new Decimal(amount);

    // 如果没有汇率信息，直接返回原值
    if (!allRate || !Object.keys(allRate).length) {
      const symbol = includeSymbol ? getSymbolFromCurrency(targetCurrency) || fallbackSymbol : '';
      return `${symbol}${decAmount.toFixed(decimalPoint)}`;
    }

    // 获取源货币和目标货币的汇率（相对于美元）
    const sourceRate = allRate[sourceCurrency] || 1;
    const targetRate = allRate[targetCurrency] || 1;

    // 先将源货币转为美元，然后转为目标货币
    const amountInUSD = decAmount.mul(new Decimal(sourceRate));
    const convertedAmount = new Decimal(targetRate).gt(0) ? amountInUSD.div(new Decimal(targetRate)) : amountInUSD;

    // 如果转换后的金额为0或接近0，直接返回0
    if (convertedAmount.abs().lt(new Decimal('0.000001'))) {
      return includeSymbol ? `${getSymbolFromCurrency(targetCurrency) || fallbackSymbol}0` : '0';
    }

    // 获取目标货币的小数位数
    const currencyInfo = currencies?.find((c) => c.currency === targetCurrency);
    const targetDecimalPlaces = currencyInfo?.display_decimal ?? decimalPoint;

    // 获取数字格式化器
    const formatter = getNumberFormatter(targetCurrency, targetDecimalPlaces, {
      useCompactFormat,
      useThousandsSeparator,
    });

    // 格式化金额
    const formattedAmount = formatter.format(Math.abs(convertedAmount.toNumber()));
 
    // 确定前缀 - 负数、需要显示加号的正数，或者无前缀
    let prefix = '';
    if (convertedAmount.isNegative()) {
      prefix = '-';
    } else if (showPlus && convertedAmount.gt(0)) {
      prefix = '+';
    }

    // 获取目标货币符号
    const targetSymbol = getSymbolFromCurrency(targetCurrency) || fallbackSymbol;

    if ( numberAmount && !includeSymbol ) {
      return convertedAmount.toDecimalPlaces(decimalPoint, Decimal.ROUND_DOWN).toFixed(decimalPoint);
    }
    
    if ( numberAmount && includeSymbol ) {
      const formattedAmount = convertedAmount.toDecimalPlaces(decimalPoint, Decimal.ROUND_DOWN).toFixed(decimalPoint);
      return `${targetSymbol} ${formattedAmount}`;
    }

    // 返回格式化后的金额，确保负号在货币符号前面
    return includeSymbol ? `${prefix}${targetSymbol} ${formattedAmount}` : `${prefix}${formattedAmount}`;
  };

  const convertCryptoCurrency = (amount: number | string | undefined, options: CryptoConvertOptions): string => {
    const {
      sourceCurrency,
      targetCurrency,
      includeSymbol = true,
      showPlus = false,
      useThousandsSeparator = true,
      useCompactFormat = false,
    } = options;

    // 处理未定义或空值
    if (amount === undefined || amount === '') {
      // 特殊处理USDT
      if (targetCurrency === 'USDT' && includeSymbol) {
        return '$0';
      }
      return includeSymbol ? `0 ${targetCurrency}` : '0';
    }

    // 解析金额为Decimal对象
    const decAmount = new Decimal(amount);

    // 如果没有汇率信息，直接返回原值
    if (!allRate || !Object.keys(allRate).length) {
      return formatCryptoCurrency(decAmount.toNumber(), targetCurrency, {
        includeSymbol,
        showPlus,
        useThousandsSeparator,
        useCompactFormat,
      });
    }

    // 获取源货币和目标货币的汇率（相对于美元）
    const sourceRate = allRate[sourceCurrency] || 1;
    const targetRate = allRate[targetCurrency] || 1;

    // 先将源货币转为美元，然后转为目标货币
    const amountInUSD = decAmount.mul(new Decimal(sourceRate));
    const convertedAmount = new Decimal(targetRate).gt(0) ? amountInUSD.div(new Decimal(targetRate)) : amountInUSD;

    // 如果转换后的金额为0或接近0，直接返回0
    if (convertedAmount.abs().lt(new Decimal('0.000001'))) {
      // 特殊处理USDT
      if (targetCurrency === 'USDT' && includeSymbol) {
        return '$0';
      }
      return includeSymbol ? `0 ${targetCurrency}` : '0';
    }

    // 使用加密货币格式化函数
    return formatCryptoCurrency(convertedAmount.toNumber(), targetCurrency, {
      includeSymbol,
      showPlus,
      useThousandsSeparator,
      useCompactFormat,
    });
  };

  // Function to get currency display information
  const getCurrencyInfo = (
    currencyCode: string,
  ): {
    symbol: string;
    decimalPlaces: number;
    displayName: string;
    isCrypto: boolean;
  } => {
    if (!currencies) {
      return {
        symbol: getSymbolFromCurrency(currencyCode) || '$',
        decimalPlaces: 2,
        displayName: currencyCode,
        isCrypto: false,
      };
    }

    const currencyInfo = currencies.find((c) => c.currency === currencyCode);
    const isCrypto = currencyInfo?.currency_type === 'CRYPTO';

    return {
      symbol: isCrypto ? currencyCode : getSymbolFromCurrency(currencyCode) || '$',
      decimalPlaces:
        typeof currencyInfo?.display_decimal === 'number' ? currencyInfo.display_decimal : isCrypto ? 8 : 2,
      displayName: currencyInfo?.display_name || currencyCode,
      isCrypto,
    };
  };

  return {
    formatCurrency,
    formatCryptoCurrency,
    convertToUSD,
    convertCurrency,
    convertCryptoCurrency,
    getCurrencyInfo,
    currentCurrency: user?.currency_fiat,
    exchangeRate,
    currencySymbol,
  };
};
