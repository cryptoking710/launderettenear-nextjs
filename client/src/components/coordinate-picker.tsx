import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Info } from 'lucide-react';

interface CoordinatePickerProps {
  lat: number;
  lng: number;
  onCoordinatesChange: (lat: number, lng: number) => void;
}

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapClickHandler({ onLocationClick }: { onLocationClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function CoordinatePicker({ lat, lng, onCoordinatesChange }: CoordinatePickerProps) {
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([lat, lng]);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (lat && lng) {
      setMarkerPosition([lat, lng]);
      if (mapRef.current) {
        mapRef.current.setView([lat, lng], 15);
      }
    }
  }, [lat, lng]);

  const handleMapClick = (clickedLat: number, clickedLng: number) => {
    setMarkerPosition([clickedLat, clickedLng]);
    onCoordinatesChange(clickedLat, clickedLng);
  };

  const handleMarkerDrag = (e: L.DragEndEvent) => {
    const marker = e.target as L.Marker;
    const position = marker.getLatLng();
    setMarkerPosition([position.lat, position.lng]);
    onCoordinatesChange(position.lat, position.lng);
  };

  // Only show map if we have valid coordinates
  const hasValidCoordinates = lat !== 0 && lng !== 0;

  if (!hasValidCoordinates) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Click "Find Coordinates" to automatically geocode the address, or enter coordinates manually to see the map.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>Click on the map or drag the marker to adjust the exact location</span>
      </div>
      
      <div className="h-[400px] rounded-md overflow-hidden border border-border">
        <MapContainer
          center={markerPosition}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
          data-testid="map-coordinate-picker"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationClick={handleMapClick} />
          <Marker
            position={markerPosition}
            draggable={true}
            eventHandlers={{
              dragend: handleMarkerDrag,
            }}
            data-testid="marker-coordinate-picker"
          />
        </MapContainer>
      </div>
      
      <div className="mt-3 text-sm text-muted-foreground">
        Current: {markerPosition[0].toFixed(6)}, {markerPosition[1].toFixed(6)}
      </div>
    </Card>
  );
}
