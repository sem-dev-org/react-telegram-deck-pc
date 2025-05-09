import { createPublicApiRequest, createAuthenticatedApiRequest } from '@/utils/enhancedApiClient';
import { ICurrency, IFiatGateway } from '@/types/finance';
import { fetchApiByToken } from './client';
/**
 * Get list of supported currencies with enhanced error handling
 *
 * @returns Promise that resolves to an array of currencies
 */
export const getSupportedCurrencies = async (): Promise<ICurrency[]> => {
  return createPublicApiRequest<ICurrency[]>('/Currency', 'get');
};

// -------------------------------- Fiat Deposit --------------------------------

/**
 * Create a fiat deposit order
 *
 * @param params - The parameters for the payment gateway
 * @returns Promise that resolves to the deposit order
 */
export const createFiatDepositOrder = async (params: any): Promise<any> => {
  return fetchApiByToken('/UserDeposit/fiat_deposit', { method: 'POST', body: JSON.stringify(params) });
};

/**
 * Get supported fiat deposit gateways
 *
 * @param currency - The currency to get gateways for
 * @returns Promise that resolves to the supported gateways
 */
export const getSupportedFiatDepositGateways = async (currency: string): Promise<IFiatGateway[]> => {
  return createAuthenticatedApiRequest<IFiatGateway[]>('/PaymentGateway/getFiatGatewayList', 'post', {
    body: JSON.stringify({ currency }),
  });
};

/**
 * Get the required fields for a fiat deposit order
 *
 * @param gateway_id - The ID of the payment gateway
 * @returns Promise that resolves to the required fields
 */
export const getSupportedFiatDepositGatewayParams = async (gateway_id: string): Promise<any> => {
  return createAuthenticatedApiRequest<any>('/PaymentGateway/getFiatGatewayDepositParams', 'post', {
    body: JSON.stringify({ gateway_id }),
  });
};

// -------------------------------- Crypto Deposit --------------------------------

/**
 * Get supported crypto deposit gateways
 *
 * @param currency - The currency to get gateways for
 * @returns Promise that resolves to the supported gateways
 */
export const getSupportedCryptoDepositGateways = async (currency: string): Promise<any> => {
  return createAuthenticatedApiRequest<any>(`/PaymentGateway/getCryptoGatewayList`, 'get', {
    params: { currency },
  });
};

// -------------------------------- Crypto Withdraw --------------------------------

/**
 * Get supported crypto withdraw gateways
 *
 * @param currency - The currency to get gateways for
 * @returns Promise that resolves to the supported gateways
 */
export const getSupportedCryptoWithdrawGateways = async (currency: string): Promise<any> => {
  return createAuthenticatedApiRequest<any>(`/PaymentGateway/getWithdrawCryptoGatewayList`, 'get', {
    params: { currency },
  });
};

/**
 * Get supported fiat withdraw gateways
 *
 * @param currency - The currency to get gateways for
 * @returns Promise that resolves to the supported gateways
 */
export const getSupportedFiatWithdrawGateways = async (currency: string): Promise<any> => {
  return createAuthenticatedApiRequest<any>(`/PaymentGateway/getWithdrawFiatGatewayList`, 'get', {
    params: { currency },
  });
};

/**
 * Get the required fields for a fiat withdraw order
 *
 * @param gateway_id - The ID of the payment gateway
 * @returns Promise that resolves to the required fields
 */
export const getSupportedFiatWithdrawGatewayParams = async (gateway_id: string): Promise<any> => {
  return createAuthenticatedApiRequest<any>(`/PaymentGateway/getFiatGatewayWithdrawParams`, 'get', {
    params: { gateway_id },
  });
};

/**
 * Create a swap order
 *
 * @param params - The parameters for the swap order
 * @returns Promise that resolves to the swap order
 */
export const createSwapOrder = async (params: any): Promise<any> => {
  return createAuthenticatedApiRequest<any>('/UserSwap/new', 'post', { body: JSON.stringify(params) });
};

export type GetUserRolloverParams = {
  limit: number;
  last_id: number;
  type: string | undefined;
  statuses: string | undefined;
  end_timestamp: string;
};

/**
 * Get user rollover
 */
export const getUserRollover = async (params: GetUserRolloverParams): Promise<any> => {
  return createAuthenticatedApiRequest<any>('/UserDeposit/rollover', 'post', { params });
};

/**
 * Get user balance extension
 */
export const getUserBalanceExtension = async (): Promise<any> => {
  return createAuthenticatedApiRequest<any>('/UserBalanceExtension', 'get');
};
