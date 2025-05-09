import { getUserBalance } from '@/api/auth';
import { useAuth } from '@/contexts/auth';
import { IUserBalance } from '@/types/auth';
import { useQuery } from '@tanstack/react-query';

export const QueryUserBalance = () => {
  const { user } = useAuth();

  const { data: userBalance = { data: [], code: 0 }, refetch } = useQuery<{ data: IUserBalance[]; code: number }>({
    queryKey: ['UserBalance'],
    queryFn: () => getUserBalance(),
    enabled: !!user,
    refetchOnMount: true,
  });

  return {
    userBalance: userBalance.code === 0 ? userBalance?.data : [],
    refetch,
  };
};
