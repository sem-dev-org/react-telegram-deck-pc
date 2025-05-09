import { useState } from 'react';

export const FrequentlyAskedQuestions = () => {
  const [isOpenQuestion1, setIsOpenQuestion1] = useState(false);
  const [isOpenQuestion2, setIsOpenQuestion2] = useState(false);
  const [isOpenQuestion3, setIsOpenQuestion3] = useState(false);

  return (
    <div className="bg-base-100 rounded-xl p-2 flex flex-col gap-3">
      <div className="h-10 flex items-center justify-between px-5 bg-base-100">
        <div className="text-base font-bold">Frequently Asked Questions</div>
      </div>

      <div className="collapse bg-base-200 rounded-xl  ">
        <input type="checkbox" onChange={(e) => setIsOpenQuestion1(e.target.checked)} />
        <div className="collapse-title font-semibold flex justify-between p-4 items-center">
          <div className="text-sm mb-1 font-bold">How is the deposit and withdrawal of funds protected?</div>
          <div className={`transition-transform duration-200 ${isOpenQuestion1 ? 'rotate-180' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 6.61719L19.0711 13.6883L17.1724 15.5869L12 10.4145L6.82761 15.5869L4.92893 13.6883L12 6.61719Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB' }}
              />
            </svg>
          </div>
        </div>
        <div className="collapse-content text-sm">This is an Answer</div>
      </div>

      <div className="collapse bg-base-200 rounded-xl  ">
        <input type="checkbox" onChange={(e) => setIsOpenQuestion2(e.target.checked)} />
        <div className="collapse-title font-semibold flex justify-between p-4 items-center">
          <div className="text-sm mb-1 font-bold">When is the daily interest calculated, and how is it determined?</div>
          <div className={`transition-transform duration-200 ${isOpenQuestion2 ? 'rotate-180' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 6.61719L19.0711 13.6883L17.1724 15.5869L12 10.4145L6.82761 15.5869L4.92893 13.6883L12 6.61719Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB' }}
              />
            </svg>
          </div>
        </div>
        <div className="collapse-content text-sm">This is an Answer</div>
      </div>

      <div className="collapse bg-base-200 rounded-xl  ">
        <input type="checkbox" onChange={(e) => setIsOpenQuestion3(e.target.checked)} />
        <div className="collapse-title font-semibold flex justify-between p-4 items-center">
          <div className="text-sm mb-1 font-bold">Can i trust that my staked funds are safe?</div>
          <div className={`transition-transform duration-200 ${isOpenQuestion3 ? 'rotate-180' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 6.61719L19.0711 13.6883L17.1724 15.5869L12 10.4145L6.82761 15.5869L4.92893 13.6883L12 6.61719Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB' }}
              />
            </svg>
          </div>
        </div>
        <div className="collapse-content text-sm">This is an Answer</div>
      </div>
    </div>
  );
};
