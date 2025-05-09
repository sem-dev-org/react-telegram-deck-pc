import { getCryptoWithdrawAddress, getSupportedCryptos } from '@/api/payment';
import { useAuth } from '@/contexts/auth';
import { ICoin } from '@/types/finance';
import { useQuery } from '@tanstack/react-query';

// 获取支持的加密货币列表
export const QuerySupportedCryptos = () => {
  const { user } = useAuth();

  const {
    data: cryptos = [],
    isLoading,
    error,
    refetch,
  } = useQuery<ICoin[]>({
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
    refetch,
  };
};

// 定义加密货币提款地址接口
export interface CryptoWithdrawAddress {
  id: string;
  user_id: string;
  name?: string; // 设为可选
  coin?: string; // 设为可选
  network: string;
  address: string;
  created_at: number;
  updated_at: number;
}

// 获取用户已添加的加密货币提款地址
export const QueryCryptoWithdrawAddresses = (network?: string) => {
  const { user } = useAuth();

  const {
    data: rawWithdrawAddresses,
    isLoading,
    error,
    refetch,
  } = useQuery<CryptoWithdrawAddress[] | null>({
    queryKey: ['cryptoWithdrawAddresses', network],
    queryFn: () => getCryptoWithdrawAddress(network),
    enabled: !!user && !!network, // 只有当用户已登录时才执行查询
    staleTime: 2 * 60 * 1000, // 数据2分钟内不会重新获取
    retry: (failureCount, error: any) => {
      // 对于401错误（未授权）不重试，其他错误最多重试2次
      return error?.response?.status !== 401 && failureCount < 2;
    },
  });

  // 确保始终返回数组，即使 API 返回 null
  const withdrawAddresses = rawWithdrawAddresses || [];

  return {
    withdrawAddresses,
    isLoading,
    error,
    refetch,
  };
};
