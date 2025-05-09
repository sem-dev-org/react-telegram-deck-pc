import { createAuthenticatedApiRequest } from '@/utils/enhancedApiClient';

export interface OrderQueryParams {
  limit?: number;
  last_id?: number;
  status?: number;
  currency?: string;
  end_timestamp?: number;
}

export const getUserDepositOrders = async (params: OrderQueryParams = {}) => {
  // 构建 URL 查询参数
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/UserDeposit?${queryString}` : '/UserDeposit';
  
  return createAuthenticatedApiRequest(endpoint, 'get');
};

export const getUserWithdrawOrders = async (params: OrderQueryParams = {}) => {
  // 构建 URL 查询参数
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/UserWithdraw?${queryString}` : '/UserWithdraw';
  
  return createAuthenticatedApiRequest(endpoint, 'get');
};

export interface BetHistoryQueryParams {
  game_type?: string;
  asset?: string;
  time_range?: number;
  page?: number;
  page_size?: number;
}

export const getUserBetHistory = async (params: BetHistoryQueryParams = {}) => {
  // 构建 URL 查询参数
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/GameOrder/getBetHistory?${queryString}` : '/GameOrder/getBetHistory';
  
  console.log('Calling bet history API with endpoint:', endpoint);
  console.log('Params:', params);
  
  try {
    const response = await createAuthenticatedApiRequest(endpoint, 'get');
    console.log('API Response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching bet history:', error);
    throw error;
  }
};

export const getUserSwapOrders = async (params: OrderQueryParams = {}) => {
  // 构建 URL 查询参数
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/UserSwap?${queryString}` : '/UserSwap';
  
  return createAuthenticatedApiRequest(endpoint, 'get');
};

export const getUserBonusOrders = async (params: OrderQueryParams = {}) => {
  // 构建 URL 查询参数
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/UserBonus?${queryString}` : '/UserBonus';
  
  return createAuthenticatedApiRequest(endpoint, 'get');
};