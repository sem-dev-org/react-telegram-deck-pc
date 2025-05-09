import { calendarClaim } from '@/api/bonus';
import { Carousel, CarouselHandle } from '@/components/carousel/Carousel';
import { CurrencyDisplay } from '@/components/CurrencyDisplay';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useCalendarBonus } from '@/query/bonus';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { PopupCalendar } from '../popup/PopupCalendar';

// 倒计时显示组件，使用useRef和useCallback优化性能
const CountdownDisplay = ({ targetTime }: { targetTime: number }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const targetTimeRef = useRef(targetTime);
  
  // 使用useRef存储最新的倒计时值，避免不必要的重渲染
  const timeLeftRef = useRef('');
  
  // 更新UI的函数，只有当倒计时值真正变化时才会触发重渲染
  const updateDisplay = useCallback(() => {
    if (timeLeftRef.current !== timeLeft) {
      setTimeLeft(timeLeftRef.current);
    }
  }, [timeLeft]);
  
  // 计算倒计时的函数，更新ref但不触发重渲染
  const calculateTimeLeft = useCallback(() => {
    const now = dayjs();
    const startTime = dayjs(targetTimeRef.current);
    const diffHours = startTime.diff(now, 'hour');
    const diffMinutes = startTime.diff(now, 'minute') % 60;
    
    const newTimeLeft = `${diffHours}h ${diffMinutes}m`;
    
    // 只有当值真正变化时才更新
    if (newTimeLeft !== timeLeftRef.current) {
      timeLeftRef.current = newTimeLeft;
      updateDisplay();
    }
  }, [updateDisplay]);
  
  // 组件挂载时启动倒计时
  useEffect(() => {
    // 立即计算一次初始值
    calculateTimeLeft();
    
    // 设置定时器，每分钟更新一次
    timerRef.current = setInterval(() => {
      calculateTimeLeft();
    }, 60000); // 每分钟更新一次，减少不必要的更新
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [calculateTimeLeft]);
  
  return (
    <p className="bg-base-300 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold">
      <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.50002 12.6004C10.5928 12.6004 13.1 10.0932 13.1 7.00039C13.1 3.9076 10.5928 1.40039 7.50002 1.40039C4.40723 1.40039 1.90002 3.9076 1.90002 7.00039C1.90002 10.0932 4.40723 12.6004 7.50002 12.6004ZM8.25002 3.50039C8.25002 3.08618 7.91424 2.75039 7.50002 2.75039C7.08581 2.75039 6.75002 3.08618 6.75002 3.50039V7.00039C6.75002 7.4146 7.08581 7.75039 7.50002 7.75039H10.3C10.7142 7.75039 11.05 7.4146 11.05 7.00039C11.05 6.58618 10.7142 6.25039 10.3 6.25039H8.25002V3.50039Z"
          className="fill-base-content"
        />
      </svg>
      <span>{timeLeft}</span>
    </p>
  );
};

export const GeneralBonusCalendar = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { formatCurrency } = useCurrencyFormatter();
  const { data: calendarBonus } = useCalendarBonus();

  // 计算所有可领取的calendar bonus总额
  const [totalClaimableCalendarBonus, setTotalClaimableCalendarBonus] = useState('0.00');
  // 添加一个状态来存储即将过期的bonus金额
  const [expiringBonusAmount, setExpiringBonusAmount] = useState('0.00');
  // 添加一个状态来存储所有未领取的calendar bonus总额
  const [totalBonusPoolAmount, setTotalBonusPoolAmount] = useState('0.00');

  // 倒计时状态
  const [depositBonusTimeLeft, setDepositBonusTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 格式化时间为两位数
  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : `${time}`;
  };

  // Add carousel ref for controlling the date carousel
  const carouselRef = useRef<CarouselHandle>(null);
  const [isOpenCalendarInfoPopup, setIsOpenCalendarInfoPopup] = useState(false);

  // 添加日期卡片生成函数和状态
  const [dateCards, setDateCards] = useState<
    Array<{
      date: Date;
      day: number;
      dayName: string;
      month: string;
      isActive: boolean;
      claimAmount: string;
      totalAmount: string;
      completed: number;
      bonuses: any[];
      hasBonus: boolean;
    }>
  >([]);

  const [selectedDateIndex, setSelectedDateIndex] = useState(3); // 默认选中今天（中间）
  const [hasInitialScroll, setHasInitialScroll] = useState(false);

  const parseCalendarBonus = (calendarBonus: any) => {
    console.log(calendarBonus);
    // 根据start_time 分组, 如果start_time是一样的，则累加amount
    const groupedBonus = calendarBonus.reduce((acc: any, item: any) => {
      const date = dayjs(item.start_time * 1000);
      const dateKey = date.format('YYYY-MM-DD HH:mm:ss');

      if (acc[dateKey]) {
        // 如果该时间已存在条目，累加amount值
        acc[dateKey].amount = (parseFloat(acc[dateKey].amount) + parseFloat(item.amount)).toString();
      } else {
        // 如果该时间不存在条目，创建新条目
        acc[dateKey] = { ...item };
      }

      return acc;
    }, {});

    console.log('Grouped bonus with accumulated amounts:', groupedBonus);
    return groupedBonus;
  };

  // 根据日期分组，每个日期最多包含3个奖励元素
  const groupBonusByDate = (groupedBonus: any) => {
    // 按日期分组
    const dateGrouped: Record<string, any[]> = {};

    // 遍历时间分组后的数据
    Object.entries(groupedBonus).forEach(([timeKey, bonusData]: [string, any]) => {
      // 提取日期部分 (YYYY-MM-DD)
      const dateKey = timeKey.split(' ')[0];

      if (!dateGrouped[dateKey]) {
        dateGrouped[dateKey] = [];
      }

      // 确保每个日期最多只有3个元素
      if (dateGrouped[dateKey].length < 3) {
        dateGrouped[dateKey].push({
          ...bonusData,
          time: timeKey.split(' ')[1], // 保存时间部分
        });
      }
    });

    console.log('Bonuses grouped by date (max 3 per date):', dateGrouped);
    return dateGrouped;
  };

  // 根据分组后的奖励数据生成日期卡片
  const generateDateCards = (dateGroupedBonus: Record<string, any[]>) => {
    // 创建类型化的卡片数组
    const cards: Array<{
      date: Date;
      day: number;
      dayName: string;
      month: string;
      isActive: boolean;
      claimAmount: string;
      totalAmount: string;
      completed: number;
      bonuses: any[];
      hasBonus: boolean;
    }> = [];

    // 生成今日前后三天的日期卡片
    const today = dayjs();
    const dateMap: Record<string, boolean> = {}; // 用于跟踪已生成的日期

    // 首先处理有数据的日期
    Object.entries(dateGroupedBonus).forEach(([dateKey, bonuses]) => {
      if (bonuses.length > 0) {
        const date = dayjs(dateKey);
        const dateStr = date.format('YYYY-MM-DD');
        dateMap[dateStr] = true;

        const day = date.date();
        const dayName = date.format('dddd');
        const month = date.format('MMMM');

        // 计算已完成的奖励数量
        const completed = bonuses.filter(
          (bonus) => bonus.status === 1 || bonus.handle_status === 1 || dayjs(bonus.end_time * 1000).isBefore(dayjs()),
        ).length;

        // 计算可领取的奖励总额
        const claimAmount = bonuses
          .filter((bonus) => bonus.status === 0 && bonus.handle_status === 0)
          .reduce((sum, bonus) => sum + parseFloat(bonus.amount), 0)
          .toFixed(2);

        // 计算该日期的奖励总额
        const totalAmount = bonuses.reduce((sum, bonus) => sum + parseFloat(bonus.amount), 0).toFixed(2);

        // 判断是否可以领取
        const isActive = bonuses.some(
          (bonus) =>
            bonus.status === 0 &&
            bonus.handle_status === 0 &&
            dayjs(bonus.start_time * 1000).isBefore(dayjs()) &&
            dayjs(bonus.end_time * 1000).isAfter(dayjs()),
        );

        cards.push({
          date: date.toDate(),
          day,
          dayName,
          month,
          isActive,
          claimAmount: claimAmount.toString(),
          totalAmount: totalAmount.toString(),
          completed,
          bonuses, // 保存原始奖励数据以供使用
          hasBonus: true,
        });
      }
    });

    // 生成今日前后三天的日期卡片，如果还没有生成
    for (let i = -3; i <= 3; i++) {
      const date = today.add(i, 'day');
      const dateStr = date.format('YYYY-MM-DD');

      // 如果该日期还没有卡片，创建一个无bonus的卡片
      if (!dateMap[dateStr]) {
        const day = date.date();
        const dayName = date.format('dddd');
        const month = date.format('MMMM');

        cards.push({
          date: date.toDate(),
          day,
          dayName,
          month,
          isActive: false,
          claimAmount: '0.00',
          totalAmount: '0.00',
          completed: 0,
          bonuses: [], // 空数组，表示没有bonus
          hasBonus: false,
        });
      }
    }

    // 按日期排序
    cards.sort((a, b) => a.date.getTime() - b.date.getTime());

    console.log('Generated date cards from API data:', cards);
    setDateCards(cards);

    // 设置默认选中今天的卡片
    const todayIndex = cards.findIndex((card) => dayjs(card.date).isSame(today, 'day'));
    if (todayIndex !== -1) {
      setSelectedDateIndex(todayIndex);
    } else if (cards.length > 0) {
      setSelectedDateIndex(0);
    }
  };

  // 处理并更新可领取的calendar bonus总额
  useEffect(() => {
    if (calendarBonus) {
      const groupedBonus = parseCalendarBonus(calendarBonus);

      // 计算所有可领取的bonus总额 (已开始但未结束的)
      const now = dayjs();
      const totalClaimable = Object.values(groupedBonus)
        .filter((bonus: any) => {
          return (
            bonus.status === 0 &&
            bonus.handle_status === 0 &&
            dayjs(bonus.start_time * 1000).isBefore(now) &&
            dayjs(bonus.end_time * 1000).isAfter(now)
          );
        })
        .reduce((sum: number, bonus: any) => sum + parseFloat(bonus.amount), 0)
        .toFixed(2);

      setTotalClaimableCalendarBonus(totalClaimable);

      // 计算所有未领取的bonus总额 (包括未开始的)
      const totalPoolAmount = Object.values(groupedBonus)
        .filter((bonus: any) => {
          return bonus.status === 0 && bonus.handle_status === 0;
        })
        .reduce((sum: number, bonus: any) => sum + parseFloat(bonus.amount), 0)
        .toFixed(2);

      setTotalBonusPoolAmount(totalPoolAmount);

      // 找到未领取的奖励中最早将要过期的那个
      const unclaimedBonuses = Object.values(groupedBonus).filter((bonus: any) => {
        return (
          bonus.status === 0 &&
          bonus.handle_status === 0 &&
          dayjs(bonus.start_time * 1000).isBefore(now) &&
          dayjs(bonus.end_time * 1000).isAfter(now)
        );
      });

      if (unclaimedBonuses.length > 0) {
        // 按结束时间排序，找到最早将要过期的
        unclaimedBonuses.sort((a: any, b: any) => a.end_time - b.end_time);
        const earliestToExpire = unclaimedBonuses[0] as any;

        // 保存即将过期的bonus金额
        setExpiringBonusAmount(earliestToExpire.amount.toString());

        // 计算距离过期的时间
        const expireTime = dayjs(earliestToExpire.end_time * 1000);
        const diff = expireTime.diff(now, 'second');

        if (diff > 0) {
          const days = Math.floor(diff / (24 * 60 * 60));
          const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
          const minutes = Math.floor((diff % (60 * 60)) / 60);
          const seconds = diff % 60;

          setDepositBonusTimeLeft({ days, hours, minutes, seconds });
        }
      }
    }
  }, [calendarBonus]);

  // 更新为每秒计算一次depositBonusTimeLeft
  useEffect(() => {
    if (calendarBonus) {
      // 设置一个定时器每秒减少一次倒计时
      const timer = setInterval(() => {
        setDepositBonusTimeLeft((prev) => {
          // 计算总秒数
          let totalSeconds = prev.days * 24 * 60 * 60 + prev.hours * 60 * 60 + prev.minutes * 60 + prev.seconds - 1;

          if (totalSeconds <= 0) {
            // 如果倒计时结束，清除定时器并返回全零状态
            clearInterval(timer);
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
          }

          // 重新计算各个时间单位
          const days = Math.floor(totalSeconds / (24 * 60 * 60));
          const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
          const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
          const seconds = totalSeconds % 60;

          return { days, hours, minutes, seconds };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [calendarBonus]);

  useEffect(() => {
    if (calendarBonus) {
      const groupedBonus = parseCalendarBonus(calendarBonus);
      const dateGroupedBonus = groupBonusByDate(groupedBonus);

      // 处理日期卡片数据
      generateDateCards(dateGroupedBonus);
    }
  }, [calendarBonus]);

  // 处理日期卡片变化
  const handleDateChange = (index: number) => {
    setSelectedDateIndex(index);
  };

  // Scroll to today's date when component mounts, but only once
  useEffect(() => {
    // Wait for carousel to be initialized and dateCards to be populated
    if (dateCards.length > 0 && !hasInitialScroll) {
      // Scroll to today's date (middle card, index 3)
      setTimeout(() => {
        if (carouselRef.current?.scrollTo) {
          carouselRef.current.scrollTo(3);
          setHasInitialScroll(true);
        }
      }, 100);
    }
  }, [carouselRef.current, dateCards.length, hasInitialScroll]);

  // 处理领取日历奖励
  const handleClaimCalendarBonus = async () => {
    try {
      await calendarClaim();
      toast.success(t('toast:calendarBonusClaimedSuccessfully'));

      // 领取成功后刷新日历奖励数据
      queryClient.invalidateQueries({ queryKey: ['calendarBonus'] });
    } catch (error) {
      console.error(error);
      toast.error(t('toast:calendarBonusClaimFailed'));
    }
  };

  // 检查今天是否有可领取的奖励
  const hasTodayClaimableBonus = useMemo(() => {
    const todayCard = dateCards.find((card) => dayjs(card.date).isSame(dayjs(), 'day'));
    if (!todayCard) return false;

    return todayCard.bonuses.some(
      (bonus) =>
        bonus.status === 0 &&
        bonus.handle_status === 0 &&
        dayjs(bonus.start_time * 1000).isBefore(dayjs()) &&
        dayjs(bonus.end_time * 1000).isAfter(dayjs()),
    );
  }, [dateCards]);

  // 生成日期卡片组件
  const renderDateCard = useCallback(
    (card: (typeof dateCards)[0], index: number) => {
      const isToday = dayjs(card.date).isSame(dayjs(), 'day');
      const isTomorrow = dayjs(card.date).isSame(dayjs().add(1, 'day'), 'day');

      // 计算已领取的金额
      const claimedAmount = card.bonuses
        .filter((bonus) => bonus.status === 1)
        .reduce((sum, bonus) => sum + parseFloat(bonus.amount), 0)
        .toFixed(2);

      // 检查是否应该显示倒计时（今天没有可领取的奖励且是明天的卡片）
      const shouldShowCountdown = !hasTodayClaimableBonus && isTomorrow && card.bonuses.length > 0;

      return (
        <div
          key={`date-card-${index}`}
          className={`bg-base-100 border-${isToday ? 'primary' : 'base-100'} flex w-full flex-col gap-3 rounded-xl border px-2 py-3`}
        >
          <div className="flex items-center gap-3">
            <div className="bg-base-200 flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold">
              {card.day}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-content text-sm font-bold">{card.dayName}</p>
              <p className="text-neutral-content text-xs">{card.month}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            {/* 显示最多3个奖励图标，如果不足3个则使用空图标填充 */}
            {Array.from({ length: 3 }).map((_, i) => {
              const bonus = card.bonuses[i];
              const isClaimed = bonus && bonus.status === 1;

              // 如果是第一个奖励，且应该显示倒计时
              const isFirstBonusWithCountdown = i === 0 && shouldShowCountdown;
              const isExpired = bonus && bonus.status === 0 && dayjs(bonus.end_time * 1000).isBefore(dayjs());
              const isFuture = bonus && bonus.status === 0 && dayjs(bonus.start_time * 1000).isAfter(dayjs());
              const isAvailable = bonus && bonus.status === 0 && !isExpired && !isFuture;

              // 计算倒计时（用于今天的未来奖励或明天的第一个奖励）
              const showCountdown = (isToday && isFuture && bonus) || (isFirstBonusWithCountdown && i === 0 && bonus);
              
              if (showCountdown) {
                // 使用bonus的ID作为唯一标识
                const countdownKey = `${index}-${i}-${bonus.id}`;
                
                return (
                  <CountdownDisplay 
                    key={`countdown-${countdownKey}`}
                    targetTime={bonus.start_time * 1000}
                  />
                );
              }

              return (
                <div
                  key={`gift-${index}-${i}`}
                  className={`${isClaimed ? 'bg-secondary' : isExpired ? 'bg-base-300' : isAvailable ? 'bg-secondary bg-opacity-30' : 'bg-base-200'} flex min-h-6 min-w-6 items-center justify-center rounded-full`}
                >
                  {isClaimed ? (
                    // 已领取的奖励显示对勾图标
                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.0004 4.36333L6.17398 11.5L2 7.32602L3.90615 5.41987L6.13115 7.64487L11.0523 2.5L13.0004 4.36333Z"
                        fill="#E7FB78"
                        fillOpacity="0.8"
                      />
                    </svg>
                  ) : isExpired ? (
                    // 已过期但未领取的奖励显示时钟图标
                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.50002 12.6004C10.5928 12.6004 13.1 10.0932 13.1 7.00039C13.1 3.9076 10.5928 1.40039 7.50002 1.40039C4.40723 1.40039 1.90002 3.9076 1.90002 7.00039C1.90002 10.0932 4.40723 12.6004 7.50002 12.6004ZM8.25002 3.50039C8.25002 3.08618 7.91424 2.75039 7.50002 2.75039C7.08581 2.75039 6.75002 3.08618 6.75002 3.50039V7.00039C6.75002 7.4146 7.08581 7.75039 7.50002 7.75039H10.3C10.7142 7.75039 11.05 7.4146 11.05 7.00039C11.05 6.58618 10.7142 6.25039 10.3 6.25039H8.25002V3.50039Z"
                        fill="#F55F71"
                        style={{ fill: '#F55F71' }}
                      />
                    </svg>
                  ) : isAvailable ? (
                    // 可领取但未领取的奖励显示礼物图标
                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.3002 4.20039C10.5198 3.90791 10.65 3.54435 10.65 3.15039C10.65 2.18389 9.86653 1.40039 8.90003 1.40039C8.32757 1.40039 7.8193 1.67526 7.50002 2.10022C7.18074 1.67526 6.67249 1.40039 6.10002 1.40039C5.13353 1.40039 4.35002 2.18389 4.35002 3.15039C4.35002 3.54435 4.48021 3.90791 4.6999 4.20039H2.77502C2.29178 4.20039 1.90002 4.59214 1.90002 5.07539V5.42539C1.90002 5.90864 2.29178 6.30039 2.77502 6.30039H6.97502V4.20039H8.02502V6.30039H12.225C12.7083 6.30039 13.1 5.90864 13.1 5.42539V5.07539C13.1 4.59214 12.7083 4.20039 12.225 4.20039H10.3002ZM9.60003 3.15039C9.60003 3.53699 9.28663 3.85039 8.90003 3.85039H8.20003L8.20003 3.15039C8.20003 2.76379 8.51343 2.45039 8.90003 2.45039C9.28663 2.45039 9.60003 2.76379 9.60003 3.15039ZM5.40002 3.15039C5.40002 3.53699 5.71343 3.85039 6.10002 3.85039H6.80002V3.15039C6.80002 2.76379 6.48662 2.45039 6.10002 2.45039C5.71343 2.45039 5.40002 2.76379 5.40002 3.15039Z"
                        fill="#E7FB78"
                        fillOpacity="0.8"
                      />
                      <path
                        d="M6.97502 7.35039H2.60002V10.6754C2.60002 11.7385 3.46188 12.6004 4.52502 12.6004H6.97502V7.35039Z"
                        fill="#E7FB78"
                        fillOpacity="0.8"
                      />
                      <path
                        d="M8.02502 12.6004V7.35039H12.4V10.6754C12.4 11.7385 11.5382 12.6004 10.475 12.6004H8.02502Z"
                        fill="#E7FB78"
                        fillOpacity="0.8"
                      />
                    </svg>
                  ) : (
                    // 不可用的奖励位置显示灰色礼物图标
                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.50002 12.6004C10.5928 12.6004 13.1 10.0932 13.1 7.00039C13.1 3.9076 10.5928 1.40039 7.50002 1.40039C4.40723 1.40039 1.90002 3.9076 1.90002 7.00039C1.90002 10.0932 4.40723 12.6004 7.50002 12.6004ZM8.25002 3.50039C8.25002 3.08618 7.91424 2.75039 7.50002 2.75039C7.08581 2.75039 6.75002 3.08618 6.75002 3.50039V7.00039C6.75002 7.4146 7.08581 7.75039 7.50002 7.75039H10.3C10.7142 7.75039 11.05 7.4146 11.05 7.00039C11.05 6.58618 10.7142 6.25039 10.3 6.25039H8.25002V3.50039Z"
                        fill="#A6ADBB"
                        style={{ fill: '#A6ADBB' }}
                      />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs">
            {card.hasBonus ? (
              <>
                <span>
                  <CurrencyDisplay amountInUSD={claimedAmount} showSymbol={false} /> /{' '}
                </span>
                <span className="text-accent-content/80">
                  <CurrencyDisplay amountInUSD={card.totalAmount} />
                </span>
              </>
            ) : (
              <span className="text-neutral-content/60">No bonus</span>
            )}
          </p>
        </div>
      );
    },
    [selectedDateIndex],
  );

  return (
    <div
      className="flex flex-col gap-2 rounded-lg p-4"
      style={{
        background:
          'radial-gradient(162.46% 157.05% at 0% 0%, rgba(85, 67, 135, 0.4) 0%, rgba(51, 51, 51, 0.08) 100%) , #1B232B',
      }}
    >
      <div className="relative flex items-center gap-4 pr-4">
        <div className="absolute top-0 right-0" onClick={() => setIsOpenCalendarInfoPopup(true)}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.875 1.75C3.59683 1.75 1.75 3.59683 1.75 5.875C1.75 8.15317 3.59683 10 5.875 10C8.15317 10 10 8.15317 10 5.875C10 3.59683 8.15317 1.75 5.875 1.75ZM1 5.875C1 3.18261 3.18261 1 5.875 1C8.56739 1 10.75 3.18261 10.75 5.875C10.75 8.56739 8.56739 10.75 5.875 10.75C3.18261 10.75 1 8.56739 1 5.875ZM5.5 4C5.5 3.79289 5.66789 3.625 5.875 3.625H5.87875C6.08586 3.625 6.25375 3.79289 6.25375 4V4.00375C6.25375 4.21086 6.08586 4.37875 5.87875 4.37875H5.875C5.66789 4.37875 5.5 4.21086 5.5 4.00375V4ZM5.35304 5.15422C5.92616 4.86766 6.57146 5.38531 6.41606 6.00694L6.06155 7.42496L6.08229 7.41459C6.26753 7.32197 6.49278 7.39705 6.58541 7.58229C6.67803 7.76753 6.60295 7.99278 6.41771 8.08541L6.39697 8.09578C5.82385 8.38234 5.17854 7.86469 5.33394 7.24306L5.68845 5.82504L5.66771 5.83541C5.48246 5.92803 5.25721 5.85295 5.16459 5.66771C5.07197 5.48246 5.14705 5.25721 5.33229 5.16459L5.35304 5.15422Z"
              fill="#A6ADBB"
              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
            />
          </svg>
        </div>
        <img src="/icons/isometric/28.svg" className="h-15 w-15" />
        <div className="flex flex-col">
          <p className="text-neutral-content text-base font-bold">{t('bonus:bonus_calendar')}</p>
          <p className="mt-1 text-sm leading-relaxed">
            <span className="text-secondary-content/80">{t('bonus:claim_every_8_hours')}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <p className="text-sm">{t('bonus:bonus_pool')}</p>
          <p className="text-sm">{formatCurrency(totalBonusPoolAmount, { includeSymbol: true })}</p>
        </div>

        <div className="flex w-full items-center gap-1">
          <label className="input flex-1 bg-[#1D232A]/70">
            <img src="/icons/isometric/5.svg" className="h-4 w-4" />
            <input
              type="search"
              className="flex-1 grow text-base font-bold"
              placeholder=""
              readOnly
              value={formatCurrency(totalClaimableCalendarBonus, { includeSymbol: true })}
            />
          </label>
          <button
            className="btn btn-secondary px-3 text-sm font-semibold"
            onClick={() => handleClaimCalendarBonus()}
            disabled={parseFloat(totalClaimableCalendarBonus) <= 0}
          >
            {t('bonus:claim')}
          </button>
        </div>
      </div>

      {depositBonusTimeLeft.days > 0 ||
        depositBonusTimeLeft.hours > 0 ||
        (depositBonusTimeLeft.minutes > 0 && (
          <div className="text-neutral-content flex items-center justify-center gap-1 text-center text-xs font-bold">
            <p className="flex items-center gap-1 font-normal">
              <span className="text-primary font-semibold">
                {formatCurrency(expiringBonusAmount, { includeSymbol: true })}
              </span>
              {t('bonus:expires_in')}
            </p>
            <div className="flex items-center justify-center gap-1">
              {depositBonusTimeLeft.days > 0 && (
                <div>
                  <span className="countdown font-mono">
                    <span style={{ '--value': depositBonusTimeLeft.days } as React.CSSProperties} aria-live="polite">
                      {formatTime(depositBonusTimeLeft.days)}
                    </span>
                  </span>
                  d&nbsp;
                </div>
              )}
              <div>
                <span className="countdown font-mono">
                  <span style={{ '--value': depositBonusTimeLeft.hours } as React.CSSProperties} aria-live="polite">
                    {formatTime(depositBonusTimeLeft.hours)}
                  </span>
                </span>
                h
              </div>
              <div>
                <span className="countdown font-mono">
                  <span style={{ '--value': depositBonusTimeLeft.minutes } as React.CSSProperties} aria-live="polite">
                    {formatTime(depositBonusTimeLeft.minutes)}
                  </span>
                </span>
                m
              </div>
              <div>
                <span className="countdown font-mono">
                  <span style={{ '--value': depositBonusTimeLeft.seconds } as React.CSSProperties} aria-live="polite">
                    {formatTime(depositBonusTimeLeft.seconds)}
                  </span>
                </span>
                s
              </div>
            </div>
          </div>
        ))}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-base font-bold">{t('bonus:release_schedule')}</p>
          <div className="join">
            <button className="btn btn-xs join-item" onClick={() => carouselRef.current?.scrollPrev()}>
              <svg
                className="fill-base-content"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 256 256"
              >
                <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
              </svg>
            </button>
            <button className="btn btn-xs join-item" onClick={() => carouselRef.current?.scrollNext()}>
              <svg
                className="fill-base-content"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 256 256"
              >
                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
              </svg>
            </button>
          </div>
        </div>

        <Carousel
          ref={carouselRef}
          autoplay={false}
          showNavigation={false}
          showDots={false}
          options={{
            loop: false,
            align: 'start',
            containScroll: 'trimSnaps',
            startIndex: 3, // Start at today's card (index 3)
          }}
          onChange={handleDateChange}
          className="w-full"
        >
          <div className="flex w-full items-center" style={{ gap: '8px' }}>
            {dateCards.map((card, index) => (
              <div
                key={`carousel-item-${index}`}
                className="flex-[0_0_calc(50%_-_4px)] px-[1px]"
                onClick={() => {
                  // 检查是否是可见的两个卡片中的第一个
                  const visibleIndex = selectedDateIndex;
                  if (index === visibleIndex) {
                    // 第一个可见卡片，向前滑动
                    if (visibleIndex > 0) {
                      carouselRef.current?.scrollPrev();
                    }
                  } else if (index === visibleIndex + 1) {
                    // 第二个可见卡片，向后滑动
                    if (visibleIndex < dateCards.length - 2) {
                      carouselRef.current?.scrollNext();
                    }
                  }
                }}
              >
                {renderDateCard(card, index)}
              </div>
            ))}
          </div>
        </Carousel>
      </div>

      {isOpenCalendarInfoPopup && (
        <PopupCalendar open={isOpenCalendarInfoPopup} onClose={() => setIsOpenCalendarInfoPopup(false)} />
      )}
    </div>
  );
};
