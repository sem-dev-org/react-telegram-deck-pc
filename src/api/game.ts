/**
 * 游戏相关API
 * V2.0 (2025-04-05)
 * Ray
 */
import { IGame } from '@/types/game';
import { createPublicApiRequest, createAuthenticatedApiRequest } from '@/utils/enhancedApiClient';

/**
 * Game list query parameters interface
 */
export interface GameListParams {
  /** 每页显示数量 (默认: 20) */
  limit?: number;
  /** 当前页码 (默认: 1) */
  page?: number;
  /** 游戏类型筛选 (默认: all) - 可选值: all(全部)、hot(热门)、crash、slots(老虎机)、live(真人游戏)、recent(最近)、favorites(收藏) */
  type?: 'all' | 'hot' | 'crash' | 'slots' | 'live' | 'recent' | 'favorites';
  /** 游戏提供商筛选 (默认: all) - 多个提供商用逗号分隔 */
  providers?: string;
  /** 排序方式 (默认: seq desc) - 可选值: seq desc(默认排序)、a-z(名称升序)、z-a(名称降序)、popular(人气排序)、newest(最新排序) */
  sort?: 'seq desc' | 'a-z' | 'z-a' | 'popular' | 'newest';
  /** 搜索关键词，按游戏名称模糊搜索 */
  keyword?: string;
}

/**
 * Get common game list (no auth)
 * @param params Query parameters for filtering and pagination
 * @returns Promise<IGame[]>
 */
export const getCommonGameList = async (params?: GameListParams) => {
  return createPublicApiRequest<IGame[]>('/GameList/getCommonGameList', 'get', { params });
};

/**
 * Get user game list (auth)
 * @param params Query parameters for filtering and pagination
 * @returns Promise<IGame[]>
 */
export const getUserGameList = async (params?: GameListParams) => {
  return createAuthenticatedApiRequest<IGame[]>('/GameList/getUserGameList', 'get', { params });
};

export interface UserBetHistoryParams {
  game_type: string;
  asset: string;
  time_range: string;
  limit?: number;
  page?: number;
}
/**
 * Get user bet history
 * @param params Query parameters for filtering and pagination
 * @returns Promise<IGame[]>
 */
export const getUserBetHistory = async (params?: GameListParams) => {
  return createAuthenticatedApiRequest<IGame[]>('/GameOrder/getBetHistory', 'get', { params });
};
