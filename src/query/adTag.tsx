import { IAdTag } from '@/types/referral';
import { useQuery } from '@tanstack/react-query';
import { getAdTagList, getDefaultAdTag, getTelegramBotBaseUrl } from '@/api/referral';
import { useAuth } from '@/contexts/auth';
import { IBaseUrl } from '@/types/auth';
import { useMemo } from 'react';
import { getReferralLink } from '@/utils/auth';
import useIsTma from '@/hooks/isTma';

export const QueryAdTagList = () => {
  const { user } = useAuth();

  const { data: adTagList = { data: [], code: 0 }, refetch } = useQuery<{ data: IAdTag[]; code: number }>({
    queryKey: ['adTagList'],
    queryFn: () => getAdTagList(),
    enabled: !!user,
  });

  return {
    adTagList: adTagList.code === 0 ? adTagList?.data : [],
    refetch,
  };
};

export const QueryDefaultAdTag = () => {
  const { user } = useAuth();
  const defaultAdTag: IAdTag = {
    id: 0,
    code: '',
    note: null,
    team_id: 0,
    host: '',
    user_id: 0,
    register_count: 0,
    deposit_count: 0,
    withdraw_count: 0,
    purchase_count: 0,
    onboard_count: 0,
    invitations: 0,
    created_at: 0,
    updated_at: 0,
    deposit_amount: '',
    withdraw_amount: '',
    purchase_amount: '',
    deposit_customer: 0,
    withdraw_customer: 0,
    purchase_customer: 0,
    invitations_deposit: 0,
    invitations_deposit_amount: '',
    invitations_withdraw: 0,
    invitations_withdraw_amount: '',
    invitations_purchase: 0,
    invitations_purchase_amount: '',
    promotion_count: 0,
    promotion_amount: '',
    daily_check_in_count: 0,
    share_to_referee: 0,
    is_default: 0,
    campaign: '',
  };

  const { data: defaultAdTagData = { data: defaultAdTag, code: 0 }, refetch } = useQuery<{
    data: IAdTag;
    code: number;
  }>({
    queryKey: ['adTagGetDefault'],
    queryFn: () => getDefaultAdTag(),
    enabled: !!user,
  });

  return {
    defaultAdTag: defaultAdTagData.code === 0 ? defaultAdTagData?.data : defaultAdTag,
    refetch,
  };
};

export const QueryBaseUrl = () => {
  const { defaultAdTag } = QueryDefaultAdTag();

  const { user } = useAuth();

  const { data: baseUrlArr = { data: { host: '', tg_url_base: '' } as IBaseUrl, code: 0 }, refetch } = useQuery<{
    data: IBaseUrl;
    code: number;
  }>({
    queryKey: ['baseUrl'],
    queryFn: () => getTelegramBotBaseUrl(),
  });

  const isTmaApp = useIsTma();

  const baseUrl = useMemo(() => {
    return isTmaApp ? baseUrlArr.data.tg_url_base : 'https://' + baseUrlArr.data.host;
  }, [isTmaApp, baseUrlArr]);

  return {
    baseUrl: user ? getReferralLink(baseUrl, defaultAdTag?.code || '') : '',
    baseUrlArr:
      baseUrlArr.code === 0 && user
        ? {
            h5: 'https://' + baseUrlArr.data.host,
            telegram: baseUrlArr.data.tg_url_base,
          }
        : {
            h5: '',
            telegram: '',
          },
    refetch,
  };
};
