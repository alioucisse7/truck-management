
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FuelLevelChart = () => {
  const { t } = useTranslation();
  const { data: trucks, isLoading } = useQuery({
    queryKey: ['fuelData'],
    queryFn: dashboardService.getFuelData
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!trucks?.length) {
    return (
      <Card>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">{t("NoFuelData")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("FuelLevelChart")}</CardTitle>
        <CardDescription>{t("FuelLevelDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trucks}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="plateNumber" />
              <YAxis 
                domain={[0, 100]}
                label={{ value: t("FuelLevelPercent"), angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="fuelLevel"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ fill: "#4f46e5" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FuelLevelChart;
