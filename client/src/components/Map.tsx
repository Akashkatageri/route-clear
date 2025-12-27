import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const ambulanceIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/color/48/ambulance--v1.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  className: "animate-pulse"
});

const hospitalIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/color/48/hospital-2.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

interface MapProps {
  currentPos: [number, number] | null;
  destinationPos: [number, number] | null;
  routeGeometry: [number, number][] | null;
  interactive?: boolean;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

function RouteFitter({ geometry }: { geometry: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (geometry && geometry.length > 0) {
      const bounds = L.latLngBounds(geometry);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [geometry, map]);
  return null;
}

export function Map({ currentPos, destinationPos, routeGeometry, interactive = true }: MapProps) {
  const center = currentPos || [20.5937, 78.9629]; // Default to India if no pos

  return (
    <div className="h-[400px] w-full relative z-0 rounded-xl overflow-hidden shadow-lg border-2 border-border">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={interactive}
        dragging={interactive}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {currentPos && (
          <>
            <Marker position={currentPos} icon={ambulanceIcon}>
              <Popup>Ambulance Location</Popup>
            </Marker>
            <MapUpdater center={currentPos} />
          </>
        )}

        {destinationPos && (
          <Marker position={destinationPos} icon={hospitalIcon}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {routeGeometry && (
          <>
            <Polyline positions={routeGeometry} color="#ef4444" weight={6} opacity={0.8} />
            <RouteFitter geometry={routeGeometry} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
