import { Dock } from '@/components/dock';
import { Menu } from '@/components/menu';
import { ScrollToTop } from '@/routes';
import { paths } from '@/routes/paths';
import { useMenuStore } from '@/store/menu';
import { useThemeStore } from '@/store/theme';
import { backButton, miniApp } from '@telegram-apps/sdk-react';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSystem } from '@/hooks';

import Header from './Header';

interface DockLayoutProps {
  children?: React.ReactNode;
}

export default function DockLayout({ children }: DockLayoutProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { background, safeAreaInsets, contentSafeAreaInsets } = useThemeStore();
  const { isMenuOpen, setIsMenuOpen } = useMenuStore();
  const { isMobile } = useSystem();

  useEffect(() => {
    if (backButton.isMounted() && backButton.isSupported()) {
      if (pathname === paths.main.casino.root) {
        if (isMenuOpen) {
          backButton.show();
        } else {
          backButton.hide();
        }
      } else {
        backButton.show();
      }
    }

    if (miniApp.isMounted() && miniApp.isSupported()) {
      miniApp.setBackgroundColor('#191E24');
      miniApp.setHeaderColor('#191E24');
    }

    if (backButton.isMounted() && backButton.isSupported()) {
      return backButton.onClick(() => {
        if (isMenuOpen) {
          setIsMenuOpen(false);
        } else {
          navigate(-1);
        }
      });
    }
  }, [isMenuOpen, pathname]);

  // 计算安全区域的值
  const topInset = safeAreaInsets.top + contentSafeAreaInsets.top;
  const bottomInset = safeAreaInsets.bottom + contentSafeAreaInsets.bottom;

  return (
    <div
      className="bg-base-300 flex min-h-screen flex-col"
      style={{
        background,
        // 使用类型断言解决CSS变量的TypeScript类型问题
        ['--safe-area-top' as string]: `${topInset}px`,
        ['--safe-area-bottom' as string]: `${bottomInset}px`,
      }}
    >
      <Header />
      <ScrollToTop />
      <main className="flex-1 overflow-hidden">{children || <Outlet />}</main>
      {isMobile && <Dock />}
      <Menu />
    </div>
  );
}
