import { Carousel } from '@/components/carousel';
import { useCarousel } from '@/hooks';

export const TabContentAchievements = () => {
  const { carouselRef, next, prev } = useCarousel();

  // 定义卡片尺寸类型
  type CardSize = 'sm' | 'md' | 'lg';

  // 根据尺寸获取样式
  const getSizeStyles = (size: CardSize = 'md') => {
    const styles = {
      sm: {
        container: 'h-[40px] w-[40px]',
        icon: 'h-6 w-6',
        badge: 'h-3 w-3 text-[10px]',
      },
      md: {
        container: 'h-[72px] w-[72px]',
        icon: 'h-10 w-10',
        badge: 'h-4 w-4 text-xs',
      },
      lg: {
        container: 'h-[96px] w-[96px]',
        icon: 'h-12 w-12',
        badge: 'h-5 w-5 text-sm',
      },
    };
    return styles[size];
  };

  const CardShark = ({ num, className, size = 'md' }: { num: number; className?: string; size?: CardSize }) => {
    const styles = getSizeStyles(size);
    return (
      <div className={`indicator mt-2 ${className || ''}`}>
        <span className={`indicator-item badge badge-primary z-20 rounded-full p-0 font-bold ${styles.badge}`}>
          {num}
        </span>
        <div
          className={`flex items-center justify-center rounded-lg ${styles.container}`}
          style={{
            background:
              'radial-gradient(172.66% 100% at 50.49% 0%, color(display-p3 1.000 0.278 0.341 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
          }}
        >
          <img src="/icons/isometric/17.svg" className={styles.icon} />
        </div>
      </div>
    );
  };

  const Phantom = ({ num, className, size = 'md' }: { num: number; className?: string; size?: CardSize }) => {
    const styles = getSizeStyles(size);
    return (
      <div className={`indicator mt-2 ${className || ''}`}>
        <span className={`indicator-item badge badge-primary z-20 rounded-full p-0 font-bold ${styles.badge}`}>
          {num}
        </span>
        <div
          className={`flex items-center justify-center rounded-lg ${styles.container}`}
          style={{
            background:
              'radial-gradient(172.66% 100% at 50.49% 0%, color(display-p3 0.329 0.259 0.831 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
          }}
        >
          <img src="/icons/isometric/18.png" className={styles.icon} />
        </div>
      </div>
    );
  };

  const Deposit = ({ num, className, size = 'md' }: { num: number; className?: string; size?: CardSize }) => {
    const styles = getSizeStyles(size);
    return (
      <div className={`indicator mt-2 ${className || ''}`}>
        <span className={`indicator-item badge badge-primary z-20 rounded-full p-0 font-bold ${styles.badge}`}>
          {num}
        </span>
        <div
          className={`flex items-center justify-center rounded-lg ${styles.container}`}
          style={{
            background:
              'radial-gradient(172.66% 100% at 50.49% 0%, color(display-p3 0.353 0.906 0.792 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
          }}
        >
          <img src="/icons/isometric/1.svg" className={styles.icon} />
        </div>
      </div>
    );
  };

  const Credit = ({ num, className, size = 'md' }: { num: number; className?: string; size?: CardSize }) => {
    const styles = getSizeStyles(size);
    return (
      <div className={`indicator mt-2 ${className || ''}`}>
        <span className={`indicator-item badge badge-primary z-20 rounded-full p-0 font-bold ${styles.badge}`}>
          {num}
        </span>
        <div
          className={`flex items-center justify-center rounded-lg ${styles.container}`}
          style={{
            background:
              'radial-gradient(172.66% 100% at 50.49% 0%, color(display-p3 0.439 0.569 0.969 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
          }}
        >
          <img src="/icons/isometric/19.png" className={styles.icon} />
        </div>
      </div>
    );
  };

  const Play = ({ num, className, size = 'md' }: { num: number; className?: string; size?: CardSize }) => {
    const styles = getSizeStyles(size);
    return (
      <div className={`indicator mt-2 ${className || ''}`}>
        <span className={`indicator-item badge badge-primary z-20 rounded-full p-0 font-bold ${styles.badge}`}>
          {num}
        </span>
        <div
          className={`flex items-center justify-center rounded-lg ${styles.container}`}
          style={{
            background:
              'radial-gradient(172.66% 100% at 50.49% 0%, color(display-p3 0.843 0.800 0.945 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
          }}
        >
          <img src="/icons/isometric/20.svg" className={styles.icon} />
        </div>
      </div>
    );
  };

  const slides = [
    <CardShark num={1} />,
    <Phantom num={2} />,
    <Deposit num={3} />,
    <Credit num={4} />,
    <Play num={5} />,
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-bold">My Achievements</p>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm">All</button>
          <div className="join">
            <button className="btn btn-sm join-item" onClick={prev}>
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
            <button className="btn btn-sm join-item" onClick={next}>
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
      </div>

      <Carousel className="-mt-2 -mr-3" ref={carouselRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={index} className="mr-3 flex-shrink-0">
              {slide}
            </div>
          ))}
        </div>
      </Carousel>

      <div className="flex items-center justify-between">
        <p className="font-bold">In Progress</p>
        <button className="btn btn-sm flex items-center gap-1">
          <span className="text-neutral-content">Sort By: A-Z</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.99995 2.09961C7.14594 2.09961 7.28533 2.16039 7.38467 2.26737L9.65967 4.71737C9.85697 4.92985 9.84466 5.26203 9.63219 5.45933C9.41972 5.65662 9.08753 5.64432 8.89024 5.43185L6.99995 3.39616L5.10967 5.43185C4.91237 5.64432 4.58019 5.65662 4.36772 5.45933C4.15524 5.26203 4.14294 4.92985 4.34024 4.71737L6.61524 2.26737C6.71457 2.16039 6.85397 2.09961 6.99995 2.09961ZM4.36772 8.53989C4.58019 8.3426 4.91237 8.3549 5.10967 8.56737L6.99995 10.6031L8.89024 8.56737C9.08753 8.3549 9.41972 8.3426 9.63219 8.53989C9.84466 8.73719 9.85697 9.06937 9.65967 9.28185L7.38467 11.7318C7.28533 11.8388 7.14594 11.8996 6.99995 11.8996C6.85397 11.8996 6.71457 11.8388 6.61524 11.7318L4.34024 9.28185C4.14294 9.06937 4.15524 8.73719 4.36772 8.53989Z"
              fill="#A6ADBB"
            />
          </svg>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="table-sm table">
          <thead className="bg-base-100 rounded text-xs">
            <tr>
              <th>Achievement</th>
              <th>Rewards</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-base-200">
              <td className="px-4">
                <div className="flex items-center gap-3">
                  <CardShark num={1} size="sm" />
                  <div className="flex flex-col">
                    <p>Card Shark</p>
                    <div className="flex items-center gap-2">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5 4C5.82843 4 6.5 3.32843 6.5 2.5C6.5 1.67157 5.82843 1 5 1C4.17157 1 3.5 1.67157 3.5 2.5C3.5 3.32843 4.17157 4 5 4Z"
                          fill="#A6ADBB"
                        />
                        <path
                          d="M1.73259 7.24677C1.63514 7.50078 1.72217 7.78549 1.9371 7.95229C2.78328 8.60902 3.84601 9 5.00006 9C6.15528 9 7.219 8.60822 8.0656 7.95029C8.28042 7.78334 8.36727 7.49857 8.26966 7.24462C7.76503 5.93177 6.4921 5 5.00153 5C3.51016 5 2.23665 5.93279 1.73259 7.24677Z"
                          fill="#A6ADBB"
                        />
                      </svg>
                      <p className="text-xs opacity-50">271</p>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4">
                <div className="flex items-center justify-end gap-2">
                  <p className="text-primary/80 text-sm">344.81 PHP</p>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.32558 8.8619C4.15332 8.68275 4.15891 8.39788 4.33805 8.22562L6.7007 6L4.33805 3.77437C4.15891 3.60212 4.15332 3.31725 4.32558 3.1381C4.49783 2.95895 4.7827 2.95337 4.96185 3.12562L7.66185 5.67562C7.75009 5.76047 7.79995 5.87759 7.79995 6C7.79995 6.12241 7.75009 6.23953 7.66185 6.32437L4.96185 8.87437C4.7827 9.04663 4.49783 9.04105 4.32558 8.8619Z"
                      fill="#A6ADBB"
                    />
                  </svg>
                </div>
              </td>
            </tr>
            <tr className="bg-base-200">
              <td className="px-4">
                <div className="flex items-center gap-3">
                  <Credit num={4} size="sm" />
                  <div className="flex flex-col">
                    <p>Credit Tycoon</p>
                    <div className="flex items-center gap-2">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5 4C5.82843 4 6.5 3.32843 6.5 2.5C6.5 1.67157 5.82843 1 5 1C4.17157 1 3.5 1.67157 3.5 2.5C3.5 3.32843 4.17157 4 5 4Z"
                          fill="#A6ADBB"
                        />
                        <path
                          d="M1.73259 7.24677C1.63514 7.50078 1.72217 7.78549 1.9371 7.95229C2.78328 8.60902 3.84601 9 5.00006 9C6.15528 9 7.219 8.60822 8.0656 7.95029C8.28042 7.78334 8.36727 7.49857 8.26966 7.24462C7.76503 5.93177 6.4921 5 5.00153 5C3.51016 5 2.23665 5.93279 1.73259 7.24677Z"
                          fill="#A6ADBB"
                        />
                      </svg>
                      <p className="text-xs opacity-50">271</p>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4">
                <div className="flex items-center justify-end gap-2">
                  <p className="text-primary/80 text-sm">344.81 PHP</p>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.32558 8.8619C4.15332 8.68275 4.15891 8.39788 4.33805 8.22562L6.7007 6L4.33805 3.77437C4.15891 3.60212 4.15332 3.31725 4.32558 3.1381C4.49783 2.95895 4.7827 2.95337 4.96185 3.12562L7.66185 5.67562C7.75009 5.76047 7.79995 5.87759 7.79995 6C7.79995 6.12241 7.75009 6.23953 7.66185 6.32437L4.96185 8.87437C4.7827 9.04663 4.49783 9.04105 4.32558 8.8619Z"
                      fill="#A6ADBB"
                    />
                  </svg>
                </div>
              </td>
            </tr>
            <tr className="bg-base-200">
              <td className="px-4">
                <div className="flex items-center gap-3">
                  <Phantom num={2} size="sm" />
                  <div className="flex flex-col">
                    <p>Phantom</p>
                    <div className="flex items-center gap-2">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5 4C5.82843 4 6.5 3.32843 6.5 2.5C6.5 1.67157 5.82843 1 5 1C4.17157 1 3.5 1.67157 3.5 2.5C3.5 3.32843 4.17157 4 5 4Z"
                          fill="#A6ADBB"
                        />
                        <path
                          d="M1.73259 7.24677C1.63514 7.50078 1.72217 7.78549 1.9371 7.95229C2.78328 8.60902 3.84601 9 5.00006 9C6.15528 9 7.219 8.60822 8.0656 7.95029C8.28042 7.78334 8.36727 7.49857 8.26966 7.24462C7.76503 5.93177 6.4921 5 5.00153 5C3.51016 5 2.23665 5.93279 1.73259 7.24677Z"
                          fill="#A6ADBB"
                        />
                      </svg>
                      <p className="text-xs opacity-50">271</p>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4">
                <div className="flex items-center justify-end gap-2">
                  <p className="text-primary/80 text-sm">344.81 PHP</p>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.32558 8.8619C4.15332 8.68275 4.15891 8.39788 4.33805 8.22562L6.7007 6L4.33805 3.77437C4.15891 3.60212 4.15332 3.31725 4.32558 3.1381C4.49783 2.95895 4.7827 2.95337 4.96185 3.12562L7.66185 5.67562C7.75009 5.76047 7.79995 5.87759 7.79995 6C7.79995 6.12241 7.75009 6.23953 7.66185 6.32437L4.96185 8.87437C4.7827 9.04663 4.49783 9.04105 4.32558 8.8619Z"
                      fill="#A6ADBB"
                    />
                  </svg>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
