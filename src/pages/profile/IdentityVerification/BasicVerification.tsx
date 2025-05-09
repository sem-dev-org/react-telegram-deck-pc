import { updateKyc } from '@/api/profile';
import { FullBleedContainer, Page, SafeContent } from '@/components/ui';
import { SelectDropdown, SelectOption } from '@/components/ui';
import { QueryKycDetail } from '@/query/profile';
import { SetUpSuccessfully } from '@/sections/profile/SetUpSuccessfully';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function BasicVerification() {

  // 日期选择状态
  const [day, setDay] = useState<string | number>('');
  const [month, setMonth] = useState<string | number>('');
  const [year, setYear] = useState<string | number>('');
  const [dayOptions, setDayOptions] = useState<SelectOption[]>([]);

  const { data, refetch } = QueryKycDetail();

  // When year changes, reset month
  useEffect(() => {
    if (!year) {
      setMonth('');
    }
  }, [year]);

  // When month changes, reset day
  useEffect(() => {
    if (!month) {
      setDay('');
    }
  }, [month]);

  useEffect(() => {
    if (data) {
      setFirstName(data.first_name);
      setMiddleName(data.middle_name);
      setLastName(data.last_name);
      setDay(Number(data.birthday.split('-')[2]));
      setMonth(Number(data.birthday.split('-')[1]));
      setYear(Number(data.birthday.split('-')[0]));
    }
  }, [data]);


  // 生成日期选项
  const generateDayOptions = (month: number, year: number): SelectOption[] => {
    // 根据月份和年份计算天数
    let daysInMonth = 31;

    if (month === 2) {
      // 二月份需要考虑闰年
      daysInMonth = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(month)) {
      // 4, 6, 9, 11月是30天
      daysInMonth = 30;
    }

    return Array.from({ length: daysInMonth }, (_, i) => {
      const value = i + 1;
      return {
        id: `day-${value}`,
        value: value,
        label: `${value}`,
      };
    });
  };

  // 当月份或年份变化时，更新日期选项
  useEffect(() => {
    const currentMonth = Number(month) || 0;
    const currentYear = Number(year) || new Date().getFullYear();

    if (currentMonth > 0) {
      setDayOptions(generateDayOptions(currentMonth, currentYear));

      // 检查当前选中的日期是否超出了新的日期范围
      if (Number(day) > dayOptions.length && dayOptions.length > 0) {
        setDay(dayOptions.length);
      }
    } else {
      // 如果未选择月份，显示31天（默认最大天数）
      setDayOptions(generateDefaultDayOptions());
    }
  }, [month, year]);

  // 生成默认的31天选项（未选择月份时使用）
  const generateDefaultDayOptions = (): SelectOption[] => {
    return Array.from({ length: 31 }, (_, i) => {
      const value = i + 1;
      return {
        id: `day-${value}`,
        value: value,
        label: `${value}`,
      };
    });
  };

  // 生成月份选项
  const monthOptions: SelectOption[] = [
    { id: 'month-1', value: 1, label: 'Jan' },
    { id: 'month-2', value: 2, label: 'Feb' },
    { id: 'month-3', value: 3, label: 'Mar' },
    { id: 'month-4', value: 4, label: 'Apr' },
    { id: 'month-5', value: 5, label: 'May' },
    { id: 'month-6', value: 6, label: 'June' },
    { id: 'month-7', value: 7, label: 'July' },
    { id: 'month-8', value: 8, label: 'Aug' },
    { id: 'month-9', value: 9, label: 'Sept' },
    { id: 'month-10', value: 10, label: 'Oct' },
    { id: 'month-11', value: 11, label: 'Nov' },
    { id: 'month-12', value: 12, label: 'Dec' },
  ];

  // 生成年份选项
  const generateYearOptions = (): SelectOption[] => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => {
      const value = currentYear - i;
      return {
        id: `year-${value}`,
        value: value,
        label: `${value}`,
      };
    });
  };

  // 自定义渲染选中值，保持文本居中
  const renderValue = (option: SelectOption | null) => {
    if (!option) {
      return <span className="text-base-content/50 block w-full text-center">DD</span>;
    }
    return <span className="block w-full text-center">{option.label}</span>;
  };

  const renderMonthValue = (option: SelectOption | null) => {
    if (!option) {
      return <span className="text-base-content/50 block w-full text-center">MM</span>;
    }
    return <span className="block w-full text-center">{option.label}</span>;
  };

  const renderYearValue = (option: SelectOption | null) => {
    if (!option) {
      return <span className="text-base-content/50 block w-full text-center">YYYY</span>;
    }
    return <span className="block w-full text-center">{option.label}</span>;
  };

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    if (!firstName || !lastName || !day || !month || !year) {
      return;
    }
    setLoading(true);
    updateKyc({
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      birthday: `${year}-${month}-${day}`,
    }).then((res) => {
      if (res.code === 0) {
        setOpen(true);
        refetch();
      }
    }).finally(() => {
      setLoading(false);
    });
  };

  const { t } = useTranslation();

  return (
    <FullBleedContainer>
      <SafeContent>
        <Page className="p-3">
          <div className="bg-base-100 flex flex-col gap-3 rounded-lg px-3 py-4">
            <p className="text-base font-bold">{t('common.completeMyProfile')}</p>
            <p className="text-sm leading-5">{t('common.completeMyProfileDescription')}</p>
            <fieldset className="fieldset">
              <legend className="fieldset-legend px-1 text-sm font-normal">
                {t('common.firstName')}
                <span className="text-error">*</span>
              </legend>
              <input type="text" className="input bg-base-200 h-12 w-full" placeholder="" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend px-1 text-sm font-normal">
                {t('common.middleName')}
                <span className="text-error">*</span>
              </legend>
              <input type="text" className="input bg-base-200 h-12 w-full" placeholder="" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend px-1 text-sm font-normal">
                {t('common.lastName')}
                <span className="text-error">*</span>
              </legend>
              <input type="text" className="input bg-base-200 h-12 w-full" placeholder="" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend px-1 text-sm font-normal">
                {t('common.dateOfBirth')}
                <span className="text-error">*</span>
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {/* 日选择器 */}
                <div>
                  <SelectDropdown
                    options={dayOptions}
                    value={day}
                    onChange={(value) => setDay(value)}
                    placeholder="DD"
                    variant="filled"
                    height="md"
                    className="rounded-lg bg-[#1E1E2A]"
                    dropdownClassName="bg-[#1E1E2A] max-h-[300px]"
                    renderValue={renderValue}
                    disabled={!month}
                  />
                </div>

                {/* 月选择器 */}
                <div>
                  <SelectDropdown
                    options={monthOptions}
                    value={month}
                    onChange={(value) => setMonth(value)}
                    placeholder="MM"
                    variant="filled"
                    height="md"
                    className="rounded-lg bg-[#1E1E2A]"
                    dropdownClassName="bg-[#1E1E2A] max-h-[300px]"
                    renderValue={renderMonthValue}
                    disabled={!year}
                  />
                </div>

                {/* 年选择器 */}
                <div>
                  <SelectDropdown
                    options={generateYearOptions()}
                    value={year}
                    onChange={(value) => setYear(value)}
                    placeholder="YYYY"
                    variant="filled"
                    height="md"
                    className="rounded-lg bg-[#1E1E2A]"
                    dropdownClassName="bg-[#1E1E2A] max-h-[300px]"
                    renderValue={renderYearValue}
                  />
                </div>
              </div>
            </fieldset>

            <button className="btn btn-primary h-12" onClick={onSubmit} disabled={loading || !firstName || !lastName || !day || !month || !year}>
              {loading ? <span className="loading loading-spinner loading-sm text-primary" /> : 'Continue'}
            </button>
          </div>
          <SetUpSuccessfully open={open} onClose={() => {
            setOpen(false);

          }} title={t('common.thankYouForCompletingYourProfile')} description={t('common.thankYouForCompletingYourProfileDescription')} />
        </Page>
      </SafeContent>
    </FullBleedContainer>
  );
};


