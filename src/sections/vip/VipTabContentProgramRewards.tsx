import { Carousel, CarouselHandle } from '@/components/carousel/Carousel';
import { useAuth } from '@/contexts/auth';
import { QueryAllVipLevelConfig } from '@/query/vip';
import { IVipLevelConfig } from '@/types/vip';
import Decimal from 'decimal.js';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const VipTabContentProgramRewards = () => {
  const { status } = useAuth();
  const { t } = useTranslation('vip');

  const carouselRef = useRef<CarouselHandle>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'in' | 'out'>('in');

  const [vipLevels, setVipLevels] = useState<IVipLevelConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { allVipLevelConfig } = QueryAllVipLevelConfig();

  // 处理API返回的VIP配置数据
  useEffect(() => {
    if (allVipLevelConfig && allVipLevelConfig.length > 0) {
      // 按照VIP等级排序
      const sortedConfig = [...allVipLevelConfig].sort((a, b) => a.vip - b.vip);
      setVipLevels(sortedConfig);
      setIsLoading(false);
    }
  }, [allVipLevelConfig]);

  // 创建要在表格中显示的奖励数据
  const getBonusesFromConfig = (config: IVipLevelConfig) => {
    // 从配置中提取奖励值作为数组返回
    return [
      `${parseFloat(config.level_up) === 0 ? '--' : `$${parseFloat(config.level_up)}`}`, // Level Up Bonus
      `${config.group ? `${Decimal(config.group).mul(100).toString()}%` : '--'}`, // Referral Bonus
      `${config.cashback_other ? `${Decimal(config.cashback_other).mul(100).toString()}%` : '--'}`, // Daily Cashback
      `${config.rakeback ? `${Decimal(config.rakeback).mul(100).toString()}%` : '--'}`, // Rakeback
      `--`, // Conquests
      `--`, // Achievements
      `--`, // Lucky Spin
      `--`, // Lucky Seven
      `--`, // World Chat
      `--`, // Tips
      `--`, // Jester
      `--`, // Weekly Bonus
      `--`, // Mystery Box
      `--`, // Private Chats
      `--`, // Zero Fee Withdrawals
    ];
  };

  // 奖励类型数据
  const bonusTypes = [
    {
      name: (
        <p>
          {t('level_up_bonus_cumulative')}
        </p>
      ),
      icon: '/icons/isometric/29.svg',
    },
    {
      name: (
        <p>
          {t('referral_commission')}
        </p>
      ),
      icon: '/icons/isometric/30.svg',
    },
    {
      name: <p>{t('daily_cashback')}</p>,
      icon: '/icons/isometric/27.png',
    },
    {
      name: (
        <p>
          {t('super_rakeback')}
        </p>
      ),
      icon: '/icons/isometric/25.png',
    },
    {
      name: <p>{t('conquests')}</p>,
      icon: '/icons/isometric/2.svg',
    },
    {
      name: <p>{t('achievements')}</p>,
      icon: '/icons/isometric/31.svg',
    },
    {
      name: <p>{t('lucky_spin')}</p>,
      icon: '/icons/isometric/13.svg',
    },
    {
      name: <p>{t('lucky_seven')}</p>,
      icon: '/icons/isometric/32.svg',
    },
    {
      name: <p>{t('world_chat')}</p>,
      icon: '/icons/isometric/33.svg',
    },
    {
      name: <p>{t('tips')}</p>,
      icon: '/icons/isometric/34.png',
    },
    {
      name: <p>{t('jester')}</p>,
      icon: '/icons/isometric/35.svg',
    },
    {
      name: <p>{t('weekly_bonus')}</p>,
      icon: '/icons/isometric/14.svg',
    },
    {
      name: <p>{t('mystery_box')}</p>,
      icon: '/icons/isometric/36.svg',
    },
    {
      name: <p>{t('private_chats')}</p>,
      icon: '/icons/isometric/37.svg',
    },
    {
      name: (
        <p>
          {t('zero_fee_withdrawals')}
        </p>
      ),
      icon: '/icons/isometric/8.svg',
    },
  ];

  // 获取不同等级对应的图标
  const getVipIconByLevel = (vipLevel: number) => {
    if (vipLevel >= 100) return '/icons/vip-badge/platinum.png'; // Platinum
    if (vipLevel >= 81) return '/icons/vip-badge/sapphire.png'; // Sapphire
    if (vipLevel >= 61) return '/icons/vip-badge/ruby.png'; // Ruby
    if (vipLevel >= 41) return '/icons/vip-badge/gold.png'; // Gold
    if (vipLevel >= 21) return '/icons/vip-badge/silver.png'; // Silver
    return '/icons/vip-badge/bronze.png'; // Bronze (1-20)
  };

  // 获取VIP等级的名称
  // const getVipTierName = (vipLevel: number) => {
  //   if (vipLevel >= 100) return 'Platinum';
  //   if (vipLevel >= 81) return 'Sapphire';
  //   if (vipLevel >= 61) return 'Ruby';
  //   if (vipLevel >= 41) return 'Gold';
  //   if (vipLevel >= 21) return 'Silver';
  //   return 'Bronze';
  // };

  // Framer Motion 动画变体 - 优化以防止频闪
  const containerVariants = {
    hidden: {
      opacity: 1, // 保持可见以防止闪烁
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.01, // 添加轻微延迟
      },
    },
    exit: {
      opacity: 1, // 保持可见以防止闪烁
      transition: {
        staggerChildren: 0.02,
        staggerDirection: -1, // 反向交错退出
      },
    },
  };

  const slideInVariants = {
    hidden: {
      opacity: 0,
      x: 30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
        duration: 0.3, // 确保动画持续时间固定
      },
    },
    exit: {
      opacity: 0,
      x: -30,
      transition: {
        duration: 0.2, // 退出动画更快
      },
    },
  };

  const slideOutVariants = {
    hidden: {
      opacity: 0,
      x: -30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
        duration: 0.3, // 确保动画持续时间固定
      },
    },
    exit: {
      opacity: 0,
      x: 30,
      transition: {
        duration: 0.2, // 退出动画更快
      },
    },
  };

  // 处理轮播切换 - 优化以防止频闪
  const handleSlideChange = (index: number) => {
    // 只有当索引真正变化时才更新状态
    if (index !== activeSlide) {
      setActiveSlide(index);
    }
  };

  // 如果数据正在加载或没有数据，显示加载状态
  if (isLoading || vipLevels.length === 0) {
    return (
      <div className="mx-auto mt-50 flex">
        <span className="loading loading-spinner loading-xl text-primary" />
      </div>
    );
  }

  // 第一个VIP等级作为固定列
  const firstVipLevel = vipLevels[status?.vip ? status?.vip - 1 : 0];
  // 其余VIP等级用于轮播 - 移除限制，使用所有可用VIP等级
  const carouselVipLevels = vipLevels.slice(status?.vip || 0 + 1);

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex flex-col rounded-t-lg rounded-r-xl rounded-b-none p-4"
        style={{
          background:
            'linear-gradient(180.35deg, color(display-p3 0.137 0.396 0.408 / 0.2) 0.3%, color(display-p3 0.114 0.137 0.165 / 0.2) 88.65%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <p className="text-base font-bold">{t('exclusive_vip_system')}</p>
        <p className="mt-4 text-sm leading-5">
          {t('step_into_world')}
        </p>
        <p className="mt-4 text-sm leading-5">
          {t('every_bet')}
        </p>

        <p className="mt-4 text-base font-bold">{t('program_rewards')}</p>
      </div>

      <div className="bg-base-300 -mt-2 overflow-hidden rounded-b-xl">
        <div className="flex">
          {/* 左侧固定列 - 奖励类型 */}
          <div className="flex w-[44%] flex-col">
            <div className="bg-base-200 flex h-11 items-center pl-4">
              <span className="text-sm font-semibold">{t('bonus_type')}</span>
            </div>
            {bonusTypes.map((bonus, index) => (
              <div key={index} className="bg-base-200 border-base-300 flex h-11 items-center gap-3 border-t pl-4">
                <img src={bonus.icon} className="h-4 w-4" />
                <span className="text-sm font-semibold">{bonus.name}</span>
              </div>
            ))}
          </div>

          {/* 中间固定列 - 第一个VIP等级 */}
          <div className="relative flex w-[20%] flex-col">
            {/* 渐变背景层 - 修改为从第二行开始 */}
            <div
              className="absolute z-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(234, 106, 63, 0.15) 0%, var(--color-base-200) 100%)',

                // opacity: 0.15,
                top: '45px', // 从第二行开始（表头高度）
                bottom: '0',
                left: '0',
                right: '0',
                pointerEvents: 'none', // 确保不会干扰交互
              }}
            ></div>

            {/* 表格头部 */}
            <div className="bg-base-200 relative z-10 flex h-11 items-center justify-center gap-1">
              <img src={getVipIconByLevel(firstVipLevel.vip)} className="h-5 w-5" />
              <div className="text-sm font-semibold">VIP {firstVipLevel.vip} </div>
            </div>

            {/* 表格内容行 */}
            {getBonusesFromConfig(firstVipLevel).map((bonus, index) => (
              <div key={index} className="border-base-300 relative z-10 flex h-11 items-center justify-center border-t">
                <div className="text-sm font-semibold">{bonus}</div>
              </div>
            ))}
          </div>

          {/* 右侧轮播列 - 其他VIP等级 */}
          <div className="relative w-[36%]">
            <div>
              <Carousel
                showNavigation={false}
                showDots={false}
                autoplay={false}
                ref={carouselRef}
                onChange={handleSlideChange}
              >
                <div className="flex">
                  {carouselVipLevels.map((level, index) => (
                    <div key={index} className="flex min-w-0 flex-[0_0_100%] items-center justify-center">
                      <div className="flex w-full flex-col">
                        {/* 表格头部 */}
                        <div className="bg-base-200 flex h-11 items-center justify-center gap-1">
                          <img src={getVipIconByLevel(level.vip)} className="h-5 w-5" />
                          <div className="text-sm font-semibold">VIP {level.vip} </div>
                        </div>

                        {/* 使用固定的key来防止不必要的重新渲染 */}
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.div
                            key={`slide-${index}`}
                            variants={containerVariants}
                            initial="hidden"
                            animate={activeSlide === index ? 'visible' : 'hidden'}
                            exit="exit"
                            className="flex flex-col" // 移除gap-[1px]
                          >
                            {getBonusesFromConfig(level).map((bonus, bonusIndex) => (
                              <motion.div
                                key={`bonus-${index}-${bonusIndex}`}
                                variants={slideDirection === 'in' ? slideInVariants : slideOutVariants}
                                className="bg-base-200 border-base-300 flex h-11 items-center justify-center border-t"
                                style={{
                                  willChange: 'opacity, transform', // 优化性能
                                  backfaceVisibility: 'hidden', // 防止3D变换导致的闪烁
                                }}
                              >
                                <div className="text-sm font-semibold">{bonus}</div>
                              </motion.div>
                            ))}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  ))}
                </div>
              </Carousel>
            </div>

            {/* 导航按钮 */}
            <motion.div
              className="bg-base-100 absolute top-3 left-3 flex h-5 w-5 items-center justify-center rounded-md"
              onClick={() => {
                setSlideDirection('out');
                carouselRef.current?.scrollPrev();
              }}
              whileTap={{ scale: 0.95 }} // 添加点击反馈
            >
              <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.79062 1.03779C6.07772 1.33637 6.06841 1.81115 5.76983 2.09824L1.83208 5.80762L5.76983 9.51699C6.06841 9.80409 6.07772 10.2789 5.79062 10.5774C5.50353 10.876 5.02875 10.8853 4.73017 10.5982L0.230167 6.34824C0.0831082 6.20684 -1.18115e-06 6.01163 -1.17223e-06 5.80762C-1.16331e-06 5.60361 0.0831082 5.4084 0.230167 5.26699L4.73017 1.01699C5.02875 0.729898 5.50353 0.739208 5.79062 1.03779Z"
                  fill="#A6ADBB"
                />
              </svg>
            </motion.div>
            <motion.div
              className="bg-base-100 absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-md"
              onClick={() => {
                setSlideDirection('in');
                carouselRef.current?.scrollNext();
              }}
              whileTap={{ scale: 0.95 }} // 添加点击反馈
            >
              <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.209376 10.5774C-0.0777189 10.2789 -0.0684094 9.80409 0.230169 9.51699L4.16792 5.80762L0.230169 2.09824C-0.0684099 1.81115 -0.0777193 1.33636 0.209376 1.03778C0.496471 0.739206 0.971253 0.729897 1.26983 1.01699L5.76983 5.26699C5.91689 5.40839 6 5.6036 6 5.80762C6 6.01163 5.91689 6.20684 5.76983 6.34824L1.26983 10.5982C0.971254 10.8853 0.496471 10.876 0.209376 10.5774Z"
                  fill="#A6ADBB"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 特殊奖励卡片 */}
      <div
        className="flex flex-col gap-2 rounded-lg p-4"
        style={{
          background:
            'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 0.125 0.655 0.596 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <div className="flex items-center gap-4">
          <img src="/icons/isometric/13.svg" className="h-12 w-12" />
          <div className="flex flex-col">
            <p className="text-neutral-content text-base font-bold">{t('lucky_spin')}</p>
            <p className="mt-2 text-sm leading-relaxed">
              {t('lucky_spin_description')}
            </p>
          </div>
          <button className="btn btn-secondary btn-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.99998 0.700195C5.26028 0.700195 3.84998 2.1105 3.84998 3.8502V6.3002H3.49998C2.72678 6.3002 2.09998 6.927 2.09998 7.7002V11.9002C2.09998 12.6734 2.72678 13.3002 3.49998 13.3002H10.5C11.2732 13.3002 11.9 12.6734 11.9 11.9002V7.7002C11.9 6.927 11.2732 6.3002 10.5 6.3002H10.15V3.8502C10.15 2.1105 8.73967 0.700195 6.99998 0.700195ZM9.09998 6.3002V3.8502C9.09998 2.6904 8.15977 1.7502 6.99998 1.7502C5.84018 1.7502 4.89998 2.6904 4.89998 3.8502V6.3002H9.09998Z"
                fill="#E7FB78"
                fillOpacity="0.8"
              />
            </svg>
            <p className="text-secondary-content text-sm">VIP 4</p>
          </button>
        </div>
      </div>

      {/* 其他特殊奖励卡片 */}
      <div
        className="flex flex-col gap-2 rounded-lg p-4"
        style={{
          background:
            'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 1.000 0.588 0.620 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <div className="flex items-center gap-4">
          <img src="/icons/isometric/14.svg" className="h-12 w-12" />
          <div className="flex flex-col">
            <p className="text-neutral-content text-base font-bold">{t('weekly_cashback')}</p>
            <p className="mt-2 text-sm leading-relaxed">
              {t('weekly_cashback_description')}
            </p>
          </div>
          <button className="btn btn-secondary btn-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.99998 0.700195C5.26028 0.700195 3.84998 2.1105 3.84998 3.8502V6.3002H3.49998C2.72678 6.3002 2.09998 6.927 2.09998 7.7002V11.9002C2.09998 12.6734 2.72678 13.3002 3.49998 13.3002H10.5C11.2732 13.3002 11.9 12.6734 11.9 11.9002V7.7002C11.9 6.927 11.2732 6.3002 10.5 6.3002H10.15V3.8502C10.15 2.1105 8.73967 0.700195 6.99998 0.700195ZM9.09998 6.3002V3.8502C9.09998 2.6904 8.15977 1.7502 6.99998 1.7502C5.84018 1.7502 4.89998 2.6904 4.89998 3.8502V6.3002H9.09998Z"
                fill="#E7FB78"
                fillOpacity="0.8"
              />
            </svg>
            <p className="text-secondary-content text-sm">VIP 12</p>
          </button>
        </div>
      </div>

      {/* 保留其他特殊奖励卡片... */}
      <div
        className="flex flex-col gap-2 rounded-lg p-4"
        style={{
          background:
            'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 0.082 0.557 0.808 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <div className="flex items-center gap-4">
          <img src="/icons/isometric/15.svg" className="h-12 w-12" />
          <div className="flex flex-col">
            <p className="text-neutral-content text-base font-bold">{t('the_airdrop')}</p>
            <p className="mt-2 text-sm leading-relaxed">{t('airdrop_description')}</p>
          </div>
          <button className="btn btn-secondary btn-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.99998 0.700195C5.26028 0.700195 3.84998 2.1105 3.84998 3.8502V6.3002H3.49998C2.72678 6.3002 2.09998 6.927 2.09998 7.7002V11.9002C2.09998 12.6734 2.72678 13.3002 3.49998 13.3002H10.5C11.2732 13.3002 11.9 12.6734 11.9 11.9002V7.7002C11.9 6.927 11.2732 6.3002 10.5 6.3002H10.15V3.8502C10.15 2.1105 8.73967 0.700195 6.99998 0.700195ZM9.09998 6.3002V3.8502C9.09998 2.6904 8.15977 1.7502 6.99998 1.7502C5.84018 1.7502 4.89998 2.6904 4.89998 3.8502V6.3002H9.09998Z"
                fill="#E7FB78"
                fillOpacity="0.8"
              />
            </svg>
            <p className="text-secondary-content text-sm">VIP 22</p>
          </button>
        </div>
      </div>

      <div
        className="flex flex-col gap-2 rounded-lg p-4"
        style={{
          background:
            'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 0.780 0.275 0.318 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <div className="flex items-center gap-4">
          <img src="/icons/isometric/16.svg" className="h-12 w-12" />
          <div className="flex flex-col">
            <p className="text-neutral-content text-base font-bold">{t('jester')}</p>
            <p className="mt-2 text-sm leading-relaxed">
              {t('jester_description')}
            </p>
          </div>
          <button className="btn btn-secondary btn-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.99998 0.700195C5.26028 0.700195 3.84998 2.1105 3.84998 3.8502V6.3002H3.49998C2.72678 6.3002 2.09998 6.927 2.09998 7.7002V11.9002C2.09998 12.6734 2.72678 13.3002 3.49998 13.3002H10.5C11.2732 13.3002 11.9 12.6734 11.9 11.9002V7.7002C11.9 6.927 11.2732 6.3002 10.5 6.3002H10.15V3.8502C10.15 2.1105 8.73967 0.700195 6.99998 0.700195ZM9.09998 6.3002V3.8502C9.09998 2.6904 8.15977 1.7502 6.99998 1.7502C5.84018 1.7502 4.89998 2.6904 4.89998 3.8502V6.3002H9.09998Z"
                fill="#E7FB78"
                fillOpacity="0.8"
              />
            </svg>

            <p className="text-secondary-content text-sm">VIP 29</p>
          </button>
        </div>
      </div>

      <div
        className="flex flex-col gap-2 rounded-lg p-4"
        style={{
          background:
            'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 0.341 0.282 0.537 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <div className="flex items-center gap-4">
          <img src="/icons/isometric/40.svg" className="h-12 w-12" />
          <div className="flex flex-col">
            <p className="text-neutral-content text-base font-bold">{t('the_cannon')}</p>
            <p className="mt-2 text-sm leading-relaxed">
              {t('cannon_description')}
            </p>
          </div>
          <button className="btn btn-secondary btn-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.99998 0.700195C5.26028 0.700195 3.84998 2.1105 3.84998 3.8502V6.3002H3.49998C2.72678 6.3002 2.09998 6.927 2.09998 7.7002V11.9002C2.09998 12.6734 2.72678 13.3002 3.49998 13.3002H10.5C11.2732 13.3002 11.9 12.6734 11.9 11.9002V7.7002C11.9 6.927 11.2732 6.3002 10.5 6.3002H10.15V3.8502C10.15 2.1105 8.73967 0.700195 6.99998 0.700195ZM9.09998 6.3002V3.8502C9.09998 2.6904 8.15977 1.7502 6.99998 1.7502C5.84018 1.7502 4.89998 2.6904 4.89998 3.8502V6.3002H9.09998Z"
                fill="#E7FB78"
                fillOpacity="0.8"
              />
            </svg>

            <p className="text-secondary-content text-sm">VIP 38</p>
          </button>
        </div>
      </div>
    </div>
  );
};
