
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Truck,
  Users,
  Calendar,
  DollarSign,
  Settings,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Fuel,
  Languages,
  Moon,
  Sun,
  FileText
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import SidebarLanguageSelector from "./SidebarLanguageSelector";
import { useTranslation } from "react-i18next";
import { useTheme } from "./ThemeSwitcher";

const items = [
  {
    labelKey: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    labelKey: "Trucks",
    path: "/trucks",
    icon: Truck,
  },
  {
    labelKey: "Drivers",
    path: "/drivers",
    icon: Users,
  },
  {
    labelKey: "Trips",
    path: "/trips",
    icon: Calendar,
  },
  {
    labelKey: "TruckMap",
    path: "/truck-map",
    icon: MapPin,
  },
  {
    labelKey: "FuelMonitoring",
    path: "/fuel-monitoring",
    icon: Fuel,
  },
  {
    labelKey: "Finances",
    path: "/finances",
    icon: DollarSign,
  },
  {
    labelKey: "Invoices",
    path: "/invoices",
    icon: FileText,
  },
  {
    labelKey: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith("fr") ? "fr" : "en";
  const alternateLang = currentLang === "en" ? "fr" : "en";

  const { isDarkMode, setIsDarkMode } = useTheme();

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {/* {!isMobile && (
          <div className="flex w-full justify-end px-2 mb-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              onClick={toggleSidebar}
              className="transition-transform"
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>
        )} */}
        <div className="flex items-center gap-2 px-2 w-full">
          <Truck className="h-8 w-8 text-sidebar-accent shrink-0" />
          {(isMobile || !isCollapsed) && (
            <span className="font-bold text-xl bg-gradient-to-r from-sidebar-foreground to-sidebar-accent bg-clip-text text-transparent">
              LogiTrack
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!isCollapsed ? t("Main") : <span className="opacity-0 select-none">M</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    tooltip={isCollapsed && !isMobile ? t(item.labelKey) : undefined}
                  >
                    <button type="button" className="flex items-center w-full">
                      <item.icon className="h-5 w-5" />
                      {(isMobile || !isCollapsed) && (
                        <span className="ml-2">{t(item.labelKey)}</span>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
      <TooltipProvider delayDuration={0}>
          <div className="w-full flex flex-col gap-2">
            <Tooltip>
              <TooltipTrigger asChild>            
                <Button variant="ghost" size="icon" className="w-full " 
                 onClick={() => handleToggleTheme()}>
                  {isDarkMode ? ( <Sun className="h-5 w-5" />) : ( <Moon className="h-5 w-5" />)}
                </Button> 
              </TooltipTrigger>
              <TooltipContent side="right">
                {t("ToggleAppearance")}
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        <TooltipProvider delayDuration={0}>
          <div className="w-full flex flex-col gap-2">
            <Tooltip>
              <TooltipTrigger asChild>            
                <Button variant="ghost" size="icon" className="w-full " 
                 onClick={() => i18n.changeLanguage(alternateLang)}>
                  {alternateLang.toUpperCase()}
                </Button> 
              </TooltipTrigger>
              <TooltipContent side="right">
                {t("Language")}
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        <TooltipProvider delayDuration={0}>
          <div className="w-full flex flex-col gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full flex justify-center">
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {t("Logout")}
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </SidebarFooter>
    </Sidebar>
  );
}
