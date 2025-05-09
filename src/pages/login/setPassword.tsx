import { FullBleedContainer, SafeArea } from '@/components/ui/SafeArea';
import Page from '@/components/ui/Page';
import { useState } from 'react';

export default function SetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [confirmPasswordHasError, setConfirmPasswordHasError] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  // const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordHasError(false);
  };

  const validatePassword = () => {
    setPasswordHasError(password.length < 6);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordHasError(false);
  };

  const validateConfirmPassword = () => {
    setConfirmPasswordHasError(confirmPassword.length < 6 || confirmPassword !== password);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleSubmit = () => {
    validatePassword();
    validateConfirmPassword();
    if (passwordHasError || confirmPasswordHasError) {
      return;
    }
    setLoading(true);
    console.log('submit');
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

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
            WELCOME <br /> PACKAGE UP TO <br />{' '}
            <span className="text-primary">
              1000% DEPOSIT <br /> BONUS
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
          <div className="leading-7 font-bold"> Set New Password </div>
          <div>
            <fieldset className="fieldset">
              <label
                className={`input input bg-base-200 input-ghost h-12 w-full text-base ${passwordHasError ? 'input-error border-error border' : ''}`}
              >
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  required
                  placeholder="New Password"
                  value={password}
                  onChange={handlePasswordChange}
                  pattern="[0-9]*"
                  minLength={6}
                />
                <button type="button" onClick={togglePasswordVisibility}>
                  {isPasswordVisible ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.00035 3.5C5.12872 3.5 2.6908 5.36249 1.83115 7.94677C1.81929 7.98243 1.8193 8.02118 1.83119 8.05683C2.6919 10.6392 5.12889 12.5 7.99918 12.5C10.8708 12.5 13.3087 10.6375 14.1684 8.05323C14.1802 8.01757 14.1802 7.97882 14.1683 7.94317C13.3076 5.36076 10.8706 3.5 8.00035 3.5ZM0.882274 7.63113C1.87378 4.65047 4.68527 2.5 8.00035 2.5C11.3139 2.5 14.1243 4.64848 15.117 7.62697C15.1973 7.86768 15.1973 8.12812 15.1173 8.36887C14.1257 11.3495 11.3142 13.5 7.99918 13.5C4.68565 13.5 1.87522 11.3515 0.882492 8.37303C0.802265 8.13233 0.802188 7.87189 0.882274 7.63113ZM7.9998 6.5C7.17138 6.5 6.4998 7.17157 6.4998 8C6.4998 8.82843 7.17138 9.5 7.9998 9.5C8.82823 9.5 9.49981 8.82843 9.49981 8C9.49981 7.17157 8.82823 6.5 7.9998 6.5ZM5.4998 8C5.4998 6.61929 6.61909 5.5 7.9998 5.5C9.38052 5.5 10.4998 6.61929 10.4998 8C10.4998 9.38071 9.38052 10.5 7.9998 10.5C6.61909 10.5 5.4998 9.38071 5.4998 8Z"
                        fill="#A6ADBB"
                      />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.64643 1.64645C1.84169 1.45118 2.15827 1.45118 2.35353 1.64645L4.22504 3.51795C5.33408 2.87078 6.62435 2.5 7.99997 2.5C11.3978 2.5 14.2667 4.75919 15.189 7.85632C15.2167 7.94938 15.2167 8.0485 15.189 8.14157C14.7395 9.65275 13.8273 10.9634 12.6172 11.9102L14.3535 13.6464C14.5488 13.8417 14.5488 14.1583 14.3535 14.3536C14.1583 14.5488 13.8417 14.5488 13.6464 14.3536L1.64643 2.35355C1.45116 2.15829 1.45116 1.84171 1.64643 1.64645ZM11.9041 11.197C12.9632 10.3998 13.7705 9.28683 14.1863 7.99909C13.3424 5.38785 10.891 3.5 7.99997 3.5C6.90112 3.5 5.86693 3.7723 4.96012 4.25304L6.62134 5.91425C7.01647 5.65267 7.49066 5.5 7.99998 5.5C9.38069 5.5 10.5 6.61929 10.5 8C10.5 8.50932 10.3473 8.98351 10.0857 9.37864L11.9041 11.197ZM9.35389 8.6468C9.44763 8.45099 9.49998 8.23176 9.49998 8C9.49998 7.17157 8.82841 6.5 7.99998 6.5C7.76822 6.5 7.54899 6.55235 7.35318 6.64609L9.35389 8.6468ZM2.97619 5.09998C3.18701 5.27832 3.21335 5.5938 3.03501 5.80463C2.4947 6.44336 2.07572 7.18727 1.81303 8.00091C2.65691 10.6121 5.10831 12.5 7.99938 12.5C8.61464 12.5 9.20914 12.4147 9.77209 12.2555C10.0378 12.1803 10.3141 12.3348 10.3893 12.6005C10.4644 12.8663 10.3099 13.1426 10.0442 13.2177C9.39359 13.4017 8.70755 13.5 7.99938 13.5C4.6015 13.5 1.73259 11.2408 0.810345 8.14368C0.782634 8.05062 0.782619 7.9515 0.810303 7.85843C1.10911 6.85387 1.61244 5.93793 2.27153 5.1588C2.44987 4.94797 2.76536 4.92163 2.97619 5.09998Z"
                        fill="#A6ADBB"
                      />
                    </svg>
                  )}
                </button>
              </label>
              {passwordHasError && (
                <p className="validator-hint text-error text-xs leading-4">
                  At least 6 characters with a capital letter and a number.
                </p>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <label
                className={`input input bg-base-200 input-ghost h-12 w-full text-base ${confirmPasswordHasError ? 'input-error border-error border' : ''}`}
              >
                <input
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  required
                  placeholder="Re-enter New Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  pattern="[0-9]*"
                  minLength={6}
                />
                <button type="button" onClick={toggleConfirmPasswordVisibility}>
                  {isConfirmPasswordVisible ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.00035 3.5C5.12872 3.5 2.6908 5.36249 1.83115 7.94677C1.81929 7.98243 1.8193 8.02118 1.83119 8.05683C2.6919 10.6392 5.12889 12.5 7.99918 12.5C10.8708 12.5 13.3087 10.6375 14.1684 8.05323C14.1802 8.01757 14.1802 7.97882 14.1683 7.94317C13.3076 5.36076 10.8706 3.5 8.00035 3.5ZM0.882274 7.63113C1.87378 4.65047 4.68527 2.5 8.00035 2.5C11.3139 2.5 14.1243 4.64848 15.117 7.62697C15.1973 7.86768 15.1973 8.12812 15.1173 8.36887C14.1257 11.3495 11.3142 13.5 7.99918 13.5C4.68565 13.5 1.87522 11.3515 0.882492 8.37303C0.802265 8.13233 0.802188 7.87189 0.882274 7.63113ZM7.9998 6.5C7.17138 6.5 6.4998 7.17157 6.4998 8C6.4998 8.82843 7.17138 9.5 7.9998 9.5C8.82823 9.5 9.49981 8.82843 9.49981 8C9.49981 7.17157 8.82823 6.5 7.9998 6.5ZM5.4998 8C5.4998 6.61929 6.61909 5.5 7.9998 5.5C9.38052 5.5 10.4998 6.61929 10.4998 8C10.4998 9.38071 9.38052 10.5 7.9998 10.5C6.61909 10.5 5.4998 9.38071 5.4998 8Z"
                        fill="#A6ADBB"
                      />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.64643 1.64645C1.84169 1.45118 2.15827 1.45118 2.35353 1.64645L4.22504 3.51795C5.33408 2.87078 6.62435 2.5 7.99997 2.5C11.3978 2.5 14.2667 4.75919 15.189 7.85632C15.2167 7.94938 15.2167 8.0485 15.189 8.14157C14.7395 9.65275 13.8273 10.9634 12.6172 11.9102L14.3535 13.6464C14.5488 13.8417 14.5488 14.1583 14.3535 14.3536C14.1583 14.5488 13.8417 14.5488 13.6464 14.3536L1.64643 2.35355C1.45116 2.15829 1.45116 1.84171 1.64643 1.64645ZM11.9041 11.197C12.9632 10.3998 13.7705 9.28683 14.1863 7.99909C13.3424 5.38785 10.891 3.5 7.99997 3.5C6.90112 3.5 5.86693 3.7723 4.96012 4.25304L6.62134 5.91425C7.01647 5.65267 7.49066 5.5 7.99998 5.5C9.38069 5.5 10.5 6.61929 10.5 8C10.5 8.50932 10.3473 8.98351 10.0857 9.37864L11.9041 11.197ZM9.35389 8.6468C9.44763 8.45099 9.49998 8.23176 9.49998 8C9.49998 7.17157 8.82841 6.5 7.99998 6.5C7.76822 6.5 7.54899 6.55235 7.35318 6.64609L9.35389 8.6468ZM2.97619 5.09998C3.18701 5.27832 3.21335 5.5938 3.03501 5.80463C2.4947 6.44336 2.07572 7.18727 1.81303 8.00091C2.65691 10.6121 5.10831 12.5 7.99938 12.5C8.61464 12.5 9.20914 12.4147 9.77209 12.2555C10.0378 12.1803 10.3141 12.3348 10.3893 12.6005C10.4644 12.8663 10.3099 13.1426 10.0442 13.2177C9.39359 13.4017 8.70755 13.5 7.99938 13.5C4.6015 13.5 1.73259 11.2408 0.810345 8.14368C0.782634 8.05062 0.782619 7.9515 0.810303 7.85843C1.10911 6.85387 1.61244 5.93793 2.27153 5.1588C2.44987 4.94797 2.76536 4.92163 2.97619 5.09998Z"
                        fill="#A6ADBB"
                      />
                    </svg>
                  )}
                </button>
              </label>
              {confirmPasswordHasError && (
                <p className="validator-hint text-error text-xs leading-4">
                  {/* {!isConfirmPasswordValid ? */}
                  Password do not match. Please ensure both fields are identical.
                  {/* "At least 6 characters with a capital letter and a number."} */}
                </p>
              )}
            </fieldset>
          </div>

          <button className="btn btn-primary h-12" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-sm text-primary" /> : 'Continue'}
          </button>
        </div>
      </SafeArea>
    </Page>
  );
}
