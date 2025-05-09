/**
 * 根据货币的display_decimal格式化金额
 * @param value 要格式化的金额
 * @param displayDecimal 要显示的小数位数
 * @returns 格式化后的金额字符串
 */
export const formatCurrencyBalance = (value: string | number | undefined | null, displayDecimal: number = 2): string => {
  // 如果值为空，返回默认值
  if (value === undefined || value === null) return '0.00';
  
  // 将value转换为数字
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // 检查是否为有效数字
  if (isNaN(numValue)) return '0.00';
  
  // 使用toFixed格式化小数位数
  return numValue.toFixed(displayDecimal);
};

import i18n from '@/i18n';

/**
 * 根据当前语言环境格式化数字
 * @param value 要格式化的数字
 * @param options 格式化选项
 * @returns 格式化后的数字字符串
 */
export const formatNumber = (
  value: number | string | undefined | null,
  options: Intl.NumberFormatOptions = {}
): string => {
  if (value === undefined || value === null) return '0';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0';
  
  // 获取当前语言
  const currentLanguage = i18n.language || 'en';
  
  // 特定语言的格式化逻辑
  try {
    return new Intl.NumberFormat(currentLanguage, options).format(numValue);
  } catch (error) {
    console.error('Error formatting number:', error);
    return numValue.toString();
  }
};

/**
 * 根据货币和语言格式化货币金额
 * @param value 要格式化的金额
 * @param currencyCode 货币代码（如 USD, EUR）
 * @param displayDecimal 小数位数
 * @returns 格式化后的货币金额字符串
 */
export const formatCurrency = (
  value: number | string | undefined | null,
  currencyCode: string = 'USD',
  displayDecimal: number = 2
): string => {
  if (value === undefined || value === null) return '0';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0';
  
  // 获取当前语言
  const currentLanguage = i18n.language || 'en';
  
  // 特定语言的货币格式化
  try {
    return new Intl.NumberFormat(currentLanguage, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: displayDecimal,
      maximumFractionDigits: displayDecimal,
    }).format(numValue);
  } catch (error) {
    console.error('Error formatting currency:', error);
    // 回退到简单格式
    return `${currencyCode} ${numValue.toFixed(displayDecimal)}`;
  }
}; 