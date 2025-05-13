
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useTranslation } from "react-i18next";
import { getStatusColor, Truck } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppSelector';
import { fetchTrips } from '@/store/tripsSlice';

import { useIsMobile } from '@/hooks/use-mobile';
import { useCurrency, currencySymbols } from '@/components/layout/CurrencySettings';
import { Input } from '@/components/ui/input';
import { Trip, getDriver, getCargoTypeIcon } from '@/lib/data';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Truck as TruckIcon, Edit, Box, DollarSign, Minus , User} from 'lucide-react';

interface TripCalendarProps {
  truck?: Truck;
  driverSalaryMap?: { [key: string]: number };
}

const TripCalendar = ({ truck, driverSalaryMap  }: TripCalendarProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { trips } = useAppSelector(state => state.trips);
  const { drivers , loading} = useAppSelector(state => state.drivers);

  const [date, setDate] = useState<Date>(new Date());
  const isMobile = useIsMobile();
  const { currency } = useCurrency();
  const currencySymbol = currencySymbols[currency];
  const [dataTrip, setTripData] = useState(trips);

  useEffect(() => {
    if (truck) {
      const filteredTrips = trips.filter(trip => trip.truckId._id === truck.id);
      setTripData(filteredTrips);
    }

    handleMonthChange(new Date());
  }, [truck, trips]);
  

  const calculateTotalExpenses = (trip: Trip) => {
    const mtqsCalculated =
      typeof trip.mtqs === "number"
        ? trip.mtqs
        : 0;
    const managementFees = Math.floor(
      ((trip.amountET ?? 0) * (trip.managementFeesPercent ?? 0)) / 100
    );
    const missionFees = Number(trip.missionFees) || 0;
    const fuelExpense = Number(trip.expenses?.fuel) || 0;
    const tollExpense = Number(trip.expenses?.tolls) || 0;
    const maintenanceExpense = Number(trip.expenses?.maintenance) || 0;
    const otherExpense = Number(trip.expenses?.other) || 0;

    return (
      mtqsCalculated +
      managementFees +
      missionFees +
      fuelExpense +
      tollExpense +
      maintenanceExpense +
      otherExpense
    );
  };

  const modifyDayContent = (day: Date) => {
    const dayTrips = dataTrip.filter(trip => {
      const tripDate = new Date(trip.startDate);
      return tripDate.toDateString() === day.toDateString();
    });

    if (dayTrips.length > 0) {
      return (
        <div className="relative w-full h-full flex flex-col items-center">
          <span>{day.getDate()}</span>
          {dayTrips.map((trip, index) => (
            <div 
              key={trip.id} 
              className="absolute bottom-0 left-0 w-full h-1.5 bg-primary rounded-full"
              style={{ bottom: `${index * 6}px` }}
            />
          ))}
        </div>
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center">
        {day.getDate()}
      </div>
    );
  }

  const handleMonthChange = (newDate: Date) => {
    setDate(newDate);

    if (truck) {
      const data = trips.filter(trip => {
        const tripDate = new Date(trip.startDate);
        return tripDate.getMonth() === newDate.getMonth() &&
               tripDate.getFullYear() === newDate.getFullYear() &&
               trip.truckId._id === truck.id;
      });
      
      setTripData(data);
    }
  };

  const currentMonthTrips = [...dataTrip].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const assignedDriver = truck.assignedDriverId ? drivers.find(d => d.id === truck.assignedDriverId) : undefined;
  const assignedSalary = assignedDriver ? driverSalaryMap[assignedDriver.id] : undefined;

  const totalTripExpenses = currentMonthTrips.reduce(
    (sum, trip) => sum + calculateTotalExpenses(trip), 0
  );

  const totalExtraCosts =
  truck.monthlyExtraCosts?.loadingCosts || 0+
  truck.monthlyExtraCosts?.challenge || 0 +
  truck.monthlyExtraCosts?.otherManagementFees || 0+
  truck.monthlyExtraCosts?.otherFees || 0;


  const totalDriverSalary = typeof assignedSalary === "number" ? assignedSalary : 0;
 
  const totalTripProfits = currentMonthTrips.reduce(
    (sum, trip) => {
      const profit = (trip.amountET ?? 0) - calculateTotalExpenses(trip);
      return sum + profit;
    }, 0
  );
 
   const monthlyNetProfit = totalTripProfits - totalExtraCosts - totalDriverSalary;
 
  return (
    <div className="space-y-4">
    <div
      className={
        isMobile
          ? "flex flex-col gap-4"
          : "flex items-start gap-4"
      }
    >
      <div className={isMobile ? "" : ""}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          className="rounded-md border shadow"
          modifiers={{
            hasTrip: (date) =>
              dataTrip.some((trip) => {
                const tripDate = new Date(trip.startDate);
                return (
                  tripDate.getDate() === date.getDate() &&
                  tripDate.getMonth() === date.getMonth() &&
                  tripDate.getFullYear() === date.getFullYear()
                );
              }),
          }}
          modifiersStyles={{
            hasTrip: { fontWeight: "bold", color: "var(--primary)" },
          }}
          components={{
            DayContent: ({ date }) => modifyDayContent(date),
          }}
          onMonthChange={handleMonthChange}
        />
      </div>
      <Card className={isMobile ? "" : "flex-1"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TruckIcon className="h-5 w-5" />
            {format(date, "MMMM yyyy")} - {truck.plateNumber}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              · {currentMonthTrips.length} trip
              {currentMonthTrips.length === 1 ? "" : "s"}
            </span>
          </CardTitle>
          {assignedDriver && typeof assignedSalary === 'number' && (
            <div className="mt-2 flex items-center gap-3">
              <User className="h-4 w-4 text-violet-500" />
              <span className="font-medium">Driver: {assignedDriver.name}</span>
              <Badge className="bg-gray-100 text-gray-900 border text-sm">
                Salary: {assignedSalary.toLocaleString("fr-FR")} {currencySymbol}
              </Badge>
            </div>
          )}
          <div className="mt-6">
            <div className="font-semibold text-base mb-1">
              Monthly Expenses (non-trip)
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
              {/* <div>
                <label className="block text-xs mb-1 font-medium">Escort Fees ({currencySymbol})</label>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  readOnly
                  value={truck.monthlyExtraCosts.escortFees}
                />
              </div> */}
              <div>
                <label className="block text-xs mb-1 font-medium">Loading Costs ({currencySymbol})</label>
                <Input
                 className="bg-gray-100 dark:bg-white/30"
                  type="number"
                  min={0}
                  step={1}
                  value={truck.monthlyExtraCosts?.loadingCosts || 0}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs mb-1 font-medium">Challenge ({currencySymbol})</label>
                <Input
                 className="bg-gray-100 dark:bg-white/30"
                  type="number"
                  min={0}
                  step={1}
                  value={truck.monthlyExtraCosts?.challenge || 0}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs mb-1 font-medium">Other Mgmt Fees ({currencySymbol})</label>
                <Input
                  className="bg-gray-100 dark:bg-white/30"
                  type="number"
                  min={0}
                  step={1}
                  value={truck.monthlyExtraCosts?.otherManagementFees || 0}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs mb-1 font-medium">Other Fees ({currencySymbol})</label>
                <Input
                 className="bg-gray-100 dark:bg-white/30"
                  type="number"
                  min={0}
                  step={1}
                  value={truck.monthlyExtraCosts?.otherFees || 0}
                  readOnly
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mb-1">
              These costs are <b>saved in your mock data and persist until next code reload</b>.
            </div>
            {assignedDriver && typeof assignedSalary === 'number' && (
              <div className="mt-2">
                <span className="block text-xs font-medium text-muted-foreground">
                  This month's driver salary: 
                  <span className="ml-2 font-semibold text-foreground">
                    {assignedSalary.toLocaleString("fr-FR")} {currencySymbol}
                  </span>
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded bg-muted/30 text-muted-foreground px-3 py-2 mb-3">
              <div>Total Trip Expenses:&nbsp;
                <span className="font-semibold text-foreground">
                  {totalTripExpenses.toLocaleString("fr-FR")} {currencySymbol}
                </span>
              </div>
              <div>Total Extra (Monthly) Expenses:&nbsp;
                <span className="font-semibold text-foreground">
                  {totalExtraCosts.toLocaleString("fr-FR")} {currencySymbol}
                </span>
              </div>
              <div>Driver Salary:&nbsp;
                <span className="font-semibold text-foreground">
                  {totalDriverSalary.toLocaleString("fr-FR")}
                </span>
              </div>
              <div className="mt-1 font-semibold text-base">
                <div>Total Trip Profits: {totalTripProfits.toLocaleString("fr-FR")} {currencySymbol}</div>
                <div>
                  Monthly Net Profit: 
                  <span className="ml-2 font-bold text-green-600">
                    {monthlyNetProfit.toLocaleString("fr-FR")} {currencySymbol}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">(Trip profits minus all expenses)</span>
                </div>
              </div>
            </div>
            {currentMonthTrips.length > 0 ? (
              currentMonthTrips.map((trip) => {
                const driver = getDriver(trip.driverId);
                const totalExpenses = calculateTotalExpenses(trip);
                const tripDate = new Date(trip.startDate);

                const numBL = typeof trip.numBL === "number" && !isNaN(trip.numBL) ? trip.numBL : 0;
                const equalization = typeof trip.equalization === "number" && !isNaN(trip.equalization) ? trip.equalization : 0;
                const amountET = typeof trip.amountET === "number" && !isNaN(trip.amountET) ? trip.amountET : 0;
                const mtqs = typeof trip.mtqs === "number" && !isNaN(trip.mtqs) ? trip.mtqs : 0;
                const missionFees = typeof trip.missionFees === "number" && !isNaN(trip.missionFees) ? trip.missionFees : 0;
                const tripProfit = amountET - totalExpenses;

                return (
                  <div key={trip.id} className="flex flex-col gap-3 border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {trip.startLocation} → {trip.destination}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(tripDate, "PPP")}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/trips/edit/${trip.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Box className="h-4 w-4 text-muted-foreground" />
                        <span className="flex items-center gap-1">
                          {getCargoTypeIcon(trip.cargoType)}
                          {trip.cargoType.charAt(0).toUpperCase() +
                            trip.cargoType.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Minus className="h-4 w-4" />
                        Expenses: {totalExpenses.toLocaleString()} {currencySymbol}
                      </div>
                      <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-violet-500" /> Driver: {driver?.name || "Unassigned"}
                      </div>
                      <div className="flex items-center gap-2">
                        Amount E.T ({currencySymbol}):{" "}
                        <span className="font-medium">
                          {amountET.toLocaleString("fr-FR")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        Num BL:{" "}
                        <span className="font-medium">
                          {numBL}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        Equalization:{" "}
                        <span className="font-medium">
                          {equalization.toLocaleString("fr-FR")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        Mtqs:{" "}
                        <span className="font-medium">
                          {mtqs.toLocaleString("fr-FR")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        Mission Fees:{" "}
                        <span className="font-medium">
                          {missionFees.toLocaleString("fr-FR")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <span className="font-semibold text-green-700">
                          Profit: {tripProfit.toLocaleString("fr-FR")} {currencySymbol}
                        </span>
                      </div>
                    </div>

                    <Badge
                      className={
                        `${getStatusColor(trip.status)} text-white mt-1`
                      }
                    >
                      {trip.status}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground">
                No trips scheduled for this month
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  );

};

export default TripCalendar;
