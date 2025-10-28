import { InsertAnalyticsEvent } from "@shared/schema";

export async function trackEvent(event: InsertAnalyticsEvent): Promise<void> {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error("Failed to track analytics event:", error);
  }
}

export function trackSearch(searchQuery: string, userLat?: number, userLng?: number): void {
  trackEvent({
    type: "search",
    searchQuery,
    userLat,
    userLng,
  });
}

export function trackView(launderetteId: string, launderetteName: string): void {
  trackEvent({
    type: "view",
    launderetteId,
    launderetteName,
  });
}
