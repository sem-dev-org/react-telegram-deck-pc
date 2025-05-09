import { fetchApi, fetchApiByToken } from '@/api/client';
import { getAuth } from '@/utils/auth';

/**
 * Extended RequestInit to include params for query parameters
 */
export interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
  body?: any;
}

/**
 * Standard API response interface
 */
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

/**
 * Error thrown when API returns a non-zero code
 */
export class ApiBusinessError extends Error {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiBusinessError';
  }
}

/**
 * Options for makeApiRequest
 */
export interface ApiRequestOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  requiresAuth?: boolean;
  successMessage?: string;
}

/**
 * Enhanced API request handler that processes the standard response format and handles errors
 *
 * @param requestFn The function that performs the actual API request
 * @param options Configuration options
 * @returns The data field from the API response if successful
 * @throws ApiBusinessError if the API returns a non-zero code
 */
export async function makeApiRequest<T>(
  requestFn: () => Promise<ApiResponse<T>>,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { showSuccessToast = false, showErrorToast = true, requiresAuth = false, successMessage } = options;

  // Check if authentication is required
  if (requiresAuth && !getAuth()) {
    const error = new ApiBusinessError(-1, 'Authentication required');
    // if (showErrorToast) {
    //   toast.error(error.message);
    // }
    throw error;
  }

  try {
    // Execute the API request
    const response = await requestFn();

    // Check if the response indicates an error
    if (response.code !== 0) {
      const error = new ApiBusinessError(response.code, response.msg || 'Unknown error');
      // if (showErrorToast) {
      //   toast.error(error.message);
      // }
      throw error;
    }

    // Show success toast if needed
    if (showSuccessToast && (successMessage || response.msg)) {
      // toast.success(successMessage || response.msg);
    }

    // Return the data (with null check)
    return response.data as T;
  } catch (error) {
    // Handle unexpected errors
    if (!(error instanceof ApiBusinessError) && showErrorToast) {
      // toast.error((error as Error)?.message || 'Network error occurred');
    }
    throw error;
  }
}

/**
 * Create a public API request (no authentication required)
 */
export function createPublicApiRequest<T = any>(
  endpoint: string,
  method: string = 'get',
  options: RequestOptions = {},
  apiOptions: ApiRequestOptions = {},
) {
  const { params, ...requestOptions } = options;

  const fetchOptions: RequestOptions = {
    method,
    ...requestOptions,
  };

  // Add params to options if they exist
  if (params) {
    fetchOptions.params = params;
  }

  // Add body if not GET/HEAD and body exists
  if (options.body && method.toLowerCase() !== 'get' && method.toLowerCase() !== 'head') {
    fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  return makeApiRequest<T>(() => fetchApi(endpoint, fetchOptions), apiOptions);
}

/**
 * Create an authenticated API request
 */
export function createAuthenticatedApiRequest<T = any>(
  endpoint: string,
  method: string = 'get',
  options: RequestOptions = {},
  apiOptions: ApiRequestOptions = {},
) {
  const { params, ...requestOptions } = options;

  const fetchOptions: RequestOptions = {
    method,
    ...requestOptions,
  };

  // Add params to options if they exist
  if (params) {
    fetchOptions.params = params;
  }

  // Add body if not GET/HEAD and body exists
  if (options.body && method.toLowerCase() !== 'get' && method.toLowerCase() !== 'head') {
    fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  return makeApiRequest<T>(() => fetchApiByToken(endpoint, fetchOptions), { ...apiOptions, requiresAuth: true });
}
