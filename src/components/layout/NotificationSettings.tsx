
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export const useNotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(
    localStorage.getItem('emailNotifications') === 'true'
  );
  const [smsNotifications, setSmsNotifications] = useState(
    localStorage.getItem('smsNotifications') === 'true'
  );
  
  const updateEmailNotifications = (value: boolean) => {
    localStorage.setItem('emailNotifications', value.toString());
    setEmailNotifications(value);
    window.dispatchEvent(new Event('notificationSettingsChange'));
  };
  
  const updateSmsNotifications = (value: boolean) => {
    localStorage.setItem('smsNotifications', value.toString());
    setSmsNotifications(value);
    window.dispatchEvent(new Event('notificationSettingsChange'));
  };
  
  return {
    emailNotifications,
    smsNotifications,
    updateEmailNotifications,
    updateSmsNotifications
  };
};

const NotificationSettings: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const {
    emailNotifications,
    smsNotifications,
    updateEmailNotifications,
    updateSmsNotifications
  } = useNotificationSettings();

  const handleEmailToggle = (checked: boolean) => {
    updateEmailNotifications(checked);
    toast({
      title: t('NotificationsUpdated'),
      description: checked ? t('EmailNotificationsEnabled') : t('EmailNotificationsDisabled'),
    });
  };

  const handleSmsToggle = (checked: boolean) => {
    updateSmsNotifications(checked);
    toast({
      title: t('NotificationsUpdated'),
      description: checked ? t('SMSNotificationsEnabled') : t('SMSNotificationsDisabled'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="email-notifications" className="font-medium text-base">
            {t('EmailNotifications')}
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            {t('ReceiveEmailNotifications')}
          </p>
        </div>
        <Switch
          id="email-notifications"
          checked={emailNotifications}
          onCheckedChange={handleEmailToggle}
        />
      </div>
      
      <div className="border-t pt-6"></div>
      
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="sms-notifications" className="font-medium text-base">
            {t('SMSNotifications')}
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            {t('ReceiveSMSNotifications')}
          </p>
        </div>
        <Switch
          id="sms-notifications"
          checked={smsNotifications}
          onCheckedChange={handleSmsToggle}
        />
      </div>
    </div>
  );
};

export default NotificationSettings;
