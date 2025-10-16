import { useEffect, useState } from 'react';
import { Button } from '@components/ui/Button';

const STORAGE_KEY = 'cookie-consent-accepted';

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = window.localStorage.getItem(STORAGE_KEY);
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    window.localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6">
      <div className="flex w-full max-w-4xl flex-col gap-3 rounded-3xl border border-neutral-100 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-600">
          Usamos cookies essenciais para garantir o funcionamento do site e coletamos métricas anônimas de desempenho.
        </p>
        <Button size="sm" onClick={accept}>
          Entendi
        </Button>
      </div>
    </div>
  );
};

export default CookieConsent;
