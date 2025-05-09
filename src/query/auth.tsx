import { AuthResponse, getProfile } from '@/api/auth';
import { useAuth } from '@/contexts/auth';
import { ApiBusinessError } from '@/utils/enhancedApiClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Hook for fetching user profile data
 *
 * @returns User profile data and refetch function
 */
export const useUserProfile = () => {
  const { user, updateUser, updateStatus } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<AuthResponse, ApiBusinessError>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      try {
        const response = await getProfile();
        console.log('Profile API response:', response);
        
        // 如果response是undefined或null，记录错误但不要崩溃
        if (!response) {
          console.error('Profile API returned undefined/null response');
          return {} as AuthResponse; // 返回空对象避免崩溃
        }
        
        // 在API调用成功后直接更新Auth Context
        if (response.user) {
          updateUser(response.user);
        }
        if (response.status) {
          updateStatus(response.status);
        }
        
        return response;
      } catch (err) {
        console.error('Error fetching profile:', err);
        throw err;
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5分钟内数据不会被标记为过期
  });

  // 提供一个刷新方法，同时刷新用户资料和依赖于用户数据的查询
  const refreshUserProfile = async () => {
    try {
      const result = await refetch();
      console.log('User profile refreshed, result:', result);
      // 刷新其他可能依赖于用户数据的查询
      queryClient.invalidateQueries({ queryKey: ['userClaims'] });
      return result;
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
      throw err;
    }
  };

  return {
    profileData: data,
    user: data?.user,
    status: data?.status,
    isLoading,
    error,
    refetch,
    refreshUserProfile,
  };
};
