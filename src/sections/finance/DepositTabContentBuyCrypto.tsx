import { MoneyInput } from '@/components/ui';
import clsx from 'clsx';
import { useState } from 'react';

export const DepositTabContentBuyCrypto = () => {
  const [isValidAmount, setIsValidAmount] = useState<boolean>(true);
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const MIN_AMOUNT = 100;
  const MAX_AMOUNT = 50000;

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmount(numericValue);

    const numAmount = parseInt(numericValue || '0', 10);
    setIsValidAmount(numAmount >= MIN_AMOUNT && numAmount <= MAX_AMOUNT);
  };

  return (
    <div className="bg-base-100 flex flex-col gap-3 py-3">
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-1 py-2">
          <p className="text-sm">You Send</p>
          <p className="text-xs">100 ~ 50,000 PHP</p>
        </div>

        <MoneyInput
          placeholder="0.00"
          className={clsx(`bg-base-200 h-18`, !isValidAmount && 'border-error border')}
          onChange={handleAmountChange}
          value={amount}
          suffix={
            <button className="btn btn-neutral mr-4 flex min-w-[120px] items-center justify-between">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.76331 13.9404L7.75896 13.9381L7.74386 13.9299C7.731 13.9229 7.7126 13.9128 7.68905 13.8997C7.64195 13.8734 7.57416 13.8349 7.48864 13.7846C7.31767 13.684 7.07545 13.5359 6.7857 13.3433C6.20716 12.9587 5.43414 12.3934 4.65906 11.6709C3.12521 10.241 1.5 8.11673 1.5 5.5C1.5 3.54796 3.1424 2 5.125 2C6.29092 2 7.33488 2.53273 8 3.36773C8.66512 2.53273 9.70908 2 10.875 2C12.8576 2 14.5 3.54796 14.5 5.5C14.5 8.11673 12.8748 10.241 11.3409 11.6709C10.5659 12.3934 9.79284 12.9587 9.2143 13.3433C8.92455 13.5359 8.68233 13.684 8.51136 13.7846C8.42584 13.8349 8.35806 13.8734 8.31095 13.8997C8.2874 13.9128 8.269 13.9229 8.25614 13.9299L8.24104 13.9381L8.23669 13.9404L8.23485 13.9414C8.08821 14.0193 7.91179 14.0193 7.76515 13.9414L7.76331 13.9404Z"
                  fill="#A6ADBB"
                />
              </svg>
              <p className="text-sm font-bold">PHP</p>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.18414 5.7676C4.423 5.53792 4.80282 5.54537 5.0325 5.78423L8 8.93443L10.9675 5.78423C11.1972 5.54537 11.577 5.53792 11.8159 5.7676C12.0547 5.99727 12.0622 6.3771 11.8325 6.61596L8.4325 10.216C8.31938 10.3336 8.16321 10.4001 8 10.4001C7.83679 10.4001 7.68062 10.3336 7.5675 10.216L4.1675 6.61596C3.93782 6.3771 3.94527 5.99727 4.18414 5.7676Z"
                  fill="#A6ADBB"
                />
              </svg>
            </button>
          }
        />
        <div className="flex items-center justify-between px-1 py-2">
          <p className="text-sm">≈ 1000.00 </p>
        </div>
      </div>

      <div className="divider">
        <div>
          <svg className="fill-neutral" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
            <path d="M117.66,170.34a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L72,188.69V48a8,8,0,0,1,16,0V188.69l18.34-18.35A8,8,0,0,1,117.66,170.34Zm96-96-32-32a8,8,0,0,0-11.32,0l-32,32a8,8,0,0,0,11.32,11.32L168,67.31V208a8,8,0,0,0,16,0V67.31l18.34,18.35a8,8,0,0,0,11.32-11.32Z"></path>
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between px-1 py-2">
          <p className="text-sm">You Receive</p>
          <p className="text-xs">1 PHP ≈ 0.017 USDT</p>
        </div>

        <MoneyInput
          placeholder="0.00"
          className={`bg-base-200 h-18`}
          suffix={
            <button className="btn btn-neutral mr-4 flex min-w-[120px] items-center justify-between">
              <img src="/icons/tokens/usdt.svg" alt="USDT" className="mr-2 h-4 w-4" />
              <p className="text-sm font-bold">USDT</p>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.18414 5.7676C4.423 5.53792 4.80282 5.54537 5.0325 5.78423L8 8.93443L10.9675 5.78423C11.1972 5.54537 11.577 5.53792 11.8159 5.7676C12.0547 5.99727 12.0622 6.3771 11.8325 6.61596L8.4325 10.216C8.31938 10.3336 8.16321 10.4001 8 10.4001C7.83679 10.4001 7.68062 10.3336 7.5675 10.216L4.1675 6.61596C3.93782 6.3771 3.94527 5.99727 4.18414 5.7676Z"
                  fill="#A6ADBB"
                />
              </svg>
            </button>
          }
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between px-1 py-2">
          <p className="text-sm">Payment Providers</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSelectedPaymentProvider('banxa')}
            className={`bg-neutral btn border-neutral flex h-[54px] items-center justify-center rounded-lg border ${selectedPaymentProvider === 'banxa' ? 'border-primary' : ''}`}
          >
            <img src="/icons/payment-providers/banxa.svg" />
          </button>
          <button
            onClick={() => setSelectedPaymentProvider('monn-pay')}
            className={`bg-neutral btn border-neutral flex h-[54px] items-center justify-center rounded-lg border ${selectedPaymentProvider === 'monn-pay' ? 'border-primary' : ''}`}
          >
            <img src="/icons/payment-providers/monn-pay.svg" />
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between px-1 py-2">
          <p className="text-sm">Payment Providers</p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => setSelectedPaymentProvider('monn-pay')}
            className={`bg-neutral btn border-neutral flex h-[54px] items-center justify-between rounded-lg border ${selectedPaymentProvider === 'monn-pay' ? 'border-primary' : ''}`}
          >
            <img src="/icons/payment-methods/visa.svg" />
            <div className="flex flex-col items-end gap-1 text-sm font-normal">
              <p>You Get</p>
              <p>17.264018 USDT</p>
            </div>
          </button>
        </div>
      </div>

      <div
        className="flex min-h-[148px] w-full items-center justify-between rounded-lg p-4"
        style={{
          background:
            'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 0.200 0.882 0.741 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <div className="flex flex-col gap-2 self-start">
          <div className="flex items-start gap-4">
            <img src="/icons/isometric/1.svg" className="h-12 w-12" />
            <div className="flex flex-col gap-1">
              <p className="text-neutral-content font-semibold">First Deposit Bonus</p>
              <p className="text-primary/80 text-sm">100% up to $300</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed">Get an extra 100% in your bonus pool on minimum of ₱591.31 deposit.</p>
        </div>
        <input type="checkbox" defaultChecked className="checkbox checkbox-primary checkbox-sm" />
      </div>

      <div className="bg-base-200 flex flex-col gap-2 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            defaultChecked
            className="checkbox checkbox-primary checkbox-sm ring-primary rounded-full ring"
          />
          <p className="text-sm">I have read and agree to the disclaimer.</p>
        </div>

        <div className="btn btn-primary btn-md flex h-[48px] items-center justify-center font-normal">
          <span className="font-semibold">Buy via MoonPay</span> 17.264018 USDT
        </div>
      </div>
    </div>
  );
};
