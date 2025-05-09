import { useLanguage } from '@/contexts/language';

export const TournamentLogo = ({ img, className }: { img: string; className?: string }) => {
  const { isRTL } = useLanguage();
  return (
    <>
      {img !== '' && (
        <div
          className={`absolute ${isRTL ? 'left-0 rounded-r-md' : 'right-0 rounded-l-md'} bottom-8 flex h-11 w-27 items-center justify-center ${className}`}
          style={{
            background: 'color(display-p3 0.082 0.098 0.118 / 0.8)',
          }}
        >
          <img src={img} className="h-8 w-auto object-cover" />
        </div>
      )}
    </>
  );
};
