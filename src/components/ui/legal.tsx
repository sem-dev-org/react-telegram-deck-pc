import { useState } from 'react';

type LegalProps = {
  text: {
    title?: string;
    description?: string;
    content?: string;
    open?: boolean;
  };
};

export const Legal = ({ text }: LegalProps) => {
  const [isOpen, setIsOpen] = useState(text?.open ?? true);

  return (
    <div className="bg-base-200 collapse rounded-2xl">
      <input type="checkbox" checked={isOpen} onChange={(e) => setIsOpen(e.target.checked)} />
      <div className="collapse-title flex items-center justify-between px-4 py-3">
        <div>
          <div className="leading-6 font-bold text-sm">{text?.title}</div>
        </div>
        <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 14.9297L2.92893 7.85862L4.82761 5.95995L10 11.1323L15.1724 5.95995L17.0711 7.85862L10 14.9297Z"
              fill="#A6ADBB"
              style={{ fill: '#A6ADBB', fillOpacity: 1 }}
            />
          </svg>
        </div>
      </div>
      <div className="collapse-content">
        <div className="text-base-content text-base" dangerouslySetInnerHTML={{ __html: text?.content ?? '' }} />
      </div>
    </div>
  );
};
