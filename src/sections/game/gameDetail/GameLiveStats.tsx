import { ModalDialog } from '@/components/ui/ModalDialog';
import { SelectDropdown } from '@/components/ui/SelectDropdown';
import GameChart from './GameChart';

const options = [{ id: 'bet', label: 'Bet', value: 'Bet' }];

export const GameLiveStats = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  return (
    <ModalDialog open={open} onClose={onClose} className="bg-base-100 p-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.2194 6.26805C15.3679 5.88135 15.8017 5.6882 16.1884 5.83664L22.1297 8.11728C22.3154 8.18856 22.4651 8.33069 22.546 8.51241C22.627 8.69413 22.6324 8.90054 22.5611 9.08624L20.2804 15.0275C20.132 15.4142 19.6982 15.6074 19.3115 15.4589C18.9248 15.3105 18.7316 14.8767 18.8801 14.49L20.5118 10.2391L19.4253 10.7228C16.9721 11.8151 15.1036 13.6759 13.975 15.8964C13.8662 16.1105 13.6614 16.2596 13.4241 16.2973C13.1869 16.335 12.946 16.2567 12.7761 16.0869L9 12.3108L2.78033 18.5305C2.48744 18.8234 2.01256 18.8234 1.71967 18.5305C1.42678 18.2376 1.42678 17.7627 1.71967 17.4698L8.46967 10.7198C8.61032 10.5791 8.80109 10.5001 9 10.5001C9.19891 10.5001 9.38968 10.5791 9.53033 10.7198L13.1363 14.3258C14.4369 12.2047 16.3711 10.4407 18.8152 9.35251L19.9017 8.86877L15.6508 7.23701C15.2641 7.08857 15.071 6.65475 15.2194 6.26805Z"
              fill="#A6ADBB"
              style={{ fill: '#A6ADBB', fillOpacity: 1 }}
            />
          </svg>
          <div className="text-base font-bold">Live Stats</div>
        </div>

        <SelectDropdown
          options={options}
          className="bg-base-200 h-12"
          dropdownContainerClassName="inline-flex"
          value={options[0].value}
        />

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-neutral flex h-13 flex-col justify-center gap-1 rounded-lg p-2">
            <div className="text-base-content text-xs">Wagered</div>
            <div className="flex items-center gap-2">
              <img src="/icons/tokens/ton.svg" className="h-4 w-4" />
              <div className="text-base-content/60 text-sm font-bold">Bet</div>
            </div>
          </div>
          <div className="bg-neutral flex h-13 flex-col justify-center gap-1 rounded-lg p-2">
            <div className="text-base-content text-xs">Wagered</div>
            <div className="flex items-center gap-2">
              <img src="/icons/tokens/ton.svg" className="h-4 w-4" />
              <div className="text-success/60 text-sm font-bold">Bet</div>
            </div>
          </div>
          <div className="bg-neutral flex h-13 flex-col justify-center gap-1 rounded-lg p-2">
            <div className="text-base-content text-xs">Wagered</div>
            <div className="text-base-content/60 text-sm font-bold">Bet</div>
          </div>
          <div className="bg-neutral flex h-13 flex-col justify-center gap-1 rounded-lg p-2">
            <div className="text-base-content text-xs">Wagered</div>
            <div className="text-base-content/60 text-sm font-bold">Bet</div>
          </div>
        </div>

        <GameChart width={'100%'} height={'224px'} />
      </div>
    </ModalDialog>
  );
};
