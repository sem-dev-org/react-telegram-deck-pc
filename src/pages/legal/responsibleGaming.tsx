import { mockResponsibleGaming } from '@/_mock/legal/responsibleGaming';
import { Page } from '@/components/ui';
import { FullBleedContainer, SafeContent } from '@/components/ui/SafeArea';
import { Legal } from '@/components/ui/legal';
import { useTranslation } from 'react-i18next';

export default function ResponsibleGaming() {
  const { t } = useTranslation();

  return (
    <FullBleedContainer>
      <SafeContent>
        <Page>
          <div className="bg-base-300 rounded-2xl px-3 py-4">
            <div className="bg-base-100 flex flex-col gap-3 rounded-2xl p-3">
              {mockResponsibleGaming(t).map((item) => (
                <Legal key={item.id} text={item.text} />
              ))}
            </div>
          </div>
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
}
