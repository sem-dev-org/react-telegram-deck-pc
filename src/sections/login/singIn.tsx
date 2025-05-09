import { useRef, useState } from 'react';

import PasswordInput, { PasswordInputRef } from './passwordInput';
import AccountInput, { AccountInputRef } from './accountInput';
import { signin } from '@/api/login';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { paths } from '@/routes/paths';
import { useNavigate } from 'react-router-dom';
import { signIn } from '@/cookies/sign';
import { useTranslation } from 'react-i18next';

export default function SignIn({ setSign }: { setSign: (sign: string) => void }) {
  const { updateUser, updateStatus } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  // useEffect(() => {
  //     setEmailHasError(false);
  //     setPasswordHasError(false);
  //     setPhoneHasError(false);
  // }, [checkValue]);

  const accountInputRef = useRef<AccountInputRef>(null);
  const passwordInputRef = useRef<PasswordInputRef>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
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
    };

    signin(data)
      .then((res: any) => {
        if (res.code === 0) {
          toast.success(t('toast:signInSuccess'));

          updateUser(res.user);
          updateStatus(res.status);

          const obj = {
            user: res.user,
            status: res.status,
            username: res.data.username,
            token: res.data.token,
          };
          signIn(obj);

          navigate(paths.main.casino.root);
        } else {
          toast.error(t('toast:signInFailed'));
        } 
      })
      .catch(() => {
        toast.error(t('toast:signInFailed'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {/* {
                checkValue === 'email' ? (
                    <EmailInput email={email} setEmail={setEmail} emailHasError={emailHasError} setEmailHasError={setEmailHasError} />
                ) : (
                    <PhoneInput phone={phone} setPhone={setPhone} phoneHasError={phoneHasError} phoneNum={phoneNum} setPhoneNum={setPhoneNum} setPhoneHasError={setPhoneHasError} />
                )
            } */}
        <AccountInput ref={accountInputRef} />
        <PasswordInput ref={passwordInputRef} />
      </div>
      <div className="bg-base-300 btn btn-ghost btn-square h-9 w-full justify-end text-sm font-semibold">
        {t('login:forgotPassword')}   
      </div>
      <button className="btn btn-primary h-12 w-full" onClick={() => handleSubmit()} disabled={isLoading}>
        {isLoading ? <span className="loading loading-spinner loading-sm text-primary" /> : t('login:signIn')}
      </button>

      <div
        className="bg-base-300 btn btn-ghost btn-square text-primary h-5 w-full text-center text-sm font-bold"
        onClick={() => setSign('signUp')}
      >
        {t('login:signUp')}
      </div>
    </>
  );
}
