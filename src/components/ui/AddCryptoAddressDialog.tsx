import { addCryptoWithdrawAddress } from '@/api/payment';
import { ICoin } from '@/types/finance';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { SelectDropdown } from '.';

// 按币种分组的加密货币信息
interface CryptoGroup {
  currency: string;
  networks: string[];
  coins: ICoin[]; // 储存原始币种信息
}

interface AddCryptoAddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cryptoGroups: CryptoGroup[];
  defaultNetwork?: string;
}

export function AddCryptoAddressDialog({
  isOpen,
  onClose,
  onSuccess,
  cryptoGroups,
  defaultNetwork,
}: AddCryptoAddressDialogProps) {
  const { t } = useTranslation();
  const [addressName, setAddressName] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(defaultNetwork || '');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 构建网络选项：从所有币种中收集所有唯一的网络
  const networkOptions = useMemo(() => {
    // 收集所有唯一的网络
    const uniqueNetworks = new Set<string>();
    cryptoGroups.forEach((group) => {
      group.networks.forEach((network) => {
        uniqueNetworks.add(network);
      });
    });

    // 转换为选项格式
    return Array.from(uniqueNetworks).map((network) => ({
      id: network,
      value: network,
      label: network,
      icon: <img src={`/icons/tokens/${network.toLowerCase()}.svg`} className="h-4 w-4" alt={network} />,
    }));
  }, [cryptoGroups]);

  // 处理网络选择变化
  const handleNetworkChange = (value: string | number) => {
    setSelectedNetwork(value as string);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    // 表单验证
    if (!addressName.trim()) {
      toast.error(t('toast:pleaseEnterAddressName'));
      return;
    }

    if (!selectedNetwork) {
      toast.error(t('toast:pleaseSelectNetwork'));
      return;
    }

    if (!address.trim()) {
      toast.error(t('toast:pleaseEnterAddress'));
      return;
    }

    setIsSubmitting(true);

    try {
      // 准备参数
      const params = {
        name: addressName.trim(),
        network: selectedNetwork,
        address: address.trim(),
      };

      // 调用API添加地址
      await addCryptoWithdrawAddress(params);

      // 成功处理
      toast.success(t('toast:walletAddressAddedSuccessfully'));

      // 清空表单
      setAddressName('');
      setAddress('');

      // 关闭对话框
      onClose();

      // 触发成功回调
      onSuccess();
    } catch (error) {
      console.error('Failed to add address:', error);
      toast.error(t('toast:failedToAddAddress'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-base-300 w-full max-w-md rounded-xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{t('finance:add_withdrawal_address')}</h2>
          <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose} disabled={isSubmitting}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm px-1">
              {t('finance:address_name')} <span className="text-error">*</span>
            </label>
            <input
              type="text"
              className="input input-bordered bg-base-200 h-12 w-full"
              placeholder={t('finance:address_name')}
              value={addressName}
              onChange={(e) => setAddressName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm">
              {t('finance:withdrawal_network')} <span className="text-error">*</span>
            </label>
            <SelectDropdown
              options={networkOptions}
              value={selectedNetwork}
              onChange={handleNetworkChange}
              placeholder="Select Network"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm px-1">
              {t('finance:address')} <span className="text-error">*</span>
            </label>
            <input
              type="text"
              className="input input-bordered bg-base-200 h-12 w-full text-sm"
              placeholder={t('finance:address')}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <button className="btn btn-primary mt-4 h-12 w-full" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {t('finance:saving')}
              </>
            ) : (
              t('finance:save')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
