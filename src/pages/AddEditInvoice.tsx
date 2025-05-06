
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchInvoiceById, createInvoice, updateInvoice } from '@/store/invoicesSlice';
import { useToast } from '@/hooks/use-toast';

import InvoiceForm from '@/components/invoices/InvoiceForm';

const AddEditInvoice = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { selectedInvoice, loading, error } = useAppSelector(state => state.invoices);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchInvoiceById(id))
        .unwrap()
        .catch((err) => {
          toast({
            title: t("Error"),
            description: err,
            variant: "destructive",
          });
        });
    }
  }, [id, dispatch, toast, t]);
  
  const handleSubmit = async (values: any) => {
    try {
      if (id) {
        console.log("Updating invoice with ID:", id, values);
        // Ensure we're passing the correct ID format
        await dispatch(updateInvoice({ 
          id: selectedInvoice?._id || id, 
          ...values 
        })).unwrap();
        toast({
          title: t("InvoiceUpdated"),
          description: t("InvoiceUpdatedSuccess"),
        });
        navigate('/invoices');
      } else {
        await dispatch(createInvoice(values)).unwrap();
        toast({
          title: t("InvoiceCreated"),
          description: t("InvoiceCreatedSuccess"),
        });
        navigate('/invoices');
      }
    } catch (error: any) {
      toast({
        title: t("Error"),
        description: error.toString(),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-3">{t("Loading")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">{t("Error")}</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (id && !selectedInvoice) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">{t("InvoiceNotFound")}</h1>
        <p className="text-muted-foreground">{t("GoBackToInvoices")}</p>
      </div>
    );
  }

  // Prepare initialData with proper date objects for the form
  const prepareInitialData = () => {
    if (!selectedInvoice) return null;
    console.log("selected invoice", selectedInvoice);
    return {
      ...selectedInvoice,
      // Convert string dates to Date objects for the form
      issueDate: selectedInvoice.issueDate ? new Date(selectedInvoice.issueDate) : new Date(),
      dueDate: selectedInvoice.dueDate ? new Date(selectedInvoice.dueDate) : new Date(),
    };
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {id ? t("EditInvoice") : t("CreateNewInvoice")}
        </h1>
        <p className="text-muted-foreground">
          {id ? t("UpdateInvoiceDetails") : t("CreateNewInvoiceDetails")}
        </p>
      </div>
      
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <InvoiceForm 
          initialData={id ? prepareInitialData() : null} 
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default AddEditInvoice;
