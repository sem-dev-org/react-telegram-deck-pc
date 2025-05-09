import { FullBleedContainer } from "@/components/ui/SafeArea";
import { Page } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useTranslation } from "react-i18next";

export default function FailedToLoadPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <FullBleedContainer>
            <Page>
                <div className="flex flex-col items-center justify-center h-screen px-8 ">   
                    <div className="text-2xl font-bold leading-8 text-primary text-center">{t('information:failedToLoadPage.title')}</div> 
                    <div className="text-sm leading-5 mb-4 text-center">{t('information:failedToLoadPage.description')}</div>
                    <img src="/images/information/failed-to-load-page.png" alt="failedToLoadPage" className="w-40 h-40 mb-4" />
                    <button className="btn btn-primary min-w-31.5 h-8" onClick={() => navigate(paths.main.casino.root)}>{t('information:tryAgain')}</button>
                </div>
            </Page>
        </FullBleedContainer>
    )
}
