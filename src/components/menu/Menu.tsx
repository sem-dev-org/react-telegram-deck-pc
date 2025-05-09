import { languages } from '@/_mock/languages';
import { useAuth } from '@/contexts/auth';
import { useLanguage } from '@/contexts/language';
import { paths } from '@/routes/paths';
import { WalletSelectDialog } from '@/sections/casino/CurrencySelectDrawer';
import ProfileLanguageModal from '@/sections/profile/ProfileLanguageModal';
import { useThemeStore } from '@/store/theme';
import { hapticFeedback } from '@telegram-apps/sdk-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSystem } from '@/hooks';
import { useMenuStore } from '../../store/menu';

// First, create a function to get state management hooks to use in menu array
const menu = (t: (key: string) => string) => [
  {
    id: 'casino',
    name: t('menu:casino'),
    icon: '/icons/menu/menu-icons-0.svg',
    children: [
      {
        id: 'hot',
        name: t('menu:hot'),
        icon: '/icons/menu/menu-icons-1.svg',
        link: `${paths.main.explore.root}?category=hot`,
      },
      {
        id: 'recents',
        name: t('menu:recents'),
        icon: '/icons/menu/menu-icons-2.svg',
        link: `${paths.main.explore.root}?category=recent`,
        isLogin: true,
      },
      {
        id: 'favorites',
        name: t('menu:favorites'),
        icon: '/icons/menu/menu-icons-7.svg',
        link: `${paths.main.explore.root}?category=favorites`,
        isLogin: true,
      },
      {
        id: 'newReleases',
        name: t('menu:newReleases'),
        icon: '/icons/menu/menu-icons-3.svg',
        link: `${paths.main.explore.root}?category=new_release`,
      },
      // {
      //   name: t('menu:exclusives'),
      //   icon: '/icons/menu/menu-icons-4.svg',
      //   link: `${paths.main.explore.root}?category=exclusive`,
      // },
      {
        id: 'slots',
        name: t('menu:slots'),
        icon: '/icons/menu/menu-icons-5.svg',
        link: `${paths.main.explore.root}?category=slots`,
      },
      {
        id: 'crashGames',
        name: t('menu:crashGames'),
        icon: '/icons/menu/menu-icons-6.svg',
        link: `${paths.main.explore.root}?category=crash`,
      },
      {
        id: 'liveDealer',
        name: t('menu:liveDealer'),
        icon: '/icons/menu/menu-icons-8.svg',
        link: `${paths.main.explore.root}?category=live`,
      },
      {
        id: 'tableGames',
        name: t('menu:tableGames'),
        icon: '/icons/menu/menu-icons-9.svg',
        link: `${paths.main.explore.root}?category=table`,
      },
      {
        id: 'gameShows',
        name: t('menu:gameShows'),
        icon: '/icons/menu/menu-icons-10.svg',
        link: `${paths.main.explore.root}?category=game_shows`,
      },
      {
        id: 'providers',
        name: t('menu:providers'),
        icon: '/icons/menu/menu-icons-11.svg',
        link: `${paths.main.explore.root}?category=providers`,
      },
    ],
  },
  // {
  //   id:'crypto',
  //   name: t('menu:crypto'),
  //   icon: '/icons/menu/menu-icons-12.svg',
  //   showArrow: true,
  // },
  // {
  //   id:'sports',
  //   name: t('menu:sports'),
  //   icon: '/icons/menu/menu-icons-13.svg',
  //   showArrow: true,
  // },
  {
    id: 'bonus',
    name: t('menu:bonus'),
    icon: '/icons/menu/menu-icons-14.svg',
    children: [
      // {
      //   id: 'welcomePack',
      //   name: t('menu:welcomePack'),
      //   icon: '/icons/menu/menu-icons-19.svg',
      // },
      {
        id: 'bonusPage',
        name: t('menu:bonus'),
        icon: '/icons/menu/menu-icons-20.svg',
        link: paths.main.bonus.root,
      },
      {
        id: 'promotions',
        name: t('menu:promotions'),
        icon: '/icons/menu/menu-icons-21.svg',
        link: paths.main.vip.root,
      },
      {
        id: 'tournaments',
        name: t('menu:tournaments'),
        icon: '/icons/menu/menu-icons-22.svg',
        link: paths.main.tournament.root,
      },
      {
        id: 'referralProgram',
        name: t('menu:referralProgram'),
        icon: '/icons/menu/menu-icons-23.svg',
        link: paths.main.referral.root,
      },
      {
        id: 'vipClub',
        name: t('menu:vipClub'),
        icon: '/icons/menu/menu-icons-24.svg',
        link: paths.main.vip.root,
      },
    ],
    tag: 'HOT',
  },
  {
    id: 'legal',
    name: t('menu:legal'),
    icon: '/icons/menu/menu-icons-15.svg',
    children: [
      {
        id: 'aboutUs',
        name: t('menu:aboutUs'),
        icon: '/icons/menu/menu-icons-25.svg',
        link: paths.legal.aboutUs,
      },
      {
        id: 'responsibleGaming',
        name: t('menu:responsibleGaming'),
        icon: '/icons/menu/menu-icons-26.svg',
        link: paths.legal.responsibleGaming,
      },
      {
        id: 'termsOfService',
        name: t('menu:termsOfService'),
        icon: '/icons/menu/menu-icons-27.svg',
        link: paths.legal.termOfService,
      },
      {
        id: 'fairness',
        name: t('menu:fairness'),
        icon: '/icons/menu/menu-icons-28.svg',
        link: paths.legal.fairness,
      },
    ],
  },
  {
    id: 'support',
    name: t('menu:support'),
    icon: '/icons/menu/menu-icons-16.svg',
    children: [
      {
        id: 'liveSupport',
        name: t('menu:liveSupport'),
        icon: '/icons/menu/menu-icons-29.svg',
        link: paths.main.chat.root + '?tab=support',
      },
      // {
      //   id: 'news',
      //   name: t('menu:news'),
      //   icon: '/icons/menu/menu-icons-30.svg',
      // },
      {
        id: 'faq',
        name: t('menu:faq'),
        icon: '/icons/menu/menu-icons-25.svg',
        link: paths.legal.faq,
      },
    ],
  },
];

