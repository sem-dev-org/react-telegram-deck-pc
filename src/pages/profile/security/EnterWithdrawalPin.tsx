import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function EnterWithdrawalPin() {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const maxLength = 6;
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Reset error when PIN changes
  useEffect(() => {
    if (error) setError('');

    // Auto-submit when PIN reaches max length
    if (pin.length === maxLength) {
      handleSubmit();
    }
  }, [pin]);

  const handleNumberPress = (num: number | string) => {
    if (loading) return;

    setActiveButton(Number(num));
    setTimeout(() => setActiveButton(null), 200);

    if (pin.length < maxLength) {
      setPin((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    if (loading) return;

    setActiveButton(-1);
    setTimeout(() => setActiveButton(null), 200);

    setPin((prev) => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (loading || pin.length !== maxLength) return;

    setLoading(true);

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Example validation: PIN is 123456
      if (pin === '123456') {
        // Redirect to success page or continue the flow
        navigate('/profile/security');
      } else {
        setError('Invalid PIN. Please try again.');
        setPin('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-100 m-4 flex flex-col items-center justify-center rounded-2xl px-3 pt-7 pb-4">
      <div className="mb-16 flex w-full max-w-xs flex-col items-center gap-4">
        {/* Lock Icon */}
        <div className="flex justify-center">
          <svg width="61" height="60" viewBox="0 0 61 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              opacity="0.32"
              d="M6.31735 10.7164C6.5562 8.65719 7.80551 6.95716 9.82967 6.50953C12.987 5.81128 19.1069 5 30.5 5C41.8931 5 48.013 5.81128 51.1704 6.50953C53.1945 6.95716 54.4437 8.65719 54.6826 10.7164C55.0439 13.8305 55.5 18.9591 55.5 25C55.5 36.2855 49.5439 46.8455 39.5092 52.0099C36.1572 53.735 32.8859 55 30.5 55C28.1141 55 24.8427 53.735 21.4907 52.0099C11.4562 46.8455 5.5 36.2855 5.5 25C5.5 18.9591 5.95616 13.8305 6.31735 10.7164Z"
              fill="#A6ADBB"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M23.3026 19.3845C23.4737 15.5339 26.6455 12.5 30.5 12.5C34.3545 12.5 37.5263 15.5339 37.6974 19.3845L37.8465 22.742L38.019 22.7566C40.0256 22.93 41.4419 24.3252 41.5941 26.3335C41.6836 27.5142 41.75 29.111 41.75 31.25C41.75 33.389 41.6836 34.9857 41.5941 36.1665C41.4419 38.1747 40.0256 39.57 38.019 39.7434C36.399 39.8834 33.9993 40 30.5 40C27.0008 40 24.601 39.8834 22.981 39.7434C20.9744 39.57 19.5581 38.1747 19.4059 36.1665C19.3164 34.9857 19.25 33.389 19.25 31.25C19.25 29.2961 19.2975 27.7947 19.3641 26.6495C19.4908 24.4756 20.9919 22.9322 23.1535 22.7397L23.3026 19.3845ZM32.7023 19.6065L32.8318 22.5189C32.1148 22.5068 31.339 22.5 30.5 22.5C29.6619 22.5 28.8861 22.5067 28.1682 22.5187L28.2977 19.6066C28.3501 18.4282 29.3206 17.5 30.5 17.5C31.6794 17.5 32.6499 18.4282 32.7023 19.6065ZM33 30C33 31.0222 32.3864 31.9012 31.5075 32.2887L31.6835 33.8537C31.727 34.2404 31.6638 34.6631 31.3144 34.8345C31.1253 34.9274 30.8616 35 30.5 35C30.1384 35 29.8747 34.9274 29.6856 34.8345C29.3362 34.6631 29.273 34.2404 29.3165 33.8537L29.4925 32.2887C28.6136 31.9012 28 31.0222 28 30C28 28.6192 29.1193 27.5 30.5 27.5C31.8807 27.5 33 28.6192 33 30Z"
              fill="#A6ADBB"
            />
          </svg>
        </div>

        {/* PIN Instructions */}
        <p className="text-sm leading-5">
          {t('common.withdrawalPinInstructions', {
            digits: 6,
          })}
        </p>

        {/* Error message */}
        {/* {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-base-content/30  text-3xl"
                    >
                        {error}
                    </motion.p>
                )} */}

        {/* PIN Dots */}
        <div className="flex gap-4">
          {Array.from({ length: maxLength }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 1 }}
              animate={{
                backgroundColor: index < pin.length ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`h-6 w-6 rounded-full`}
            />
          ))}
        </div>
      </div>

      <div>
        {/* Number Pad */}
        <div className="grid w-full max-w-xs grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <motion.button
              key={num}
              // whileTap={{ scale: 0.95 }}
              onClick={() => handleNumberPress(num)}
              disabled={loading}
              className={`border-base-content/10 relative flex h-18 w-18 items-center justify-center overflow-hidden rounded-full border text-2xl ${
                loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              } ${activeButton === num ? 'bg-primary text-base-100' : 'bg-base-200'}`}
            >
              {num}
              {activeButton === num && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute h-full w-full rounded-full bg-blue-400"
                />
              )}
            </motion.button>
          ))}
          <div className="col-start-2">
            <motion.button
              // whileTap={{ scale: 0.95 }}
              onClick={() => handleNumberPress(0)}
              disabled={loading}
              className={`border-base-content/10 relative flex h-18 w-18 items-center justify-center overflow-hidden rounded-full border text-2xl ${
                loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              } ${activeButton === 0 ? 'bg-primary text-base-100' : 'bg-base-200'}`}
            >
              0
              {activeButton === 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-primary text-base-100 absolute h-full w-full rounded-full"
                />
              )}
            </motion.button>
          </div>
          <div className="col-start-3">
            <motion.button
              // whileTap={{ scale: 0.95 }}
              onClick={handleBackspace}
              disabled={loading || pin.length === 0}
              className={`border-base-content/10 relative flex h-18 w-18 items-center justify-center overflow-hidden rounded-full border text-xl ${
                loading || pin.length === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              } ${activeButton === -1 ? 'bg-error' : 'bg-base-200'}`}
            >
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.7256 10.2598C18.7256 10.674 18.3898 11.0098 17.9756 11.0098L5.38549 11.0098L7.48592 12.9602C7.78946 13.242 7.80703 13.7166 7.52518 14.0201C7.24333 14.3236 6.76878 14.3412 6.46525 14.0594L2.96525 10.8094C2.81242 10.6675 2.72559 10.4683 2.72559 10.2598C2.72559 10.0512 2.81242 9.85208 2.96525 9.71017L6.46525 6.46017C6.76878 6.17832 7.24333 6.1959 7.52518 6.49943C7.80703 6.80296 7.78946 7.27751 7.48592 7.55936L5.38549 9.50977L17.9756 9.50977C18.3898 9.50977 18.7256 9.84556 18.7256 10.2598Z"
                  fill="#A6ADBB"
                />
              </svg>

              {activeButton === -1 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-error absolute h-full w-full rounded-full text-white"
                />
              )}
            </motion.button>
          </div>
        </div>

        {/* Loading indicator */}

        {loading && (
          <div className="bg-base-100/90 fixed top-0 left-0 z-50 flex h-screen w-full items-center justify-center">
            <span className="loading loading-spinner loading-xl text-primary"></span>
          </div>
        )}
      </div>
    </div>
  );
}
