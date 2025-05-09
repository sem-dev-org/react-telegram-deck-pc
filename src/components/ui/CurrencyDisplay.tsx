import { formatCurrencyBalance, formatNumber } from '@/utils/format';
import { ICurrency } from '@/types/coin';

interface CurrencyDisplayProps {
  /**
   * 货币数据对象
   */
  currency?: ICurrency;
  /**
   * 余额值
   */
  balance?: string | number;
  /**
   * 自定义样式类名
   */
  className?: string;
  /**
   * 是否显示货币符号
   */
  showSymbol?: boolean;
  /**
   * 强制指定display_decimal覆盖currency中的值
   */
  displayDecimal?: number;
  /**
   * 是否使用国际化格式（根据用户语言）
   */
  useLocale?: boolean;
}

/**
 * 通用货币显示组件
 * 根据货币的display_decimal自动格式化余额显示
 */
export const CurrencyDisplay = ({
  currency,
  balance,
  className = '',
  showSymbol = false,
  displayDecimal,
  useLocale = false,
}: CurrencyDisplayProps) => {
  // 如果提供了displayDecimal参数，则使用它，否则使用currency中的display_decimal值或默认值2
  const decimalPlaces = displayDecimal !== undefined 
    ? displayDecimal 
    : currency?.display_decimal !== undefined 
      ? currency.display_decimal 
      : 2;
  
  // 获取要显示的余额，优先使用传入的balance，其次使用currency中的balance
  const displayBalance = balance !== undefined ? balance : currency?.balance;
  
  // 货币符号
  const symbol = currency?.currency || '';
  
  // 根据是否使用国际化格式来选择不同的格式化方法
  const formattedValue = useLocale
    ? formatNumber(displayBalance, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })
    : formatCurrencyBalance(displayBalance, decimalPlaces);
  
  return (
    <span className={className}>
      {formattedValue}
      {showSymbol && symbol && ` ${symbol}`}
    </span>
  );
}; 