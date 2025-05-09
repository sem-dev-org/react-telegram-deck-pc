import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getGamePlay } from '@/api/casino';
import { FullBleedContainer, SafeContent } from '@/components/ui/SafeArea';
import Page from '@/components/ui/Page';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
// import { viewport } from '@telegram-apps/sdk-react';
import { useTranslation } from 'react-i18next';
import { useSettingStore } from '@/store/setting';
import { paths } from '@/routes/paths';

export default function GameIframePage() {
  // viewport.unmount();
  const origin = window.location.origin;

  const { t } = useTranslation();

  const { game_provider, game_id, is_support_demo_game } = useParams();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  // 使用ref存储iframe内容，避免重新加载
  const iframeContentRef = useRef<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();

  const navigate = useNavigate();

  const handleGoBack = () => {
    toast.error(t('gameDetail:gameFailedToOpen'));
    navigate(-1);
  };

  const { setShowHeader } = useSettingStore();

  const isFullScreen = localStorage.getItem('isFullScreen') === 'true';

  useEffect(() => {
    if (isFullScreen) {
      setShowHeader(false);
    }
    return () => {
      setShowHeader(true);
    };
  }, [setShowHeader, isFullScreen]);

  // 只在组件挂载时初始化viewport
  // useEffect(() => {
  //   if (viewport.isMounted()) {
  //     viewport.expand();
  //   }

  //   // 清理函数
  //   return () => {
  //     viewport.unmount();
  //   };
  // }, []);

  // 将resize处理逻辑与iframe内容分离
  // useEffect(() => {
  //   const handleResize = () => {
  //     requestAnimationFrame(() => {
  //       if (iframeRef.current) {
  //         // 只更新尺寸，不触发内容重新加载
  //         iframeRef.current.style.height = `${window.innerHeight}px`;
  //         iframeRef.current.style.width = `${window.innerWidth}px`;
  //       }
  //     });
  //   };

  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  // 仅在必要时获取游戏URL
  useEffect(() => {
    if (game_id && user && !iframeContentRef.current) {
      getGamePlay({
        game_id: game_id,
        game_provider: game_provider,
        lang: 'en-US',
        is_support_demo_game: Number(is_support_demo_game) === 1 ? 'true' : 'false',
        home_url: `${origin}${paths.main.casino.root}`,
        history_url: '',
        close_url: `${origin}${paths.main.game.details}${game_id}/${game_provider}`,
        deposit_url: `${origin}${paths.main.finance.deposit}`,
      })
        .then((res) => {
          if (res.code === 0) {
            const dataRes = res.data;
            if (game_provider === 'pg') {
              iframeContentRef.current = dataRes;
            }
            if (game_provider === 'jili') {
              const jiliData = JSON.parse(dataRes);
              if (jiliData.ErrorCode === 0) {
                iframeContentRef.current = jiliData.Data;
              } else {
                handleGoBack();
              }
            }
            if (game_provider === 'pp') {
              const ppData = JSON.parse(dataRes);
              if (ppData.error === '0') {
                iframeContentRef.current = ppData.gameURL;
              } else {
                handleGoBack();
              }
            }
            if (game_provider === 'spribe') {
              const spribeData = JSON.parse(dataRes);
              if (spribeData.ErrorCode === 0) {
                iframeContentRef.current = spribeData.Data;
              } else {
                handleGoBack();
              }
            }
            if (game_provider === 'evoplay') {
              const evoplayData = JSON.parse(dataRes);
              if (evoplayData.ErrorCode === 0) {
                iframeContentRef.current = evoplayData.Data;
              } else {
                handleGoBack();
              }
            }
            if (game_provider === 'fachai') {
              const fachaiData = JSON.parse(dataRes);
              if (fachaiData.Result === 0) {
                iframeContentRef.current = fachaiData.Url;
              } else {
                handleGoBack();
              }
            }
            if (game_provider === 'live88') {
              const live88Data = JSON.parse(dataRes);
              iframeContentRef.current = live88Data.url;
            }
            if (game_provider === 'relax') {
              const relaxData = JSON.parse(dataRes);
              if (relaxData.game_url !== '') {
                iframeContentRef.current = relaxData.game_url;
              } else {
                handleGoBack();
              }
            }
            if (game_provider === 'evolution') {
              if (dataRes.status === 1) {
                iframeContentRef.current = dataRes.launch_url;
              } else {
                handleGoBack();
              }
            }
            if (game_provider === 'hpg') {
              iframeContentRef.current = dataRes;
            }
            if (game_provider === 'hjili') {
              iframeContentRef.current = dataRes;
            }
            if (game_provider === 'hpp') {
              iframeContentRef.current = dataRes;
            }
            if (game_provider === 'hfc') {
              iframeContentRef.current = dataRes;
            }
            if (game_provider === 'hevoplay') {
              iframeContentRef.current = dataRes;
            }
            if (game_provider === 'hspribe') {
              iframeContentRef.current = dataRes;
            }
            if (game_provider === 'hrelax') {
              iframeContentRef.current = dataRes;
            }
          } else {
            handleGoBack();
          }
        })
        .catch(() => {
          handleGoBack();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [game_id, game_provider, user]);

  const height = useMemo(() => (isFullScreen ? 'h-full' : 'h-[calc(100%-var(--safe-area-top))]'), [isFullScreen]);

  // 使用 useMemo 避免函数组件在 resize 时重新创建 iframe
  const srcDocIframe = useCallback(() => {
    if (!iframeContentRef.current) return null;

    return (
      <iframe
        ref={iframeRef}
        srcDoc={iframeContentRef.current}
        className={`fixed w-full overflow-auto border-none ${height}`}
        // allow="fullscreen"
        allowFullScreen
        {...({
          webkitallowfullscreen: 'true',
          mozallowfullscreen: 'true',
        } as any)}
        sandbox="allow-forms allow-modals allow-scripts allow-same-origin allow-popups"
      />
    );
  }, [iframeContentRef.current]);

  const srcIframe = useCallback(() => {
    if (!iframeContentRef.current) return null;

    return (
      <iframe
        ref={iframeRef}
        src={iframeContentRef.current}
        className={`fixed w-full overflow-auto border-none ${height}`}
        // allow="fullscreen"
        allowFullScreen
        {...({
          webkitallowfullscreen: 'true',
          mozallowfullscreen: 'true',
        } as any)}
        sandbox="allow-forms allow-modals allow-scripts allow-same-origin allow-popups"
      />
    );
  }, [iframeContentRef.current]);

  const GameIframe = useCallback(() => {
    if (!iframeContentRef.current) return null;

    return (
      <div className="flex h-full flex-col">
        {game_provider === 'pg' && srcDocIframe()}
        {game_provider === 'jili' && srcIframe()}
        {game_provider === 'pp' && srcIframe()}
        {game_provider === 'spribe' && srcIframe()}
        {game_provider === 'evoplay' && srcIframe()}
        {game_provider === 'fachai' && srcIframe()}
        {game_provider === 'live88' && srcIframe()}
        {game_provider === 'relax' && srcIframe()}
        {game_provider === 'evolution' && srcIframe()}
        {game_provider === 'hpg' && srcIframe()}
        {game_provider === 'hjili' && srcIframe()}
        {game_provider === 'hpp' && srcIframe()}
        {game_provider === 'hfc' && srcIframe()}
        {game_provider === 'hevoplay' && srcIframe()}
        {game_provider === 'hspribe' && srcIframe()}
        {game_provider === 'hrelax' && srcIframe()}
      </div>
    );
  }, [game_provider, iframeContentRef.current, srcDocIframe, srcIframe]);

  // useEffect(() => {
  //   // 获取当前页面完整URL
  //   const currentUrl = window.location.href;
  //   console.log('Current page URL:', currentUrl);

  //   // 获取当前页面路径
  //   const currentPath = window.location.pathname;
  //   console.log('Current page path:', currentPath);
  // }, []);

  return (
    <FullBleedContainer>
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <span className="loading loading-spinner loading-xl text-primary"></span>
        </div>
      ) : (
        <>
          {isFullScreen ? (
            <div className="h-screen w-full">
              <GameIframe />
            </div>
          ) : (
            <SafeContent>
              <Page className="!overflow-hidden">
                {/* <div className="fixed h-full w-full"> */}
                <GameIframe />
                {/* </div> */}
              </Page>
            </SafeContent>
          )}
        </>
      )}
    </FullBleedContainer>
  );
}
