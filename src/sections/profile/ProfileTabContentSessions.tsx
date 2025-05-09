import { useTranslation } from 'react-i18next';

export const ProfileTabContentSessions = () => {
  const { t } = useTranslation();
  
  return (
    <div className="p-3 flex flex-col gap-3 px-5">
      <div className="text-base leading-8">{t('profile:activeSessions')}</div>

      <div className="">
        <div className="leading-6">{t('profile:device')}</div>
        <div className="flex items-center justify-between">
          <div className="py-3 flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 3.25C1 2.55964 1.55964 2 2.25 2H13.75C14.4404 2 15 2.55964 15 3.25V10.75C15 11.4404 14.4404 12 13.75 12H9.5V13H12C12.2761 13 12.5 13.2239 12.5 13.5C12.5 13.7761 12.2761 14 12 14H4C3.72386 14 3.5 13.7761 3.5 13.5C3.5 13.2239 3.72386 13 4 13H6.5V12H2.25C1.55964 12 1 11.4404 1 10.75V3.25ZM7.5 12V13H8.5V12H7.5ZM2.25 11C2.11193 11 2 10.8881 2 10.75V3.25C2 3.11193 2.11193 3 2.25 3H13.75C13.8881 3 14 3.11193 14 3.25V10.75C14 10.8881 13.8881 11 13.75 11H2.25Z"
                fill="#A6ADBB"
                style={{ fill: "#A6ADBB", fillOpacity: 1 }}
              />
            </svg>
            <div className=" ">
              <div className="text-sm font-semibold">Android 1.x (Chrome Mobile)</div>
              <div className="text-sm text-base-content/50">PH | 215.73.97.31</div>
              <div className="text-sm text-base-content/50">23/02/2025 23:59:43</div>
            </div>
          </div>
          <button className="btn btn-sm btn-error">
            {t('profile:remove')}
          </button>
        </div>
      </div>

      <div className=" ">
        <div className="leading-6">{t('profile:device')}</div>

        <div className="flex items-center justify-between">
          <div className="py-3 flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 3.25C1 2.55964 1.55964 2 2.25 2H13.75C14.4404 2 15 2.55964 15 3.25V10.75C15 11.4404 14.4404 12 13.75 12H9.5V13H12C12.2761 13 12.5 13.2239 12.5 13.5C12.5 13.7761 12.2761 14 12 14H4C3.72386 14 3.5 13.7761 3.5 13.5C3.5 13.2239 3.72386 13 4 13H6.5V12H2.25C1.55964 12 1 11.4404 1 10.75V3.25ZM7.5 12V13H8.5V12H7.5ZM2.25 11C2.11193 11 2 10.8881 2 10.75V3.25C2 3.11193 2.11193 3 2.25 3H13.75C13.8881 3 14 3.11193 14 3.25V10.75C14 10.8881 13.8881 11 13.75 11H2.25Z"
                fill="#A6ADBB"
                style={{ fill: "#A6ADBB", fillOpacity: 1 }}
              />
            </svg>
            <div className=" ">
              <div className="text-sm font-semibold">Android 1.x (Chrome Mobile)</div>
              <div className="text-sm text-base-content/50">PH | 215.73.97.31</div>
              <div className="text-sm text-base-content/50">23/02/2025 23:59:43</div>
            </div>
          </div>
          <button className="btn btn-sm btn-error">
            {t('profile:remove')}
          </button>
        </div>
      </div>
    </div>
  );
};
