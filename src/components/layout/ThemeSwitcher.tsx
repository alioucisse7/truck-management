
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sun, Moon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return { isDarkMode, setIsDarkMode };
};

const ThemeSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isDarkMode, setIsDarkMode } = useTheme();

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    toast({
      title: t('ThemeChanged'),
      description: !isDarkMode ? t('DarkModeEnabled') : t('LightModeEnabled'),
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Sun className={`h-5 w-5 ${isDarkMode ? 'text-muted-foreground' : 'text-amber-500'}`} />
        <div>
          <Label htmlFor="theme-toggle" className="font-medium">{t('ToggleAppearance')}</Label>
          <p className="text-sm text-muted-foreground mt-1">{isDarkMode ? t('SwitchToLightMode') : t('SwitchToDarkMode')}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Moon className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-muted-foreground'}`} />
        <Switch
          id="theme-toggle"
          checked={isDarkMode}
          onCheckedChange={handleToggleTheme}
        />
      </div>
    </div>
  );
};

export default ThemeSwitcher;
