import { useQuery } from '@tanstack/react-query';
import { getSupportedWithdrawGateways, getWithdrawGatewayRequiredFields } from '@/api/payment';
import { useAuth } from '@/contexts/auth';

// 定义支付网关类型接口
export interface PaymentGateway {
  _row_id: string;
  pay_bankcode: string;
  min: number;
  max: number;
  active: boolean;
  timeout: number;
  icon: string;
  recommended: number[];
  display_name: string;
  gateway_id: number;
  // 添加索引签名，允许动态属性
  [key: string]: any;
}

// 获取法币支持的取款网关
export const QuerySupportedWithdrawGateways = (currency: string) => {
  const { user } = useAuth();

  const { data: gateways = [], isLoading, error, refetch } = useQuery<PaymentGateway[]>({
    queryKey: ['supportedWithdrawGateways', currency],
    queryFn: () => getSupportedWithdrawGateways(currency),
    enabled: !!user && !!currency, // 只有当用户已登录且选择了币种时才执行查询
    staleTime: 5 * 60 * 1000, // 数据5分钟内不会重新获取
    retry: (failureCount, error: any) => {
      // 对于401错误（未授权）不重试，其他错误最多重试2次
      return error?.response?.status !== 401 && failureCount < 2;
    },
  });

  return {
    gateways,
    isLoading,
    error,
    refetch
  };
};

// 获取取款网关必填字段
export const QueryWithdrawGatewayRequiredFields = (gateway_id: string) => {
  const { user } = useAuth();

  const { data: requiredFields = {}, isLoading, error, refetch } = useQuery({
    queryKey: ['withdrawGatewayRequiredFields', gateway_id],
    queryFn: () => getWithdrawGatewayRequiredFields(gateway_id),
    enabled: !!user && !!gateway_id, // 只有当用户已登录且选择了网关时才执行查询
    staleTime: 5 * 60 * 1000, // 数据5分钟内不会重新获取
    retry: (failureCount, error: any) => {
      // 对于401错误（未授权）不重试，其他错误最多重试2次
      return error?.response?.status !== 401 && failureCount < 2;
    },
  });

  return {
    requiredFields,
    isLoading,
    error,
    refetch
  };
}; 