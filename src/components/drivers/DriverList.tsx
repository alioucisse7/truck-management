
import React from 'react';
import { Link } from 'react-router-dom';
import DriverCard from './DriverCard';
import { LoadingState } from '@/components/ui/loading-state';
import { DriverData } from '@/store/driversSlice';
import { useFetchData } from '@/hooks/useFetchData';
import { useTranslation } from 'react-i18next';

interface DriverListProps {
  searchQuery?: string;
  statusFilter?: string;
  drivers?: DriverData[];
  isLoading?: boolean;
  error?: string;      
}

const DriverList: React.FC<DriverListProps> = ({ 
  searchQuery = '', 
  statusFilter = '',
  drivers = [],
  isLoading = false,
  error = '',                                   
}) => {

  const { t } = useTranslation();
  // const { data: drivers, loading, error } = useFetchData<DriverData>('/drivers');

  // Filter drivers based on search query and status filter
  const filteredDrivers = React.useMemo(() => {
    let filtered = drivers;
    if (statusFilter) {
      filtered = filtered.filter(driver => driver.status === statusFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(driver =>
        driver.name?.toLowerCase().includes(query) || 
        (driver.phone && driver.phone.includes(query)) ||
        driver.license?.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [searchQuery, statusFilter, drivers]);
  
  if (isLoading) {
    return <LoadingState message={t("LoadingDriver")} />;
  }

  if (error) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium">{t("ErrorLoadingDriver")}</h3>
        <p className="text-muted-foreground mt-1">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {filteredDrivers.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDrivers.map(driver => {
            // Check if driver has a valid ID
            const driverId = driver?.id || (driver as any)?._id;
            const hasValidId = driverId && driverId !== 'undefined';
            
            return hasValidId ? (
              <Link key={driverId} to={`/drivers/profile/${driverId}`}>
                <DriverCard driver={driver} />
              </Link>
            ) : (
              <div key={`driver-${Math.random()}`}>
                <DriverCard driver={driver} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">{t("NoDriverFound")}</h3>
          <p className="text-muted-foreground mt-1">{t("AjustSearch")}</p>
        </div>
      )}
    </div>
  );
};

export default DriverList;
