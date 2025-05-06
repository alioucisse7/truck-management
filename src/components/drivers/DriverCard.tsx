
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Clock, Award, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { DriverData } from '@/store/driversSlice';

interface DriverCardProps {
  driver: DriverData;
}

const DriverCard: React.FC<DriverCardProps> = ({ driver }) => {
  const { t } = useTranslation();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'on-trip':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get driver ID, handling both id and _id formats
  const driverId = driver?.id || (driver as any)?._id;
  const hasValidId = driverId && driverId !== 'undefined';

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border-t-4 rounded-t-none" 
         style={{ borderTopColor: driver.status === 'available' ? '#22c55e' : driver.status === 'on-trip' ? '#3b82f6' : '#6b7280' }}>
      <CardContent className="p-0">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2" 
                    style={{ borderColor: driver.status === 'available' ? '#22c55e' : driver.status === 'on-trip' ? '#3b82f6' : '#6b7280' }}>
              <AvatarImage src={driver.avatar} alt={driver.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {driver.name?.split(' ').map(n => n[0]).join('') || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold">{driver.name}</h3>
              <Badge className={`${getStatusColor(driver.status)} text-white mt-1`}>
                {t(driver.status)}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {hasValidId && (
                <>
                  <DropdownMenuItem asChild>
                    <Link to={`/drivers/profile/${driverId}`}>{t("ViewProfile")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/drivers/edit/${driverId}`}>{t("EditInfo")}</Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem>{t("AssignDriver")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="p-4 space-y-3 bg-muted/10">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-muted-foreground">
                <Phone className="h-4 w-4 mr-2 text-blue-500" />
                <span>{t("Phone")}:</span>
              </div>
              <span className="font-medium">{driver.phone || 'N/A'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-muted-foreground">
                <Award className="h-4 w-4 mr-2 text-amber-500" />
                <span>{t("License")}:</span>
              </div>
              <span className="font-medium">{driver.license}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2 text-green-500" />
                <span>{t("Experience")}:</span>
              </div>
              <span>{driver.experience} {t("years")}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/20 px-4 py-3 flex justify-end items-center">
        {hasValidId ? (
          <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
            <Link to={`/drivers/profile/${driverId}`}>{t("DrivingHistory")}</Link>
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="h-8 text-xs" disabled>
            {t("DrivingHistory")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DriverCard;
