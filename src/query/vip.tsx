import { getClaim, getVipConfig } from '@/api/vip';
import { useAuth } from '@/contexts/auth';
import { useQuery } from '@tanstack/react-query';

export const QueryAllVipLevelConfig = () => {
  const { user } = useAuth();

  const { data: allVipLevelConfig, refetch } = useQuery({
    queryKey: ['vip-config'],
    queryFn: () => getVipConfig(),
    enabled: !!user,
    // refetchOnMount: true,
  });

  return {
    allVipLevelConfig,
    refetch,
  };
};

export const QueryVipNextLevelConfig = () => {
  const { status } = useAuth();

  const { data: vipNextLevelConfig, refetch } = useQuery({
    queryKey: ['vip-next-level-config'],
    queryFn: () => getVipConfig(status?.vip ? status?.vip + 1 : 0 + 1),
    enabled: !!status,
    refetchOnMount: true,
  });

  return {
    vipNextLevelConfig,
    refetch,
  };
};

export const QueryMyVipLevelConfig = () => {
  const { user, status } = useAuth();

  const { data: myVipLevelConfig, refetch } = useQuery({
    queryKey: ['vip-config', status?.vip],
    queryFn: () => getVipConfig(status?.vip),
    enabled: !!user,
    refetchOnMount: true,
  });

  return {
    myVipLevelConfig,
    refetch,
  };
};

export const QueryClaim = () => {
  const { user } = useAuth();

  const { data: myClaim, refetch } = useQuery({
    queryKey: ['claim'],
    queryFn: () => getClaim(),
    enabled: !!user,
    refetchOnMount: true,
  });

  return {
    myClaim,
    refetch,
  };
};
