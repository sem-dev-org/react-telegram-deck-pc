import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export interface PageProps {
  children: ReactNode;
  className?: string;
  /**
   * 动画变体
   * - fade: 淡入淡出
   * - slide: 滑动
   * - scale: 缩放
   * - flip: 翻转
   * - rotate: 旋转
   */
  variant?: 'fade' | 'slide' | 'scale' | 'flip' | 'rotate';
  /**
   * 动画持续时间（秒）
   */
  duration?: number;
  /**
   * 动画延迟（秒）
   */
  delay?: number;
  /**
   * 自定义动画配置
   */
  custom?: any;
  /**
   * 是否显示安全区域
   */
  showSafeArea?: boolean;
  /**
   * 是否显示内容安全区域
   */
  showContentSafeArea?: boolean;
}

/**
 * 页面容器组件，提供现代化的入场和退出动画效果
 */
export const Page = ({ children, className = '', variant = 'fade', duration = 0.5, delay = 0, custom }: PageProps) => {
  // 动画变体定义
  const variants = {
    // 淡入淡出
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    // 滑动
    slide: {
      initial: { x: '100%', opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '-100%', opacity: 0 },
    },
    // 缩放
    scale: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 },
    },
    // 翻转
    flip: {
      initial: { rotateY: 90, opacity: 0 },
      animate: { rotateY: 0, opacity: 1 },
      exit: { rotateY: -90, opacity: 0 },
    },
    // 旋转
    rotate: {
      initial: { rotate: -10, opacity: 0 },
      animate: { rotate: 0, opacity: 1 },
      exit: { rotate: 10, opacity: 0 },
    },
  };

  // 选择动画变体
  const selectedVariant = variants[variant];

  return (
    <motion.div
      className={`h-full w-full ${className}`}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={selectedVariant}
      transition={{
        duration,
        delay,
        ease: 'easeInOut',
      }}
      custom={custom}
    >
      {children}
    </motion.div>
  );
};

export default Page;
