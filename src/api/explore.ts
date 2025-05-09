import { fetchApi } from './client';

export const getGameList = async (data: any) => {
  const response = await fetchApi('/GameList/getCommonGameList', {
    method: 'post',
    body: JSON.stringify(data),
  });
  return response;
};
