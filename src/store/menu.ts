import { create } from 'zustand';

interface MenuStore {
  isMenuOpen: boolean;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  isMenuOpen: false,
  setIsMenuOpen: (isMenuOpen) => set({ isMenuOpen }),
}));
