import { ScrollToTop } from '@/routes';
import { paths } from '@/routes/paths';
import { useThemeStore } from '@/store/theme';
import { backButton, miniApp } from '@telegram-apps/sdk-react';
import { ReactNode, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';

interface BaseLayoutProps {
  children?: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { background, safeAreaInsets, contentSafeAreaInsets } = useThemeStore();


  useEffect(() => {
    if (backButton.isMounted() && backButton.isSupported()) {
      if (pathname === paths.main.casino.root) {
        backButton.hide();
      } else {
        backButton.show();
      }
    }

    if (miniApp.isMounted() && miniApp.isSupported()) {
      miniApp.setBackgroundColor('#15191E');
      miniApp.setHeaderColor('#15191E');
    }

    if (backButton.isMounted() && backButton.isSupported()) {
      return backButton.onClick(() => {
        navigate(-1);
      });
    }
  }, []);

  // 计算安全区域的值
  const topInset = safeAreaInsets.top + contentSafeAreaInsets.top;
  const bottomInset = safeAreaInsets.bottom + contentSafeAreaInsets.bottom;

  return (
    <div
      className="bg-base-300 isolate flex min-h-screen flex-col"
      style={{
        background,
        // 使用类型断言解决CSS变量的TypeScript类型问题
        ['--safe-area-top' as string]: `${topInset}px`,
        ['--safe-area-bottom' as string]: `${bottomInset}px`,
      }}
    >
      <Header />
      <ScrollToTop />
      <main className="hide-scrollbar flex h-full flex-1 flex-col">{children || <Outlet />}</main>
    </div>
  );
}
