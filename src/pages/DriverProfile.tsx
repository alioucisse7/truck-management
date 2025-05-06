
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDriver, Driver } from '@/lib/data';
import { DriverProfile } from '@/components/drivers/DriverProfile';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchDriverById } from '@/store/driversSlice';
import { useToast } from '@/hooks/use-toast';
import { LoadingState } from '@/components/ui/loading-state';

const DriverProfilePage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { selectedDriver, loading, error } = useAppSelector(state => state.drivers);
  
  // Use local state for mock data when developing/testing
  const mockDriver = id ? getDriver(id) : undefined;
  
  React.useEffect(() => {
    if (id) {
      dispatch(fetchDriverById(id))
        .unwrap()
        .catch((err) => {
          toast({
            title: "Error",
            description: `Failed to fetch driver: ${err}`,
            variant: "destructive"
          });
        });
    }
  }, [id, dispatch, toast]);

  // Handle loading state
  if (loading) {
    return <LoadingState message={t("LoadingDriverProfile")} />;
  }

  // Map the API response (selectedDriver) to match the Driver interface
  // or fall back to mock data
  const driver = selectedDriver ? {
    id: selectedDriver.id,
    name: selectedDriver.name,
    avatar: selectedDriver.avatar || '/placeholder.svg', // Ensure avatar is always defined
    phone: selectedDriver.phone || '',
    license: selectedDriver.license,
    experience: selectedDriver.experience,
    status: selectedDriver.status,
    salary: selectedDriver.salary
  } : mockDriver;

  if (!driver || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold mb-4">{t("DriverNotFound")}</h1>
        <p className="text-muted-foreground mb-6">
          {error || t("TheRequestedDriverCouldNotBeFound")}
        </p>
        <Button onClick={() => navigate('/drivers')}>{t("BackToDrivers")}</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/drivers')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t("Back")}
          </Button>
          <h1 className="text-3xl font-bold">{t("DriverProfile")}</h1>
        </div>
        <Button asChild>
          <Link to={`/drivers/edit/${driver.id}`}>
            <Edit className="h-4 w-4 mr-2" />
            {t("EditProfile")}
          </Link>
        </Button>
      </div>
      
      <DriverProfile driver={driver} />
    </div>
  );
}

export default DriverProfilePage;
