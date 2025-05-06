
import React, { useMemo } from 'react';
import TruckCard from './TruckCard';
import { Loader2 } from 'lucide-react';
import { TruckData } from '@/store/trucksSlice';
import { Truck } from '@/lib/data';
import { Link } from 'react-router-dom';

interface TruckListProps {
  searchQuery?: string;
  statusFilter?: 'available' | 'on-trip' | 'maintenance';
  trucks?: TruckData[];
  isLoading?: boolean;
}

const TruckList: React.FC<TruckListProps> = ({ 
  searchQuery = '', 
  statusFilter,
  trucks = [],
  isLoading = false
}) => {
  // Filter trucks based on search query and status filter
  const filteredTrucks = useMemo(() => {
    let filtered = trucks;
    if (statusFilter) {
      filtered = filtered.filter(truck => truck.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(truck =>
        truck.plateNumber?.toLowerCase().includes(q) ||
        truck.model?.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [searchQuery, statusFilter, trucks]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading trucks...</span>
      </div>
    );
  }

  if (!filteredTrucks.length) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium">No trucks found</h3>
        <p className="text-muted-foreground mt-1">Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrucks.map(truck => {
          // Get truck ID, handling both id and _id formats
          const truckId = truck?.id || (truck as any)?._id;
          const hasValidId = truckId && truckId !== 'undefined';
          
          // Set a default value for fuelLevel if it's undefined
          const truckWithDefaults = {
            ...truck,
            fuelLevel: truck.fuelLevel || 0, 
          } as Truck;
          
          if (hasValidId) {
            return (
              <Link key={truckId} to={`/trucks/edit/${truckId}`}>
                <TruckCard truck={truckWithDefaults} />
              </Link>
            );
          } else {
            return (
              <div key={`truck-${Math.random()}`}>
                <TruckCard truck={truckWithDefaults} />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default TruckList;
