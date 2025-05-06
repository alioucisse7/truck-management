
import React from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

const SidebarLanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith("fr") ? "fr" : "en";
  const alternateLang = currentLang === "en" ? "fr" : "en";

  return (
    <div className="flex items-center gap-2 mb-2 justify-center">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-primary/10"
        onClick={() => i18n.changeLanguage(alternateLang)}
        aria-label={`Switch to ${alternateLang.toUpperCase()}`}
      >
        <Languages className="h-4 w-4" />
        {alternateLang.toUpperCase()}
      </Button>
    </div>
  );
};

export default SidebarLanguageSelector;
