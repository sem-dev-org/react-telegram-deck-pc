import { signOut } from '@/cookies/sign';
import { router } from '@/routes';
import { paths } from '@/routes/paths';
import { useTranslation } from 'react-i18next';
import useIsTma from '@/hooks/isTma';

export const ProfileTabContentSettings = ({ setTab }: { setTab: (tab: string) => void }) => {
  const { t } = useTranslation();

  const handleSignOut = () => {
    signOut();
    router.navigate(paths.login);
  };

  const isTmaApp = useIsTma();

  return (
    <div className="bg-base-200 rounded-t-lg rounded-b-lg">
      <ul className="menu w-full gap-3 text-base">
        <li>
          <a className="flex h-9 items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.62488 4.5C5.62488 2.63604 7.13592 1.125 8.99988 1.125C10.8638 1.125 12.3749 2.63604 12.3749 4.5C12.3749 6.36396 10.8638 7.875 8.99988 7.875C7.13592 7.875 5.62488 6.36396 5.62488 4.5Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB', fillOpacity: 1 }}
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.81332 15.079C2.87132 11.7117 5.61887 9 8.99988 9C12.381 9 15.1286 11.7118 15.1865 15.0792C15.1903 15.3026 15.0616 15.507 14.8586 15.6002C13.0744 16.4188 11.0898 16.875 9.00012 16.875C6.91028 16.875 4.92546 16.4188 3.14112 15.5999C2.93812 15.5068 2.80947 15.3023 2.81332 15.079Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB', fillOpacity: 1 }}
              />
            </svg>

            <p>{t('profile:accountInfo')}</p>
          </a>
        </li>

        <li onClick={() => setTab('security')}>
          <a className="flex h-9 items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 1.125C6.82538 1.125 5.0625 2.88788 5.0625 5.0625V7.3125C3.81986 7.3125 2.8125 8.31986 2.8125 9.5625V14.625C2.8125 15.8676 3.81986 16.875 5.0625 16.875H12.9375C14.1801 16.875 15.1875 15.8676 15.1875 14.625V9.5625C15.1875 8.31986 14.1801 7.3125 12.9375 7.3125V5.0625C12.9375 2.88788 11.1746 1.125 9 1.125ZM11.8125 7.3125V5.0625C11.8125 3.5092 10.5533 2.25 9 2.25C7.4467 2.25 6.1875 3.5092 6.1875 5.0625V7.3125H11.8125Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB', fillOpacity: 1 }}
              />
            </svg>

            <p>{t('profile:security')}</p>
          </a>
        </li>

        {/* <li>
          <a className="flex h-9 items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 6.2025V3.1725C16.5 1.98 16.02 1.5 14.8275 1.5H11.7975C10.605 1.5 10.125 1.98 10.125 3.1725V6.2025C10.125 7.395 10.605 7.875 11.7975 7.875H14.8275C16.02 7.875 16.5 7.395 16.5 6.2025Z" stroke="#A6ADBB" style={{ stroke: "#A6ADBB", strokeOpacity: 1 }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7.875 6.39V2.985C7.875 1.9275 7.395 1.5 6.2025 1.5H3.1725C1.98 1.5 1.5 1.9275 1.5 2.985V6.3825C1.5 7.4475 1.98 7.8675 3.1725 7.8675H6.2025C7.395 7.875 7.875 7.4475 7.875 6.39Z" stroke="#A6ADBB" style={{ stroke: "#A6ADBB", strokeOpacity: 1 }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7.875 14.8275V11.7975C7.875 10.605 7.395 10.125 6.2025 10.125H3.1725C1.98 10.125 1.5 10.605 1.5 11.7975V14.8275C1.5 16.02 1.98 16.5 3.1725 16.5H6.2025C7.395 16.5 7.875 16.02 7.875 14.8275Z" stroke="#A6ADBB" style={{ stroke: "#A6ADBB", strokeOpacity: 1 }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11.25 11.625H15.75" stroke="#A6ADBB" style={{ stroke: "#A6ADBB", strokeOpacity: 1 }} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M11.25 14.625H15.75" stroke="#A6ADBB" style={{ stroke: "#A6ADBB", strokeOpacity: 1 }} strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            <p>Preferences</p>
          </a>
        </li> */}

        <li onClick={() => setTab('identityVerification')}>
          <a className="flex h-9 items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.21875 1.125C3.4421 1.125 2.8125 1.7546 2.8125 2.53125V15.4688C2.8125 16.2454 3.4421 16.875 4.21875 16.875H13.7812C14.5579 16.875 15.1875 16.2454 15.1875 15.4688V9.5625C15.1875 8.0092 13.9283 6.75 12.375 6.75H10.9688C10.1921 6.75 9.5625 6.1204 9.5625 5.34375V3.9375C9.5625 2.3842 8.3033 1.125 6.75 1.125H4.21875ZM5.625 11.25C5.625 10.9393 5.87684 10.6875 6.1875 10.6875H11.8125C12.1232 10.6875 12.375 10.9393 12.375 11.25C12.375 11.5607 12.1232 11.8125 11.8125 11.8125H6.1875C5.87684 11.8125 5.625 11.5607 5.625 11.25ZM6.1875 12.9375C5.87684 12.9375 5.625 13.1893 5.625 13.5C5.625 13.8107 5.87684 14.0625 6.1875 14.0625H9C9.31066 14.0625 9.5625 13.8107 9.5625 13.5C9.5625 13.1893 9.31066 12.9375 9 12.9375H6.1875Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB', fillOpacity: 1 }}
              />
              <path
                d="M9.72839 1.36193C10.326 2.05236 10.6875 2.95271 10.6875 3.9375V5.34375C10.6875 5.49908 10.8134 5.625 10.9688 5.625H12.375C13.3598 5.625 14.2601 5.98653 14.9506 6.58411C14.2847 4.03491 12.2776 2.02783 9.72839 1.36193Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB', fillOpacity: 1 }}
              />
            </svg>

            <p>{t('profile:identityVerification')}</p>
          </a>
        </li>

        <li>
          <a className="flex h-9 items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.375 2.8125C2.13236 2.8125 1.125 3.81986 1.125 5.0625V5.625H16.875V5.0625C16.875 3.81986 15.8676 2.8125 14.625 2.8125H3.375Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB', fillOpacity: 1 }}
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.875 7.3125H1.125V12.9375C1.125 14.1801 2.13236 15.1875 3.375 15.1875H14.625C15.8676 15.1875 16.875 14.1801 16.875 12.9375V7.3125ZM3.375 10.125C3.375 9.81434 3.62684 9.5625 3.9375 9.5625H8.4375C8.74816 9.5625 9 9.81434 9 10.125C9 10.4357 8.74816 10.6875 8.4375 10.6875H3.9375C3.62684 10.6875 3.375 10.4357 3.375 10.125ZM3.9375 11.8125C3.62684 11.8125 3.375 12.0643 3.375 12.375C3.375 12.6857 3.62684 12.9375 3.9375 12.9375H6.1875C6.49816 12.9375 6.75 12.6857 6.75 12.375C6.75 12.0643 6.49816 11.8125 6.1875 11.8125H3.9375Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB', fillOpacity: 1 }}
              />
            </svg>

            <p>{t('profile:paymentMethods')}</p>
          </a>
        </li>
        {!isTmaApp && (
          <li onClick={handleSignOut}>
            <a className="flex h-9 items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.6 1.5H10.65C8.25 1.5 6.75 3 6.75 5.4V8.4375H11.4375C11.745 8.4375 12 8.6925 12 9C12 9.3075 11.745 9.5625 11.4375 9.5625H6.75V12.6C6.75 15 8.25 16.5 10.65 16.5H12.5925C14.9925 16.5 16.4925 15 16.4925 12.6V5.4C16.5 3 15 1.5 12.6 1.5Z"
                  fill="#A6ADBB"
                  style={{ fill: '#A6ADBB', fillOpacity: 1 }}
                />
                <path
                  d="M3.42008 8.43836L4.97258 6.88586C5.08508 6.77336 5.13758 6.63086 5.13758 6.48836C5.13758 6.34586 5.08508 6.19586 4.97258 6.09086C4.75508 5.87336 4.39508 5.87336 4.17758 6.09086L1.66508 8.60336C1.44758 8.82086 1.44758 9.18086 1.66508 9.39836L4.17758 11.9109C4.39508 12.1284 4.75508 12.1284 4.97258 11.9109C5.19008 11.6934 5.19008 11.3334 4.97258 11.1159L3.42008 9.56336H6.75008V8.43836H3.42008V8.43836Z"
                  fill="#A6ADBB"
                  style={{ fill: '#A6ADBB', fillOpacity: 1 }}
                />
              </svg>

              <p>{t('profile:signOut')}</p>
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};
