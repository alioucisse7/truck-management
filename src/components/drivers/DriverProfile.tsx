
import React from 'react';
import { Driver, getTripsByDriver } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Star, Phone, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from "react-i18next";
import { currencySymbols, useCurrency } from '../layout/CurrencySettings';

interface DriverProfileProps {
  driver: Driver;
}

export function DriverProfile({ driver }: DriverProfileProps) {
  const { t } = useTranslation();
  const trips = getTripsByDriver(driver.id);
  const { currency } = useCurrency();
  const currencySymbol = currencySymbols[currency];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <Card className="flex-1 w-full">
          <CardHeader>
            <CardTitle>{t("DriverInformation")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={driver.avatar}
                alt={driver.name}
                className="h-24 w-24 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold">{driver.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {driver.phone}
                </div>
                <Badge className="mt-2">{t(driver.status)}</Badge>
                {typeof driver.salary === 'number' && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    <span className="font-semibold">{t("Salary")}:</span> {driver.salary.toLocaleString()} {currencySymbol}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("LicenseNumber")}</p>
                <p className="font-medium">{driver.license}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("Experience")}</p>
                <p className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {driver.experience} {t("years")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full md:w-[300px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t("Documents")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span>{t("DriversLicense")}</span>
                <Badge variant="outline">{t("Valid")}</Badge>
              </li>
              <li className="flex items-center justify-between">
                <span>{t("MedicalCertificate")}</span>
                <Badge variant="outline">{t("Valid")}</Badge>
              </li>
              <li className="flex items-center justify-between">
                <span>{t("TrainingCertificate")}</span>
                <Badge variant="outline">{t("Valid")}</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("RecentTrips")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trips.slice(0, 5).map((trip) => (
              <div key={trip.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">
                    {trip.startLocation} → {trip.destination}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(trip.startDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge>{t(trip.status)}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
