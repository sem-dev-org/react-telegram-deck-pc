import { useQuery } from '@tanstack/react-query';
import {
  getSupportedFiatDepositGatewayParams,
  getSupportedCurrencies,
  getSupportedFiatDepositGateways,
  getSupportedCryptoDepositGateways,
  getSupportedFiatWithdrawGateways,
  getSupportedFiatWithdrawGatewayParams,
  getSupportedCryptoWithdrawGateways,
  getUserRollover,
  GetUserRolloverParams,
  getUserBalanceExtension,
} from '@/api/finance';
import { ApiBusinessError } from '@/utils/enhancedApiClient';
import { ICryptoGateway, ICurrency, IFiatGateway } from '@/types/finance';
import { useAuth } from '@/contexts/auth';

/**
 * Hook for fetching supported currencies
 *
 * @returns Object containing currencies data and query state
 */
export const useSupportedCurrencies = () => {
  return useQuery<ICurrency[], ApiBusinessError>({
    queryKey: ['supportedCurrencies'],
    queryFn: async () => {
      return getSupportedCurrencies();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry for business logic errors
      if (error instanceof ApiBusinessError) {
        return false;
      }

      // Retry network errors up to 3 times
      return failureCount < 3;
    },
  });
};

export const useSupportedFiatDepositGateways = (currency: string) => {
  return useQuery<IFiatGateway[], ApiBusinessError>({
    queryKey: ['supportedGateways', currency],
    queryFn: async () => {
      return getSupportedFiatDepositGateways(currency);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry for business logic errors
      if (error instanceof ApiBusinessError) {
        return false;
      }

      // Retry network errors up to 3 times
      return failureCount < 3;
    },
  });
};

export const useFiatDepositGatewayParams = (gateway_id: string) => {
  return useQuery<any, ApiBusinessError>({
    queryKey: ['fiatDepositRequiredFields', gateway_id],
    queryFn: async () => {
      return getSupportedFiatDepositGatewayParams(gateway_id);
    },
    enabled: !!gateway_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry for business logic errors
      if (error instanceof ApiBusinessError) {
        return false;
      }

      // Retry network errors up to 3 times
      return failureCount < 3;
    },
  });
};

export const useSupportedCryptoDepositGateways = (currency: string) => {
  const { user } = useAuth();
  return useQuery<ICryptoGateway[], ApiBusinessError>({
    queryKey: ['supportedCryptoDepositGateways', currency],
    queryFn: async () => {
      return getSupportedCryptoDepositGateways(currency);
    },
    enabled: !!currency && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry for business logic errors
      if (error instanceof ApiBusinessError) {
        return false;
      }

      // Retry network errors up to 3 times
      return failureCount < 3;
    },
  });
};

export const useSupportedFiatWithdrawGateways = (currency: string) => {
  const { user } = useAuth();

  return useQuery<IFiatGateway[], ApiBusinessError>({
    queryKey: ['supportedFiatWithdrawGateways', currency],
    queryFn: async () => {
      return getSupportedFiatWithdrawGateways(currency);
    },
    enabled: !!currency && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry for business logic errors
      if (error instanceof ApiBusinessError) {
        return false;
      }

      // Retry network errors up to 3 times
      return failureCount < 3;
    },
  });
};

export const useSupportedCryptoWithdrawGateways = (currency: string) => {
  const { user } = useAuth();
  return useQuery<ICryptoGateway[], ApiBusinessError>({
    queryKey: ['supportedCryptoWithdrawGateways', currency],
    queryFn: async () => {
      return getSupportedCryptoWithdrawGateways(currency);
    },
    enabled: !!currency && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry for business logic errors
      if (error instanceof ApiBusinessError) {
        return false;
      }

      // Retry network errors up to 3 times
      return failureCount < 3;
    },
  });
};
export const useFiatWithdrawGatewayParams = (gateway_id: string) => {
  return useQuery<any, ApiBusinessError>({
    queryKey: ['fiatWithdrawRequiredFields', gateway_id],
    queryFn: async () => {
      return getSupportedFiatWithdrawGatewayParams(gateway_id);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry for business logic errors
      if (error instanceof ApiBusinessError) {
        return false;
      }

      // Retry network errors up to 3 times
      return failureCount < 3;
    },
  });
};

export const useUserRollover = (params: GetUserRolloverParams) => {
  const { user } = useAuth();

  return useQuery<any, ApiBusinessError>({
    queryKey: ['userRollover', params],
    queryFn: async () => {
      return getUserRollover(params);
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry for business logic errors
      if (error instanceof ApiBusinessError) {
        return false;
      }

      // Retry network errors up to 3 times
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching user balance extension
 *
 * @returns Object containing user balance extension data and query state
 */
export const useUserBalanceExtension = () => {
  const { user } = useAuth();

  return useQuery<any, ApiBusinessError>({
    queryKey: ['userBalanceExtension'],
    queryFn: async () => {
      return getUserBalanceExtension();
    },
    enabled: !!user,
  });
};