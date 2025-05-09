import md5 from 'md5';
import { currencySymbol } from '@/_mock/currency';
import { getUsername, getToken } from '@/cookies/sign';
export function randomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export interface Auth {
  username: string;
  key: string;
  timestamp: number;
  token: string;
  noMd5?: string;
}

export function getAuth(): Auth {
  const username = getUsername();
  const storedToken = getToken();

  if (!username || !storedToken) {
    // throw new Error('User not authenticated');
    
  }

  const auth: Auth = {
    username: username || '',
    key: randomString(20),
    timestamp: Date.now(),
    token: '',
  };

  auth.token = md5(storedToken + auth.key + auth.timestamp);
  return auth;
}

export function getReferralLink(baseUrl: string, code: string) {
  return `${baseUrl}?startapp=${code}`;
}

export const getCurrencySymbolFun = (currency: string) => {
  const foundCurrency = currencySymbol.find((item) => item.code === currency);
  return foundCurrency?.symbol;
}