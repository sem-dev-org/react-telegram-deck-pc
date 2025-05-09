import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface PasswordInputRef {
  handlePasswordCheckValue: () => void;
  passwordHasError: boolean;
  password: string;
}

const PasswordInput = forwardRef<PasswordInputRef, {}>(function PasswordInput({}, ref) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    setPasswordVisible(!passwordVisible);
  };
  // 密码规则：6-16位，允许数字、大写字母、小写字母、特殊字符
  const alphanumericRegex = /^[A-Za-z0-9!@#$%^&*?(){}[\].,:;"'-=+_\\/|<>]{6,16}$/;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    // Only allow characters that match the regex pattern
    const validPassword = newPassword.replace(/[^A-Za-z0-9!@#$%^&*?(){}[\].,:;"'-=+_\\/|<>]/g, '');
    setPassword(validPassword);
    // // Update error state based on validation
    // if (validPassword.length > 0) {
    //   setPasswordHasError(!alphanumericRegex.test(validPassword));
    // } else {
      setPasswordHasError(false);
    // }
  };

  const [passwordHasError, setPasswordHasError] = useState(false);

  const handleCheckValue = () => {
    if (password.length < 6) {
      setPasswordHasError(true);
    } else if (!alphanumericRegex.test(password)) {
      setPasswordHasError(true);
    } else {
      setPasswordHasError(false);
    }
  };

  useImperativeHandle(ref, () => ({
    handlePasswordCheckValue: () => {
      handleCheckValue();
    },
    passwordHasError: passwordHasError,
    password: password,
  }));

  const { t } = useTranslation();
  return (
    <div className=" ">
      <label
        className={`input input bg-base-200 input-ghost h-12 w-full text-base ${passwordHasError ? 'input-error border-error border' : ''}`}
      >
        <input
          type={passwordVisible ? 'text' : 'password'}
          className=""
          required
          placeholder={t('login:password')}
          value={password}
          onChange={handlePasswordChange}
          minLength={6}
          maxLength={16}
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
                d="M10.3866 7.99995C10.3866 9.31995 9.31995 10.3866 7.99995 10.3866C6.67995 10.3866 5.61328 9.31995 5.61328 7.99995C5.61328 6.67995 6.67995 5.61328 7.99995 5.61328C9.31995 5.61328 10.3866 6.67995 10.3866 7.99995Z"
                stroke="#292D32"
                style={{ stroke: '#292D32', strokeOpacity: 1 }}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.00002 13.5138C10.3534 13.5138 12.5467 12.1271 14.0734 9.72714C14.6734 8.78714 14.6734 7.20714 14.0734 6.26714C12.5467 3.86714 10.3534 2.48047 8.00002 2.48047C5.64668 2.48047 3.45335 3.86714 1.92668 6.26714C1.32668 7.20714 1.32668 8.78714 1.92668 9.72714C3.45335 12.1271 5.64668 13.5138 8.00002 13.5138Z"
                stroke="#292D32"
                style={{ stroke: '#292D32', strokeOpacity: 1 }}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </label>
      {passwordHasError && (
        <p className="validator-hint text-error text-xs leading-4">
          {password.length < 6 && t('login:passwordErrorOne')}
        </p>
      )}
    </div>
  );
});

export default PasswordInput;
