import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultLanguage, supportedLanguages } from '@/i18n';
import { useAuth } from './auth';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import useIsTma from '@/hooks/isTma';

// RTL 语言列表
export const rtlLanguages = ['ar'];

// 语言上下文类型
interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  supportedLanguages: string[];
  isRTL: boolean;
}

// 创建语言上下文
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: defaultLanguage,
  changeLanguage: () => { },
  supportedLanguages,
  isRTL: false,
});

// 语言提供者属性
interface LanguageProviderProps {
  children: ReactNode;
}

// 语言提供者组件
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const { user } = useAuth();

  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || defaultLanguage);

  const isTmaApp = useIsTma();

  useEffect(() => {
    if (isTmaApp) {
      const languageCode = retrieveLaunchParams().initData?.user?.languageCode;
      if (languageCode) {
        changeLanguage(languageCode);
      }
    } else {
      if (user?.language_code) {
        changeLanguage(user?.language_code);
      }
    }
  }, [user]);

  const [isRTL, setIsRTL] = useState(rtlLanguages.includes(currentLanguage));

  // 切换语言的函数
  const changeLanguage = (lang: string) => {
    if (supportedLanguages.includes(lang)) {
      // 确保保留完整的语言代码
      i18n.changeLanguage(lang).catch((error) => {
        console.error('Error changing language:', error);
      });

      // 直接设置localStorage以确保完整的语言代码被保存
      localStorage.setItem('B03i18nextLng', lang);
    }
  };

  // 监听语言变化
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLanguage(lng);
      setIsRTL(rtlLanguages.includes(lng));
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  // 设置文档方向
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;

    // 添加或移除 RTL 类
    if (isRTL) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [isRTL, currentLanguage]);

  const value = {
    currentLanguage,
    changeLanguage,
    supportedLanguages,
    isRTL,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// 使用语言上下文的钩子
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext; 