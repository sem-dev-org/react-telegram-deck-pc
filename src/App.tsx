import { AuthProvider } from '@/contexts/auth';
import { LanguageProvider } from '@/contexts/language';
import { router } from '@/routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { on, viewport } from '@telegram-apps/sdk-react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useThemeStore } from './store/theme';
import ErrorBoundary from './components/ErrorBoundary';
import { useSystem } from '@/hooks';

import './styles/animations.css';
import './styles/base.css';
import './styles/effects.css';
import './styles/rtl.css';
import './styles/chat.css';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: Infinity, // 数据永不过期
      refetchOnMount: false, // 组件挂载时不重新获取
      refetchOnWindowFocus: false, // 窗口聚焦时不重新获取
      refetchOnReconnect: false, // 重新连接时不重新获取
    },
  },
});

export default function App() {
  const { setSafeAreaInsets, setContentSafeAreaInsets, safeAreaInsets, contentSafeAreaInsets } = useThemeStore();
  const { getUrlParams } = useSystem();

  useEffect(() => {
    getUrlParams();
  }, []);

  on('safe_area_changed', () => {
    const { top, bottom } = viewport.safeAreaInsets();
    setSafeAreaInsets({ top, bottom });
  });

  on('content_safe_area_changed', () => {
    const { top, bottom } = viewport.contentSafeAreaInsets();
    setContentSafeAreaInsets({ top, bottom });
  });

  on('viewport_changed', () => {
    const { top, bottom } = viewport.safeAreaInsets();
    setSafeAreaInsets({ top, bottom });

    const { top: contentTop, bottom: contentBottom } = viewport.contentSafeAreaInsets();
    setContentSafeAreaInsets({ top: contentTop, bottom: contentBottom });
  });

  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <Toaster
              richColors
              position="top-center"
              mobileOffset={{ top: safeAreaInsets.top + contentSafeAreaInsets.top }}
            />
            <RouterProvider router={router} />
          </LanguageProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
