import { GameListParams, getCommonGameList, getUserGameList } from '@/api/game';
import { BetHistoryQueryParams, getUserBetHistory } from '@/api/transaction';
import { useAuth } from '@/contexts/auth';
import { IGame } from '@/types/game';
import { BetHistoryResponse } from '@/types/transaction';
import { ApiBusinessError } from '@/utils/enhancedApiClient';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook for fetching games list with common parameters
 *
 * @param params Query parameters for filtering and pagination
 * @returns Query result containing games data
 */
export const useGameList = (params?: GameListParams) => {
  return useQuery<IGame[], ApiBusinessError>({
    queryKey: ['games', 'common', params],
    queryFn: async () => {
      return getCommonGameList(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry for business logic errors
      if (error instanceof ApiBusinessError) {
        return false;
      }
      // Retry network errors up to 3 times
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching hot games list
 *
 * @returns Query result containing hot games data
 */
export const useHotGames = () => {
  return useGameList({ type: 'hot' });
};

/**
 * Hook for fetching recently played games
 *
 * @returns Query result containing recently played games data
 */
export const useRecentGames = () => {
  const { user } = useAuth();

  return useQuery<IGame[], ApiBusinessError>({
    queryKey: ['games', 'recent'],
    queryFn: async () => {
      return getUserGameList({ type: 'recent' });
    },
    enabled: !!user, // Only fetch if user is logged in
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry for business logic errors
      if (error instanceof ApiBusinessError) {
        return false;
      }
      // Retry network errors up to 3 times
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching favorite games
 *
 * @returns Query result containing favorite games data
 */
export const useFavoriteGames = () => {
  const { user } = useAuth();

  return useQuery<IGame[], ApiBusinessError>({
    queryKey: ['games', 'favorites'],
    queryFn: async () => {
      return getUserGameList({ type: 'favorites' });
    },
    enabled: !!user, // Only fetch if user is logged in
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry for business logic errors
      if (error instanceof ApiBusinessError) {
        return false;
      }
      // Retry network errors up to 3 times
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching crash games
 */
export const useCrashGames = () => {
  return useGameList({ type: 'crash' });
};

/**
 * Hook for fetching slots games
 */
export const useSlotsGames = () => {
  return useGameList({ type: 'slots' });
};

/**
 * Hook for fetching live games
 */
export const useLiveGames = () => {
  return useGameList({ type: 'live' });
};

/**
 * Hook for fetching user bet history
 */
export const useUserBetHistory = (params?: BetHistoryQueryParams) => {
  const { user } = useAuth();

  return useQuery<BetHistoryResponse, ApiBusinessError>({
    queryKey: ['betHistory', params],
    queryFn: async () => {
      const response = await getUserBetHistory(params);
      console.log('Raw API response:', response);

      // 如果响应已经是BetHistoryResponse格式，直接返回
      if (response && typeof response.code !== 'undefined') {
        return response as BetHistoryResponse;
      }

      // 否则，包装响应以匹配预期的BetHistoryResponse格式
      return {
        code: 0,
        msg: 'success',
        data: Array.isArray(response) ? response : [],
        pagination: {
          total: Array.isArray(response) ? response.length : 0,
          per_page: params?.page_size || 20,
          current_page: params?.page || 1,
          last_page: 1,
          has_more: false,
        },
      };
    },
    enabled: !!user, // Only fetch if user is logged in
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry for business logic errors
      if (error instanceof ApiBusinessError) {
        return false;
      }
      // Retry network errors up to 3 times
      return failureCount < 3;
    },
  });
};
