import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertEmergencyAlert } from "@shared/routes";

export function useActiveAlerts() {
  return useQuery({
    queryKey: [api.alerts.listActive.path],
    queryFn: async () => {
      const res = await fetch(api.alerts.listActive.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch active alerts");
      return api.alerts.listActive.responses[200].parse(await res.json());
    },
    refetchInterval: 3000, // Poll every 3 seconds for police
  });
}

export function useCreateAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertEmergencyAlert) => {
      const res = await fetch(api.alerts.create.path, {
        method: api.alerts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.alerts.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to send emergency alert");
      }
      return api.alerts.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.alerts.listActive.path] }),
  });
}

export function useUpdateAlertStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const url = buildUrl(api.alerts.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.alerts.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update status");
      return api.alerts.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.alerts.listActive.path] }),
  });
}

export function useUpdateAlertLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, lat, lng }: { id: number; lat: number; lng: number }) => {
      const url = buildUrl(api.alerts.updateLocation.path, { id });
      const res = await fetch(url, {
        method: api.alerts.updateLocation.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update location");
      return api.alerts.updateLocation.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.alerts.listActive.path] }),
  });
}
