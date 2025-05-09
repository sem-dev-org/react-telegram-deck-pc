import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export interface SearchOption {
  /** 选项值 */
  value: string;
  /** 显示文本 */
  label: string;
}

export interface SearchInputProps {
  /** 输入框的值 */
  value?: string;
  /** 占位符 */
  placeholder?: string;
  /** 输入框大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示错误状态 */
  error?: boolean;
  /** 自动完成选项 */
  options?: SearchOption[];
  /** 值变化回调 */
  onChange?: (value: string) => void;
  /** 选择选项回调 */
  onSelect?: (option: SearchOption) => void;
  /** 自定义类名 */
  className?: string;
  /** 是否显示搜索图标 */
  showSearchIcon?: boolean;
}

export const SearchInput = ({
  value = '',
  placeholder = 'Search...',
  size = 'md',
  disabled = false,
  error = false,
  options = [],
  onChange,
  onSelect,
  className,
  showSearchIcon = true,
}: SearchInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 处理输入变化
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  // 处理选项选择
  const handleSelect = (option: SearchOption) => {
    onSelect?.(option);
    onChange?.(option.value);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // 处理键盘导航
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleSelect(options[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // 处理点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={clsx(
            'input input-bordered w-full px-4 pr-10 text-base',
            {
              'input-sm': size === 'sm',
              'input-md': size === 'md',
              'input-lg': size === 'lg',
              'input-error': error,
              'cursor-not-allowed opacity-50': disabled,
            },
            className,
          )}
        />
        {showSearchIcon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <svg className="text-base-content/50 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        )}
      </div>

      {isOpen && options.length > 0 && (
        <ul className="bg-base-100 menu absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg p-0 shadow-lg">
          {options.map((option, index) => (
            <li key={option.value}>
              <button
                type="button"
                className={clsx('hover:bg-base-200 w-full px-4 py-2 text-left', {
                  'bg-base-200': index === highlightedIndex,
                })}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
