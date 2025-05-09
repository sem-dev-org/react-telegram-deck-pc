export type IDepositOrder = {
  id: number;
  team_id: number;
  user_id: number;
  currency: string;
  payment_gateway: string;
  payment_gateway_id: number;
  deposit_id: string;
  amount: string;
  status: number;
  txid: string;
  created_at: number;
  updated_at: number;
  note: string;
  number: string;
  expire_at: number;
  network: string;
  bonus: string;
  wager: string;
  promotion_id: number;
  gas_fee_fix: string;
  gas_fee: string | null;
  amount_real: string | null;
  gas_fee_rate: string | null;
  amount_usdt_rate: string | null;
};

export type IWithdrawOrder = {
  id: number;
  team_id: number;
  balance_id: number;
  user_id: number;
  currency: string;
  note: string;
  payment_gateway_id: number | null;
  payment_gateway: string | null;
  network: string;
  withdraw_id: string;
  amount: string;
  amount_received: string;
  status: number;
  fee_rate: string;
  bonus: string;
  fee_amount: string;
  amount_usdt_rate: string | null;
  gas_fee: string | null;
  gas_fee_usdt_rate: string | null;
  txid: string;
  created_at: number;
  updated_at: number;
  number: string;
  gas_fee_fix: string;
  approve_status: number;
  seqno: number | null;
  system_address: string | null;
  gas_fee_rate: string | null;
};

export interface IBetHistory {
  id: string;
  game_provider_id: number;
  game_id: string;
  team_id: number;
  user_id: number;
  currency: string;
  amount: string;
  number: string;
  status: number;
  handle_status: number;
  bet_id: string;
  parent_bet_id: string;
  created_at: number;
  updated_at: number;
  bet_type: string;
  game_transaction_id: string;
  bet_amount: string;
  win_amount: string;
  token: string;
  request_id: string;
  order_time: number;
  other_data: string;
  real_currency: string;
  real_bet_amount: string;
  real_win_amount: string;
  is_big_win: number;
  game_name: string;
  nickname: string;
  game_provider: string;
  game_type_id: number;
  game_code: string;
  game_type_1: string;
  game_type_2: string;
}

export type ISwapOrder = {
  id: number;
  team_id: number;
  user_id: number;
  from_currency: string;
  to_currency: string;
  from_amount: string;
  to_amount: string;
  to_amount_received: string;
  fee_rate: string;
  fee_amount: string;
  fee_currency: string;
  from_to_usdt_rate: string;
  to_to_usdt_rate: string;
  status: number;
  number: string;
  handle_status: number;
  remark: string;
  created_at: number;
  updated_at: number;
};

export interface BetHistoryPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  has_more: boolean;
}

export interface BetHistoryResponse {
  code: number;
  msg: string;
  data: IBetHistory[];
  pagination: BetHistoryPagination;
}

export interface IRolloverTransaction {
  id: number;
  type: string;
  amount: string;
  status: string;
  date: string;
  timestamp: number;
  currency: string;
  completed: boolean;
}
