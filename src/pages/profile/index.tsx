import { currencySymbol } from '@/_mock/currency';
import { getTopWageredGames } from '@/api/profile';
import { miniApp } from '@telegram-apps/sdk-react';
import { getVipConfig } from '@/api/referral';
import { FullBleedContainer, Page, SafeContent } from '@/components/ui';
import { CopyBtn } from '@/components/ui/CopyBtn';
import { GameImage } from '@/components/ui/GameImage';
import { Image } from '@/components/ui/Image';
import { useAuth } from '@/contexts/auth';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useTranslate } from '@/hooks/useTranslate';
import { QueryBaseUrl } from '@/query/adTag';
import { QueryCurrency, QueryCurrencyWithBalance } from '@/query/currency';
import { QueryExchangeRate } from '@/query/rateForUSD';
import { QueryMyVipLevelConfig } from '@/query/vip';
import { paths } from '@/routes/paths';
import { WalletSelectDialog } from '@/sections/casino/CurrencySelectDrawer';
import {
  ProfileTabContentGeneral,
  ProfileTabContentIdentityVerification,
  ProfileTabContentLegal,
  ProfileTabContentSecurity,
  ProfileTabContentSessions,
  ProfileTabContentSettings,
} from '@/sections/profile';
import ProfileLanguageModal from '@/sections/profile/ProfileLanguageModal';
import { ReferralSharingModal } from '@/sections/referral/ReferralSharingModal';
import { useThemeStore } from '@/store/theme';
import { TopThreeGames } from '@/types/profile';
import Decimal from 'decimal.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 定义卡片尺寸类型
// type CardSize = 'sm' | 'md' | 'lg';

// 根据尺寸获取样式
// const getSizeStyles = (size: CardSize = 'md') => {
//   const styles = {
//     sm: {
//       container: 'h-[40px] w-[40px]',
//       icon: 'h-6 w-6',
//       badge: 'h-3 w-3 text-[10px]',
//     },
//     md: {
//       container: 'h-[72px] w-[72px]',
//       icon: 'h-10 w-10',
//       badge: 'h-4 w-4 text-xs',
//     },
//     lg: {
//       container: 'h-[96px] w-[96px]',
//       icon: 'h-12 w-12',
//       badge: 'h-5 w-5 text-sm',
//     },
//   };
//   return styles[size];
// };

// Extract card components outside the main component
// const CardShark = memo(({ num, className, size = 'md' }: { num: number; className?: string; size?: CardSize }) => {
//   const styles = getSizeStyles(size);
//   return (
//     <div className={`indicator ${className || ''}`}>
//       {num > 0 && (
//         <span className={`indicator-item badge badge-primary z-20 rounded-full p-0 font-bold ${styles.badge}`}>
//           {num}
//         </span>
//       )}

//       <div
//         className={`flex items-center justify-center rounded-lg ${styles.container}`}
//         style={{
//           background:
//             'radial-gradient(172.66% 100% at 50.49% 0%, color(display-p3 1.000 0.278 0.341 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
//         }}
//       >
//         <img src="/icons/isometric/17.svg" className={styles.icon} />
//       </div>
//     </div>
//   );
// });

// const Phantom = memo(({ num, className, size = 'md' }: { num: number; className?: string; size?: CardSize }) => {
//   const styles = getSizeStyles(size);
//   return (
//     <div className={`indicator ${className || ''}`}>
//       {num > 0 && (
//         <span className={`indicator-item badge badge-primary z-20 rounded-full p-0 font-bold ${styles.badge}`}>
//           {num}
//         </span>
//       )}
//       <div
//         className={`flex items-center justify-center rounded-lg ${styles.container}`}
//         style={{
//           background:
//             'radial-gradient(172.66% 100% at 50.49% 0%, color(display-p3 0.329 0.259 0.831 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
//         }}
//       >
//         <img src="/icons/isometric/18.png" className={styles.icon} />
//       </div>
//     </div>
//   );
// });

// const Deposit = memo(({ num, className, size = 'md' }: { num: number; className?: string; size?: CardSize }) => {
//   const styles = getSizeStyles(size);
//   return (
//     <div className={`indicator ${className || ''}`}>
//       {num > 0 && (
//         <span className={`indicator-item badge badge-primary z-20 rounded-full p-0 font-bold ${styles.badge}`}>
//           {num}
//         </span>
//       )}
//       <div
//         className={`flex items-center justify-center rounded-lg ${styles.container}`}
//         style={{
//           background:
//             'radial-gradient(172.66% 100% at 50.49% 0%, color(display-p3 0.353 0.906 0.792 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
//         }}
//       >
//         <img src="/icons/isometric/1.svg" className={styles.icon} />
//       </div>
//     </div>
//   );
// });

// const Credit = memo(({ num, className, size = 'md' }: { num: number; className?: string; size?: CardSize }) => {
//   const styles = getSizeStyles(size);
//   return (
//     <div className={`indicator${className || ''}`}>
//       {num > 0 && (
//         <span className={`indicator-item badge badge-primary z-20 rounded-full p-0 font-bold ${styles.badge}`}>
//           {num}
//         </span>
//       )}
//       <div
//         className={`flex items-center justify-center rounded-lg ${styles.container}`}
//         style={{
//           background:
//             'radial-gradient(172.66% 100% at 50.49% 0%, color(display-p3 0.439 0.569 0.969 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
//         }}
//       >
//         <img src="/icons/isometric/19.png" className={styles.icon} />
//       </div>
//     </div>
//   );
// });

