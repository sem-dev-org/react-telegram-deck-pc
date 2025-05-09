import { FullBleedContainer } from '@/components/ui/SafeArea';
import { SafeContent } from '@/components/ui/SafeArea';
import Page from '@/components/ui/Page';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { bindEmail, sendEmailCode } from '@/api/profile';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function EmailVerificationPage() {
  const [email, setEmail] = useState('');
  const [isEmailVerifiedError, setIsEmailVerifiedError] = useState<boolean>(true);

  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [isCodeVerifiedError, setIsCodeVerifiedError] = useState<boolean>(true);

  const [codeLoading, setCodeLoading] = useState(false);

  const [isEmailCodeSent, setIsEmailCodeSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const validateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(email);
    if (!emailRegex.test(email)) {
      setIsEmailVerifiedError(true);
    } else {
      setIsEmailVerifiedError(false);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    sendEmailCode({ email: email })
      .then((res) => {
        if (res.code === 0) {
          setIsEmailCodeSent(true);
          validateCode(res.data.temp_code);
          ResendEmail();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const ResendEmail = () => {
    if (countdown === 0) {
      setCountdown(60);
      // Here you can add your email resend logic
    }
  };

  const validateCode = (value: string) => {
    setCode(value);
    setIsCodeVerifiedError(value.length !== 6);
  };

  const handleSubmitCode = () => {
    setCodeLoading(true);
    bindEmail({ email: email, code: code })
      .then((res) => {
        if (res.code === 0) {
          toast.success(t('common.success'));
          navigate(-1);
        }
      })
      .finally(() => {
        setCodeLoading(false);
      });
  };

  return (
    <FullBleedContainer>
      <SafeContent>
        <Page className="p-3">
          <div className="bg-base-100 flex flex-col gap-3 rounded-lg px-3 py-4">
            <p className="text-base leading-6 font-bold">
              {t('profile:emailVerification')}
            </p>
            {isEmailCodeSent === false && (
              <>
                <p className="text-sm leading-5">
                  {t('profile:emailVerificationDescription')}
                </p>
                <div>
                  <fieldset className="fieldset">
                    <div className="relative mb-1">
                      <input
                        type="text"
                        className={`input bg-base-200 input-ghost h-12 w-full tabular-nums`}
                        required
                        placeholder={t('profile:enterEmailAddress')}
                        value={email}
                        onChange={(e) => validateEmail(e)}
                      />
                    </div>
                  </fieldset>
                  <button
                    className="btn btn-primary h-12 w-full"
                    onClick={handleSubmit}
                    disabled={loading || isEmailVerifiedError}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm text-primary" />
                    ) : (
                      t('common.verify')
                    )}
                  </button>
                </div>
              </>
            )}
            {isEmailCodeSent && (
              <>
                <p className="text-sm leading-5">
                  {t('profile:verificationCodeDescription')}
                  <span className="font-bold"> {email}</span>
                </p>
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend h-9 px-1 text-sm font-normal">
                      {t('profile:verificationCode')}
                    </legend>
                    <label className="input input-ghost bg-base-200 h-12 w-full tabular-nums">
                      <input
                        type="text"
                        className="input-ghost bg-transparent"
                        required
                        placeholder={t('profile:sixDigitVerificationCode')}
                        value={code}
                        onChange={(e) => validateCode(e.target.value)}
                        minLength={6}
                        maxLength={6}
                      />

                      <button
                        type="button"
                        className="btn btn-secondary btn-xs rounded-full px-4 py-0 text-sm font-semibold"
                      >
                        {t('profile:paste')}
                      </button>
                    </label>
                  </fieldset>
                  <div className="mt-1 mb-2 text-center text-xs leading-6">
                    {countdown > 0 ? (
                      <>
                        {t('profile:resendIn')} <span className="text-primary inline-block w-4">{countdown}s</span>
                      </>
                    ) : (
                      <div className="text-center">
                        <button
                          className={`btn btn-ghost btn-xs bg-base-100 mx-auto text-center text-sm ${countdown > 0 ? 'text-gray-400' : 'text-primary'}`}
                          onClick={handleSubmit}
                          disabled={countdown > 0}
                        >
                          {t('profile:resend')}
                        </button>
                      </div>
                    )}
                  </div>

                  {isCodeVerifiedError && (
                    <button className="btn btn-neutral h-12 w-full" onClick={() => setIsEmailCodeSent(false)}>
                      {t('profile:back')}
                    </button>
                  )}
                  {!isCodeVerifiedError && (
                    <button className="btn btn-primary h-12 w-full" onClick={handleSubmitCode} disabled={codeLoading}>
                      {codeLoading ? (
                        <span className="loading loading-spinner loading-sm text-primary" />
                      ) : (
                        t('common.submit')
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
}
