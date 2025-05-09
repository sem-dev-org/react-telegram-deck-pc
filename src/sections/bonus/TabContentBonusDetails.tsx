import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useUserClaims } from '@/query/bonus';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// 定义每种奖金类型的显示名称
// const bonusTypeLabels: Record<string, string> = {
//   group: 'Group Bonus',
//   referral: 'Referral Bonus',
//   level_up: 'Level Up Bonus',
//   rakeback: 'Rakeback',
//   cashback: 'Cashback',
//   tournament: 'Tournament',
// };

export const TabContentBonusDetails = () => {
  const { t } = useTranslation();
  const { data: userClaims } = useUserClaims();
  const { formatCurrency } = useCurrencyFormatter();

  // 处理数据：按类型分组并计算每种类型的总和
  const bonusSummary = useMemo(() => {
    if (!userClaims?.data || !Array.isArray(userClaims?.data)) return [];

    // 创建一个对象来存储每种类型的总和
    const summary: Record<string, { sum: number }> = {};

    // 处理每一项奖金数据
    userClaims?.data?.forEach((claim: any) => {
      const { item, sum } = claim;

      // 如果该类型还没有在汇总对象中，则初始化
      if (!summary[item]) {
        summary[item] = { sum: 0 };
      }

      // 累加该类型的 sum 值，不区分货币
      summary[item].sum += parseFloat(sum);
    });

    // 将对象转换为数组，并按照类型名称排序
    return Object.entries(summary)
      .map(([item, data]) => ({
        type: item,
        displayName: t(`bonus:bonus_detail_${item}`),
        sum: data.sum,
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [userClaims]);

  return (
    <div className="flex flex-col gap-3">
      <table className="table-sm bg-base-100 table rounded-lg">
        <thead>
          <tr className="border-base-300 border-b">
            <th>
              <p className="text-xs font-semibold">{t('bonus:bonus_type')}</p>
            </th>
            <th>
              <p className="text-xs font-semibold">{t('bonus:total_bonus')}</p>
            </th>
          </tr>
        </thead>
        <tbody className="bg-base-200">
          {/* 显示每种奖金类型的行 */}
          {bonusSummary.map((item) => (
            <tr key={item.type} className="border-base-300 border-b">
              <td>{item.displayName}</td>
              <td>{formatCurrency(item.sum.toString())}</td>
            </tr>
          ))}

          {/* 如果没有数据，显示空状态 */}
          {bonusSummary.length === 0 && (
            <tr>
              <td>{t('bonus:no_bonus_data_available')}</td>
              <td>0</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
