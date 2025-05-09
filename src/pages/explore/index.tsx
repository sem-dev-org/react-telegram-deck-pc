import { FullBleedContainer, Page, SafeContent, SelectDropdown } from '@/components/ui';
import { SearchInput } from '@/components/ui/SearchInput';
import { useEffect, useMemo, useState, forwardRef, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getGameList } from '@/api/explore';
import { TabBtn } from '@/components/ui/TabBtn';
import clsx from 'clsx';

import { VirtuosoGrid } from 'react-virtuoso';
import React from 'react';
import { GameImage } from '@/components/ui/GameImage';
import { QueryProvider } from '@/query/provider';
import { getTabOne, getTabTwo, getTabThree, getOptions } from '@/_mock/explore';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth';
import { getUserGameList } from '@/api/casino';
import { paths } from '@/routes/paths';
import { CasinoGamesRowList } from '@/sections/casino/CasinoGamesRowList';
import { useTranslation } from 'react-i18next';

// Wrap the component with React.memo to prevent unnecessary re-renders
const GameListContent = React.memo(
  ({
    searchValue,
    activeTab,
    sortBy,
    selectedProviders,
  }: {
    searchValue: string;
    activeTab: string;
    sortBy: string;
    selectedProviders: string[];
    sortByRef: React.RefObject<any>;
    setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const { t } = useTranslation();
    // const [data, setData] = useState<IGame[]>([]);
    // const [totalCount, setTotalCount] = useState<number | null>(null);
    // const [page, setPage] = useState<number>(1);
    // const [isLoading, setIsLoading] = useState(false);

    // Reset state when search criteria change
    // useEffect(() => {
    //   setData([]);
    //   setPage(1);
    //   setTotalCount(null);
    // }, [searchValue, activeTab, sortBy, selectedProviders]);

    // const getGameListFun = useCallback(async () => {
    //   if (totalCount === data.length || isLoading) return;
    //   setIsLoading(true);
    //   try {
    //     const res = await getGameList({
    //       limit: 30,
    //       page: page,
    //       keyword: searchValue,
    //       type: activeTab,
    //       sort: sortBy,
    //       providers: selectedProviders.join(','),
    //     });
    //     if (res.data !== null) {
    //       setData((prev) => [...prev, ...res.data]);
    //       setPage((prev) => prev + 1);
    //     }
    //     if (res.count !== null) {
    //       setTotalCount(res.count);
    //     }
    //   } catch (error) {
    //     console.error('Failed to fetch get list:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }, [totalCount, data.length, page, isLoading, searchValue, activeTab, sortBy, selectedProviders]);

    // Fetch initial data whenever data is empty
    // useEffect(() => {
    //   if (data.length === 0 && !isLoading) {
    //     getGameListFun();
    //   }
    // }, [data.length, getGameListFun, isLoading]);

    const navigate = useNavigate();
    const { user } = useAuth();

    // Create a ref to store the scroller element
    const scrollerElementRef = useRef<HTMLElement | null>(null);
    // Add a ref to track the timeout

    // Handle scroll event with proper cleanup and debouncing
    // useEffect(() => {
    //   const currentRef = scrollerElementRef.current;
    //   if (!currentRef) return;

    //   const handleScroll = () => {
    //     // Clear any existing timeout
    //     if (scrollTimeoutRef.current) {
    //       clearTimeout(scrollTimeoutRef.current);
    //     }

    //     // Only set isScroll to true if it's not already true
    //     if (!isScroll) {
    //       setIsScroll(true);
    //     }

    //     // Set a timeout to reset isScroll after scrolling has stopped
    //     scrollTimeoutRef.current = setTimeout(() => {
    //       setIsDropdownOpen(false);
    //       sortByRef.current?.handleOpenChange(false);
    //       setIsScroll(false);
    //     }, 150);
    //   };

    //   currentRef.addEventListener('scroll', handleScroll);

    //   return () => {
    //     if (scrollTimeoutRef.current) {
    //       clearTimeout(scrollTimeoutRef.current);
    //     }
    //     currentRef.removeEventListener('scroll', handleScroll);
    //   };
    // }, [isScroll, setIsDropdownOpen, sortByRef]);
    const [userGameList, setUserGameList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();
    const { status } = useAuth();

    const isLiked = useMemo(
      () => (id: string) => {
        return status?.favorites_game?.includes(id);
      },
      [status],
    );

    useEffect(() => {
      if ((activeTab === 'recent' || activeTab === 'favorites') && user) {
        setIsLoading(true);
        getUserGameList({
          type: activeTab,
          keyword: searchValue,
          providers: selectedProviders.join(','),
          sort: sortBy,
        })
          .then((res) => {
            if (res.code === 0 && res.data !== null) {
              setUserGameList(res.data);
            } else {
              setUserGameList([]);
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }, [activeTab, user, searchValue, selectedProviders, sortBy]);

    const { data, fetchNextPage, isFetching, refetch } = useInfiniteQuery({
      queryKey: ['GameList'],
      queryFn: ({ pageParam = 1 }) =>
        getGameList({
          limit: 30,
          page: pageParam,
          keyword: searchValue,
          type: activeTab,
          sort: sortBy,
          providers: selectedProviders.join(','),
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.code !== 0) {
          return undefined;
        }
        if (lastPage.data?.length > 0) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      enabled: activeTab !== 'recent' && activeTab !== 'favorites',
    });

    useEffect(() => {
      if ((activeTab === 'recent' || activeTab === 'favorites') && user) {
        queryClient.resetQueries({ queryKey: ['GameList'] });
      } else {
        queryClient.resetQueries({ queryKey: ['GameList'] });
        refetch();
      }
    }, [searchValue, activeTab, sortBy, selectedProviders, refetch, user]);

    const allItems = useMemo(() => {
      return (
        data?.pages.filter((page) => page.code === 0 && Array.isArray(page.data)).flatMap((page) => page.data || []) ||
        []
      );
    }, [data]);

    return (
      <div className="relative h-full flex-1 px-3 pb-3">
        <VirtuosoGrid
          style={{ height: '100%' }}
          data={activeTab !== 'recent' && activeTab !== 'favorites' ? allItems : userGameList}
          components={gridComponents}
          endReached={() => fetchNextPage()}
          scrollerRef={(ref) => {
            if (ref) {
              scrollerElementRef.current = ref;
            }
          }}
          itemContent={(_, item) => (
            <ItemWrapper>
              <div
                key={item.id}
                onClick={() => navigate(`${paths.main.game.details}${item.game_id}/${item.game_provider}`)}
                className="relative h-full w-full"
              >
                {/* <img
                src={imgUrl(item.game_id || '')}
                alt={item.game_name}
                className="w-full rounded-2xl object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://tg.b03test.xyz/backend/image/img_v3_02k9_ac1d9fa0-5ee6-4871-9706-a70f7bf139hu.png';
                  e.currentTarget.onerror = null; // prevents infinite loop if default image also fails
                }}
              /> */}
                <GameImage className="h-full w-full rounded-2xl object-cover" game={item} />
                {/* <div className="bg-base-100 absolute top-2 right-2 z-10 flex items-center gap-1 rounded-lg px-2 py-1 opacity-80">
                  <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_2116_2535)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.12502 2.82617C3.12502 1.79064 3.96448 0.951172 5.00002 0.951172C6.03555 0.951172 6.87502 1.79064 6.87502 2.82617C6.87502 3.86171 6.03555 4.70117 5.00002 4.70117C3.96448 4.70117 3.12502 3.86171 3.12502 2.82617Z"
                        fill="currentColor"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.56303 8.70339C1.59526 6.83266 3.12168 5.32617 5.00002 5.32617C6.8784 5.32617 8.40484 6.83273 8.437 8.70353C8.43913 8.82759 8.36765 8.94117 8.25487 8.99292C7.26365 9.44775 6.16107 9.70117 5.00015 9.70117C3.83912 9.70117 2.73645 9.44771 1.74515 8.9928C1.63237 8.94104 1.5609 8.82746 1.56303 8.70339Z"
                        fill="currentColor"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2116_2535">
                        <rect width="10" height="10" fill="white" transform="translate(0 0.326172)" />
                      </clipPath>
                    </defs>
                  </svg>

                  <p className="text-xs font-bold">{item.user_count}</p>
                </div> */}
                {status && (
                  <div
                    className="absolute top-0 right-0 z-10 flex h-6 w-10 items-center justify-center rounded-tr-2xl rounded-bl-2xl"
                    style={{
                      background: 'color(display-p3 0.165 0.196 0.235 / 0.8)',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5.7929 11.0065L5.78909 11.0044L5.77588 10.9973C5.76462 10.9912 5.74853 10.9823 5.72792 10.9708C5.6867 10.9478 5.62739 10.9142 5.55256 10.8701C5.40296 10.7821 5.19102 10.6525 4.93749 10.484C4.43127 10.1475 3.75488 9.65282 3.07668 9.02061C1.73456 7.76949 0.3125 5.91074 0.3125 3.62109C0.3125 1.91306 1.7496 0.558594 3.48437 0.558594C4.50456 0.558594 5.41802 1.02473 6 1.75536C6.58198 1.02473 7.49544 0.558594 8.51562 0.558594C10.2504 0.558594 11.6875 1.91306 11.6875 3.62109C11.6875 5.91074 10.2654 7.76949 8.92332 9.02061C8.24512 9.65282 7.56873 10.1475 7.06251 10.484C6.80898 10.6525 6.59704 10.7821 6.44744 10.8701C6.37261 10.9142 6.3133 10.9478 6.27208 10.9708C6.25147 10.9823 6.23538 10.9912 6.22412 10.9973L6.21091 11.0044L6.2071 11.0065L6.20549 11.0073C6.07718 11.0755 5.92282 11.0755 5.79451 11.0073L5.7929 11.0065Z"
                        fill={isLiked(String(item.id)) ? '#FF506E' : '#A6ADBB'}
                        style={{
                          fill: isLiked(String(item.id)) ? '#FF506E' : '#A6ADBB',
                          fillOpacity: 1,
                        }}
                      />
                    </svg>
                  </div>
                )}
              </div>
            </ItemWrapper>
          )}
        />
        {isFetching ||
          (isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="loading loading-spinner loading-xl text-primary" />
            </div>
          ))}

        {activeTab !== 'recent' && activeTab !== 'favorites' && !isFetching && allItems.length === 0 && (
          <>
            <div className="absolute top-1/5 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
              <img src="/images/empty.png" className="h-23.5 w-23.5" />
              {searchValue === '' ? (
                <div className="text-center text-xs leading-5 font-bold">{t('explore:oopsThereIsNoDataYet')}</div>
              ) : (
                <div className="text-center text-xs leading-5 font-bold">
                  {t('explore:noResultsFound')} <br />
                  {t('explore:trySearchingWithDifferentKeywords')}
                </div>
              )}
            </div>
          </>
        )}
        {(activeTab === 'recent' || activeTab === 'favorites') && !isLoading && userGameList.length === 0 && (
          <>
            <div className="absolute top-1/5 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
              <img src="/images/empty.png" className="h-23.5 w-23.5" />
              {searchValue === '' ? (
                <div className="text-center text-xs leading-5 font-bold">{t('explore:OopsThereIsNoDataYet')}</div>
              ) : (
                <div className="text-center text-xs leading-5 font-bold">
                  {t('explore:No results found')} <br />
                  {t('explore:Try searching with different keywords')}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  },
);

const gridComponents = {
  List: forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties; children?: React.ReactNode }
  >(({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{
        ...style,
      }}
      className="grid grid-cols-3 gap-2"
    >
      {children}
    </div>
  )),
  Item: ({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props} className="aspect-[3/4]">
      {children}
    </div>
  ),
};

const ItemWrapper = ({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className="h-full w-full">
    {children}
  </div>
);

export default function ExplorePage() {
  const { t } = useTranslation();
  const allProvidersOption = { id: 'all', name: t('explore:allProviders') };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');
  const provider = searchParams.get('provider');

  const { user } = useAuth();
  const tabs = user ? getTabOne(t).concat(getTabTwo(t)).concat(getTabThree(t)) : getTabOne(t).concat(getTabThree(t));

  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    setActiveTab(category ? (tabs.find((c: { id: string }) => c.id === category)?.id ?? tabs[0].id) : tabs[0].id);
  }, [category]);

  const [sortBy, setSortBy] = useState<string>('popular');
  // 修改为数组，支持多选，默认选中"All"
  const [selectedProviders, setSelectedProviders] = useState<string[]>([provider ? provider : 'all']);

  // const sortByRef = useRef<HTMLDetailsElement>(null);
  // const gameProviderRef = useRef<HTMLDetailsElement>(null);

  // const handleSortBy = (value: string) => {
  //   setSortBy(value);
  //   if (sortByRef.current) {
  //     sortByRef.current.open = false;
  //   }
  // };

  // 修改游戏提供商处理函数，支持多选
  const handleGameProvider = (value: string) => {
    setSelectedProviders((prev) => {
      // 如果选择了"All"
      if (value === 'all') {
        return ['all'];
      }

      // 如果当前已选中"All"，并选择了其他选项，则移除"All"
      if (prev.includes('all') && value !== 'all') {
        return [value];
      }

      // 如果已经选中了该选项，则取消选中
      if (prev.includes(value)) {
        const newSelected = prev.filter((name_en) => name_en !== value);
        // 如果取消选中后没有任何选项，则默认选中"All"
        return newSelected.length === 0 ? ['all'] : newSelected;
      }

      // 否则添加该选项
      return [...prev, value];
    });

    // 不自动关闭下拉框，允许用户继续选择
  };

  // const { data: gameProviderList } = useGetGameProviderList();
  const { gameProviderList } = QueryProvider();

  // 获取选中提供商的显示名称
  const selectedProvidersDisplay = useMemo(() => {
    if (selectedProviders.includes('all')) {
      return allProvidersOption.name;
    }

    // 查找并获取所有选中提供商的名称
    const selectedNames = selectedProviders
      .map((name_en) => gameProviderList?.find((provider) => provider.name_en?.toString() === name_en)?.name)
      .filter(Boolean);

    // 如果有多个提供商，返回格式化的字符串
    return `${selectedNames}`;
  }, [selectedProviders, gameProviderList]);

  // const games = useMemo(() => {
  //   // 根据选中的游戏提供商筛选游戏
  //   let filteredGames = mockGameGames;

  //   // 如果没有选择"All"，则按照选中的提供商筛选
  //   if (!selectedProviders.includes('all')) {
  //     filteredGames = mockGameGames.filter(
  //       (game) => game.provider && game.provider.id && selectedProviders.includes(game.provider.id.toString()),
  //     );
  //   }

  //   // 然后根据sortBy对筛选后的游戏进行排序
  //   return filteredGames.sort((a, b) => {
  //     switch (sortBy) {
  //       case 'Popular':
  //         // 按照在线玩家数量排序
  //         return (b.onlinePlayers || 0) - (a.onlinePlayers || 0);
  //       case 'New':
  //         // 按照是否为新游戏排序
  //         if (b.isNew && !a.isNew) return 1;
  //         if (!b.isNew && a.isNew) return -1;
  //         // 如果都是新游戏或都不是新游戏，则按照在线玩家数量排序
  //         return (b.onlinePlayers || 0) - (a.onlinePlayers || 0);
  //       case 'A - Z':
  //         // 按照游戏名称字母顺序排序
  //         return (a.name || '').localeCompare(b.name || '');
  //       case 'Z - A':
  //         // 按照游戏名称字母逆序排序
  //         return (b.name || '').localeCompare(a.name || '');
  //       case 'Newest':
  //         // 按照是否为新游戏排序，与New相同
  //         if (b.isNew && !a.isNew) return 1;
  //         if (!b.isNew && a.isNew) return -1;
  //         return (b.onlinePlayers || 0) - (a.onlinePlayers || 0);
  //       default:
  //         return 0;
  //     }
  //   });
  // }, [selectedProviders, sortBy]); // 更新依赖项

  const [searchValue, setSearchValue] = useState('');

  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    if (selectedProviders.includes('all') && activeTab === 'all' && sortBy === 'popular' && searchValue === '') {
      setIsSearch(false);
      return;
    }

    setIsSearch(true);

    //   getGameList({
    //     limit: 20,
    //     page: 1,
    //     keyword: searchValue,
    //     type: activeTab,
    //     sort: sortBy,
    //     providers: selectedProviders.join(','),
    //   }).then((res) => {
    //     setGames(res);
    //   });
  }, [activeTab, sortBy, selectedProviders, searchValue]);

  const sortByRef = useRef<any>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 添加点击外部关闭下拉框的逻辑
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownElement = document.querySelector('.dropdown');
      if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <FullBleedContainer>
      <SafeContent>
        <Page className="bg-base-300 flex !h-[calc(100vh-var(--safe-area-top))] flex-col">
          <div className="flex flex-col gap-2 p-3">
            <SearchInput
              value={searchValue}
              onChange={(value) => setSearchValue(value)}
              placeholder={t('common.search')}
              className="bg-base-200 border-none"
              size="lg"
            />
            <TabBtn tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="grid grid-cols-2 gap-2">
              <SelectDropdown
                options={getOptions(t)}
                value={sortBy}
                onChange={(value) => setSortBy(`${value}`)}
                className="text-sm"
              />

              <div className={clsx('dropdown', isDropdownOpen && 'dropdown-open')}>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  // tabIndex={0}
                  // role="button"
                  className="btn flex h-12 items-center justify-between"
                >
                  <p className="truncate text-sm font-semibold">{selectedProvidersDisplay}</p>
                  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.68414 5.7676C4.923 5.53792 5.30282 5.54537 5.5325 5.78423L8.5 8.93443L11.4675 5.78423C11.6972 5.54537 12.077 5.53792 12.3159 5.7676C12.5547 5.99727 12.5622 6.3771 12.3325 6.61596L8.9325 10.216C8.81938 10.3336 8.66321 10.4001 8.5 10.4001C8.33679 10.4001 8.18062 10.3336 8.0675 10.216L4.6675 6.61596C4.43782 6.3771 4.44527 5.99727 4.68414 5.7676Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <ul
                  // tabIndex={0}
                  className="menu dropdown-content bg-base-200 z-1 flex max-h-60 w-full flex-nowrap gap-1 overflow-y-auto rounded-lg p-2 text-sm shadow-sm"
                >
                  <li key="all">
                    <a
                      className={clsx(
                        'flex h-9 items-center',
                        selectedProviders.includes('all') ? 'bg-primary/10' : '',
                      )}
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止事件冒泡
                        handleGameProvider('all');
                        // 选择"All"时自动关闭下拉框
                        setIsDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={selectedProviders.includes('all')}
                          readOnly
                        />
                        {allProvidersOption.name}
                      </div>
                    </a>
                  </li>

                  {gameProviderList &&
                    gameProviderList.map((provider) => (
                      <li key={provider.name_en}>
                        <a
                          className={clsx(
                            'flex h-9 items-center',
                            provider.name_en &&
                              selectedProviders.includes(provider.name_en.toString()) &&
                              !selectedProviders.includes('all')
                              ? 'bg-primary/10'
                              : '',
                          )}
                          onClick={(e) => {
                            e.stopPropagation(); // 阻止事件冒泡
                            provider.name_en && handleGameProvider(provider.name_en.toString());
                            // 不再自动关闭下拉框
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-sm"
                              checked={
                                !!(
                                  provider.name_en &&
                                  selectedProviders.includes(provider.name_en.toString()) &&
                                  !selectedProviders.includes('all')
                                )
                              }
                              readOnly
                            />
                            {provider.name}
                          </div>
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          {!isSearch && activeTab === 'all' && (
            <div className="relative h-full flex-1 overflow-y-auto pb-3">
              <div className="flex flex-col gap-3 px-3">
                {[
                  { type: 'slots', title: t('casino:slotsGames') },
                  { type: 'crash', title: t('casino:crashGames') },
                  { type: 'sport', title: t('casino:sportGames') },
                  { type: 'esport', title: t('casino:esportGames') },
                  { type: 'keno', title: t('casino:kenoGames') },
                  { type: 'non-keno', title: t('casino:nonKenoGames') },
                  { type: 'casual', title: t('casino:casualGames') },
                  { type: 'blockchain', title: t('casino:blockchainGames') },
                  { type: 'live', title: t('casino:liveGames') },
                  { type: 'fishing', title: t('casino:fishingGames') },
                  { type: 'roulette', title: t('casino:rouletteGames') },
                  { type: 'poker', title: t('casino:pokerGames') },
                  { type: 'table', title: t('casino:tableGames') },
                  { type: 'arcade', title: t('casino:arcadeGames') },
                  { type: 'show', title: t('casino:showGames') },
                ].map((type) => (
                  <CasinoGamesRowList key={type.type} type={type.type} title={type.title} />
                ))}
              </div>
            </div>
          )}
          {isSearch && (
            <GameListContent
              searchValue={searchValue}
              activeTab={activeTab}
              sortBy={sortBy}
              selectedProviders={selectedProviders}
              sortByRef={sortByRef}
              setIsDropdownOpen={setIsDropdownOpen}
            />
          )}
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
}
