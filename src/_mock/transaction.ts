export const typeOptions = (t: (key: string) => string) => [
  { id: '1', label: t('common.deposit'), value: 'Deposit' },
  { id: '2', label: t('common.withdraw'), value: 'Withdraw' },
  { id: '3', label: t('common.swap'), value: 'Swap' },
  { id: '4', label: t('common.buyCrypto'), value: 'Buy Crypto' },
  { id: '5', label: t('common.bonus'), value: 'Bonus' },
];

export const statusOptions = (t: (key: string) => string) => [
  { id: '-1', label: t('common.allStatus'), value: -1 },
  { id: '1', label: t('common.success'), value: 1 },
  { id: '0', label: t('common.pending'), value: 0 },
  { id: '2', label: t('common.failed'), value: 2 },
  { id: '4', label: t('common.cancelled'), value: 4 },
];

export const periodOptions = (t: (key: string) => string) => [
  { id: '0', label: t('transaction:filters.all'), value: 'All' },
  { id: '1', label: t('transaction:filters.past90Days'), value: 'Past 90 Days' },
  { id: '2', label: t('transaction:filters.past60Days'), value: 'Past 60 Days' },
  { id: '3', label: t('transaction:filters.past30Days'), value: 'Past 30 Days' },
  { id: '4', label: t('transaction:filters.past7Days'), value: 'Past 7 Days' },
  { id: '5', label: t('transaction:filters.past24Hours'), value: 'Past 24 Hours' },
];

export const referralTypeOptions = (t: (key: string) => string) => [
  { id: '1', label: t('transaction:filters.all'), value: 'All' },
  { id: '2', label: t('transaction:filters.direct'), value: 'Direct' },
  { id: '3', label: t('transaction:filters.indirect'), value: 'Indirect' },
];

export const mirrorOptions = (t: (key: string) => string) => [
  { id: '1', label: t('referral:telegramReferral'), value: 'telegram' },
  { id: '2', label: t('referral:h5Referral'), value: 'h5' },
];
