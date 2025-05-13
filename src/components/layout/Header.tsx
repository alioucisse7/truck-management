
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Bell, User, Search, ChevronLeft, ChevronRight, } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '../ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import logo from '../../assets/logo-blue-vert-transp.png';

interface HeaderProps {
  toggleSideBar: () => void;
}

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isMobile = useIsMobile();

  // Logout handler
  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  function getInitials(name?: string | null) {
    if (!name) return '';
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2); // Show up to two characters
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur border-b border-border">
      <div className="flex h-16 items-center justify-between px-4 md:pl-0 md:px-6">
      {!isMobile && (
        <div className="">
          <Button
            variant="ghost"
            size="sm"
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            onClick={toggleSidebar}
            className="transition-transform transition-colors bg-background text-foreground hover:bg-accent font-semibold"
          >
            {isCollapsed ? (
              <ChevronRight size={45} strokeWidth={3} className="h-6 w-6" />
            ) : (
              <ChevronLeft strokeWidth={3} className="h-6 w-6" />
            )}
          </Button>
        </div>
      )}

        <div className="flex items-center print:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          {/* <div className="w-44 h-14 overflow-hidden">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div> */}
          <h1 className="text-lg font-semibold md:text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Truck Fleet Management</h1>
        </div>
        
        <div className="hidden md:flex items-center w-full max-w-sm mx-12">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-full bg-background pl-8 pr-4 focus-visible:ring-primary"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* <Button variant="outline" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">3</span>
            <span className="sr-only">Notifications</span>
          </Button> */}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full p-0 w-10 h-10">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {user?.name
                      ? getInitials(user?.name)
                      : <User className="h-5 w-5 text-muted-foreground" />
                    }
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "-"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
