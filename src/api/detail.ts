import { fetchApi, fetchApiByToken } from './client';

export const getGameDetail = async (obj: any) => {
  const response = await fetchApi('/GameList/getGame', {
    method: 'post',
    body: JSON.stringify(obj),
  });
  return response;
};

export const isFavorite = async (obj: any) => {
  const response = await fetchApiByToken('/Game/isFavorite', {
    method: 'post',
    body: JSON.stringify(obj),
  });
  return response;
};