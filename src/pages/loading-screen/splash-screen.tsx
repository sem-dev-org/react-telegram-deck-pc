import { createPortal } from 'react-dom';
import React from 'react';

// ----------------------------------------------------------------------

type Props = React.HTMLAttributes<HTMLDivElement> & {
  portal?: boolean;
};

export function SplashScreen({ portal = true, className, ...other }: Props) {
  const content = (
    <div style={{ overflow: 'hidden' }}>
      <div
        className={className}
        style={{
          right: 0,
          width: '100%',
          bottom: 0,
          height: '100%',
          zIndex: 9998,
          display: 'flex',
          position: 'fixed',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.default',
        }}
        {...other}
      >
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="mb-2">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M38.6119 67.6596L38.5904 67.6484L38.5165 67.6095C38.4536 67.5764 38.3641 67.5287 38.2495 67.4669C38.0204 67.3433 37.6912 67.1628 37.2762 66.9279C36.4466 66.4583 35.2718 65.7701 33.8665 64.8823C31.0623 63.1108 27.3092 60.5256 23.5415 57.2786C16.1779 50.9327 8 41.4091 8 30C8 20.0589 16.0589 12 26 12C31.6576 12 36.7017 14.6095 40 18.6863C43.2983 14.6095 48.3424 12 54 12C63.9411 12 72 20.0589 72 30C72 41.4091 63.8221 50.9327 56.4585 57.2786C52.6908 60.5256 48.9377 63.1108 46.1335 64.8823C44.7282 65.7701 43.5534 66.4583 42.7238 66.9279C42.3088 67.1628 41.9796 67.3433 41.7505 67.4669C41.6359 67.5287 41.5464 67.5764 41.4835 67.6095L41.4096 67.6484L41.3881 67.6596L41.3813 67.6631C40.52 68.12 39.48 68.12 38.6212 67.6644L38.6119 67.6596Z" fill="#A6ADBB" />
            </svg>
          </div>
          <div className="text-2xl font-bold leading-8 text-primary">Betfrom.com</div>
          <div className="text-sm leading-5 mb-4">Loading...</div>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M22.909 4.7045C22.909 7.30273 20.8027 9.40901 18.2045 9.40901C15.6063 9.40901 13.5 7.30273 13.5 4.7045C13.5 2.10628 15.6063 0 18.2045 0C20.8027 0 22.909 2.10628 22.909 4.7045ZM21 33C21 34.6569 19.6569 36 18 36C16.3431 36 15 34.6569 15 33C15 31.3431 16.3431 30 18 30C19.6569 30 21 31.3431 21 33Z" fill="#E7FB78" fillOpacity="0.8" style={{ fill: "#E7FB78", fillOpacity: 0.8 }} />
          </svg>
        </div>
      </div>
    </div>
  );

  if (portal) {
    return createPortal(content, document.body);
  }

  return content;
}
