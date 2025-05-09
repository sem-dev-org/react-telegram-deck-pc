import clsx from 'clsx';
import { AnimatePresence, motion, PanInfo, useMotionValue } from 'framer-motion';
import React, { ReactNode, useEffect, useRef, useState } from 'react';

export interface FloatingButtonProps {
  /** 按钮图标 */
  icon: ReactNode;
  /** 下拉菜单内容 */
  children: ReactNode;
  /** 按钮大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 按钮颜色 */
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error';
  /** 初始位置 */
  initialPosition?: { x: number; y: number };
  /** 自定义类名 */
  className?: string;
  /** 下拉框宽度 */
  dropdownWidth?: number;
  /** 按钮透明度 */
  opacity?: number;
  /** 吸附距离 (px) */
  snapDistance?: number;
  /** 是否显示按钮 */
  visible?: boolean;
  /** 是否显示调试信息 */
  debug?: boolean;
  /** 位置参考点 */
  positionReference?: 'center' | 'topLeft';
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  icon,
  children,
  size = 'md',
  color = 'neutral',
  initialPosition,
  className = '',
  dropdownWidth = 280,
  opacity = 0.9,
  snapDistance = 20,
  visible = true,
  positionReference = 'topLeft',
}) => {
  // 状态管理
  const [isOpen, setIsOpen] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1000,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });
  const [buttonSize, setButtonSize] = useState({ width: 48, height: 48 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // 获取按钮尺寸对应的像素值
  const getButtonSizeInPixels = () => {
    const sizeMap = {
      sm: { width: 40, height: 40 },
      md: { width: 48, height: 48 },
      lg: { width: 56, height: 56 },
    };
    return sizeMap[size];
  };

  // 初始化位置 - 默认右下角
  const defaultPosition = {
    x: typeof window !== 'undefined' ? window.innerWidth - 80 : 800,
    y: typeof window !== 'undefined' ? window.innerHeight - 80 : 600,
  };

  // 根据参考点调整初始位置
  const adjustInitialPosition = (pos: { x: number; y: number }) => {
    const btnSize = getButtonSizeInPixels();
    if (positionReference === 'center') {
      return pos;
    } else {
      // 如果参考点是左上角，则调整位置
      return {
        x: pos.x + btnSize.width / 2,
        y: pos.y + btnSize.height / 2,
      };
    }
  };

  const initPosition = initialPosition ? adjustInitialPosition(initialPosition) : defaultPosition;

  // 位置控制
  const x = useMotionValue(initPosition.x);
  const y = useMotionValue(initPosition.y);

  // 获取窗口和按钮尺寸
  useEffect(() => {
    const updateDimensions = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 初始化
    updateDimensions();

    // 监听窗口大小变化
    window.addEventListener('resize', updateDimensions);

    // 获取按钮尺寸
    if (buttonRef.current) {
      const { offsetWidth, offsetHeight } = buttonRef.current;
      setButtonSize({ width: offsetWidth, height: offsetHeight });
    } else {
      setButtonSize(getButtonSizeInPixels());
    }

    // 确保按钮在视口内
    const safePosition = constrainPosition(x.get(), y.get());
    x.set(safePosition.x);
    y.set(safePosition.y);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // 确保按钮在窗口内并处理边缘吸附
  const constrainPosition = (newX: number, newY: number) => {
    if (windowSize.width === 0 || buttonSize.width === 0) return { x: newX, y: newY };

    // 计算边界
    const halfWidth = buttonSize.width / 2;
    const halfHeight = buttonSize.height / 2;

    // 根据参考点计算边界
    let minX, maxX, minY, maxY;

    if (positionReference === 'center') {
      minX = halfWidth;
      maxX = windowSize.width - halfWidth;
      minY = halfHeight;
      maxY = windowSize.height - halfHeight;
    } else {
      minX = 0;
      maxX = windowSize.width - buttonSize.width;
      minY = 0;
      maxY = windowSize.height - buttonSize.height;
    }

    // 确保在边界内
    let constrainedX = Math.max(minX, Math.min(maxX, newX));
    let constrainedY = Math.max(minY, Math.min(maxY, newY));

    // 边缘吸附
    if (positionReference === 'center') {
      if (Math.abs(constrainedX - minX) < snapDistance) {
        constrainedX = minX;
      } else if (Math.abs(constrainedX - maxX) < snapDistance) {
        constrainedX = maxX;
      }

      if (Math.abs(constrainedY - minY) < snapDistance) {
        constrainedY = minY;
      } else if (Math.abs(constrainedY - maxY) < snapDistance) {
        constrainedY = maxY;
      }
    } else {
      if (Math.abs(constrainedX) < snapDistance) {
        constrainedX = 0;
      } else if (Math.abs(constrainedX - maxX) < snapDistance) {
        constrainedX = maxX;
      }

      if (Math.abs(constrainedY) < snapDistance) {
        constrainedY = 0;
      } else if (Math.abs(constrainedY - maxY) < snapDistance) {
        constrainedY = maxY;
      }
    }

    return { x: constrainedX, y: constrainedY };
  };

  // 拖动开始时的处理
  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  // 拖动过程中的处理
  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // 实时更新位置，使按钮跟随鼠标移动
    const newX = info.point.x;
    const newY = info.point.y;

    // 根据参考点调整位置
    let adjustedX = newX;
    let adjustedY = newY;

    if (positionReference === 'center') {
      // 中心点模式不需要调整
    } else {
      // 左上角模式需要调整，考虑鼠标在按钮内的位置
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const offsetX = info.point.x - rect.left;
        const offsetY = info.point.y - rect.top;

        adjustedX = newX - offsetX;
        adjustedY = newY - offsetY;
      }
    }

    // 应用约束和吸附
    const { x: constrainedX, y: constrainedY } = constrainPosition(adjustedX, adjustedY);

    // 更新位置
    x.set(constrainedX);
    y.set(constrainedY);
  };

  // 拖动结束时的处理
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    isDraggingRef.current = false;

    // 获取鼠标最终位置
    const finalX = info.point.x;
    const finalY = info.point.y;

    // 根据参考点调整位置
    let adjustedX = finalX;
    let adjustedY = finalY;

    if (positionReference === 'center') {
      // 中心点模式不需要调整
    } else {
      // 左上角模式需要调整，考虑鼠标在按钮内的位置
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const offsetX = finalX - rect.left;
        const offsetY = finalY - rect.top;

        adjustedX = finalX - offsetX;
        adjustedY = finalY - offsetY;
      }
    }

    // 应用约束和吸附
    const { x: constrainedX, y: constrainedY } = constrainPosition(adjustedX, adjustedY);

    // 更新位置
    x.set(constrainedX);
    y.set(constrainedY);
  };

  // 切换下拉框显示状态
  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 只有在没有拖动时才切换下拉框
    if (!isDraggingRef.current) {
      setIsOpen(!isOpen);
    }
  };

  // 关闭下拉框
  const closeDropdown = () => {
    setIsOpen(false);
  };

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 按钮大小样式
  const buttonSizeClass = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-14 h-14 text-lg',
  }[size];

  // 按钮颜色样式
  const buttonColorClass = {
    primary: 'bg-primary text-primary-content',
    secondary: 'bg-secondary text-secondary-content',
    accent: 'bg-accent text-accent-content',
    neutral: 'bg-neutral text-neutral-content',
    info: 'bg-info text-info-content',
    success: 'bg-success text-success-content',
    warning: 'bg-warning text-warning-content',
    error: 'bg-error text-error-content',
  }[color];

  // 计算下拉框位置
  const getDropdownPosition = () => {
    const currentX = x.get();
    const currentY = y.get();

    // 根据按钮位置决定下拉框方向
    const isNearBottom = currentY > windowSize.height - 200;
    const isNearRight = currentX > windowSize.width - dropdownWidth - 20;

    let dropdownX, dropdownY;

    if (positionReference === 'center') {
      dropdownX = isNearRight
        ? currentX - dropdownWidth - buttonSize.width / 2 - 10
        : currentX + buttonSize.width / 2 + 10;

      dropdownY = isNearBottom ? currentY - (isOpen ? 20 : 0) : currentY - (isOpen ? 20 : 0);
    } else {
      dropdownX = isNearRight ? currentX - dropdownWidth + buttonSize.width : currentX;

      dropdownY = isNearBottom ? currentY - dropdownWidth : currentY + buttonSize.height + 10;
    }

    // 确保下拉框在屏幕内
    if (dropdownX < 10) dropdownX = 10;
    if (dropdownX + dropdownWidth > windowSize.width - 10) {
      dropdownX = windowSize.width - dropdownWidth - 10;
    }

    return {
      left: dropdownX,
      top: dropdownY,
      originX: isNearRight ? 'right' : 'left',
      originY: isNearBottom ? 'bottom' : 'top',
    };
  };

  if (!visible) return null;

  return (
    <>
      {/* 可拖动按钮 */}
      <motion.div
        ref={buttonRef}
        className={clsx(
          'fixed z-[99999] flex cursor-move items-center justify-center rounded-full shadow-lg border border-base-content/20',
          buttonSizeClass,
          buttonColorClass,
          className,
        )}
        style={{
          x,
          y,
          opacity: isOpen ? 1 : opacity,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          transform: positionReference === 'center' ? 'translate(-50%, -50%)' : 'translate(0, 0)',
        }}
        drag
        dragMomentum={false}
        dragElastic={0.05}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.1, opacity: 1 }}
        whileHover={{ scale: 1.05, opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleDropdown}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 300,
          opacity: { duration: 0.2 },
        }}
      >
        {icon}
      </motion.div>

      {/* 下拉框 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={clsx('bg-base-100/95 fixed z-[99998] overflow-hidden rounded-lg shadow-2xl backdrop-blur-sm')}
            style={{
              width: dropdownWidth,
              ...getDropdownPosition(),
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                type: 'spring',
                damping: 25,
                stiffness: 300,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              transition: {
                duration: 0.2,
              },
            }}
          >
            <div className="p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingButton;
