import { z, type RouteConfig } from "@hono/zod-openapi";
import { ErrorSchema } from "./schemas";

export const commonErrors: RouteConfig['responses'] = {
    400: {
        content: {
            "application/json": {
                schema: ErrorSchema
            }
        },
        description: "Validation errors"
    },
    401: {
        content: {
            "application/json": {
                schema: ErrorSchema
            }
        },
        description: "No API Key in request headers"
    },
    403: {
        content: {
            "application/json": {
                schema: ErrorSchema
            }
        },
        description: "Invalid API key or access to resource not allowed"
    },
    429: {
        content: {
            "application/json": {
                schema: ErrorSchema.extend({details: z.object({tryAgainIn: z.number().openapi({example: 86400000})})})
            }
        },
        description: "The API key has exceeded its usage limits"
    }
}