import { FullBleedContainer } from "@/components/ui/SafeArea";
import { Page } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { paths } from "@/routes/paths";
import { useNavigate } from "react-router-dom";

export default function EmptyStateNoContent() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <FullBleedContainer>
            <Page>
                <div className="flex flex-col items-center justify-center h-screen px-8 ">
                    <div className="text-2xl font-bold leading-8 text-primary text-center">{t('information:emptyStateNoContent.title')}</div>
                    <div className="text-sm leading-5 mb-4 text-center">
                        {t('information:emptyStateNoContent.description')}
                    </div>
                    <img src="/images/information/empty-state-no-content.png" alt="emptyStateNoContent" className="w-40 h-40 mb-4" />
                    <button className="btn btn-primary min-w-31.5 h-8" onClick={() => navigate(paths.main.casino.root)}>{t('information:goBack')}</button>
                </div>
            </Page>
        </FullBleedContainer>
    )
}
