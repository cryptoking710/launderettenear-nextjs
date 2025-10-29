import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Launderette } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Zap, MapPin as MapPinIcon } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom icon for regular launderettes (blue)
const regularIcon = L.divIcon({
  className: 'custom-marker-regular',
  html: `
    <div style="position: relative;">
      <svg width="32" height="45" viewBox="0 0 32 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 29 16 29s16-17 16-29c0-8.837-7.163-16-16-16z" fill="#2563eb" stroke="#1e40af" stroke-width="2"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    </div>
  `,
  iconSize: [32, 45],
  iconAnchor: [16, 45],
  popupAnchor: [0, -45]
});

// Custom icon for premium launderettes (gold)
const premiumIcon = L.divIcon({
  className: 'custom-marker-premium',
  html: `
    <div style="position: relative;">
      <svg width="32" height="45" viewBox="0 0 32 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 29 16 29s16-17 16-29c0-8.837-7.163-16-16-16z" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
        <path d="M16 10l1.5 4.5h4.5l-3.5 2.5 1.5 4.5-3.5-2.5-3.5 2.5 1.5-4.5-3.5-2.5h4.5z" fill="white"/>
      </svg>
    </div>
  `,
  iconSize: [32, 45],
  iconAnchor: [16, 45],
  popupAnchor: [0, -45]
});

// Custom icon for user location (red)
const userIcon = L.divIcon({
  className: 'custom-marker-user',
  html: `
    <div style="position: relative;">
      <svg width="32" height="45" viewBox="0 0 32 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 29 16 29s16-17 16-29c0-8.837-7.163-16-16-16z" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
        <circle cx="16" cy="16" r="5" fill="white"/>
        <circle cx="16" cy="16" r="2" fill="#dc2626"/>
      </svg>
    </div>
  `,
  iconSize: [32, 45],
  iconAnchor: [16, 45],
  popupAnchor: [0, -45]
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

  // Custom cluster icon creation
  const createClusterCustomIcon = (cluster: any) => {
    const count = cluster.getChildCount();
    const size = count < 10 ? 'small' : count < 50 ? 'medium' : 'large';
    const dimensions = size === 'small' ? 40 : size === 'medium' ? 50 : 60;
    
    return L.divIcon({
      html: `
        <div style="
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          border: 3px solid white;
          border-radius: 50%;
          width: ${dimensions}px;
          height: ${dimensions}px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${size === 'small' ? '14px' : size === 'medium' ? '16px' : '18px'};
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        ">
          ${count}
        </div>
      `,
      className: 'custom-cluster-icon',
      iconSize: [dimensions, dimensions]
    });
  };

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
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="text-sm font-semibold">Your Location</div>
            </Popup>
          </Marker>
        )}

        {/* Clustered launderette markers */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={60}
          iconCreateFunction={createClusterCustomIcon}
        >
          {launderettes.map((launderette) => (
            <Marker
              key={launderette.id}
              position={[launderette.lat, launderette.lng]}
              icon={launderette.isPremium ? premiumIcon : regularIcon}
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
