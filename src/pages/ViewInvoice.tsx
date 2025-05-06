
import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchInvoiceById, updateInvoice } from '@/store/invoicesSlice';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, SquarePen, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { Button } from '@/components/ui/button';
import InvoicePreview from '@/components/invoices/InvoicePreview';

const ViewInvoice = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { selectedInvoice, loading, error } = useAppSelector(state => state.invoices);
  const invoiceRef = useRef<HTMLDivElement>(null);
  
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
  
  const handlePrint = () => {
    // Hide browser print dialog elements by applying a class before printing
    document.body.classList.add('printing');
    setTimeout(() => {
      window.print();
      document.body.classList.remove('printing');
    }, 100);
  };
  
  const handleDownload = async () => {
    if (!invoiceRef.current) return;
    
    try {
      // Add a class to optimize for PDF generation
      invoiceRef.current.classList.add('generating-pdf');
      
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 1200, // Force a consistent width for better PDF output
        onclone: (document, element) => {
          // Hide print dialog elements in the clone
          element.querySelectorAll('.print\\:hidden').forEach((el) => {
            (el as HTMLElement).style.display = 'none';
          });
          
          // Add specific styling for PDF generation
          element.style.padding = '20px';
          element.style.width = '210mm'; // A4 width
          element.style.margin = '0';
          element.style.backgroundColor = 'white';
        }
      });
      
      // Remove the class
      invoiceRef.current.classList.remove('generating-pdf');
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // If image height exceeds page height, add multiple pages
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add subsequent pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Invoice-${selectedInvoice?.invoiceNumber}.pdf`);
      
      toast({
        title: t("InvoiceDownloaded"),
        description: t("InvoiceDownloadedSuccess"),
      });
    } catch (error) {
      console.error('Error generating PDF', error);
      toast({
        title: t("Error"),
        description: t("ErrorDownloadingInvoice"),
        variant: "destructive",
      });
    }
  };
  
  const handleSendInvoice = async () => {
    if (!selectedInvoice) return;
    
    try {
      await dispatch(updateInvoice({ 
        id: selectedInvoice._id || selectedInvoice.id,
        status: 'sent'
      })).unwrap();
      
      toast({
        title: t("InvoiceMarkedAsSent"),
        description: t("InvoiceMarkedAsSentSuccess"),
      });
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("ErrorSendingInvoice"),
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

  if (!selectedInvoice) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">{t("InvoiceNotFound")}</h1>
        <p className="text-muted-foreground">{t("GoBackToInvoices")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 print:m-0 print:p-0 print:shadow-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-2">
            <Link to="/invoices">
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t("BackToInvoices")}
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">
            {t("Invoice")} {selectedInvoice.invoiceNumber}
          </h1>
          <p className="text-muted-foreground">
            {t("IssuedOn")} {new Date(selectedInvoice.issueDate).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex gap-2">
          {selectedInvoice.status === 'draft' && (
            <Button variant="outline" asChild>
              <Link to={`/invoices/edit/${selectedInvoice._id || selectedInvoice.id}`}>
                <SquarePen className="h-4 w-4 mr-1" />
                {t("EditInvoice")}
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      <div ref={invoiceRef}>
        <InvoicePreview 
          invoice={selectedInvoice}
          onPrint={handlePrint}
          onDownload={handleDownload}
          onSend={selectedInvoice.status === 'draft' ? handleSendInvoice : undefined}
        />
      </div>
    </div>
  );
};

export default ViewInvoice;
