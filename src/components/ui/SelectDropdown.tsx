import { ReactNode, useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import clsx from 'clsx';

export interface SelectOption {
  id: string;
  value: string | number;
  label?: string;
  icon?: string | ReactNode;
  spare?: string | number;
  disabled?: boolean;
}

export interface SelectDropdownRef {
  handleOpenChange: (open: boolean) => void;
  blur: () => void;
}

export interface SelectDropdownProps {
  /** 选项列表 */
  options: SelectOption[];
  /** 当前选中的值 */
  value?: string | number;
  /** 选择变化时的回调函数 */
  onChange?: (value: string | number, option: SelectOption) => void;
  /** 占位文本 */
  placeholder?: string;
  /** 起始图标 */
  startIcon?: string | ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 下拉框宽度 */
  width?: string;
  /** 按钮高度 */
  height?: 'sm' | 'md' | 'lg' | 'h10';
  /** 按钮样式 */
  variant?: 'filled' | 'outlined' | 'ghost';
  /** 自定义类名 */
  className?: string;
  /** 下拉内容的自定义类名 */
  dropdownClassName?: string;
  /** 下拉框容器的自定义类名 */
  dropdownContainerClassName?: string;
  /** 是否显示搜索框 */
  showSearch?: boolean;
  /** 搜索框占位文本 */
  searchPlaceholder?: string;
  /** 无数据时显示的文本 */
  emptyText?: string;
  /** 自定义渲染选项 */
  renderOption?: (option: SelectOption) => ReactNode;
  /** 自定义渲染选中值 */
  renderValue?: (option: SelectOption | null) => ReactNode;
  /** 按钮的自定义类名 */
  buttonClassName?: string;
  /** 是否自动聚焦搜索框 */
  focusSearch?: boolean;
}

export const SelectDropdown = forwardRef<SelectDropdownRef, SelectDropdownProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = 'Please select',
      startIcon,
      disabled = false,
      width = 'w-full',
      height = 'md',
      variant = 'filled',
      className = '',
      dropdownClassName = '',
      dropdownContainerClassName = '',
      showSearch = false,
      searchPlaceholder = 'Search...',
      emptyText = 'No data',
      renderOption,
      renderValue,
      buttonClassName = '',
      focusSearch = false,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // 获取当前选中的选项
    const selectedOption = options.find((option) => option.value === value) || null;

    // 根据搜索文本过滤选项
    const filteredOptions =
      showSearch && searchText
        ? options.filter((option) =>
            (option.label || option.value.toString()).toLowerCase().includes(searchText.toLowerCase()),
          )
        : options;

    // 切换下拉框状态
    const toggleDropdown = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    // 选择选项
    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return;

      if (onChange) {
        onChange(option.value, option);
      }
      setIsOpen(false);
      setSearchText('');
    };

    useImperativeHandle(ref, () => ({
      handleOpenChange: (open: boolean) => {
        setIsOpen(open);
      },
      blur: () => {
        if (searchInputRef.current) {
          searchInputRef.current.blur();
        }
      },
    }));

    // 点击外部关闭下拉框
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchText('');
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        // 如果有搜索框，自动聚焦
        if (showSearch && searchInputRef.current && focusSearch) {
          searchInputRef.current.focus();
        }
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, showSearch]);

    // 按钮高度样式
    const buttonHeightClass = {
      sm: 'h-8',
      md: 'h-12',
      lg: 'h-16',
      h10: 'h-10',
    }[height];

    // 按钮变体样式
    const buttonVariantClass = {
      filled: 'bg-base-200 hover:bg-base-300',
      outlined: 'bg-transparent border border-base-content/20 hover:bg-base-200/30',
      ghost: 'bg-transparent hover:bg-base-200/30',
    }[variant];

    // 渲染选项
    const renderOptionItem = (option: SelectOption) => {
      if (renderOption) {
        return renderOption(option);
      }

      return (
        <div className="flex items-center gap-4 text-sm">
          {option.icon &&
            (typeof option.icon === 'string' ? (
              <img src={option.icon} alt="" className="h-4 w-4" />
            ) : (
              <span className="flex-shrink-0">{option.icon}</span>
            ))}
          <span>{option.label || option.value}</span>
        </div>
      );
    };

    // 渲染选中值
    const renderSelectedValue = () => {
      if (renderValue && selectedOption) {
        return renderValue(selectedOption);
      }

      if (!selectedOption) {
        return <span className="text-base-content/50">{placeholder}</span>;
      }

      return (
        <div className={clsx('flex items-center gap-2', dropdownContainerClassName)}>
          {selectedOption.icon &&
            (typeof selectedOption.icon === 'string' ? (
              <img src={selectedOption.icon} alt="" className="h-4 w-4" />
            ) : (
              <span className="flex-shrink-0">{selectedOption.icon}</span>
            ))}
          <span className="flex-1">{selectedOption.label || selectedOption.value}</span>
        </div>
      );
    };

    return (
      <div ref={dropdownRef} className={clsx('relative', width, className)}>
        {/* 选择按钮 */}
        <button
          type="button"
          className={clsx(
            'flex w-full items-center justify-between gap-2 rounded-lg px-4 text-sm font-semibold',
            buttonHeightClass,
            buttonVariantClass,
            buttonClassName,
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          )}
          onClick={toggleDropdown}
          disabled={disabled}
        >
          <div className="flex flex-1 items-center gap-2">
            {startIcon &&
              (typeof startIcon === 'string' ? (
                <img src={startIcon} alt="" className="h-4 w-4" />
              ) : (
                <span className="flex-shrink-0">{startIcon}</span>
              ))}
            <div className="flex-1 text-left">{renderSelectedValue()}</div>
          </div>

          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={clsx('transition-transform duration-200', isOpen ? 'rotate-180' : '')}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.68414 5.7676C4.923 5.53792 5.30282 5.54537 5.5325 5.78423L8.5 8.93443L11.4675 5.78423C11.6972 5.54537 12.077 5.53792 12.3159 5.7676C12.5547 5.99727 12.5622 6.3771 12.3325 6.61596L8.9325 10.216C8.81938 10.3336 8.66321 10.4001 8.5 10.4001C8.33679 10.4001 8.18062 10.3336 8.0675 10.216L4.6675 6.61596C4.43782 6.3771 4.44527 5.99727 4.68414 5.7676Z"
              fill="#A6ADBB"
            />
          </svg>
        </button>

        {/* 下拉内容 */}
        {isOpen && (
          <div
            className={clsx(
              'bg-base-200 absolute z-50 mt-1 w-full overflow-hidden rounded-lg shadow-lg',
              dropdownClassName,
            )}
          >
            {/* 搜索框 */}
            {showSearch && (
              <div className="border-base-300 border-b px-2 pt-2">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="input input-sm bg-base-100 w-full h-8"
                  placeholder={searchPlaceholder}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* 选项列表 */}
            <div className="max-h-60 overflow-y-auto p-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.id}
                    className={clsx(
                      'cursor-pointer rounded-md px-4 py-2',
                      option.disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-base-300',
                      option.value === value ? 'bg-primary/10' : '',
                    )}
                    onClick={() => !option.disabled && handleSelect(option)}
                  >
                    {renderOptionItem(option)}
                  </div>
                ))
              ) : (
                <div className="text-base-content/50 px-4 py-3 text-center text-sm">{emptyText}</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

// Add displayName to the component
SelectDropdown.displayName = 'SelectDropdown';
