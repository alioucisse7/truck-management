
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TruckList from '@/components/trucks/TruckList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TruckIcon as Truck, Download, Plus, Calendar, Wrench } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchTrucks } from '@/store/trucksSlice';
import { fetchDrivers } from '@/store/driversSlice';
import { useToast } from '@/hooks/use-toast';

const Trucks = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'available' | 'on-trip' | 'maintenance' | ''>('');
  
  const dispatch = useAppDispatch();
  const { trucks, loading, error } = useAppSelector(state => state.trucks);
  const { toast } = useToast();
  
  useEffect(() => {
    dispatch(fetchTrucks())
      .unwrap()
      .catch((err) => {
        toast({
          title: "Error",
          description: `Failed to fetch trucks: ${err}`,
          variant: "destructive"
        });
      });

    dispatch(fetchDrivers())
      .unwrap()
      .catch((err) => {
        toast({
          title: "Error",
          description: `Failed to fetch drivers: ${err}`,
          variant: "destructive"
        });
      });
  }, [dispatch, toast]);

  // Count trucks by status
  const availableTrucks = trucks.filter(truck => truck.status === 'available').length;
  const onTripTrucks = trucks.filter(truck => truck.status === 'on-trip').length;
  const maintenanceTrucks = trucks.filter(truck => truck.status === 'maintenance').length;
    
  return (
    <div className="space-y-6">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">{t("FleetManagement")}</h2>
      <p className="text-muted-foreground">
        {t("ManageFleet")}
      </p>
    </div>
    
    <div className="grid gap-4 md:grid-cols-3">
      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10 p-4 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-green-600 dark:text-green-400">{t("Available")}</p>
            <h3 className="text-2xl font-bold mt-1">{availableTrucks}</h3>
          </div>
          <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded-full">
            <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">{t("ReadyForAssignment")}</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t("OnTrip")}</p>
            <h3 className="text-2xl font-bold mt-1">{onTripTrucks}</h3>
          </div>
          <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-full">
            <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">{t("CurrentlyOnAssignment")}</p>
      </div>
      
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/10 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{t("Maintenance")}</p>
            <h3 className="text-2xl font-bold mt-1">{maintenanceTrucks}</h3>
          </div>
          <div className="p-2 bg-yellow-100 dark:bg-yellow-800/30 rounded-full">
            <Wrench className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70 mt-1">{t("UnderServiceOrRepair")}</p>
      </div>
    </div>
    
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="relative w-full max-w-sm">
        <Input
          placeholder={t("SearchTrucks")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <div className="flex gap-2 w-full sm:w-auto">
        {/* Removed Filter Dropdown */}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {t("Export")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{t("ExportCSV")}</DropdownMenuItem>
            <DropdownMenuItem>{t("ExportPDF")}</DropdownMenuItem>
            <DropdownMenuItem>{t("PrintList")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button className="bg-primary hover:bg-primary/90" asChild>
          <Link to="/trucks/add">
            <Plus className="h-4 w-4 mr-2" />
            {t("AddTruck")}
          </Link>
        </Button>
      </div>
    </div>
    
    {error ? (
        <div className="rounded-lg border border-destructive p-4">
          <p className="text-destructive">{error}</p>
        </div>
      ) : (
        <>
        <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t("AllTrucks")}</TabsTrigger>
          <TabsTrigger value="available">{t("Available")}</TabsTrigger>
          <TabsTrigger value="on-trip">{t("OnTrip")}</TabsTrigger>
          <TabsTrigger value="maintenance">{t("Maintenance")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <TruckList  trucks={trucks} searchQuery={searchQuery} isLoading={loading} />
        </TabsContent>
        
        <TabsContent value="available">
          <TruckList  trucks={trucks} searchQuery={searchQuery} isLoading={loading} statusFilter="available" />
        </TabsContent>
        
        <TabsContent value="on-trip">
          <TruckList  trucks={trucks} searchQuery={searchQuery} isLoading={loading} statusFilter="on-trip" />
        </TabsContent>
        
        <TabsContent value="maintenance">
          <TruckList  trucks={trucks} searchQuery={searchQuery} isLoading={loading} statusFilter="maintenance" />
        </TabsContent>
      </Tabs>
      </>
      )}
    </div>
  );
};

export default Trucks;

