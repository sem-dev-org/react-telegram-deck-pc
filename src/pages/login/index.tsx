import { FullBleedContainer, SafeArea } from '@/components/ui/SafeArea';
import Page from '@/components/ui/Page';
import { useEffect, useState } from 'react';
import SignIn from '@/sections/login/singIn';
import SignUp from '@/sections/login/singUp';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { signOut } from '@/cookies/sign';

export default function LoginPage() {
  const [sign, setSign] = useState('');
  const { t } = useTranslation();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const type = searchParams.get('type');

  useEffect(() => {
    signOut();  
  }, []);
  
  useEffect(() => {
    if (type === 'sign-in') {
      setSign('signIn');
    } else if (type === 'sign-up') {
      setSign('signUp');
    } else {
      setSign('signIn');
    }
  }, [type]);

  return (
    <Page>
      <FullBleedContainer>
        <div
          className="relative flex h-[234px] w-full"
          style={{
            background:
              'radial-gradient(100% 2006px at 0% 0%, color(display-p3 0.247 0.318 0.196) 0%, color(display-p3 0.082 0.098 0.118) 100%), color(display-p3 0.082 0.098 0.118)',
          }}
        >
          <div
            className="font-montserrat text-[18px] leading-5 font-bold text-white"
            style={{
              position: 'absolute',
              width: '185px',
              height: '60px',
              left: '42px',
              top: '100px',
            }}
          >
            {t('casino:welcome')} <br /> {t('casino:packageUpTo')} <br />{' '}
            <span className="text-primary">
              1000% {t('casino:deposit')} <br /> {t('casino:bonus')}
            </span>
          </div>

          <img
            src="/images/banner/1.png"
            alt="bonus"
            className="absolute right-[-38px] bottom-0 h-[204px] w-[272px] object-cover"
          />
        </div>
      </FullBleedContainer>
      <svg
        width="100%"
        height="auto"
        viewBox="0 0 375 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={{ maxWidth: '100%' }}
        className="text-base-300 z-10 -translate-y-[calc(100%-1px)]"
      >
        <path d="M0 0C147.333 21.3791 229.235 19.7551 375 0V17H0V0Z" fill="currentColor" style={{ fillOpacity: 1 }} />
      </svg>
      <SafeArea top={false}>
        <div className="flex flex-col gap-3 px-9 pt-7.5">
          <div className="flex items-center justify-between">
            <div className="leading-7 font-bold"> {sign === 'signIn' ? 'Sign In' : 'Sign Up'}</div>
            {/* <div className="join  ">
                            <input className="join-item btn checked:bg-primary checked:text-primary-content" style={{ outline: 'none' }}
                                type="radio" name="options" aria-label="Email" checked={checkValue === 'email'} onChange={() => setCheckValue('email')} />
                            <input className="join-item btn checked:bg-primary checked:text-primary-content" style={{ outline: 'none' }}
                                type="radio" name="options" aria-label="Phone Number" checked={checkValue === 'phone'} onChange={() => setCheckValue('phone')} />
                        </div> */}
          </div>

          {sign === 'signIn' && <SignIn setSign={setSign} />}
          {sign === 'signUp' && <SignUp setSign={setSign} />}

          <div>
            <div className="divider">{t('login:logInDirectlyWith')}</div>
            <div className="flex items-center justify-center gap-4">
              <button className="btn btn-ghost btn-square">
                <img src="/images/login/google.svg" alt="google" />
              </button>
              <button className="btn btn-ghost btn-square">
                <img src="/images/login/twitter-x.svg" alt="twitter" />
              </button>
              <button className="btn btn-ghost btn-square">
                <img src="/images/login/telegram.svg" alt="telegram" />
              </button>
            </div>
          </div>
        </div>
      </SafeArea>
    </Page>
  );
}
