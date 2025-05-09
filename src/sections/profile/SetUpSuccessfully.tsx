import { ModalDialog } from "@/components/ui/ModalDialog";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function SetUpSuccessfully({ open, onClose, title, description }: { open: boolean; onClose: () => void, title: string, description: string }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <ModalDialog open={open} onClose={() => {
            onClose();
            navigate(-1);
        }} className="max-w-[327px] bg-base-100 p-6">
            <div className="flex flex-col gap-3 overflow-hidden">
                <h1 className="text-base font-bold">{title}</h1>
                <div className="P-4 flex items-center gap-3 p-4 rounded-lg" style={{
                    background: "radial-gradient(100% 157.05% at 0% 46.47%, rgba(0, 172, 105, 0.4) 0%, rgba(51, 51, 51, 0.08) 100%), #1B232B",
                }}>
                    <img src="/icons/isometric/38.svg" />
                    <p className="text-sm leading-6 whitespace-pre-line">{description}</p>
                </div>
                <button className="btn btn-primary w-full h-12" onClick={() => {
                    onClose();
                    navigate(-1);
                }}>
                    {t('profile:backToProfile')}    
                </button>
            </div>
        </ModalDialog>
    )
}
