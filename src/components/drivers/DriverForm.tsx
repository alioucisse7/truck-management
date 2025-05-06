
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driverFormSchema } from "@/lib/form-schemas";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";

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
import { Driver } from "@/lib/data";

type DriverFormValues = z.infer<typeof driverFormSchema>;

interface DriverFormProps {
  driver?: Driver;
  onSubmit: (data: DriverFormValues) => void;
}

export function DriverForm({ driver, onSubmit }: DriverFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Pre-process default values to ensure experience is a number and salary is numeric or undefined
  const defaultValues = React.useMemo(() => ({
    name: driver?.name || "",
    phone: driver?.phone || "",
    license: driver?.license || "",
    experience: driver?.experience || 0,
    status: driver?.status || "available",
    // Set salary as a number or undefined, not as a string
    salary: driver?.salary || undefined,
  }), [driver]);
  
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (driver) {
      // Only reset the form if driver changes
      form.reset({
        ...driver,
        // Ensure experience is properly cast as a number
        experience: Number(driver.experience),
        // Set salary directly as a number or undefined
        salary: driver.salary,
      });
    }
  }, [driver, form]);

  const handleSubmit = (data: DriverFormValues) => {
    const parsedData = {
      ...data,
      // Ensure experience is passed as a number
      experience: Number(data.experience),
      // salary is already handled by the form schema
    };
    onSubmit(parsedData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FullName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("FullNamePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("PhoneNumber")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("PhoneNumberPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="license"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("LicenseNumber")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("LicenseNumberPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Experience")}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    {...field}
                    value={field.value}
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
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("SelectStatus")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="available">{t("Available")}</SelectItem>
                    <SelectItem value="on-trip">{t("OnTrip")}</SelectItem>
                    <SelectItem value="off-duty">{t("OffDuty")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Salary")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder={t("SalaryPlaceholder")}
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                  />
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
          <Button type="submit">{driver ? t("UpdateDriver") : t("AddDriver")}</Button>
        </div>
      </form>
    </Form>
  );
}
