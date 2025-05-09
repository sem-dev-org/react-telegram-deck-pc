import { paths } from '@/routes/paths';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function ProfileTabContentIdentityVerification() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-base-200 flex flex-col gap-3 rounded-t-lg rounded-b-lg p-3">
      <p className="px-3 text-base">{t('profile:identityVerification')}</p>

      <div className="flex items-center justify-between gap-2 px-3">
        <div className="flex items-center gap-3 flex-1">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.2503 9C11.2503 5.27208 14.2723 2.25 18.0003 2.25C21.7282 2.25 24.7503 5.27208 24.7503 9C24.7503 12.7279 21.7282 15.75 18.0003 15.75C14.2723 15.75 11.2503 12.7279 11.2503 9Z"
              fill="#A6ADBB"
              style={{ fill: '#A6ADBB', fillOpacity: 1 }}
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.62712 30.158C5.74313 23.4234 11.2382 18 18.0003 18C24.7624 18 30.2576 23.4236 30.3734 30.1585C30.3811 30.6051 30.1237 31.014 29.7177 31.2003C26.1493 32.8377 22.18 33.75 18.0007 33.75C13.821 33.75 9.8514 32.8375 6.28273 31.1998C5.87673 31.0135 5.61943 30.6046 5.62712 30.158Z"
              fill="#A6ADBB"
              style={{ fill: '#A6ADBB', fillOpacity: 1 }}
            />
          </svg>

          <div className="flex flex-1 flex-col">
            <p className="font-bold text-base">{t('profile:basicVerification')}</p>
            <p className="text-primary text-xs leading-relaxed">
              {t('profile:basicVerificationDescription')}
            </p>
          </div>
        </div>

        <svg className='w-4 h-4' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.1227 10.1214C13.8825 9.71861 14.4001 8.91955 14.4001 7.99961C14.4001 7.07967 13.8825 6.28061 13.1227 5.87778C13.3751 5.05563 13.1761 4.12461 12.5256 3.47411C11.8751 2.82361 10.9441 2.62458 10.1219 2.87704C9.71909 2.11719 8.92004 1.59961 8.0001 1.59961C7.08015 1.59961 6.2811 2.1172 5.87826 2.87706C5.05612 2.62461 4.12511 2.82364 3.47462 3.47414C2.82412 4.12463 2.62509 5.05564 2.87754 5.87778C2.11769 6.28062 1.6001 7.07967 1.6001 7.99961C1.6001 8.91955 2.11769 9.7186 2.87754 10.1214C2.62509 10.9436 2.82411 11.8746 3.47461 12.5251C4.12511 13.1756 5.05612 13.3746 5.87827 13.1222C6.28111 13.882 7.08016 14.3996 8.0001 14.3996C8.92005 14.3996 9.7191 13.882 10.1219 13.1222C10.9441 13.3746 11.8751 13.1756 12.5256 12.5251C13.1761 11.8746 13.3751 10.9436 13.1227 10.1214ZM11.0853 6.55251C11.2802 6.28452 11.221 5.90927 10.953 5.71437C10.685 5.51947 10.3098 5.57872 10.1149 5.84671L7.32785 9.67884L5.82436 8.17535C5.59005 7.94103 5.21015 7.94103 4.97583 8.17535C4.74152 8.40966 4.74152 8.78956 4.97583 9.02388L6.97583 11.0239C7.09991 11.148 7.27209 11.2115 7.44703 11.1978C7.62197 11.184 7.78213 11.0944 7.88534 10.9525L11.0853 6.55251Z"
            fill="#A6ADBB"
          />
        </svg>
      </div>

      <div className="px-3">
        <button
          className="btn btn-secondary w-full text-sm"
          onClick={() => navigate(paths.main.profile.verification.basicVerification)}
        >
          {t('profile:verifyNow')}
        </button>
      </div>

      <div className="divider my-0 px-3" />

      <div className="flex items-center justify-between gap-2 px-3">
        <div className="flex items-center gap-3 flex-1">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.3096 33.5266C17.3549 33.5528 17.3905 33.5731 17.4158 33.5873L17.4576 33.6106C17.7919 33.7942 18.2066 33.7928 18.5413 33.6112L18.5842 33.5873C18.6095 33.5731 18.6451 33.5528 18.6904 33.5266C18.781 33.4741 18.9105 33.3975 19.0733 33.2973C19.3987 33.0969 19.8581 32.8014 20.4069 32.4137C21.5026 31.6396 22.9646 30.4912 24.4298 28.991C27.346 26.0052 30.375 21.5192 30.375 15.75C30.375 8.91548 24.8345 3.375 18 3.375C11.1655 3.375 5.625 8.91548 5.625 15.75C5.625 21.5192 8.65399 26.0052 11.5702 28.991C13.0354 30.4912 14.4974 31.6396 15.5931 32.4137C16.1419 32.8014 16.6013 33.0969 16.9267 33.2973C17.0895 33.3975 17.219 33.4741 17.3096 33.5266ZM18 20.25C20.4853 20.25 22.5 18.2353 22.5 15.75C22.5 13.2647 20.4853 11.25 18 11.25C15.5147 11.25 13.5 13.2647 13.5 15.75C13.5 18.2353 15.5147 20.25 18 20.25Z"
              fill="#A6ADBB"
              style={{ fill: '#A6ADBB', fillOpacity: 1 }}
            />
          </svg>

          <div className="flex flex-1 flex-col">
            <p className="font-bold text-base">{t('profile:addressVerification')}</p>
            <p className="text-primary text-xs leading-relaxed">
              {t('profile:addressVerificationDescription')}
            </p>
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
          className="btn btn-secondary w-full text-sm"
          onClick={() => navigate(paths.main.profile.verification.addressVerification)}
        >
          {t('profile:verifyNow')}
        </button>
      </div>

      <div className="divider my-0 px-3" />

      <div className="flex items-center justify-between gap-2 px-3">
        <div className="flex items-center gap-3 flex-1">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.7736 3.25446C18.3397 2.84356 17.6603 2.84356 17.2264 3.25446C14.2013 6.11941 10.1194 7.87491 5.625 7.87491C5.5535 7.87491 5.4821 7.87447 5.41081 7.87358C4.91976 7.86749 4.4815 8.18061 4.32812 8.64712C3.70931 10.5293 3.375 12.5392 3.375 14.625C3.375 23.538 9.47109 31.0244 17.7196 33.1474C17.9035 33.1947 18.0965 33.1947 18.2804 33.1474C26.5289 31.0244 32.625 23.538 32.625 14.625C32.625 12.5392 32.2907 10.5293 31.6719 8.64712C31.5185 8.18061 31.0802 7.86749 30.5892 7.87358C30.5179 7.87447 30.4465 7.87491 30.375 7.87491C25.8806 7.87491 21.7987 6.11941 18.7736 3.25446ZM23.4155 15.2786C23.7766 14.7731 23.6595 14.0704 23.1539 13.7093C22.6483 13.3482 21.9457 13.4653 21.5846 13.9709L16.7314 20.7652L14.2955 18.3293C13.8562 17.8899 13.1438 17.8899 12.7045 18.3293C12.2652 18.7686 12.2652 19.4809 12.7045 19.9203L16.0795 23.2953C16.3133 23.5291 16.6382 23.6482 16.9678 23.6209C17.2974 23.5936 17.5982 23.4227 17.7905 23.1536L23.4155 15.2786Z"
              fill="#A6ADBB"
              style={{ fill: '#A6ADBB', fillOpacity: 1 }}
            />
          </svg>
          <div className="flex flex-1 flex-col">
            <p className="font-bold text-base">{t('profile:idVerification')}</p>
            <p className="text-primary text-xs leading-relaxed">
              {t('profile:idVerificationDescription')}
            </p>
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
          className="btn btn-secondary w-full text-sm"
          onClick={() => navigate(paths.main.profile.verification.idVerification)}
        >
          {t('profile:verifyNow')}
        </button>
      </div>

      <div
        className="flex items-center gap-3 rounded-lg p-4"
        style={{
          background:
            'radial-gradient(100% 157.05% at 0% 46.47%, rgba(255, 187, 0, 0.4) 0%, rgba(51, 51, 51, 0.08) 100%), #1B232B',
        }}
      >
        <img src="/icons/isometric/23.svg" className="h-12 w-12" />

        <p className="text-sm">
          {t('profile:verificationNotice')}
        </p>
      </div>
    </div>
  );
}
