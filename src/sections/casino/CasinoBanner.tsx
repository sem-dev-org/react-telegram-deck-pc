import { Carousel } from '@/components/carousel';
import { FullBleedContainer } from '@/components/ui';
import { useCarousel, useSystem } from '@/hooks';

type CasinoBannerProps = {
  banners: React.ReactNode[];
};

export const CasinoBanner = ({ banners }: CasinoBannerProps) => {
  const { carouselRef, onSelect } = useCarousel();
  const { isMobile } = useSystem();
  // const { setBackground } = useThemeStore();

  // useEffect(() => {
  //   if (banners[currentIndex]) {
  //     const bgColor = hexToRgba(banners[currentIndex].color, 0.2);
  //     if (bgColor) {
  //       setBackground(`radial-gradient(100% 31.96% at 0% 0%, ${bgColor} 0%, #14191F 100%)`);
  //     }
  //   }
  // }, [currentIndex, banners, setBackground]);



  return (
    <FullBleedContainer>
      <Carousel ref={carouselRef} onChange={onSelect}   >
        <div className="flex ">
          {banners.map((banner, index) => (
            <div
              key={index}
              // className="relative mr-2 flex min-w-0 flex-[0_0_100%] flex-col items-center justify-center gap-0.5"
              className={`relative flex flex-col items-center justify-center gap-0.5 ${
                isMobile ? 'mr-2 min-w-0 flex-[0_0_100%]' : 'mr-2.5 h-50 min-w-0 flex-[0_0_23%] max-w-87.5'
              }`}
            >
              {/* <img
                id={`banner-${index}`}
                src={banner.image}
                alt={`Slide ${index + 1}`}
                className="rounded-lg object-cover"
              /> */}
              {banner}
            </div>
          ))}
        </div>
      </Carousel>
    </FullBleedContainer>
  );
};
