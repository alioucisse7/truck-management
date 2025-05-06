
import api from './api';

export interface Settings {
  defaultCurrency: string;
  language: string;
  notificationSettings: {
    email: boolean;
    sms: boolean;
  };
  fuelUnit: 'gallon' | 'liter';
  distanceUnit: 'km' | 'mile';
}

export const settingsService = {
  get: () => api.get('/settings').then(res => res.data),
  update: (data: Partial<Settings>) => api.put('/settings', data).then(res => res.data),
};
