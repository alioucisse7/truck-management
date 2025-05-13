
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar as CalendarIcon, Plus, Trash } from 'lucide-react';
import { useCurrency, currencySymbols } from '@/components/layout/CurrencySettings';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const invoiceFormSchema = z.object({
  clientName: z.string().min(2, { message: "Client name is required" }),
  clientAddress: z.string().optional(),
  clientEmail: z.string().email().optional().or(z.literal('')),
  issueDate: z.date(),
  dueDate: z.date(),
  taxRate: z.number().min(0).max(100).default(0),
  status: z.enum(['draft', 'sent', 'paid', 'cancelled']).default('draft'),
  notes: z.string().optional(),
  items: z.array(z.object({
    description: z.string().min(1, { message: "Description is required" }),
    quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
    unitPrice: z.number(),//(0, { message: "Unit price is required" }),
    amount: z.number(),
    tripId: z.any().optional(),
  })),
});

type FormValues = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
  initialData?: any;
  onSubmit: (values: any) => void;
  isLoading: boolean;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const currencySymbol = currencySymbols[currency];
  
  const form = useForm<FormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      clientName: '',
      clientAddress: '',
      clientEmail: '',
      issueDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Due in 30 days
      taxRate: 0,
      status: 'draft',
      notes: '',
      items: [{
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      }],
    },
  });

  // Reset form when initialData changes (e.g., after loading the invoice)
  useEffect(() => {
    if (initialData) {
      console.log("Setting form values from initialData:", initialData);
      form.reset(initialData);
    }
  }, [initialData]);
  
  const watchItems = form.watch('items');
  const watchTaxRate = form.watch('taxRate');

  // Calculate subtotal
  const subtotal = watchItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const taxAmount = (subtotal * (watchTaxRate || 0)) / 100;
  const totalAmount = subtotal + taxAmount;
  
  // Add new item
  const addItem = () => {
    const currentItems = form.getValues('items');
    form.setValue('items', [...currentItems, {
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      tripId: undefined,
    }]);
  };
  
  // Remove item
  const removeItem = (index: number) => {
    const currentItems = form.getValues('items');
    if (currentItems.length > 1) {
      form.setValue('items', currentItems.filter((_, i) => i !== index));
    }
  };
  
  // Update amount when quantity or unitPrice changes
  const updateItemAmount = (index: number) => {
    const items = form.getValues('items');
    const item = items[index];
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const amount = quantity * unitPrice;
    
    form.setValue(`items.${index}.amount`, amount);
  };

  const handleSubmit = (values: FormValues) => {
    // Format dates as ISO strings
    console.log("Invoice submission values:", values);
    const formattedValues = {
      ...values,
      subtotal,
      taxAmount,
      totalAmount,
    };
    console.log("Invoice submission data:", formattedValues);
    onSubmit(formattedValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ClientName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("EnterClientName")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="clientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ClientAddress")}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t("EnterClientAddress")} 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="clientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ClientEmail")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("EnterClientEmail")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("IssueDate")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t("PickIssueDate")}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("DueDate")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t("PickDueDate")}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
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
                      <SelectItem value="draft">{t("Draft")}</SelectItem>
                      <SelectItem value="sent">{t("Sent")}</SelectItem>
                      <SelectItem value="paid">{t("Paid")}</SelectItem>
                      <SelectItem value="cancelled">{t("Cancelled")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{t("InvoiceItems")}</h3>
                <Button 
                  type="button" 
                  onClick={addItem}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> {t("AddItem")}
                </Button>
              </div>
              
              <div className="space-y-4">
                {watchItems.map((_, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start">
                    <div className="col-span-5 sm:col-span-6">
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            {index === 0 && <FormLabel>{t("Description")}</FormLabel>}
                            <FormControl>
                              <Input placeholder={t("ItemDescription")} {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-1">
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            {index === 0 && <FormLabel>{t("Qty")}</FormLabel>}
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(Number(e.target.value));
                                  updateItemAmount(index);
                                }} 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                            {index === 0 && <FormLabel>{t("UnitPrice")}</FormLabel>}
                            <FormControl>
                              <Input 
                                type="number" 
                                // min="0"
                                // step="0.01"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value === "" ? "" : Number(value));
                                  updateItemAmount(index);
                                }}
                                // onChange={(e) => {
                                //   field.onChange(Number(e.target.value));
                                //   updateItemAmount(index);
                                // }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            {index === 0 && <FormLabel>{t("Amount")}</FormLabel>}
                            <FormControl>
                              <Input 
                                type="number" 
                                // min="0"
                                // step="0.01"
                                {...field}
                                readOnly 
                                className="bg-muted"
                                value={field.value}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1">
                      {index === 0 ? (
                        <div className="h-8 mt-6"></div>
                      ) : (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="mt-1"
                          onClick={() => removeItem(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t("Subtotal")}</span>
                  <span>{subtotal.toLocaleString('fr-FR')} {currencySymbol}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{t("TaxRate")}:</span>
                    <div className="w-20">
                      <FormField
                        control={form.control}
                        name="taxRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0"
                                max="100"
                                step="0.1"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))} 
                                className="h-8"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <span>%</span>
                  </div>
                  <span>{taxAmount.toLocaleString('fr-FR')} {currencySymbol}</span>
                </div>
                
                <div className="flex justify-between items-center font-medium text-lg">
                  <span>{t("Total")}</span>
                  <span>{totalAmount.toLocaleString('fr-FR')} {currencySymbol}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Notes")}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t("InvoiceNotes")} 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={isLoading}
          >
            {initialData ? t("UpdateInvoice") : t("CreateInvoice")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InvoiceForm;
