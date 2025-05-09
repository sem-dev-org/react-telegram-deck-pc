import { SwapTabContentCrypto } from '@/sections/finance';

type Props = {
  isChildren?: boolean;
  searchParams?: URLSearchParams;
};

export default function SwapPage({ isChildren = false }: Props) {
  if (isChildren) {
    return (
      <div className="bg-base-100 flex flex-col rounded-tl-xl rounded-b-xl p-3 pb-24">
        <div className="relative">
          <SwapTabContentCrypto />
        </div>
      </div>
    );
  }

  return null;
}
