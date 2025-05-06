
import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { FileText, Printer, Download, Send } from 'lucide-react';
import { useCurrency, currencySymbols } from '@/components/layout/CurrencySettings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Invoice } from '@/store/invoicesSlice';

interface InvoicePreviewProps {
  invoice: Invoice;
  onPrint?: () => void;
  onDownload?: () => void;
  onSend?: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  onPrint,
  onDownload,
  onSend
}) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const currencySymbol = currencySymbols[currency];
  
  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'sent': return 'default';
      case 'paid': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-900 border rounded-lg shadow-sm p-8 max-w-4xl mx-auto print:shadow-none print:border-none print:max-w-none print:w-full print:p-0">
      {/* Invoice Header */}
      <div className="flex flex-col sm:flex-row justify-between mb-10 gap-6 print:mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1 print:text-2xl">
            {t("Invoice")}
          </h1>
          <p className="text-sm text-muted-foreground">{invoice.invoiceNumber}</p>
          <div className="mt-2">
            <Badge variant={getStatusVariant(invoice.status)}>
              {t(invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1))}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold">{t("IssueDate")}</p>
          <p>{formatDate(invoice.issueDate)}</p>
          <p className="font-semibold mt-2">{t("DueDate")}</p>
          <p>{formatDate(invoice.dueDate)}</p>
        </div>
      </div>
      
      {/* Client Info */}
      <div className="mb-10 print:mb-6">
        <h2 className="text-lg font-semibold mb-2 print:text-base">{t("BillTo")}</h2>
        <div className="text-sm">
          <p className="font-medium">{invoice.clientName}</p>
          {invoice.clientAddress && <p>{invoice.clientAddress}</p>}
          {invoice.clientEmail && <p>{invoice.clientEmail}</p>}
        </div>
      </div>
      
      {/* Invoice Items */}
      <div className="mb-10 print:mb-6">
        <table className="w-full border-collapse print:text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">{t("Description")}</th>
              <th className="text-right py-2">{t("Quantity")}</th>
              <th className="text-right py-2">{t("UnitPrice")}</th>
              <th className="text-right py-2">{t("Amount")}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.description}</td>
                <td className="text-right py-2">{item.quantity}</td>
                <td className="text-right py-2">
                  {item.unitPrice.toLocaleString('fr-FR')} {currencySymbol}
                </td>
                <td className="text-right py-2">
                  {item.amount.toLocaleString('fr-FR')} {currencySymbol}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Invoice Totals */}
      <div className="mb-10 flex justify-end print:mb-4">
        <div className="w-64 print:w-48">
          <div className="flex justify-between mb-2">
            <span>{t("Subtotal")}</span>
            <span>{invoice.subtotal.toLocaleString('fr-FR')} {currencySymbol}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="flex justify-between mb-2">
              <span>{t("Tax")} ({invoice.taxRate}%)</span>
              <span>{invoice.taxAmount.toLocaleString('fr-FR')} {currencySymbol}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2 print:text-base">
            <span>{t("Total")}</span>
            <span>{invoice.totalAmount.toLocaleString('fr-FR')} {currencySymbol}</span>
          </div>
        </div>
      </div>
      
      {/* Notes */}
      {invoice.notes && (
        <div className="mb-6 print:text-sm">
          <h2 className="text-lg font-semibold mb-2 print:text-base">{t("Notes")}</h2>
          <p className="text-sm text-muted-foreground">{invoice.notes}</p>
        </div>
      )}
      
      {/* Action buttons - only visible in non-print mode */}
      <div className="print:hidden">
        <Card className="mt-8 bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              {t("InvoiceActions")}
            </p>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            {onPrint && (
              <Button onClick={onPrint} variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                {t("Print")}
              </Button>
            )}
            {onDownload && (
              <Button onClick={onDownload} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t("Download")}
              </Button>
            )}
            {onSend && (
              <Button onClick={onSend} variant="default" size="sm">
                <Send className="h-4 w-4 mr-2" />
                {t("MarkAsSent")}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default InvoicePreview;
