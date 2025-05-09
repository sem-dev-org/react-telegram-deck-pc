/**
 * 支付相关 API
 */
import { fetchApiByToken } from './client';

// 获取支持的法币
// export const getSupportedCurrencies = async () => {
//   const response = await fetchApiByToken('/PaymentGateway/getFiats', { method: 'POST', body: null });
//   return response.data;
// };

// 获取法币支持的网关
export const getSupportedGateways = async (currency: string) => {
  const response = await fetchApiByToken('/PaymentGateway/getFiatGatewayList', {
    method: 'POST',
    body: JSON.stringify({ currency }),
  });
  return response.data;
};

// 获取网关的必填项
export const getGatewayRequiredFields = async (gateway_id: string) => {
  const response = await fetchApiByToken('/PaymentGateway/getFiatGatewayDepositParams', {
    method: 'POST',
    body: JSON.stringify({ gateway_id }),
  });
  return response.data;
};

// 创建充值订单
export const createDepositOrder = async (params: any) => {
  const response = await fetchApiByToken('/UserDeposit/fiat_deposit', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return response.data;
};

// 获取支持的数字货币
export const getSupportedCryptos = async () => {
  const response = await fetchApiByToken('/Coin', { method: 'POST', body: null });
  return response.data;
};

// 获取数字货币的充值地址
export const getCurrency = async ( ) => { 
  const response = await fetchApiByToken('/Currency', { method: 'get', body: null });
  return response;
};

// 获取数字货币的充值地址
export const getCryptoDepositAddress = async (network: string) => {
  const response = await fetchApiByToken('/UserWallet', { method: 'POST', body: JSON.stringify({ network }) });
  return response.data;
};

// 获取法币支持的取款网关
export const getSupportedWithdrawGateways = async (currency: string = 'CNY') => {
  const response = await fetchApiByToken('/PaymentGateway/getWithdrawFiatGatewayList', {
    method: 'POST',
    body: JSON.stringify({ currency }),
  });
  return response.data;
};

// 获取法币提款网关的必填项
export const getWithdrawGatewayRequiredFields = async (gateway_id: string) => {
  const response = await fetchApiByToken('/PaymentGateway/getWithdrawFiatGatewayDepositParams', {
    method: 'POST',
    body: JSON.stringify({ gateway_id }),
  });
  return response.data;
};

// 创建法币取款订单
export const createWithdrawOrder = async (params: any) => {
  const response = await fetchApiByToken('/UserWithdraw/fiat_withdraw', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return response;
};

// 获取数字货币提款钱包地址
export const getCryptoWithdrawAddress = async (network?: string) => {
  const response = await fetchApiByToken(`/UserWithdrawWallet${network ? `?network=${network}` : ''}`, { method: 'get' });
  return response.data;
};

// 添加数字货币钱包收款地址
export const addCryptoWithdrawAddress = async (params: any) => {
  const response = await fetchApiByToken('/UserWithdrawWallet/new', { method: 'post', body: JSON.stringify(params) });
  return response.data;
};


// 删除数字货币钱包收款地址
export const deleteCryptoWithdrawAddress = async (id: string) => {
  const response = await fetchApiByToken('/UserWithdrawWallet/delete', { method: 'post', body: JSON.stringify({ id }) });
  return response.data;
};

// 创建数字货币取款订单
export const createCryptoWithdrawOrder = async (params: any) => {
  const response = await fetchApiByToken('/UserWithdraw/new', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return response.data;
};
