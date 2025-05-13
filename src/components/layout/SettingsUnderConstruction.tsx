import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  AlertCircle,
  Settings,
  Wrench,
  Bell,
  Globe,
  FileText,
  Shield,
  User,
  Palette
} from "lucide-react";
import CurrencySettings from './CurrencySettings';
import NotificationSettings from './NotificationSettings';
import DistanceUnitSettings from './DistanceUnitSettings';
import FuelUnitSettings from './FuelUnitSettings';
import SettingsLanguageSelector from './SettingsLanguageSelector';
import ThemeSwitcher from './ThemeSwitcher';

const SettingsUnderConstruction: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t('Settings')}</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <TabsTrigger value="general">{t('General')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('Notifications')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('Appearance')}</TabsTrigger>
          <TabsTrigger value="units">{t('Units')}</TabsTrigger>
          <TabsTrigger value="api">{t('API')}</TabsTrigger>
          <TabsTrigger value="security">{t('Security')}</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general" className="space-y-4 mt-10 md:mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t('GeneralSettings')}
              </CardTitle>
              <CardDescription>{t('ManageGeneralSettings')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('AppearanceAndLanguage')}</h3>
                  <SettingsLanguageSelector />
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">{t('CurrencySettings')}</h3>
                  <CurrencySettings />
                </div>
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium mb-4">{t('UserProfile')}</h3>
                  <Card className="bg-muted/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {t('ProfileSettings')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{t('UpdateProfileInformation')}</p>
                      <div className="flex justify-end">
                        <a href="/profile" className="text-sm text-primary hover:underline">{t('EditProfile')}</a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4 mt-10 md:mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {t('AppearanceSettings')}
              </CardTitle>
              <CardDescription>{t('ManageAppearanceSettings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ThemeSwitcher />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4 mt-10 md:mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('NotificationSettings')}
              </CardTitle>
              <CardDescription>{t('ManageNotificationSettings')}</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettings />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Units Settings */}
        <TabsContent value="units" className="space-y-4 mt-10 md:mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t('UnitsPreferences')}
              </CardTitle>
              <CardDescription>{t('ManageUnitsSettings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FuelUnitSettings />
              <div className="border-t pt-6 mt-6">
                <DistanceUnitSettings />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other tabs with under construction message */}
        {["api", "security"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4 mt-10 md:mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {tab === "api" && <Wrench className="h-5 w-5" />}
                  {tab === "security" && <Shield className="h-5 w-5" />}
                  {t(`${tab.charAt(0).toUpperCase() + tab.slice(1)}Settings`)}
                </CardTitle>
                <CardDescription>{t('UnderDevelopment')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t('ComingSoon')}</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {t('FeatureUnderDevelopment')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SettingsUnderConstruction;
