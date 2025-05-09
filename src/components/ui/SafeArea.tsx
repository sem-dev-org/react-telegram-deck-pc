import { ReactNode } from 'react';

interface SafeAreaProps {
  children: ReactNode;
  top?: boolean;
  bottom?: boolean;
  className?: string;
}

/**
 * SafeArea组件 - 提供安全区域的padding
 * 
 * @param top - 是否应用顶部安全区域padding
 * @param bottom - 是否应用底部安全区域padding
 * @param className - 额外的CSS类名
 */
export const SafeArea = ({ 
  children, 
  top = true, 
  bottom = true, 
  className = '' 
}: SafeAreaProps) => {
  const paddingTop = top ? 'pt-[var(--safe-area-top)]' : '';
  const paddingBottom = bottom ? 'pb-[var(--safe-area-bottom)]' : '';
  
  return (
    <div className={`${paddingTop} ${paddingBottom} ${className}`}>
      {children}
    </div>
  );
};

/**
 * FullBleedContainer组件 - 允许内容延伸到安全区域外
 * 但内部内容会受到保护
 */
export const FullBleedContainer = ({ 
  children, 
  className = '' 
}: Omit<SafeAreaProps, 'top' | 'bottom'>) => {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
};

/**
 * SafeContent组件 - 确保内容在安全区域内
 */
export const SafeContent = ({ 
  children, 
  className = '' 
}: Omit<SafeAreaProps, 'top' | 'bottom'>) => {
  return (
    <div className={`pt-[var(--safe-area-top)] pb-[var(--safe-area-bottom)] ${className}`}>
      {children}
    </div>
  );
}; 