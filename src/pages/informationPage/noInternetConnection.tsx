import { FullBleedContainer } from '@/components/ui/SafeArea';
import { Page } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { paths } from '@/routes/paths';

export default function NoInternetConnection() {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate(paths.main.casino.root);
  };

  const { t } = useTranslation();

  return (
    <FullBleedContainer>
      <Page>
        <div className="flex h-screen flex-col items-center justify-center px-8">
          <div className="text-primary text-center text-2xl leading-8 font-bold">
            {t('information:noInternetConnection.title')}
          </div>
          <div className="mb-4 text-center text-sm leading-5">{t('information:noInternetConnection.description')}</div>
          <img
            src="/images/information/no-internet-connection.png"
            alt="noInternetConnection"
            className="mb-4 h-40 w-40"
          />
          <button className="btn btn-primary h-8 min-w-31.5" onClick={handleRetry}>
            {t('information:retryConnection')}
          </button>
        </div>
      </Page>
    </FullBleedContainer>
  );
}
