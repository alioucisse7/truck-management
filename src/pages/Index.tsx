
import React from 'react';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  ArrowRight, 
  BarChart, 
  Truck, 
  Users, 
  Calendar,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useCurrency, currencySymbols } from '@/components/layout/CurrencySettings';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';

const Index = () => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const currencySymbol = currencySymbols[currency];
  
  const { data: recentTrips, isLoading } = useQuery({
    queryKey: ['dashboardRecentTrips'],
    queryFn: dashboardService.getRecentTrips,
    staleTime: 60000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("Dashboard")}</h2>
          <p className="text-muted-foreground">
            {t("DashboardOverview")}
          </p>
        </div>
        <Button className="flex items-center gap-2" asChild>
          <Link to="/trips/add">
            <Plus className="h-4 w-4" />
            {t("NewTrip")}
          </Link>
        </Button>
      </div>
      
      <DashboardOverview />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl">{t("RecentTrips")}</CardTitle>
              <CardDescription>{t("LatestTripsStatus")}</CardDescription>
            </div>
            <Link to="/trips">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <span>{t("ViewAll")}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : recentTrips && recentTrips.length > 0 ? (
              <div className="space-y-4">
                {recentTrips.map(trip => (
                  <div key={trip._id || trip.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium">{trip.startLocation} {t("to")} {trip.destination}</span>
                        <Badge className={`${
                          trip.status === 'in-progress' ? 'bg-blue-500' : 
                          trip.status === 'completed' ? 'bg-green-500' : 
                          trip.status === 'planned' ? 'bg-purple-500' : 'bg-red-500'
                        } text-white`}>
                          {t(trip.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(trip.startDate).toLocaleString()} • {trip.cargoType}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{trip.revenue.toLocaleString()} {currencySymbol}</div>
                      <div className="text-sm text-muted-foreground">{trip.distance} km</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {t("NoTripsFound")}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{t("QuickAccess")}</CardTitle>
            <CardDescription>{t("NavigateKeySections")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/trucks">
              <Button variant="outline" className="w-full justify-between text-base">
                <div className="flex items-center">
                  <Truck className="mr-2 h-5 w-5 text-primary" />
                  {t("ManageTrucks")}
                </div>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/drivers">
              <Button variant="outline" className="w-full justify-between text-base">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  {t("ManageDrivers")}
                </div>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/trips">
              <Button variant="outline" className="w-full justify-between text-base">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  {t("TripSchedule")}
                </div>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/finances">
              <Button variant="outline" className="w-full justify-between text-base">
                <div className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-primary" />
                  {t("FinancialReports")}
                </div>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-4">
        <Link to="/company/invites" className="text-primary underline">
          Admin: Invite user to company
        </Link>
      </div>
    </div>
  );
};

export default Index;
