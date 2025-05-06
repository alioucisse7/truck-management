
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, MapPin, ArrowRight, Truck, User, DollarSign, SquarePen } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TripCalendar from '@/components/trips/TripCalendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from "react-i18next";
import { useCurrency, currencySymbols } from '@/components/layout/CurrencySettings';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchTrips, TripData } from '@/store/tripsSlice';
import { useToast } from '@/hooks/use-toast';
import { getCargoTypeIcon, getStatusColor } from '@/lib/data';
import { fetchTrucks } from '@/store/trucksSlice';
import { fetchDrivers } from '@/store/driversSlice';

const Trips = () => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const currencySymbol = currencySymbols[currency];
  const dispatch = useAppDispatch();
  const { trips, loading, error } = useAppSelector(state => state.trips);
  const { toast } = useToast();
  const { trucks, loading: trucksLoading } = useAppSelector(state => state.trucks);
  const { drivers, loading: driversLoading } = useAppSelector(state => state.drivers);
  
  // State for the selected truck for calendar view
  const [selectedTruckId, setSelectedTruckId] = useState<string>("");
  
  useEffect(() => {
    dispatch(fetchTrips())
      .unwrap()
      .catch((err) => {
        toast({
          title: t("Error"),
          description: err,
          variant: "destructive",
        });
      });
      
    dispatch(fetchTrucks())
      .unwrap()
      .then((fetchedTrucks) => {
        if (fetchedTrucks.length > 0 && !selectedTruckId) {
          setSelectedTruckId(fetchedTrucks[0].id);
        }
      })
      .catch((err) => {
        console.error("Error fetching trucks:", err);
      });
      
    dispatch(fetchDrivers())
      .unwrap()
      .catch((err) => {
        console.error("Error fetching drivers:", err);
      });
  }, [dispatch, toast, t]);

  // Group trips by status
  const plannedTrips = trips.filter(trip => trip.status === 'planned');
  const ongoingTrips = trips.filter(trip => trip.status === 'in-progress');
  const completedTrips = trips.filter(trip => trip.status === 'completed');

  const selectedTruck = trucks.find(truck => truck.id === selectedTruckId);

  // Make a driver salary map (id -> salary)
  const driverSalaryMap = Object.fromEntries(
    drivers.map(d => [d.id, typeof d.salary === 'number' ? d.salary : 0])
  );
  
  const renderTripCard = (trip: TripData) => {
    // Get driver and truck info from the Redux store
    const driver = trip.driver;
    const truck = trip.truck;
   
    // Calculate total expenses
    const mtqsCalculated = Number(trip.mtqs) || 0;
    const managementFees = Math.floor(
      ((Number(trip.amountET) || 0) * (Number(trip.managementFeesPercent) || 0)) / 100
    );
    const missionFees = Number(trip.missionFees) || 0;
    const fuelExpense = Number(trip.expenses?.fuel) || 0;
    const tollExpense = Number(trip.expenses?.tolls) || 0;
    const maintenanceExpense = Number(trip.expenses?.maintenance) || 0;
    const otherExpense = Number(trip.expenses?.other) || 0;

    const totalExpenses =
      mtqsCalculated +
      managementFees +
      missionFees +
      fuelExpense +
      tollExpense +
      maintenanceExpense +
      otherExpense;

    // Net gain (Profit)
    const profit = (Number(trip.amountET) || 0) - totalExpenses;
    const profitPercent =
      (trip.amountET && Number(trip.amountET) !== 0)
        ? ((profit / Number(trip.amountET)) * 100).toFixed(1)
        : "0.0";

    // Detect displayed status label
    const statusLabels: { [key: string]: string } = {
      planned: t("Planned"),
      "in-progress": t("Ongoing"),
      completed: t("Completed"),
      cancelled: t("Cancelled"),
    };

    return (
      <Card key={trip.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">
                {trip.startLocation} <ArrowRight className="inline h-4 w-4" />{" "}
                {trip.destination}
              </CardTitle>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(trip.startDate).toLocaleDateString()}
                {trip.endDate && (
                  <span>
                    {" "}
                    - {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                )}
                <span className="ml-2 flex items-center">
                  <span className="mr-1">{getCargoTypeIcon(trip.cargoType)}</span>
                  {trip.cargoType.charAt(0).toUpperCase() + trip.cargoType.slice(1)}
                </span>
              </div>
            </div>
            <div className="flex flex-row items-end gap-2">
              <Badge className={`${getStatusColor(trip.status)} text-white mt-1`}>
                {t(trip.status) || trip.status}
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link to={`/trips/edit/${trip.id}`}>
                  <SquarePen className="h-8 w-8" />
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2 flex-1 flex flex-col">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <Truck className="h-4 w-4 mr-1" />
                {t("Trucks")}
              </div>
              <div className="font-medium">
                {truck ? `${truck.plateNumber} (${truck.model})` : t("UnknownTruck")}
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <User className="h-4 w-4 mr-1 text-violet-500" />
                {t("Drivers")}
              </div>
              <div className="font-medium">{driver ? driver.name : t("UnknownDriver")}</div>
            </div>

            <div className="flex flex-col space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {t("Distance")}
              </div>
              <div className="font-medium">{trip.distance} {t("km")}</div>
            </div>

            <div className="flex flex-col space-y-1">
              <div className="text-sm text-muted-foreground">Amount E.T ({currencySymbol})</div>
              <div className="font-medium">
                {Number(trip.amountET || 0).toLocaleString("fr-FR")}
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <div className="text-sm text-muted-foreground">Num BL</div>
              <div className="font-medium">{Number(trip.numBL || 0)}</div>
            </div>

            <div className="flex flex-col space-y-1">
              <div className="text-sm text-muted-foreground">Equalization</div>
              <div className="font-medium">{Number(trip.equalization || 0).toLocaleString("fr-FR")}</div>
            </div>

            <div className="flex flex-col space-y-1">
              <div className="text-sm text-muted-foreground">Mtqs</div>
              <div className="font-medium">{Number(trip.mtqs || 0).toLocaleString("fr-FR")}</div>
            </div>

            <div className="flex flex-col space-y-1">
              <div className="text-sm text-muted-foreground">Mission Fees</div>
              <div className="font-medium">
                {Number(trip.missionFees || 0).toLocaleString("fr-FR")}
              </div>
            </div>
          </div>
          {trip.observ && (
            <div className="mt-4 bg-gray-50 border border-dashed border-gray-300 rounded px-3 py-2 text-sm text-muted-foreground">
              <strong>{t("ObservComments")}: </strong> {trip.observ}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2 pb-3 flex justify-between items-center border-t bg-muted/30 mt-auto">
          <div className="text-sm">
            <span className="text-muted-foreground">{t("Expenses")}: </span>
            {(
              (Number(trip.mtqs || 0)) +
              ((Number(trip.amountET || 0) * (Number(trip.managementFeesPercent || 0))) / 100) +
              (Number(trip.missionFees || 0)) +
              (Number(trip.expenses?.fuel || 0)) +
              (Number(trip.expenses?.tolls || 0)) +
              (Number(trip.expenses?.maintenance || 0)) +
              (Number(trip.expenses?.other || 0))
            ).toLocaleString("fr-FR")}

          <span> {currencySymbol}</span>
          </div>
          <div
            className={`font-medium ${
              (Number(trip.amountET || 0) - (
                (Number(trip.mtqs || 0)) +
                ((Number(trip.amountET || 0) * (Number(trip.managementFeesPercent || 0))) / 100) +
                (Number(trip.missionFees || 0)) +
                (Number(trip.expenses?.fuel || 0)) +
                (Number(trip.expenses?.tolls || 0)) +
                (Number(trip.expenses?.maintenance || 0)) +
                (Number(trip.expenses?.other || 0))
              )) > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
             <span>{t("NetProfit")}: </span>
            
            {(
              Number(trip.amountET || 0) - (
                (Number(trip.mtqs || 0)) +
                ((Number(trip.amountET || 0) * (Number(trip.managementFeesPercent || 0))) / 100) +
                (Number(trip.missionFees || 0)) +
                (Number(trip.expenses?.fuel || 0)) +
                (Number(trip.expenses?.tolls || 0)) +
                (Number(trip.expenses?.maintenance || 0)) +
                (Number(trip.expenses?.other || 0))
              )
            ).toLocaleString("fr-FR")} 
          
          <span> {currencySymbol} </span>
           
            ({
              ((Number(trip.amountET || 0) - (
                (Number(trip.mtqs || 0)) +
                ((Number(trip.amountET || 0) * (Number(trip.managementFeesPercent || 0))) / 100) +
                (Number(trip.missionFees || 0)) +
                (Number(trip.expenses?.fuel || 0)) +
                (Number(trip.expenses?.tolls || 0)) +
                (Number(trip.expenses?.maintenance || 0)) +
                (Number(trip.expenses?.other || 0))
              )) / (Number(trip.amountET || 1)) * 100
            ).toFixed(1)})%
          </div>
        </CardFooter>
      </Card>
    );
  };
  
  if (loading || trucksLoading || driversLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-3">{t("Loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/10 border-destructive/50 border rounded-lg p-4">
          <h2 className="text-lg font-semibold text-destructive">{t("Error")}</h2>
          <p className="text-destructive/90">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("TripManagement")}</h2>
          <p className="text-muted-foreground">
            {t("ScheduleAndTrack")}
          </p>
        </div>
        <Button className="flex items-center gap-2 w-full sm:w-auto" asChild>
          <Link to="/trips/add">
            <Plus className="h-4 w-4" />
            {t("NewTrip")}
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="ongoing" className="space-y-4">
        <div className="w-full">
          <TabsList
            className="w-full flex flex-wrap gap-y-2 gap-x-2 sm:gap-x-4 sm:gap-y-2 rounded-lg justify-start bg-muted p-1 min-h-[48px] mb-5"
            style={{ minWidth: 0 }}
          >
            <TabsTrigger
              value="ongoing"
              className="relative min-w-[100px] px-2.5 py-2 flex-1 text-center"
            >
              {t("Ongoing")}
              {ongoingTrips.length > 0 && (
                <Badge className="ml-2 bg-blue-500 text-white">{ongoingTrips.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="planned"
              className="relative min-w-[100px] px-2.5 py-2 flex-1 text-center"
            >
              {t("Planned")}
              {plannedTrips.length > 0 && (
                <Badge className="ml-2 bg-purple-500 text-white">{plannedTrips.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="relative min-w-[100px] px-2.5 py-2 flex-1 text-center"
            >
              {t("Completed")}
              {completedTrips.length > 0 && (
                <Badge className="ml-2 bg-green-500 text-white">{completedTrips.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="min-w-[90px] px-2.5 py-2 flex-1 text-center"
            >
              {t("AllTrips")}
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="min-w-[120px] px-2.5 py-2 flex-1 text-center"
            >
              {t("CalendarView")}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="h-2 sm:h-3" />

        <TabsContent value="ongoing" className="space-y-4 mt-0">
          {ongoingTrips.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 h-full">
              {ongoingTrips.map(renderTripCard)}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">{t("NoOngoingTrips")}</p>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="planned" className="space-y-4 mt-0">
          {plannedTrips.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 h-full">
              {plannedTrips.map(renderTripCard)}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">{t("NoPlannedTrips")}</p>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 mt-0">
          {completedTrips.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 h-full">
              {completedTrips.map(renderTripCard)}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">{t("NoCompletedTrips")}</p>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4 mt-0">
          {trips.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 h-full">
              {trips.map(renderTripCard)}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">{t("NoTripsFound")}</p>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <span>{t("TripCalendar")}</span>
                <div className="w-full sm:w-64">
                  <Select 
                    value={selectedTruckId} 
                    onValueChange={(value) => setSelectedTruckId(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("SelectTruck")} />
                    </SelectTrigger>
                    <SelectContent>
                      {trucks.map(truck => (
                        <SelectItem key={truck.id} value={truck.id}>
                          {truck.plateNumber} ({truck.model})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTruck ? (
                <TripCalendar key={selectedTruck.id} truck={selectedTruck} driverSalaryMap={driverSalaryMap} />
              ) : (
                <p className="text-center py-8 text-muted-foreground">{t("SelectTruckToViewCalendar")}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trips;
