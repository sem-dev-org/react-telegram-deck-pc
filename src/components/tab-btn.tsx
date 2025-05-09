import { motion } from 'framer-motion';
import clsx from 'clsx';

interface TabBtnProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
}

export const TabBtn = ({ tabs, activeTab, setActiveTab, className }: TabBtnProps) => {
  return (
    <div className="flex space-x-1 overflow-x-auto -mr-3 pr-3 hide-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={clsx(
            'flex items-center gap-2 relative rounded-md px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-2 whitespace-nowrap text-ellipsis',
            className,
            activeTab === tab.id ? 'text-primary' : 'text-base'
          )}
          style={{
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {activeTab === tab.id && (
            <motion.span
              layoutId="bubble"
              className="absolute inset-0 z-10 bg-secondary rounded-md "
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};
