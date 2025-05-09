import { signOut } from '@/cookies/sign';
import { router } from '@/routes';
import { paths } from '@/routes/paths';
import { getAuth } from '@/utils/auth';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import axios from 'axios';
import { toast } from 'sonner';
import i18next from 'i18next';

const API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL;
  const apiUrl = '/api';
  if (envUrl) {
    return envUrl + apiUrl;
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:3000' + apiUrl;
  }
  return apiUrl;
})();

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isNotFound() {
    return this.status === 404;
  }
}

// Helper function to build URL with query parameters
function buildUrlWithParams(endpoint: string, options: RequestInit & { params?: Record<string, any> }): string {
  let url = `${API_BASE_URL}${endpoint}`;

  // 初始化参数对象，包含时间戳以防止缓存
  const params = {
    ...options.params,
    _t: Date.now(), // 添加时间戳到所有请求
  };

  // 如果有参数，将它们添加到 URL
  if (params && typeof params === 'object') {
    // Convert params object to URLSearchParams
    const searchParams = new URLSearchParams();

    // Add non-null and non-undefined params
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    // Append search params to URL if any exist
    const searchString = searchParams.toString();
    if (searchString) {
      // Check if URL already has query parameters
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}${searchString}`;
    }
  }

  return url;
}

// Base API request function that handles common logic
async function fetchApiBase(url: string, options: RequestInit, headers: Record<string, string> = {}) {
  // const response = await fetch(url, {
  //   ...options,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     ...headers,
  //     ...options.headers,
  //   },
  // });

  // if (!response.ok) {
  //   const error = await response.json().catch(() => ({ message: 'Unknown error' }));
  //   throw new ApiError(response.status, error.message);
  // }
  const { method, body } = options;

  const response = await axios
    .request({
      url,
      method,
      data: body,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    .catch((error) => {
      console.log('error', error);
      const status = error.response?.status || 500;
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || error.message || 'Unknown error';

      // 处理网络错误
      if (error?.code === 'ERR_NETWORK') {
        // console.error('Network error:', error);
        // throw new ApiError(503, 'Network error, please check your connection');
        router.navigate(paths.information.noInternetConnection);
      }

      // 处理认证错误
      if (status === 401) {
        signOut();
        router.navigate(paths.information.otherActiveSession);
      }

      // 处理资源未找到
      if (status === 404) {
        // console.log('Resource not found at:', url);
        // throw new ApiError(404, 'Resource not found');
        router.navigate(paths.information.emptyStateNoContent);
      }

      // 处理服务器错误
      if (status >= 500) {
        // console.error('Server error:', error);
        // router.navigate(paths.information.tooManyRequest);
        toast.error(i18next.t('common.serverError'));
      }

      // 处理其他错误
      throw new ApiError(status, errorMessage, errorData);
    });
  return response.data;
}

export async function fetchApiByTMA(endpoint: string, options: RequestInit & { params?: Record<string, any> } = {}) {
  const tmaToken = import.meta.env.DEV ? import.meta.env.VITE_TMA_TOKEN : retrieveLaunchParams().initDataRaw;
  const url = buildUrlWithParams(endpoint, options);

  return fetchApiBase(url, options, {
    Authorization: `tma ${tmaToken}`,
  });
}

export async function fetchApiByToken(endpoint: string, options: RequestInit & { params?: Record<string, any> } = {}) {
  const auth = getAuth();
  const url = buildUrlWithParams(endpoint, options);

  // Handle FormData requests specially
  if (options.body instanceof FormData) {
    const headers = new Headers({
      auth: JSON.stringify(auth),
      ...(options.headers as Record<string, string>),
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const status = response.status;
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || 'Unknown error';

        if (status === 401) {
          console.log('Unauthorized access. Authentication required.');
        } else if (status === 404) {
          console.log('Resource not found at:', url);
        }

        throw new ApiError(status, errorMessage, errorData);
      }

      return {
        data: await response.json(),
        status: response.status,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, (error as Error).message);
    }
  }

  return fetchApiBase(url, options, {
    auth: JSON.stringify(auth),
  });
}

export async function fetchApi(endpoint: string, options: RequestInit & { params?: Record<string, any> } = {}, headers: Record<string, string> = {}) {
  const url = buildUrlWithParams(endpoint, options);
  return fetchApiBase(url, options, headers);
}
