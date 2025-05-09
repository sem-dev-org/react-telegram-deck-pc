import { languages } from '@/_mock/languages';
import { Image } from '@/components/ui/Image';
import { useAuth } from '@/contexts/auth';
import { useLanguage } from '@/contexts/language';
import { paths } from '@/routes/paths';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function ProfileTabContentGeneral({
  onCurrencySelect,
  onLanguageSelect,
}: {
  onCurrencySelect: () => void;
  onLanguageSelect: () => void;
}) {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const language = languages.find((lang) => lang.value === currentLanguage)?.label;

  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-base-200 rounded-r-lg rounded-b-lg">
      <ul className="menu w-full gap-3 text-base">
        <li onClick={() => navigate(paths.main.chat.root + '?tab=support')}>
          <a className="flex h-9 items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.15444 2.12844C4.77244 1.91168 6.42335 1.7998 8.10002 1.7998C9.7767 1.7998 11.4276 1.91168 13.0456 2.12844C14.1677 2.27877 15.0067 3.12578 15.2368 4.16978C15.0683 4.13821 14.8951 4.11718 14.7178 4.10749C14.0165 4.06919 13.3104 4.0498 12.6 4.0498C11.8896 4.0498 11.1835 4.06919 10.4822 4.10749C8.30624 4.22634 6.75002 6.05446 6.75002 8.09795V10.1137C6.75002 11.3858 7.3531 12.5751 8.3344 13.32L5.65232 16.0021C5.45927 16.1952 5.16894 16.2529 4.91671 16.1484C4.66448 16.0439 4.50002 15.7978 4.50002 15.5248V12.4264C4.0491 12.3827 3.60053 12.3309 3.15446 12.2712C1.83009 12.0937 0.900024 10.9458 0.900024 9.64884V4.75078C0.900024 3.45387 1.83006 2.30587 3.15444 2.12844Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB', fillOpacity: 1 }}
              />
              <path
                d="M12.6 5.3998C11.9142 5.3998 11.2326 5.41852 10.5559 5.45549C9.14152 5.53273 8.10002 6.72471 8.10002 8.09795V10.1137C8.10002 11.4806 9.13205 12.6691 10.5392 12.7551C10.7315 12.7669 10.9241 12.7772 11.1172 12.786C11.2974 12.7942 11.463 12.8674 11.5832 12.9876L13.6977 15.1021C13.8908 15.2952 14.1811 15.3529 14.4333 15.2484C14.6856 15.1439 14.85 14.8978 14.85 14.6248V12.7613C16.1573 12.5861 17.1 11.4447 17.1 10.1381V8.09795C17.1 6.72471 16.0585 5.53273 14.6442 5.45549C13.9674 5.41852 13.2859 5.3998 12.6 5.3998Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB', fillOpacity: 1 }}
              />
            </svg>

            <p className="text-base">{t('common.liveSupport')}</p>
          </a>
        </li>

        <li onClick={() => navigate(paths.legal.faq)}>
          <a className="flex h-9 items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.2 8.9998C16.2 12.9763 12.9765 16.1998 9.00005 16.1998C5.0236 16.1998 1.80005 12.9763 1.80005 8.9998C1.80005 5.02335 5.0236 1.7998 9.00005 1.7998C12.9765 1.7998 16.2 5.02335 16.2 8.9998ZM8.04545 6.24519C7.78185 6.50879 7.35446 6.50879 7.09086 6.24519C6.82726 5.98158 6.82726 5.5542 7.09086 5.29059C8.14528 4.23618 9.85482 4.23618 10.9092 5.29059C11.9637 6.34501 11.9637 8.05455 10.9092 9.10897C10.556 9.4622 10.1276 9.69787 9.67505 9.81437V10.1248C9.67505 10.4976 9.37284 10.7998 9.00005 10.7998C8.62726 10.7998 8.32505 10.4976 8.32505 10.1248V9.67478C8.32505 9.02651 8.838 8.62024 9.29826 8.5167C9.53845 8.46267 9.76649 8.34253 9.95464 8.15438C10.4819 7.62717 10.4819 6.77239 9.95464 6.24519C9.42744 5.71798 8.57266 5.71798 8.04545 6.24519ZM9.00005 13.4998C9.4971 13.4998 9.90005 13.0969 9.90005 12.5998C9.90005 12.1027 9.4971 11.6998 9.00005 11.6998C8.50299 11.6998 8.10005 12.1027 8.10005 12.5998C8.10005 13.0969 8.50299 13.4998 9.00005 13.4998Z"
                fill="#A6ADBB"
                style={{ fill: '#A6ADBB', fillOpacity: 1 }}
              />
            </svg>

            <p className="text-base">{t('common.faq')}</p>
          </a>
        </li>

        <li>
          <div className="flex h-9 items-center justify-between" onClick={onLanguageSelect}>
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.2 8.9998C16.2 12.9763 12.9765 16.1998 9.00005 16.1998C5.0236 16.1998 1.80005 12.9763 1.80005 8.9998C1.80005 5.02335 5.0236 1.7998 9.00005 1.7998C12.9765 1.7998 16.2 5.02335 16.2 8.9998ZM14.85 8.9998C14.85 12.2307 12.2309 14.8498 9.00005 14.8498C5.76918 14.8498 3.15005 12.2307 3.15005 8.9998C3.15005 7.34078 3.84065 5.84306 4.95005 4.77842V5.18143C4.95005 6.01686 5.28192 6.81808 5.87266 7.40881L7.46365 8.9998L7.20005 9.26341C6.84858 9.61488 6.84858 10.1847 7.20005 10.5362L8.15464 11.4908C8.40782 11.744 8.55005 12.0873 8.55005 12.4454V12.7717C8.55005 13.1126 8.74265 13.4242 9.04756 13.5767L9.29631 13.7011C9.74089 13.9233 10.2815 13.7431 10.5038 13.2986L11.8124 10.6813C12.0723 10.1615 11.9704 9.5338 11.5596 9.12292L10.8649 8.42826C10.6239 8.18721 10.2673 8.10305 9.9439 8.21085L9.59826 8.32606C9.38581 8.39688 9.15361 8.3007 9.05346 8.1004L8.78715 7.56777C8.70381 7.40109 8.73647 7.19978 8.86825 7.068C9.00002 6.93623 9.20133 6.90356 9.36801 6.9869L9.60379 7.10479C9.72876 7.16727 9.86656 7.1998 10.0063 7.1998H10.1757C10.79 7.1998 11.2238 6.59798 11.0295 6.0152L10.9683 5.83161C10.9105 5.65803 10.9635 5.46671 11.1024 5.34764L12.3979 4.23719C13.8824 5.2982 14.85 7.036 14.85 8.9998Z"
                  fill="#A6ADBB"
                  style={{ fill: '#A6ADBB', fillOpacity: 1 }}
                />
              </svg>

              <p className="text-base">{language}</p>
            </div>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.48849 13.2928C6.2301 13.0241 6.23848 12.5968 6.5072 12.3384L10.0512 9L6.5072 5.66156C6.23848 5.40318 6.2301 4.97587 6.48849 4.70715C6.74687 4.43843 7.17418 4.43005 7.4429 4.68844L11.4929 8.51344C11.6253 8.6407 11.7 8.81639 11.7 9C11.7 9.18361 11.6253 9.3593 11.4929 9.48656L7.4429 13.3116C7.17418 13.5699 6.74687 13.5616 6.48849 13.2928Z"
                fill="#A6ADBB"
                style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
              />
            </svg>
          </div>
        </li>

        {user?.currency_fiat && (
          <li>
            <div className="flex h-9 items-center justify-between" onClick={onCurrencySelect}>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 overflow-hidden rounded-full">
                  <Image
                    src={`/icons/currency/${user?.currency_fiat?.toLowerCase()}.svg`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="text-base">{user?.currency_fiat}</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.48849 13.2928C6.2301 13.0241 6.23848 12.5968 6.5072 12.3384L10.0512 9L6.5072 5.66156C6.23848 5.40318 6.2301 4.97587 6.48849 4.70715C6.74687 4.43843 7.17418 4.43005 7.4429 4.68844L11.4929 8.51344C11.6253 8.6407 11.7 8.81639 11.7 9C11.7 9.18361 11.6253 9.3593 11.4929 9.48656L7.4429 13.3116C7.17418 13.5699 6.74687 13.5616 6.48849 13.2928Z"
                  fill="#A6ADBB"
                  style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
                />
              </svg>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}
