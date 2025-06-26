import { create } from 'zustand';

export type AlertType = 'success' | 'error';

export interface AlertItem {
  id: string;
  type: AlertType;
  message: string;
}

interface AlertState {
  alerts: AlertItem[];
  addAlert: (type: AlertType, message: string) => void;
  removeAlert: (id: string) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  addAlert: (type, message, duration = 6000) => {
    const id = crypto.randomUUID();
    set((state) => ({
      alerts: [...state.alerts, { id, type, message }],
    }));
    setTimeout(() => {
      set((state) => ({
        alerts: state.alerts.filter((alert) => alert.id !== id),
      }));
    }, duration);
  },
  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== id),
    })),
}));
