export type ITournament = {
    id: number;
    name: string;
    provider_id: number;
    provider: string;
    game_type_id: number;
    game_type_2: string;
    desc: string;
    created_at: string | null;
    updated_at: string | null;
    user_info: {
        is_joined: boolean;
        tournament_level: string;
        wagered: string;
        rank: number;
        prize: number;
        date: number;
        prize_rate: string;
    }
}

export type ITournamentTable = {
    id: number;
    user_id: number;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    tournament_id: number;
    tournament_level: string;
    wagered: string;
    date: number;
    rank: number;
    prize: number;
    prize_rate: string;
}

export type ITournamentConfig = {
    id: number;
    ranking: string;
    game_type: string;
    prize_rate: string;
    created_at: string | null;
    updated_at: string | null;
}

export type ITournamentInfo = {
    user_id?: number;
    tournament_id?: number;
    total_participants?: number;

    is_joined: boolean;
    tournament_level: string;
    wagered: string;
    rank: number;
    prize: number;
    date: number;
    prize_rate: string;
}

