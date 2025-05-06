
import React from 'react';
import Header from './Header';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col transition-all duration-300">
          <Header/>
          {/* <SidebarTrigger className="md:hidden print:hidden fixed top-4 left-4 z-50" /> */}
          <main className="flex-1 p-4 md:p-6 pt-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
