// import React, { useState, useEffect } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { CalendarIcon } from "lucide-react";
// import { Textarea } from "@/components/ui/textarea";
// import { useTranslation } from "react-i18next";
// import { TripData } from '@/store/tripsSlice';
// import { Truck, Driver } from '@/lib/data';
// import { useAppSelector } from '@/hooks/useAppSelector';
// import { Label } from '@/components/ui/label';
// import { format } from 'date-fns';

// const tripFormSchema = z.object({
//   startLocation: z.string().min(2, {
//     message: "Start location must be at least 2 characters.",
//   }),
//   destination: z.string().min(2, {
//     message: "Destination must be at least 2 characters.",
//   }),
//   startDate: z.date({
//     required_error: "A start date is required.",
//   }),
//   endDate: z.date().optional(),
//   status: z.enum(['planned', 'in-progress', 'completed', 'cancelled']),
//   truckId: z.string().min(1, {
//     message: "Truck assignment is required.",
//   }),
//   driverId: z.string().min(1, {
//     message: "Driver assignment is required.",
//   }),
//   distance: z.string().refine(value => !isNaN(Number(value)), {
//     message: "Distance must be a number.",
//   }),
//   cargoType: z.enum(['fuel', 'diesel', 'mazout']),
//   revenue: z.string().refine(value => !isNaN(Number(value)), {
//     message: "Revenue must be a number.",
//   }),
//   expenses: z.object({
//     fuel: z.string().refine(value => !isNaN(Number(value)), {
//       message: "Fuel expense must be a number.",
//     }),
//     tolls: z.string().refine(value => !isNaN(Number(value)), {
//       message: "Tolls expense must be a number.",
//     }),
//     maintenance: z.string().refine(value => !isNaN(Number(value)), {
//       message: "Maintenance expense must be a number.",
//     }),
//     other: z.string().refine(value => !isNaN(Number(value)), {
//       message: "Other expense must be a number.",
//     }),
//   }),
//   numBL: z.string().refine(value => !isNaN(Number(value)), {
//     message: "Number of BL must be a number.",
//   }).optional(),
//   equalization: z.string().refine(value => !isNaN(Number(value)), {
//     message: "Equalization must be a number.",
//   }).optional(),
//   amountET: z.string().refine(value => !isNaN(Number(value)), {
//     message: "Amount ET must be a number.",
//   }).optional(),
//   mtqs: z.string().refine(value => !isNaN(Number(value)), {
//     message: "MTQs must be a number.",
//   }).optional(),
//   pricePerLiter: z.string().refine(value => !isNaN(Number(value)), {
//     message: "Price per liter must be a number.",
//   }).optional(),
//   mtqsLiters: z.string().refine(value => !isNaN(Number(value)), {
//     message: "MTQs liters must be a number.",
//   }).optional(),
//   missionFees: z.string().refine(value => !isNaN(Number(value)), {
//     message: "Mission fees must be a number.",
//   }).optional(),
//   managementFeesPercent: z.string().refine(value => !isNaN(Number(value)), {
//     message: "Management fees percent must be a number.",
//   }).optional(),
//   observ: z.string().optional(),
//   notes: z.string().optional(),
// });

// interface TripFormProps {
//   trip?: TripData;
//   onSubmit: (values: any) => void;
//   title?: string;  // Make title optional with a default value
// }

// const TripForm = ({ trip, onSubmit, title = "Trip Details" }: TripFormProps) => {
//   const { t } = useTranslation();
//   const { trucks } = useAppSelector(state => state.trucks);
//   const { drivers } = useAppSelector(state => state.drivers);
//   const [selectedTruckId, setSelectedTruckId] = useState<string>("");
//   const [selectedDriverId, setSelectedDriverId] = useState<string>("");

