import { IDepositBonusConfig } from '@/types/bonus';
import { createAuthenticatedApiRequest, createPublicApiRequest } from '@/utils/enhancedApiClient';

/**
 * Get deposit bonus config
 *
 * @returns Promise that resolves to the deposit bonus config
 */
export const getDepositBonusConfig = async (): Promise<IDepositBonusConfig[]> => {
  return createPublicApiRequest<IDepositBonusConfig[]>('/DepositBonusConfig/index', 'get');
};

/**
 * Get user claims
 *
 * @returns Promise that resolves to the user claims
 */
export const getUserClaims = async (params?: { page?: number; limit?: number; [key: string]: any }): Promise<any> => {
  return createAuthenticatedApiRequest<any>('/Claim/index', 'get', { params });
};

/**
 * Activate booster
 *
 * @returns Promise that resolves to the activated booster
 */
export const activateBooster = async (): Promise<any> => {
  return createAuthenticatedApiRequest<any>('/claim/activateBooster', 'post');
};

/**
 * Claim bonus (rakeback, cashback)
 *
 * @returns Promise that resolves to the claimed bonus
 */
export const claimBonus = async (params: { item: string; currency?: string }): Promise<void> => {
  return createAuthenticatedApiRequest<void>('/Claim/claim', 'post', { body: params });
};

/**
 * Calendar claim
 *
 * @returns Calendar claim
 */
export const calendarClaim = async (): Promise<any> => {
  return createAuthenticatedApiRequest<any>('/Calendar/claim', 'post');
};

/**
 * get calendar bonus
 *
 * @returns Calendar bonus
 */
export const getCalendarBonus = async (): Promise<any> => {
  return createAuthenticatedApiRequest<any>('/Calendar/index', 'get');
};

/**
 * Get conquests
 *
 * @returns Conquests
 */
export const getConquests = async (): Promise<any> => {
  return createAuthenticatedApiRequest<any>('/Conquest/index', 'get');
};

/**
 * Get conquests completed
 *
 * @returns Conquests completed
 */
export const getConquestsCompleted = async (): Promise<any> => {
  return createAuthenticatedApiRequest<any>('/Conquest/getConquestCompleted', 'get');
};

/**
 * Get conquests reward
 */
export const getConquestsReward = async (): Promise<any> => {
  return createAuthenticatedApiRequest<any>('/Conquest/getConquestReward', 'get');
};

/**
 * Conquest claim
 */
export const claimConquest = async (): Promise<any> => {
  return createAuthenticatedApiRequest<any>('/Conquest/Claim', 'post');
};
