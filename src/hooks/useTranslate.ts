import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/language';

/**
 * 自定义翻译 Hook，提供更便捷的翻译功能
 * @returns 翻译相关的工具函数和状态
 */
export const useTranslate = () => {
  const { t, i18n } = useTranslation();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();

  /**
   * 格式化日期
   * @param date 日期对象或日期字符串
   * @param options 日期格式化选项
   * @returns 格式化后的日期字符串
   */
  const formatDate = (
    date: Date | string | number,
    options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  ) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(currentLanguage, options).format(dateObj);
  };

  /**
   * 格式化数字
   * @param number 要格式化的数字
   * @param options 数字格式化选项
   * @returns 格式化后的数字字符串
   */
  const formatNumber = (
    number: number,
    options: Intl.NumberFormatOptions = {
      style: 'decimal',
    }
  ) => {
    return new Intl.NumberFormat(currentLanguage, options).format(number);
  };

  /**
   * 格式化货币
   * @param amount 金额
   * @param currency 货币代码，默认为 USD
   * @returns 格式化后的货币字符串
   */
  const formatCurrency = (amount: number, currency = 'USD') => {
    return formatNumber(amount, {
      style: 'currency',
      currency,
    });
  };

  return {
    t,
    i18n,
    currentLanguage,
    changeLanguage,
    supportedLanguages,
    formatDate,
    formatNumber,
    formatCurrency,
  };
};

export default useTranslate; 