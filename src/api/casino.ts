import { fetchApi, fetchApiByToken } from './client';
 
export const GameOrderGreatestGames = async () => {
  const response = await fetchApi('/GameOrderBigWin', { method: 'get', body: null });
  return response;
};

export const GameProviderList = async () => {
  const response = await fetchApi('/GameProvider/list', { method: 'get', body: null });
  return response;
};

export const getNewestGameOrder = async () => {
  const response = await fetchApi('/GameOrder/newest', { method: 'get', body: null });
  return response;
};

export const getGreatestGameOrder = async () => {
  const response = await fetchApi('/GameOrder/greatest', { method: 'get', body: null });
  return response;
};

export const getTournamentGameOrder = async () => {
  const response = await fetchApi('/GameOrder/tournament', { method: 'get', body: null });
  return response;
};

export const getGamePlay = async (data: any) => {
  const response = await fetchApiByToken(`/game/play`, { method: 'POST', body: JSON.stringify(data) });
  return response;
};

export const getCommonGameList = async (data: any) => {
  const response = await fetchApi('/GameList/getCommonGameList', { method: 'POST', body: JSON.stringify(data) });
  return response;
};

export const getUserGameList = async (data: any = {}) => {
  const response = await fetchApiByToken('/GameList/getUserGameList', { method: 'post', body: JSON.stringify(data) });
  return response;
};

export const likeGame = async (data: any) => {
  const response = await fetchApiByToken('/Game/like', { method: 'post', body: JSON.stringify(data) });
  return response;
};