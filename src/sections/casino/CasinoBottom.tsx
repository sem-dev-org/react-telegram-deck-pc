/*
 * @Author: HuangQS 564479746@qq.com
 * @Date: 2025-05-06 23:44:38
 * @LastEditors: HuangQS 564479746@qq.com
 * @LastEditTime: 2025-05-10 01:14:57
 * @Description: PC端底部介绍组件
 */
import { useTranslation } from 'react-i18next';
import { Image } from '@/components/ui/Image';

export const CasinoBottom = () => {
  const { t } = useTranslation();

  return (
    // <div className="bg-base-200 relative mr-2 flex h-[48px] min-w-0 flex-row p-10">
    //   {/* left */}
    //   <div>i'm bottom</div>
    //   {/* right */}
    //   <div></div>
    // </div>

    <div className="bg-base-200 relative flex min-w-0 items-center justify-between rounded-2xl p-10 text-base text-[12px] leading-[20px]">
      <div className="flex w-1/2 max-w-[700px] flex-col items-start">
        <div className="text-[12px]">{t('casino:bottomMenmberof')}</div>
        <div className="text-[24px] font-[900]">
          <span className="text-[#b6c85c]">{t('casino:bottomBet')}</span>
          <span className="text-[#FFFFFF]">{t('casino:bottomFrom')}</span>
          <span className="text-[#2a2f33]">{t('casino:bottomAlliance')}</span>
        </div>
        <div>
          <p className="mt-[15px] text-sm">{t('casino:bottomLeftFont')}</p>
          <div className="mt-[12px] flex flex-row text-xs">
            <div className="size-7">
              <Image src={`/icons/casino-bottom/18-plus.png`} className="object-cover" />
            </div>

            <div className="ml-[24px] h-7 w-20">
              <Image src={`/icons/casino-bottom/responsible-gambling.png`} className="object-cover" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-1/2 max-w-[700px] items-center text-sm">
        <p>{t('casino:bottomRightFont')} </p>
      </div>
    </div>
  );
};
