
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export const useDistanceUnit = () => {
  const distanceUnit = localStorage.getItem('distanceUnit') as 'km' | 'mile' || 'km';
  const setDistanceUnit = (newDistanceUnit: 'km' | 'mile') => {
    localStorage.setItem('distanceUnit', newDistanceUnit);
    window.dispatchEvent(new Event('distanceUnitChange'));
  };
  return { distanceUnit, setDistanceUnit };
};

const DistanceUnitSettings: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { distanceUnit, setDistanceUnit } = useDistanceUnit();

  const handleDistanceUnitChange = (value: string) => {
    setDistanceUnit(value as 'km' | 'mile');
    toast({
      title: t('SettingsSaved'),
      description: t('DistanceUnitUpdated'),
    });
  };

  return (
    <div>
      <div className="text-lg font-medium mb-2">{t('DistanceUnit')}</div>
      <p className="text-muted-foreground text-sm mb-4">{t('SelectDistanceUnit')}</p>
      <RadioGroup value={distanceUnit} onValueChange={handleDistanceUnitChange} className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="km" id="km" />
          <Label htmlFor="km">{t('Kilometer')}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mile" id="mile" />
          <Label htmlFor="mile">{t('Mile')}</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default DistanceUnitSettings;
