import { IConquest } from '@/types/bonus';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useTranslation, Trans } from 'react-i18next';
import { checkVariants } from '@/components/ui/CopyBtn';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';

type Props = {
  conquest: IConquest;
};

export default function ConquestSlots({ conquest }: Props) {
  const { formatCurrency } = useCurrencyFormatter();
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col items-center gap-2 rounded-lg p-4"
      style={{
        background:
          'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 1.000 0.278 0.341 / 0.3) 0%, color(display-p3 0.200 0.200 0.200 / 0.06) 100%), color(display-p3 0.114 0.137 0.165)',
      }}
      onClick={() => {
        navigate(`${paths.main.explore.root}?category=slots`);
      }}
    >
      <div className="flex items-center gap-4">
        <img src="/icons/isometric/47.svg" className="h-12 w-12" />
        <div className='flex flex-between gap-2 items-center'>
          <div className="flex flex-col">
            <p className="text-base font-bold">
              <Trans i18nKey="bonus:conquest_slots_master_10_title" />
            </p>
            <p className="text-sm leading-5">
              <Trans
                i18nKey="bonus:conquest_slots_master_10_description"
                components={[<span key="reward" className="text-primary" />]}
                values={{ amount: formatCurrency(10), reward: formatCurrency(conquest.reward_amount) }}
              />
            </p>
          </div>
          {Object.keys(conquest).includes('total_wager_amount') && (
            conquest.is_finish === 100 && (
              <button className="btn btn-sm btn-secondary">
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  initial="hidden"
                  animate="visible"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M4 10L8 14L16 6"
                    stroke="#E7FB78"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={checkVariants}
                  />
                </motion.svg>
              </button>
            )
          )}
        </div>

      </div>

      {Object.keys(conquest).includes('total_wager_amount') && (
        <div className="flex w-full items-center gap-4">
          <div className="flex w-full flex-1 flex-col gap-1">
            <p className="text-xs font-bold">
              {formatCurrency(conquest?.wager_amount || 0)}/{formatCurrency(conquest?.total_wager_amount || 0)}
            </p>
            <progress
              className="progress progress-primary w-full"
              value={conquest?.wager_amount || 0}
              max={conquest?.total_wager_amount || 0}
            ></progress>
          </div>

          {conquest.is_finish > 0 ? (
            <input className="checkbox checkbox-primary" type="checkbox" checked />
          ) : (
            <button className="btn btn-sm btn-secondary">{t('bonus:go')}</button>
          )}
        </div>
      )}
    </div>
  );
}
