import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingStore {
  displayInFiat: boolean;
  setDisplayInFiat: (displayInFiat: boolean) => void;

  hideZeroBalances: boolean;
  setHideZeroBalances: (hideZeroBalances: boolean) => void;

  showHeader: boolean;
  setShowHeader: (showHeader: boolean) => void;

  firstLoad: boolean;
  setFirstLoad: (firstLoad: boolean) => void;

  userCode: string;
  setUserCode: (userCode: string) => void;

  jumpUrl: string;
  setJumpUrl: (jumpUrl: string) => void;
}

export const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      displayInFiat: false,
      setDisplayInFiat: (displayInFiat) => set({ displayInFiat }),

      hideZeroBalances: false,
      setHideZeroBalances: (hideZeroBalances) => set({ hideZeroBalances }),

      showHeader: true,
      setShowHeader: (showHeader) => set({ showHeader }),

      userCode: '',
      setUserCode: (userCode) => set({ userCode }),

      jumpUrl: '',
      setJumpUrl: (jumpUrl) => set({ jumpUrl }),

      firstLoad: false,
      setFirstLoad: (firstLoad) => set({ firstLoad }),
    }),
    {
      name: 'setting',
    },
  ),
);
 
