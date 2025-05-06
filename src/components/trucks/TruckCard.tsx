
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fuel, Wrench, Truck, User, Settings, MoreVertical ,  Edit, Eye} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTranslation } from "react-i18next";
import { TruckData } from '@/store/trucksSlice';
import { useAppSelector } from '@/hooks/useAppSelector';

interface TruckCardProps {
  truck: TruckData;
}

const TruckCard: React.FC<TruckCardProps> = ({ truck }) => {
  const { t } = useTranslation();
  const { drivers } = useAppSelector(state => state.drivers);
  const [driverName, setDriverName] = useState<string>(t('Unassigned'));
  
  useEffect(() => {
    if (truck.assignedDriverId) {
      // Find the driver by ID in the Redux store
      const driver = drivers.find(d => d.id === truck.assignedDriverId);
      if (driver) {
        setDriverName(driver.name);
      }
    } else {
      setDriverName(t('Unassigned'));
    }
  }, [truck.assignedDriverId, drivers, t]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'on-trip':
        return 'bg-blue-500';
      case 'maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const lastMaintenanceDate = truck.lastMaintenance ? new Date(truck.lastMaintenance).toLocaleDateString() : t('NotAvailable');

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border-t-4 rounded-t-none" style={{ borderTopColor: truck.status === 'available' ? '#22c55e' : truck.status === 'on-trip' ? '#3b82f6' : '#f59e0b' }}>
      <CardContent className="p-0">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`bg-${truck.status === 'available' ? 'green' : truck.status === 'on-trip' ? 'blue' : 'yellow'}-100 p-2 rounded-full`}>
              <Truck className={`h-5 w-5 text-${truck.status === 'available' ? 'green' : truck.status === 'on-trip' ? 'blue' : 'yellow'}-500`} />
            </div>
            <div>
              <h3 className="font-bold">{truck.plateNumber}</h3>
              <p className="text-sm text-muted-foreground">{truck.model}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Badge className={`${getStatusColor(truck.status)} text-white mr-2`}>
            {t(truck.status)}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/trucks/edit/${truck.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    {t('EditInfo')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  {t('AssignDriver')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Wrench className="h-4 w-4 mr-2" />
                  {t('ScheduleMaintenance')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="p-4 space-y-4 bg-muted/10">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center text-muted-foreground">
                <Fuel className="h-4 w-4 mr-2 text-blue-500" />
                <span>{t('FuelLevel')}</span>
              </div>
              <span className="font-medium">{truck.fuelLevel}%</span>
            </div>
            <Progress 
              value={truck.fuelLevel} 
              className="h-2" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="flex items-center text-muted-foreground">
              <User className="h-4 w-4 mr-2 text-violet-500" />
              <span>{t('AssignedDriver')}:</span>
            </div>
            <div className="text-right font-medium truncate">
              {driverName}
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Wrench className="h-4 w-4 mr-2 text-yellow-500" />
              <span>{t('LastService')}:</span>
            </div>
            <div className="text-right">
              {new Date(truck.lastMaintenance).toLocaleDateString()}
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Settings className="h-4 w-4 mr-2 text-gray-500" />
              <span>{t('Capacity')}:</span>
            </div>
            <div className="text-right">
              {truck.capacity.toLocaleString("fr-FR")} L
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/20 px-4 py-3 flex justify-end items-center">
        {/* <div className="text-xs text-muted-foreground">
          ID: {truck.id}
        </div> */}
        <Button variant="outline" size="sm" className="h-8 text-xs flex items-center" asChild>
          <Link to={`/trucks/edit/${truck.id}`}>
            <Eye className="h-3 w-3 mr-1" />
            {t('ViewDetails')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TruckCard;
