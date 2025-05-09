import { updateUser, uploadPublicImage } from '@/api/profile';
import { FullBleedContainer, Page, SafeContent } from '@/components/ui';
import { useEffect, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';

export default function ProfileAvatar() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedAvatar, setSelectedAvatar] = useState<number>(0);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(null);

  const [scale, setScale] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);
  const { user, updateUser: updateUserAuth } = useAuth();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const scaleFun = (e: string) => {
    if (e === '+') {
      setScale(Math.min(2, scale + 0.2));
    } else if (e === '-') {
      setScale(Math.max(1, scale - 0.2));
    }
  };

  const rotateFun = (e: string) => {
    if (e === '+') {
      setRotate(rotate + 90);
    } else if (e === '-') {
      setRotate(rotate - 90);
    }
  };

  useEffect(() => {
    if (user) {
      setSelectedAvatar(-1);
      setCustomAvatarUrl(user.avatar);
    }
  }, [user]);

  useEffect(() => {
    setScale(1);
    setRotate(0);
  }, [customAvatarUrl, selectedAvatar]);

  const editorRef = useRef<AvatarEditor>(null);
  const [loading, setLoading] = useState(false);

  const saveAvatar = () => {
    const formData = new FormData();

    if (editorRef.current) {
      // Get the edited canvas
      const canvas = editorRef.current.getImageScaledToCanvas();

      // Convert canvas to blob directly instead of using toDataURL
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'avatar.png', { type: 'image/png' });
          formData.append('file', file);

          setLoading(true);
          uploadPublicImage(formData)
            .then((res) => {
              const data = res.data;

              if (data.code === 0) {
                // Handle successful upload
                updateUser({
                  avatar: data.data.public_url,
                })
                  .then((updateRes) => {
                    if (updateRes.code === 0) {
                      if (user) {
                        updateUserAuth({
                          ...user,
                          avatar: data.data.public_url,
                        });
                      }
                      navigate(-1);
                      toast.success(t('toast:editSuccess'));
                    }
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }
      }, 'image/png');
    }
  };

  return (
    <FullBleedContainer>
      <SafeContent>
        <Page className="">
          <div className="px-6">
            <AvatarEditor
              ref={editorRef}
              image={
                selectedAvatar === -1 && customAvatarUrl
                  ? customAvatarUrl
                  : `/icons/avatar/Avatar-${selectedAvatar}.png`
              }
              width={300}
              height={300}
              border={0}
              color={[0, 0, 0, 0.5]} // RGBA
              scale={scale}
              rotate={rotate}
              borderRadius={300}
              className="mx-auto"
            />
          </div>
          <div className="bg-base-100 flex h-20 w-full items-center justify-between p-4">
            <div className="bg-base-200 flex h-full w-full items-center justify-around rounded-lg">
              <div onClick={() => scaleFun('-')}>
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                  <path
                    d="M273.92 273.92a330.666667 330.666667 0 0 1 489.130667 443.904l102.826666 102.826667a32 32 0 0 1-41.984 48.085333l-3.285333-2.858667-102.826667-102.826666A330.666667 330.666667 0 0 1 273.92 273.92z m45.226667 45.226667a266.666667 266.666667 0 1 0 377.130666 377.130666A266.666667 266.666667 0 0 0 319.146667 319.146667zM384 469.333333h256v85.333334H384v-85.333334z"
                    fill="#ffffff"
                  ></path>
                </svg>
              </div>
              <div onClick={() => scaleFun('+')}>
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                  <path
                    d="M273.92 273.92a330.666667 330.666667 0 0 1 489.130667 443.904l102.826666 102.826667a32 32 0 0 1-41.984 48.085333l-3.285333-2.858667-102.826667-102.826666A330.666667 330.666667 0 0 1 273.92 273.92z m45.226667 45.226667a266.666667 266.666667 0 1 0 377.130666 377.130666A266.666667 266.666667 0 0 0 319.146667 319.146667zM469.333333 384h85.333334v85.333333h85.333333v85.333334h-85.333333v85.333333h-85.333334v-85.333333H384v-85.333334h85.333333V384z"
                    fill="#ffffff"
                  ></path>
                </svg>
              </div>
              <div>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.01}
                  value={scale}
                  className={`slider-input`}
                  onChange={(e) => {
                    setScale(Number(e.target.value));
                  }}
                />
              </div>
              <div onClick={() => rotateFun('-')}>
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                  <path
                    d="M153.6 272.3328L192.256 128l40.6016 70.2976a405.76 405.76 0 0 1 204.2368-55.8592 409.6 409.6 0 0 1 173.2096 780.9024 25.6 25.6 0 1 1-21.6576-46.3872 358.4 358.4 0 0 0-151.552-683.3152 355.2768 355.2768 0 0 0-178.7392 48.8448l39.5776 68.5056z"
                    fill="#ffffff"
                    opacity=".2"
                  ></path>
                  <path
                    d="M153.6 246.784l38.656-144.3328 40.6016 70.2976a405.76 405.76 0 0 1 204.2368-55.8592 409.6 409.6 0 0 1 173.2096 780.9024 25.6 25.6 0 1 1-21.6576-46.3872 358.4 358.4 0 0 0-151.552-683.3152 355.2768 355.2768 0 0 0-178.7392 48.8448l39.5776 68.5056z"
                    fill="#ffffff"
                  ></path>
                </svg>
              </div>
              <div onClick={() => rotateFun('+')}>
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                  <path
                    d="M846.7456 272.3328L808.0384 128l-40.5504 70.2976A405.9648 405.9648 0 0 0 563.2 142.4384a409.6 409.6 0 0 0-173.1584 780.9024 25.6 25.6 0 1 0 21.76-46.1824 358.4 358.4 0 0 1 151.5008-683.3152 355.2768 355.2768 0 0 1 178.7392 48.8448l-39.5264 68.5056z"
                    fill="#ffffff"
                    opacity=".2"
                  ></path>
                  <path
                    d="M846.7456 246.784l-38.7072-144.3328-40.5504 70.2976A405.9648 405.9648 0 0 0 563.2 116.8896a409.6 409.6 0 0 0-173.1584 780.9024 25.6 25.6 0 1 0 21.76-46.1824 358.4 358.4 0 0 1 151.5008-683.3152 355.2768 355.2768 0 0 1 178.7392 48.8448l-39.5264 68.5056z"
                    fill="#ffffff"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-3 max-w-81.75">
            <div className="mb-1 text-lg leading-7 font-bold">{t('common.defaultAvatars')}</div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 14 }, (_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setCustomAvatarUrl(null);
                    setSelectedAvatar(i);
                    setIsDisabled(false);
                  }}
                  className="h-14 w-14 rounded-full border-3"
                  style={{
                    borderColor: selectedAvatar === i ? 'color(display-p3 0.831 0.655 0.302)' : 'transparent',
                    transition: 'border-color 0.2s ease-in-out',
                  }}
                >
                  <img key={i} src={`/icons/avatar/Avatar-${i}.png`} alt={`Avatar ${i}`} className="h-full w-full" />
                </div>
              ))}
              <div
                className="flex h-14 w-14 cursor-pointer items-center justify-center"
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Handle custom avatar upload
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          // Set custom avatar
                          setSelectedAvatar(-1); // Use -1 to indicate custom avatar
                          setCustomAvatarUrl(event.target.result as string);
                          setIsDisabled(false);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <div>
                  <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.8998 2.1998C12.8998 1.42661 12.273 0.799805 11.4998 0.799805C10.7266 0.799805 10.0998 1.42661 10.0998 2.1998V10.5998H1.6998C0.926606 10.5998 0.299805 11.2266 0.299805 11.9998C0.299805 12.773 0.926606 13.3998 1.6998 13.3998L10.0998 13.3998V21.7998C10.0998 22.573 10.7266 23.1998 11.4998 23.1998C12.273 23.1998 12.8998 22.573 12.8998 21.7998V13.3998L21.2998 13.3998C22.073 13.3998 22.6998 12.773 22.6998 11.9998C22.6998 11.2266 22.073 10.5998 21.2998 10.5998H12.8998V2.1998Z"
                      fill="#A6ADBB"
                      style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 px-6">
            {isDisabled ? (
              <button
                disabled={loading}
                className="btn btn-md btn-neutral h-12 w-full border-none"
                onClick={() => navigate(-1)}
              >
                {t('common.close')}
              </button>
            ) : (
              <button disabled={loading} className="btn btn-md btn-primary h-12 w-full border-none" onClick={saveAvatar}>
                {loading ? <span className="loading loading-spinner loading-sm text-primary" /> : t('common.save')}
              </button>
            )}
          </div>
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
}
