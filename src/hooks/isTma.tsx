import { isTMA } from '@telegram-apps/sdk-react';
import { useEffect, useState } from 'react';

export default function useIsTma() {
  const [isTmaApp, setIsTmaApp] = useState(false);

  useEffect(() => {
    const checkTma = async () => {
      const result = await isTMA();
      setIsTmaApp(result);
    };
    checkTma();
  }, []);

  return isTmaApp;
};

