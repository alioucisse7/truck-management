
import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { FileText, SquarePen, Trash } from 'lucide-react';
import { useCurrency, currencySymbols } from '@/components/layout/CurrencySettings';
import { Link } from 'react-router-dom';
import { Invoice } from '@/store/invoicesSlice';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface InvoiceListProps {
  invoices: Invoice[];
  onDelete: (id: string) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onDelete }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const currencySymbol = currencySymbols[currency];

  // Status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'sent': return 'default';
      case 'paid': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  // Get the correct ID (either _id or id)
  const getInvoiceId = (invoice: Invoice) => {
    return invoice._id || invoice.id;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Invoices")}</CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6">
            <FileText className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-center">{t("NoInvoices")}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("InvoiceNumber")}</TableHead>
                <TableHead>{t("Client")}</TableHead>
                <TableHead>{t("IssueDate")}</TableHead>
                <TableHead>{t("DueDate")}</TableHead>
                <TableHead>{t("Amount")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead className="text-right">{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={getInvoiceId(invoice)}>
                  <TableCell className="font-medium">
                    <Link to={`/invoices/${getInvoiceId(invoice)}`} className="hover:underline">
                      {invoice.invoiceNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>{format(new Date(invoice.issueDate), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    {invoice.totalAmount.toLocaleString('fr-FR')} {currencySymbol}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(invoice.status)}>
                      {t(invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1))}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/invoices/${getInvoiceId(invoice)}`}>
                          <FileText className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/invoices/edit/${getInvoiceId(invoice)}`}>
                          <SquarePen className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("DeleteInvoice")}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("DeleteInvoiceConfirm", { invoiceNumber: invoice.invoiceNumber })}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(getInvoiceId(invoice))}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {t("Delete")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceList;
