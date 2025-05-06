
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Fuel } from 'lucide-react';

export const useFuelUnit = () => {
  const fuelUnit = localStorage.getItem('fuelUnit') as 'gallon' | 'liter' || 'liter';
  const setFuelUnit = (newFuelUnit: 'gallon' | 'liter') => {
    localStorage.setItem('fuelUnit', newFuelUnit);
    window.dispatchEvent(new Event('fuelUnitChange'));
  };
  return { fuelUnit, setFuelUnit };
};

const FuelUnitSettings: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { fuelUnit, setFuelUnit } = useFuelUnit();

  const handleFuelUnitChange = (value: string) => {
    setFuelUnit(value as 'gallon' | 'liter');
    toast({
      title: t('SettingsSaved'),
      description: t('FuelUnitUpdated'),
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <Fuel className="h-5 w-5 text-primary" />
        <div>
          <Label className="font-medium">{t('FuelUnit')}</Label>
          <p className="text-sm text-muted-foreground mt-1">{t('SelectFuelUnit')}</p>
        </div>
      </div>
      
      <RadioGroup value={fuelUnit} onValueChange={handleFuelUnitChange} className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="liter" id="liter" />
          <Label htmlFor="liter">{t('Liter')}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="gallon" id="gallon" />
          <Label htmlFor="gallon">{t('Gallon')}</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default FuelUnitSettings;
