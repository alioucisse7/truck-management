
import React from 'react';
import { useTranslation } from "react-i18next";
import TruckLocationMap from '@/components/map/TruckLocationMap';

const TruckMap = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">{t("TruckLocationMap")}</h1>
      <TruckLocationMap />
    </div>
  );
};

export default TruckMap;
