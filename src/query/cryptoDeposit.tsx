import { ICoin } from '@/types/finance';
import { useQuery } from '@tanstack/react-query';
import { getSupportedCryptos, getCryptoDepositAddress } from '@/api/payment';
import { useAuth } from '@/contexts/auth';

interface DepositAddress {
  address: string;
  qrcode?: string;
}

// 获取支持的加密货币列表
export const QuerySupportedCryptos = () => {
  const { user } = useAuth();

  const { data: cryptos = [], isLoading, error, refetch } = useQuery<ICoin[]>({
    queryKey: ['supportedCryptos'],
    queryFn: () => getSupportedCryptos(),
    enabled: !!user, // 只有当用户已登录时才执行查询
    staleTime: 5 * 60 * 1000, // 数据5分钟内不会重新获取
    retry: (failureCount, error: any) => {
      // 对于401错误（未授权）不重试，其他错误最多重试2次
      return error?.response?.status !== 401 && failureCount < 2;
    },
  });

  return {
    cryptos,
    isLoading,
    error,
    refetch
  };
};

// 获取特定网络的加密货币存款地址
export const QueryCryptoDepositAddress = (network: string) => {
  const { user } = useAuth();

  const { data: depositAddress = null, isLoading, error, refetch } = useQuery<DepositAddress>({
    queryKey: ['cryptoDepositAddress', network],
    queryFn: () => getCryptoDepositAddress(network),
    enabled: !!user && !!network, // 只有当用户已登录并且提供了网络参数时才执行查询
    staleTime: 60 * 1000, // 数据1分钟内不会重新获取
    retry: (failureCount, error: any) => {
      // 对于401错误（未授权）不重试，其他错误最多重试2次
      return error?.response?.status !== 401 && failureCount < 2;
    },
  });

  return {
    depositAddress,
    isLoading,
    error,
    refetch
  };
}; 