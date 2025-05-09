import { FullBleedContainer } from "@/components/ui/SafeArea";
import { Page } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";


export default function UserRestriction() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <FullBleedContainer>
            <Page>
                <div className="flex flex-col items-center justify-center h-screen px-8 ">
                    <div className="text-2xl font-bold leading-8 text-primary text-center">{t('information:userRestriction.title')}</div>
                    <div className="text-sm leading-5 mb-4 text-center">{t('information:userRestriction.description')}</div>
                    <img src="/images/information/user-restriction.png" alt="userRestriction" className="w-40 h-40 mb-4" />  
                    <button className="btn btn-primary min-w-31.5 h-8" onClick={() => navigate(paths.main.casino.root)}>{t('information:goBack')}</button>
                </div>
            </Page>
        </FullBleedContainer>
    )
}
