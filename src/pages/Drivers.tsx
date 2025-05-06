
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DriverList from '@/components/drivers/DriverList';
import { Button } from '@/components/ui/button';
import { UserPlus, FileSpreadsheet, Filter, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchDrivers } from '@/store/driversSlice';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Available', value: 'available' },
  { label: 'OnTrip', value: 'on-trip' },
  { label: 'OffDuty', value: 'off-duty' },
];

const Drivers = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const dispatch = useAppDispatch();
  const { drivers, loading, error } = useAppSelector(state => state.drivers);
  const { toast } = useToast();

  useEffect(() => {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("DriverManagement")}</h2>
        <p className="text-muted-foreground">
          {t("ManageDriversAssignments")}
        </p>
      </div>
      
      { error && (
        <Alert variant="destructive">
          <AlertTitle>Error loading data</AlertTitle>
          <AlertDescription>
            {error}.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder={t("SearchDrivers")}
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
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("FilterBy")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {statusOptions.map(option => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={statusFilter === option.value ? "bg-accent font-bold" : ""}
                >
                  {t(option.label)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
{/*           
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                {t("Export")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("ExportCSV")}</DropdownMenuItem>
              <DropdownMenuItem>{t("ExportPDF")}</DropdownMenuItem>
              <DropdownMenuItem>{t("PrintList")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link to="/drivers/add">
              <UserPlus className="h-4 w-4 mr-2" />
              {t("AddDriver")}
            </Link>
          </Button>
        </div>
      </div>

      {statusFilter && (<p className="">
        {t("FilterBy")}: {t(statusFilter)}
        </p>)}

        <DriverList 
          drivers={drivers}
          searchQuery={searchQuery}
          statusFilter={statusFilter || undefined}
          isLoading={loading}
          error={error}
        />
      
      
    </div>
  );
};

export default Drivers;
