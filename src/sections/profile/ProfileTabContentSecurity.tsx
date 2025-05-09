import { QueryUserProfile } from '@/query/profile';
import { paths } from '@/routes/paths';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useIsTma from '@/hooks/isTma';

export function ProfileTabContentSecurity() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user: userProfile } = QueryUserProfile();

  const handleEnableWithdrawalPin = () => {
    userProfile?.pin_setted
      ? navigate(paths.main.profile.security.updateWithdrawalPin)
      : navigate(paths.main.profile.security.setWithdrawalPin);
  };

  const isTmaApp = useIsTma();

  return (
    <div className="bg-base-200 flex flex-col gap-3 rounded-t-xl rounded-b-xl p-3">
      {!isTmaApp && (
        <>
          <div className="flex items-center justify-between gap-2 px-3">
            <div className="flex flex-1 items-center gap-3">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18 2.25C13.6508 2.25 10.125 5.77576 10.125 10.125V14.625C7.63972 14.625 5.625 16.6397 5.625 19.125V29.25C5.625 31.7353 7.63972 33.75 10.125 33.75H25.875C28.3603 33.75 30.375 31.7353 30.375 29.25V19.125C30.375 16.6397 28.3603 14.625 25.875 14.625V10.125C25.875 5.77576 22.3492 2.25 18 2.25ZM23.625 14.625V10.125C23.625 7.0184 21.1066 4.5 18 4.5C14.8934 4.5 12.375 7.0184 12.375 10.125V14.625H23.625Z"
                  fill="#A6ADBB"
                  style={{ fill: '#A6ADBB', fillOpacity: 1 }}
                />
              </svg>

              <div className="flex flex-1 flex-col">
                <p className="text-base font-bold">{t('profile:changePassword')}</p>
                <p className="text-primary text-xs leading-relaxed">{t('profile:changePasswordDescription')}</p>
              </div>
            </div>
            {userProfile?.password_setted ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.1227 10.1214C13.8825 9.71861 14.4001 8.91955 14.4001 7.99961C14.4001 7.07967 13.8825 6.28061 13.1227 5.87778C13.3751 5.05563 13.1761 4.12461 12.5256 3.47411C11.8751 2.82361 10.9441 2.62458 10.1219 2.87704C9.71909 2.11719 8.92004 1.59961 8.0001 1.59961C7.08015 1.59961 6.2811 2.1172 5.87826 2.87706C5.05612 2.62461 4.12511 2.82364 3.47462 3.47414C2.82412 4.12463 2.62509 5.05564 2.87754 5.87778C2.11769 6.28062 1.6001 7.07967 1.6001 7.99961C1.6001 8.91955 2.11769 9.7186 2.87754 10.1214C2.62509 10.9436 2.82411 11.8746 3.47461 12.5251C4.12511 13.1756 5.05612 13.3746 5.87827 13.1222C6.28111 13.882 7.08016 14.3996 8.0001 14.3996C8.92005 14.3996 9.7191 13.882 10.1219 13.1222C10.9441 13.3746 11.8751 13.1756 12.5256 12.5251C13.1761 11.8746 13.3751 10.9436 13.1227 10.1214ZM11.0853 6.55251C11.2802 6.28452 11.221 5.90927 10.953 5.71437C10.685 5.51947 10.3098 5.57872 10.1149 5.84671L7.32785 9.67884L5.82436 8.17535C5.59005 7.94103 5.21015 7.94103 4.97583 8.17535C4.74152 8.40966 4.74152 8.78956 4.97583 9.02388L6.97583 11.0239C7.09991 11.148 7.27209 11.2115 7.44703 11.1978C7.62197 11.184 7.78213 11.0944 7.88534 10.9525L11.0853 6.55251Z"
                  fill="#A6ADBB"
                />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.4001 7.99961C14.4001 11.5342 11.5347 14.3996 8.0001 14.3996C4.46548 14.3996 1.6001 11.5342 1.6001 7.99961C1.6001 4.46499 4.46548 1.59961 8.0001 1.59961C11.5347 1.59961 14.4001 4.46499 14.4001 7.99961ZM8.0001 3.99961C8.33147 3.99961 8.6001 4.26824 8.6001 4.59961V8.19961C8.6001 8.53098 8.33147 8.79961 8.0001 8.79961C7.66873 8.79961 7.4001 8.53098 7.4001 8.19961V4.59961C7.4001 4.26824 7.66873 3.99961 8.0001 3.99961ZM8.0001 11.9996C8.44193 11.9996 8.8001 11.6414 8.8001 11.1996C8.8001 10.7578 8.44193 10.3996 8.0001 10.3996C7.55827 10.3996 7.2001 10.7578 7.2001 11.1996C7.2001 11.6414 7.55827 11.9996 8.0001 11.9996Z"
                  fill="#A6ADBB"
                />
              </svg>
            )}
          </div>

          <div className="px-3" onClick={() => navigate(paths.main.profile.verification.changePassword)}>
            <button className={`btn ${userProfile?.pin_setted ? 'btn-neutral' : 'btn-secondary'} w-full text-sm`}>
              {t('profile:changePassword')}
            </button>
          </div>

          <div className="divider my-0 px-3 opacity-50" />
        </>
      )}

      <div className="flex items-center justify-between gap-2 px-3">
        <div className="flex flex-1 items-center gap-3">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.7736 3.25446C18.3397 2.84356 17.6603 2.84356 17.2264 3.25446C14.2013 6.11941 10.1194 7.87491 5.625 7.87491C5.5535 7.87491 5.4821 7.87447 5.41081 7.87358C4.91976 7.86749 4.4815 8.18061 4.32812 8.64712C3.70931 10.5293 3.375 12.5392 3.375 14.625C3.375 23.538 9.47109 31.0244 17.7196 33.1474C17.9035 33.1947 18.0965 33.1947 18.2804 33.1474C26.5289 31.0244 32.625 23.538 32.625 14.625C32.625 12.5392 32.2907 10.5293 31.6719 8.64712C31.5185 8.18061 31.0802 7.86749 30.5892 7.87358C30.5179 7.87447 30.4465 7.87491 30.375 7.87491C25.8806 7.87491 21.7987 6.11941 18.7736 3.25446ZM23.4155 15.2786C23.7766 14.7731 23.6595 14.0704 23.1539 13.7093C22.6483 13.3482 21.9457 13.4653 21.5846 13.9709L16.7314 20.7652L14.2955 18.3293C13.8562 17.8899 13.1438 17.8899 12.7045 18.3293C12.2652 18.7686 12.2652 19.4809 12.7045 19.9203L16.0795 23.2953C16.3133 23.5291 16.6382 23.6482 16.9678 23.6209C17.2974 23.5936 17.5982 23.4227 17.7905 23.1536L23.4155 15.2786Z"
              fill="#A6ADBB"
            />
          </svg>

          <div className="flex flex-1 flex-col">
            <p className="text-base font-bold">{t('profile:setWithdrawalPIN')}</p>
            <p className="text-primary text-xs leading-relaxed">{t('profile:setWithdrawalPINDescription')}</p>
          </div>
        </div>
        {userProfile?.pin_setted ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.1227 10.1214C13.8825 9.71861 14.4001 8.91955 14.4001 7.99961C14.4001 7.07967 13.8825 6.28061 13.1227 5.87778C13.3751 5.05563 13.1761 4.12461 12.5256 3.47411C11.8751 2.82361 10.9441 2.62458 10.1219 2.87704C9.71909 2.11719 8.92004 1.59961 8.0001 1.59961C7.08015 1.59961 6.2811 2.1172 5.87826 2.87706C5.05612 2.62461 4.12511 2.82364 3.47462 3.47414C2.82412 4.12463 2.62509 5.05564 2.87754 5.87778C2.11769 6.28062 1.6001 7.07967 1.6001 7.99961C1.6001 8.91955 2.11769 9.7186 2.87754 10.1214C2.62509 10.9436 2.82411 11.8746 3.47461 12.5251C4.12511 13.1756 5.05612 13.3746 5.87827 13.1222C6.28111 13.882 7.08016 14.3996 8.0001 14.3996C8.92005 14.3996 9.7191 13.882 10.1219 13.1222C10.9441 13.3746 11.8751 13.1756 12.5256 12.5251C13.1761 11.8746 13.3751 10.9436 13.1227 10.1214ZM11.0853 6.55251C11.2802 6.28452 11.221 5.90927 10.953 5.71437C10.685 5.51947 10.3098 5.57872 10.1149 5.84671L7.32785 9.67884L5.82436 8.17535C5.59005 7.94103 5.21015 7.94103 4.97583 8.17535C4.74152 8.40966 4.74152 8.78956 4.97583 9.02388L6.97583 11.0239C7.09991 11.148 7.27209 11.2115 7.44703 11.1978C7.62197 11.184 7.78213 11.0944 7.88534 10.9525L11.0853 6.55251Z"
              fill="#A6ADBB"
            />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.4001 7.99961C14.4001 11.5342 11.5347 14.3996 8.0001 14.3996C4.46548 14.3996 1.6001 11.5342 1.6001 7.99961C1.6001 4.46499 4.46548 1.59961 8.0001 1.59961C11.5347 1.59961 14.4001 4.46499 14.4001 7.99961ZM8.0001 3.99961C8.33147 3.99961 8.6001 4.26824 8.6001 4.59961V8.19961C8.6001 8.53098 8.33147 8.79961 8.0001 8.79961C7.66873 8.79961 7.4001 8.53098 7.4001 8.19961V4.59961C7.4001 4.26824 7.66873 3.99961 8.0001 3.99961ZM8.0001 11.9996C8.44193 11.9996 8.8001 11.6414 8.8001 11.1996C8.8001 10.7578 8.44193 10.3996 8.0001 10.3996C7.55827 10.3996 7.2001 10.7578 7.2001 11.1996C7.2001 11.6414 7.55827 11.9996 8.0001 11.9996Z"
              fill="#A6ADBB"
            />
          </svg>
        )}
      </div>

      <div className="px-3">
        <button
          className={`btn w-full text-sm ${userProfile?.pin_setted ? 'btn-neutral' : 'btn-secondary'}`}
          onClick={handleEnableWithdrawalPin}
        >
          {userProfile?.pin_setted ? t('profile:updateWithdrawalPin') : t('profile:enableWithdrawalPin')}
        </button>
      </div>

      <div className="divider my-0 px-3 opacity-50" />

      <div className="flex items-center justify-between gap-2 px-3">
        <div className="flex flex-1 items-center gap-3">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.40005 7.2002C3.41182 7.2002 1.80005 8.81197 1.80005 10.8002V12.8908L16.9938 20.4877C17.6273 20.8045 18.3728 20.8045 19.0063 20.4877L34.2001 12.8908V10.8002C34.2001 8.81197 32.5883 7.2002 30.6 7.2002H5.40005Z"
              fill="#A6ADBB"
            />
            <path
              d="M34.2001 15.9095L20.2138 22.9027C18.8202 23.5995 17.1799 23.5995 15.7863 22.9027L1.80005 15.9095V25.2002C1.80005 27.1884 3.41182 28.8002 5.40005 28.8002H30.6C32.5883 28.8002 34.2001 27.1884 34.2001 25.2002V15.9095Z"
              fill="#A6ADBB"
            />
          </svg>

          <div className="flex flex-1 flex-col">
            <p className="text-base font-bold">{t('profile:emailVerification')}</p>
            <p className="text-primary text-xs leading-relaxed">{t('profile:emailVerificationDescription')}</p>
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.4001 7.99961C14.4001 11.5342 11.5347 14.3996 8.0001 14.3996C4.46548 14.3996 1.6001 11.5342 1.6001 7.99961C1.6001 4.46499 4.46548 1.59961 8.0001 1.59961C11.5347 1.59961 14.4001 4.46499 14.4001 7.99961ZM8.0001 3.99961C8.33147 3.99961 8.6001 4.26824 8.6001 4.59961V8.19961C8.6001 8.53098 8.33147 8.79961 8.0001 8.79961C7.66873 8.79961 7.4001 8.53098 7.4001 8.19961V4.59961C7.4001 4.26824 7.66873 3.99961 8.0001 3.99961ZM8.0001 11.9996C8.44193 11.9996 8.8001 11.6414 8.8001 11.1996C8.8001 10.7578 8.44193 10.3996 8.0001 10.3996C7.55827 10.3996 7.2001 10.7578 7.2001 11.1996C7.2001 11.6414 7.55827 11.9996 8.0001 11.9996Z"
            fill="#A6ADBB"
          />
        </svg>
      </div>

      <div className="px-3">
        <button
          onClick={() => navigate(paths.main.profile.verification.emailVerification)}
          className="btn btn-secondary w-full text-sm"
        >
          {t('profile:verifyEmail')}
        </button>
      </div>

      <div className="divider my-0 px-3 opacity-50" />

      <div className="flex items-center justify-between gap-2 px-3">
        <div className="flex flex-1 items-center gap-3">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.375 3.375C11.1324 3.375 10.125 4.38236 10.125 5.625V30.375C10.125 31.6176 11.1324 32.625 12.375 32.625H23.625C24.8676 32.625 25.875 31.6176 25.875 30.375V5.625C25.875 4.38236 24.8676 3.375 23.625 3.375H21.375V4.5C21.375 5.12132 20.8713 5.625 20.25 5.625H15.75C15.1287 5.625 14.625 5.12132 14.625 4.5V3.375H12.375ZM7.875 5.625C7.875 3.13972 9.88972 1.125 12.375 1.125H23.625C26.1103 1.125 28.125 3.13972 28.125 5.625V30.375C28.125 32.8603 26.1103 34.875 23.625 34.875H12.375C9.88972 34.875 7.875 32.8603 7.875 30.375V5.625ZM14.625 30.375C14.625 29.7537 15.1287 29.25 15.75 29.25H20.25C20.8713 29.25 21.375 29.7537 21.375 30.375C21.375 30.9963 20.8713 31.5 20.25 31.5H15.75C15.1287 31.5 14.625 30.9963 14.625 30.375Z"
              fill="#A6ADBB"
            />
          </svg>

          <div className="flex flex-1 flex-col">
            <p className="text-base font-bold">{t('profile:phoneNumberVerification')}</p>
            <p className="text-primary text-xs leading-relaxed">{t('profile:phoneNumberVerificationDescription')}</p>
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.4001 7.99961C14.4001 11.5342 11.5347 14.3996 8.0001 14.3996C4.46548 14.3996 1.6001 11.5342 1.6001 7.99961C1.6001 4.46499 4.46548 1.59961 8.0001 1.59961C11.5347 1.59961 14.4001 4.46499 14.4001 7.99961ZM8.0001 3.99961C8.33147 3.99961 8.6001 4.26824 8.6001 4.59961V8.19961C8.6001 8.53098 8.33147 8.79961 8.0001 8.79961C7.66873 8.79961 7.4001 8.53098 7.4001 8.19961V4.59961C7.4001 4.26824 7.66873 3.99961 8.0001 3.99961ZM8.0001 11.9996C8.44193 11.9996 8.8001 11.6414 8.8001 11.1996C8.8001 10.7578 8.44193 10.3996 8.0001 10.3996C7.55827 10.3996 7.2001 10.7578 7.2001 11.1996C7.2001 11.6414 7.55827 11.9996 8.0001 11.9996Z"
            fill="#A6ADBB"
          />
        </svg>
      </div>

      <div className="px-3">
        <button
          onClick={() => navigate(paths.main.profile.verification.phoneVerification)}
          className="btn btn-secondary w-full text-sm"
        >
          {t('profile:verifyPhone')}
        </button>
      </div>
    </div>
  );
}
