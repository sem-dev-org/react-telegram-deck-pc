import { CopyToClipboard } from 'react-copy-to-clipboard';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

type CopyBtnProps = {
  text: string;
  children?: React.ReactNode;
  className?: string;
  showText?: boolean;
  callback?: () => void;
  iconClassName?: string;
};

export const checkVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: 'spring', duration: 0.5, bounce: 0 },
      opacity: { duration: 0.2 },
    },
  },
};

export const CopyBtn = ({ text, children, className, showText = true, callback, iconClassName }: CopyBtnProps) => {
  const [codeCopied, setCodeCopied] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (codeCopied) {
      const timer = setTimeout(() => {
        setCodeCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [codeCopied]);

  const handleCopyCode = () => {
    if (callback) {
      callback();
    }
    setCodeCopied(true);
  };



  return (
    <CopyToClipboard text={text} onCopy={handleCopyCode}>
      <button
        className={`${className} ${codeCopied ? 'bg-transparent' : 'btn-accent'} flex items-center justify-center`}
      >
        {codeCopied ? (
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            initial="hidden"
            animate="visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M4 10L8 14L16 6"
              stroke="#E7FB78"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={checkVariants}
            />
          </motion.svg>
        ) : (
          <>
            {children ? (
              <>{children}</>
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={clsx('fill-primary', iconClassName)}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.99384 1.5062C8.55932 1.56555 9.00004 2.04381 9.00004 2.625V5.875C9.00004 6.49632 8.49636 7 7.87504 7H6.75004V5.31066C6.75004 4.91284 6.59201 4.53131 6.3107 4.25L4.75004 2.68934C4.5553 2.4946 4.31252 2.35893 4.04956 2.29388C4.17972 1.87061 4.55289 1.55378 5.00624 1.5062C5.06559 0.940724 5.54385 0.5 6.12504 0.5H6.87504C7.45624 0.5 7.93449 0.940724 7.99384 1.5062ZM5.75004 1.625C5.75004 1.41789 5.91793 1.25 6.12504 1.25H6.87504C7.08215 1.25 7.25004 1.41789 7.25004 1.625V1.75H5.75004V1.625Z"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M1.75 3C1.33579 3 1 3.33579 1 3.75V8.25C1 8.66421 1.33579 9 1.75 9H5.25C5.66421 9 6 8.66421 6 8.25V5.31066C6 5.11175 5.92098 4.92098 5.78033 4.78033L4.21967 3.21967C4.07902 3.07902 3.88825 3 3.68934 3H1.75Z"
                    fillOpacity="0.8"
                  />
                </svg>
                {showText && <p className="text-xs font-normal">{t('common.copy')}</p>}
              </>
            )}
          </>
        )}
      </button>
    </CopyToClipboard>
  );
};
