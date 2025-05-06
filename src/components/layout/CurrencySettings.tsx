
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export type CurrencyType = 'USD' | 'EUR' | 'GNF' | 'CFA';

export const currencySymbols: Record<CurrencyType, string> = {
  USD: '$',
  EUR: '€',
  GNF: 'GNF',
  CFA: 'CFA',
};

export const useCurrency = () => {
  const currency = localStorage.getItem('currency') as CurrencyType || 'USD';
  const setCurrency = (newCurrency: CurrencyType) => {
    localStorage.setItem('currency', newCurrency);
    window.dispatchEvent(new Event('currencyChange'));
  };
  return { currency, setCurrency };
};

const CurrencySettings = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (value: string) => {
    setCurrency(value as CurrencyType);
    toast({
      title: t('SettingsSaved'),
      description: t('CurrencySettings'),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('CurrencySettings')}</CardTitle>
        <CardDescription>{t('SelectCurrency')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={currency} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('SelectCurrency')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">{t('USD')}</SelectItem>
            <SelectItem value="EUR">{t('EUR')}</SelectItem>
            <SelectItem value="GNF">{t('GNF')}</SelectItem>
            <SelectItem value="CFA">{t('CFA')}</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default CurrencySettings;
