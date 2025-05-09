import { GeneralBonusCalendar } from './general-bonus/GeneralBonusCalendar';
import { GeneralBonusCashback } from './general-bonus/GeneralBonusCashback';
import { GeneralBonusConquests } from './general-bonus/GeneralBonusConquests';
import { GeneralBonusRakeback } from './general-bonus/GeneralBonusRakeback';
import { GeneralBonusTournament } from './general-bonus/GeneralBonusTournament';

export const TabContentGeneralBonus = () => {
  return (
    <div className="flex flex-col gap-3">
      <GeneralBonusConquests />

      <GeneralBonusTournament />

      <GeneralBonusRakeback />

      <GeneralBonusCashback />

      <GeneralBonusCalendar />
    </div>
  );
};
