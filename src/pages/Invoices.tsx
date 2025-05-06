
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, FileText } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchInvoices, deleteInvoice } from '@/store/invoicesSlice';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvoiceList from '@/components/invoices/InvoiceList';

const Invoices = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { invoices, loading, error } = useAppSelector(state => state.invoices);
  
  useEffect(() => {
    dispatch(fetchInvoices())
      .unwrap()
      .catch(err => {
        toast({
          title: t('Error'),
          description: err,
          variant: 'destructive'
        });
      });
  }, [dispatch, toast, t]);
  
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteInvoice(id)).unwrap();
      toast({
        title: t('InvoiceDeleted'),
        description: t('InvoiceDeletedSuccess'),
      });
    } catch (error: any) {
      toast({
        title: t('Error'),
        description: error,
        variant: 'destructive'
      });
    }
  };
  
  // Filter invoices by status
  const draftInvoices = invoices.filter(invoice => invoice.status === 'draft');
  const sentInvoices = invoices.filter(invoice => invoice.status === 'sent');
  const paidInvoices = invoices.filter(invoice => invoice.status === 'paid');
  
  if (loading) {
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
          <h2 className="text-3xl font-bold tracking-tight">{t("Invoices")}</h2>
          <p className="text-muted-foreground">
            {t("ManageYourInvoices")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2 w-full sm:w-auto" asChild>
            <Link to="/invoices/generate">
              <FileText className="h-4 w-4" />
              {t("GenerateInvoice")}
            </Link>
          </Button>
          <Button className="flex items-center gap-2 w-full sm:w-auto" asChild>
            <Link to="/invoices/add">
              <Plus className="h-4 w-4" />
              {t("NewInvoice")}
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <div className="w-full">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all">{t("All")}</TabsTrigger>
            <TabsTrigger value="draft">{t("Draft")}</TabsTrigger>
            <TabsTrigger value="sent">{t("Sent")}</TabsTrigger>
            <TabsTrigger value="paid">{t("Paid")}</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          <InvoiceList 
            invoices={invoices}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <TabsContent value="draft" className="space-y-4">
          <InvoiceList 
            invoices={draftInvoices}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <TabsContent value="sent" className="space-y-4">
          <InvoiceList 
            invoices={sentInvoices}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <TabsContent value="paid" className="space-y-4">
          <InvoiceList 
            invoices={paidInvoices}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Invoices;
