export type IAdTag = {
  id: number;
  code: string;
  note: string | null;
  team_id: number;
  host: string;
  user_id: number;
  register_count: number;
  deposit_count: number;
  withdraw_count: number;
  purchase_count: number;
  onboard_count: number;
  invitations: number;
  created_at: number;
  updated_at: number;
  deposit_amount: string;
  withdraw_amount: string;
  purchase_amount: string;
  deposit_customer: number;
  withdraw_customer: number;
  purchase_customer: number;
  invitations_deposit: number;
  invitations_deposit_amount: string;
  invitations_withdraw: number;
  invitations_withdraw_amount: string;
  invitations_purchase: number;
  invitations_purchase_amount: string;
  promotion_count: number;
  promotion_amount: string;
  daily_check_in_count: number;
  share_to_referee: number;
  is_default: number;
  campaign: string;
};


export type IClaim = {
  id: number;
  user_id: number;
  item: string;
  value: string;
  sum: number | null;
  locked: number | null;
  created_at: number;
  updated_at: number;
  expire_at: number;
  currency: string;
};

export type IRewardGroupLog = {
  id: number;
  up_line: number;
  down_line: number;
  down_line_username: string;
  reward: string;
  created_at: number;
  updated_at: number;
};

export type IVipConfig = {
  id: number;
  vip: number;
  xp: string;
  group: string;
  referral: string;
  level_up: string;
  medal: string;
  rakeback: string;
  cashback_amusement: string;
  cashback_sport: string;
  created_at: number;
  updated_at: number;
};

export type IGameTypeConfig = {
  id: number;
  game_type_1: string;
  game_type_2: string;
  group_rate: string;
  rakeback_rate: string;
  created_at: number;
  updated_at: number;
};

export type IReferralList = {
  id: number;
  up_line: number;
  down_line: number;
  down_line_username: string;
  reward: string;
  down_line_level_before: number;
  down_line_level_after: number;
  created_at: number;
  updated_at: number;
  referral_code: string;
  type: string;
  refer_type: string;
};

export type IReferralDetail = {
  id: number;
  up_line: number;
  down_line: number;
  down_line_username: string;
  reward: string;
  down_line_level_before: number;
  down_line_level_after: number;
  created_at: number;
  updated_at: number;
  referral_code: string;
  type: string;
  refer_type: string;
  level_reward: string;
  group_reward: string;
};

export type IReferralRewardsDetail = {
  referral_code: string;
  referral_type: string;
  regitration_date: number;
  rewards_unlocked: string;
  username: string;
  vip_level: number;
  id: number;
};
