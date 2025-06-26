'use client';

import { useAlertStore } from '@/app/store/useAlertStore';
import Alert from './Alert';

const AlertContainer = () => {
  const alerts = useAlertStore((state) => state.alerts);
  const removeAlert = useAlertStore((state) => state.removeAlert);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {alerts.map(({ id, type, message }) => (
        <Alert key={id} type={type} message={message} onClose={() => removeAlert(id)} />
      ))}
    </div>
  );
};

export default AlertContainer;
