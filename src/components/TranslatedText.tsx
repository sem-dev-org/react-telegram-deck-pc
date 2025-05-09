import React, { ElementType } from 'react';
import useTranslate from '@/hooks/useTranslate';
import clsx from 'clsx';

interface TranslatedTextProps {
  textKey: string;
  values?: Record<string, any>;
  className?: string;
  tag?: ElementType;
}

/**
 * 翻译文本组件，用于显示翻译后的文本
 * @param textKey 翻译键
 * @param values 插值值
 * @param className 样式类名
 * @param tag HTML 标签，默认为 span
 */
const TranslatedText: React.FC<TranslatedTextProps> = ({
  textKey,
  values = {},
  className,
  tag: Tag = 'span',
}) => {
  const { t } = useTranslate();
  
  return <Tag className={clsx(className)}>{t(textKey, values)}</Tag>;
};

export default TranslatedText; 