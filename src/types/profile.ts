export interface KycDetail {
    id: number;
    team_id: number;
    user_id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    birthday: string;
    country: string;
    state: string;
    city: string;
    address: string;
    zip_code: string;
    document_type: number;
    document_url: string;
    status: number;
    created_at: number;
    updated_at: number;
}

export interface TopThreeGames {
    id: number;
    game_provider: string;
    game_id: string;
    game_name: string;
    game_code: string;
    currency: string;
    tags: string;
    game_info: string;
    stakes: string;
    rtp: string;
    max_win: string;
    image: string;
    status: number;
    release_status: number;
    is_support_free_game: number;
    category: number;
    created_at: number;
    updated_at: number;
    popular: number;
    game_type: string;
    seq: number;
    is_support_demo_game: number;
    user_count: number;
    use_count_day: number;
    is_tournament: number;
    game_type_1: string;
    game_type_2: string;
    type_id: number;
    error: string;
    is_hedging: number;
    is_disable: number;
    wagered_usdt: number;
}
