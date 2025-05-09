import { useTranslation } from 'react-i18next';
// import { toast } from 'sonner';
// import { onCopy } from 'react-copy-to-clipboard';

export const ReferralTabContentPartnerships = () => {
  //   const [showCheck, setShowCheck] = useState(false);
  const referralLink = 'business@1st.game';

  const { t } = useTranslation();

  // const shareTg = async () => {
  //   await navigator.share({
  //     title: '1st.game',
  //     text: '1st.game',
  //     url: referralLink,
  //   });
  // };

  // const openEmail = () => {
  //   toast.success('Email copied successfully');
  // };

  return (
    <>
      {/* <ReferralSharingModal open={open} onClose={() => setOpen(false)} /> */}

      <div
        className="flex flex-col gap-3 rounded-t-xl p-4"
        style={{
          background: `linear-gradient(180deg, color(display-p3 0.329 0.502 0.596 / 0.2) 0%, color(display-p3 0.114 0.137 0.165 / 0.2) 59.96%), color(display-p3 0.114 0.137 0.165)`,
        }}
      >
        <div className="flex h-12 flex-col justify-center gap-1 text-base font-bold">
          <p>{t('referral:gotAHugeAudience')}</p>
          <p className="text-primary">{t('referral:letTalkBusiness')}</p>
        </div>
        <p className="text-sm">{t('referral:assembleACrewWith100M', { amount: '$100M+' })}</p>
        <p className="text-sm">{t('referral:startRecruitingNow')}</p>
        <div>
          <a
            href={`mailto:${referralLink}?cc=${referralLink}&bcc=${referralLink}`}
            className="bg-base-200 mt-2 flex h-10 items-center justify-between gap-2 rounded-lg px-3"
          >
            <div className="text-base-content text-base-content/60 flex-1 overflow-auto text-sm whitespace-nowrap">
              {referralLink}
            </div>
            <button className="btn btn-sm bg-secondary text-primary hover:bg-secondary/90 h-5 min-w-13 gap-2 rounded-full px-2 font-semibold">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1.5 2C0.947715 2 0.5 2.44772 0.5 3V3.58074L4.72049 5.69098C4.89645 5.77896 5.10355 5.77896 5.27951 5.69098L9.5 3.58074V3C9.5 2.44772 9.05229 2 8.5 2H1.5Z"
                  fill="#E7FB78"
                  fillOpacity="0.8"
                  style={{ fill: '#E7FB78', fillOpacity: 0.8 }}
                />
                <path
                  d="M9.5 4.41926L5.61492 6.3618C5.22782 6.55535 4.77218 6.55535 4.38508 6.3618L0.5 4.41926V7C0.5 7.55228 0.947715 8 1.5 8H8.5C9.05229 8 9.5 7.55228 9.5 7V4.41926Z"
                  fill="#E7FB78"
                  style={{ fill: '#E7FB78', fillOpacity: 0.8 }}
                />
              </svg>

              <span className="text-xs">{t('referral:send')}</span>
            </button>
          </a>

          {/* <CopyToClipboard
            text={referralLink}
            onCopy={() => {
              setShowCheck(true);
              setTimeout(() => {
                setShowCheck(false);
              }, 1000);
            }}
          >
            <div className="cursor-pointer font-semibold bg-secondary rounded-xl text-primary h-4 w-16 flex items-center justify-center gap-2 transition-all duration-200 hover:bg-secondary/90">
              {showCheck ? (
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1 4L4.5 7.5L11 1"
                    stroke="#E7FB78"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1.5 0C0.947715 0 0.5 0.447715 0.5 1V1.58074L4.72049 3.69098C4.89645 3.77896 5.10355 3.77896 5.27951 3.69098L9.5 1.58074V1C9.5 0.447715 9.05229 0 8.5 0H1.5Z"
                      fill="#E7FB78"
                      style={{ fill: '#E7FB78', fillOpacity: 0.8 }}
                    />
                    <path
                      d="M9.5 2.41926L5.61492 4.3618C5.22782 4.55535 4.77218 4.55535 4.38508 4.3618L0.5 2.41926V5C0.5 5.55228 0.947715 6 1.5 6H8.5C9.05229 6 9.5 5.55228 9.5 5V2.41926Z"
                      fill="#E7FB78"
                      style={{ fill: '#E7FB78', fillOpacity: 0.8 }}
                    />
                  </svg>
                  <span className="text-xs">Send</span>
                </>
              )}
            </div>
          </CopyToClipboard> */}
          {/* {typeof navigator.share !== 'undefined' && (
            <button
              className="btn btn-xs bg-secondary text-primary hover:bg-secondary/90 h-5 rounded-full gap-2 font-semibold"
              onClick={() => shareTg()}
            >
  
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1.5 2C0.947715 2 0.5 2.44772 0.5 3V3.58074L4.72049 5.69098C4.89645 5.77896 5.10355 5.77896 5.27951 5.69098L9.5 3.58074V3C9.5 2.44772 9.05229 2 8.5 2H1.5Z"
                  fill="#E7FB78"
                  fillOpacity="0.8"
                  style={{ fill: '#E7FB78', fillOpacity: 0.8 }}
                />
                <path
                  d="M9.5 4.41926L5.61492 6.3618C5.22782 6.55535 4.77218 6.55535 4.38508 6.3618L0.5 4.41926V7C0.5 7.55228 0.947715 8 1.5 8H8.5C9.05229 8 9.5 7.55228 9.5 7V4.41926Z"
                  fill="#E7FB78"
                  fillOpacity="0.8"
                  style={{ fill: '#E7FB78', fillOpacity: 0.8 }}
                />
              </svg>

              <span className="text-xs">{t('referral:send')}</span>
            </button>
          )} */}
          {/* {typeof navigator.share === 'undefined' && (
            <CopyBtn
              text={referralLink}
              callback={() => openEmail()}
              className="btn btn-sm bg-secondary text-primary hover:bg-secondary/90 h-5 min-w-13 rounded-full px-2 gap-2 font-semibold"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1.5 2C0.947715 2 0.5 2.44772 0.5 3V3.58074L4.72049 5.69098C4.89645 5.77896 5.10355 5.77896 5.27951 5.69098L9.5 3.58074V3C9.5 2.44772 9.05229 2 8.5 2H1.5Z"
                  fill="#E7FB78"
                  fillOpacity="0.8"
                  style={{ fill: '#E7FB78', fillOpacity: 0.8 }}
                />
                <path
                  d="M9.5 4.41926L5.61492 6.3618C5.22782 6.55535 4.77218 6.55535 4.38508 6.3618L0.5 4.41926V7C0.5 7.55228 0.947715 8 1.5 8H8.5C9.05229 8 9.5 7.55228 9.5 7V4.41926Z"
                  fill="#E7FB78"
                  style={{ fill: '#E7FB78', fillOpacity: 0.8 }}
                />
              </svg>

              <span className="text-xs">{t('referral:send')}</span>
            </CopyBtn>
          )} */}
        </div>
      </div>
    </>
  );
};
