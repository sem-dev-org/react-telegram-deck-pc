import { IGameProvider } from '@/types/game';
import { useQuery } from '@tanstack/react-query';
import { GameProviderList } from '@/api/casino';

export const QueryProvider = () => {
  const { data: gameProviderList = { data: [] as IGameProvider[], code: 0 } } = useQuery<{ data: IGameProvider[], code: number }>({ 
    queryKey: ['gameProviderList'],
    queryFn: () => GameProviderList(),
  });

  return { gameProviderList: gameProviderList?.code === 0 ? gameProviderList?.data : [] };
};
