import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AutoAds } from "@/components/auto-ads";
import Home from "@/pages/home";
import LaunderetteDetail from "@/pages/launderette-detail";
import Cities from "@/pages/cities";
import CityDetail from "@/pages/city-detail";
import AdminLogin from "@/pages/admin-login";
import AdminLayout from "@/pages/admin-layout";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminListings from "@/pages/admin-listings";
import AdminListingForm from "@/pages/admin-listing-form";
import AdminAnalytics from "@/pages/admin-analytics";
import AdminCorrections from "@/pages/admin-corrections";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/launderette/:id" component={LaunderetteDetail} />
      <Route path="/cities" component={Cities} />
      <Route path="/city/:cityName" component={CityDetail} />
      <Route path="/admin/login" component={AdminLogin} />
      
      <Route path="/admin">
        {() => (
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        )}
      </Route>
      
      <Route path="/admin/listings">
        {() => (
          <AdminLayout>
            <AdminListings />
          </AdminLayout>
        )}
      </Route>
      
      <Route path="/admin/listings/new">
        {() => (
          <AdminLayout>
            <AdminListingForm />
          </AdminLayout>
        )}
      </Route>
      
      <Route path="/admin/listings/edit/:id">
        {() => (
          <AdminLayout>
            <AdminListingForm />
          </AdminLayout>
        )}
      </Route>
      
      <Route path="/admin/analytics">
        {() => (
          <AdminLayout>
            <AdminAnalytics />
          </AdminLayout>
        )}
      </Route>
      
      <Route path="/admin/corrections">
        {() => (
          <AdminLayout>
            <AdminCorrections />
          </AdminLayout>
        )}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AutoAds />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
