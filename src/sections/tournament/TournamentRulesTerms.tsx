import { useState } from 'react';

type TournamentRulesTermsProps = {
  text: {
    title?: string;
    description?: string;
    content?: string;
  };
};

export const TournamentRulesTerms = ({ text }: TournamentRulesTermsProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-base-100 collapse rounded-2xl">
      <input type="checkbox" checked={isOpen} onChange={(e) => setIsOpen(e.target.checked)} />
      <div className="collapse-title flex items-center justify-between px-4 py-3">
        <div>
          <div className="leading-6 font-bold">{text?.title}</div>
          <div className="text-sm leading-5">{text?.description}</div>
        </div>
        <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.184136 0.767599C0.422999 0.537923 0.802824 0.54537 1.0325 0.784233L4 3.93443L6.9675 0.784233C7.19718 0.54537 7.577 0.537923 7.81587 0.767599C8.05473 0.997275 8.06218 1.3771 7.8325 1.61596L4.4325 5.21596C4.31938 5.33361 4.16321 5.4001 4 5.4001C3.83679 5.4001 3.68062 5.33361 3.5675 5.21596L0.167501 1.61596C-0.0621751 1.3771 -0.0547276 0.997275 0.184136 0.767599Z"
              fill="#A6ADBB"
              style={{ fill: '#A6ADBB' }}
            />
          </svg>
        </div>
      </div>
      <div className="collapse-content">
        <div dangerouslySetInnerHTML={{ __html: text?.content ?? '' }} />
      </div>
    </div>
  );
};