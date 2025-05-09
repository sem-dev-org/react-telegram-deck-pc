import { FullBleedContainer } from "@/components/ui/SafeArea";
import { Page } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";


export default function UnderMaintenance() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <FullBleedContainer>
            <Page>
                <div className="flex flex-col items-center justify-center h-screen px-8 ">
                    <div className="text-2xl font-bold leading-8 text-primary text-center">{t('information:underMaintenance.title')}</div>
                    <div className="text-sm leading-5 mb-4 text-center">{t('information:underMaintenance.description')}</div>
                    <img src="/images/information/under-maintenance.png" alt="underMaintenance" className="w-40 h-40 mb-4" />
                    <button className="btn btn-primary min-w-31.5 h-8" onClick={() => navigate(paths.main.casino.root)}>{t('information:refresh')}</button>
                </div>
            </Page>
        </FullBleedContainer>
    )
}
