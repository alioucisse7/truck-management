
import "./i18n";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Trucks from "./pages/Trucks";
import Drivers from "./pages/Drivers";
import Trips from "./pages/Trips";
import Finances from "./pages/Finances";
import NotFound from "./pages/NotFound";
import AddEditTruck from "./pages/AddEditTruck";
import AddEditDriver from "./pages/AddEditDriver";
import AddEditTrip from "./pages/AddEditTrip";
import DriverProfile from "./pages/DriverProfile";
import Profile from "./pages/Profile";
import TruckMap from "./pages/TruckMap";
import FuelMonitoring from "./pages/FuelMonitoring";
import { Suspense, useEffect } from "react";
import SettingsUnderConstruction from "@/components/layout/SettingsUnderConstruction";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CompanyInvites from "./pages/CompanyInvites";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import Invoices from "./pages/Invoices";
import AddEditInvoice from "./pages/AddEditInvoice";
import InvoiceGeneratorPage from "./pages/InvoiceGenerator";
import ViewInvoice from "./pages/ViewInvoice";

const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Suspense fallback={null}>
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  
                  {/* Protected routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/" element={
                      <Layout>
                        <Index />
                      </Layout>
                    } />
                    <Route path="/trucks" element={
                      <Layout>
                        <Trucks />
                      </Layout>
                    } />
                    <Route path="/trucks/add" element={
                      <Layout>
                        <AddEditTruck />
                      </Layout>
                    } />
                    <Route path="/trucks/edit/:id" element={
                      <Layout>
                        <AddEditTruck />
                      </Layout>
                    } />
                    <Route path="/drivers" element={
                      <Layout>
                        <Drivers />
                      </Layout>
                    } />
                    <Route path="/drivers/add" element={
                      <Layout>
                        <AddEditDriver />
                      </Layout>
                    } />
                    <Route path="/drivers/edit/:id" element={
                      <Layout>
                        <AddEditDriver />
                      </Layout>
                    } />
                    <Route path="/drivers/profile/:id" element={
                      <Layout>
                        <DriverProfile />
                      </Layout>
                    } />
                    <Route path="/trips" element={
                      <Layout>
                        <Trips />
                      </Layout>
                    } />
                    <Route path="/trips/add" element={
                      <Layout>
                        <AddEditTrip />
                      </Layout>
                    } />
                    <Route path="/trips/edit/:id" element={
                      <Layout>
                        <AddEditTrip />
                      </Layout>
                    } />
                    <Route path="/finances" element={
                      <Layout>
                        <Finances />
                      </Layout>
                    } />
                    <Route path="/settings" element={
                      <Layout>
                        <SettingsUnderConstruction />
                      </Layout>
                    } />
                    <Route path="/company/invites" element={<CompanyInvites />} />
                    <Route path="/profile" element={
                      <Layout>
                        <Profile />
                      </Layout>
                    } />
                    <Route path="/truck-map" element={
                      <Layout>
                        <TruckMap />
                      </Layout>
                    } />
                    <Route path="/fuel-monitoring" element={
                      <Layout>
                        <FuelMonitoring />
                      </Layout>
                    } />
                    {/* Invoice Routes */}
                    <Route path="/invoices" element={
                      <Layout>
                        <Invoices />
                      </Layout>
                    } />
                    <Route path="/invoices/add" element={
                      <Layout>
                        <AddEditInvoice />
                      </Layout>
                    } />
                    <Route path="/invoices/edit/:id" element={
                      <Layout>
                        <AddEditInvoice />
                      </Layout>
                    } />
                    <Route path="/invoices/generate" element={
                      <Layout>
                        <InvoiceGeneratorPage />
                      </Layout>
                    } />
                    <Route path="/invoices/:id" element={
                      <Layout>
                        <ViewInvoice />
                      </Layout>
                    } />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </Suspense>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
