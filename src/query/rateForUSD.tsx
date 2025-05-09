import { configGetByGroup } from '@/api/auth';
import { useAuth } from '@/contexts/auth';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const QueryExchangeRate = () => {
  const { data = { data: {}, code: 0 } } = useQuery({ 
    queryKey: ['exchange_rate'],
    queryFn: () => configGetByGroup({ group: 'exchange_rate' }),
    // refetchOnMount: true,
    // refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000 * 5,
  });
  
  return {
    allRate: data?.code === 0 ? data?.data : {},
  };
};

export const QueryRateForUSD = () => {
  const { user } = useAuth();

  const { allRate } = QueryExchangeRate();

  const rateValue = useMemo(() => {
    if (user?.currency_fiat === 'USD') {
      return allRate['USDT'] || 0;
    }

    if (!user?.currency_fiat || Object.keys(allRate).length === 0) return 0;

    return allRate[user?.currency_fiat] || 0;
  }, [allRate, user?.currency_fiat]);

  return {
    rateForUSD: rateValue,
  };
};
