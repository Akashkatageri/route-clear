import { useActiveAlerts, useUpdateAlertStatus } from "@/hooks/use-alerts";
import { Map } from "@/components/Map";
import { StatCard } from "@/components/StatCard";
import { Siren, Clock, MapPin, AlertTriangle, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrafficPolice() {
  const { data: alerts, isLoading } = useActiveAlerts();
  const updateStatus = useUpdateAlertStatus();

  const activeAlert = alerts && alerts.length > 0 ? alerts[0] : null;

  const handleClear = (id: number) => {
    updateStatus.mutate({ id, status: "completed" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-display">Traffic Control Center</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-muted-foreground">System Online</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 mt-4">
        
        {/* Status Banner */}
        {activeAlert ? (
          <div className="bg-red-600 text-white rounded-2xl p-6 md:p-8 shadow-2xl shadow-red-200 animate-pulse border-4 border-red-500/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                  <Siren className="w-12 h-12 blink-animate" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold font-display uppercase tracking-tight">Emergency Incoming</h2>
                  <p className="text-red-100 text-lg">Ambulance {activeAlert.ambulanceId} requires immediate route clearance</p>
                </div>
              </div>
              <Button 
                onClick={() => handleClear(activeAlert.id)}
                className="bg-white text-red-600 hover:bg-gray-100 font-bold text-lg px-8 py-6 rounded-xl shadow-lg w-full md:w-auto"
              >
                <Check className="w-5 h-5 mr-2" /> Mark Route Cleared
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-border">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">All Clear</h2>
            <p className="text-muted-foreground mt-2">No active emergency alerts at this time.</p>
          </div>
        )}

        {/* Dashboard Grid */}
        {activeAlert && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                icon={<Clock className="w-6 h-6" />}
                label="Estimated Arrival"
                value={`${activeAlert.eta} min`}
                highlight
              />
              <StatCard 
                icon={<MapPin className="w-6 h-6" />}
                label="Distance Away"
                value={`${activeAlert.distance.toFixed(1)} km`}
                highlight
              />
              <StatCard 
                icon={<AlertTriangle className="w-6 h-6" />}
                label="Priority Level"
                value="CRITICAL"
                highlight
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Info Panel */}
              <div className="md:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                  <h3 className="text-lg font-bold mb-4 font-display">Route Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Destination</label>
                      <p className="text-lg font-medium leading-tight mt-1">{activeAlert.destinationName}</p>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Vehicle ID</label>
                      <p className="text-lg font-mono font-medium mt-1">{activeAlert.ambulanceId}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-blue-800">
                  <h4 className="font-bold flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4" /> Action Required
                  </h4>
                  <p className="text-sm leading-relaxed">
                    Clear all intersections along the highlighted red route. Maintain green corridor until vehicle passes.
                  </p>
                </div>
              </div>

              {/* Map Panel */}
              <div className="md:col-span-2">
                <Map 
                  currentPos={[activeAlert.currentLat, activeAlert.currentLng]}
                  destinationPos={[activeAlert.destinationLat, activeAlert.destinationLng]}
                  routeGeometry={JSON.parse(activeAlert.routePolyline)}
                  interactive={false}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
