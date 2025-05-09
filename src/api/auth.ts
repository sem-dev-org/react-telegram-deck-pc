import { IUser, IUserStatus } from '@/types/auth';
import { createAuthenticatedApiRequest } from '@/utils/enhancedApiClient';
import { fetchApiByTMA, fetchApiByToken } from './client';

export interface AuthResponse {
  code: number;
  msg: string;
  user: IUser;
  status: IUserStatus;
  data: {
    token: string;
    username: string;
  };
}

export async function verifyTelegramUser() {
  return fetchApiByTMA('/Authentication/loginByTMA', {
    method: 'POST',
    body: null,
  }) as Promise<AuthResponse>;
}

export async function getInitData() {
  return fetchApiByTMA('/auth/init-data') as Promise<{
    success: boolean;
    data: any;
  }>;
}

export async function getProfile() {
  return createAuthenticatedApiRequest<AuthResponse>('/User/index', 'get');
}

export async function setOnboarding() {
  return fetchApiByToken('/User/setOnBoard', {
    method: 'POST',
    body: null,
  });
}

export async function getUserBalance() {
  return fetchApiByToken('/UserBalance', {
    method: 'POST',
    body: null,
  });
}

export async function getUserBalanceLog(data: any) {
  return fetchApiByToken('/UserBalanceLog', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePin(data: any) {
  return fetchApiByToken('/User/updatePin', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// export const userBalance = async () => {
//   const response = await fetchApiByToken('/UserBalance', { method: 'get', body: null });
//   return response;
// };

export const configGetByGroup = async (data: any) => {
  const response = await fetchApiByToken('/Config/getByGroup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response;
};

export const updateCurrency = async (data: any) => {
  return fetchApiByToken('/User/updateCurrency', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getBaseUrl = async () => {
  return fetchApiByToken('/TelegramBot/baseUrl', {
    method: 'get',
    body: null,
  });
};
