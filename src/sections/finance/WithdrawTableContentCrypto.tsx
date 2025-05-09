import { createCryptoWithdrawOrder } from '@/api/payment';
import { MoneyInput, SelectDropdown } from '@/components/ui';
import { AddCryptoAddressDialog } from '@/components/ui/AddCryptoAddressDialog';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { QueryUserBalance } from '@/query/balance';
import { CryptoWithdrawAddress, QueryCryptoWithdrawAddresses } from '@/query/cryptoWithdraw';
import { useSupportedCurrencies, useSupportedCryptoWithdrawGateways, useUserBalanceExtension } from '@/query/finance';
import { IUserBalance } from '@/types/auth';
import { CryptoGroup, ICryptoGateway } from '@/types/finance';
import { Decimal } from 'decimal.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function WithdrawTableContentCrypto() {
  const { t } = useTranslation();

  const { getCurrencyInfo } = useCurrencyFormatter();

  const [amount, setAmount] = useState<string>('');
  const [isOpenMinimumWithdrawalDialog, setIsOpenMinimumWithdrawalDialog] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidAmount, setIsValidAmount] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  // 地址对话框状态
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<CryptoWithdrawAddress | null>(null);

  // 币种和网络选择状态
  const [currency, setCurrency] = useState<string>('');
  const [gateway, setGateway] = useState<ICryptoGateway | null>(null);
  const [minAmount, setMinAmount] = useState<number>(10);
  const [maxAmount, setMaxAmount] = useState<number>(50000);

  // 使用React Query hooks获取支持的加密货币和网络
  const { data: supportedCurrencies = [] } = useSupportedCurrencies();
  const { data: supportedCryptoWithdrawGateways = [] } = useSupportedCryptoWithdrawGateways(currency);

  // 筛选加密货币 - 只显示类型为CRYPTO且可提款的货币(can_withdraw为1)
  const cryptoCurrencies = useMemo(() => {
    return supportedCurrencies.filter((item) => item.currency_type === 'CRYPTO' && item.can_withdraw === 1);
  }, [supportedCurrencies]);

  // 使用React Query hook获取用户已添加的提款地址，使用当前选择的网络作为查询参数
  const {
    withdrawAddresses: rawWithdrawAddresses = [],
    isLoading: isLoadingAddresses,
    refetch: refetchAddresses,
  } = QueryCryptoWithdrawAddresses(gateway?.network);

  // 确保 withdrawAddresses 不为 null
  const withdrawAddresses = rawWithdrawAddresses || [];


  // 引入余额查询hook
  const { userBalance = [] } = QueryUserBalance();

  // 引入余额扩展hook
  const { data: userBalanceExtension = [] } = useUserBalanceExtension();

  // 引用
  const containerRef = useRef<HTMLDivElement>(null);

  const presetAmounts = ['Min', '25%', '50%', 'Max'];

  // 过滤地址列表，只显示与当前选择的网络匹配的地址
  const filteredAddresses = (withdrawAddresses || []).filter(
    (addr) => !gateway?.network || addr.network === gateway?.network,
  );

  // 为AddCryptoAddressDialog准备的币种组
  const cryptoGroups = useMemo((): CryptoGroup[] => {
    if (!supportedCurrencies.length) return [];

    // 按币种分组的结构
    const groups: Record<string, CryptoGroup> = {};

    // 只包含可提款的加密货币
    const cryptos = supportedCurrencies.filter((item) => item.currency_type === 'CRYPTO' && item.can_withdraw === 1);

    cryptos.forEach((crypto) => {
      if (!groups[crypto.currency]) {
        groups[crypto.currency] = {
          currency: crypto.currency,
          networks: [],
          coins: [],
          min_deposit: crypto.min_deposit,
        };
      }
    });

    // 从网关中提取网络信息
    if (currency && supportedCryptoWithdrawGateways.length) {
      const networks = supportedCryptoWithdrawGateways.map((g) => g.network);
      if (groups[currency]) {
        groups[currency].networks = networks;
      }
    }

    return Object.values(groups);
  }, [supportedCurrencies, currency, supportedCryptoWithdrawGateways]);

  // 当加密货币列表加载完成后，默认选择第一个币种
  useEffect(() => {
    if (currency === '' && cryptoCurrencies.length > 0) {
      setCurrency(cryptoCurrencies[0].currency);
    }
  }, [cryptoCurrencies]);

  // 当币种变化或网关列表加载完成后，默认选择第一个网关
  useEffect(() => {
    if (currency !== '' && supportedCryptoWithdrawGateways.length > 0) {
      // 只选择可提款的网关 (can_withdraw === 1)
      const availableGateways = supportedCryptoWithdrawGateways.filter((gateway) => gateway.can_withdraw === 1);

      if (availableGateways.length > 0) {
        setGateway(availableGateways[0]);

        // 设置最小和最大金额
        if (availableGateways[0].min) {
          setMinAmount(availableGateways[0].min);
        }

        // 使用网关提供的max字段
        if (availableGateways[0].max) {
          setMaxAmount(availableGateways[0].max);
        }
      }
    }
  }, [supportedCryptoWithdrawGateways, currency]);

  // 当网络选择变化时，重置地址选择和金额
  useEffect(() => {
    setSelectedAddress(null);
    setAmount('');
    setActivePreset(null);
  }, [gateway]);

  // 当提款地址列表变化，且没有选择地址时，自动选择第一个匹配的地址
  useEffect(() => {
    if (filteredAddresses.length > 0 && !selectedAddress && gateway) {
      setSelectedAddress(filteredAddresses[0]);
    }
  }, [filteredAddresses, selectedAddress, gateway]);

  const handleAmountChange = (value: string) => {
    // 允许输入小数点和数字
    const numericValue = value.replace(/[^0-9.]/g, '');
    // 确保只有一个小数点
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return;
    }
    setAmount(numericValue);

    const numAmount = parseFloat(numericValue || '0');
    setIsValidAmount(numAmount >= minAmount && numAmount <= maxAmount);

    setActivePreset(null);
  };

  // 获取当前选择币种的余额信息
  const getCurrentBalance = () => {
    if (!currency) return { available: '0.00', locked: '0.00' };

    const balance = userBalance.find((b: IUserBalance) => b.currency === currency);
    if (!balance) return { available: '0.00', locked: '0.00' };

    // 获取userBalanceExtension中的withdraw_able
    const extensionBalance = userBalanceExtension.find(
      (b: { currency: string; withdraw_able: string }) => b.currency === currency,
    );
    const withdrawAble = extensionBalance ? new Decimal(extensionBalance.withdraw_able) : new Decimal(-1);
    const totalBalance = new Decimal(balance.balance);

    // 如果withdraw_able小于0或不存在扩展数据，使用总余额作为可用余额
    const availableAmount = withdrawAble.isNegative() ? totalBalance : withdrawAble;
    const locked = totalBalance.minus(availableAmount);

    // 获取货币配置的小数位数
    const currencyInfo = getCurrencyInfo(currency);
    const decimalPlaces = currencyInfo.decimalPlaces;

    return {
      available: availableAmount.toDecimalPlaces(decimalPlaces, Decimal.ROUND_DOWN).toString(),
      locked: locked.toDecimalPlaces(decimalPlaces, Decimal.ROUND_DOWN).toString(),
    };
  };

  // 格式化金额，按照当前货币的小数位显示，并去掉末尾多余的0
  const formatAmount = (value: number | string, currencyCode?: string) => {
    if (!currency && !currencyCode) return '0';

    // 获取货币配置的小数位数
    const currencyInfo = getCurrencyInfo(currencyCode || currency);
    // 使用传入的decimals参数或者currency配置的小数位
    const decimalPlaces = currencyInfo.decimalPlaces;

    // 格式化为固定小数位并去掉末尾的0
    const fixed = new Decimal(value).toFixed(decimalPlaces);
    return fixed.replace(/\.?0+$/, '');
  };

  // 处理预设金额点击
  const handlePresetClick = (preset: string, index: number) => {
    const { available } = getCurrentBalance();
    const availableAmount = parseFloat(available);
    let newAmount = 0;

    switch (preset) {
      case 'Min':
        newAmount = minAmount;
        break;
      case '25%':
        newAmount = Math.min(availableAmount * 0.25, maxAmount);
        break;
      case '50%':
        newAmount = Math.min(availableAmount * 0.5, maxAmount);
        break;
      case 'Max':
        newAmount = Math.min(availableAmount, maxAmount);
        break;
    }

    // 确保金额不小于最小限额
    if (newAmount < minAmount) {
      newAmount = minAmount;
    }

    // 格式化金额，按照当前货币配置的小数位格式化
    const formattedAmount = formatAmount(newAmount);

    setAmount(formattedAmount);
    setIsValidAmount(newAmount >= minAmount && newAmount <= maxAmount);
    setActivePreset(index);
  };

  // 计算提款总金额（包括手续费）
  const getTotalWithdrawAmount = useMemo(() => {
    if (!amount || !currency) return formatAmount(0);
    // Total amount is simply what the user entered
    const amountNum = parseFloat(amount) || 0;
    return formatAmount(amountNum);
  }, [amount, currency, formatAmount]);

  // 计算提款手续费
  const getWithdrawalFee = useMemo(() => {
    if (!gateway || !amount || !currency) return formatAmount(0);
    const amountNum = parseFloat(amount) || 0;
    // Calculate fee using fee_rate (percentage) and fee_fix (fixed amount)
    const fee = amountNum * (gateway.fee_rate || 0) + (gateway.fee_fix || 0);
    return formatAmount(fee);
  }, [gateway, amount, currency, formatAmount]);

  // 计算用户实际收到的金额（总金额减去手续费）
  const getActualWithdrawAmount = useMemo(() => {
    if (!gateway || !amount || !currency) return formatAmount(0);
    const amountNum = parseFloat(amount) || 0;
    const fee = amountNum * (gateway.fee_rate || 0) + (gateway.fee_fix || 0);
    // Actual amount is what the user will receive (total - fees)
    const actualAmount = Math.max(amountNum - fee, 0);
    return formatAmount(actualAmount);
  }, [amount, currency, gateway, formatAmount]);

  // 处理币种变更
  const handleCurrencyChange = (value: string | number) => {
    setCurrency(value as string);
    setGateway(null);
  };

  // 处理网络变更
  const handleNetworkChange = (value: string | number) => {
    const network = value as string;
    const selectedGateway = supportedCryptoWithdrawGateways.find(
      (item) => item.network === network && item.can_withdraw === 1,
    );

    if (selectedGateway) {
      setGateway(selectedGateway);

      // 更新最小金额
      if (selectedGateway.min) {
        setMinAmount(selectedGateway.min);
      }

      // 更新最大金额，使用网关指定的max值
      if (selectedGateway.max) {
        setMaxAmount(selectedGateway.max);
      }
    }
  };

  // 处理地址选择变化
  const handleAddressChange = (value: string | number) => {
    const addressId = value as string;

    // 如果选择了"添加新地址"选项
    if (addressId === 'add-new-address') {
      handleAddNewAddress();
      return;
    }

    // 如果withdrawAddresses存在，查找对应ID的地址
    const address = withdrawAddresses && withdrawAddresses.find((addr) => addr.id.toString() === addressId.toString());
    if (address) {
      setSelectedAddress(address);
    }
  };

  // 处理添加新地址
  const handleAddNewAddress = () => {
    setIsAddressDialogOpen(true);
  };

  // 添加地址成功回调
  const handleAddressAdded = () => {
    refetchAddresses();
  };

  // 构建加密货币选项
  const cryptoOptions = cryptoCurrencies.map((item) => ({
    id: item.currency,
    value: item.currency,
    label: item.display_name || item.currency,
    icon: <img src={`/icons/tokens/${item.currency.toLowerCase()}.svg`} className="h-4 w-4" alt={item.currency} />,
  }));

  // 构建网络选项
  const networkOptions = supportedCryptoWithdrawGateways.map((item) => ({
    id: item.network,
    value: item.network,
    label: item.network,
    disabled: item.can_withdraw !== 1,
    icon: <img src={`/icons/tokens/${item.network.toLowerCase()}.svg`} className="h-4 w-4" alt={item.network} />,
  }));

  // 构建地址选项
  const addressOptions = [
    // 现有地址选项
    ...filteredAddresses.map((address) => ({
      id: address.id,
      value: address.id,
      // 如果地址有name字段则使用，否则使用地址的简短版本作为标签
      label:
        address.name || `${address.address.substring(0, 8)}...${address.address.substring(address.address.length - 8)}`,
      // 如果有name字段则显示地址简短版本，否则显示网络信息
      secondaryText: address.name
        ? `${address.address.substring(0, 8)}...${address.address.substring(address.address.length - 8)}`
        : `${address.network || 'Unknown'} Network`,
    })),

    // 添加一个特殊的"添加新地址"选项
    {
      id: 'add-new-address',
      value: 'add-new-address',
      label: t('finance:add_withdrawal_address'),
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.60005 5.40078C8.60005 5.06941 8.33142 4.80078 8.00005 4.80078C7.66868 4.80078 7.40005 5.06941 7.40005 5.40078V7.40078H5.40005C5.06868 7.40078 4.80005 7.66941 4.80005 8.00078C4.80005 8.33215 5.06868 8.60078 5.40005 8.60078L7.40005 8.60078V10.6008C7.40005 10.9322 7.66868 11.2008 8.00005 11.2008C8.33142 11.2008 8.60005 10.9322 8.60005 10.6008V8.60078L10.6 8.60078C10.9314 8.60078 11.2 8.33215 11.2 8.00078C11.2 7.66941 10.9314 7.40078 10.6 7.40078H8.60005V5.40078Z"
            fill="#A6ADBB"
          />
        </svg>
      ),
      // 自定义渲染添加新地址选项，使其更醒目
      customRender: (
        <div
          className="bg-base-300 hover:bg-base-300 -mx-4 flex cursor-pointer items-center gap-4 rounded-lg p-4 transition-colors"
          onClick={handleAddNewAddress}
        >
          <img src="/icons/isometric/8.svg" className="h-12 w-12" />
          <div className="flex flex-col gap-2">
            <p className="text-neutral-content text-sm font-bold">{t('finance:add_withdrawal_address')}</p>
            <p className="text-xs">{t('finance:kindly_fill_in_your_crypto_withdrawal_address_details')}</p>
          </div>
          <div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.60005 5.40078C8.60005 5.06941 8.33142 4.80078 8.00005 4.80078C7.66868 4.80078 7.40005 5.06941 7.40005 5.40078V7.40078H5.40005C5.06868 7.40078 4.80005 7.66941 4.80005 8.00078C4.80005 8.33215 5.06868 8.60078 5.40005 8.60078L7.40005 8.60078V10.6008C7.40005 10.9322 7.66868 11.2008 8.00005 11.2008C8.33142 11.2008 8.60005 10.9322 8.60005 10.6008V8.60078L10.6 8.60078C10.9314 8.60078 11.2 8.33215 11.2 8.00078C11.2 7.66941 10.9314 7.40078 10.6 7.40078H8.60005V5.40078Z"
                fill="#A6ADBB"
              />
            </svg>
          </div>
        </div>
      ),
    },
  ];

  // 自定义渲染选项函数
  const customRenderOption = (option: any) => {
    if (option.customRender) {
      return option.customRender;
    }

    return (
      <div className="flex items-center gap-4 text-sm">
        {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
        <div className="flex flex-col">
          <span>{option.label}</span>
          {option.secondaryText && <span className="text-base-content/60 text-xs">{option.secondaryText}</span>}
        </div>
      </div>
    );
  };

  // 渲染地址选择或添加地址按钮
  const renderAddressSection = () => {
    if (isLoadingAddresses) {
      return (
        <div className="bg-base-200 flex h-[100px] items-center justify-center rounded-lg">
          <div className="loading loading-spinner loading-md"></div>
        </div>
      );
    }

    // 如果没有添加过地址或当前选择网络没有匹配的地址
    if (!withdrawAddresses || withdrawAddresses.length === 0 || filteredAddresses.length === 0) {
      return (
        <div
          className="bg-base-200 hover:bg-base-300 flex cursor-pointer items-center gap-4 rounded-lg p-4 transition-colors"
          onClick={handleAddNewAddress}
        >
          <img src="/icons/isometric/8.svg" className="h-12 w-12" />
          <div className="flex flex-col gap-2">
            <p className="text-neutral-content text-sm font-bold">{t('finance:add_withdrawal_address')}</p>
            <p className="text-xs">{t('finance:kindly_fill_in_your_crypto_withdrawal_address_details')}</p>
          </div>
          <div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.60005 5.40078C8.60005 5.06941 8.33142 4.80078 8.00005 4.80078C7.66868 4.80078 7.40005 5.06941 7.40005 5.40078V7.40078H5.40005C5.06868 7.40078 4.80005 7.66941 4.80005 8.00078C4.80005 8.33215 5.06868 8.60078 5.40005 8.60078L7.40005 8.60078V10.6008C7.40005 10.9322 7.66868 11.2008 8.00005 11.2008C8.33142 11.2008 8.60005 10.9322 8.60005 10.6008V8.60078L10.6 8.60078C10.9314 8.60078 11.2 8.33215 11.2 8.00078C11.2 7.66941 10.9314 7.40078 10.6 7.40078H8.60005V5.40078Z"
                fill="#A6ADBB"
              />
            </svg>
          </div>
        </div>
      );
    }

    // 如果有匹配的地址
    return (
      <div className="flex flex-col gap-2">
        <SelectDropdown
          options={addressOptions}
          value={selectedAddress?.id || ''}
          onChange={handleAddressChange}
          placeholder="Select Address"
          className="w-full"
          renderOption={customRenderOption}
        />
      </div>
    );
  };

  // 处理提交取款订单
  const handleSubmit = async () => {
    if (!selectedAddress || !amount || !isValidAmount || !currency || !gateway) {
      return;
    }

    setIsSubmitting(true);
    try {
      // 准备参数
      const params = {
        amount: parseFloat(amount),
        pin: '1234', // 暂时硬编码
        currency: currency,
        network: gateway.network,
        wallet_address: selectedAddress.address,
      };

      // 调用API创建订单
      await createCryptoWithdrawOrder(params);

      // 成功提示
      toast.success(t('toast:withdrawalOrderCreatedSuccessfully'));

      // 重置表单
      setAmount('');
      setActivePreset(null);
    } catch (error: any) {
      console.error('Failed to create withdrawal order:', error);
      toast.error(error?.message || t('toast:failedToCreateWithdrawalOrder'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={containerRef} className="bg-base-100 flex flex-col gap-3 pb-3">
      {/* <Toaster position="top-center" richColors /> */}
  
      <div className="grid grid-cols-2 items-center gap-2">
        <div className="flex flex-col">
          <p className="px-1 py-2 text-sm">{t('finance:withdrawalCurrency')}</p>
          <SelectDropdown
            options={cryptoOptions}
            value={currency}
            onChange={handleCurrencyChange}
            placeholder="Select Currency"
          />
        </div>

        <div className="flex flex-col">
          <p className="px-1 py-2 text-sm">{t('finance:withdrawalNetwork')}</p>
          <SelectDropdown
            options={networkOptions}
            value={gateway?.network || ''}
            onChange={handleNetworkChange}
            placeholder="Select Network"
            disabled={!currency || networkOptions.length === 0}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <p className="px-1 py-2 text-sm">{t('finance:withdrawalAddress')}</p>
        {renderAddressSection()}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between px-1 py-2">
          <p className="text-sm">{t('finance:withdrawalAmount')}</p>
          <div className="flex items-center gap-1" onClick={() => setIsOpenMinimumWithdrawalDialog(true)}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 1.875C3.72183 1.875 1.875 3.72183 1.875 6C1.875 8.27817 3.72183 10.125 6 10.125C8.27817 10.125 10.125 8.27817 10.125 6C10.125 3.72183 8.27817 1.875 6 1.875ZM1.125 6C1.125 3.30761 3.30761 1.125 6 1.125C8.69239 1.125 10.875 3.30761 10.875 6C10.875 8.69239 8.69239 10.875 6 10.875C3.30761 10.875 1.125 8.69239 1.125 6ZM5.625 4.125C5.625 3.91789 5.79289 3.75 6 3.75H6.00375C6.21086 3.75 6.37875 3.91789 6.37875 4.125V4.12875C6.37875 4.33586 6.21086 4.50375 6.00375 4.50375H6C5.79289 4.50375 5.625 4.33586 5.625 4.12875V4.125ZM5.47804 5.27922C6.05116 4.99266 6.69646 5.51031 6.54106 6.13194L6.18655 7.54996L6.20729 7.53959C6.39253 7.44697 6.61778 7.52205 6.71041 7.70729C6.80303 7.89253 6.72795 8.11778 6.54271 8.21041L6.52197 8.22078C5.94885 8.50734 5.30354 7.98969 5.45894 7.36806L5.81345 5.95004L5.79271 5.96041C5.60746 6.05303 5.38221 5.97795 5.28959 5.79271C5.19697 5.60746 5.27205 5.38221 5.45729 5.28959L5.47804 5.27922Z"
                fill="#A6ADBB"
              />
            </svg>
            <p className="text-xs">
              Min: {formatAmount(minAmount)} {currency || 'USDT'}
            </p>
          </div>
        </div>

        <MoneyInput
          placeholder="0.00"
          className={`bg-base-200 h-12 border ${isValidAmount ? 'border-base-content/20' : 'border-error'}`}
          onChange={handleAmountChange}
          value={amount}
        />

        {!isValidAmount && (
          <p className="text-error text-xs">
            {t('finance:pleaseEnterAnAmountBetween')} {formatAmount(minAmount)} {t('finance:and')} {formatAmount(maxAmount)} {currency || 'USDT'}
          </p>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {presetAmounts.map((preset, index) => (
          <button
            key={index}
            className={`btn btn-sm ${activePreset === index ? 'border-primary text-primary/80 border' : ''} transition-all`}
            onClick={() => handlePresetClick(preset, index)}
          >
            {preset}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between px-1 py-2 text-sm">
        <p>
          {t('finance:available')}:{' '}
          <span className="font-semibold">
            {getCurrentBalance().available} {currency || 'USDT'}
          </span>
        </p>
        <p>
          {t('finance:locked')}:{' '}
          <span className="font-semibold">
            {getCurrentBalance().locked} {currency || 'USDT'}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-2 px-2">
        <div className="flex items-center justify-between text-sm">
          <p className="text-primary/80 font-bold">{t('finance:withdrawAmount')}</p>
          <p className="text-primary/80 font-bold">
            {getActualWithdrawAmount} {currency || 'USDT'}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <p>{t('finance:fee')}</p>
          <p>
            {getWithdrawalFee} {currency || 'USDT'}
            {gateway?.fee_rate ? ` (${gateway.fee_rate * 100}% + ${formatAmount(gateway.fee_fix || 0)})` : ''}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <p>{t('finance:totalWithdrawAmount')}</p>
          <p>
            {getTotalWithdrawAmount} {currency || 'USDT'}
          </p>
        </div>
      </div>

      <button
        className="btn btn-primary btn-md flex h-[48px] items-center justify-center text-sm font-semibold"
        disabled={!selectedAddress || !amount || !isValidAmount || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <>
            {t('finance:submitting')}
            <span className="loading loading-spinner loading-sm ml-2"></span>
          </>
        ) : (
          t('finance:continue')
        )}
      </button>

      <div
        className="flex items-center gap-4 rounded-lg p-4"
        style={{
          background:
            'radial-gradient(100% 157.05% at 0% 46.47%, color(display-p3 1.000 0.745 0.000 / 0.4) 0%, color(display-p3 0.200 0.200 0.200 / 0.08) 100%), color(display-p3 0.114 0.137 0.165)',
        }}
      >
        <img src="/icons/isometric/23.svg" className="h-12 w-12" />
        <p className="text-sm leading-5">
          {t('finance:forSecurityPurposesLargeOrSuspiciousWithdrawalsMayTakeUpTo24HoursToProcess')}
        </p>
      </div>

      {/* 添加地址对话框 */}
      <AddCryptoAddressDialog
        isOpen={isAddressDialogOpen}
        onClose={() => setIsAddressDialogOpen(false)}
        onSuccess={handleAddressAdded}
        defaultNetwork={gateway?.network}
        cryptoGroups={cryptoGroups}
      />

      {/* 最低充值提示框 */}
      <ModalDialog
        className="w-xs"
        open={isOpenMinimumWithdrawalDialog}
        onClose={() => setIsOpenMinimumWithdrawalDialog(false)}
      >
        <p className="text-sm leading-5">{t('finance:minimumWithdrawalAmountTooltip')}</p>
      </ModalDialog>
    </div>
  );
}
