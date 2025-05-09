import { ModalDialog } from '@/components/ui/ModalDialog';
import { SearchInput } from '@/components/ui/SearchInput';
import { useState } from 'react';
import { useLanguage } from '@/contexts/language';
import { languages } from '@/_mock/languages';
import { useTranslation } from 'react-i18next';
import { updateUser } from '@/api/profile';

export default function ProfileLanguageModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');

  const changeLanguageFun = (value: string) => {
    changeLanguage(value);
    updateUser({
      language_code: value,
    }).then((res) => {
      if (res.code === 0) {
        onClose();
      }
    });
  };

  return (
    <ModalDialog open={open} onClose={onClose} position="modal-bottom" className="p-0">
      <div className="modal-box bg-base-100 flex h-[70vh] flex-col gap-3 p-0 pt-3">
        <h3 className="h-6 text-center text-base font-bold">{t("profile:selectLanguage")}</h3> 

        <div className="px-6">
          <SearchInput
            placeholder={t('common.search')}
            className="bg-base-200 h-10"
            value={searchValue}
            onChange={(value) => setSearchValue(value)}
          />
          <div className="scrollbar-hide mt-3 flex w-full flex-col overflow-y-auto">
            {languages
              .filter((lang) => 
                lang.label.toLowerCase().includes(searchValue.toLowerCase()) || 
                lang.value.toLowerCase().includes(searchValue.toLowerCase())
              )
              .map((lang) => (
              <div
                key={lang.value}
                className={`flex h-12 cursor-pointer items-center gap-2 rounded-md px-3 ${
                  lang.value === currentLanguage ? 'bg-neutral' : ''
                }`}
                onClick={() => changeLanguageFun(lang.value)}
              >
                <img src={lang.icon} alt={lang.label} className="h-5 w-5" />
                <span className="text-base font-bold">{lang.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalDialog>
  );
}
