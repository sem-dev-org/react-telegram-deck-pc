import React from 'react';
import { motion } from 'framer-motion';

export interface FloatingMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface FloatingMenuProps {
  items: FloatingMenuItem[];
  title?: string;
  onClose?: () => void;
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({ 
  items, 
  title,
  onClose 
}) => {
  // 容器动画
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        when: "beforeChildren"
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  };

  // 菜单项动画
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      y: -5,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      className="flex flex-col gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {title && (
        <motion.div 
          className="text-base-content font-bold text-base mb-1"
          variants={itemVariants}
        >
          {title}
        </motion.div>
      )}
      
      {items.map((item) => (
        <motion.button
          key={item.id}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg
            ${item.disabled 
              ? 'opacity-50 cursor-not-allowed bg-base-200/50' 
              : 'hover:bg-base-200/80 active:bg-base-300/80 cursor-pointer'}
          `}
          onClick={() => {
            if (!item.disabled && item.onClick) {
              item.onClick();
              if (onClose) onClose();
            }
          }}
          variants={itemVariants}
          whileHover={!item.disabled ? { scale: 1.02 } : {}}
          whileTap={!item.disabled ? { scale: 0.98 } : {}}
        >
          {item.icon && (
            <span className="text-base-content/70">{item.icon}</span>
          )}
          <span className="font-medium">{item.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default FloatingMenu; 