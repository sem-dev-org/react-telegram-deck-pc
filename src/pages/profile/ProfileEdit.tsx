import { updateUser } from '@/api/profile';
import { FullBleedContainer, Page, SafeContent } from '@/components/ui';
import { useAuth } from '@/contexts/auth';
import { paths } from '@/routes/paths';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { user, updateUser: updateUserAuth } = useAuth();

  const [nickname, setNickname] = useState('');

  const validateNickname = (value: string) => {
    // Remove spaces
    value = value.replace(/\s/g, '');

    // Only allow letters, numbers and underscores
    value = value.replace(/[^a-zA-Z0-9_]/g, '');

    // If first character is not a letter, remove it
    if (value.length > 0 && !/^[a-zA-Z]/.test(value)) {
      value = value.substring(1);
    }

    // Capitalize first letter
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    return value;
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedValue = validateNickname(e.target.value);
    setNickname(validatedValue);
    setNicknameHasError(false);
  };

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (user?.nickname !== nickname) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [user, nickname]);

  const [avatar, setAvatar] = useState('');

  useMemo(() => {
    if (user?.nickname) {
      setNickname(user?.nickname);
    }
    if (user?.avatar) {
      setAvatar(user?.avatar);
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [nicknameHasError, setNicknameHasError] = useState(false);

  const updateUsername = () => {
    if (nickname.length < 6 || nickname.length > 16) {
      setNicknameHasError(true);
      return;
    }
    setLoading(true);

    updateUser({
      nickname: nickname,
    })
      .then((res) => {
        if (res.code === 0) {
          navigate(-1);
          if (user) {
            updateUserAuth({
              ...user,
              nickname: nickname,
            });
          }
          navigate(-1);
          toast.success(t('toast:editSuccess'));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <FullBleedContainer>
      <SafeContent>
        <Page className="p-6">
          <div className="flex w-full flex-col items-center gap-3">
            <div className="relative" onClick={() => navigate(paths.main.profile.avatar)}>
              <img src={avatar || '/icons/avatar/default.png'} className="h-20 w-20 rounded-full" />
              <div className="bg-base-100 absolute right-0 bottom-0 flex h-5 w-5 items-center justify-center rounded-full">
                <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6.20001 9.07548L9.89801 5.37748C9.27584 5.11771 8.71079 4.73819 8.23501 4.26048C7.75708 3.78458 7.37737 3.21936 7.11751 2.59698L3.41951 6.29498C3.13101 6.58348 2.98651 6.72798 2.86251 6.88698C2.71606 7.07462 2.59049 7.27765 2.48801 7.49248C2.40151 7.67448 2.33701 7.86848 2.20801 8.25548L1.52701 10.297C1.49567 10.3904 1.49102 10.4908 1.51358 10.5868C1.53615 10.6828 1.58503 10.7705 1.65475 10.8402C1.72446 10.91 1.81223 10.9588 1.9082 10.9814C2.00417 11.004 2.10454 10.9993 2.19801 10.968L4.23951 10.287C4.62701 10.158 4.82051 10.0935 5.00251 10.007C5.21751 9.90448 5.42051 9.77898 5.60801 9.63248C5.76701 9.50848 5.91151 9.36398 6.20001 9.07548ZM10.924 4.35148C11.2927 3.98276 11.4999 3.48267 11.4999 2.96123C11.4999 2.43978 11.2927 1.93969 10.924 1.57098C10.5553 1.20226 10.0552 0.995117 9.53376 0.995117C9.01231 0.995117 8.51223 1.20226 8.14351 1.57098L7.70001 2.01448L7.71901 2.06998C7.93756 2.69534 8.29522 3.26293 8.76501 3.72998C9.24602 4.21383 9.83349 4.57853 10.4805 4.79498L10.924 4.35148Z"
                    fill="#E7FB78"
                    fillOpacity="0.8"
                  />
                </svg>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <fieldset className="fieldset">
                <h4 className="text-sm leading-5">{t('common.username')}</h4>
                <div className="relative">
                  <input
                    type="text"
                    value={nickname}
                    onChange={handleNicknameChange}
                    className={`input bg-base-100 h-12 w-full rounded-md px-4 text-base ${
                      nicknameHasError ? 'input-error border-error border' : ''
                    }`}
                    maxLength={16}
                    minLength={6}
                  />
                  {nicknameHasError && (
                    <p className="validator-hint text-error text-xs leading-4">{t('profile:nicknameIsRequired')}</p>
                  )}
                </div>
              </fieldset>

              <p className="relative text-xs">{t('common.usernameDescription')}</p>
            </div>
            {isDisabled ? (
              <button
                disabled={loading}
                className="btn btn-md btn-neutral h-12 w-full border-none"
                onClick={() => navigate(-1)}
              >
                {t('common.close')}
              </button>
            ) : (
            <button
              className="btn btn-md btn-primary h-12 w-full border-none"
              disabled={loading}
              onClick={updateUsername}
            >
                {loading ? <span className="loading loading-spinner loading-sm text-primary"></span> : t('common.save')}
              </button>
            )}
          </div>
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
}
