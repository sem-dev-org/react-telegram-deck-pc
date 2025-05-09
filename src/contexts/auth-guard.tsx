import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import { SplashScreen } from '@/pages/loading-screen/splash-screen';
import { useAuth } from '@/contexts/auth';
import { paths } from '@/routes/paths';
import { getUser, getStatus } from '@/cookies/sign';
import { useSettingStore } from '@/store/setting';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const navigate = useNavigate();

  const [isChecking, setIsChecking] = useState<boolean>(true);

  const { isLoading, updateUser, updateStatus } = useAuth();

  // const routerFun = useCallback(()=>{
  // if (!user?.is_finished_startup_campaign){
  //   navigate(`/onboarding`)
  // }
  // if (user?.is_finished_startup_campaign){
  //   checkPlayerIsInChannelOnStartup().then( resChannel =>{
  //     if (resChannel.check_result){

  // setIsChecking(false);
  // navigate(pathname === '/main' ? '/casino' : pathname + search)

  //     }else {
  //       navigate('/loadingPage')
  //     }
  //   })
  // }
  // },[navigate,pathname,search])
  const { pathname, search } = useLocation();

  const user = getUser();
  const status = getStatus();
  const { jumpUrl, setJumpUrl, firstLoad, setFirstLoad } = useSettingStore();

  useEffect(() => {
    if (
      pathname.startsWith('/main/finance') ||
      pathname.startsWith('/main/bonus') ||
      pathname.startsWith('/main/profile') ||
      pathname.startsWith('/main/referral') ||
      pathname.startsWith('/main/vip') ||
      pathname.startsWith('/main/transaction') ||
      pathname.startsWith('/main/tournament') ||
      pathname.startsWith('/main/chat')
    ) {
      if (!user || !status) {
        navigate(paths.login);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (jumpUrl !== '') {
      if (user && status) {
        navigate(jumpUrl);
      } else {
        if (firstLoad) {
          setFirstLoad(false);
          navigate(paths.login);
        }
      }
    }
  }, [user, status]);

  // Add new effect to clear jumpUrl after navigation
  useEffect(() => {
    if (jumpUrl !== '' && pathname === jumpUrl) {
      setJumpUrl('');
    }
  }, [pathname, jumpUrl]);

  const systeStatusm = useCallback(async () => {
    if (user && status) {
      updateUser(JSON.parse(user));
      updateStatus(JSON.parse(status));
      // navigate(pathname === '/main' ? paths.main.casino.root : pathname + search);
    }
    // }
    //   } else {
    //     navigate(`/upGrad`)
    //   }
    // })
  }, [navigate, pathname, search]);

  // const checkPermissions = async (): Promise<void> => {

  //   if (isLoading) {
  //     return;
  //   }

  //   if (authenticated) {
  //     systeStatusm()
  //     return;
  //   }

  //   // routerFun()
  //   setIsChecking(false);
  // };

  useEffect(() => {
    // console.log('isLoading', isLoading);
    if (isLoading) {
      setIsChecking(true);
    } else {
      systeStatusm();
      setIsChecking(false);
    }
  }, [isLoading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
