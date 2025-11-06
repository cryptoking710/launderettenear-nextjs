'use client';

import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useQuery } from '@tanstack/react-query';
import { auth } from '@/lib/firebase-client';
import { Launderette } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Zap, List, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin-layout';

export default function AdminDashboardPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const { data: launderettes = [] } = useQuery<Launderette[]>({
    queryKey: ['/api/launderettes'],
    enabled: !!user,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalListings = launderettes.length;
  const premiumListings = launderettes.filter((l) => l.isPremium).length;
  const standardListings = totalListings - premiumListings;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user.displayName || user.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <List className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="stat-total-listings">
                {totalListings}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active launderette listings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Listings</CardTitle>
              <Zap className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary" data-testid="stat-premium-listings">
                {premiumListings}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Featured at the top
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Standard Listings</CardTitle>
              <MapPin className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="stat-standard-listings">
                {standardListings}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Regular listings
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
