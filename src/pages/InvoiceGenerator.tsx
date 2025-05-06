
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { createInvoice } from '@/store/invoicesSlice';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import InvoiceGenerator from '@/components/invoices/InvoiceGenerator';
import InvoiceForm from '@/components/invoices/InvoiceForm';

const InvoiceGeneratorPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  
  const handleGenerated = (data: any) => {
    // Transform trip data into invoice form data
    const invoiceData = {
      clientName: data.clientName,
      issueDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Due in 30 days
      status: 'draft',
      taxRate: 0,
      items: data.items.map((item: any) => ({
        ...item,
        quantity: 1,
      })),
    };
    
    setGeneratedData(invoiceData);
  };
  
  const handleCancelEdit = () => {
    setGeneratedData(null);
  };
  
  const handleCreateInvoice = async (values: any) => {
    try {
      setIsLoading(true);
      await dispatch(createInvoice(values)).unwrap();
      toast({
        title: t("InvoiceCreated"),
        description: t("InvoiceCreatedSuccess"),
      });
      navigate('/invoices');
    } catch (error: any) {
      toast({
        title: t("Error"),
        description: error.toString(),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {t("GenerateInvoice")}
        </h1>
        <p className="text-muted-foreground">
          {t("GenerateInvoiceFromTrips")}
        </p>
      </div>
      
      {!generatedData ? (
        <InvoiceGenerator onGenerated={handleGenerated} />
      ) : (
        <div className="space-y-4">
          <Card className="p-4 bg-primary/5 border-primary/20 flex items-center justify-between">
            <div>
              <h3 className="font-medium">{t("InvoiceDataGenerated")}</h3>
              <p className="text-sm text-muted-foreground">{t("ReviewInvoiceBeforeSaving")}</p>
            </div>
            <Button variant="outline" onClick={handleCancelEdit}>
              {t("StartOver")}
            </Button>
          </Card>
          
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <InvoiceForm 
              initialData={generatedData} 
              onSubmit={handleCreateInvoice}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceGeneratorPage;
