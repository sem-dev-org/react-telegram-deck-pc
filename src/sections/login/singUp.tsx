import { useRef, useState } from 'react';
import PasswordInput, { PasswordInputRef } from './passwordInput';
import AccountInput, { AccountInputRef } from './accountInput';
import { signup } from '@/api/login';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/language';
import { useSettingStore } from '@/store/setting';

export default function SignUp({ setSign }: { setSign: (sign: string) => void }) {
  const [userAgreement, setUserAgreement] = useState(true);
  const [marketingPromotions, setMarketingPromotions] = useState(true);
  const { t } = useTranslation();
  const { userCode, setUserCode } = useSettingStore();
  //   const [codeHasError, setCodeHasError] = useState(false);
  //   const [code, setCode] = useState('');
  //   const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage } = useLanguage();

  const fadeInStyle = {
    animation: 'fadeIn 0.3s ease-in-out',
  };

  const accountInputRef = useRef<AccountInputRef>(null);
  const passwordInputRef = useRef<PasswordInputRef>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!userAgreement || !marketingPromotions) {
      return;
    }

    accountInputRef.current?.handleAccountCheckValue();
    passwordInputRef.current?.handlePasswordCheckValue();
    if (accountInputRef.current?.accountHasError || passwordInputRef.current?.passwordHasError) {
      return;
    }
    if (passwordInputRef.current?.password === '') {
      return;
    }
    if (
      accountInputRef.current?.checkValue === 'phone' &&
      (accountInputRef.current?.account === '' || accountInputRef.current?.country === '')
    ) {
      return;
    }
    if (accountInputRef.current?.checkValue === 'email' && accountInputRef.current?.account === '') {
      return;
    }

    // if (code === '') {
    //   setCodeHasError(true);
    //   return;
    // }
    setIsLoading(true);

    const data = {
      username:
        accountInputRef.current?.checkValue === 'phone'
          ? accountInputRef.current?.country + '-' + accountInputRef.current?.account
          : accountInputRef.current?.account,
      password: passwordInputRef.current?.password ? passwordInputRef.current?.password : '',
      getStartApp: userCode,
    };

    signup(data, {
      'Accept-Language': currentLanguage,
    })
      .then((res: any) => {
        if (res.code === 0) {
          toast.success(t('toast:signUpSuccess'));
          setSign('signIn');
          setUserCode('');
        } else if (res.code === 1002) {
          toast.error(t('login:phoneNumberAlreadyRegistered'));
        } else {
          toast.error(t('toast:signUpFailed'));
        }
      })
      .catch(() => {
        toast.error(t('toast:signUpFailed'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <style>
        {`
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-5px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `}
      </style>
      <div className="flex flex-col gap-2">
        <AccountInput ref={accountInputRef} />
        <PasswordInput ref={passwordInputRef} />
      </div>
      {/* <div className={`collapse overflow-visible ${isOpen ? 'collapse-open' : 'collapse-close'}`}>
        <div onClick={() => setIsOpen(!isOpen)} className="collapse-title min-h-auto p-0">
          <div className="flex items-center">
            <div className="px-0.5 text-sm leading-9">Enter Referral / Promo Code</div>
            <div
              className={`flex items-center justify-center transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.66112 5.04695C3.87012 4.84599 4.20247 4.8525 4.40344 5.06151L7 7.81793L9.59656 5.06151C9.79753 4.8525 10.1299 4.84599 10.3389 5.04695C10.5479 5.24792 10.5544 5.58027 10.3534 5.78927L7.37844 8.93927C7.27946 9.04221 7.14281 9.10039 7 9.10039C6.85719 9.10039 6.72055 9.04221 6.62156 8.93927L3.64656 5.78927C3.4456 5.58027 3.45211 5.24792 3.66112 5.04695Z"
                  fill="#A6ADBB"
                  style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)' }}
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="collapse-content" style={{ padding: 0 }}>
          <input
            type="text"
            className={`bg-base-200 input input-ghost h-12 w-full rounded-md px-4 text-base ${codeHasError ? 'input-error border-error border' : ''}`}
            placeholder="Referral / Promo Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {codeHasError && <p className="validator-hint text-error text-xs leading-4">Code does not exist</p>}
        </div>
      </div> */}

      <div>
        <div className="flex items-center gap-2.5">
          <div className="relative z-200">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm border-primary border-1"
              checked={userAgreement}
              onChange={() => setUserAgreement(!userAgreement)}
            />
            <p
              className={`bg-neutral absolute -bottom-7 left-0 w-auto rounded-md px-2 text-sm leading-7 whitespace-nowrap ${userAgreement ? 'hidden' : 'block'}`}
              style={userAgreement ? {} : fadeInStyle}
            >
              {t('login:userAgreement')}
            </p>
          </div>
          <div className="text-sm leading-5">{t('login:userAgreementConfirm')}</div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative z-150">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm border-primary border-1"
              checked={marketingPromotions}
              onChange={() => setMarketingPromotions(!marketingPromotions)}
            />
            <p
              className={`bg-neutral absolute -bottom-7 left-0 w-auto rounded-md px-2 text-sm leading-7 whitespace-nowrap ${marketingPromotions ? 'hidden' : 'block'}`}
              style={marketingPromotions ? {} : fadeInStyle}
            >
              {t('login:marketingPromotions')}
            </p>
          </div>
          <div className="text-sm leading-5">{t('login:marketingPromotions')}</div>
        </div>
      </div>

      <button className="btn btn-primary h-12 w-full" onClick={() => handleSubmit()} disabled={isLoading}>
        {isLoading ? <span className="loading loading-spinner loading-sm text-primary" /> : t('login:signUp')}
      </button>

      <div
        className="bg-base-300 btn btn-ghost btn-square text-primary h-5 w-full text-center text-sm font-bold"
        onClick={() => setSign('signIn')}
      >
        {t('login:signIn')}
      </div>
    </>
  );
}
