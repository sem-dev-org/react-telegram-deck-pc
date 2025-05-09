import { FullBleedContainer } from '@/components/ui/SafeArea';
import { SafeContent } from '@/components/ui/SafeArea';
import Page from '@/components/ui/Page';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import CountrySelect from '@/sections/login/countrySelect';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { bindMobile, sendMobileCode } from '@/api/profile';

export default function PhoneVerificationPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCurrentCountry, setPhoneCurrentCountry] = useState('');
  const [isPhoneVerifiedError, setIsPhoneVerifiedError] = useState<boolean>(true);
  const [isPhoneCodeSent, setIsPhoneCodeSent] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { t } = useTranslation();

  const [codeLoading, setCodeLoading] = useState(false);
  const [code, setCode] = useState('');
  const [isCodeVerifiedError, setIsCodeVerifiedError] = useState<boolean>(false);
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

  const validatePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneString = e.target.value.replace(/[^0-9]/g, '');
    const phoneNumber = phoneCurrentCountry + phoneString;
    setPhoneNumber(phoneString);
    if (!isPossiblePhoneNumber(phoneNumber)) {
      setIsPhoneVerifiedError(true);
    } else {
      setIsPhoneVerifiedError(false);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    sendMobileCode({ mobile: phoneCurrentCountry + '-' + phoneNumber })
      .then((res) => {
        if (res.code === 0) {
          setIsPhoneCodeSent(true);
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
    bindMobile({ mobile: phoneCurrentCountry + '-' + phoneNumber, code: code })
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
              {t('profile:phoneVerification')}
            </p>
            {isPhoneCodeSent === false && (
              <>
                <p className="text-sm leading-5">
                  {t('profile:phoneVerificationDescription')}
                </p>
                <div>
                  <fieldset className="fieldset">
                    <div className="relative mb-1 flex items-center gap-2">
                      <div className="flex h-full min-w-20 items-center">
                        <CountrySelect setCountry={setPhoneCurrentCountry} />
                      </div>
                      <input
                        type="text"
                        className={`input bg-base-200 input-ghost h-12 w-full flex-1 tabular-nums`}
                        required
                        placeholder={t('profile:enterPhoneNumber')}
                        value={phoneNumber}
                        onChange={validatePhoneNumber}
                      />
                    </div>
                  </fieldset>
                  <button
                    className="btn btn-primary h-12 w-full"
                    onClick={handleSubmit}
                    disabled={loading || isPhoneVerifiedError}
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
            {isPhoneCodeSent === true && (
              <>
                <p className="text-sm leading-5">
                  {t('profile:verificationCodeDescription')}
                  <span className="text-sm leading-5"> {phoneCurrentCountry + '-' + phoneNumber}</span>
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
                    <button className="btn btn-neutral h-12 w-full" onClick={() => setIsPhoneCodeSent(false)}>
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
