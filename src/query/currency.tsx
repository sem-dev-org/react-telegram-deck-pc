import { getCurrency } from '@/api/payment';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth';
import { ICurrency } from '@/types/coin';
import { useMemo } from 'react';
import { QueryUserBalance } from '@/query/balance';

export const QueryCurrencyWithBalance = () => {
  const { data: currency } = QueryCurrency();
  const { userBalance } = QueryUserBalance();

  const balanceMap = useMemo(() => {
    if (!userBalance) return {};
    return Object.fromEntries(userBalance.map((item) => [item.currency, item.balance])); 
  }, [userBalance]);

  const currencyWithBalanceOptions = useMemo<ICurrency[]>(() => {
    if (!currency) return [];

    return [...currency]
      .map((group) => ({
        ...group,
        balance: balanceMap[group.currency] || '0',
      }))
      .sort((a, b) => {
        const balanceA = parseFloat(a.balance || '0');
        const balanceB = parseFloat(b.balance || '0');

        // First sort by whether balance is positive
        if (balanceA > 0 && balanceB <= 0) return -1;
        if (balanceA <= 0 && balanceB > 0) return 1;

        // Then by balance amount if both positive
        if (balanceA > 0 && balanceB > 0) return balanceB - balanceA;

        return 0;
      });
  }, [currency, balanceMap]);

  return {
    data: currencyWithBalanceOptions,
  };
};

export const QueryCurrency = (currencyStr?: string) => {
  const { user } = useAuth();
  const { data: currency = { data: [], code: 0 }, isLoading } = useQuery<{ data: ICurrency[], code: number }>({
    queryKey: ['currency'],
    queryFn: getCurrency,
    enabled: !!user,
  });

  const displayDecimal = useMemo(() => {
    if (!currency?.data) return undefined;
    return currency.data.find(item => item.currency === currencyStr)?.display_decimal;
  }, [currency?.data, currencyStr]);

  const image = useMemo(() => {
    if (!currency?.data) return undefined;
    return currency.data.find(item => item.currency === currencyStr)?.icon;
  }, [currency?.data, currencyStr]);

  return {
    data: currency.code === 0 ? currency?.data : [],
    displayDecimal: displayDecimal ?? 6,
    image,
    isLoading,
  };
};


