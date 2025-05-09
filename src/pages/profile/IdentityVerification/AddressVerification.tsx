import { updateKyc } from '@/api/profile';
import { FullBleedContainer, Page, SafeContent } from '@/components/ui';
import { QueryKycDetail } from '@/query/profile';
import { SetUpSuccessfully } from '@/sections/profile/SetUpSuccessfully';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AddressVerification() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [zipcode, setZipcode] = useState('');

    const { data, refetch } = QueryKycDetail();

    useEffect(() => {
      if (data) {
        setCountry(data.country);
        setState(data.state);
        setCity(data.city);
        setAddress(data.address);
        setZipcode(data.zip_code);
      }
    }, [data]);

    const [loading, setLoading] = useState(false);

    const onSubmit = () => {
      if (!country || !state || !city || !address || !zipcode) {
        return;
      }
      setLoading(true);
      updateKyc({
        country: country,
        state: state,
        city: city,
        address: address,
        zip_code: zipcode,
      }).then((res) => {
        if (res.code === 0) {
          setOpen(true);
          refetch();
        }
      }).finally(() => {  
        setLoading(false);
      });
    };

    return (
        <FullBleedContainer>
            <SafeContent>
                <Page className="p-3">
                    <div className="bg-base-100 flex flex-col gap-3 rounded-lg px-3 py-4">
                        <p className="text-base font-bold">{t('common.addressVerification')}</p>
                        <p className="text-sm leading-5 whitespace-pre-line">{t('common.addressVerificationDescription')}</p>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend px-1 text-sm font-normal">
                                {t('common.country')}
                                <span className="text-error">*</span>
                            </legend>
                            <input type="text" className="input bg-base-200 h-12 w-full" placeholder="" value={country} onChange={(e) => setCountry(e.target.value)} />
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend px-1 text-sm font-normal">
                                {t('common.stateProvince')}
                                <span className="text-error">*</span>
                            </legend>
                            <input type="text" className="input bg-base-200 h-12 w-full" placeholder="" value={state} onChange={(e) => setState(e.target.value)} />
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend px-1 text-sm font-normal">
                                {t('common.city')}
                                <span className="text-error">*</span>
                            </legend>
                            <input type="text" className="input bg-base-200 h-12 w-full" placeholder="" value={city} onChange={(e) => setCity(e.target.value)} />
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend px-1 text-sm font-normal">
                                {t('common.address')}
                                <span className="text-error">*</span>
                            </legend>
                            <input type="text" className="input bg-base-200 h-12 w-full" placeholder="" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend px-1 text-sm font-normal">
                                {t('common.zipcode')}
                                <span className="text-error">*</span>
                            </legend>
                            <input type="text" className="input bg-base-200 h-12 w-full" placeholder="" value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
                        </fieldset>

                        <button className="btn btn-primary h-12" onClick={onSubmit} disabled={loading || !country || !state || !city || !address || !zipcode}>
                            {loading ? <span className="loading loading-spinner loading-sm text-primary" /> : t('common.continue')}
                        </button>
                    </div>
                    <SetUpSuccessfully open={open} onClose={() => {
                        setOpen(false);
                    }} title={t('common.submissionSuccessful')} description={t('common.submissionSuccessfulDescription')} />
                </Page>
            </SafeContent>
        </FullBleedContainer>
    );
};


