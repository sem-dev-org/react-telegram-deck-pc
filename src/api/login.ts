import { fetchApi, fetchApiByToken } from './client';

export const signup = async (data: any, headers: Record<string, string> = {}) => {
  const response = await fetchApi('/Authentication/signup', { method: 'post', body: JSON.stringify(data)}, headers);
  return response;
};

export const signin = async (data: any) => {
  const response = await fetchApi('/Authentication/login', { method: 'post', body: JSON.stringify(data) });
  return response;
};
          
export const logout = async () => {
  const response = await fetchApiByToken('/user/logout', { method: 'post' });
  return response;
};

