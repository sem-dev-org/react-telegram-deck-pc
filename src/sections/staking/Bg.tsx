import { on, viewport } from '@telegram-apps/sdk-react';
import { useState } from 'react';

export const Bg = () => {
  const [safeAreaInsetsTop, setSafeAreaInsets] = useState(0);
  const [contentSafeAreaInsetsTop, setContentSafeAreaInsets] = useState(0);

  on('safe_area_changed', () => {
    // console.log('safe_area_changed', viewport.safeAreaInsets());
    setSafeAreaInsets(viewport.safeAreaInsets().top);
  });

  on('content_safe_area_changed', () => {
    // console.log('content_safe_area_changed', viewport.contentSafeAreaInsets());
    setContentSafeAreaInsets(viewport.contentSafeAreaInsets().top);
  });

  return (
    <div
      className={`absolute left-0 right-0 w-full h-full z-10`}
      style={{
        top: `-${safeAreaInsetsTop + contentSafeAreaInsetsTop}px`,
      }}
    >
      <div className=" w-full h-full relative ">
        <div className="bg-staking w-full h-full " />
        <img src="/images/staking.png" alt="" className="absolute top-2 right-0 w-53" />
      </div>
    </div>
  );
}
