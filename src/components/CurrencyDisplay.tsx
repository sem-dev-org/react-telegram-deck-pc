import React from 'react';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';

interface CurrencyDisplayProps {
  amountInUSD: number | string;
  showSymbol?: boolean;
  showPlus?: boolean;
  className?: string;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amountInUSD,
  showSymbol = true,
  showPlus = false,
  className = '',
}) => {
  const { formatCurrency } = useCurrencyFormatter();

  return (
    <span className={className}>
      {formatCurrency(amountInUSD, { includeSymbol: showSymbol, showPlus })}
    </span>
  );
};

/**
 * More complex currency display component that can show both original USD value and converted value
 */
interface CurrencyComparisonProps {
  amountInUSD: number | string;
  showOriginalUSD?: boolean;
  className?: string;
}

export const CurrencyComparison: React.FC<CurrencyComparisonProps> = ({
  amountInUSD,
  showOriginalUSD = false,
  className = '',
}) => {
  const { formatCurrency, currentCurrency } = useCurrencyFormatter();
  
  if (!showOriginalUSD) {
    return <CurrencyDisplay amountInUSD={amountInUSD} className={className} />;
  }
  
  return (
    <span className={className}>
      {formatCurrency(amountInUSD)}
      {currentCurrency !== 'USD' && (
        <span className="text-xs text-neutral-content ml-1">
          (${Number(amountInUSD).toFixed(2)} USD)
        </span>
      )}
    </span>
  );
}; 