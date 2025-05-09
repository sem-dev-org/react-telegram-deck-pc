import { checkVariants } from '@/components/ui/CopyBtn';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { paths } from '@/routes/paths';
import { IConquest } from '@/types/bonus';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Props = {
  conquest: IConquest;
};
export default function ConquestWin({ conquest }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formatCurrency } = useCurrencyFormatter();

  const renderIcon = useMemo(() => {
    switch (conquest?.key) {
      case 'conquest_big_win':
        return <img src="/icons/isometric/43.svg" className="h-12 w-12" />;
      case 'conquest_huge_win':
        return <img src="/icons/isometric/43.svg" className="h-12 w-12" />;
      case 'conquest_massive_win':
        return <img src="/icons/isometric/46.svg" className="h-12 w-12" />;
      default:
        return <img src="/icons/isometric/43.svg" className="h-12 w-12" />;
    }
  }, [conquest?.key]);

  const renderTitle = useMemo(() => {
    switch (conquest?.key) {
      case 'conquest_big_win':
        return t('bonus:conquest_big_win_title');
      case 'conquest_huge_win':
        return t('bonus:conquest_huge_win_title');
      case 'conquest_massive_win':
        return t('bonus:conquest_massive_win_title');
      default:
        return t('bonus:conquest_massive_win_title');
    }
  }, [conquest?.type]);

  const renderParams = useMemo(() => {
    switch (conquest?.key) {
      case 'conquest_big_win':
        return {
          multiple: 50,
          min_bet: formatCurrency(1),
          reward: formatCurrency(conquest?.reward_amount),
        };
      case 'conquest_huge_win':
        return {
          multiple: 100,
          min_bet: formatCurrency(1),
          reward: formatCurrency(conquest?.reward_amount),
        };
      case 'conquest_massive_win':
        return {
          multiple: 200,
          min_bet: formatCurrency(1),
          reward: formatCurrency(conquest?.reward_amount),
        };
      default:
        return {
          multiple: 50,
          min_bet: formatCurrency(1),
          reward: formatCurrency(conquest?.reward_amount),
        };
    }
  }, [conquest?.type]);

  return (
    <div
      className="flex flex-col gap-2 rounded-lg p-4"
      style={{
        background:
          'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 1.000 0.729 0.125 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
      }}
      onClick={() => {
        navigate(`${paths.main.casino.root}`);
      }}
    >
      <div className="flex items-center gap-4">
        {renderIcon}
        <div className='flex flex-between gap-2 items-center'>
          <div className="flex flex-col">
            <p className="text-base font-bold">{renderTitle}</p>
            <p className="text-sm leading-5">
              <Trans
                i18nKey="bonus:conquest_big_win_description"
                values={{ multiple: renderParams.multiple, min_bet: renderParams.min_bet, reward: renderParams.reward }}
                components={[<span className="text-primary"></span>]}
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
