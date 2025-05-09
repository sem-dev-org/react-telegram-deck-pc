import { getVipConfig } from '@/api/referral';
import { IVipConfig } from '@/types/referral';
import { useQuery } from '@tanstack/react-query';

export const useVipConfig = () => {
  const { data: vipConfig = { data: [] as IVipConfig[], code: 0 }, isFetching } = useQuery<{ data: IVipConfig[], code: number }>({ 
    queryKey: ['vipConfig'],
    queryFn: () => getVipConfig({}),
  });

  return { vipConfig: vipConfig?.code === 0 ? vipConfig?.data : [], isFetching };
};