export default function ProfilePage() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { formatCurrency } = useCurrencyFormatter();
  const [tab, setTab] = useState<'general' | 'legal' | 'settings' | 'security' | 'sessions' | 'identityVerification'>(
    'general',
  );
  const { setBackground } = useThemeStore();

  const [openCurrencySelectDrawer, setOpenCurrencySelectDrawer] = useState(false);
  const [openLanguageModal, setOpenLanguageModal] = useState(false);
  const [vipConfig, setVipConfig] = useState<any>({});

  useEffect(() => {
    setBackground(
      'linear-gradient(143.06deg, color(display-p3 0.247 0.318 0.196 / 0.8) 0%, color(display-p3 0.114 0.137 0.165) 59.07%), color(display-p3 0.082 0.098 0.118)',
    );

    if (miniApp.isMounted() && miniApp.isSupported()) {
      miniApp.setBackgroundColor('#15191E');
      miniApp.setHeaderColor('#15191E');
    }

    return () => {
      setBackground('var(--color-base-300)');
      if (miniApp.isMounted() && miniApp.isSupported()) {
        miniApp.setBackgroundColor('#191E24');
        miniApp.setHeaderColor('#191E24');
      }
    };
  }, []);

  const { baseUrl } = QueryBaseUrl();

  const { user, status } = useAuth();

  const { data: CurrencyData } = QueryCurrencyWithBalance();
  const { displayDecimal } = QueryCurrency(user?.currency_fiat || '');

  const { allRate } = QueryExchangeRate();

  const [topWageredGames, setTopWageredGames] = useState<TopThreeGames[]>([]);

  // useEffect(() => {
  //   if (user) {
  //     updateUser({
  //       username: user?.telegram_username,
  //       avatar: user?.avatar,
  //     }).then((res) => {
  //       console.log(res);
  //     });
  //   }
  // }, [user]);

  useEffect(() => {
    if (status) {
      getVipConfig({ vip: status?.vip + 1 }).then((res) => {
        if (res.code === 0) {
          setVipConfig(res.data);
        }
      });

      getTopWageredGames().then((res) => {
        if (res.code === 0) {
          setTopWageredGames(res.data);
        }
      });
    }
  }, [status]);

  // Then update the state in useEffect when the value changes

  const showCurrencySymbol = useMemo(
    () => currencySymbol.find((item) => item.code === user?.currency_fiat)?.symbol,
    [currencySymbol, user?.currency_fiat],
  );

  const exchangeRateValue = useMemo(() => {
    if (!user?.currency_fiat || Object.keys(allRate).length === 0) return 0;
    return allRate[user?.currency_fiat] || 0;
  }, [allRate, user?.currency_fiat]);

  // Now use the exchangeRateValue in totalRate calculation
  const totalRate = useMemo(() => {
    if (Object.keys(allRate).length === 0 || !CurrencyData?.length || !user?.currency) return '0.00';

    let total = 0;

    CurrencyData.forEach((item) => {
      const balance = item.balance || '0';
      const currency = item.currency;
      const rate = allRate[currency] || 0;
      const result = Decimal(balance).mul(rate).div(exchangeRateValue);
      total += result.toNumber();
    });

    const currencyObj = CurrencyData?.find((item) => item.currency === user.currency);
    if (!currencyObj) return '0.00';

    const finalTotal = Decimal(total).toDecimalPlaces(displayDecimal, Decimal.ROUND_DOWN).toFixed(displayDecimal);
    return isNaN(Number(finalTotal)) ? '0.00' : finalTotal;
  }, [allRate, CurrencyData, user?.currency, exchangeRateValue]);

  // const rateValue = useMemo(() => {
  //   if (user?.currency_fiat === 'USD') {
  //     return 1;
  //   }

  //   if (!user?.currency_fiat || Object.keys(allRate).length === 0) return 0;

  //   return allRate[user?.currency_fiat] || 0;
  // }, [allRate, user?.currency_fiat]);

  // Memoize the total wagered amount
  // const totalWageredAmount = useMemo(() => {
  //   if (!status?.wager_amount || !rateValue) return '0';
  //   return Decimal(status.wager_amount)
  //     .mul(rateValue)
  //     .toDecimalPlaces(displayDecimal, Decimal.ROUND_DOWN)
  //     .toFixed(displayDecimal);
  // }, [status?.wager_amount, rateValue]);

  const { myVipLevelConfig } = QueryMyVipLevelConfig();

  // Memoize the VIP progress percentage
  const vipProgressPercent = useMemo(() => {
    if (!vipConfig?.xp || !status?.xp) return 0;
    return Decimal(status.xp).div(vipConfig.xp).mul(100).floor().toNumber();
  }, [vipConfig?.xp, status?.xp]);

  // Memoize the XP needed for next VIP level
  const xpToNextVip = useMemo(() => {
    if (!vipConfig?.xp || !status?.xp) return '';
    return Decimal(vipConfig.xp).sub(status.xp).floor().toString();
  }, [vipConfig?.xp, status?.xp]);

  const [openReferralSharingModal, setOpenReferralSharingModal] = useState(false);

  const tabsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Define tab configuration data in one place
  const tabConfig = useMemo(
    () => [
      {
        id: 'general',
        label: 'General',
        icon: (
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 6.43262C10 4.01637 11.9588 2.05762 14.375 2.05762C14.8159 2.05762 15.2427 2.12305 15.6456 2.24516C15.8558 2.30887 16.0172 2.47828 16.0706 2.69135C16.124 2.90443 16.0616 3.1299 15.9063 3.28523L13.1407 6.05081C13.1921 6.44713 13.3699 6.82913 13.6742 7.13344C13.9785 7.43776 14.3605 7.61551 14.7568 7.66692L17.5224 4.90134C17.6777 4.74602 17.9032 4.68363 18.1163 4.73703C18.3293 4.79043 18.4987 4.95177 18.5625 5.162C18.6846 5.56487 18.75 5.99167 18.75 6.43262C18.75 8.84886 16.7912 10.8076 14.375 10.8076C14.2496 10.8076 14.1253 10.8023 14.0023 10.7919C13.1546 10.7203 12.4448 10.8756 12.0787 11.3202L6.11939 18.5565C5.59737 19.1904 4.81923 19.5576 3.99807 19.5576C2.48035 19.5576 1.25 18.3273 1.25 16.8095C1.25 15.9884 1.61722 15.2102 2.2511 14.6882L9.4874 8.72893C9.93197 8.36281 10.0873 7.65306 10.0157 6.80535C10.0053 6.68235 10 6.55803 10 6.43262ZM3.43103 16.7452C3.43103 16.4 3.71085 16.1202 4.05603 16.1202H4.06228C4.40746 16.1202 4.68728 16.4 4.68728 16.7452V16.7514C4.68728 17.0966 4.40746 17.3764 4.06228 17.3764H4.05603C3.71085 17.3764 3.43103 17.0966 3.43103 16.7514V16.7452Z"
              fill="#A6ADBB"
            />
            <path
              d="M8.39664 8.00788L6.56251 6.17375V4.87013C6.56251 4.65059 6.44733 4.44715 6.25907 4.3342L3.13407 2.4592C2.88815 2.31164 2.57336 2.3504 2.37057 2.55319L1.74557 3.17819C1.54278 3.38098 1.50403 3.69577 1.65158 3.94169L3.52658 7.06669C3.63953 7.25494 3.84297 7.37013 4.06251 7.37013H5.36613L7.08448 9.08848L8.39664 8.00788Z"
              fill="#A6ADBB"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.4633 15.2482L13.9489 18.7338C15.0472 19.8322 16.828 19.8322 17.9263 18.7338C19.0247 17.6355 19.0247 15.8547 17.9263 14.7563L15.1716 12.0016C14.9114 12.0385 14.6455 12.0576 14.3751 12.0576C14.2145 12.0576 14.055 12.0508 13.8971 12.0374C13.5685 12.0097 13.3283 12.0323 13.1741 12.0723C13.0877 12.0948 13.0479 12.117 13.0349 12.1255L10.4633 15.2482ZM13.3081 14.1157C13.5522 13.8716 13.9479 13.8716 14.192 14.1157L15.7545 15.6782C15.9986 15.9223 15.9986 16.318 15.7545 16.5621C15.5104 16.8061 15.1147 16.8061 14.8706 16.5621L13.3081 14.9996C13.0641 14.7555 13.0641 14.3598 13.3081 14.1157Z"
              fill="#A6ADBB"
            />
          </svg>
        ),
      },
      {
        id: 'legal',
        label: 'Legal',
        icon: (
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.375 4.585C8.11212 3.77661 6.61038 3.30762 5 3.30762C4.05148 3.30762 3.13963 3.47041 2.29172 3.77011C2.04198 3.85838 1.875 4.0945 1.875 4.35938V16.2344C1.875 16.4373 1.97348 16.6275 2.13913 16.7447C2.30478 16.8618 2.51699 16.8913 2.70828 16.8237C3.42426 16.5706 4.19534 16.4326 5 16.4326C6.66251 16.4326 8.18604 17.022 9.375 18.004V4.585Z"
              fill="#A6ADBB"
            />
            <path
              d="M10.625 18.004C11.814 17.022 13.3375 16.4326 15 16.4326C15.8047 16.4326 16.5757 16.5706 17.2917 16.8237C17.483 16.8913 17.6952 16.8618 17.8609 16.7447C18.0265 16.6275 18.125 16.4373 18.125 16.2344V4.35938C18.125 4.0945 17.958 3.85838 17.7083 3.77011C16.8604 3.47041 15.9485 3.30762 15 3.30762C13.3896 3.30762 11.8879 3.77661 10.625 4.585V18.004Z"
              fill="#A6ADBB"
            />
          </svg>
        ),
      },
      {
        id: 'security',
        label: 'Security',
        icon: (
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.75 8.49049C15.2416 8.49049 14.625 7.42382 15.375 6.11549C15.8083 5.35716 15.55 4.39049 14.7916 3.95716L13.35 3.13216C12.6916 2.74049 11.8416 2.97382 11.45 3.63216L11.3583 3.79049C10.6083 5.09882 9.37496 5.09882 8.61663 3.79049L8.52496 3.63216C8.14996 2.97382 7.29996 2.74049 6.64163 3.13216L5.19996 3.95716C4.44163 4.39049 4.18329 5.36549 4.61663 6.12382C5.37496 7.42382 4.75829 8.49049 3.24996 8.49049C2.38329 8.49049 1.66663 9.19882 1.66663 10.0738V11.5405C1.66663 12.4072 2.37496 13.1238 3.24996 13.1238C4.75829 13.1238 5.37496 14.1905 4.61663 15.4988C4.18329 16.2572 4.44163 17.2238 5.19996 17.6572L6.64163 18.4822C7.29996 18.8738 8.14996 18.6405 8.54163 17.9822L8.63329 17.8238C9.38329 16.5155 10.6166 16.5155 11.375 17.8238L11.4666 17.9822C11.8583 18.6405 12.7083 18.8738 13.3666 18.4822L14.8083 17.6572C15.5666 17.2238 15.825 16.2488 15.3916 15.4988C14.6333 14.1905 15.25 13.1238 16.7583 13.1238C17.625 13.1238 18.3416 12.4155 18.3416 11.5405V10.0738C18.3333 9.20716 17.625 8.49049 16.75 8.49049ZM9.99996 13.5155C8.50829 13.5155 7.29163 12.2988 7.29163 10.8072C7.29163 9.31549 8.50829 8.09882 9.99996 8.09882C11.4916 8.09882 12.7083 9.31549 12.7083 10.8072C12.7083 12.2988 11.4916 13.5155 9.99996 13.5155Z"
              fill="#A6ADBB"
            />
          </svg>
        ),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: (
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 2.05762C7.58375 2.05762 5.625 4.01637 5.625 6.43262V8.93262C4.24429 8.93262 3.125 10.0519 3.125 11.4326V17.0576C3.125 18.4383 4.24429 19.5576 5.625 19.5576H14.375C15.7557 19.5576 16.875 18.4383 16.875 17.0576V11.4326C16.875 10.0519 15.7557 8.93262 14.375 8.93262V6.43262C14.375 4.01637 12.4162 2.05762 10 2.05762ZM13.125 8.93262V6.43262C13.125 4.70673 11.7259 3.30762 10 3.30762C8.27411 3.30762 6.875 4.70673 6.875 6.43262V8.93262H13.125Z"
              fill="#A6ADBB"
            />
          </svg>
        ),
      },
      // {
      //   id: 'sessions',
      //   label: 'Sessions',
      //   icon: (
      //     <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      //       <path
      //         fillRule="evenodd"
      //         clipRule="evenodd"
      //         d="M10 3.125C6.20304 3.125 3.125 6.20304 3.125 10C3.125 13.797 6.20304 16.875 10 16.875C13.797 16.875 16.875 13.797 16.875 10C16.875 6.20304 13.797 3.125 10 3.125ZM1.875 10C1.875 5.51269 5.51269 1.875 10 1.875C14.4873 1.875 18.125 5.51269 18.125 10C18.125 14.4873 14.4873 18.125 10 18.125C5.51269 18.125 1.875 14.4873 1.875 10ZM9.375 6.875C9.375 6.52982 9.65482 6.25 10 6.25H10.0062C10.3514 6.25 10.6312 6.52982 10.6312 6.875V6.88125C10.6312 7.22643 10.3514 7.50625 10.0062 7.50625H10C9.65482 7.50625 9.375 7.22643 9.375 6.88125V6.875ZM9.13007 8.7987C10.0853 8.3211 11.1608 9.18384 10.9018 10.2199L10.3109 12.5833L10.3455 12.566C10.6542 12.4116 11.0296 12.5367 11.184 12.8455C11.3384 13.1542 11.2133 13.5296 10.9045 13.684L10.8699 13.7013C9.91475 14.1789 8.83923 13.3162 9.09824 12.2801L9.68908 9.91673L9.65451 9.93402C9.34577 10.0884 8.97035 9.96325 8.81598 9.65451C8.66161 9.34577 8.78675 8.97035 9.09549 8.81598L9.13007 8.7987Z"
      //         fill="#A6ADBB"
      //       />
      //     </svg>
      //   ),
      // },
      {
        id: 'identityVerification',
        label: 'Identity Verification',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 3.125C6.20304 3.125 3.125 6.20304 3.125 10C3.125 13.797 6.20304 16.875 10 16.875C13.797 16.875 16.875 13.797 16.875 10C16.875 6.20304 13.797 3.125 10 3.125ZM1.875 10C1.875 5.51269 5.51269 1.875 10 1.875C14.4873 1.875 18.125 5.51269 18.125 10C18.125 14.4873 14.4873 18.125 10 18.125C5.51269 18.125 1.875 14.4873 1.875 10ZM9.375 6.875C9.375 6.52982 9.65482 6.25 10 6.25H10.0062C10.3514 6.25 10.6312 6.52982 10.6312 6.875V6.88125C10.6312 7.22643 10.3514 7.50625 10.0062 7.50625H10C9.65482 7.50625 9.375 7.22643 9.375 6.88125V6.875ZM9.13007 8.7987C10.0853 8.3211 11.1608 9.18384 10.9018 10.2199L10.3109 12.5833L10.3455 12.566C10.6542 12.4116 11.0296 12.5367 11.184 12.8455C11.3384 13.1542 11.2133 13.5296 10.9045 13.684L10.8699 13.7013C9.91475 14.1789 8.83923 13.3162 9.09824 12.2801L9.68908 9.91673L9.65451 9.93402C9.34577 10.0884 8.97035 9.96325 8.81598 9.65451C8.66161 9.34577 8.78675 8.97035 9.09549 8.81598L9.13007 8.7987Z"
              fill="#A6ADBB"
            />
          </svg>
        ),
      },
    ],
    [],
  );

  useEffect(() => {
    const activeTabElement = tabsRef.current[tab];
    const container = containerRef.current;

    if (activeTabElement && container) {
      // Calculate position to scroll to
      const tabRect = activeTabElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const scrollLeft = activeTabElement.offsetLeft + tabRect.width / 2 - containerRect.width / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  }, [tab]);

  return (
    <FullBleedContainer>
      <img
        src="/images/illustrations/Default_Casino_character_in_brazilian_style_4k_on_white_backgr_1-depositphotos-bgremover 1.png"
        alt="bonus"
        className="absolute top-[56px] right-0 -z-10 h-[205px] opacity-20"
      />
      <SafeContent>
        <Page className="flex flex-col gap-3 px-3 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="avatar" onClick={() => navigate(paths.main.profile.edit)}>
                <div className="h-12 w-12 overflow-hidden rounded-full">
                  {user?.avatar === '' || !user?.avatar ? (
                    <div className="bg-neutral text-neutral-content flex h-full w-full items-center justify-center">
                      <span className="text-3xl">{user?.nickname?.charAt(0).toUpperCase() || ''}</span>
                    </div>
                  ) : (
                    <Image src={user?.avatar} />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="h-7 max-w-[150px] truncate text-lg leading-7 font-bold text-white">{user?.nickname}</p>
                <div className="flex h-4 items-center gap-2">
                  <p className="text-neutral-content text-xs">ID: {String(user?.id)}</p>
                  <CopyBtn text={String(user?.id || '')}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.1913 2.10887C11.9829 2.19196 12.6 2.86152 12.6 3.6752V8.2252C12.6 9.09504 11.8948 9.8002 11.025 9.8002H9.44995V4.9002C9.44995 3.9337 8.66645 3.1502 7.69995 3.1502H5.68958C5.88808 2.58858 6.39607 2.17316 7.00863 2.10887C7.09172 1.31721 7.76128 0.700195 8.57495 0.700195H9.62495C10.4386 0.700195 11.1082 1.31721 11.1913 2.10887ZM8.04995 2.2752C8.04995 1.98525 8.285 1.7502 8.57495 1.7502H9.62495C9.9149 1.7502 10.15 1.98525 10.15 2.2752V2.4502H8.04995V2.2752Z"
                        fill="#A6ADBB"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.40002 4.9002C1.40002 4.5136 1.71343 4.2002 2.10002 4.2002H7.70002C8.08662 4.2002 8.40002 4.5136 8.40002 4.9002V11.9002C8.40002 12.2868 8.08662 12.6002 7.70002 12.6002H2.10002C1.71343 12.6002 1.40002 12.2868 1.40002 11.9002V4.9002ZM2.80002 7.1752C2.80002 6.88525 3.03507 6.6502 3.32502 6.6502H6.47502C6.76497 6.6502 7.00002 6.88525 7.00002 7.1752C7.00002 7.46514 6.76497 7.7002 6.47502 7.7002H3.32502C3.03507 7.7002 2.80002 7.46514 2.80002 7.1752ZM2.80002 9.6252C2.80002 9.33525 3.03507 9.1002 3.32502 9.1002H6.47502C6.76497 9.1002 7.00002 9.33525 7.00002 9.6252C7.00002 9.91514 6.76497 10.1502 6.47502 10.1502H3.32502C3.03507 10.1502 2.80002 9.91514 2.80002 9.6252Z"
                        fill="#A6ADBB"
                      />
                    </svg>
                  </CopyBtn>
                </div>
              </div>
            </div>

            <button
              className="btn btn-ghost btn-square btn-sm focus:bg-base-300/20 active:bg-base-300/20"
              onClick={() => navigate(paths.main.profile.edit)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.20938 14.7698C6.92228 14.4713 6.93159 13.9965 7.23017 13.7094L11.1679 10L7.23017 6.29062C6.93159 6.00353 6.92228 5.52875 7.20938 5.23017C7.49647 4.93159 7.97125 4.92228 8.26983 5.20937L12.7698 9.45937C12.9169 9.60078 13 9.79599 13 10C13 10.204 12.9169 10.3992 12.7698 10.5406L8.26983 14.7906C7.97125 15.0777 7.49647 15.0684 7.20938 14.7698Z"
                  fill="#A6ADBB"
                />
              </svg>
            </button>
          </div>

          <div
            className="flex items-center gap-2 rounded-xl p-3 pb-9"
            style={{
              background:
                'linear-gradient(136.93deg, color(display-p3 1.000 1.000 1.000 / 0.3) 0%, color(display-p3 0.000 0.000 0.000 / 0) 100%), linear-gradient(120.68deg, color(display-p3 1.000 1.000 1.000 / 0.1) 25%, color(display-p3 0.000 0.000 0.000 / 0) 25%)',
            }}
          >
            {myVipLevelConfig ? (
              <img src={`/icons/vip-badge/${myVipLevelConfig?.medal}.png`} className="h-14 w-14" />
            ) : (
              <div className="h-14 w-14" />
            )}
            <div className="flex w-full flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-primary text-base font-bold">VIP {status?.vip || 0}</p>
                <button
                  className="btn btn-accent btn-sm flex items-center gap-2 mix-blend-hard-light"
                  onClick={() => navigate(paths.main.vip.root)}
                >
                  <p>{t('common.view')}</p>
                  <svg
                    className="fill-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 256 256"
                  >
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <progress className="progress progress-primary flex-1" value={vipProgressPercent} max="100"></progress>
                <p className="text-neutral-content text-sm font-bold">
                  {xpToNextVip && `${xpToNextVip} XP to VIP ${(status?.vip || 0) + 1}`}
                </p>
              </div>
            </div>
          </div>

          <div className="-mx-3 -mt-10 flex flex-col">
            <svg
              width="100%"
              height="auto"
              viewBox="0 0 375 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
              style={{ maxWidth: '100%' }}
              className="text-base-300"
            >
              <path
                d="M0 0C147.333 21.3791 229.235 19.7551 375 0V17H0V0Z"
                fill="currentColor"
                style={{ fillOpacity: 1 }}
              />
            </svg>
            <div className="bg-base-300 -mt-0.5 flex flex-col gap-3 p-3">
              {/** Balance */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <img src="/icons/isometric/21.svg" className="h-6 w-6" />
                  <p className="text-neutral-content text-sm font-semibold">{t('common.totalBalance')}</p>
                </div>
                <p className="text-accent-content text-sm font-bold">
                  ≈{' '}
                  {/* {formatCurrency(totalRate, {
                    includeSymbol: true,
                  })} */}
                  {showCurrencySymbol} {totalRate}
                </p>
              </div>

              <div className="bg-base-200 flex flex-col gap-4 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="btn btn-secondary flex h-12 w-full items-center justify-between px-4"
                    onClick={() => navigate(paths.main.finance.deposit)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M2.13332 2.66699C1.55035 2.66699 1.06665 3.15069 1.06665 3.73366V6.40033H2.13332V3.73366H9.06665V12.267H2.13332V9.60033H1.06665V12.267C1.06665 12.85 1.55035 13.3337 2.13332 13.3337H2.66665C2.66665 13.6281 2.90558 13.867 3.19998 13.867H3.73332C4.02772 13.867 4.26665 13.6281 4.26665 13.3337H11.7333C11.7333 13.6281 11.9723 13.867 12.2667 13.867H12.8C13.0944 13.867 13.3333 13.6281 13.3333 13.3337H13.8667C14.4496 13.3337 14.9333 12.85 14.9333 12.267V3.73366C14.9333 3.15069 14.4496 2.66699 13.8667 2.66699H2.13332ZM12.2667 4.80033C13.1504 4.80033 13.8667 6.23286 13.8667 8.00033C13.8667 9.76779 13.1504 11.2003 12.2667 11.2003C11.3829 11.2003 10.6667 9.76779 10.6667 8.00033C10.6667 6.23286 11.3829 4.80033 12.2667 4.80033ZM4.26665 5.33366C4.13025 5.33366 3.99383 5.38564 3.88957 5.48991C3.68103 5.69844 3.68103 6.03554 3.88957 6.24408L5.11248 7.46699H1.59998C1.30505 7.46699 1.06665 7.70539 1.06665 8.00033C1.06665 8.29526 1.30505 8.53366 1.59998 8.53366H5.11248L3.88957 9.75658C3.68103 9.96511 3.68103 10.3022 3.88957 10.5107C3.99357 10.6147 4.13012 10.667 4.26665 10.667C4.40318 10.667 4.53973 10.6147 4.64373 10.5107L6.77603 8.37741C6.82509 8.32834 6.86549 8.27009 6.89269 8.20449C6.94656 8.07436 6.94656 7.9268 6.89269 7.7972C6.86549 7.73107 6.82563 7.67231 6.77603 7.62324L4.64373 5.48991C4.53947 5.38564 4.40305 5.33366 4.26665 5.33366ZM12.2667 6.40033C11.9723 6.40033 11.7333 7.11659 11.7333 8.00033C11.7333 8.88406 11.9723 9.60033 12.2667 9.60033C12.5611 9.60033 12.8 8.88406 12.8 8.00033C12.8 7.11659 12.5611 6.40033 12.2667 6.40033Z"
                        fill="#E7FB78"
                        fillOpacity="0.8"
                      />
                    </svg>

                    <p className="flex-1 text-center text-sm font-semibold">{t('common.deposit')}</p>
                  </button>

                  <button
                    className="btn btn-neutral flex h-12 w-full items-center justify-between px-4"
                    onClick={() => navigate(`${paths.main.finance.root}?tab=withdraw`)}
                  >
                    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_2356_13946)">
                        <path
                          d="M2.36667 2.13379C1.33573 2.13379 0.5 2.96952 0.5 4.00046C0.5 5.03139 1.33573 5.86712 2.36667 5.86712H2.63333V13.8671C2.63335 14.0086 2.68954 14.1442 2.78956 14.2442C2.88958 14.3442 3.02522 14.4004 3.16667 14.4005H13.8333C13.9748 14.4004 14.1104 14.3442 14.2104 14.2442C14.3105 14.1442 14.3667 14.0086 14.3667 13.8671V5.86712H14.6333C15.6643 5.86712 16.5 5.03139 16.5 4.00046C16.5 2.96952 15.6643 2.13379 14.6333 2.13379H2.36667ZM3.7 3.20046H13.3V12.2671H3.7V3.20046ZM9.53646 4.79941C6.99033 4.79941 6.3892 6.29082 6.25 7.14629H5.61979V7.73275H6.20938C6.20884 7.76421 6.19626 7.99971 6.24479 8.32025H5.62083V8.90671L6.39583 8.90775C6.69983 9.72535 7.49059 10.6682 9.53646 10.6682C9.86873 10.6676 10.1301 10.6483 10.3135 10.6286V9.60254C10.1429 9.63027 9.85583 9.64108 9.54063 9.64108C8.60569 9.64108 8.09255 9.30081 7.81042 8.90775H9.72708V8.32129H7.54063C7.46223 8.02262 7.46768 7.78123 7.46875 7.73483H9.72604V7.14733H7.53958C7.68838 6.58786 8.14609 5.82754 9.55729 5.82754C9.86876 5.82807 10.1054 5.84036 10.2969 5.87129V4.86191C10.1214 4.82725 9.82339 4.79941 9.53646 4.79941Z"
                          fill="#A6ADBB"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2356_13946">
                          <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                        </clipPath>
                      </defs>
                    </svg>

                    <p className="flex-1 text-center text-sm font-semibold">{t('common.withdraw')}</p>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div
                    className="flex flex-col items-center gap-2"
                    onClick={() => navigate(`${paths.main.finance.root}?tab=swap`)}
                  >
                    <img src="/icons/swap-1.svg" className="h-6 w-6" />
                    <p className="text-neutral-content text-sm">{t('common.swap')}</p>
                  </div>

                  <div
                    className="flex flex-col items-center gap-2"
                    onClick={() => navigate(`${paths.main.transaction.type}?tab=transaction`)}
                  >
                    <img src="/icons/swap-2.svg" className="h-6 w-6" />
                    <p className="text-neutral-content text-sm">{t('common.transactions')}</p>
                  </div>

                  <div
                    className="flex flex-col items-center gap-2"
                    onClick={() => navigate(`${paths.main.transaction.type}?tab=rollover`)}
                  >
                    <img src="/icons/rollover.svg" className="h-6 w-6" />
                    <p className="text-neutral-content text-sm">{t('common.rollover')}</p>
                  </div>

                  <div
                    className="flex flex-col items-center gap-2"
                    onClick={() => navigate(`${paths.main.transaction.type}?tab=bet`)}
                  >
                    <img src="/icons/swap-2.svg" className="h-6 w-6" />
                    <p className="text-neutral-content text-sm">{t('common.betHistory')}</p>
                  </div>
                </div>
              </div>

              {/** Stats */}
              <div className="bg-base-200 flex flex-col gap-2 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold">{t('common.stats')}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-base-100 flex flex-col items-center justify-center rounded-lg p-2">
                    <p className="text-xs text-[#A6ADBB]">{t('common.totalWins')}</p>
                    <p className="font-bold">{status?.wager_wins_times || 0}</p>
                  </div>

                  <div className="bg-base-100 flex flex-col items-center justify-center rounded-lg p-2">
                    <p className="text-xs text-[#A6ADBB]">{t('common.totalBets')}</p>
                    <p className="font-bold">{status?.wager_times || 0}</p>
                  </div>

                  <div className="bg-base-100 col-span-2 flex flex-col items-center justify-center rounded-lg p-2">
                    <p className="text-xs text-[#A6ADBB]">{t('common.totalWagered')}</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(status?.wager_amount, {
                        includeSymbol: true,
                      })}
                      {/* {convertCurrency(status?.wager_amount ?? 0, {
                        sourceCurrency: 'USDT',
                        targetCurrency: user?.currency_fiat ?? '',
                      })} */}
                    </p>
                  </div>
                </div>
                {/* 
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold">{t('common.achievements')}</p>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.32558 8.8619C4.15332 8.68275 4.15891 8.39788 4.33805 8.22562L6.7007 6L4.33805 3.77437C4.15891 3.60212 4.15332 3.31725 4.32558 3.1381C4.49783 2.95895 4.7827 2.95337 4.96185 3.12562L7.66185 5.67562C7.75009 5.76047 7.79995 5.87759 7.79995 6C7.79995 6.12241 7.75009 6.23953 7.66185 6.32437L4.96185 8.87437C4.7827 9.04663 4.49783 9.04105 4.32558 8.8619Z"
                      fill="#A6ADBB"
                    />
                  </svg>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <CardShark num={0} />
                  <Credit num={0} />
                  <Deposit num={0} />
                  <Phantom num={0} />
                </div> */}

                {topWageredGames.length > 0 && (
                  <>
                    <p className="text-sm leading-5 font-bold">{t('common.top3Games')}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {topWageredGames.map((game) => (
                        <div
                          key={game.id}
                          className="flex flex-col items-center justify-center"
                          onClick={() => navigate(`${paths.main.game.details}${game.game_id}/${game.game_provider}`)}
                        >
                          <GameImage game={game} className="max-h-[155px] rounded-2xl object-fill" />
                          <p className="mt-1 truncate text-center text-xs whitespace-nowrap">{game.game_name}</p>
                          <p className="mt-1.5 text-xs font-bold">
                            {/* {convertCurrency(game.wagered_usdt, {
                              sourceCurrency: 'USDT',
                              targetCurrency: user?.currency_fiat ?? '',
                            })} */}
                            {formatCurrency(game.wagered_usdt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div
                className="flex flex-col gap-2 rounded-lg p-4"
                style={{
                  background:
                    'radial-gradient(100% 157.05% at 0% 46.47%, rgba(69, 129, 155, 0.4) 0%, rgba(51, 51, 51, 0.08) 100%), #1B232B',
                }}
                onClick={() => setOpenReferralSharingModal(true)}
              >
                <div className="flex items-center gap-4">
                  <img src="/icons/isometric/29.png" className="h-12 w-12" />
                  <div className="flex flex-col gap-1">
                    <p className="text-neutral-content text-base font-bold">{t('common.referralProgram')}</p>
                    <p className="text-primary/80 text-sm">
                      {t('common.upToAmountCommission', {
                        amount: formatCurrency(1200, {
                          includeSymbol: true,
                        }),
                        commission: 50,
                      })}
                    </p>
                  </div>
                  <svg
                    className="ml-auto"
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.20938 15.5774C6.92228 15.2789 6.93159 14.8041 7.23017 14.517L11.1679 10L7.23017 6.29062C6.93159 6.00353 6.92228 5.52875 7.20938 5.23017C7.49647 4.93159 7.97125 4.92228 8.26983 5.20937L12.7698 9.45937C12.9169 9.60078 13 9.79599 13 10C13 10.204 12.9169 10.3992 12.7698 10.5406L8.26983 14.7906C7.97125 15.0777 7.49647 15.0684 7.20938 14.7698Z"
                      fill="#A6ADBB"
                    />
                  </svg>
                </div>

                <div className="bg-base-300 flex h-8 items-center justify-between gap-2 rounded-lg px-3 text-sm text-[#EBEBEB]/30">
                  <p className="hide-scrollbar flex-1 overflow-auto whitespace-nowrap">{baseUrl}</p>

                  <div
                    className="btn btn-accent btn-xs ml-auto h-[22px] min-w-16 rounded-full font-normal"
                    onClick={(e) => {
                      e.stopPropagation();
                      // shareURL(getReferralLink(baseUrl, defaultAdTag?.code || ''));
                    }}
                  >
                    <CopyBtn text={baseUrl}>
                      <div className="flex items-center gap-1">
                        <svg
                          className="fill-accent-content"
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 256 256"
                        >
                          <path d="M212,200a36,36,0,1,1-69.85-12.25l-53-34.05a36,36,0,1,1,0-51.4l53-34.05a36.09,36.09,0,1,1,8.67,13.45l-53,34.05a36,36,0,0,1,0,24.5l53,34.05A36,36,0,0,1,212,200Z"></path>
                        </svg>
                        <p>{t('common.share')}</p>
                      </div>
                    </CopyBtn>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <div
                  className="tabs tabs-lift hide-scrollbar flex flex-nowrap items-center overflow-x-scroll"
                  ref={containerRef}
                >
                  {tabConfig.map((tabItem) => (
                    <label
                      key={tabItem.id}
                      className="tab [--tab-bg:var(--color-base-200)]"
                      ref={(el) => {
                        // Store the parent div element as our button reference
                        if (el) {
                          tabsRef.current[tabItem.id] = el as unknown as HTMLButtonElement;
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name="profile_tabs"
                        checked={tab === tabItem.id}
                        onChange={() => setTab(tabItem.id as any)}
                      />
                      <div className="flex items-center gap-2">
                        {tabItem.icon}
                        <p className="text-sm whitespace-nowrap">{t(`common.${tabItem.id}`)}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {tab === 'general' && (
                  <ProfileTabContentGeneral
                    onCurrencySelect={() => setOpenCurrencySelectDrawer(true)}
                    onLanguageSelect={() => setOpenLanguageModal(true)}
                  />
                )}
                {tab === 'legal' && <ProfileTabContentLegal />}
                {tab === 'settings' && <ProfileTabContentSettings setTab={(newTab) => setTab(newTab as any)} />}
                {tab === 'security' && <ProfileTabContentSecurity />}
                {tab === 'sessions' && <ProfileTabContentSessions />}
                {tab === 'identityVerification' && <ProfileTabContentIdentityVerification />}
              </div>
            </div>

            <WalletSelectDialog
              openWallet={openCurrencySelectDrawer}
              handleWalletSettingsClose={() => setOpenCurrencySelectDrawer(false)}
              selectedCurrency={user?.currency_fiat ?? 'USD'}
            />
            {/* <CurrencySelectDrawer open={openCurrencySelectDrawer} onClose={() => setOpenCurrencySelectDrawer(false)} /> */}
            <ProfileLanguageModal open={openLanguageModal} onClose={() => setOpenLanguageModal(false)} />
            <ReferralSharingModal open={openReferralSharingModal} onClose={() => setOpenReferralSharingModal(false)} />
          </div>
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
}
