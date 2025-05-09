import { Legal } from '@/components/ui/legal';
import { mockAboutUs } from '@/_mock/legal/aboutUs';
import { useTranslation } from 'react-i18next';
import { FullBleedContainer, SafeContent } from '@/components/ui/SafeArea';
import { Page } from '@/components/ui';

export default function AboutUs() {
  const { t } = useTranslation();
  return (
    <FullBleedContainer>
      <SafeContent>
        <Page>
          <div className="bg-base-300 rounded-2xl px-3 py-4">
            <div className="bg-base-100 flex flex-col gap-3 rounded-2xl p-3">
              {mockAboutUs(t).map((item) => (
                <Legal key={item.id} text={item.text} />
              ))}
            </div>
          </div>
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
}
