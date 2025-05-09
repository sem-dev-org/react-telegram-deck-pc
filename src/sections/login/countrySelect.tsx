import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import { useRef, useEffect, useCallback, useState } from 'react';
import { SelectDropdown, SelectDropdownRef, SelectOption } from '@/components/ui/SelectDropdown';
import { getBrowserCountryCode } from '@/utils/browser';
import en from 'react-phone-number-input/locale/en';
 

// 国家代码到语言包的映射
// const countryToLocaleMap: Record<string, any> = {
//   US: en,
//   GB: en,
//   RU: ru,
//   CN: zh,
//   JP: ja,
//   KR: ko,
//   TH: th,
//   VN: vi,
//   AE: ar,
//   EG: ar,
//   SA: ar,
//   TR: tr,
//   DE: de,
//   FR: fr,
//   ES: es,
//   IT: it,
//   PT: pt,
//   BR: pt,
//   // 其他所有国家使用英语
//   PH: en,
//   ID: en,
//   MY: en,
//   NL: en,
//   SE: en,
//   NO: en,
//   DK: en,
//   FI: en,
//   PL: en,
//   CZ: en,
//   SK: en,
//   HU: en,
//   RO: en,
//   BG: en,
//   GR: en,
//   HR: en,
//   SI: en,
//   RS: en,
//   UA: en,
//   BY: en,
//   KZ: en,
//   UZ: en,
//   AZ: en,
//   GE: en,
//   AM: en,
//   IL: en,
//   IR: en,
//   PK: en,
//   BD: en,
//   LK: en,
//   NP: en,
//   MM: en,
//   LA: en,
//   KH: en,
//   MN: en,
//   TW: zh,
//   HK: zh,
//   MO: zh,
//   SG: zh,
//   IN: en,
// };

interface CustomSelectOption extends SelectOption {
  customRender?: React.ReactNode;
}

const phoneString = (code: string) => {
  return `+${getCountryCallingCode(code as any)}`;
};

export default function CountrySelect({ setCountry }: { setCountry: (country: string) => void }) {
  const [countryCode, setCountryCode] = useState(getBrowserCountryCode());

   const locale = 
  //  countryToLocaleMap[countryCode] || 
   en;
  const setCountryByCode = useCallback(
    (code: string) => {
      setCountry(phoneString(code));
    },
    [setCountry],
  );

  useEffect(() => {
    setCountryByCode(countryCode);
  }, [countryCode]);

  const customRenderOption = (option: CustomSelectOption) => {
    if (option.customRender) {
      return option.customRender;
    }

    return (
      <div className="flex items-center justify-between">
        <span>{locale[option.value as keyof typeof locale]}</span>
        <span>{phoneString(option.value as any)}</span>
      </div>
    );
  };

  const options: CustomSelectOption[] = [
    ...getCountries().map((countryCode) => ({
      id: countryCode,
      value: countryCode,
      label: `${locale[countryCode]} ${phoneString(countryCode)}`,
    })),
  ];

  const selectRef = useRef<SelectDropdownRef>(null);
  const handleChange = (value: string | number) => {
    setCountryByCode(value as any);
    setCountryCode(value as any);
  };

  return (
    <SelectDropdown
      ref={selectRef}
      options={options}
      value={countryCode}
      onChange={(value) => handleChange(value)}
      showSearch={true}
      placeholder=""
      className="text-base-content/60 z-100 h-full p-0 text-sm font-bold"
      dropdownClassName="pr-0 !w-fit justify-between"
      buttonClassName="pr-0 h-full"
      renderOption={customRenderOption}
      renderValue={(option) => {
        return (
          <div className="flex items-center gap-2 text-sm">
            <span>{phoneString(option?.value as any)}</span>
          </div>
        );
      }}
    />
  );
}
