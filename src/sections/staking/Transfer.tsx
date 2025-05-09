import { useState } from 'react';
import ModalDialog from '../../components/modal-dialog';

type TransferProps = {
  open: boolean;
  onClose: () => void;
  status: string;
};

export function Transfer({ open, onClose, status }: TransferProps) {
  const [selectedGameType, setSelectedGameType] = useState('USDT');

  const gameTypeOptions = [
    { id: 1, value: 'USDT' },
    { id: 2, value: 'BTC' },
    { id: 3, value: 'ETH' },
  ];

  const closeDropdown = () => {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur();
    }
  };

  return (
    <ModalDialog open={open} onClose={onClose} className="p-6 ">
      <div className="flex flex-col gap-3">
        <div className="text-base font-bold h-6">
          <span>{status}</span>
        </div>
        <div>
          <div className="text-sm h-5">
            <span>Amount</span>
          </div>
          <div className="input w-full pr-0">
            <input type="text" className="text-base" />
            <div className="text-sm font-semibold px-3 h-full flex items-center justify-center">
              <span>MAX</span>
            </div>
            <div className="flex items-center h-full">
              <div className="dropdown dropdown-end h-full">
                <div
                  tabIndex={0}
                  className="bg-neutral h-full w-30 flex items-center justify-between rounded-lg px-4 cursor-pointer hover:bg-base-300"
                >
                  <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6.76331 11.9404L6.75896 11.9381L6.74386 11.9299C6.731 11.9229 6.7126 11.9128 6.68905 11.8997C6.64195 11.8734 6.57416 11.8349 6.48864 11.7846C6.31767 11.684 6.07545 11.5359 5.7857 11.3433C5.20716 10.9587 4.43414 10.3934 3.65906 9.67088C2.12521 8.24103 0.5 6.11673 0.5 3.5C0.5 1.54796 2.1424 0 4.125 0C5.29092 0 6.33488 0.532725 7 1.36773C7.66512 0.532725 8.70908 0 9.875 0C11.8576 0 13.5 1.54796 13.5 3.5C13.5 6.11673 11.8748 8.24103 10.3409 9.67088C9.56586 10.3934 8.79284 10.9587 8.2143 11.3433C7.92455 11.5359 7.68233 11.684 7.51136 11.7846C7.42584 11.8349 7.35806 11.8734 7.31095 11.8997C7.2874 11.9128 7.269 11.9229 7.25614 11.9299L7.24104 11.9381L7.23669 11.9404L7.23485 11.9414C7.08821 12.0193 6.91179 12.0193 6.76515 11.9414L6.76331 11.9404Z"
                      fill="#A6ADBB"
                      style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
                    />
                  </svg>
                  <div className="text-sm font-semibold">{selectedGameType}</div>
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M0.184136 0.767599C0.422999 0.537923 0.802824 0.54537 1.0325 0.784233L4 3.93443L6.9675 0.784233C7.19718 0.54537 7.577 0.537923 7.81587 0.767599C8.05473 0.997275 8.06218 1.3771 7.8325 1.61596L4.4325 5.21596C4.31938 5.33361 4.16321 5.4001 4 5.4001C3.83679 5.4001 3.68062 5.33361 3.5675 5.21596L0.167501 1.61596C-0.0621751 1.3771 -0.0547276 0.997275 0.184136 0.767599Z"
                      fill="#A6ADBB"
                    />
                  </svg>
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-[1] w-full p-2 shadow">
                  {gameTypeOptions.map((option) => (
                    <li key={option.id}>
                      <a
                        className={`${
                          selectedGameType === option.value ? 'bg-primary text-primary-content' : 'hover:bg-base-300'
                        }`}
                        onClick={() => {
                          setSelectedGameType(option.value);
                          closeDropdown();
                        }}
                      >
                        {option.value}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="text-sm h-5 flex items-center">
            {status === 'Stake' && <span>Available: 2000 USDT</span>}
            {status === 'Unstake' && <span>Vault Balance: 6.13 USDT</span>}
          </div>
        </div>
        {status === 'Stake' && (
          <div className="flex items-center gap-2 h-5 justify-between">
            <div className="text-sm">Daily Returns</div>
            <div className="text-sm h-5 flex items-center gap-2">
              <span className="text-sm font-bold">0.0001369 USDT</span>
              <div className="text-xs bg-success text-success-content px-2 rounded-full h-3 flex items-center">
                <span>APR 5%</span>
              </div>
            </div>
          </div>
        )}

        <button
          className="btn bg-primary h-12 items-center justify-center flex"
          onClick={() => {
            onClose();
          }}
        >
          <div className="text-sm text-neutral font-semibold">Stake to Pool</div>
        </button>
      </div>
    </ModalDialog>
  );
}
