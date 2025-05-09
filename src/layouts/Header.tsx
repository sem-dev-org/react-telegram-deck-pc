import { useEffect, useState } from 'react';
import { useSettingStore } from '@/store/setting';
import { useTranslation } from 'react-i18next';
import { paths } from '@/routes/paths';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUser } from '@/cookies/sign';
import { useSystem } from '@/hooks';
import useIsTma from '@/hooks/isTma';

export default function Header() {
  const { showHeader } = useSettingStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sign, setSign] = useState('');
  const { checkPageNavToApp } = useSystem();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const type = searchParams.get('type');

  const isTmaApp = useIsTma();

  useEffect(() => {
    if (type === 'sign-in') {
      setSign('signIn');
    } else if (type === 'sign-up') {
      setSign('signUp');
    } else {
      setSign('signIn');
    }
  }, [type]);

  const [status, setStatus] = useState<boolean>(false);
  const { isMobile } = useSystem();

  const user = getUser();
  useEffect(() => {
    if (user) {
      setStatus(false);
    } else {
      setStatus(true);
    }
  }, [user]);

  return (
    <>
      {!isTmaApp && showHeader && (
        <>
          <div
            className="fixed top-0 right-0 left-0 z-50 flex h-[52px] w-full items-center justify-between bg-[#413F40]/40 px-2 backdrop-blur-2xl"
            // style={{
            //   filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.8))',
            // }}
          >
            <div className="h-5" onClick={() => navigate(paths.main.casino.root)}>
              <svg width="100" height="20" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_9074_120329)">
                  <path
                    d="M8.2948 5.64466C12.2888 5.64466 15.1279 8.50782 15.1279 12.5499C15.1279 16.592 12.2888 19.4552 8.2948 19.4552C6.77901 19.4552 5.43165 18.9499 4.373 18.0597L3.96398 19.0221H0.643677V1.33789H5.07074V6.53488C6.00909 5.95744 7.0918 5.64466 8.2948 5.64466ZM7.6933 15.4853C9.35345 15.4853 10.6046 14.2341 10.6046 12.5499C10.6046 10.8417 9.37751 9.59052 7.6933 9.59052C6.03315 9.59052 4.78202 10.8417 4.78202 12.5499C4.78202 14.2341 6.03315 15.4853 7.6933 15.4853ZM30.539 12.4056C30.539 12.8146 30.515 13.1995 30.4668 13.6086H20.8187C21.1074 15.1003 22.0458 15.8702 23.4653 15.8702C24.4999 15.8702 25.3901 15.4131 25.7992 14.6432H30.2744C29.36 17.6026 26.7134 19.4552 23.4653 19.4552C19.3992 19.4552 16.4157 16.4958 16.4157 12.5259C16.4157 8.55594 19.3751 5.6206 23.4653 5.6206C27.6518 5.6206 30.539 8.60406 30.539 12.4056ZM23.4653 9.13338C22.1661 9.13338 21.2518 9.83112 20.8909 11.1304H26.136C25.751 9.83112 24.8127 9.13338 23.4653 9.13338ZM39.4368 15.1244H41.145V19.0221H38.0653C35.2022 19.0221 33.4458 17.2657 33.4458 14.3785V9.49428H31.0638V8.43563L36.8864 2.25218H37.8247V6.02962H41.0728V9.49428H37.921V13.6326C37.921 14.5469 38.4984 15.1244 39.4368 15.1244Z"
                    fill="#E7FB78"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M51.928 6.24627V9.75906H49.0167V19.0222H44.5415V9.75906H42.4002L42.3761 6.24627H44.5896V5.01921C44.5896 2.39665 46.0332 0.880859 48.7761 0.880859H51.9039V4.32146H49.931C49.2573 4.32146 48.8723 4.70642 48.8723 5.38011V6.24627H51.928ZM60.8938 5.98161H62.0968V10.0718H60.3404C58.7765 10.0718 58.1028 10.7696 58.1028 12.4297V19.0222H53.6276V6.02973H56.6351L57.3329 7.47334C58.2472 6.41469 59.3539 5.98161 60.8938 5.98161ZM70.0868 19.4553C65.8522 19.4553 62.8206 16.544 62.8206 12.526C62.8206 8.50793 65.8522 5.62071 70.0868 5.62071C74.3214 5.62071 77.3774 8.50793 77.3774 12.526C77.3774 16.544 74.3214 19.4553 70.0868 19.4553ZM70.0868 15.4373C71.7229 15.4373 72.9018 14.2583 72.9018 12.55C72.9018 10.8418 71.7229 9.63875 70.0868 9.63875C68.4747 9.63875 67.2958 10.8177 67.2958 12.55C67.2958 14.2583 68.4747 15.4373 70.0868 15.4373ZM94.7526 5.66883C97.5435 5.66883 99.3721 7.83424 99.3721 10.8899V19.0222H94.8969V11.4433C94.8969 10.0718 94.4157 9.42221 93.4533 9.42221C92.2262 9.42221 91.6007 10.2643 91.6007 11.9004V19.0222H87.2458V11.4433C87.2458 10.12 86.7405 9.42221 85.8022 9.42221C84.5992 9.42221 83.9255 10.2884 83.9255 11.9004V19.0222H79.4503V6.02973H82.6022L83.2278 7.44928C84.1661 6.34251 85.5375 5.66883 87.0293 5.66883C88.6172 5.66883 89.9405 6.36657 90.7578 7.56958C91.6969 6.39063 93.1405 5.66883 94.7526 5.66883Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_9074_120329">
                    <rect width="100" height="19.5489" fill="white" transform="translate(0 0.224609)" />
                  </clipPath>
                </defs>
              </svg>
            </div>

            {status && (
              <div className="flex flex-row items-center gap-2">
                <button
                  className={`btn ${sign === 'signIn' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => {
                    if (checkPageNavToApp()) return;
                    navigate(paths.login + '?type=sign-in');
                  }}
                >
                  {t('login:signIn')}
                </button>
                <button
                  className={`btn ${sign === 'signUp' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => {
                    if (checkPageNavToApp()) return;
                    navigate(paths.login + '?type=sign-up');
                  }}
                >
                  {t('login:signUp')}
                </button>
              </div>
            )}
          </div>
          {/* 在PC端显示的时候，添加一个高度 */}
          {!isMobile && <div className="h-[60px] " />}
        </>
      )}
    </>
  );
}
