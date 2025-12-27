import { z } from 'zod';
import { insertEmergencyAlertSchema, emergencyAlerts } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  alerts: {
    create: {
      method: 'POST' as const,
      path: '/api/alerts',
      input: insertEmergencyAlertSchema,
      responses: {
        201: z.custom<typeof emergencyAlerts.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    listActive: {
      method: 'GET' as const,
      path: '/api/alerts/active',
      responses: {
        200: z.array(z.custom<typeof emergencyAlerts.$inferSelect>()),
      }
    },
    updateLocation: {
      method: 'PATCH' as const,
      path: '/api/alerts/:id/location',
      input: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      responses: {
        200: z.custom<typeof emergencyAlerts.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/alerts/:id/status',
      input: z.object({
        status: z.string(),
      }),
      responses: {
        200: z.custom<typeof emergencyAlerts.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
