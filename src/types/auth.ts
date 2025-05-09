export interface IUserBalance {
  id: number;
  team_id: number;
  user_id: number;
  currency: string;
  balance: string;
  cashback_base: string;
  updated_at: number;
  created_at: number;
  network: string;
  withdraw_able: string;
}

export interface IUser {
  id: number;
  telegram_id: number;
  is_bot: number;
  is_test: number;
  team_id: number;
  note: string | null;
  first_name: string;
  last_name: string | null;
  username: string | null;
  mobile: string | null;
  email: string | null;
  language_code: string;
  is_premium: number;
  chat_member: string;
  nickname: string;
  ip: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  device_id: string | null;
  city: string | null;
  avatar: string;
  login_enable: number;
  withdraw_enable: number;
  blocked: number;
  gender: string;
  birthday: string | null;
  top: number;
  parent: number;
  ads_tag: string;
  handle_status: number;
  host: string;
  created_at: number | null;
  updated_at: number;
  currency: string | null;
  ref: string;
  telegram_username: string | null;
  on_board: number;
  pin_setted: boolean;
  currency_fiat: string | null;
  is_favorite: boolean;
  display_fiat_on: number;
}

export interface IUserStatus {
  id: number;
  user_id: number;
  battery: number;
  battery_expire: number;
  promotion_rule_id_active: string;
  promotion_rule_id_passive: string;
  promotion_rule_id_available: string;
  vip: number;
  tag: string | null;
  xp: number;
  direct_invitations: number;
  indirect_invitations: number;
  credit: number;
  subscribe_channel: number;
  last_visit: number;
  last_device: string;
  last_ip: string;
  device_list: string;
  ip_list: string;
  group_invitations: number;
  multi_ip: number;
  multi_device: number;
  visit_times: number;
  purchase_times: number;
  purchase_amount: string;
  promotion_times: number;
  promotion_amount: string;
  deposit_times: number;
  deposit_bonus_times: number;
  deposit_amount: string;
  withdraw_times: number;
  withdraw_amount: string;
  check_in_times: number;
  performance: string;
  group_performance: string;
  earn_amount: string;
  withdraw_fee: string;
  created_at: number;
  updated_at: number;
  promotion_rule_used: string | null;
  wager_wins_times: string;
  wager_amount: string;
  wager_times: string;
  favorites_game: string;
}

export interface IBaseUrl {
  id: number;
  host: string;
  tg_url_base: string;
  created_at: number;
  updated_at: number;
  currentUrl?: string;
  user_id: number;
  is_setup_webhook: number;
} 