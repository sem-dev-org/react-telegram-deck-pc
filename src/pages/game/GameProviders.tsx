import { GameProviderList } from '@/api/casino';
import { FullBleedContainer, Page, SafeContent } from '@/components/ui';
import { SearchInput } from '@/components/ui/SearchInput';
import { IGameProvider } from '@/types/game';
import { useQuery } from '@tanstack/react-query';
// import { useGetGameProviderList } from '@/api/casino';
import { useNavigate } from 'react-router-dom';

export default function GameProviderPage() {
  const navigate = useNavigate();

  // const { data: gameProviderList } = useGetGameProviderList();
  const { data: gameProviderList = { data: [] as IGameProvider[], code: 0 } } = useQuery<{ data: IGameProvider[], code: number }>({ 
    queryKey: ['gameProviderList'],
    queryFn: () => GameProviderList(),
  });
 
  return (
    <FullBleedContainer>
      <SafeContent>
        <Page className="bg-base-300 flex flex-col gap-3 p-3 pb-24">
          <SearchInput placeholder="Search" className="bg-base-200 border-none" size="lg" />

          <div className="flex items-center gap-2">
            <button className="btn flex h-[48px] items-center justify-between">
              <p>Sort By: Popular</p>
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.68414 5.7676C4.923 5.53792 5.30282 5.54537 5.5325 5.78423L8.5 8.93443L11.4675 5.78423C11.6972 5.54537 12.077 5.53792 12.3159 5.7676C12.5547 5.99727 12.5622 6.3771 12.3325 6.61596L8.9325 10.216C8.81938 10.3336 8.66321 10.4001 8.5 10.4001C8.33679 10.4001 8.18062 10.3336 8.0675 10.216L4.6675 6.61596C4.43782 6.3771 4.44527 5.99727 4.68414 5.7676Z"
                  fill="#A6ADBB"
                />
              </svg>
            </button>

            <button className="btn flex h-[48px] items-center justify-between">
              <p>Provider: PG Soft</p>
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.68414 5.7676C4.923 5.53792 5.30282 5.54537 5.5325 5.78423L8.5 8.93443L11.4675 5.78423C11.6972 5.54537 12.077 5.53792 12.3159 5.7676C12.5547 5.99727 12.5622 6.3771 12.3325 6.61596L8.9325 10.216C8.81938 10.3336 8.66321 10.4001 8.5 10.4001C8.33679 10.4001 8.18062 10.3336 8.0675 10.216L4.6675 6.61596C4.43782 6.3771 4.44527 5.99727 4.68414 5.7676Z"
                  fill="#A6ADBB"
                />
              </svg>
            </button>
          </div>

          <div className="bg-base-200 grid w-full grid-cols-2 gap-2 rounded-xl p-3">
            {gameProviderList.code === 0 &&
              gameProviderList.data.map((provider, index) => (
                <div
                  key={index}
                  className="bg-neutral col-span-1 flex h-[64px] items-center justify-center rounded-lg overflow-hidden"
                  onClick={() => {
                  navigate(`/game-provider/${provider?.name_en}`);
                }}
              >
                <img src={provider?.logo} alt={provider?.name_en} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
}
