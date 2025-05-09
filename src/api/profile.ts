import { fetchApi, fetchApiByToken } from "./client";

export const getUserBalanceLog = async (obj: any) => {
  const response = await fetchApiByToken('/UserBalanceLog/list', {
    method: 'POST',
    body: JSON.stringify(obj),
  });
  return response;
};  

export const updatePin = async (obj: any) => {
  const response = await fetchApiByToken('/user/updatePin', {
    method: 'POST',
    body: JSON.stringify(obj),
  });
  return response;
};

export const updateKyc = async (obj: any) => {
  const response = await fetchApiByToken('/UserKyc/update', {
    method: 'POST',
    body: JSON.stringify(obj),
  });
  return response;
};

export const getKycDetail = async () => {
  const response = await fetchApiByToken('/UserKyc/getDetail', {
    method: 'GET',
  });
  return response;
};

export const updateUser = async (obj: any) => {
  const response = await fetchApiByToken('/User/updateUser', {
    method: 'POST',
    body: JSON.stringify(obj),
  });
  return response;
};

export const getUserProfile = async () => {
  const response = await fetchApiByToken('/User/profile', {
    method: 'GET',
  });
  return response;
};


// export const uploadImage = async (obj: any) => {   
//   const response = await fetchApiByToken('/Images/uploadPrivate', { 
//     method: 'POST',
//     body: obj,
//   });
//   return response;
// };

export const uploadPrivateImage = async (obj: any) => {
  const response = await fetchApiByToken('/Images/uploadPrivate', {
    method: 'POST',
    body: obj,
  });
  return response;
};

export const uploadPublicImage = async (obj: any) => {
  const response = await fetchApiByToken('/Images/uploadPublic', {
    method: 'POST',
    body: obj,
  });
  return response;
};


export const getTopWageredGames = async () => {
  const response = await fetchApiByToken('/GameList/getTopWageredGames', {
    method: 'GET',
  });
  return response;
};

export const sendEmailCode = async (data: any) => {
  const response = await fetchApi('/Authentication/sendEmailCode', { method: 'post', body: JSON.stringify(data) });
  return response;
};

export const sendMobileCode = async (data: any) => {
  const response = await fetchApi('/Authentication/sendMobileCode', { method: 'post', body: JSON.stringify(data) });
  return response;
};

export const resetPassword = async (data: any) => {
  const response = await fetchApi('/Authentication/resetPassword', { method: 'post', body: JSON.stringify(data) });
  return response;
};

export const bindEmail = async (data: any) => {
  const response = await fetchApiByToken('/Personal/bindEmail', { method: 'post', body: JSON.stringify(data) });
  return response;
};

export const bindMobile = async (data: any) => {
  const response = await fetchApiByToken('/Personal/bindMobile', { method: 'post', body: JSON.stringify(data) });
  return response;
};


export const changePassword = async (obj: any) => {
  const response = await fetchApiByToken('/Personal/changePassword', {
    method: 'POST',
    body: JSON.stringify(obj),
  });
  return response;
};