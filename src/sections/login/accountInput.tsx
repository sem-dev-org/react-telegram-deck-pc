import { useEffect, useImperativeHandle, useState, forwardRef } from 'react';
import CountrySelect from './countrySelect';
import { useTranslation } from 'react-i18next';
import { isPossiblePhoneNumber } from 'react-phone-number-input';

export interface AccountInputRef {
  handleAccountCheckValue: () => void;
  accountHasError: boolean;
  account: string;
  country: string;
  checkValue: string;
}

export default forwardRef<AccountInputRef, {}>(function AccountInput(
  {},
  ref: React.ForwardedRef<AccountInputRef>,
) {
  const { t } = useTranslation();
  const [accountHasError, setAccountHasError] = useState(false);
  const [account, setAccount] = useState('');
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAccount(value);

    // Check if first 4 characters are numbers
    if (/^\d{4}/.test(value)) {
      // If there are any non-digit characters after the first 4 numbers, treat as email
      if (value.length > 4 && !/^\d+$/.test(value)) {
        setCheckValue('email');
      } else {
        setCheckValue('phone');
      }
    } else {
      setCheckValue('email');
    }
  };

  // const [accountHasError, setAccountHasError] = useState(false);
  const [country, setCountry] = useState('');
  const [checkValue, setCheckValue] = useState('email');

  useEffect(() => {
    setAccountHasError(false);
  }, [checkValue]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    return isValid;
  };

  const validatePhone = (phone: string) => {
    // const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    // const isValid = phoneRegex.test(phone);
    const isValid = isPossiblePhoneNumber(country + phone);

    return isValid;
  };

  const handleCheckValue = () => {
    if (checkValue === 'email') {
      if (!validateEmail(account)) {
        setAccountHasError(true);
      } else {
        setAccountHasError(false);
      }
    } else if (checkValue === 'phone') {
      if (!validatePhone(account)) {
        setAccountHasError(true);
      } else {
        setAccountHasError(false);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    handleAccountCheckValue: () => {
      handleCheckValue();
    },
    accountHasError: accountHasError,
    account: account,
    country: country,
    checkValue: checkValue,
  }));

  return (
    <div className="relative">
      <div
        className={`bg-base-200 input input-ghost relative z-100 flex h-12 w-full items-center rounded-md pr-3 pl-0 text-base ${accountHasError ? 'input-error border-error border' : ''}`}
      >
        {checkValue === 'phone' && (
          <div className="flex h-full min-w-10 items-center">
            <CountrySelect setCountry={setCountry} />
            <div className="bg-base-content/10 h-8 w-[2px]" />
          </div>
        )}
        <input
          type="text"
          value={account}
          onChange={handleAccountChange}
          placeholder={t('login:emailOrPhoneNumber')}
          className={`flex-1 bg-transparent outline-none ${checkValue === 'email' ? 'px-2.5' : ''}`}
        />
      </div>
      {accountHasError && (
        <>
          {checkValue === 'email' && (
            <p className="validator-hint text-error text-xs leading-4"> {t('login:emailError')}</p>
          )}
          {checkValue === 'phone' && (
            <p className="validator-hint text-error text-xs leading-4"> {t('login:phoneError')}</p>
          )}
        </>
      )}
    </div>
  );
});
