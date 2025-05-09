import { fetchApiByToken } from './client';

export const getUserStatus = async () => {
  const response = await fetchApiByToken('/UserStatus', {
    method: 'get',
  });
  return response;
};

export const getAdTagList = async () => {
  const response = await fetchApiByToken('/AdTag', { method: 'get', body: null });
  return response;
};

export const getDefaultAdTag = async () => {
  const response = await fetchApiByToken('/AdTag/getDefault', {
    method: 'get',
    body: null,
  });
  return response;
};

export const setDefaultAdTag = async (data: any) => {
  const response = await fetchApiByToken('/AdTag/setDefault', {
    method: 'post',
    body: JSON.stringify(data),
  });
  return response;
};

export const createAdTag = async (data: any) => {
  const response = await fetchApiByToken('/AdTag/create', {
    method: 'post',
    body: JSON.stringify(data),
  });
  return response;
};

export const getMyBets = async (data: any) => {
  const response = await fetchApiByToken('/GameOrder/mybets', {
    method: 'post',
    body: JSON.stringify(data),
  });
  return response;
};

export const getClaim = async (data: any) => {
  const response = await fetchApiByToken('/Claim/index', {
    method: 'post',
    body: JSON.stringify(data),
  });
  return response;
};

export const setClaim = async (data: any) => {
  const response = await fetchApiByToken('/Claim/claim', {
    method: 'post',
    body: JSON.stringify(data),
  });
  return response;
};

export const getVipConfig = async (data: any) => {
  const response = await fetchApiByToken('/VipConfig/index', {
    method: 'post',
    body: JSON.stringify(data),
  });
  return response;
};

export const getRewardGroupLog = async (data: any) => {
  const response = await fetchApiByToken('/RewardGroupLog/index', {
    method: 'post',
    body: JSON.stringify(data),
  });
  return response;
}

export const getRewardGroupLogMyList = async (data: any) => {
  const response = await fetchApiByToken('/RewardGroupLog/myList', {
    method: 'post',
    body: JSON.stringify(data),
  });
  return response;
}

export const getRewardGroupLogDetail = async (data: any) => {
  const response = await fetchApiByToken('/RewardGroupLog/detail', {
    method: 'post',
    body: JSON.stringify(data),
  });
  return response;
}

export const getGameTypeConfig = async () => {
  const response = await fetchApiByToken('/GameTypeConfig/index', {
    method: 'get',
    body: null,
  });
  return response;
};

export const getReferralRewardList = async (data: any) => {
  const response = await fetchApiByToken('/RewardReferUnlockLog/getReferralRewardList', {
    method: 'post',
    body: JSON.stringify(data),
  });
  return response;
};

export const getReferralList = async (data: any) => {
  const response = await fetchApiByToken('/RewardReferUnlockLog/getReferralList', {
    method: 'post',
    body: JSON.stringify(data),
  });
  return response;
};

export const getReferralDetail = async (data: any) => {
  const response = await fetchApiByToken('/RewardReferUnlockLog/getReferralDetail', {
    method: 'post',
    body: JSON.stringify(data),
  });
  return response;
};

export const getTelegramBotBaseUrl = async () => {
  const response = await fetchApiByToken('/TelegramBot/baseUrl', {
    method: 'get',
    body: null,
  });
  return response;
};

export const getReferralRewardDetail = async (data: any) => {
  const response = await fetchApiByToken('/RewardReferUnlockLog/getReferralRewardDetail', {
    method: 'post',
    body: JSON.stringify(data),
  });
  return response;
};