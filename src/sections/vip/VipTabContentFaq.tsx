import { vipFaq } from '@/_mock/legal/vipFaq';
import { Legal } from '@/components/ui/legal';
import { useTranslation } from 'react-i18next';

export const VipTabContentFaq = () => {

  const { t } = useTranslation();

  return (
    <div className="bg-base-100 flex flex-col gap-3 rounded-xl p-2">
       {vipFaq(t).map((item) => (
        <Legal key={item.id} text={item.text} />
      ))}
    </div>
  );
};
