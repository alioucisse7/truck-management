
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { truckFormSchema } from "@/lib/form-schemas";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/hooks/useAppSelector";

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
import { Truck } from "@/lib/data";
import { fetchDrivers } from "@/store/driversSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useCurrency , currencySymbols} from "../layout/CurrencySettings";

type TruckFormValues = z.infer<typeof truckFormSchema>;

interface TruckFormProps {
  truck?: Truck;
  onSubmit: (data: TruckFormValues) => void;
}

export function TruckForm({ truck, onSubmit }: TruckFormProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { drivers } = useAppSelector(state => state.drivers);
  
  // Filter available drivers
  const availableDrivers = React.useMemo(() => {
    // Include the currently assigned driver even if they're not available
    const currentDriverId = truck?.assignedDriverId;
    
    return drivers.filter(driver => 
      driver.status === 'available' || 
      (currentDriverId && driver.id === currentDriverId)
    );
  }, [drivers, truck?.assignedDriverId]);

  useEffect(() => {
    // Fetch drivers only once when component mounts
    dispatch(fetchDrivers());
  }, [dispatch]);

  const form = useForm<TruckFormValues>({
    resolver: zodResolver(truckFormSchema),
    defaultValues: {
      plateNumber: truck?.plateNumber || "",
      model: truck?.model || "",
      capacity: truck?.capacity || 0,
      status: truck?.status || "available",
      fuelLevel: truck?.fuelLevel || 100,
      lastMaintenance: truck?.lastMaintenance 
        ? new Date(truck.lastMaintenance).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      assignedDriverId: truck?.assignedDriverId || "none",
      monthlyExtraCosts: {
        loadingCosts: truck?.monthlyExtraCosts?.loadingCosts || 0,
        challenge: truck?.monthlyExtraCosts?.challenge || 0,
        otherManagementFees: truck?.monthlyExtraCosts?.otherManagementFees || 0,
        otherFees: truck?.monthlyExtraCosts?.otherFees || 0,
      }
    },
  });

  useEffect(() => {
    if (truck) {
      const values = {
        ...truck,
        assignedDriverId: truck?.assignedDriverId || "none",
        capacity : truck.capacity || 0,
        fuelLevel: truck.fuelLevel || 100,
        lastMaintenance: truck.lastMaintenance 
          ? new Date(truck.lastMaintenance).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      };
      form.reset(values);
    }
  }, [truck, form]);

  console.log("form: ", form);

  const { currency } = useCurrency();
  const currencySymbol = currencySymbols[currency];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="plateNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("PlateNumber")}</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. ABC-123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Model")}</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Volvo FH16" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("CapacityLiters")}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                  />
                </FormControl>
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
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("SelectStatus")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="available">{t("Available")}</SelectItem>
                    <SelectItem value="on-trip">{t("OnTrip")}</SelectItem>
                    <SelectItem value="maintenance">{t("Maintenance")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fuelLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FuelLevel")}</FormLabel>
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

          <FormField
            control={form.control}
            name="lastMaintenance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("LastMaintenanceDate")}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedDriverId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("AssignedDriver")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field?.value || "none"}
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
        </div>



        <h3 className="font-semibold text-lg mt-6">{t("Expenses")}</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="monthlyExtraCosts.loadingCosts"
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
              name="monthlyExtraCosts.challenge"
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
              name="monthlyExtraCosts.otherManagementFees"
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
              name="monthlyExtraCosts.otherFees"
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
          
        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => window.history.back()}>
            {t("Cancel")}
          </Button>
          <Button type="submit">{truck ? t("UpdateTruck") : t("AddTruck")}</Button>
        </div>
      </form>
    </Form>
  );
}
