import { GameOrderGreatestGames } from "@/api/casino";
import { IGreatestGameOrder } from "@/types/game";
import { useQuery } from "@tanstack/react-query";


export const QueryGreatestGameOrder = () => { 
    const { data = { data: [], code: 0 }, isFetching, refetch } = useQuery<{ data: IGreatestGameOrder[], code: number }>({
        queryKey: ['GameOrderGreatestGames'],
        queryFn: () => GameOrderGreatestGames().then(res => res || []),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    return { greatestGameOrder: data.code === 0 ? data?.data : [], isFetching, refetch };
};
