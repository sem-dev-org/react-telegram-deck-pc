import { FullBleedContainer } from '@/components/ui/SafeArea';
import { Page } from '@/components/ui';
import { paths } from '@/routes/paths';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useIsTma from '@/hooks/isTma';
import { miniApp } from '@telegram-apps/sdk-react';

export default function OtherActiveSession() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isTmaApp = useIsTma();

  const closeFunction = () => {
    if (isTmaApp) {
      miniApp.close();
    } else {
      navigate(paths.login);
    }
  };

  return (
    <FullBleedContainer>
      <Page>
        <div className="flex h-screen flex-col items-center justify-center px-8">
          <div className="text-primary text-center text-2xl leading-8 font-bold">
            {t('information:otherActiveSession.title')}
          </div>
          <div className="mb-4 text-center text-sm leading-5">{t('information:otherActiveSession.description')}</div>
          <img src="/images/information/other-active-session.png" alt="otherActiveSession" className="mb-4 h-40 w-40" />
          <button className="btn btn-primary h-8 min-w-31.5" onClick={() => closeFunction()}>
            {t('information:retry')}
          </button>
        </div>
      </Page>
    </FullBleedContainer>
  );
}
