import { FullBleedContainer, Page, SafeContent } from '@/components/ui';
import { SearchInput } from '@/components/ui/SearchInput';
import { TabBtn } from '@/components/ui/TabBtn';
import { useState } from 'react';

export default function GameProviderGamesPage() {
  // const { provider } = useParams();
  // const [games, setGames] = useState<IGame[]>([]);
  // const games = mockGameGames.filter((game) => game.provider?.id === id);
  // useEffect(() => {
  //   if (provider) {
  //     getGameList(provider).then((res) => {
  //       setGames(res);
  //     });
  //   }
  // }, [provider]);

  const [activeTab, setActiveTab] = useState('all');
  const tabs = [
    {
      id: 'all',
      label: 'All',
      icon: (
        `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.50495 1.60493C6.77832 1.33156 7.22153 1.33156 7.4949 1.60493L12.3949 6.50493C12.5951 6.70513 12.655 7.00621 12.5466 7.26778C12.4383 7.52935 12.183 7.6999 11.8999 7.6999H11.1999V11.8999C11.1999 12.2865 10.8865 12.5999 10.4999 12.5999H9.09992C8.71332 12.5999 8.39992 12.2865 8.39992 11.8999V9.7999C8.39992 9.4133 8.08652 9.0999 7.69992 9.0999H6.29992C5.91332 9.0999 5.59992 9.4133 5.59992 9.7999V11.8999C5.59992 12.2865 5.28652 12.5999 4.89992 12.5999H3.49992C3.11332 12.5999 2.79992 12.2865 2.79992 11.8999V7.6999H2.09992C1.8168 7.6999 1.56155 7.52935 1.45321 7.26778C1.34486 7.00621 1.40475 6.70513 1.60495 6.50493L6.50495 1.60493Z"
            fill="currentColor"
            fillOpacity="0.8"
          />
        </svg>`
      ),
    },
    {
      id: 'popular',
      label: 'Hot',
      icon: (
        `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.56195 1.33319C7.49092 1.23794 7.3842 1.17567 7.26632 1.16071C7.14844 1.14575 7.02954 1.17938 6.93696 1.25387C5.84602 2.13168 5.08515 3.40518 4.87271 4.85687C4.48971 4.57922 4.15333 4.24095 3.87776 3.85612C3.80196 3.75026 3.68293 3.68366 3.55305 3.67443C3.42317 3.66521 3.29593 3.71432 3.20592 3.8084C2.30444 4.75073 1.75 6.02963 1.75 7.43711C1.75 10.3366 4.1005 12.6871 7 12.6871C9.89949 12.6871 12.25 10.3366 12.25 7.43711C12.25 5.30159 10.975 3.46481 9.14654 2.64468C8.49951 2.32881 7.96522 1.87397 7.56195 1.33319ZM9.1875 8.31234C9.1875 9.52047 8.20812 10.4998 7 10.4998C5.79188 10.4998 4.8125 9.52047 4.8125 8.31234C4.8125 8.07356 4.85076 7.84372 4.92148 7.62861C5.28809 7.89963 5.70949 8.10077 6.16601 8.21237C6.29195 7.39525 6.7005 6.67137 7.28869 6.14372C8.36036 6.28501 9.1875 7.20208 9.1875 8.31234Z"
            fill="currentColor"
          />
        </svg>`
      ),
    },
    {
      id: 'new',
      label: 'Crash Games',
      icon: (
        `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.56195 1.33319C7.49092 1.23794 7.3842 1.17567 7.26632 1.16071C7.14844 1.14575 7.02954 1.17938 6.93696 1.25387C5.84602 2.13168 5.08515 3.40518 4.87271 4.85687C4.48971 4.57922 4.15333 4.24095 3.87776 3.85612C3.80196 3.75026 3.68293 3.68366 3.55305 3.67443C3.42317 3.66521 3.29593 3.71432 3.20592 3.8084C2.30444 4.75073 1.75 6.02963 1.75 7.43711C1.75 10.3366 4.1005 12.6871 7 12.6871C9.89949 12.6871 12.25 10.3366 12.25 7.43711C12.25 5.30159 10.975 3.46481 9.14654 2.64468C8.49951 2.32881 7.96522 1.87397 7.56195 1.33319ZM9.1875 8.31234C9.1875 9.52047 8.20812 10.4998 7 10.4998C5.79188 10.4998 4.8125 9.52047 4.8125 8.31234C4.8125 8.07356 4.85076 7.84372 4.92148 7.62861C5.28809 7.89963 5.70949 8.10077 6.16601 8.21237C6.29195 7.39525 6.7005 6.67137 7.28869 6.14372C8.36036 6.28501 9.1875 7.20208 9.1875 8.31234Z"
            fill="currentColor"
          />
        </svg>`
      ),
    },
    {
      id: 'old',
      label: 'Slots',
      icon: (
        `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.56195 1.33319C7.49092 1.23794 7.3842 1.17567 7.26632 1.16071C7.14844 1.14575 7.02954 1.17938 6.93696 1.25387C5.84602 2.13168 5.08515 3.40518 4.87271 4.85687C4.48971 4.57922 4.15333 4.24095 3.87776 3.85612C3.80196 3.75026 3.68293 3.68366 3.55305 3.67443C3.42317 3.66521 3.29593 3.71432 3.20592 3.8084C2.30444 4.75073 1.75 6.02963 1.75 7.43711C1.75 10.3366 4.1005 12.6871 7 12.6871C9.89949 12.6871 12.25 10.3366 12.25 7.43711C12.25 5.30159 10.975 3.46481 9.14654 2.64468C8.49951 2.32881 7.96522 1.87397 7.56195 1.33319ZM9.1875 8.31234C9.1875 9.52047 8.20812 10.4998 7 10.4998C5.79188 10.4998 4.8125 9.52047 4.8125 8.31234C4.8125 8.07356 4.85076 7.84372 4.92148 7.62861C5.28809 7.89963 5.70949 8.10077 6.16601 8.21237C6.29195 7.39525 6.7005 6.67137 7.28869 6.14372C8.36036 6.28501 9.1875 7.20208 9.1875 8.31234Z"
            fill="currentColor"
          />
        </svg>`
      ),
    },
  ];

  return (
    <FullBleedContainer>
      <SafeContent>
        <Page className="bg-base-300 flex flex-col gap-3 p-3 pb-24">
          <SearchInput placeholder="Search" className="bg-base-200 border-none" size="lg" />

          <TabBtn tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="grid grid-cols-2 gap-2">
            <button className="btn flex h-[48px] w-full items-center justify-between">
              <p className="text-sm font-semibold">Sort By: Popular</p>
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.68414 5.7676C4.923 5.53792 5.30282 5.54537 5.5325 5.78423L8.5 8.93443L11.4675 5.78423C11.6972 5.54537 12.077 5.53792 12.3159 5.7676C12.5547 5.99727 12.5622 6.3771 12.3325 6.61596L8.9325 10.216C8.81938 10.3336 8.66321 10.4001 8.5 10.4001C8.33679 10.4001 8.18062 10.3336 8.0675 10.216L4.6675 6.61596C4.43782 6.3771 4.44527 5.99727 4.68414 5.7676Z"
                  fill="#A6ADBB"
                />
              </svg>
            </button>

            <button className="btn flex h-[48px] w-full items-center justify-between">
              <p className="text-sm font-semibold">Provider: PG Soft</p>
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

          <div className="grid grid-cols-3 gap-2">
            {/* {games.map((item) => (
              <div key={item.id} className="relative">
                <img src={item?.image} alt={item?.name} className="rounded-xl object-cover" />
                <div className="absolute top-2 right-2 flex h-4 w-[42px] items-center justify-center gap-2 rounded-md bg-[#2A323C]/80">
                  <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_1649_326)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.12502 2.82617C3.12502 1.79064 3.96448 0.951172 5.00002 0.951172C6.03555 0.951172 6.87502 1.79064 6.87502 2.82617C6.87502 3.86171 6.03555 4.70117 5.00002 4.70117C3.96448 4.70117 3.12502 3.86171 3.12502 2.82617Z"
                        fill="#A6ADBB"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.56303 8.70339C1.59526 6.83266 3.12168 5.32617 5.00002 5.32617C6.8784 5.32617 8.40484 6.83273 8.437 8.70353C8.43913 8.82759 8.36765 8.94117 8.25487 8.99292C7.26365 9.44775 6.16107 9.70117 5.00015 9.70117C3.83912 9.70117 2.73645 9.44771 1.74515 8.9928C1.63237 8.94104 1.5609 8.82746 1.56303 8.70339Z"
                        fill="#A6ADBB"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1649_326">
                        <rect width="10" height="10" fill="white" transform="translate(0 0.326172)" />
                      </clipPath>
                    </defs>
                  </svg>
                  <p className="text-neutral-content text-xs font-bold">{item.onlinePlayers}</p>
                </div>
              </div>
            ))} */}
          </div>
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
}
