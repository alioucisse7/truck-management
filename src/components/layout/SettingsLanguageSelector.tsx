
import React from "react";
import { useTranslation } from "react-i18next";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectGroup, SelectValue } from "@/components/ui/select";
import { Languages } from "lucide-react";
import { Label } from "@/components/ui/label";

const LANGS = [
  { code: "en", labelKey: "English" },
  { code: "fr", labelKey: "French" },
];

const SettingsLanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <Languages className="h-5 w-5 text-primary" />
        <div>
          <Label className="font-medium">{t("Language")}</Label>
          <p className="text-sm text-muted-foreground mt-1">{t("SelectYourPreferredLanguage")}</p>
        </div>
      </div>
      
      <Select value={i18n.language} onValueChange={lng => i18n.changeLanguage(lng)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("Language")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {LANGS.map(lang => (
              <SelectItem key={lang.code} value={lang.code}>
                {t(lang.labelKey)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SettingsLanguageSelector;
