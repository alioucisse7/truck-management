
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Truck, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Droplet,
  Loader2
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from "react-i18next";
import { useCurrency, currencySymbols } from '@/components/layout/CurrencySettings';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';

const DashboardOverview: React.FC = () => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const currencySymbol = currencySymbols[currency];

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardService.getStats
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const profitMargin = stats.totalRevenue > 0
    ? ((stats.totalRevenue - stats.totalExpenses) / stats.totalRevenue) * 100
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("AvailableTrucks")}
          </CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeTrucks}</div>
          <p className="text-xs text-muted-foreground">{t("TrucksInService")}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("AvailableDrivers")}
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.availableDrivers}</div>
          <p className="text-xs text-muted-foreground">{t("DriversReady")}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("OngoingTrips")}
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.ongoingTrips}</div>
          <p className="text-xs text-muted-foreground">{t("TripsInProgress")}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("TotalRevenue")}
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalRevenue.toLocaleString()} {currencySymbol}
          </div>
          <p className="text-xs text-muted-foreground">{t("RevenueCalculation")}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("ProfitMargin")}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profitMargin.toFixed(1)}%</div>
          <div className="mt-2">
            <Progress value={profitMargin} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {(stats.totalRevenue - stats.totalExpenses).toLocaleString()}  {currencySymbol} {t("NetProfit")}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("FuelConsumption")}
          </CardTitle>
          <Droplet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.fuelConsumption.toLocaleString()} {currencySymbol}
          </div>
          <p className="text-xs text-muted-foreground">{t("MonthlyFuel")}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
