import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// 默认语言
export const defaultLanguage = 'en';
// 支持的语言列表
/**
 *   { label: 'English', value: 'en', icon: '/icons/flag/usd.svg' },
  { label: '简体中文', value: 'zh', icon: '/icons/flag/cny.svg' },
  { label: 'Español', value: 'es', icon: '/icons/flag/esp.svg' },
  { label: 'Português', value: 'pt', icon: '/icons/flag/pte.svg' },
  { label: 'ภาษาไทย', value: 'th', icon: '/icons/flag/thb.svg' },
  { label: '日本語', value: 'ja', icon: '/icons/flag/jpy.svg' },
  { label: '한국어', value: 'ko', icon: '/icons/flag/krw.svg' },
  { label: 'Tiếng Việt', value: 'vi', icon: '/icons/flag/vnd.svg' },
  { label: 'العربية', value: 'ar', icon: '/icons/flag/aed.svg' },
  { label: 'Filipino', value: 'fil', icon: '/icons/flag/php.svg' },
 */
export const supportedLanguages = [
  'ar', // 阿拉伯语
  'bg', // 保加利亚语
  'cs', // 捷克语
  'da', // 丹麦语
  'de', // 德语
  'el', // 希腊语
  'en', // 英语
  'es', // 西班牙语
  'et', // 爱沙尼亚语
  'fi', // 芬兰语
  'fil', // 菲律宾语
  'fr', // 法语
  'hu', // 匈牙利语
  'id', // 印尼语
  'it', // 意大利语
  'ja', // 日语
  'ko', // 韩语
  'lt', // 立陶宛语
  'lv', // 拉脱维亚语
  'nl', // 荷兰语
  'no', // 挪威语
  'pl', // 波兰语
  'pt', // 葡萄牙语
  'ro', // 罗马尼亚语
  'ru', // 俄语
  'sk', // 斯洛伐克语
  'sl', // 斯洛文尼亚语
  'sv', // 瑞典语
  'th', // 泰语
  'tr', // 土耳其语
  'uk', // 乌克兰语
  'vi', // 越南语
  'zh-TW', // 繁体中文
];

i18n
  // 使用 http 后端加载翻译文件
  .use(Backend)
  // 检测用户语言
  .use(LanguageDetector)
  // 将 i18n 实例传递给 react-i18next
  .use(initReactI18next)
  // 初始化 i18next
  .init({
    // 默认语言
    fallbackLng: defaultLanguage,
    // 支持的语言
    supportedLngs: supportedLanguages,
    // 调试模式
    debug: process.env.NODE_ENV === 'development',
    // 翻译文件路径
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // 命名空间
    ns: [
      'common', 'casino', 'explore', 'menu', 'tournament', 'referral', 'gameDetail', 'login',
      'bonus', 'finance', 'profile', 'popup', 'vip', 'transaction', 'information', 'aboutUs', 
      'responsibleGaming', 'fairness', 'faq', 'termOfService', 'toast', 'vipFaq'
    ],
    // defaultNS: 'common' , 
    // 检测语言的选项
    detection: {
      // 检测顺序
      order: ['localStorage', 'navigator'],
      // localStorage 的键名
      lookupLocalStorage: 'B03i18nextLng',
      // 缓存用户语言
      caches: ['localStorage'],
    },
    // 插值选项
    interpolation: {
      escapeValue: false, // 不转义 HTML
    },
    // 防止语言代码自动标准化 
    nonExplicitSupportedLngs: false,
    // 保留语言标签中的连字符
    load: 'currentOnly',
    // 不要修改语言代码
    cleanCode: false
  });

export default i18n;
