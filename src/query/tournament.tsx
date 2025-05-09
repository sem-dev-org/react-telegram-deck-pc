import { useAuth } from '@/contexts/auth';
import { ITournament, ITournamentConfig } from '@/types/tournament';
import { useQuery } from '@tanstack/react-query';
import { getTournamentConfig, getTournamentList } from '../api/tournament';

export const useTournamentList = () => {
  const { user } = useAuth();
  const { data: tournamentList = { data: [], code: 0 }, isLoading } = useQuery<{ data: ITournament[]; code: number }>({
    queryKey: ['tournamentList'],
    queryFn: () => getTournamentList(),
    enabled: !!user,
  });

  return { tournamentList: tournamentList.code === 0 ? tournamentList?.data : [], isLoading };
};

export const useTournamentConfig = () => {
  const { data: { data: tournamentConfig, code } = { data: {}, code: 0 }, isLoading } = useQuery<{
    data: ITournamentConfig;
    code: number;
  }>({
    queryKey: ['tournamentConfig'],
    queryFn: () =>
      getTournamentConfig({
        game_type: 'slots',
      }),
  });

  return { tournamentConfig: code === 0 ? tournamentConfig || {} : {}, isLoading };
};
