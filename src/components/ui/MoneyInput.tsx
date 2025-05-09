import { ChangeEvent, ReactNode, forwardRef } from 'react';
import clsx from 'clsx';

export interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  /** 输入框的值 */
  value?: string | number;
  /** 输入框后缀 */
  suffix?: ReactNode;
  /** 输入框大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示错误状态 */
  error?: boolean;
  /** 值变化回调 */
  onChange?: (value: string) => void;
  /** 输入框占位符 */
  placeholder?: string;
  /** 自定义类名 */
  className?: string;
}

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  (
    {
      value,
      suffix,
      size = 'md',
      disabled = false,
      error = false,
      onChange,
      placeholder = '请输入金额',
      className,
      ...props
    },
    ref
  ) => {
    // 处理输入变化
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // 只允许输入数字和小数点
      if (!/^[0-9]*\.?[0-9]*$/.test(inputValue) && inputValue !== '') {
        return;
      }

      // 处理开头的0
      let formattedValue = inputValue;
      if (inputValue.startsWith('0') && inputValue.length > 1 && !inputValue.startsWith('0.')) {
        formattedValue = inputValue.slice(1);
      }

      // 限制小数位数为2位
      if (formattedValue.includes('.')) {
        const [integer, decimal] = formattedValue.split('.');
        if (decimal && decimal.length > 2) {
          formattedValue = `${integer}.${decimal.slice(0, 2)}`;
        }
      }

      onChange?.(formattedValue);
    };

    return (
      <div className="relative flex items-center">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={clsx(
            'input input-bordered w-full text-base px-4',
            {
              'input-sm': size === 'sm',
              'input-md': size === 'md',
              'input-lg': size === 'lg',
              'input-error': error,
              'opacity-50 cursor-not-allowed': disabled,
            },
            className
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute right-0 text-base-content/70">
            {suffix}
          </div>
        )}
      </div>
    );
  }
);

MoneyInput.displayName = 'MoneyInput'; 