//   const form = useForm<z.infer<typeof tripFormSchema>>({
//     resolver: zodResolver(tripFormSchema),
//     defaultValues: {
//       startLocation: trip?.startLocation || "",
//       destination: trip?.destination || "",
//       startDate: trip?.startDate ? new Date(trip.startDate) : new Date(),
//       endDate: trip?.endDate ? new Date(trip.endDate) : undefined,
//       status: trip?.status || 'planned',
//       truckId: trip?.truckId || "",
//       driverId: trip?.driverId || "",
//       distance: trip?.distance?.toString() || "0",
//       cargoType: trip?.cargoType || 'fuel',
//       revenue: trip?.revenue?.toString() || "0",
//       expenses: {
//         fuel: trip?.expenses?.fuel?.toString() || "0",
//         tolls: trip?.expenses?.tolls?.toString() || "0",
//         maintenance: trip?.expenses?.maintenance?.toString() || "0",
//         other: trip?.expenses?.other?.toString() || "0",
//       },
//       numBL: trip?.numBL?.toString() || "0",
//       equalization: trip?.equalization?.toString() || "0",
//       amountET: trip?.amountET?.toString() || "0",
//       mtqs: trip?.mtqs?.toString() || "0",
//       pricePerLiter: trip?.pricePerLiter?.toString() || "0",
//       mtqsLiters: trip?.mtqsLiters?.toString() || "0",
//       missionFees: trip?.missionFees?.toString() || "0",
//       managementFeesPercent: trip?.managementFeesPercent?.toString() || "0",
//       observ: trip?.observ || "",
//       notes: trip?.notes || "",
//     },
//   });

//   useEffect(() => {
//     if (trip) {
//       form.reset({
//         startLocation: trip.startLocation,
//         destination: trip.destination,
//         startDate: trip.startDate ? new Date(trip.startDate) : new Date(),
//         endDate: trip.endDate ? new Date(trip.endDate) : undefined,
//         status: trip.status,
//         truckId: trip.truckId || "",
//         driverId: trip.driverId || "",
//         distance: trip.distance?.toString() || "0",
//         cargoType: trip.cargoType,
//         revenue: trip.revenue?.toString() || "0",
//         expenses: {
//           fuel: trip.expenses?.fuel?.toString() || "0",
//           tolls: trip.expenses?.tolls?.toString() || "0",
//           maintenance: trip.expenses?.maintenance?.toString() || "0",
//           other: trip.expenses?.other?.toString() || "0",
//         },
//         numBL: trip.numBL?.toString() || "0",
//         equalization: trip.equalization?.toString() || "0",
//         amountET: trip.amountET?.toString() || "0",
//         mtqs: trip.mtqs?.toString() || "0",
//         pricePerLiter: trip.pricePerLiter?.toString() || "0",
//         mtqsLiters: trip.mtqsLiters?.toString() || "0",
//         missionFees: trip.missionFees?.toString() || "0",
//         managementFeesPercent: trip.managementFeesPercent?.toString() || "0",
//         observ: trip.observ || "",
//         notes: trip.notes || "",
//       });

//       // Fix the possibly null errors by adding null checks
//       if (trip.truckId) {
//         setSelectedTruckId(trip.truckId.toString());
//       }
      
//       if (trip.driverId) {
//         setSelectedDriverId(trip.driverId.toString());
//       }
//     }
//   }, [trip, form]);

//   function onSubmitHandler(values: z.infer<typeof tripFormSchema>) {
//     // Convert Date objects to strings for API compatibility
//     const formattedValues = {
//       ...values,
//       startDate: values.startDate ? format(values.startDate, 'yyyy-MM-dd') : '',
//       endDate: values.endDate ? format(values.endDate, 'yyyy-MM-dd') : undefined,
//     };
    
