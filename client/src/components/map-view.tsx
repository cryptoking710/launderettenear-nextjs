import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Launderette } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Zap, MapPin as MapPinIcon } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapViewProps {
  launderettes: Array<Launderette & { distance?: number }>;
  userLocation?: { lat: number; lng: number } | null;
}

export function MapView({ launderettes, userLocation }: MapViewProps) {
  // Calculate center of map - use user location or center of UK
  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : launderettes.length > 0
    ? [launderettes[0].lat, launderettes[0].lng]
    : [54.0, -2.0]; // Center of UK

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border" data-testid="map-view">
      <MapContainer
        center={center}
        zoom={userLocation ? 12 : 6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker (outside cluster group) */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>
              <div className="text-sm font-semibold">Your Location</div>
            </Popup>
          </Marker>
        )}

        {/* Clustered launderette markers */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={60}
        >
          {launderettes.map((launderette) => (
            <Marker
              key={launderette.id}
              position={[launderette.lat, launderette.lng]}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-sm">{launderette.name}</h3>
                    {launderette.isPremium && (
                      <Zap className="w-4 h-4 text-primary fill-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {launderette.address}
                  </p>
                  {launderette.distance !== undefined && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {launderette.distance.toFixed(1)} miles away
                    </p>
                  )}
                  {launderette.features && launderette.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {launderette.features.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Link href={`/launderette/${launderette.id}`}>
                    <Button size="sm" className="w-full mt-2" variant="default">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
