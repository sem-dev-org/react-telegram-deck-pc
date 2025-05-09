import {
  claimBonus,
  getCalendarBonus,
  getConquests,
  getConquestsCompleted,
  getConquestsReward,
  getDepositBonusConfig,
  getUserClaims,
} from '@/api/bonus';
import { useAuth } from '@/contexts/auth';
import { IConquest, IDepositBonusConfig } from '@/types/bonus';
import { ApiBusinessError } from '@/utils/enhancedApiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Get deposit bonus config
 *
 * @returns Promise that resolves to the deposit bonus config
 */
export const useDepositBonusConfig = () => {
  return useQuery<IDepositBonusConfig[], ApiBusinessError>({
    queryKey: ['depositBonusConfig'],
    queryFn: () => getDepositBonusConfig(),
  });
};

/**
 * Get user claims
 *
 * @returns Promise that resolves to the user claims
 */
export const useUserClaims = (params?: { item: string }) => {
  const { user } = useAuth();
  return useQuery<any, ApiBusinessError>({
    queryKey: ['userClaims', params],
    queryFn: () => getUserClaims(params),
    enabled: !!user,
  });
};

/**
 * Claim bonus mutation
 *
 * @returns Mutation object with isPending, isError, etc.
 */
export const useClaimBonus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { item: string; currency?: string }) => claimBonus(params),
    onSuccess: (_, variables) => {
      // 成功后刷新相关查询
      queryClient.invalidateQueries({
        queryKey: ['userClaims', { item: variables.item }],
      });
      queryClient.invalidateQueries({
        queryKey: ['userClaims'],
      });
    },
  });
};

/**
 * Get calendar bonus
 *
 * @returns Promise that resolves to the calendar bonus
 */
export const useCalendarBonus = () => {
  const { user } = useAuth();

  return useQuery<any, ApiBusinessError>({
    queryKey: ['calendarBonus'],
    queryFn: () => getCalendarBonus(),
    enabled: !!user,
  });
};

/**
 * Get conquests
 */
export const useGetConquests = () => {
  const { user } = useAuth();

  return useQuery<IConquest[], ApiBusinessError>({
    queryKey: ['conquests'],
    queryFn: () => getConquests(),
    enabled: !!user,
  });
};

/**
 * Get conquests completed
 */
export const useGetConquestsCompleted = () => {
  const { user } = useAuth();

  return useQuery<any, ApiBusinessError>({
    queryKey: ['conquestsCompleted'],
    queryFn: () => getConquestsCompleted(),
    enabled: !!user,
  });
};

/**
 * Get conquests reward
 */
export const useGetConquestsReward = () => {
  const { user } = useAuth();

  return useQuery<any, ApiBusinessError>({
    queryKey: ['conquestsReward'],
    queryFn: () => getConquestsReward(),
    enabled: !!user,
  });
};
