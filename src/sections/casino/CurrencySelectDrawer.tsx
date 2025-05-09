import { updateCurrency } from '@/api/auth';
import { Image } from '@/components/ui/Image';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { SearchInput } from '@/components/ui/SearchInput';
import { useAuth } from '@/contexts/auth';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { QueryCurrencyWithBalance } from '@/query/currency';
import { paths } from '@/routes/paths';
import { useSettingStore } from '@/store/setting';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '@/api/profile';

type CurrencySelectDrawerProps = {
  open: boolean;
  onClose: () => void;
  // selectValue: string;
  // onSelect: (currency: string) => void;
};

// 定义货币类型
type Currency = {
  code: string;
  icon: string;
};

export const CurrencySelectDrawer = ({ open, onClose }: CurrencySelectDrawerProps) => {
  const currencyModalRef = useRef<HTMLDialogElement | null>(null);
  const { user, updateUser: updateUserAuth } = useAuth();
  const { displayInFiat, hideZeroBalances } = useSettingStore();
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');

  const navigate = useNavigate();
  const [walletSettingsOpen, setWalletSettingsOpen] = useState(false);

  useEffect(() => {
    if (user?.currency_fiat) {
      setSelectedCurrency(user.currency_fiat);
    }
  }, [user?.currency_fiat]);

  useEffect(() => {
    if (open) {
      currencyModalRef.current?.showModal();
    } else {
      currencyModalRef.current?.close();
    }
  }, [open]);

  const handleWalletSettingsClick = () => {
    setWalletSettingsOpen(true);
  };

  const handleWalletSettingsClose = () => {
    setWalletSettingsOpen(false);
  };

  const currencySelectFun = (type: string) => {
    updateCurrency({ currency: type }).then((res) => {
      if (res.code === 0) {
        updateUserAuth(res.user);
        onClose();
      }
    });
  };

  const { convertCurrency, formatCryptoCurrency } = useCurrencyFormatter();

  const getExchangeRateFun = (balance: string, currency: string) => {
    // 如果不使用法币显示，则转换为USDT
    if (!displayInFiat) {
      return convertCurrency(balance, {
        sourceCurrency: currency,
        targetCurrency: 'USDT',
      });
    }

    // 否则使用用户选择的法币
    return convertCurrency(balance, {
      sourceCurrency: currency,
      targetCurrency: user?.currency_fiat || '',
    });
  };

  const { data: cryptoGroups } = QueryCurrencyWithBalance();
  const [searchValue, setSearchValue] = useState('');

  // Filter cryptoGroups based on searchValue
  const filteredCryptoGroups = cryptoGroups?.filter((item) =>
    item.currency.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const { t } = useTranslation();

  return (
    <div>
      <WalletSelectDialog
        openWallet={walletSettingsOpen}
        handleWalletSettingsClose={handleWalletSettingsClose}
        selectedCurrency={selectedCurrency}
      />

      {/* 货币选择弹窗 */}
      <ModalDialog open={open} onClose={onClose} position="modal-bottom" className="p-0">
        <div className="modal-box bg-base-100 flex h-[70vh] flex-col gap-3 p-0 pt-3">
          <h3 className="h-6 text-center font-bold">{t('casino:selectCurrency')}</h3>
          <div className="flex items-center gap-2 px-6">
            <SearchInput
              placeholder={t('common.search')}
              className="bg-base-200"
              value={searchValue}
              onChange={(value) => setSearchValue(value)}
            />
            <button className="btn btn-secondary btn-square" onClick={() => navigate(paths.main.finance.deposit)}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.1875 8.75C6.66974 8.75 6.25 9.16974 6.25 9.6875C6.25 10.2053 6.66974 10.625 7.1875 10.625H12.1875C12.7052 10.625 13.125 10.2053 13.125 9.6875C13.125 9.16974 12.7052 8.75 12.1875 8.75H7.1875Z"
                  fill="#E7FB78"
                  fillOpacity="0.8"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M26.4855 10.0047C26.4078 9.99994 26.323 9.99998 26.2351 10L26.2133 10H22.7686C19.9294 10 17.5 12.1701 17.5 15C17.5 17.8299 19.9294 20 22.7686 20H26.2133H26.2351C26.323 20 26.4078 20 26.4855 19.9953C27.6388 19.9246 28.6587 19.0483 28.7445 17.8243C28.7501 17.744 28.75 17.6575 28.75 17.5774V17.5555V12.4445V12.4227C28.75 12.3425 28.7501 12.256 28.7445 12.1757C28.6587 10.9517 27.6388 10.0754 26.4855 10.0047ZM22.4633 16.3334C23.1943 16.3334 23.7867 15.7364 23.7867 15C23.7867 14.2636 23.1943 13.6666 22.4633 13.6666C21.7323 13.6666 21.1398 14.2636 21.1398 15C21.1398 15.7364 21.7323 16.3334 22.4633 16.3334Z"
                  fill="#E7FB78"
                  fillOpacity="0.8"
                />
                <path
                  opacity="0.5"
                  d="M26.4243 10.0019C26.4243 8.52614 26.3706 6.94309 25.4272 5.80823C25.3361 5.69868 25.2393 5.5923 25.136 5.48905C24.2005 4.5536 23.0142 4.13845 21.5487 3.94143C20.1248 3.74996 18.3053 3.74999 16.008 3.75H13.367C11.0698 3.74999 9.25024 3.74996 7.82623 3.94143C6.3607 4.13845 5.17451 4.5536 4.23905 5.48905C3.3036 6.42451 2.88845 7.6107 2.69143 9.07623C2.49996 10.5002 2.49999 12.3198 2.5 14.617V14.758C2.49999 17.0553 2.49996 18.8748 2.69143 20.2987C2.88845 21.7642 3.3036 22.9505 4.23905 23.886C5.17451 24.8214 6.3607 25.2365 7.82623 25.4336C9.25023 25.625 11.0697 25.625 13.3669 25.625H16.008C18.3053 25.625 20.1248 25.625 21.5487 25.4336C23.0142 25.2365 24.2005 24.8214 25.136 23.886C25.3916 23.6303 25.6087 23.3555 25.7932 23.0608C26.3564 22.1614 26.4243 21.0591 26.4243 19.9981C26.364 20 26.3005 20 26.2352 20H22.7686C19.9294 20 17.5 17.8299 17.5 15C17.5 12.1701 19.9294 10 22.7686 10H26.2351C26.3004 9.99999 26.364 9.99996 26.4243 10.0019Z"
                  fill="#E7FB78"
                  fillOpacity="0.8"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ul className="menu hide-scrollbar w-full px-6">
              {filteredCryptoGroups?.filter((item) => item.currency_type === 'FIAT').length > 0 && (
                <p className="mb-1 px-3 text-xs font-bold">{t('casino:fiat')}</p>
              )}
              {filteredCryptoGroups
                ?.filter(
                  (item) =>
                    !(hideZeroBalances && searchValue === '' && (!item.balance || parseFloat(item.balance) === 0)),
                )
                .map(
                  (item) =>
                    item.currency_type === 'FIAT' && (
                      <li key={item.id} onClick={() => currencySelectFun(item.currency)}>
                        <a
                          className={clsx(
                            'flex h-11 items-center justify-between',
                            item.currency === user?.currency && 'bg-neutral',
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 overflow-hidden rounded-full">
                              <Image src={item?.icon || ''} className="h-full w-full object-cover" />
                            </div>
                            <p className="font-bold">{item.currency}</p>
                          </div>
                          {displayInFiat && user?.currency_fiat !== item.currency ? (
                            <div className="flex flex-col items-end">
                              <p className="text-sm font-bold">
                                {getExchangeRateFun(item.balance || '0', item.currency)}
                              </p>
                              <p className="text-base-content/50 text-xs font-semibold">
                                {convertCurrency(item.balance, {
                                  sourceCurrency: item.currency,
                                  targetCurrency: item.currency,
                                })}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-end">
                              <p className="text-sm font-semibold">
                                {convertCurrency(item.balance, {
                                  sourceCurrency: item.currency,
                                  targetCurrency: item.currency,
                                })}
                              </p>
                            </div>
                          )}
                        </a>
                      </li>
                    ),
                )}
              {filteredCryptoGroups?.filter((item) => item.currency_type === 'CRYPTO').length > 0 && (
                <p className="mt-2 mb-1 px-3 text-xs font-bold">{t('casino:crypto')}</p>
              )}
              {filteredCryptoGroups
                ?.filter(
                  (item) =>
                    !(hideZeroBalances && searchValue === '' && (!item.balance || parseFloat(item.balance) === 0)),
                )
                .map(
                  (item) =>
                    item.currency_type === 'CRYPTO' && (
                      <li key={item.id} onClick={() => currencySelectFun(item.currency)}>
                        <a
                          className={clsx(
                            'flex h-11 items-center justify-between',
                            item.currency === user?.currency && 'bg-neutral',
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 overflow-hidden rounded-full">
                              <Image src={item?.icon || ''} className="h-full w-full object-cover" />
                            </div>
                            <p className="font-bold">{item.currency}</p>
                          </div>
                          {displayInFiat ? (
                            <div className="flex flex-col items-end">
                              <p className="text-sm font-bold">
                                {getExchangeRateFun(item.balance || '0', item.currency)}
                              </p>
                              <p className="text-base-content/50 text-xs font-semibold">
                                {formatCryptoCurrency(item.balance, item.currency, {
                                  includeSymbol: false,
                                })}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm font-semibold">
                              {formatCryptoCurrency(item.balance, item.currency, {
                                includeSymbol: false,
                              })}
                            </p>
                          )}
                        </a>
                      </li>
                    ),
                )}
              {filteredCryptoGroups?.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <img src="/images/explore-empty.png" className="mb-4 h-23.5 w-23.5" />
                  <div className="text-center leading-5">
                    {t('casino:noResultsFound')} <br />
                    {t('casino:trySearchingWithDifferentKeywords')}
                  </div>
                </div>
              )}
            </ul>
          </div>
          <div className="bg-base-200 border-t-base-300 right-0 bottom-0 left-0 flex h-17 items-center justify-between px-5">
            <div className="flex items-center gap-2">
              {displayInFiat && (
                <>
                  <p className="text-sm">{t('casino:displayAs')}</p>
                  <button className="btn btn-secondary btn-xs flex items-center" onClick={handleWalletSettingsClick}>
                    {selectedCurrency !== '' && (
                      <img src={`/icons/flag/${selectedCurrency.toLowerCase()}.svg`} className="h-3 w-3" />
                    )}
                    <p className="text-xs font-semibold">{selectedCurrency}</p>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.66112 5.04695C3.87012 4.84599 4.20247 4.8525 4.40344 5.06151L7 7.81793L9.59656 5.06151C9.79753 4.8525 10.1299 4.84599 10.3389 5.04695C10.5479 5.24792 10.5544 5.58027 10.3534 5.78927L7.37844 8.93927C7.27946 9.04221 7.14281 9.10039 7 9.10039C6.85719 9.10039 6.72055 9.04221 6.62156 8.93927L3.64656 5.78927C3.4456 5.58027 3.45211 5.24792 3.66112 5.04695Z"
                        fill="#E7FB78"
                        fillOpacity="0.8"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center">
              <button className="btn btn-sm flex items-center gap-1" onClick={handleWalletSettingsClick}>
                <p className="text-sm font-normal">{t('casino:walletSettings')}</p>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.88312 3.4536C8.00366 2.73032 8.62945 2.2002 9.36271 2.2002H11.4379C12.1711 2.2002 12.7969 2.73032 12.9175 3.4536L13.0883 4.47844C13.1034 4.56923 13.1707 4.67469 13.3023 4.74754C13.3682 4.78404 13.4334 4.82175 13.4978 4.86063C13.6265 4.93837 13.7516 4.94399 13.8379 4.91166L14.8114 4.54695C15.498 4.28971 16.27 4.56659 16.6367 5.20161L17.6742 6.99877C18.0409 7.63379 17.8947 8.44079 17.3286 8.90683L16.5251 9.56828C16.454 9.62683 16.3965 9.73757 16.3992 9.88711C16.3999 9.92472 16.4003 9.96242 16.4003 10.0002C16.4003 10.038 16.3999 10.0757 16.3992 10.1133C16.3965 10.2628 16.454 10.3735 16.5251 10.4321L17.3286 11.0936C17.8947 11.5596 18.0409 12.3666 17.6742 13.0016L16.6367 14.7988C16.27 15.4338 15.498 15.7107 14.8114 15.4534L13.8379 15.0887C13.7516 15.0564 13.6266 15.062 13.4978 15.1398C13.4334 15.1786 13.3682 15.2163 13.3023 15.2529C13.1707 15.3257 13.1034 15.4312 13.0883 15.522L12.9175 16.5468C12.7969 17.2701 12.1711 17.8002 11.4379 17.8002H9.36271C8.62945 17.8002 8.00366 17.2701 7.88312 16.5468L7.71231 15.522C7.69718 15.4312 7.62991 15.3257 7.4983 15.2529C7.43236 15.2163 7.36718 15.1786 7.30279 15.1398C7.17404 15.062 7.049 15.0564 6.96269 15.0887L5.9892 15.4534C5.30254 15.7107 4.53055 15.4338 4.16392 14.7988L3.12634 13.0016C2.75971 12.3666 2.90591 11.5596 3.47202 11.0936L3.85336 11.5568L3.47202 11.0936L4.2755 10.4321C4.34662 10.3736 4.40411 10.2628 4.40134 10.1133C4.40064 10.0757 4.40029 10.038 4.40029 10.0002C4.40029 9.96243 4.40064 9.92474 4.40134 9.88712C4.40411 9.73758 4.34662 9.62684 4.2755 9.56829L3.47202 8.90684C2.90591 8.4408 2.75971 7.6338 3.12634 6.99878L4.16392 5.20163C4.53055 4.56661 5.30254 4.28972 5.9892 4.54696L6.96268 4.91166C7.04899 4.944 7.17403 4.93838 7.30278 4.86064C7.36717 4.82175 7.43235 4.78405 7.4983 4.74754C7.62991 4.67469 7.69718 4.56923 7.71231 4.47843L7.88312 3.4536ZM9.36271 3.4002C9.21605 3.4002 9.0909 3.50622 9.06679 3.65088L8.89598 4.67571C8.81137 5.18339 8.47868 5.57644 8.07946 5.79743C8.02672 5.82662 7.97459 5.85678 7.92308 5.88788C7.53177 6.12417 7.02428 6.21619 6.54169 6.03539L5.56821 5.67069C5.43088 5.61924 5.27648 5.67462 5.20315 5.80163L4.16557 7.59878C4.09224 7.72578 4.12148 7.88718 4.2347 7.98039L5.03819 8.64184C5.43508 8.96858 5.60959 9.45278 5.60113 9.90934C5.60057 9.93955 5.60029 9.96984 5.60029 10.0002C5.60029 10.0306 5.60057 10.0608 5.60113 10.0911C5.60959 10.5476 5.43508 11.0318 5.03819 11.3586L4.23471 12.02L3.96883 11.697L4.23471 12.02C4.12148 12.1132 4.09224 12.2746 4.16557 12.4016L5.20315 14.1988C5.27648 14.3258 5.43088 14.3812 5.56821 14.3297L6.5417 13.965C7.02429 13.7842 7.53178 13.8762 7.92309 14.1125C7.97459 14.1436 8.02672 14.1738 8.07946 14.203C8.47868 14.4239 8.81137 14.817 8.89598 15.3247L9.06679 16.3495C9.0909 16.4942 9.21606 16.6002 9.36271 16.6002H11.4379C11.5845 16.6002 11.7097 16.4942 11.7338 16.3495L11.9046 15.3247C11.9892 14.817 12.3219 14.4239 12.7211 14.203C12.7739 14.1738 12.826 14.1436 12.8775 14.1125C13.2688 13.8762 13.7763 13.7842 14.2589 13.965L15.2324 14.3297C15.3697 14.3811 15.5241 14.3258 15.5974 14.1988L16.635 12.4016C16.7083 12.2746 16.6791 12.1132 16.5659 12.02L15.7624 11.3585C15.3655 11.0318 15.191 10.5476 15.1995 10.0911C15.2 10.0608 15.2003 10.0306 15.2003 10.0002C15.2003 9.96984 15.2 9.93955 15.1995 9.90933C15.191 9.45277 15.3655 8.96856 15.7624 8.64183L16.5659 7.98038C16.6791 7.88717 16.7083 7.72577 16.635 7.59877L15.5974 5.80161C15.5241 5.67461 15.3697 5.61923 15.2324 5.67068L14.2589 6.03539C13.7763 6.21618 13.2688 6.12416 12.8775 5.88788C12.826 5.85677 12.7739 5.82662 12.7211 5.79743C12.3219 5.57644 11.9892 5.18339 11.9046 4.67571L11.7338 3.65088C11.7097 3.50622 11.5845 3.4002 11.4379 3.4002H9.36271ZM10.4001 8.20013C9.40599 8.20013 8.60011 9.00602 8.60011 10.0001C8.60011 10.9942 9.40599 11.8001 10.4001 11.8001C11.3942 11.8001 12.2001 10.9942 12.2001 10.0001C12.2001 9.00602 11.3942 8.20013 10.4001 8.20013ZM7.40011 10.0001C7.40011 8.34328 8.74325 7.00013 10.4001 7.00013C12.057 7.00013 13.4001 8.34328 13.4001 10.0001C13.4001 11.657 12.057 13.0001 10.4001 13.0001C8.74325 13.0001 7.40011 11.657 7.40011 10.0001Z"
                    fill="#A6ADBB"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
};

type WalletSelectDialogProps = {
  openWallet: boolean;
  handleWalletSettingsClose: () => void;
  selectedCurrency: string;
};

export const WalletSelectDialog = ({
  openWallet,
  handleWalletSettingsClose,
  selectedCurrency,
}: WalletSelectDialogProps) => {
  const walletSettingsModalRef = useRef<HTMLDialogElement>(null);
  const { updateUser: updateUserAuth, user } = useAuth();
  const { displayInFiat, setDisplayInFiat, hideZeroBalances, setHideZeroBalances } = useSettingStore();

  const [loading, setLoading] = useState(false);
  const [select, setSelect] = useState<string>(selectedCurrency || '');
  const { t } = useTranslation();

  useEffect(() => {
    setDisplayInFiat(user?.display_fiat_on === 1);
  }, [user]);

  useEffect(() => {
    if (openWallet) {
      walletSettingsModalRef.current?.showModal();
    } else {
      walletSettingsModalRef.current?.close();
    }
  }, [openWallet]);

  useEffect(() => {
    setSelect(selectedCurrency);
  }, [selectedCurrency]);

  // 保存设置
  const handleSaveSettings = () => {
    setLoading(true);

    if (!displayInFiat) {
      setLoading(false);
      handleWalletSettingsClose();
      return;
    }

    // Update currency preference in backend
    updateCurrency({ currency_fiat: select })
      .then((res) => {
        if (res.code === 0) {
          updateUserAuth(res.user);
          handleWalletSettingsClose();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSwitchDisplayInFiat = () => {
    const newDisplayInFiat = !displayInFiat;
    // setDisplayInFiat(newDisplayInFiat);

    updateUser({ display_fiat_on: newDisplayInFiat ? 1 : 0 }).then((res) => {
      if (res.code === 0) {
        // Only update the user object if it exists and has required properties
        if (user) {
          updateUserAuth({ ...user, display_fiat_on: newDisplayInFiat ? 1 : 0 });
        }
      }
    })

    // if (newDisplayInFiat) {
    //   // Update currency preference in backend
    //   updateCurrency({ currency_fiat: 'USD' })
    //     .then((res) => {
    //       if (res.code === 0) {
    //         updateUserAuth(res.user);
    //       }
    //     })
    //     .finally(() => {
    //       setLoading(false);
    //     });
    // }
  };

  // 定义所有可用货币
  const currencies: Currency[] = [
    { code: 'AED', icon: '/icons/flag/aed.svg' },
    { code: 'ARS', icon: '/icons/flag/ars.svg' },
    { code: 'AUD', icon: '/icons/flag/aud.svg' },
    { code: 'BDT', icon: '/icons/flag/bdt.svg' },
    { code: 'BRL', icon: '/icons/flag/brl.svg' },
    { code: 'CAD', icon: '/icons/flag/cad.svg' },
    { code: 'CHF', icon: '/icons/flag/chf.svg' },
    // { code: 'CNY', icon: '/icons/flag/cny.svg' },
    { code: 'EGP', icon: '/icons/flag/egp.svg' },
    { code: 'EUR', icon: '/icons/flag/eur.svg' },
    { code: 'GBP', icon: '/icons/flag/gbp.svg' },
    { code: 'HKD', icon: '/icons/flag/hkd.svg' },
    { code: 'INR', icon: '/icons/flag/inr.svg' },
    { code: 'IDR', icon: '/icons/flag/idr.svg' },
    { code: 'JPY', icon: '/icons/flag/jpy.svg' },
    { code: 'KRW', icon: '/icons/flag/krw.svg' },
    { code: 'THB', icon: '/icons/flag/thb.svg' },
    { code: 'MNT', icon: '/icons/flag/mnt.svg' },
    { code: 'MXN', icon: '/icons/flag/mxn.svg' },
    { code: 'MYR', icon: '/icons/flag/myr.svg' },
    { code: 'NZD', icon: '/icons/flag/nzd.svg' },
    { code: 'PHP', icon: '/icons/flag/php.svg' },
    { code: 'RUB', icon: '/icons/flag/rub.svg' },
    { code: 'TRY', icon: '/icons/flag/try.svg' },
    { code: 'USD', icon: '/icons/flag/usd.svg' },
    { code: 'VND', icon: '/icons/flag/vnd.svg' },
  ];

  // 将货币数组分成3列显示
  const renderCurrencyGrid = () => {
    return (
      <AnimatePresence>
        {displayInFiat && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-4 gap-x-8 pt-2 pb-4 text-xs">
              {currencies.map((currency) => (
                <div key={currency.code} className="flex items-center gap-2">
                  <img src={currency.icon} className="h-4 w-4" alt={currency.code} />
                  <span>{currency.code}</span>
                  <input
                    key={`radio-${currency.code}-${select === currency.code}`}
                    type="radio"
                    name="currency"
                    className={clsx('radio radio-xs ml-auto border', select === currency.code ? 'radio-primary' : '')}
                    checked={select === currency.code}
                    onChange={() => setSelect(currency.code)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  return (
    <>
      {/* 钱包设置弹窗 */}
      <dialog id="wallet_settings_modal" className="modal" ref={walletSettingsModalRef}>
        <div className="modal-box bg-base-100 flex flex-col gap-6 p-6">
          <form
            method="dialog"
            className="fixed top-2.5 right-2.5 z-[9999]"
            onClick={() => {
              handleWalletSettingsClose();
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

          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold">{t('casino:walletSettings')}</h3>
          </div>

          <div className="flex flex-col gap-6">
            {/* Hide Zero Balances */}
            <div className="flex flex-col gap-6 px-4 items-start">
              <div className="flex items-center justify-start gap-4">
                <input
                  type="checkbox"
                  className={clsx(
                    'toggle toggle-sm border',
                    hideZeroBalances ? 'border-primary toggle-primary' : 'border-base-content',
                  )}
                  checked={hideZeroBalances}
                  onChange={() => setHideZeroBalances(!hideZeroBalances)}
                />
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold">{t('casino:hideZeroBalances')}</h4>
                  <p className="text-base-content/70 text-xs">{t('casino:hideZeroBalancesDescription')}</p>
                </div>
              </div>

              {/* Display in Fiat */}
              <div className="flex items-center justify-start gap-4">
                <input
                  type="checkbox"
                  className={clsx(
                    'toggle toggle-sm border',
                    displayInFiat ? 'border-primary toggle-primary' : 'border-base-content',
                  )}
                  checked={displayInFiat}
                  onChange={handleSwitchDisplayInFiat}
                />
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold">{t('casino:displayInFiat')}</h4>
                  <p className="text-base-content/70 text-xs">{t('casino:displayInFiatDescription')}</p>
                </div>
              </div>
            </div>
            {/* Currency Selection */}
            {renderCurrencyGrid()}

            <div className="divider my-0 h-1" />

            <div className="flex items-center gap-2">
              <p className="text-base-content/50 flex-1 text-sm font-bold">
                {t('casino:pleaseNoteThatTheseAreCurrencyApproximations')}
              </p>
              <button className="btn btn-secondary" onClick={handleSaveSettings} disabled={loading}>
                {loading && <span className="loading loading-spinner loading-xs absolute z-10" />}
                <span className={clsx({ 'opacity-0': loading })}>{t('common.save')}</span>
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleWalletSettingsClose}>{t('common.close')}</button>
        </form>
      </dialog>
    </>
  );
};
