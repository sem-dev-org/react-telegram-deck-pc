import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface TabBtnProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
}

export const TabBtn = ({ tabs, activeTab, setActiveTab, className }: TabBtnProps) => {
  const tabsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const activeTabElement = tabsRef.current[activeTab];
    const container = containerRef.current;

    if (activeTabElement && container) {
      // Calculate position to scroll to
      const tabRect = activeTabElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const scrollLeft = activeTabElement.offsetLeft + tabRect.width / 2 - containerRect.width / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  }, [activeTab]);

  return (
    <div ref={containerRef} className="hide-scrollbar -mr-3 flex space-x-1 overflow-x-auto pr-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => {
            tabsRef.current[tab.id] = el;
          }}
          onClick={() => setActiveTab(tab.id)}
          className={`relative flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold text-ellipsis whitespace-nowrap transition focus-visible:outline-2 ${
            activeTab === tab.id ? 'text-primary' : 'text-base'
          } ${className}`}
          style={{
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {activeTab === tab.id && (
            <motion.span
              layoutId="bubble"
              className="bg-secondary absolute inset-0 z-10 rounded-md"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          {tab.icon &&
            (typeof tab.icon === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: tab.icon }} />
            ) : (
              <span className={`${activeTab === tab.id ? 'text-primary' : 'text-base'}`}>{tab.icon}</span>
            ))}
          {tab.label}
        </button>
      ))}
    </div>
  );
};
