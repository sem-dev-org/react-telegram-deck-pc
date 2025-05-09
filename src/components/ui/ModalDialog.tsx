type ModalDialogProps = {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  position?: 'modal-bottom' | '';
  className?: string;
  style?: React.CSSProperties;
  closeBtn?: boolean;
};

export const ModalDialog = ({
  children,
  open,
  onClose,
  position,
  className,
  style,
  closeBtn = true,
}: ModalDialogProps) => {
  return (
    <dialog className={`modal ${open ? 'modal-open' : ''} ${position}`} style={{ zIndex: 15000 }}>
      <div className={`modal-box ${className} `} style={style}>
        {closeBtn && (
          <form
            method="dialog"
            className="fixed top-2.5 right-2.5 z-[9999]"
            onClick={() => {
              onClose();
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_d_2119_17946)">
                <path
                  d="M9.39623 8.65377C9.19121 8.44874 8.85879 8.44874 8.65377 8.65377C8.44874 8.85879 8.44874 9.19121 8.65377 9.39623L11.2575 12L8.65377 14.6038C8.44874 14.8088 8.44874 15.1412 8.65377 15.3462C8.85879 15.5513 9.19121 15.5513 9.39623 15.3462L12 12.7425L14.6038 15.3462C14.8088 15.5513 15.1412 15.5513 15.3462 15.3462C15.5513 15.1412 15.5513 14.8088 15.3462 14.6038L12.7425 12L15.3462 9.39623C15.5513 9.19121 15.5513 8.85879 15.3462 8.65377C15.1412 8.44874 14.8088 8.44874 14.6038 8.65377L12 11.2575L9.39623 8.65377Z"
                  fill="#A6ADBB"
                  style={{ fill: '#A6ADBB', fillOpacity: 1 }}
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_2119_17946"
                  x="-2"
                  y="-1"
                  width="28"
                  height="28"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="1" />
                  <feGaussianBlur stdDeviation="1" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2119_17946" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2119_17946" result="shape" />
                </filter>
              </defs>
            </svg>
          </form>
        )}
        <div className="h-full overflow-y-auto">{children}</div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => onClose()}>close</button>
      </form>
    </dialog>
  );
};
