import { useEffect, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { auth } from "@/lib/firebase";
import { AnalyticsEvent } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Loader2, TrendingUp, Eye, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminAnalytics() {
  const [user, loading] = useAuthState(auth);
  const [, setLocation] = useLocation();

  const { data: events = [], isLoading } = useQuery<AnalyticsEvent[]>({
    queryKey: ["/api/analytics"],
    enabled: !!user,
  });

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/admin/login");
    }
  }, [user, loading, setLocation]);

  const analytics = useMemo(() => {
    const searchEvents = events.filter((e) => e.type === "search");
    const viewEvents = events.filter((e) => e.type === "view");

    // Top searches
    const searchCounts = searchEvents.reduce((acc, event) => {
      const query = event.searchQuery || "Unknown";
      acc[query] = (acc[query] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSearches = Object.entries(searchCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Most viewed launderettes
    const viewCounts = viewEvents.reduce((acc, event) => {
      const id = event.launderetteId || "Unknown";
      const name = event.launderetteName || "Unknown";
      if (!acc[id]) {
        acc[id] = { name, count: 0 };
      }
      acc[id].count++;
      return acc;
    }, {} as Record<string, { name: string; count: number }>);

    const mostViewed = Object.entries(viewCounts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recent activity
    const recentEvents = [...events]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);

    return {
      totalSearches: searchEvents.length,
      totalViews: viewEvents.length,
      topSearches,
      mostViewed,
      recentEvents,
    };
  }, [events]);

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-heading">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track user searches and launderette views
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Searches</p>
              <p className="text-3xl font-bold text-foreground" data-testid="text-total-searches">
                {analytics.totalSearches}
              </p>
            </div>
            <Search className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Views</p>
              <p className="text-3xl font-bold text-foreground" data-testid="text-total-views">
                {analytics.totalViews}
              </p>
            </div>
            <Eye className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Top Searches */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Top Search Queries</h2>
        </div>
        {analytics.topSearches.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No search data yet
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Search Query</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.topSearches.map((item, index) => (
                <TableRow key={index} data-testid={`row-search-${index}`}>
                  <TableCell className="font-medium">{item.query}</TableCell>
                  <TableCell className="text-right">{item.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Most Viewed Launderettes */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Most Viewed Launderettes</h2>
        </div>
        {analytics.mostViewed.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No view data yet
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Launderette Name</TableHead>
                <TableHead className="text-right">Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.mostViewed.map((item) => (
                <TableRow key={item.id} data-testid={`row-view-${item.id}`}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {analytics.recentEvents.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No activity yet
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.recentEvents.map((event) => (
                <TableRow key={event.id} data-testid={`row-event-${event.id}`}>
                  <TableCell className="capitalize">{event.type}</TableCell>
                  <TableCell>
                    {event.type === "search"
                      ? event.searchQuery
                      : event.launderetteName}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {new Date(event.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
