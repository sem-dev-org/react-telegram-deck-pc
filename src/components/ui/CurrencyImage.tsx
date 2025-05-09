
 

export const CurrencyImage = ({ className, currency }: { className?: string; currency?: string }) => {
  // const { data: CurrencyData } = QueryCurrency();
  // // const { user } = useAuth();

  // const currencyObj = useMemo(
  //   () => CurrencyData?.find((item) => item.currency === currency)?.currency_type,
  //   [CurrencyData, currency],
  // );

  return (
    <div className={`overflow-hidden rounded-full ${className}`}>
      {/* {currencyObj === 'FIAT' && (
        <img src={`/icons/flag/${currency?.toLowerCase()}.svg`} className="h-full w-full object-cover" />
      )}
      {currencyObj === 'CRYPTO' && ( */}
        <img src={`/icons/tokens/${currency?.toLowerCase()}.svg`} className="h-full w-full object-cover" />
      {/* )} */}
    </div>
  );
};
