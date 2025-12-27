import { useState, useEffect } from "react";
import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from "@geoapify/react-geocoder-autocomplete";
import { useCreateAlert } from "@/hooks/use-alerts";
import { Map } from "@/components/Map";
import { Navigation2, Siren, CheckCircle, MapPin, Clock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const GEOAPIFY_KEY = "931662b2ab65485ca0b3e9e3dbabe064";

export default function AmbulanceDriver() {
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<any>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [isAlertActive, setIsAlertActive] = useState(false);
  
  const { toast } = useToast();
  const createAlert = useCreateAlert();

  // Simulate GPS location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentPos([pos.coords.latitude, pos.coords.longitude]),
        () => {
          // Fallback location (Mumbai)
          setCurrentPos([19.0760, 72.8777]);
          toast({
            title: "GPS Unavailable",
            description: "Using default location for prototype.",
            variant: "destructive",
          });
        }
      );
    }
  }, []);

  const handleDestinationSelect = (value: any) => {
    setDestination(value);
  };

  const getRoute = async () => {
    if (!currentPos || !destination) return;

    const startLat = currentPos[0];
    const startLng = currentPos[1];
    const endLat = destination.properties.lat;
    const endLng = destination.properties.lon;

    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLng}|${endLat},${endLng}&mode=drive&apiKey=${GEOAPIFY_KEY}`
      );
      const data = await res.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        setRouteData({
          geometry: feature.geometry.coordinates[0].map((c: any) => [c[1], c[0]]),
          distance: feature.properties.distance / 1000, // km
          time: Math.round(feature.properties.time / 60), // min
          fullGeometry: feature.geometry,
        });
        toast({ title: "Route calculated successfully" });
      }
    } catch (error) {
      toast({ title: "Failed to calculate route", variant: "destructive" });
    }
  };

  const sendEmergencyAlert = () => {
    if (!currentPos || !destination || !routeData) return;

    createAlert.mutate({
      ambulanceId: "TEMP-AMB-01",
      currentLat: currentPos[0],
      currentLng: currentPos[1],
      destinationName: destination.properties.formatted,
      destinationLat: destination.properties.lat,
      destinationLng: destination.properties.lon,
      routePolyline: JSON.stringify(routeData.geometry),
      eta: routeData.time,
      distance: routeData.distance,
      status: "active",
    }, {
      onSuccess: () => {
        setIsAlertActive(true);
        toast({
          title: "🚨 EMERGENCY ALERT SENT!",
          description: "Traffic police have been notified.",
          className: "bg-red-600 text-white border-none",
        });
      },
      onError: () => {
        toast({ title: "Failed to send alert", variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Siren className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-xl font-bold font-display">Ambulance Pilot</h1>
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold border border-blue-100">
            ID: TEMP-AMB-01
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-6 mt-4">
        
        {/* Active Alert Banner */}
        {isAlertActive && (
          <div className="bg-red-600 text-white p-6 rounded-2xl shadow-xl animate-pulse flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Siren className="w-10 h-10 blink-animate" />
              <div>
                <h2 className="text-2xl font-bold font-display">EMERGENCY ACTIVE</h2>
                <p className="opacity-90">Broadcasting live location to traffic control</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsAlertActive(false)} 
              variant="secondary"
              className="font-bold whitespace-nowrap"
            >
              Complete Trip
            </Button>
          </div>
        )}

        {/* Input Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Navigation2 className="w-4 h-4" /> Destination Hospital
            </label>
            <GeoapifyContext apiKey={GEOAPIFY_KEY}>
              <GeoapifyGeocoderAutocomplete
                placeholder="Search Hospitals in Bangalore..."
                placeSelect={handleDestinationSelect}
                filterByCountryCode={["in"]}
                type="amenity"
                filterByCircle={{
                  lat: 12.9716,
                  lon: 77.5946,
                  radius: 50000
                } as any}
                biasByLocation={{
                  lat: 12.9716,
                  lon: 77.5946
                } as any}
              />
            </GeoapifyContext>
          </div>

          <Button 
            onClick={getRoute} 
            disabled={!destination}
            className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            Calculate Route <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Route Details Card */}
        {routeData && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" /> <span className="text-sm font-medium">ETA</span>
              </div>
              <div className="text-2xl font-bold text-foreground font-display">{routeData.time} min</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" /> <span className="text-sm font-medium">Distance</span>
              </div>
              <div className="text-2xl font-bold text-foreground font-display">{routeData.distance.toFixed(1)} km</div>
            </div>
          </div>
        )}

        {/* Map */}
        <Map
          currentPos={currentPos}
          destinationPos={destination ? [destination.properties.lat, destination.properties.lon] : null}
          routeGeometry={routeData?.geometry}
        />

        {/* Action Button */}
        <Button
          onClick={sendEmergencyAlert}
          disabled={!routeData || isAlertActive || createAlert.isPending}
          className={`
            w-full h-20 text-2xl font-bold uppercase tracking-widest rounded-2xl shadow-xl transition-all
            ${isAlertActive 
              ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
              : 'bg-red-600 hover:bg-red-700 shadow-red-200 hover:scale-[1.02]'}
          `}
        >
          {createAlert.isPending ? "Sending..." : isAlertActive ? "Route Active" : "🚨 Start Emergency Route"}
        </Button>
      </div>
    </div>
  );
}