//     onSubmit(formattedValues);
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
//         <div>
//           <h3 className="text-lg font-medium">{title}</h3>
//           <p className="text-muted-foreground">
//             {t("EnterTripDetails")}
//           </p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="startLocation"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t("StartLocation")}</FormLabel>
//                 <FormControl>
//                   <Input placeholder={t("StartLocation")} {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="destination"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t("Destination")}</FormLabel>
//                 <FormControl>
//                   <Input placeholder={t("Destination")} {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="startDate"
//             render={({ field }) => (
//               <FormItem className="flex flex-col">
//                 <FormLabel>{t("StartDate")}</FormLabel>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <FormControl>
//                       <Button
//                         variant={"outline"}
//                         className={cn(
//                           "w-[240px] pl-3 text-left font-normal",
//                           !field.value && "text-muted-foreground"
//                         )}
//                       >
//                         {field.value ? (
//                           format(new Date(field.value), "PPP")
//                         ) : (
//                           <span>{t("PickADate")}</span>
//                         )}
//                         <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                       </Button>
//                     </FormControl>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar
//                       mode="single"
//                       selected={field.value}
//                       onSelect={field.onChange}
//                       initialFocus
//                     />
//                   </PopoverContent>
//                 </Popover>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="endDate"
//             render={({ field }) => (
//               <FormItem className="flex flex-col">
//                 <FormLabel>{t("EndDate")}</FormLabel>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <FormControl>
//                       <Button
//                         variant={"outline"}
//                         className={cn(
//                           "w-[240px] pl-3 text-left font-normal",
//                           !field.value && "text-muted-foreground"
//                         )}
//                       >
//                         {field.value ? (
//                           format(new Date(field.value), "PPP")
//                         ) : (
//                           <span>{t("PickADate")}</span>
//                         )}
//                         <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                       </Button>
//                     </FormControl>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar
//                       mode="single"
//                       selected={field.value}
//                       onSelect={field.onChange}
//                       disabled={(date) =>
//                         date < form.getValues("startDate")
//                       }
//                       initialFocus
//                     />
//                   </PopoverContent>
//                 </Popover>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="status"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t("Status")}</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder={t("SelectAStatus")} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="planned">{t("Planned")}</SelectItem>
//                     <SelectItem value="in-progress">{t("Ongoing")}</SelectItem>
//                     <SelectItem value="completed">{t("Completed")}</SelectItem>
//                     <SelectItem value="cancelled">{t("Cancelled")}</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="cargoType"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t("CargoType")}</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder={t("SelectCargoType")} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="fuel">{t("Fuel")}</SelectItem>
//                     <SelectItem value="diesel">{t("Diesel")}</SelectItem>
//                     <SelectItem value="mazout">{t("Mazout")}</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="truckId"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t("Trucks")}</FormLabel>
//                 <Select
//                   onValueChange={(value) => {
//                     field.onChange(value);
//                     setSelectedTruckId(value);
//                   }}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder={t("SelectATruck")} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {trucks.map((truck) => (
//                       <SelectItem key={truck.id} value={truck.id}>
//                         {truck.plateNumber} ({truck.model})
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="driverId"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t("Drivers")}</FormLabel>
//                 <Select
//                   onValueChange={(value) => {
//                     field.onChange(value);
//                     setSelectedDriverId(value);
//                   }}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder={t("SelectADriver")} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {drivers.map((driver) => (
//                       <SelectItem key={driver.id} value={driver.id}>
//                         {driver.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="distance"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t("Distance")} ({t("km")})</FormLabel>
//                 <FormControl>
//                   <Input placeholder={t("Distance")} {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="revenue"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t("Revenue")}</FormLabel>
//                 <FormControl>
//                   <Input placeholder={t("Revenue")} {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div>
//           <h4 className="text-md font-medium">{t("Expenses")}</h4>
//           <p className="text-muted-foreground">
//             {t("EnterAllExpenses")}
//           </p>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
//             <FormField
//               control={form.control}
//               name="expenses.fuel"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("FuelExpenses")}</FormLabel>
//                   <FormControl>
//                     <Input placeholder={t("FuelExpenses")} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="expenses.tolls"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("TollsExpenses")}</FormLabel>
//                   <FormControl>
//                     <Input placeholder={t("TollsExpenses")} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="expenses.maintenance"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("MaintenanceExpenses")}</FormLabel>
//                   <FormControl>
//                     <Input placeholder={t("MaintenanceExpenses")} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="expenses.other"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("OtherExpenses")}</FormLabel>
//                   <FormControl>
//                     <Input placeholder={t("OtherExpenses")} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>

//         <div>
//           <h4 className="text-md font-medium">{t("AdditionalInformation")}</h4>
//           <p className="text-muted-foreground">
//             {t("EnterAdditionalInformation")}
//           </p>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
//             <FormField
//               control={form.control}
//               name="numBL"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("NumBL")}</FormLabel>
//                   <FormControl>
//                     <Input placeholder={t("NumBL")} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="equalization"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("Equalization")}</FormLabel>
//                   <FormControl>
//                     <Input placeholder={t("Equalization")} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="amountET"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("AmountET")}</FormLabel>
//                   <FormControl>
//                     <Input placeholder={t("AmountET")} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="mtqs"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("MTQs")}</FormLabel>
//                   <FormControl>
//                     <Input placeholder={t("MTQs")} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="pricePerLiter"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("PricePerLiter")}</FormLabel>
//                   <FormControl>
//                     <Input placeholder={t("PricePerLiter")} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="mtqsLiters"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("MTQsLiters")}</FormLabel>
//                   <FormControl>
//                     <Input placeholder={t("MTQsLiters")} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="missionFees"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("MissionFees")}</FormLabel>
//                   <FormControl>
//                     <Input placeholder={t("MissionFees")} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="managementFeesPercent"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("ManagementFeesPercent")}</FormLabel>
//                   <FormControl>
//                     <Input placeholder={t("ManagementFeesPercent")} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>

