export type ICurrency = {
    id: number;
    currency: string;
    currency_type: string;
    decimal: number;
    min_withdraw: string;
    max_withdraw: string;
    min_deposit: string;
    created_at: number;
    updated_at: number;
    icon: string | null;
    display_decimal: number;
    display_name: string;
    balance?: string;
};
