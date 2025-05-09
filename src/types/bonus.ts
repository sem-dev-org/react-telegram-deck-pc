export type IDepositBonusConfig = {
  id: number;
  level: number;
  min_deposit_amount: string;
  max_bonus_amount: string;
  max_deposit_amount: string;
  bonus_percent: string;
  created_at: number;
  updated_at: number;
};

export type IConquest = {
  id: number;
  game_tag: string;
  type: string;
  name: string;
  description: string;
  total_wager_amount?: number;
  wager_amount?: number;
  note: string;
  key: string;
  reward_amount: string;
  reward_currency: string;
  created_at: number;
  updated_at: number;
  handle_status: number;
  is_daily: number;
  is_finish: number;
}