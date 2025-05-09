import { FullBleedContainer } from "@/components/ui/SafeArea";
import { Page } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { paths } from "@/routes/paths";

export default function PageNotFound() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    return (
        <FullBleedContainer>
            <Page>
                <div className="flex flex-col items-center justify-center h-screen px-8 ">   
                    <div className="text-2xl font-bold leading-8 text-primary text-center">{t('information:pageNotFound.title')}</div>
                    <div className="text-sm leading-5 mb-4 text-center">{t('information:pageNotFound.description')}</div>
                    <img src="/images/information/page-not-found.png" alt="pageNotFound" className="w-40 h-40 mb-4" />
                    <button className="btn btn-primary min-w-31.5 h-8" onClick={() => navigate(paths.main.casino.root)}>{t('information:goBack')}</button>
                </div>
            </Page>
        </FullBleedContainer>
    )
}
