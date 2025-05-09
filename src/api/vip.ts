import { fetchApiByToken } from './client';

export const getClaim = async () => {
  const response = await fetchApiByToken('/Claim/index', {
    method: 'get',
  });
  return response.data.data;
};

export const getVipConfig = async (level?: number) => {
  let url = '/VipConfig/index';

  if (level) {
    url = `/VipConfig/index?vip=${level}`;
  }

  const response = await fetchApiByToken(url, {
    method: 'get',
  });
  return response.data;
};