//         <FormField
//           control={form.control}
//           name="observ"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>{t("ObservComments")}</FormLabel>
//               <FormControl>
//                 <Textarea
//                   placeholder={t("ObservComments")}
//                   className="resize-none"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="notes"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>{t("Notes")}</FormLabel>
//               <FormControl>
//                 <Textarea
//                   placeholder={t("Notes")}
//                   className="resize-none"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit">{t("Submit")}</Button>
//       </form>
//     </Form>
//   );
// };

// export default TripForm;


import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tripFormSchema } from "@/lib/form-schemas";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useCurrency, currencySymbols } from "@/components/layout/CurrencySettings";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppSelector";
import { fetchTrucks } from "@/store/trucksSlice";
import { fetchDrivers } from "@/store/driversSlice";
import { Trip } from "@/lib/data";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type TripFormValues = z.infer<typeof tripFormSchema>;

interface TripFormProps {
  trip?: Trip;
  onSubmit: (data: TripFormValues) => void;
}

const TripForm = ({ trip, onSubmit }: TripFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { trucks, loading: trucksLoading } = useAppSelector(state => state.trucks);
  const { drivers, loading: driversLoading } = useAppSelector(state => state.drivers);
  
  // Check if truckId and driverId are objects or strings
  const getTruckId = (trip?: Trip) => {
    if (!trip || !trip.truckId) return "";
    return (trip?.truckId as any)?._id ? (trip?.truckId as any)?._id : "";
  };
  
  const getDriverId = (trip?: Trip) => {
    if (!trip || !trip.driverId) return "";
    return (trip?.driverId as any)?._id ? (trip?.driverId as any)?._id : "";
  };
  
  // Filter available trucks and drivers
  const availableTrucks = React.useMemo(() => {
    // Include the currently assigned truck even if it's not available
    const currentTruckId = getTruckId(trip);
    
    return trucks.filter(truck => 
      truck.status === 'available' || 
      (currentTruckId && truck.id === currentTruckId)
    );
  }, [trucks, trip]);
  
  const availableDrivers = React.useMemo(() => {
    // Include the currently assigned driver even if they're not available
    const currentDriverId = getDriverId(trip);
    
    return drivers.filter(driver => 
      driver.status === 'available' || 
      (currentDriverId && driver.id === currentDriverId)
    );
  }, [drivers, trip]);
  
  useEffect(() => {
    // Fetch trucks and drivers when component mounts
    dispatch(fetchTrucks());
    dispatch(fetchDrivers());
  }, [dispatch]);

  // Initialize form with default values
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      truckId: getTruckId(trip) || "",
      driverId: getDriverId(trip) || "",
      cargoType: trip?.cargoType || "fuel",
      startLocation: trip?.startLocation || "",
      destination: trip?.destination || "",
      startDate: trip?.startDate || "",
      endDate: trip?.endDate || "",
      distance: trip?.distance || 0,
      status: trip?.status || "planned",
      revenue: trip?.revenue || 0,
      numBL: trip?.numBL || 0,
      equalization: trip?.equalization || 0,
      amountET: trip?.amountET || 0,
      mtqs: trip?.mtqs || 0,
      missionFees: trip?.missionFees || 0,
      managementFeesPercent: trip?.managementFeesPercent || 0,
      observ: trip?.observ || "",
      pricePerLiter: trip?.pricePerLiter || 0,
      mtqsLiters: trip?.mtqsLiters || 0,
      expenses: {
        fuel: trip?.expenses?.fuel || 0,
        tolls: trip?.expenses?.tolls || 0,
        maintenance: trip?.expenses?.maintenance || 0,
        other: trip?.expenses?.other || 0,
      },
    },
    mode: "onSubmit",
  });

  const { currency } = useCurrency();
  const currencySymbol = currencySymbols[currency];

  useEffect(() => {
    if (trip) {
      const startDate = new Date(trip.startDate);
      const formattedStartDate = `${startDate.getFullYear()}-${String(
        startDate.getMonth() + 1
      ).padStart(2, "0")}-${String(startDate.getDate()).padStart(
        2,
        "0"
      )}T${String(startDate.getHours()).padStart(2, "0")}:${String(
        startDate.getMinutes()
      ).padStart(2, "0")}`;

      let formattedEndDate = undefined;
      if (trip.endDate) {
        const endDate = new Date(trip.endDate);
        formattedEndDate = `${endDate.getFullYear()}-${String(
          endDate.getMonth() + 1
        ).padStart(2, "0")}-${String(endDate.getDate()).padStart(
          2,
          "0"
        )}T${String(endDate.getHours()).padStart(2, "0")}:${String(
          endDate.getMinutes()
        ).padStart(2, "0")}`;
      }
      
      const truckId = getTruckId(trip);
      const driverId = getDriverId(trip);
      
      form.reset({
        ...trip,
        truckId,
        driverId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        managementFeesPercent: trip.managementFeesPercent ?? 0,
        pricePerLiter: trip.pricePerLiter || 0,
        mtqs: trip.mtqs || 0,
        mtqsLiters: trip.mtqsLiters || 0,
        expenses: {
          fuel: trip.expenses.fuel || 0,
          tolls: trip.expenses.tolls || 0, 
          maintenance: trip.expenses.maintenance || 0,
          other: trip.expenses.other || 0,
        },
      });
    }
  }, [trip, form]);

  const handleFormSubmit = (data: TripFormValues) => {

    // Make sure default values are set for required fields
    const validatedData = {
      ...data,
      truckId: data.truckId === "none" ? "" : data.truckId,
      driverId: data.driverId === "none" ? "" : data.driverId,
    };
    
    onSubmit(validatedData);
  };

  useEffect(() => {
    const sub = form.watch((values, { name }) => {
      if (name === "truckId" || name === "equalization") {
        const selectedTruck = availableTrucks.find((t) => t.id === values.truckId);
        const eq = Number(values.equalization) || 0;
        const truckCap = selectedTruck?.capacity || 0;
        const calculated = Math.floor(truckCap * eq);
        if (values.amountET !== calculated) {
          form.setValue("amountET", calculated);
        }
      }
      if (name === "pricePerLiter" || name === "mtqsLiters") {
        const price = Number(values.pricePerLiter) || 0;
        const liters = Number(values.mtqsLiters) || 0;
        const mtqsValue = Math.floor(liters * price);
        if (values.mtqs !== mtqsValue) {
          form.setValue("mtqs", mtqsValue);
        }
      }
    });
    return () => sub.unsubscribe?.();
  }, [form, availableTrucks]);

  const truckIdWatched = form.watch("truckId");
  const selectedTruck = availableTrucks.find((t) => t.id === truckIdWatched);
  const truckCapacity = selectedTruck ? selectedTruck.capacity : "";

  const amountET = form.watch("amountET") || 0;
  const managementFeesPercent = form.watch("managementFeesPercent") || 0;
  const managementFees = Math.floor((amountET * managementFeesPercent) / 100);

  const mtqsLiters = form.watch("mtqsLiters") || 0;
  const pricePerLiter = form.watch("pricePerLiter") || 0;
  const mtqsCalculated = Math.floor(mtqsLiters * pricePerLiter);

  const missionFees = Number(form.watch("missionFees")) || 0;
  const fuelExpense = Number(form.watch("expenses.fuel")) || 0;
  const tollExpense = Number(form.watch("expenses.tolls")) || 0;
  const maintenanceExpense = Number(form.watch("expenses.maintenance")) || 0;
  const otherExpense = Number(form.watch("expenses.other")) || 0;

  const totalExpenses =
    mtqsCalculated +
    managementFees +
    missionFees +
    fuelExpense +
    tollExpense +
    maintenanceExpense +
    otherExpense;

  const calculatedRevenue = amountET - totalExpenses;

  if (trucksLoading || driversLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-3">{t("Loading")}</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="truckId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Truck")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || "none"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("SelectTruck")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                     <SelectItem value="none">{t("Unassigned")}</SelectItem>
                    {availableTrucks.map((truck) => (
                      <SelectItem key={truck.id} value={truck.id}>
                        {truck.plateNumber} - {truck.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row items-end gap-3 w-full">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="cargoType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("CargoType")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "fuel"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("SelectCargoType")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fuel">{t("Fuel")}</SelectItem>
                        <SelectItem value="diesel">{t("Diesel")}</SelectItem>
                        <SelectItem value="mazout">{t("Mazout")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-36 flex flex-col">
              <FormLabel className="pb-1">{t("TruckCapacity")}</FormLabel>
              <Input
                value={truckCapacity}
                readOnly
                tabIndex={-1}
                className="bg-gray-100 mt-2"
                aria-label={t("TruckCapacity")}
                placeholder={t("Capacity")}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="driverId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Driver")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || "none"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("SelectDriver")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                     <SelectItem value="none">{t("Unassigned")}</SelectItem>
                    {availableDrivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Status")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("SelectStatus")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="planned">{t("Planned")}</SelectItem>
                    <SelectItem value="in-progress">{t("InProgress")}</SelectItem>
                    <SelectItem value="completed">{t("Completed")}</SelectItem>
                    <SelectItem value="cancelled">{t("Cancelled")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("StartLocation")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("LocationPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Destination")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("DestinationPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("StartDate")}</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("EndDateOptional")}</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="distance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("DistanceKm")}</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col space-y-1 justify-end">
            <FormLabel>{t("ProfitCalculated", { currency: currencySymbol })}</FormLabel>
            <div>
              <Input
                value={calculatedRevenue.toLocaleString("fr-FR")}
                readOnly
                tabIndex={-1}
                className="bg-gray-100 font-bold"
                aria-label={t("ProfitCalculated")}
              />
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-lg mt-6">{t("TripDetails")}</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="numBL"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("NumOfBL")}</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="equalization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Equalization")}</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col space-y-1 justify-end">
            <FormLabel>{t("AmountETCalculated")}</FormLabel>
            <div>
              <Input
                value={amountET.toLocaleString("fr-FR")}
                readOnly
                tabIndex={-1}
                className="bg-gray-100"
                aria-label={t("AmountETCalculated")}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="mtqsLiters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("MtqsLiters")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    placeholder={t("MtqsLitersPlaceholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pricePerLiter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("PricePerLiter", { currency: currencySymbol })}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...field}
                    placeholder={t("PricePerLiterPlaceholder", { currency: currencySymbol })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col space-y-1 justify-end">
            <FormLabel>{t("MtqsCalculated")}</FormLabel>
            <div>
              <Input
                value={mtqsCalculated.toLocaleString("fr-FR")}
                readOnly
                tabIndex={-1}
                className="bg-gray-100"
                aria-label={t("MtqsCalculated")}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="missionFees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("MissionFees")}</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="managementFeesPercent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("ManagementFeesPercent")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col space-y-1 justify-end">
            <FormLabel>{t("ManagementFeesCalculated")}</FormLabel>
            <div>
              <Input
                value={managementFees.toLocaleString("fr-FR")}
                readOnly
                tabIndex={-1}
                className="bg-gray-100"
                aria-label={t("ManagementFees")}
              />
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-lg mt-6">{t("Expenses")}</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="expenses.fuel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FuelExpenses", { currency: currencySymbol })}</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field}  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expenses.tolls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("TollExpenses", { currency: currencySymbol })}</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expenses.maintenance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("MaintenanceExpenses", { currency: currencySymbol })}</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expenses.other"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("OtherExpenses", { currency: currencySymbol })}</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col space-y-1 mt-4 max-w-md">
          <label className="font-semibold">{t("TotalExpenses", { currency: currencySymbol })}</label>
          <Input
            value={totalExpenses.toLocaleString("fr-FR")}
            readOnly
            tabIndex={-1}
            className="bg-gray-100 font-bold text-lg"
            aria-label={t("TotalExpenses")}
          />
        </div>

        <div className="flex flex-col w-full">
          <FormField
            control={form.control}
            name="observ"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("ObservComments")}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t("CommentsPlaceholder")} {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => window.history.back()}>
            {t("Cancel")}
          </Button>
          <Button type="submit">{trip ? t("UpdateTrip") : t("AddTrip")}</Button>
        </div>
      </form>
    </Form>
  );
}

export default TripForm;