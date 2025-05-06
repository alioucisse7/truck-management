
import React from 'react';
import { useTranslation } from "react-i18next";
import FuelLevelChart from '@/components/fuel/FuelLevelChart';

const FuelMonitoring = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">{t("FuelMonitoring")}</h1>
      <FuelLevelChart />
    </div>
  );
};

export default FuelMonitoring;