// 递归渲染菜单项的组件
const MenuItem = ({ item, onClick }: { item: any; onClick?: () => void }) => {
  const navigate = useNavigate();
  const { setIsMenuOpen } = useMenuStore();
  const { user } = useAuth();
  const isDefaultOpen = item.id === 'casino';
  const [isOpen, setIsOpen] = useState(isDefaultOpen);
  const { checkPageNavToApp } = useSystem();

  // Skip rendering if item requires login and user is not logged in
  if (item.isLogin && !user) {
    navigate(paths.login);
  }

  const handleClick = (link?: string) => {
    if (checkPageNavToApp()) return;

    if (hapticFeedback.isSupported()) {
      hapticFeedback.impactOccurred('medium');
    }

    if (link) {
      navigate(link);
      setIsMenuOpen(false);
    } else if (item.onClick) {
      item.onClick();
    } else if (onClick) {
      onClick();
    }
  };

  // 如果有子菜单且不为空，则渲染为details/summary结构
  if (item.children && item.children.length > 0) {
    return (
      <li>
        <details open={isOpen} onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}>
          <summary className="summary-no-marker menu-summary-item flex h-[40px] items-center justify-between gap-2 px-4">
            <div className="flex items-center gap-2">
              <img src={item.icon} alt={item.name} className="h-5 w-5" />
              <span className="text-neutral-content text-base">{item.name}</span>
            </div>
            <div className="flex items-center">
              {item.tag && <div className="badge badge-error mr-2 h-[20px]">{item.tag}</div>}

              <div
                className="bg-neutral h-5 w-5 rounded-sm transition-transform duration-100 ease-in-out"
                style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.20938 14.7698C6.92228 14.4713 6.93159 13.9965 7.23017 13.7094L11.1679 10L7.23017 6.29062C6.93159 6.00353 6.92228 5.52875 7.20938 5.23017C7.49647 4.93159 7.97125 4.92228 8.26983 5.20937L12.7698 9.45937C12.9169 9.60078 13 9.79599 13 10C13 10.204 12.9169 10.3992 12.7698 10.5406L8.26983 14.7906C7.97125 15.0777 7.49647 15.0684 7.20938 14.7698Z"
                    fill="#A6ADBB"
                  />
                </svg>
              </div>
            </div>
          </summary>
          <ul className="m-0 p-0">
            {item.children.map((child: any) => (
              <MenuItem key={child.name} item={child} onClick={onClick} />
            ))}
          </ul>
        </details>
      </li>
    );
  }

  // 没有子菜单，渲染为普通菜单项
  return (
    <li>
      <a className="flex h-[40px] items-center justify-between gap-2 px-4" onClick={() => handleClick(item.link)}>
        <div className="flex items-center gap-2">
          <img src={item.icon} alt={item.name} className="h-5 w-5" />
          <span className="text-neutral-content text-base">{item.name}</span>
        </div>
        <div className="flex items-center">
          {item.tag && <div className="badge badge-error mr-2 h-[20px]">{item.tag}</div>}
          {item.showArrow && (
            <div
              className="bg-neutral h-5 w-5 rounded-sm transition-transform duration-100 ease-in-out"
              style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
            >
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.20938 14.7698C6.92228 14.4713 6.93159 13.9965 7.23017 13.7094L11.1679 10L7.23017 6.29062C6.93159 6.00353 6.92228 5.52875 7.20938 5.23017C7.49647 4.93159 7.97125 4.92228 8.26983 5.20937L12.7698 9.45937C12.9169 9.60078 13 9.79599 13 10C13 10.204 12.9169 10.3992 12.7698 10.5406L8.26983 14.7906C7.97125 15.0777 7.49647 15.0684 7.20938 14.7698Z"
                  fill="#A6ADBB"
                />
              </svg>
            </div>
          )}
        </div>
      </a>
    </li>
  );
};

