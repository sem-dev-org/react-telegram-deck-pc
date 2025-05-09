import { useGetConquests } from '@/query/bonus';
import { IConquest } from '@/types/bonus';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConquestBaccarat from './conquests/ConquestBaccarat';
import ConquestBlackjack from './conquests/ConquestBlackjack';
import ConquestGameShow from './conquests/ConquestGameShow';
import ConquestRoulette from './conquests/ConquestRoulette';
import ConquestSlots from './conquests/ConquestSlots';
import ConquestWager from './conquests/ConquestWager';
import ConquestWin from './conquests/ConquestWin';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';

// 初始化 dayjs UTC 插件
dayjs.extend(utc);

type ConquestKey = keyof typeof CONQUESTS_KEY_COMPONENT_MAP;

const CONQUESTS_KEY_COMPONENT_MAP = {
  conquest_just_wager_on_100: ConquestWager,
  conquest_just_wager_on_200: ConquestWager,
  conquest_roulette_master: ConquestRoulette,
  conquest_blackjack_master: ConquestBlackjack,
  conquest_baccarat_master: ConquestBaccarat,
  conquest_gameshow_master: ConquestGameShow,
  conquest_gameshow_master_20: ConquestGameShow,
  conquest_roulette_master_30: ConquestRoulette,
  conquest_blackjack_master_40: ConquestBlackjack,
  conquest_baccarat_master_50: ConquestBaccarat,
  conquest_big_win: ConquestWin,
  conquest_huge_win: ConquestWin,
  conquest_massive_win: ConquestWin,
  conquest_slots_master_10: ConquestSlots,
};

// Type guard function to check if a key exists in the map
const isValidConquestKey = (key: string): key is ConquestKey => {
  return key in CONQUESTS_KEY_COMPONENT_MAP;
};

export const TabContentConquests = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 使用 useRef 存储过期时间和倒计时值
  const expiryValueRef = useRef<number>(0);
  const hoursRef = useRef<number>(0);
  const minutesRef = useRef<number>(0);
  const secondsRef = useRef<number>(0);

  const [activeConquest, setActiveConquest] = useState<
    {
      component: any;
      conquest: IConquest;
    }[]
  >([]);

  // 使用 useState 仅用于触发重新渲染
  const [, setForceUpdate] = useState<number>(0);

  // 只调用一次的 API 查询
  const { data: conquests } = useGetConquests();

  // 临时使用变量以避免警告，后续将用于渲染任务列表
  useEffect(() => {
    if (conquests) {
      console.log(conquests);
      conquests.map((conquest) => {
        if (conquest.is_daily > 0 && isValidConquestKey(conquest.key)) {
          console.log(conquest);
          setActiveConquest((prev) => [
            ...prev,
            { component: CONQUESTS_KEY_COMPONENT_MAP[conquest.key as ConquestKey], conquest },
          ]);
        }
      });
    }
  }, [conquests]);

  // 计算倒计时值的函数
  const calculateTimeLeft = useCallback(() => {
    const now = dayjs().valueOf();
    const diff = expiryValueRef.current - now;

    if (diff > 0) {
      hoursRef.current = Math.floor((diff / (1000 * 60 * 60)) % 24);
      minutesRef.current = Math.floor((diff / (1000 * 60)) % 60);
      secondsRef.current = Math.floor((diff / 1000) % 60);

      // 强制重新渲染
      setForceUpdate((prev) => prev + 1);

      // 每秒更新一次
      setTimeout(calculateTimeLeft, 1000);
    }
  }, []);

  useEffect(() => {
    // 计算UTC 0点的时间戳（毫秒）
    expiryValueRef.current = dayjs().utc().endOf('day').add(1, 'second').valueOf();

    // 开始倒计时
    calculateTimeLeft();
  }, [calculateTimeLeft]);

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-base-300 flex items-center justify-between rounded-xl border-[#333333]/20 p-4">
        <div className="flex flex-col gap-2">
          <p className="text-primary/80 text-lg font-bold">{dayjs().format('dddd DD MMMM')}</p>
          <p className="text-neutral-content flex items-center gap-1 text-xs font-bold">
            Expires in
            <span className="countdown font-mono">
              <span style={{ '--value': hoursRef.current } as React.CSSProperties}></span>h
              <span style={{ '--value': minutesRef.current } as React.CSSProperties}></span>m
              <span style={{ '--value': secondsRef.current } as React.CSSProperties}></span>s
            </span>
          </p>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`${paths.main.transaction.root}?tab=transaction`)}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.00002 12.6004C10.0928 12.6004 12.6 10.0932 12.6 7.00039C12.6 3.9076 10.0928 1.40039 7.00002 1.40039C3.90723 1.40039 1.40002 3.9076 1.40002 7.00039C1.40002 10.0932 3.90723 12.6004 7.00002 12.6004ZM7.75002 3.50039C7.75002 3.08618 7.41424 2.75039 7.00002 2.75039C6.58581 2.75039 6.25002 3.08618 6.25002 3.50039V7.00039C6.25002 7.4146 6.58581 7.75039 7.00002 7.75039H9.80002C10.2142 7.75039 10.55 7.4146 10.55 7.00039C10.55 6.58618 10.2142 6.25039 9.80002 6.25039H7.75002V3.50039Z"
              fill="#A6ADBB"
            />
          </svg>
          <p className="text-neutral-content text-xs">{t('common.history')}</p>
        </button>
      </div>

      {activeConquest.map((conquest) => (
        <conquest.component key={conquest.conquest.id} conquest={conquest.conquest} />
      ))}
    </div>
  );
};
