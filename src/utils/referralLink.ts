export const referralLink = (code: string) => {
  // 获取当前域名地址
  const currentDomain = typeof window !== 'undefined' ? window.location.origin : '';

  return `${currentDomain}/register?ref=${code}`;
};