export const Menu = (props: { fromIndex?: boolean }) => {
  const { t } = useTranslation();
  const { user, status } = useAuth();
  const { isMenuOpen, setIsMenuOpen } = useMenuStore();
  const { safeAreaInsets, contentSafeAreaInsets } = useThemeStore();

  const [openCurrencySelectDrawer, setOpenCurrencySelectDrawer] = useState(false);
  const [openLanguageModal, setOpenLanguageModal] = useState(false);

  // Create menu items
  const menuItems = menu(t);

  const { currentLanguage } = useLanguage();

  const language = languages.find((lang) => lang.value === currentLanguage)?.label;

  const navigate = useNavigate();
  const { isMobile } = useSystem();

  // const isShowMenu = !isMobile || isMenuOpen;
  const isShowMenu = isMenuOpen;

  const MenuView = () => {
    return (
      <ul className="menu menu-md text-base-content w-full gap-1 p-0">
        {menuItems.map((item: any) => (
          <MenuItem key={item.name} item={item} />
        ))}
        <MenuItem
          item={{
            name: language,
            icon: '/icons/menu/menu-icons-17.svg',
            showArrow: true,
            onClick: () => setOpenLanguageModal(true),
          }}
        />
        {user?.currency_fiat && (
          <MenuItem
            item={{
              name: user?.currency_fiat?.toUpperCase(),
              icon: `/icons/currency/${user?.currency_fiat?.toLocaleLowerCase()}.svg`,
              showArrow: true,
            }}
            onClick={() => setOpenCurrencySelectDrawer(true)}
          />
        )}
      </ul>
    );
  };

  // PC端展示
  if (!isMobile && props.fromIndex) {
    return (
      <>
        <style>{`
        .menu-summary-item::after {
          display: none ;
        }
      `}</style>
        <div className="relative w-65">
          <div
            className={`hide-scrollbar z-50 flex h-full flex-col py-3 pb-[100px]`}
            style={{
              paddingTop: safeAreaInsets.top + contentSafeAreaInsets.top,
              // 设置固定定位，使其不受页面滚动影响
              position: 'fixed',
              // 允许内部内容滚动
              overflowY: 'auto',
            }}
          >
            <div className="w-65">
              <MenuView />
            </div>
          </div>
        </div>
      </>
    );
  }

  // 移动端以Drawer形式展示菜单
  return (
    <>
      <style>{`
        .menu-summary-item::after {
          display: none ;
        }
      `}</style>
      <div className="drawer">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isShowMenu}
          onChange={() => setIsMenuOpen(!isMenuOpen)}
        />
        <div
          className={`drawer-side hide-scrollbar z-50 flex flex-col gap-1 px-6 py-3 pb-[100px]`}
          style={{
            paddingTop: safeAreaInsets.top + contentSafeAreaInsets.top,
            background:
              'linear-gradient(180deg, color(display-p3 0.102 0.133 0.169) 0%, color(display-p3 0.082 0.098 0.118) 100%)',
            boxShadow:
              '0px 1px 3px color(display-p3 0.000 0.000 0.000 / 0.1), 0px 1px 2px color(display-p3 0.000 0.000 0.000 / 0.06)',
          }}
        >
          <div
            className="mt-3 flex w-full items-center gap-4 rounded-lg p-4"
            style={{
              background:
                'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 0.200 0.882 0.741 / 0.4) 0%, color(display-p3 0.114 0.137 0.165 / 0.4) 100%), color(display-p3 0.114 0.137 0.165)',
            }}
            onClick={() => {
              navigate(paths.main.finance.deposit);
            }}
          >
            <img src="/icons/isometric/1.svg" className="h-12 w-12" />
            <div className="flex flex-col">
              <div className="flex items-center">
                <p className="text-base font-bold">
                  {status?.deposit_times === 0
                    ? t('finance:first')
                    : status?.deposit_times === 1
                      ? t('finance:second')
                      : status?.deposit_times === 2
                        ? t('finance:third')
                        : t('finance:fourth')}{' '}
                  {t('menu:depositBonus')}
                </p>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.20938 14.7698C6.92228 14.4713 6.93159 13.9965 7.23017 13.7094L11.1679 10L7.23017 6.29062C6.93159 6.00353 6.92228 5.52875 7.20938 5.23017C7.49647 4.93159 7.97125 4.92228 8.26983 5.20937L12.7698 9.45937C12.9169 9.60078 13 9.79599 13 10C13 10.204 12.9169 10.3992 12.7698 10.5406L8.26983 14.7906C7.97125 15.0777 7.49647 15.0684 7.20938 14.7698Z"
                    fill="#A6ADBB"
                  />
                </svg>
              </div>
              <p className="text-primary text-sm">{t('menu:boostYourDepositBonusTo')} 1200%</p>
            </div>
          </div>
          <MenuView />
        </div>
      </div>

      <WalletSelectDialog
        selectedCurrency={user?.currency_fiat ?? 'USD'}
        openWallet={openCurrencySelectDrawer}
        handleWalletSettingsClose={() => setOpenCurrencySelectDrawer(false)}
      />
      <ProfileLanguageModal open={openLanguageModal} onClose={() => setOpenLanguageModal(false)} />
    </>
  );
};
