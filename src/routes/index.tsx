import { AuthGuard } from '@/contexts/auth-guard';
import BaseLayout from '@/layouts/BaseLayout';
import DockLayout from '@/layouts/DockLayout';
import { lazy, Suspense, useEffect } from 'react';
import { createBrowserRouter, Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';

import { isTMA, retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { decode } from 'js-base64';
import { useSettingStore } from '@/store/setting';

// 添加ScrollToTop组件，用于在路由切换时重置滚动位置
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const CasinoPage = lazy(() => import('@/pages/casino'));
const BonusPage = lazy(() => import('@/pages/bonus'));
const ExplorePage = lazy(() => import('@/pages/explore'));

const ProfilePage = lazy(() => import('@/pages/profile'));
const ProfileEdit = lazy(() => import('@/pages/profile/ProfileEdit'));
const ProfileAvatar = lazy(() => import('@/pages/profile/profileAvatar'));

const TournamentPage = lazy(() => import('@/pages/tournament'));

const GameDetailPage = lazy(() => import('@/pages/game/GameDetail'));
const GameIframePage = lazy(() => import('@/pages/game/GameIframe'));

const ReferralDetailsPage = lazy(() => import('@/pages/referral/details'));
const ReferralListPage = lazy(() => import('@/pages/referral/list'));

const TransactionDetails = lazy(() => import('@/pages/transaction/details'));

const FinancePage = lazy(() => import('@/pages/finance'));
const DepositPage = lazy(() => import('@/pages/finance/Deposit'));
const WithdrawPage = lazy(() => import('@/pages/finance/Withdraw'));

const ReferralProgramPage = lazy(() => import('@/pages/referral'));

const VipPage = lazy(() => import('@/pages/vip'));

const TransactionPage = lazy(() => import('@/pages/transaction'));

const EnterWithdrawalPin = lazy(() => import('@/pages/profile/security/EnterWithdrawalPin'));

const SetWithdrawalPin = lazy(() => import('@/pages/profile/security/SetWithdrawalPin'));

const UpdateWithdrawalPin = lazy(() => import('@/pages/profile/security/UpdateWithdrawalPin'));

const BasicVerification = lazy(() => import('@/pages/profile/IdentityVerification/BasicVerification'));

const AddressVerification = lazy(() => import('@/pages/profile/IdentityVerification/AddressVerification'));

const IdVerification = lazy(() => import('@/pages/profile/IdentityVerification/IdVerification'));

const InformationPageLoading = lazy(() => import('@/pages/informationPage/loading'));

const PageNotFound = lazy(() => import('@/pages/informationPage/pageNotFound'));
const NoInternetConnection = lazy(() => import('@/pages/informationPage/noInternetConnection'));
const FailedToLoadPage = lazy(() => import('@/pages/informationPage/failedToLoadPage'));
const UnderMaintenance = lazy(() => import('@/pages/informationPage/underMaintenance'));
const TooManyRequest = lazy(() => import('@/pages/informationPage/tooManyRequest'));
const UserRestriction = lazy(() => import('@/pages/informationPage/userRestriction'));
const EmptyStateNoContent = lazy(() => import('@/pages/informationPage/emptyStateNoContent'));
const OtherActiveSession = lazy(() => import('@/pages/informationPage/otherActiveSession'));
// Chat
const ChatPage = lazy(() => import('@/pages/chat'));

const LoginPage = lazy(() => import('@/pages/login'));
const SetPasswordPage = lazy(() => import('@/pages/login/setPassword'));

const ChangePasswordPage = lazy(() => import('@/pages/profile/security/changePassword'));

const EmailVerificationPage = lazy(() => import('@/pages/profile/security/emailverification'));
const PhoneVerificationPage = lazy(() => import('@/pages/profile/security/phoneVerification'));

const AboutUs = lazy(() => import('@/pages/legal/aboutUs'));
const ResponsibleGaming = lazy(() => import('@/pages/legal/responsibleGaming'));
const Fairness = lazy(() => import('@/pages/legal/fairness'));
const Faq = lazy(() => import('@/pages/legal/faq'));
const TermOfService = lazy(() => import('@/pages/legal/termOfService'));

const ReferralCommissionsDetailsPage = lazy(() => import('@/pages/referral/commissionsDetails'));
const ReferralRewardsDetailsPage = lazy(() => import('@/pages/referral/rewardsDetails'));

const layoutContent = (
  <BaseLayout>
    <Suspense>
      <Outlet />
    </Suspense>
  </BaseLayout>
);

const dockLayoutContent = (
  <DockLayout>
    <Suspense>
      <Outlet />
    </Suspense>
  </DockLayout>
);


// Helper function to parse URL-formatted parameters
function parseUrlFormattedParams(paramString: string) {
  const params = new URLSearchParams(paramString);
  return Object.fromEntries(params.entries());
}

function RootRedirect() {
  const [searchParams] = useSearchParams();
  const startapp = searchParams.get('startapp');
  const { setUserCode , setJumpUrl , setFirstLoad  } = useSettingStore();


  useEffect(() => {
    const init = async () => {
      if (await isTMA()) {
        const startParam = retrieveLaunchParams().startParam;
        if (startParam && typeof startParam === 'string') {
          // If JSON parsing fails, try parsing as URL-formatted string
          const params = parseUrlFormattedParams(decode(startParam));
          if (params.user_code) {
            setUserCode(params.user_code);
          }
          if (params.url) {
            setJumpUrl(params.url);
            setFirstLoad(true);
          }
          return;
        }
      }

      // Handle URL start parameter
      if (startapp) {
        // If JSON parsing fails, try parsing as URL-formatted string
        const params = parseUrlFormattedParams(decode(startapp));
        if (params.user_code) {
          setUserCode(params.user_code);
        }
        if (params.url) {
          setJumpUrl(params.url); 
          setFirstLoad(true);
        }
      }
    };

    init();
  }, [startapp]);

  return <Navigate to="/main/casino" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
    errorElement: <FailedToLoadPage />,
  },
  {
    path: 'main',
    element: <AuthGuard>{layoutContent}</AuthGuard>,
    errorElement: <FailedToLoadPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/main/casino" replace />,
      },
      {
        path: 'finance',
        children: [
          {
            index: true,
            element: <FinancePage />,
          },
          {
            path: 'deposit',
            element: <DepositPage />,
          },
          {
            path: 'withdraw',
            element: <WithdrawPage />,
          },
        ],
      },
      {
        path: 'bonus',
        children: [
          {
            index: true,
            element: <BonusPage />,
          },
        ],
      },
      {
        path: 'profile',
        children: [
          {
            index: true,
            element: <ProfilePage />,
          },
          {
            path: 'edit',
            element: <ProfileEdit />,
          },
          {
            path: 'avatar',
            element: <ProfileAvatar />,
          },
          {
            path: 'security',
            children: [
              {
                index: true,
                element: <Navigate to="/information/page-not-found" replace />,
              },
              {
                path: 'set-withdrawal-pin',
                element: <SetWithdrawalPin />,
              },
              {
                path: 'update-withdrawal-pin',
                element: <UpdateWithdrawalPin />,
              },
              {
                path: 'enter-withdrawal-pin',
                element: <EnterWithdrawalPin />,
              },
            ],
          },
          {
            path: 'verification',
            children: [
              {
                index: true,
                element: <Navigate to="/information/page-not-found" replace />,
              },
              {
                path: 'basic-verification',
                element: <BasicVerification />,
              },
              {
                path: 'address-verification',
                element: <AddressVerification />,
              },
              {
                path: 'id-verification',
                element: <IdVerification />,
              },
              {
                path: 'change-password',
                element: <ChangePasswordPage />,
              },
              {
                path: 'email-verification',
                element: <EmailVerificationPage />,
              },
              {
                path: 'phone-verification',
                element: <PhoneVerificationPage />,
              },
            ],
          },
        ],
      },
      {
        path: 'explore',
        children: [
          {
            index: true,
            element: <ExplorePage />,
          },
          // {
          //   path: 'edit',
          // }
        ],
      },
      // {
      //   path: 'game-provider',
      //   children: [
      //     {
      //       index: true,
      //       element: <GameProvidersPage />,
      //     },
      //     {
      //       path: ':provider',
      //       element: <GameProviderGamesPage />,
      //     },
      //   ],
      // },
      {
        path: 'game',
        children: [
          {
            index: true,
            element: <Navigate to="/information/page-not-found" replace />,
          },
          {
            path: 'details/:id',
            element: <GameDetailPage />,
          },
          {
            path: 'details/:game_id/:provider',
            element: <GameDetailPage />,
          },
          {
            path: 'iframe/:game_provider/:game_id/:is_support_demo_game',
            element: <GameIframePage />,
          },
        ],
      },
      {
        path: 'referral',
        children: [
          {
            index: true,
            element: <ReferralProgramPage />,
          },
          {
            path: 'list',
            element: <ReferralListPage />,
          },
          {
            path: 'details/:id/:down_line/:refer_type',
            element: <ReferralDetailsPage />,
          },
          {
            path: 'enter-withdrawal-pin',
            element: <EnterWithdrawalPin />,
          },
          {
            path: 'commissions-details/:id/:created_at',
            element: <ReferralCommissionsDetailsPage />,
          },
          {
            path: 'rewards-details/:id/:created_at',
            element: <ReferralRewardsDetailsPage />,
          },
        ],
      },
      {
        path: 'vip',
        children: [
          {
            index: true,
            element: <VipPage />,
          },
        ],
      },
      {
        path: 'transaction',
        children: [
          {
            index: true,
            element: <TransactionPage />,
          },
          {
            path: ':type',
            element: <TransactionPage />,
          },
          {
            path: 'details/:id',
            element: <TransactionDetails />,
          },
        ],
      },
      {
        path: 'tournament',
        children: [
          {
            index: true,
            element: <TournamentPage />,
          },
        ],
      },
      {
        path: 'chat',
        children: [
          {
            index: true,
            element: <ChatPage />,
          },
        ],
      },
    ],
  },
  {
    path: 'main/casino',
    element: <AuthGuard>{dockLayoutContent}</AuthGuard>,
    errorElement: <FailedToLoadPage />,
    children: [
      {
        index: true,
        element: <CasinoPage />,
      },
    ],
  },
  {
    path: 'login',
    element: <BaseLayout />,
    errorElement: <FailedToLoadPage />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: 'set-password',
    element: <BaseLayout />,
    errorElement: <FailedToLoadPage />,
    children: [
      {
        index: true,
        element: <SetPasswordPage />,
      },
    ],
  },
  {
    path: 'legal',
    element: <BaseLayout />,
    errorElement: <FailedToLoadPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/information/page-not-found" replace />,
      },
      { path: 'about-us', element: <AboutUs /> },
      { path: 'responsible-gaming', element: <ResponsibleGaming /> },
      { path: 'fairness', element: <Fairness /> },
      { path: 'faq', element: <Faq /> },
      { path: 'term-of-service', element: <TermOfService /> },
    ],
  },
  {
    path: 'information',
    element: <BaseLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/information/page-not-found" replace />,
      },
      { path: 'loading', element: <InformationPageLoading /> },
      { path: 'page-not-found', element: <PageNotFound /> },
      { path: 'no-internet-connection', element: <NoInternetConnection /> },
      { path: 'failed-to-load-page', element: <FailedToLoadPage /> },
      { path: 'under-maintenance', element: <UnderMaintenance /> },
      { path: 'too-many-request', element: <TooManyRequest /> },
      { path: 'user-restriction', element: <UserRestriction /> },
      { path: 'empty-state-no-content', element: <EmptyStateNoContent /> },
      { path: 'other-active-session', element: <OtherActiveSession /> },
    ],
  },
  { path: '*', element: <Navigate to="/information/page-not-found" replace /> },
]);
